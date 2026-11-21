// "My voice": the learner's own recordings, replayed as they are. One recording says one sentence;
// nothing here can read new text in the learner's voice.
import { normalizeText } from './scoring.js';

const keys = (v) => (v ? [...new Set([v.sample, ...Object.values(v.clips)].filter(Boolean))] : []);

/** IndexedDB key of the learner's recording of exactly this sentence, or null. */
export const clipFor = (state, text) => state.myVoice?.clips[normalizeText(text)] || null;
export const clipCount = (state) => Object.keys(state.myVoice?.clips || {}).length;
/** The recorded sentences as practice lines, for shadowing the learner's own voice. */
export const voiceLines = (state) => Object.keys(state.myVoice?.clips || {}).map((k) => ({ t: k, ...state.myVoice.lines?.[k], type: 'sentence', own: true }));

/**
 * Add a recording (and/or rename). With `text` it becomes the recording for that sentence;
 * without, it becomes the preview sample. Returns the audio keys that are no longer used.
 */
export function addRecording(state, { name, audio = null, text = '', vi = '' }) {
  const v = (state.myVoice ||= { name: 'My voice', sample: null, clips: {} });
  const before = keys(v), k = normalizeText(text);
  if (name) v.name = name;
  if (audio) {
    if (k) { v.clips[k] = audio; (v.lines ||= {})[k] = { t: text.trim(), vi: vi || v.lines[k]?.vi || '' }; }
    if (!k || !v.sample) v.sample = audio;
  }
  const after = keys(v);
  return before.filter((x) => !after.includes(x));
}

/**
 * Add the voice pack shipped with the app (audio/my-voice/index.json) to "My voice", once per pack id.
 * `store(file)` saves one of its files and resolves to the audio key, or null. The learner's own recordings are
 * kept: the pack only fills in what is missing. Returns the audio keys that ended up unused.
 */
export async function addPack(state, pack, store) {
  if (!pack?.id || state.voicePack === pack.id) return [];
  const lines = pack.lines || [], files = [pack.sample, ...lines.map((l) => l.file)].filter(Boolean), keys = {}, used = [];
  for (const file of files) keys[file] = await store(file);
  if (files.some((file) => !keys[file])) return Object.values(keys).filter(Boolean); // a file failed: change nothing, try again on the next visit
  const add = (file, rec) => { used.push(keys[file]); addRecording(state, { ...rec, audio: keys[file] }); };
  if (!state.myVoice?.sample) add(pack.sample, { name: state.myVoice?.name || pack.name });
  for (const line of lines) if (!clipFor(state, line.t)) add(line.file, { text: line.t, vi: line.vi });
  state.voicePack = pack.id;
  state.settings.useMyVoice = true;
  return Object.values(keys).filter((k) => k && !used.includes(k));
}

/** Forget the voice. Returns its audio keys so the caller can delete the recordings. */
export function removeMyVoice(state) {
  const old = keys(state.myVoice);
  state.myVoice = null;
  state.settings.useMyVoice = false;
  return old;
}
