// Hash router and the app context shared by all views.
import { load, save } from './store.js';
import { speak, stopSpeaking, srSupported, onVoicesChanged } from './speech.js';
import { isMobile, stopAudio, playAudio } from './recorder.js';
import { loadAudio, saveAudio, deleteAudio } from './audiodb.js';
import { clipFor, addPack } from './myvoice.js';
import { openVoicePicker, showVoiceName, browserVoiceName } from './views/voicepicker.js';
import { $, $$, toast } from './ui.js';

const routes = {
  '': ['home', 'home'], welcome: ['onboarding', null], practice: ['practice', 'practice'],
  drill: ['lines', null], shadow: ['lines', null], talk: ['talk', 'talk'],
  free: ['free', null], deck: ['deck', 'deck'], voice: ['voice', null], me: ['profile', 'me'],
};

let sayTurn = 0, noted = false; // noted: the "no recording yet" message is shown once per screen

export const app = {
  state: load(),
  save() { save(app.state); },
  go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
  lang: () => app.state.profile?.accent || 'en-US',
  /** Play the model voice: the learner's own recording of this sentence when "My voice" is on (or `own` asks for it) and has one, else the browser voice. */
  async say(text, { slow = false, own = false } = {}) {
    const s = app.state.settings, turn = ++sayTurn;
    stopAudio();
    stopSpeaking();
    if ((s.useMyVoice || own) && app.state.myVoice && !slow) {
      const blob = await loadAudio(clipFor(app.state, text));
      if (turn !== sayTurn) return false;
      if (blob) { if (await playAudio(blob)) return true; } else if (!noted && !$('[data-voice-note]')) {
        noted = true;
        toast(`No recording of this sentence in ${app.state.myVoice.name} yet, so you hear ${browserVoiceName(app)}.`, 4000);
      }
      if (turn !== sayTurn) return false;
    }
    return speak(text, { accent: app.lang(), gender: s.gender, rate: slow ? 0.6 : s.rate, voiceName: s.voiceName });
  },
  /** Should attempts also be transcribed? Optional: recording and replay work without it. */
  transcribe() {
    const mode = app.state.settings.transcribe;
    return srSupported() && (mode === 'on' || (mode === 'auto' && !isMobile()));
  },
};

let cleanup = null;
async function render() {
  const [name = '', ...params] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (!app.state.profile && name !== 'welcome') return app.go('#/welcome');
  const [file, tab] = routes[name] || routes[''];
  cleanup?.();
  cleanup = null;
  sayTurn++;
  noted = false;
  stopSpeaking();
  stopAudio();
  $('.modal-x')?.click();
  const view = $('#view');
  const mod = await import(`./views/${file}.js`);
  const focus = tab == null || params.length > 0; // full-screen activity: no bottom nav
  view.className = focus ? 'focus' : '';
  $('#nav').hidden = focus;
  $$('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  document.body.classList.toggle('no-vi', !app.state.settings.showVi);
  view.innerHTML = '';
  cleanup = mod.default(view, app, params, name) || null;
  showVoiceName(app);
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => { const b = e.target.closest('[data-voice]'); if (b) openVoicePicker(app, b.dataset.voice === 'upload'); });
onVoicesChanged(() => showVoiceName(app));
window.addEventListener('hashchange', render);
render();

// A voice pack shipped with the app (audio/my-voice/) is added to "My voice" on the first visit.
(async () => {
  try {
    const dir = 'audio/my-voice/', res = await fetch(`${dir}index.json`);
    if (!res.ok) return;
    const store = async (file) => { try { const r = await fetch(dir + file); return r.ok ? await saveAudio(await r.blob()) : null; } catch { return null; } };
    const pack = await res.json();
    if (app.state.voicePack === pack.id) return;
    (await addPack(app.state, pack, store)).forEach(deleteAudio);
    app.save();
    if ($('#view').classList.contains('focus')) showVoiceName(app); else render();
  } catch { /* no pack, or offline: the browser voices still work */ }
})();
