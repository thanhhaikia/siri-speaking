// The record button used everywhere. Recording (MediaRecorder) is the primary input; transcription
// (SpeechRecognition) runs alongside only when enabled, and a typed answer covers "no microphone".
import { startRecording, tooQuiet } from '../recorder.js';
import { listen, srError } from '../speech.js';
import { $, $$, esc, vi } from '../ui.js';

const MIC = '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const STOP = '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>';
const BARS = 26;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {HTMLElement} host
 * @param {{maxSec?: number, autoStop?: boolean, onStart?: () => void, onTick?: (sec: number) => void,
 *   onResult: (r: {url: string|null, blob: Blob|null, stats: object|null, quiet: boolean, alternatives: string[]|null, typed: boolean, note: object|null}) => void}} opts
 *   alternatives is null when nothing was transcribed.
 */
export function speakBox(host, app, { maxSec = 12, autoStop = true, onStart, onTick, onResult }) {
  let phase = 'idle', recorder = null, sr = null, srDone = null, timer = null, ticker = null, levels = [], alive = true, t0 = 0;
  host.innerHTML = `<div class="speak">
    <div class="wave" hidden>${'<i></i>'.repeat(BARS)}</div>
    <p class="interim" aria-live="polite"></p>
    <button class="mic" type="button" aria-label="Record">${MIC}</button>
    <p class="mic-label"></p>
    <details class="typed"><summary>No microphone? Type instead${vi('Không có micro? Gõ câu trả lời')}</summary>
      <form><input type="text" autocomplete="off" autocapitalize="off" placeholder="Type what you would say" aria-label="Type what you would say"><button class="btn sm">OK</button></form>
    </details></div>`;
  const mic = $('.mic', host), label = $('.mic-label', host), wave = $('.wave', host), interim = $('.interim', host), bars = $$('.wave i', host);

  const show = () => {
    mic.classList.toggle('rec', phase === 'rec');
    mic.disabled = phase === 'busy';
    mic.innerHTML = phase === 'rec' ? STOP : MIC;
    wave.hidden = phase !== 'rec';
    label.innerHTML = phase === 'rec' ? `Listening… tap to stop${vi('Đang ghi âm… chạm để dừng')}` : phase === 'busy' ? 'One moment…' : `Tap to speak${vi('Chạm để nói')}`;
  };
  const drawLevel = (rms) => {
    levels.push(rms);
    const recent = levels.slice(-BARS);
    bars.forEach((b, i) => { b.style.height = `${4 + Math.min(40, (recent[i - (BARS - recent.length)] || 0) * 400)}px`; });
  };

  async function start() {
    if (phase !== 'idle') return;
    phase = 'busy'; show();
    interim.textContent = '';
    levels = [];
    let micError = null;
    try { recorder = await startRecording({ onLevel: drawLevel, onSilence: autoStop ? stop : null }); } catch (e) { recorder = null; micError = e; }
    if (!alive) { recorder?.stop(); return; }
    const wantText = app.transcribe();
    if (!recorder && !wantText) return noMic(micError);
    if (wantText) {
      sr = listen({ lang: app.lang(), continuous: !autoStop, maxSec, onInterim: (text) => { interim.textContent = text; } });
      srDone = sr.promise.then((ok) => ({ ok }), (err) => ({ err }));
      // A transcription error must not end a working recording: the learner stops it, or silence does.
      srDone.then((r) => { if (phase !== 'rec') return; if (r.err) { if (!recorder) fail(r.err); } else if (autoStop) stop(); });
    }
    phase = 'rec'; show();
    t0 = Date.now();
    onStart?.();
    timer = setTimeout(stop, maxSec * 1000);
    if (onTick) ticker = setInterval(() => onTick((Date.now() - t0) / 1000), 250);
  }

  async function stop() {
    if (phase !== 'rec') return;
    phase = 'busy'; show();
    clearTimeout(timer); clearInterval(ticker);
    sr?.stop();
    const audio = recorder ? await recorder.stop() : { blob: null, url: null, stats: null };
    const res = srDone ? await Promise.race([srDone, sleep(3000).then(() => ({ err: new Error('timeout') }))]) : null;
    recorder = sr = srDone = null;
    if (!alive) return;
    const alternatives = res?.ok?.alternatives?.length ? res.ok.alternatives : null;
    const quiet = !alternatives && (!audio.blob || tooQuiet(audio.stats));
    const note = res?.err && res.err.message !== 'timeout' ? srError(res.err) : null;
    phase = 'idle'; show();
    interim.textContent = '';
    onResult({ ...audio, quiet, alternatives, typed: false, note });
  }

  function fail(err) {
    clearTimeout(timer); clearInterval(ticker);
    recorder = sr = srDone = null;
    noMic(err);
  }
  function noMic(err) {
    phase = 'idle'; show();
    const msg = err?.name === 'NotAllowedError' || err?.message === 'not-allowed'
      ? ['The microphone is blocked. Allow it in the address bar, or type your answer below.', 'Micro đang bị chặn. Hãy cho phép micro trên thanh địa chỉ, hoặc gõ câu trả lời bên dưới.']
      : ['No microphone is available. Say it out loud, then type your answer below or tap Next.', 'Không dùng được micro. Hãy nói to, rồi gõ câu trả lời bên dưới hoặc bấm Next.'];
    interim.innerHTML = `${esc(msg[0])}${vi(msg[1])}`;
    $('.typed', host).open = true;
  }

  mic.addEventListener('click', () => (phase === 'rec' ? stop() : start()));
  $('form', host).addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', host), text = input.value.trim();
    if (!text || phase !== 'idle') return;
    input.value = '';
    interim.textContent = '';
    onResult({ blob: null, url: null, stats: null, quiet: false, alternatives: [text], typed: true, note: null });
  });
  show();

  return {
    destroy() {
      alive = false;
      clearTimeout(timer); clearInterval(ticker);
      sr?.stop();
      recorder?.stop();
    },
  };
}
