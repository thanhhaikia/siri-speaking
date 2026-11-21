// Builds today's version of a scripted conversation and its practice steps.
import { SCENARIOS } from './content/scenarios.js';

/** Versions of a scenario: the base dialogue plus one per twist. */
export const versionCount = (scenario) => scenario.twists.length + 1;

/**
 * The dialogue for the learner's nth visit (0 = first day). Visit 0 is the base script; each later
 * visit swaps in one twist, cycling, so the conversation changes slightly from the day before.
 */
export function buildDialogue(scenario, visit = 0) {
  const turns = scenario.turns.map((t) => ({ ...t }));
  const k = visit % versionCount(scenario), final = scenario.final || null;
  if (k === 0) return { turns, twist: null, final };
  const twist = scenario.twists[k - 1];
  turns[twist.at] = { ...twist.turn, changed: true };
  return { turns, twist, final };
}

/**
 * Practice steps for a dialogue. Per turn: answer with the samples visible, repeat the focus phrase
 * exactly, then answer again with the text hidden. Last comes one new question to answer without the script.
 */
export function dialogueSteps(turns, final = null) {
  const steps = turns.flatMap((turn, i) => [
    { kind: 'reply', turn, index: i, hidden: false },
    { kind: 'focus', turn, index: i },
    { kind: 'reply', turn, index: i, hidden: true },
  ]);
  if (final) steps.push({ kind: 'reply', turn: final, index: turns.length, hidden: true, open: true });
  return steps;
}

/** Scenarios ordered for the learner's focus (daily life or work first). */
export function orderedScenarios(focus = 'daily') {
  const first = focus === 'work' ? 'work' : 'daily';
  return [...SCENARIOS].sort((a, b) => (a.focus === first ? 0 : 1) - (b.focus === first ? 0 : 1));
}

/** Today's conversation: stay with one scenario until every version has been practised, then move on. */
export function todayScenario(state, today) {
  const list = orderedScenarios(state.profile?.focus).filter((s) => !s.optional);
  const visits = (s) => (state.scenarios[s.id]?.days || []).filter((d) => d !== today).length;
  return list.find((s) => visits(s) < versionCount(s)) || [...list].sort((a, b) => visits(a) - visits(b))[0];
}
