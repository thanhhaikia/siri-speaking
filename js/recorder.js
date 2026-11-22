// Voice capture with getUserMedia + MediaRecorder. This is the app's primary input: the learner can
// always replay their own voice, whether or not the browser can also transcribe it.

/** Summarise 50 ms loudness frames: how long the learner was audible, how loud, how many pauses. */
export function analyzeFrames(frames, frameSec = 0.05, minPauseSec = 0.35) {
  const peak = frames.reduce((m, f) => Math.max(m, f), 0);
  const threshold = Math.max(0.012, peak * 0.15);
  let first = -1, last = -1, voiced = 0;
  frames.forEach((f, i) => { if (f >= threshold) { voiced++; if (first < 0) first = i; last = i; } });
  let pauses = 0, run = 0;
  for (let i = Math.max(first, 0); i <= last; i++) {
    if (frames[i] < threshold) run++;
    else { if (run * frameSec >= minPauseSec) pauses++; run = 0; }
  }
  return { peak, voicedSec: +(voiced * frameSec).toFixed(2), totalSec: first < 0 ? 0 : +((last - first + 1) * frameSec).toFixed(2), pauses };
}

/** True when a recording holds too little audible speech to say anything useful about it. */
export const tooQuiet = (stats) => !stats || stats.peak < 0.02 || stats.voicedSec < 0.2;

export const recorderSupported = () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
export const isMobile = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/ogg;codecs=opus'];
/** The first recording format this browser can write: webm/Opus in Chrome and on Android, mp4/AAC in iPhone Safari. '' = browser default. */
export const recordingType = () => (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported ? TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || '' : '');

/**
 * Start recording. Rejects with the getUserMedia error when the microphone is unavailable.
 * @param {{onLevel?: (rms: number) => void, onSilence?: () => void, silenceSec?: number}} opts
 *   onSilence fires once when the learner has spoken and then stayed silent for silenceSec.
 * @returns {Promise<{stop(): Promise<{blob: Blob|null, stats: object}>}>}
 */
export async function startRecording({ onLevel, onSilence, silenceSec = 1.6 } = {}) {
  if (!recorderSupported()) throw new Error('unsupported');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const chunks = [];
  const mime = recordingType();
  const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  recorder.start();

  const frames = [];
  let ctx = null, timer = null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (Ctx) {
    try {
      ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let spoke = false, quiet = 0, fired = false;
      timer = setInterval(() => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        frames.push(rms);
        onLevel?.(rms);
        if (rms >= 0.02) { spoke = true; quiet = 0; } else if (spoke) quiet += 0.05;
        if (onSilence && !fired && spoke && quiet >= silenceSec) { fired = true; onSilence(); }
      }, 50);
    } catch { ctx = null; }
  }

  let stopped = null;
  return {
    stop() {
      stopped ||= new Promise((resolve) => {
        clearInterval(timer);
        const finish = () => {
          stream.getTracks().forEach((t) => t.stop());
          ctx?.close().catch(() => {});
          const blob = chunks.length ? new Blob(chunks, { type: recorder.mimeType || mime || 'audio/webm' }) : null;
          // Without Web Audio there are no loudness frames: assume the recording is usable.
          const stats = frames.length ? analyzeFrames(frames) : { peak: 1, voicedSec: 1, totalSec: 0, pauses: 0, unmeasured: true };
          resolve({ blob, stats });
        };
        if (recorder.state !== 'inactive') { recorder.onstop = finish; recorder.stop(); } else finish();
      });
      return stopped;
    },
  };
}

let player = null, playerUrl = null;
/** Stop playback and release the one object URL in use. */
export function stopAudio() {
  player?.pause();
  if (playerUrl) URL.revokeObjectURL(playerUrl);
  player = playerUrl = null;
}
/**
 * Play a recording. One thing plays at a time: the coach voice and any earlier recording are stopped first.
 * Resolves when playback ends (true) or fails (false); the object URL is released either way.
 */
export function playAudio(blob, rate = 1) {
  return new Promise((resolve) => {
    stopAudio();
    globalThis.speechSynthesis?.cancel();
    if (!blob) return resolve(false);
    const url = URL.createObjectURL(blob), audio = new Audio(url);
    const done = (ok) => { if (player === audio) stopAudio(); else URL.revokeObjectURL(url); resolve(ok); };
    player = audio;
    playerUrl = url;
    audio.preservesPitch = true;
    audio.playbackRate = rate;
    audio.onended = () => done(true);
    audio.onerror = () => done(false);
    audio.play().catch(() => done(false));
  });
}

/** Can this browser play the file? Resolves false for formats it cannot decode. */
export function canPlay(blob) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob), a = new Audio();
    const done = (ok) => { URL.revokeObjectURL(url); resolve(ok); };
    a.onloadedmetadata = () => done(true);
    a.onerror = () => done(false);
    a.src = url;
  });
}
