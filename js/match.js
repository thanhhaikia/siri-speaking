// What the app can honestly say about an attempt.
// A green word means "the browser heard the expected word" — it is not a grade of the learner's sounds.
import { compareText, normalizeTokens } from './scoring.js';
import { hintIds, HINTS } from './phonics.js';

export const LABELS = {
  heard: { en: 'Heard', vi: 'Máy nghe được đúng từ này' },
  different: { en: 'Heard differently', vi: 'Máy nghe thành từ khác' },
  unclear: { en: 'Unclear', vi: 'Máy không nghe rõ từ này' },
};
const STATUS = { correct: 'heard', close: 'different', wrong: 'different', missing: 'unclear' };

/**
 * Exact-repeat lines only: compare the target with every transcript the recogniser offered and keep the
 * closest one. Returns null when there is no transcript (transcription off, unsupported or failed).
 */
export function matchLine(target, alternatives) {
  const alts = (alternatives || []).filter((a) => a && a.trim());
  if (!alts.length) return null;
  let best = null, transcript = '';
  for (const alt of alts) {
    const c = compareText(target, alt);
    if (!best || c.accuracy > best.accuracy) { best = c; transcript = alt; }
  }
  const words = best.words.map((w) => ({ text: w.text, norm: w.norm, heard: w.heard, status: STATUS[w.status] }));
  const heard = words.filter((w) => w.status === 'heard').length;
  return { transcript, words, heard, total: words.length, pct: Math.round((heard / Math.max(1, words.length)) * 100) };
}

/** One thing to practise: the first word the browser did not hear as expected, with a likely reason. */
export function practiceTip(match) {
  const w = match?.words.find((x) => x.status !== 'heard');
  if (!w) return null;
  const tw = w.norm.split(' ').pop();
  const hw = (w.heard || '').split(' ').pop();
  const id = w.status === 'unclear' ? 'missing' : hintIds(tw, hw)[0] || 'generic';
  return { word: w.text, heard: w.heard || null, id, ...HINTS[id] };
}

const hasGroup = (tokens, group) => group.every((g) => {
  const p = normalizeTokens(g);
  for (let i = 0; i + p.length <= tokens.length; i++) if (p.every((t, k) => tokens[i + k] === t)) return true;
  return false;
});

/**
 * Soft keyword hints for a free answer in a conversation. The browser's transcript cannot judge meaning, so this
 * never says right or wrong: it only reports which of the turn's key words (each a list of words that go together)
 * the browser heard. Returns null when there is no transcript.
 */
export function keywordHints(keywords, alternatives) {
  const alts = (alternatives || []).filter((a) => a && a.trim());
  if (!alts.length) return null;
  let best = null;
  for (const alt of alts) {
    const tokens = normalizeTokens(alt);
    const heard = keywords.filter((group) => hasGroup(tokens, group)).map((group) => group.join(' '));
    if (!best || heard.length > best.heard.length) best = { transcript: alt, heard };
  }
  return { ...best, examples: keywords.slice(0, 2).map((group) => group.join(' ')) };
}
