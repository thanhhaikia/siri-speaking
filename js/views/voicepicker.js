// Model-voice picker: tap a voice to hear it; the choice is remembered and used for every Listen.
import { englishVoices, chooseVoice, speak, stopSpeaking } from '../speech.js';
import { stopAudio } from '../recorder.js';
import { $, $$, esc, vi, modal } from '../ui.js';

export const SAMPLE = 'Hello! A table for three, please.';
const GROUPS = [['en-US', 'American'], ['en-GB', 'British'], ['en-other', 'Other English']];
const GENDER = { female: 'Female', male: 'Male' };
const short = (name) => name.replace(/\s+-\s+English.*$/, '');

const current = (app) => chooseVoice(englishVoices(), app.lang(), app.state.settings.gender, app.state.settings.voiceName);

let repaint = null;

/** Show the voice in use in every [data-voice-name], and refresh an open picker (voices load late in Chrome). */
export function showVoiceName(app) {
  const v = current(app);
  $$('[data-voice-name]').forEach((el) => { el.textContent = v ? short(v.name) : 'Browser default'; });
  repaint?.();
}

export function openVoicePicker(app) {
  const { el } = modal(`<h2 style="margin-top:0">Model voice${vi('Chạm vào một giọng để nghe thử và dùng cho mọi bài.')}</h2>
    <div class="voices" data-list></div><div class="footer"><button class="btn" data-close>Done</button></div>`, () => { repaint = null; stopSpeaking(); });
  const paint = () => {
    const list = englishVoices(), on = current(app)?.name;
    $('[data-list]', el).innerHTML = list.length
      ? GROUPS.map(([accent, title]) => {
        const group = list.filter((v) => v.accent === accent);
        return group.length ? `<h3>${title}</h3><div class="choices">${group.map((v) => `<button type="button" class="choice ${v.name === on ? 'on' : ''}" data-name="${esc(v.name)}" aria-pressed="${v.name === on}">
          <span class="ic">${v.name === on ? '✓' : '▶'}</span><span><b>${esc(short(v.name))}</b><span class="muted small">${[GENDER[v.gender], v.lang].filter(Boolean).join(' · ')}</span></span></button>`).join('')}</div>` : '';
      }).join('')
      : `<div class="note warn">This browser has no English voices yet. Try Chrome or Edge, or add an English voice in your device settings.${vi('Trình duyệt này chưa có giọng tiếng Anh. Hãy thử Chrome hoặc Edge, hoặc cài thêm giọng tiếng Anh trong phần cài đặt của máy.')}</div>`;
    $$('[data-name]', el).forEach((b) => b.addEventListener('click', () => {
      const v = list.find((x) => x.name === b.dataset.name), s = app.state.settings;
      s.voiceName = v.name;
      // The transcript language follows a US or UK voice.
      if (app.state.profile && v.accent !== 'en-other') app.state.profile.accent = v.accent;
      app.save();
      showVoiceName(app);
      stopAudio();
      speak(SAMPLE, { voiceName: v.name, rate: s.rate });
    }));
  };
  repaint = paint;
  paint();
}
