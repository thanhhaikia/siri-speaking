// App state and persistence (localStorage). Views mutate the state through these helpers, then call app.save().
import { dayKey, addDays, bumpStreak } from './days.js';

const KEY = 'siri-speaking:v1';
const MAX_HISTORY = 200;

export const defaultState = () => ({
  v: 1,
  profile: null, // { name, focus: 'daily'|'work'|'both', accent: 'en-US'|'en-GB' }
  settings: { rate: 0.9, gender: 'female', voiceName: null, transcribe: 'auto', showVi: true },
  streak: { count: 0, last: null, best: 0 },
  done: {}, // day → { kind: count }  (kind: talk | drill | shadow | deck | voice | free)
  lessons: {}, // lesson id → { plays, best (% of words heard) | null, done }
  scenarios: {}, // scenario id → { days: [day…] }  — distinct days played, drives the daily twist
  deck: [], // retry deck: { id, en, vi, tip, audio (IndexedDB key) | null, added, due, wins }
  voice: null, // weekly voice comparison: { line, first: { day, audio }, history: [{ line, from, to }] }
  sounds: {}, // hint id → times the browser heard a word differently
  today: null, // { day, tasks: [{kind, id}] }
  history: [], // newest first: { t, day, kind, target, pct | null }
});

let storage = null;
try { storage = typeof localStorage !== 'undefined' ? localStorage : null; } catch { /* storage blocked: progress lasts for this visit only */ }
export const setStorage = (s) => { storage = s; };

export function load() {
  try {
    const s = JSON.parse(storage?.getItem(KEY) || 'null');
    if (!s || typeof s !== 'object') return defaultState();
    const d = defaultState();
    return { ...d, ...s, settings: { ...d.settings, ...s.settings }, streak: { ...d.streak, ...s.streak } };
  } catch { return defaultState(); }
}
export function save(state) { try { storage?.setItem(KEY, JSON.stringify(state)); } catch { /* quota or private mode */ } }
export function reset() { try { storage?.removeItem(KEY); } catch { /* ignore */ } }

/** Count one finished activity for today and keep the streak alive. */
export function markDone(state, kind, today = dayKey()) {
  state.done[today] ||= {};
  state.done[today][kind] = (state.done[today][kind] || 0) + 1;
  state.streak = bumpStreak(state.streak, today);
}
export const doneToday = (state, kind, today = dayKey()) => (state.done[today]?.[kind] || 0) > 0;

/** Log one attempt. pct = % of expected words the browser heard, or null when nothing was transcribed. */
export function logAttempt(state, kind, target, pct = null, today = dayKey()) {
  state.history.unshift({ t: Date.now(), day: today, kind, target: String(target).slice(0, 120), pct });
  state.history.length = Math.min(state.history.length, MAX_HISTORY);
  state.streak = bumpStreak(state.streak, today);
}
export const noteSound = (state, id) => { if (id && id !== 'missing' && id !== 'generic') state.sounds[id] = (state.sounds[id] || 0) + 1; };

export function finishLesson(state, id, pcts, today = dayKey()) {
  const xs = pcts.filter((p) => p != null);
  const avg = xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
  const prev = state.lessons[id] || { plays: 0, best: null };
  state.lessons[id] = { plays: prev.plays + 1, best: avg == null ? prev.best : Math.max(prev.best ?? 0, avg), done: true };
  markDone(state, 'drill', today);
  return avg;
}

/** How many earlier days this scenario was practised — picks today's version of the conversation. */
export const scenarioVisit = (state, id, today = dayKey()) => (state.scenarios[id]?.days || []).filter((d) => d !== today).length;
export function finishScenario(state, id, today = dayKey()) {
  const s = (state.scenarios[id] ||= { days: [] });
  if (!s.days.includes(today)) s.days.push(today);
  markDone(state, 'talk', today);
}

// ---- Retry deck ----
const GAPS = [1, 3, 7, 14];
export const inDeck = (state, en) => state.deck.some((c) => c.en === en);
/** One tap: save a difficult phrase. It comes back tomorrow, Vietnamese first. */
export function addToDeck(state, { en, vi, tip = '', audio = null }, today = dayKey()) {
  const old = state.deck.find((c) => c.en === en);
  if (old) { if (audio) old.audio = audio; return old; }
  const card = { id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), en, vi, tip, audio, added: today, due: addDays(today, 1), wins: 0 };
  state.deck.unshift(card);
  return card;
}
export function removeFromDeck(state, id) {
  const card = state.deck.find((c) => c.id === id);
  state.deck = state.deck.filter((c) => c.id !== id);
  return card;
}
export const dueCards = (state, today = dayKey()) => state.deck.filter((c) => c.due <= today);
/** After a retry: "got it" pushes the card further away (1, 3, 7, 14 days); otherwise it returns tomorrow. */
export function reviewCard(state, id, gotIt, today = dayKey()) {
  const card = state.deck.find((c) => c.id === id);
  if (!card) return null;
  card.wins = gotIt ? card.wins + 1 : 0;
  card.due = addDays(today, GAPS[Math.min(card.wins, GAPS.length - 1)]);
  return card;
}

// ---- Weekly voice comparison ----
export const VOICE_GAP_DAYS = 7;
export function voiceStatus(state, today = dayKey()) {
  const first = state.voice?.first;
  if (!first) return { stage: 'record', daysLeft: 0 };
  const due = addDays(first.day, VOICE_GAP_DAYS);
  if (today >= due) return { stage: 'compare', daysLeft: 0 };
  const [y, m, d] = due.split('-').map(Number), [ty, tm, td] = today.split('-').map(Number);
  return { stage: 'wait', daysLeft: Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 864e5) };
}
