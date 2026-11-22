// Coach-voice picker: tap a voice to hear it; the choice is remembered and used for every "Listen (Coach)".
// It lists the browser's voices only. The learner's own recordings are saved takes, managed on the recording screen.
import { englishVoices, chooseVoice, speak, stopSpeaking } from '../speech.js';
import { startRecording, tooQuiet, playAudio, stopAudio, canPlay } from '../recorder.js';
import * as audiodb from '../audiodb.js';
import { lineKey, keepTake } from '../takes.js';
import { dayKey } from '../days.js';
import { $, $$, esc, vi, modal, toast } from '../ui.js';

export const SAMPLE = 'Hello! A table for three, please.';
const GROUPS = [['en-US', 'American'], ['en-GB', 'British'], ['en-other', 'Other English']];
const GENDER = { female: 'Female', male: 'Male' };
const MAX_MB = 15, MAX_REC_SEC = 30;
const short = (name) => name.replace(/\s+-\s+English.*$/, '');

const current = (app) => chooseVoice(englishVoices(), app.lang(), app.state.settings.gender, app.state.settings.voiceName);

let repaint = null;

/** Show the coach voice in use in every [data-voice-name], and refresh an open picker (voices load late in Chrome). */
export function showVoiceName(app) {
  const v = current(app), name = v ? short(v.name) : 'Browser default';
  $$('[data-voice-name]').forEach((el) => { el.textContent = name; });
  repaint?.();
}

export function openVoicePicker(app) {
  const { el } = modal('<div data-body></div>', () => { repaint = null; stopSpeaking(); stopAudio(); });
  const body = $('[data-body]', el), { state } = app, s = state.settings;

  function list() {
    const voices = englishVoices(), on = current(app)?.name;
    body.innerHTML = `<h2 style="margin-top:0">Coach voice${vi('Giọng mẫu: chạm vào một giọng để nghe thử và dùng cho mọi bài.')}</h2><div class="voices">
      ${voices.length ? GROUPS.map(([accent, title]) => {
    const group = voices.filter((v) => v.accent === accent);
    return group.length ? `<h3>${title}</h3><div class="choices">${group.map((v) => `<button type="button" class="choice ${v.name === on ? 'on' : ''}" data-name="${esc(v.name)}" aria-pressed="${v.name === on}">
          <span class="ic">${v.name === on ? '✓' : '▶'}</span><span><b>${esc(short(v.name))}</b><span class="muted small">${[GENDER[v.gender], v.lang].filter(Boolean).join(' · ')}</span></span></button>`).join('')}</div>` : '';
  }).join('') : `<div class="note warn" style="margin-top:14px">This browser has no English voices yet. Try Chrome or Edge, or add an English voice in your device settings.${vi('Trình duyệt này chưa có giọng tiếng Anh. Hãy thử Chrome hoặc Edge, hoặc cài thêm giọng tiếng Anh trong phần cài đặt của máy.')}</div>`}
      <p class="muted small" style="margin-top:14px">Your own recordings are not listed here. They are your saved takes: <a href="#/myvoice">My saved takes</a>.${vi('Bản ghi âm của chính bạn không nằm trong danh sách này. Chúng là các câu bạn đã lưu, xem ở mục My saved takes.')}</p>
      </div><div class="footer"><button class="btn" data-close>Done</button></div>`;
    $$('[data-name]', body).forEach((b) => b.addEventListener('click', () => {
      const v = voices.find((x) => x.name === b.dataset.name);
      s.voiceName = v.name;
      // The transcript language follows a US or UK voice.
      if (state.profile && v.accent !== 'en-other') state.profile.accent = v.accent;
      app.save();
      showVoiceName(app);
      stopAudio();
      speak(SAMPLE, { voiceName: v.name, rate: s.rate });
    }));
  }

  repaint = list;
  list();
}

/**
 * "Upload a recording": add one of the learner's own recordings (a file, or recorded here) as a saved take.
 * With the sentence it says, it becomes the take for that sentence; without, it is kept as an upload of its own.
 */
export function openUpload(app, onDone) {
  let rec = null, blob = null, timer = null, sec = null;
  const { el, close } = modal('<div data-body></div>', () => { clearTimeout(timer); rec?.stop(); stopAudio(); });
  const body = $('[data-body]', el);
  body.innerHTML = `<h2 style="margin-top:0">Upload a recording${vi('Thêm bản ghi âm của chính bạn')}</h2>
    <div class="note">The app replays your recording exactly as it is. It cannot read other sentences in your voice.${vi('Ứng dụng phát lại đúng bản ghi âm của bạn. Ứng dụng không thể đọc câu khác bằng giọng của bạn.')}</div>
    <form>
      <label class="field">Audio file (mp3, wav, m4a)${vi('Tệp âm thanh')}<input type="file" name="file" accept="audio/*,.mp3,.wav,.m4a"></label>
      <div class="row"><span class="muted small">or</span><button type="button" class="btn sm ghost" data-rec>🎙 Record</button><button type="button" class="btn sm ghost" data-play hidden>▶ Preview</button></div>
      <p class="small" data-status aria-live="polite" style="margin-top:8px"></p>
      <label class="field">Sentence it says${vi('Câu trong bản ghi. Nếu là một câu trong bài học, bản ghi sẽ thành “My saved take” của câu đó.')}<input type="text" name="text" autocomplete="off" placeholder="A table for three, please."></label>
      <div class="footer"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn">Save</button></div>
    </form>`;
  const status = $('[data-status]', body), play = $('[data-play]', body), recBtn = $('[data-rec]', body), file = $('[name=file]', body);
  const take = (b, msg, s = null) => { blob = b; sec = s; play.hidden = !b; status.textContent = msg; };

  file.addEventListener('change', async () => {
    const f = file.files[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) { file.value = ''; return take(null, `That file is larger than ${MAX_MB} MB. Choose a shorter recording.`); }
    if (!(await canPlay(f))) { file.value = ''; return take(null, 'This browser cannot play that file. Try an mp3, wav or m4a file.'); }
    take(f, `${f.name} is ready.`);
  });
  const stopRec = async () => {
    clearTimeout(timer);
    const r = await rec?.stop();
    rec = null;
    recBtn.textContent = '🎙 Record again';
    if (!r?.blob || !r.blob.size || tooQuiet(r.stats)) return take(null, 'That was too quiet. Move closer to the microphone and record again.');
    file.value = '';
    take(r.blob, `Recorded ${Math.round(r.stats.totalSec) || 'a few'} seconds.`, Math.round(r.stats.totalSec) || null);
  };
  recBtn.addEventListener('click', async () => {
    if (rec) return stopRec();
    stopAudio();
    stopSpeaking();
    try { rec = await startRecording(); } catch { return take(blob, 'The microphone is not available. Allow it in the address bar, or upload a file.', sec); }
    if (!body.isConnected) { rec.stop(); return; }
    recBtn.textContent = '⏹ Stop';
    status.textContent = `Recording… speak now (up to ${MAX_REC_SEC} seconds).`;
    timer = setTimeout(stopRec, MAX_REC_SEC * 1000);
  });
  play.addEventListener('click', () => playAudio(blob));
  $('form', body).addEventListener('submit', async (e) => {
    e.preventDefault();
    if (rec) await stopRec();
    if (!blob) { status.textContent = 'Choose an audio file or record first.'; return; }
    const text = $('[name=text]', body).value.trim();
    const key = text ? lineKey(text) : `own:${Date.now().toString(36)}`;
    if (!(await keepTake(app.state, key, { blob, sec, day: dayKey(), text: text || file.files[0]?.name || 'My recording' }, audiodb))) { toast('This browser could not save the recording.'); return; }
    app.save();
    close();
    onDone?.();
  });
}
