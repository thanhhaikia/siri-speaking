// Android app only. The Android WebView has no speechSynthesis and no SpeechRecognition, so this file
// gives the web app the same two browser APIs on top of the phone's own text-to-speech and speech
// recognizer. The web app's code is unchanged; outside the Android app this file does nothing.
(() => {
  const cap = window.Capacitor;
  if (!cap?.isNativePlatform?.() || !window.capacitorExports) return;
  const { registerPlugin } = window.capacitorExports;
  const TTS = registerPlugin('TextToSpeech'), SR = registerPlugin('SpeechRecognition'), App = registerPlugin('App');
  const call = (fn) => { try { fn?.(); } catch { /* a page handler must not break the bridge */ } };

  // Hardware back: one screen back, or leave the app from the first screen.
  App.addListener('backButton', ({ canGoBack }) => (canGoBack ? window.history.back() : App.exitApp()));

  // --- coach voice: window.speechSynthesis ---
  class Utterance {
    constructor(text = '') { this.text = text; this.lang = ''; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; }
  }
  class Synth extends EventTarget {
    #voices = []; #current = null;
    constructor() { super(); this.speaking = false; this.pending = false; this.paused = false; this.load(); }
    async load() {
      try {
        // `index` is the plugin's own number for the voice. Phones give many voices the same name, and the
        // app remembers a voice by name, so repeats are numbered: "English United States 2".
        const all = (await TTS.getSupportedVoices()).voices.map((v, index) => ({ ...v, index, lang: (v.lang || '').replace('_', '-') }));
        const offline = all.filter((v) => v.localService);
        const seen = {};
        this.#voices = (offline.length ? offline : all).map((v) => {
          const base = v.name || v.voiceURI, n = (seen[base] = (seen[base] || 0) + 1);
          return { ...v, name: n > 1 ? `${base} ${n}` : base };
        });
      } catch { this.#voices = []; }
      this.dispatchEvent(new Event('voiceschanged'));
    }
    getVoices() { return this.#voices; }
    speak(u) {
      const mine = (this.#current = {});
      const done = (ok) => { if (this.#current === mine) { this.#current = null; this.speaking = false; } call(ok ? u.onend : u.onerror); };
      this.speaking = true;
      const voice = u.voice && this.#voices.includes(u.voice) ? u.voice.index : undefined;
      TTS.speak({ text: String(u.text), lang: u.voice?.lang || u.lang || 'en-US', rate: u.rate || 1, pitch: u.pitch || 1, volume: u.volume ?? 1, ...(voice == null ? {} : { voice }) })
        .then(() => done(true), () => done(false));
    }
    cancel() { if (!this.speaking) return; this.#current = null; this.speaking = false; TTS.stop().catch(() => {}); }
    pause() {}
    resume() {}
  }
  Object.defineProperty(window, 'speechSynthesis', { value: new Synth(), configurable: true });
  window.SpeechSynthesisUtterance = Utterance;

  // --- word matching: window.SpeechRecognition ---
  // Final results only (no live text while speaking): in the plugin's live mode a recognizer error never reaches the page.
  const ERRORS = [[/permission/i, 'not-allowed'], [/network|server/i, 'network'], [/audio|busy/i, 'audio-capture'], [/no match|no speech|understand/i, 'no-speech'], [/client/i, 'aborted']];
  let active = null;
  SR.addListener('listeningState', ({ status }) => { if (status === 'started') call(() => active?.onspeechstart?.()); });

  class Recognition {
    #segments = []; #stopped = false; #ended = false;
    constructor() { this.lang = 'en-US'; this.continuous = false; this.interimResults = false; this.maxAlternatives = 1; }
    #finish(error) {
      if (this.#ended) return;
      this.#ended = true;
      if (active === this) active = null;
      const results = this.#segments.map((m) => Object.assign(m.map((transcript) => ({ transcript, confidence: 0 })), { isFinal: true }));
      if (results.length) call(() => this.onresult?.({ resultIndex: 0, results }));
      else if (error) call(() => this.onerror?.({ error }));
      call(() => this.onend?.());
    }
    async #listen() {
      let matches;
      try {
        ({ matches } = await SR.start({ language: this.lang, maxResults: Math.max(1, this.maxAlternatives), partialResults: false, popup: false }));
      } catch (e) {
        return this.#finish(ERRORS.find(([re]) => re.test(e?.message || ''))?.[1] || 'service-not-allowed');
      }
      if (matches?.length) this.#segments.push(matches);
      if (this.continuous && !this.#stopped) return this.#listen(); // the phone stops at each pause: keep going
      this.#finish();
    }
    async start() {
      try {
        if (!(await SR.available()).available) return this.#finish('service-not-allowed');
        let perm = (await SR.checkPermissions()).speechRecognition;
        if (perm !== 'granted') perm = (await SR.requestPermissions()).speechRecognition;
        if (perm !== 'granted') return this.#finish('not-allowed');
      } catch { return this.#finish('service-not-allowed'); }
      if (this.#stopped) return this.#finish();
      active = this;
      call(() => this.onstart?.());
      this.#listen();
    }
    stop() {
      if (this.#stopped || this.#ended) return;
      this.#stopped = true;
      if (active !== this) return; // still asking for permission: start() ends it
      SR.stop().catch(() => {});
      setTimeout(() => this.#finish(), 4000); // in case the phone never answers
    }
    abort() { this.stop(); }
  }
  window.SpeechRecognition = window.webkitSpeechRecognition = Recognition;
})();
