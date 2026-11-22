// Hash router and the app context shared by all views.
import { load, save } from './store.js';
import { speak, stopSpeaking, srSupported, onVoicesChanged } from './speech.js';
import { isMobile, stopAudio } from './recorder.js';
import { saveAudio, deleteAudio } from './audiodb.js';
import { addPack } from './takes.js';
import { openVoicePicker, showVoiceName } from './views/voicepicker.js';
import { $, $$, toast } from './ui.js';

const routes = {
  '': ['home', 'home'], welcome: ['onboarding', null], practice: ['practice', 'practice'],
  drill: ['lines', null], shadow: ['lines', null], talk: ['talk', 'talk'],
  free: ['free', null], deck: ['deck', 'deck'], voice: ['voice', null], myvoice: ['myvoice', null], me: ['profile', 'me'],
};

export const app = {
  state: load(),
  save() { save(app.state); },
  go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
  lang: () => app.state.profile?.accent || 'en-US',
  /** "Listen (Coach)": always the chosen coach voice, at the chosen speed. It never plays one of the learner's recordings. */
  say(text, { slow = false } = {}) {
    const s = app.state.settings;
    stopAudio();
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

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-voice]')) return openVoicePicker(app);
  // "Practice without word matching": offered when the browser's transcription failed. Recording and replay go on without it.
  const off = e.target.closest('[data-nomatch]');
  if (off) { app.state.settings.transcribe = 'off'; app.save(); off.disabled = true; toast('Word matching is off. Recording and replay still work. Turn it back on in Profile.', 4000); }
});
onVoicesChanged(() => showVoiceName(app));
window.addEventListener('hashchange', render);
render();

// Recordings shipped with the app (audio/my-voice/) are added to the learner's saved takes on the first visit.
(async () => {
  try {
    const dir = 'audio/my-voice/', res = await fetch(`${dir}index.json`);
    if (!res.ok) return;
    const store = async (file) => { try { const r = await fetch(dir + file); return r.ok ? await saveAudio(await r.blob()) : null; } catch { return null; } };
    const pack = await res.json();
    if (app.state.voicePack === pack.id) return;
    (await addPack(app.state, pack, store)).forEach(deleteAudio);
    app.save();
    if (!$('#view').classList.contains('focus')) render();
  } catch { /* no pack, or offline: nothing else depends on it */ }
})();
