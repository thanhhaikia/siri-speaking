// Hash router and the app context shared by all views.
import { load, save } from './store.js';
import { speak, stopSpeaking, srSupported } from './speech.js';
import { isMobile, stopAudio } from './recorder.js';
import { $, $$ } from './ui.js';

const routes = {
  '': ['home', 'home'], welcome: ['onboarding', null], practice: ['practice', 'practice'],
  drill: ['lines', null], shadow: ['lines', null], talk: ['talk', 'talk'],
  free: ['free', null], deck: ['deck', 'deck'], voice: ['voice', null], me: ['profile', 'me'],
};

export const app = {
  state: load(),
  save() { save(app.state); },
  go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
  lang: () => app.state.profile?.accent || 'en-US',
  /** Play the model voice. */
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
  const view = $('#view');
  const mod = await import(`./views/${file}.js`);
  const focus = tab == null || params.length > 0; // full-screen activity: no bottom nav
  view.className = focus ? 'focus' : '';
  $('#nav').hidden = focus;
  $$('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  document.body.classList.toggle('no-vi', !app.state.settings.showVi);
  view.innerHTML = '';
  cleanup = mod.default(view, app, params, name) || null;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
