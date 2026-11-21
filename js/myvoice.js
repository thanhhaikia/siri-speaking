// "My voice": the learner's own recordings, replayed as they are. One recording says one sentence;
// nothing here can read new text in the learner's voice.
import { normalizeText } from './scoring.js';

const keys = (v) => (v ? [...new Set([v.sample, ...Object.values(v.clips)].filter(Boolean))] : []);

/** IndexedDB key of the learner's recording of exactly this sentence, or null. */
export const clipFor = (state, text) => state.myVoice?.clips[normalizeText(text)] || null;
export const clipCount = (state) => Object.keys(state.myVoice?.clips || {}).length;

/**
 * Add a recording (and/or rename). With `text` it becomes the recording for that sentence;
 * without, it becomes the preview sample. Returns the audio keys that are no longer used.
 */
export function addRecording(state, { name, audio = null, text = '' }) {
  const v = (state.myVoice ||= { name: 'My voice', sample: null, clips: {} });
  const before = keys(v), k = normalizeText(text);
  if (name) v.name = name;
  if (audio) {
    if (k) v.clips[k] = audio;
    if (!k || !v.sample) v.sample = audio;
  }
  const after = keys(v);
  return before.filter((x) => !after.includes(x));
}

/** Forget the voice. Returns its audio keys so the caller can delete the recordings. */
export function removeMyVoice(state) {
  const old = keys(state.myVoice);
  state.myVoice = null;
  state.settings.useMyVoice = false;
  return old;
}
