// Model-voice picker: tap a voice to hear it; the choice is remembered and used for every Listen.
// Besides the browser's voices the learner can add "My voice": their own recordings, replayed as they are.
import { englishVoices, chooseVoice, speak, stopSpeaking } from '../speech.js';
import { startRecording, tooQuiet, playAudio, stopAudio, canPlay } from '../recorder.js';
import { saveAudio, loadAudio, deleteAudio } from '../audiodb.js';
import { addRecording, removeMyVoice, clipCount } from '../myvoice.js';
import { $, $$, esc, vi, modal, toast } from '../ui.js';

export const SAMPLE = 'Hello! A table for three, please.';
const GROUPS = [['en-US', 'American'], ['en-GB', 'British'], ['en-other', 'Other English']];
const GENDER = { female: 'Female', male: 'Male' };
const MAX_MB = 15, MAX_REC_SEC = 30;
const short = (name) => name.replace(/\s+-\s+English.*$/, '');

const current = (app) => chooseVoice(englishVoices(), app.lang(), app.state.settings.gender, app.state.settings.voiceName);
const mine = (app) => (app.state.settings.useMyVoice ? app.state.myVoice : null);
/** The browser voice in use (also the fallback for sentences "My voice" has no recording of). */
export const browserVoiceName = (app) => { const v = current(app); return v ? short(v.name) : 'the browser voice'; };

let repaint = null;

/** Show the voice in use in every [data-voice-name], and refresh an open picker (voices load late in Chrome). */
export function showVoiceName(app) {
  const name = mine(app)?.name || (current(app) ? browserVoiceName(app) : 'Browser default');
  $$('[data-voice-name]').forEach((el) => { el.textContent = name; });
  document.dispatchEvent(new Event('voicechange'));
  repaint?.();
}

export function openVoicePicker(app, upload = false) {
  let rec = null;
  const { el } = modal('<div data-body></div>', () => { repaint = null; rec?.stop(); stopSpeaking(); stopAudio(); });
  const body = $('[data-body]', el), { state } = app, s = state.settings;

  function list() {
    const voices = englishVoices(), on = mine(app) ? null : current(app)?.name, my = state.myVoice, n = clipCount(state);
    body.innerHTML = `<h2 style="margin-top:0">Model voice${vi('Chạm vào một giọng để nghe thử và dùng cho mọi bài.')}</h2><div class="voices">
      <h3>Your own voice</h3>
      ${my ? `<div class="choices"><button type="button" class="choice ${mine(app) ? 'on' : ''}" data-mine aria-pressed="${!!mine(app)}"><span class="ic">${mine(app) ? '✓' : '▶'}</span><span><b>${esc(my.name)}</b><span class="muted small">Your recordings · ${n} sentence${n === 1 ? '' : 's'}</span></span></button></div>
        <p class="row" style="margin-top:8px"><button type="button" class="btn sm ghost" data-upload>＋ Add a recording / rename</button><button type="button" class="btn sm plain" data-remove>Delete</button></p>`
    : '<button type="button" class="btn sm ghost" data-upload>⬆ Upload my voice</button>'}
      <p class="muted small" style="margin-top:8px">Plays your recordings as they are. It cannot read new sentences in your voice.${vi('Chỉ phát lại đúng bản ghi âm của bạn. Không thể đọc câu mới bằng giọng của bạn.')}</p>
      ${voices.length ? GROUPS.map(([accent, title]) => {
    const group = voices.filter((v) => v.accent === accent);
    return group.length ? `<h3>${title}</h3><div class="choices">${group.map((v) => `<button type="button" class="choice ${v.name === on ? 'on' : ''}" data-name="${esc(v.name)}" aria-pressed="${v.name === on}">
          <span class="ic">${v.name === on ? '✓' : '▶'}</span><span><b>${esc(short(v.name))}</b><span class="muted small">${[GENDER[v.gender], v.lang].filter(Boolean).join(' · ')}</span></span></button>`).join('')}</div>` : '';
  }).join('') : `<div class="note warn" style="margin-top:14px">This browser has no English voices yet. Try Chrome or Edge, or add an English voice in your device settings.${vi('Trình duyệt này chưa có giọng tiếng Anh. Hãy thử Chrome hoặc Edge, hoặc cài thêm giọng tiếng Anh trong phần cài đặt của máy.')}</div>`}
      </div><div class="footer"><button class="btn" data-close>Done</button></div>`;
    $$('[data-name]', body).forEach((b) => b.addEventListener('click', () => {
      const v = voices.find((x) => x.name === b.dataset.name);
      s.voiceName = v.name;
      s.useMyVoice = false;
      // The transcript language follows a US or UK voice.
      if (state.profile && v.accent !== 'en-other') state.profile.accent = v.accent;
      app.save();
      showVoiceName(app);
      stopAudio();
      speak(SAMPLE, { voiceName: v.name, rate: s.rate });
    }));
    $('[data-mine]', body)?.addEventListener('click', async () => {
      s.useMyVoice = true;
      app.save();
      showVoiceName(app);
      stopSpeaking();
      playAudio(await loadAudio(my.sample));
    });
    $('[data-upload]', body).addEventListener('click', form);
    $('[data-remove]', body)?.addEventListener('click', () => {
      if (!confirm(`Delete ${my.name} and its recordings from this device?`)) return;
      removeMyVoice(state).forEach(deleteAudio);
      app.save();
      showVoiceName(app);
    });
  }

  function form() {
    repaint = null;
    stopSpeaking();
    const my = state.myVoice;
    let blob = null;
    body.innerHTML = `<h2 style="margin-top:0">${my ? 'Add a recording' : 'Upload my voice'}${vi('Dùng bản ghi âm của chính bạn làm giọng mẫu')}</h2>
      <div class="note">The app replays your recording exactly as it is. It cannot read other sentences in your voice.${vi('Ứng dụng phát lại đúng bản ghi âm của bạn. Ứng dụng không thể đọc câu khác bằng giọng của bạn.')}</div>
      <form>
        <label class="field">Name${vi('Tên giọng')}<input type="text" name="name" maxlength="24" value="${esc(my?.name || 'My voice')}"></label>
        <label class="field">Audio file (mp3, wav, m4a)${vi('Tệp âm thanh')}<input type="file" name="file" accept="audio/*,.mp3,.wav,.m4a"></label>
        <div class="row"><span class="muted small">or</span><button type="button" class="btn sm ghost" data-rec>🎙 Record a sample</button><button type="button" class="btn sm ghost" data-play hidden>▶ Preview</button></div>
        <p class="small" data-status aria-live="polite" style="margin-top:8px"></p>
        <label class="field">Sentence it says (optional)${vi('Câu trong bản ghi (không bắt buộc). Nếu điền, nút Listen sẽ phát bản ghi này cho đúng câu đó.')}<input type="text" name="text" autocomplete="off" placeholder="A table for three, please."></label>
        <div class="footer"><button type="button" class="btn ghost" data-back>Back</button><button class="btn">Save</button></div>
      </form>`;
    const status = $('[data-status]', body), play = $('[data-play]', body), recBtn = $('[data-rec]', body), file = $('[name=file]', body);
    const take = (b, msg) => { blob = b; play.hidden = !b; status.textContent = msg; };
    const back = () => { rec?.stop(); rec = null; stopAudio(); repaint = list; list(); };

    file.addEventListener('change', async () => {
      const f = file.files[0];
      if (!f) return;
      if (f.size > MAX_MB * 1024 * 1024) { file.value = ''; return take(null, `That file is larger than ${MAX_MB} MB. Choose a shorter recording.`); }
      if (!(await canPlay(f))) { file.value = ''; return take(null, 'This browser cannot play that file. Try an mp3, wav or m4a file.'); }
      take(f, `${f.name} is ready.`);
    });
    let timer = null;
    const stopRec = async () => {
      clearTimeout(timer);
      const r = await rec?.stop();
      rec = null;
      recBtn.textContent = '🎙 Record again';
      if (!r?.blob || tooQuiet(r.stats)) return take(null, 'That was too quiet. Move closer to the microphone and record again.');
      file.value = '';
      take(r.blob, `Recorded ${Math.round(r.stats.totalSec) || 'a few'} seconds.`);
    };
    recBtn.addEventListener('click', async () => {
      if (rec) return stopRec();
      stopAudio();
      try { rec = await startRecording(); } catch { return take(blob, 'The microphone is not available. Allow it in the address bar, or upload a file.'); }
      if (!body.isConnected) { rec.stop(); return; }
      recBtn.textContent = '⏹ Stop';
      status.textContent = `Recording… speak now (up to ${MAX_REC_SEC} seconds).`;
      timer = setTimeout(stopRec, MAX_REC_SEC * 1000);
    });
    play.addEventListener('click', () => playAudio(blob));
    $('[data-back]', body).addEventListener('click', back);
    $('form', body).addEventListener('submit', async (e) => {
      e.preventDefault();
      if (rec) await stopRec();
      const text = $('[name=text]', body).value;
      if (!blob && (!my || text.trim())) { status.textContent = 'Choose an audio file or record a sample first.'; return; }
      const audio = await saveAudio(blob);
      if (blob && !audio) { toast('This browser could not save the recording.'); return; }
      addRecording(state, { name: $('[name=name]', body).value.trim() || 'My voice', audio, text }).forEach(deleteAudio);
      if (!my) s.useMyVoice = true;
      app.save();
      back();
      showVoiceName(app);
    });
  }

  repaint = list;
  if (upload) form(); else list();
}
