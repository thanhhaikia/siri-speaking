// Every line the model voice can say, grouped the way the app shows them, so the learner can record them in their own voice.
import { LESSONS } from './content/lessons.js';
import { SCENARIOS } from './content/scenarios.js';
import { VOICE_LINES } from './content/voicelines.js';
import { VOCAB } from './content/vocab.js';
import { normalizeText } from './scoring.js';
import { clipFor, voiceLines } from './myvoice.js';

function build() {
  const seen = new Set();
  // A line that appears in two places is recorded once, in the first group that has it.
  const uniq = (items) => items.filter(({ t }) => { const k = normalizeText(t); return k && !seen.has(k) && seen.add(k); });
  const turnLines = (t) => [{ t: t.say, vi: t.vi }, ...t.replies.map((r) => ({ t: r, vi: '' })), { t: t.focus.t, vi: '' }];
  return [
    ...LESSONS.map((l) => ({ id: l.id, kind: 'Sound drills', title: l.title, titleVi: l.titleVi, items: uniq(l.items.map(({ t, vi }) => ({ t, vi }))) })),
    ...SCENARIOS.map((s) => ({ id: s.id, kind: 'Conversations', title: s.title, titleVi: s.titleVi, items: uniq([...s.turns, ...s.twists.map((x) => x.turn)].flatMap(turnLines)) })),
    { id: 'voice-check', kind: 'More', title: 'Weekly voice check', titleVi: 'So sánh giọng hằng tuần', items: uniq(VOICE_LINES.map(({ t, vi }) => ({ t, vi }))) },
    { id: 'phrases', kind: 'More', title: 'Useful phrases', titleVi: 'Gợi ý câu hữu ích', items: uniq(VOCAB.map((v) => ({ t: v.ex, vi: v.exVi }))) },
  ].filter((g) => g.items.length);
}
const GROUPS = build();
const KNOWN = new Set(GROUPS.flatMap((g) => g.items.map((it) => normalizeText(it.t))));

export const scriptGroups = () => GROUPS;
/** How many of these lines the learner has recorded. */
export const recorded = (state, items) => items.filter((it) => clipFor(state, it.t)).length;
export const scriptProgress = (state) => ({ done: GROUPS.reduce((n, g) => n + recorded(state, g.items), 0), total: KNOWN.size });
/** The learner's recordings of sentences that are not in any lesson: their own shadowing set. */
export const extraLines = (state) => voiceLines(state).filter((l) => !KNOWN.has(normalizeText(l.t)));
