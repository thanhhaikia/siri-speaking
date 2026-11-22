// Every line the learner can save a take for, grouped the way the app shows them (the recording screen lists these).
import { LESSONS } from './content/lessons.js';
import { SCENARIOS } from './content/scenarios.js';
import { lineKey, learnerLines, takeFor } from './takes.js';

function build() {
  const seen = new Set();
  // A line that appears in two places has one take; it is listed in the first group that has it.
  const uniq = (rows) => rows.filter((r) => !seen.has(r.key) && seen.add(r.key));
  return [
    ...LESSONS.map((l) => ({ id: l.id, kind: 'Sound drills', title: l.title, titleVi: l.titleVi, rows: uniq(l.items.map(({ t, vi }) => ({ key: lineKey(t), text: t, vi }))) })),
    ...SCENARIOS.map((s) => ({
      id: s.id, kind: 'Conversations', title: s.title, titleVi: s.titleVi,
      rows: uniq(learnerLines(s).flatMap(({ key, turn }) => [
        { key, text: turn.say, prompt: `${s.partner}: ${turn.say}`, task: turn.task, sample: turn.replies[0] }, // the learner's answer to this prompt
        ...(turn.focus ? [{ key: lineKey(turn.focus.t), text: turn.focus.t }] : []), // the phrase repeated exactly
      ])),
    })),
  ].filter((g) => g.rows.length);
}

const GROUPS = build();
const KNOWN = new Set(GROUPS.flatMap((g) => g.rows.map((r) => r.key)));

export const scriptGroups = () => GROUPS;
/** How many of these lines have a saved take. */
export const recorded = (state, rows) => rows.filter((r) => takeFor(state, r.key)).length;
/** "Recorded: X / Y lines". */
export const scriptProgress = (state) => ({ done: GROUPS.reduce((n, g) => n + recorded(state, g.rows), 0), total: KNOWN.size });
/** The learner's own recordings that belong to no lesson line: their own sentences and uploads. */
export const ownTakes = (state) => Object.entries(state.takes || {}).filter(([k]) => !KNOWN.has(k) && (k.startsWith('line:') || k.startsWith('own:'))).map(([key, take]) => ({ key, take }));
/** The own sentences as practice lines, for shadowing. */
export const extraLines = (state) => ownTakes(state).filter(({ key }) => key.startsWith('line:')).map(({ key, take }) => ({ t: take.text || key.slice(5), vi: take.vi || '', key, type: 'sentence', own: true }));
/** Takes whose conversation line no longer exists (its text was rewritten), so nothing can play them. */
export const staleTakes = (state) => Object.keys(state.takes || {}).filter((k) => !KNOWN.has(k) && !k.startsWith('line:') && !k.startsWith('own:'));
