// "My saved takes": the learner's own recordings, one per line, replayed as they are.
// They are separate from the coach voice: "Listen (Coach)" never plays a take, and a line without a take says so.
// A take's key comes from the text of its line, so a rewritten line gets a new key and never plays an old recording.
import { normalizeText } from './scoring.js';

/** Key of an exact-repeat line (a drill item, a focus phrase, one of the learner's own sentences). */
export const lineKey = (text) => `line:${normalizeText(text)}`;
/** Key of the learner's answer to one partner prompt in a conversation. */
export const replyKey = (scenarioId, turn) => `${scenarioId}:${normalizeText(turn.say)}`;
/** Every prompt the learner answers in a scenario: the four turns, each daily change, and the final open question. */
export const learnerLines = (scenario) => [...scenario.turns, ...scenario.twists.map((x) => x.turn), scenario.final]
  .map((turn) => ({ key: replyKey(scenario.id, turn), turn }));

export const takeFor = (state, key) => state.takes?.[key] || null;

/** Save or replace a take. Returns the audio key that is no longer used, or null. */
export function setTake(state, key, take) {
  const old = takeFor(state, key)?.audio || null;
  (state.takes ||= {})[key] = take;
  return old === take.audio ? null : old;
}
/** Forget a take. Returns its audio key so the caller can delete the recording. */
export function removeTake(state, key) {
  const old = takeFor(state, key)?.audio || null;
  if (state.takes) delete state.takes[key];
  return old;
}

/**
 * Store a new take for a line: { blob, sec, day, text } where text is a snapshot of the line it was recorded for.
 * The recording is written and read back before the old take is dropped, so a failed save or an empty recording
 * leaves the previous take in place. `db` is the audio store ({ saveAudio, loadAudio, deleteAudio }).
 * Resolves to true when the new take is saved.
 */
export async function keepTake(state, key, { blob, sec, day, text = '', vi = '' }, db) {
  if (!blob || blob.size === 0) return false;
  const audio = await db.saveAudio(blob, undefined, { text });
  if (!audio) return false;
  if (!(await db.loadAudio(audio))) { await db.deleteAudio(audio); return false; }
  const old = setTake(state, key, { audio, sec, day, text, mime: blob.type || '', ...(vi ? { vi } : {}) });
  if (old) await db.deleteAudio(old);
  return true;
}

/** Every recording the saved state still points to (takes, retry deck, weekly voice check). */
export function usedAudio(state) {
  const keys = new Set();
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    for (const [k, x] of Object.entries(v)) { if (k === 'audio' && typeof x === 'string') keys.add(x); else walk(x); }
  };
  walk(state);
  return keys;
}

/**
 * Earlier versions kept the learner's recordings as a selectable "My voice". They become saved takes:
 * each recorded sentence a take for that sentence, the uploaded sample a take of its own. Nothing is dropped.
 */
export function migrateMyVoice(state) {
  const v = state.myVoice;
  if (v) {
    state.takes ||= {};
    for (const [k, audio] of Object.entries(v.clips || {})) {
      if (audio && !state.takes[`line:${k}`]) state.takes[`line:${k}`] = { audio, sec: null, day: null, text: v.lines?.[k]?.t || k, ...(v.lines?.[k]?.vi ? { vi: v.lines[k].vi } : {}) };
    }
    if (v.sample && !Object.values(state.takes).some((t) => t.audio === v.sample)) state.takes['own:sample'] = { audio: v.sample, sec: null, day: null, text: v.name || 'My uploaded recording' };
  }
  delete state.myVoice;
  if (state.settings) delete state.settings.useMyVoice;
  return state;
}

/**
 * Add the recordings shipped with the app (audio/my-voice/index.json) as saved takes, once per pack id.
 * `store(file)` saves one of its files and resolves to the audio key, or null. Takes the learner already has are
 * kept: the pack only fills in what is missing. Returns the audio keys that ended up unused.
 */
export async function addPack(state, pack, store) {
  if (!pack?.id || state.voicePack === pack.id) return [];
  const lines = pack.lines || [], files = [pack.sample, ...lines.map((l) => l.file)].filter(Boolean), keys = {}, used = [];
  for (const file of files) keys[file] = await store(file);
  if (files.some((file) => !keys[file])) return Object.values(keys).filter(Boolean); // a file failed: change nothing, try again on the next visit
  const put = (key, file, text, vi) => {
    if (!file || takeFor(state, key)) return;
    used.push(keys[file]);
    setTake(state, key, { audio: keys[file], sec: null, day: null, text, ...(vi ? { vi } : {}) });
  };
  put('own:sample', pack.sample, pack.name || 'My uploaded recording');
  for (const line of lines) put(lineKey(line.t), line.file, line.t, line.vi);
  state.voicePack = pack.id;
  return Object.values(keys).filter((k) => k && !used.includes(k));
}
