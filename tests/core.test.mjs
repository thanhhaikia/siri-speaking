import test from 'node:test';
import assert from 'node:assert/strict';
import { matchLine, practiceTip, replyDone } from '../js/match.js';
import { analyzeFrames, tooQuiet } from '../js/recorder.js';
import { buildDialogue, dialogueSteps, versionCount, todayScenario } from '../js/dialogue.js';
import { SCENARIOS } from '../js/content/scenarios.js';
import { LESSONS } from '../js/content/lessons.js';
import { VOCAB } from '../js/content/vocab.js';
import { defaultState, addToDeck, dueCards, reviewCard, markDone, finishScenario, scenarioVisit, voiceStatus, finishLesson } from '../js/store.js';
import { bumpStreak, liveStreak, addDays } from '../js/days.js';
import { todayTasks, shadowSet } from '../js/plan.js';
import { chooseVoice } from '../js/speech.js';
import { addRecording, clipFor, clipCount, removeMyVoice } from '../js/myvoice.js';

test('exact lines: words are labelled by what the browser heard', () => {
  const m = matchLine('Three iced teas, please.', ['tree iced teas please']);
  assert.deepEqual(m.words.map((w) => w.status), ['different', 'heard', 'heard', 'heard']);
  assert.equal(m.pct, 75);
  assert.equal(practiceTip(m).id, 'th');
  assert.equal(matchLine('three', ['']), null, 'no transcript, no result');
  assert.equal(matchLine('I think so', ['I think']).words[2].status, 'unclear');
  assert.equal(practiceTip(matchLine('three', ['three'])), null);
});

test('the best of several transcripts is used', () => {
  assert.equal(matchLine('three', ['tree', 'three']).pct, 100);
});

test('open replies: any accepted idea completes the turn, wording is free', () => {
  const accept = SCENARIOS[0].turns[0].accept;
  for (const r of ['Three, please.', 'A table for three', 'there are 3 of us']) assert.equal(replyDone(accept, [r]).done, true, r);
  assert.equal(replyDone(accept, ['two please']).done, false);
  assert.equal(replyDone(accept, []), null);
});

test('every sample reply of every version is accepted', () => {
  for (const s of SCENARIOS) {
    for (let v = 0; v < versionCount(s); v++) {
      const { turns } = buildDialogue(s, v);
      assert.equal(turns.length, 4);
      for (const t of turns) {
        assert.ok(t.replies.length >= 3 && t.focus.tip.vi && t.task);
        for (const r of t.replies) assert.equal(replyDone(t.accept, [r]).done, true, `${s.id}: ${r}`);
      }
    }
  }
});

test('the conversation changes slightly on the next day', () => {
  const s = SCENARIOS[0];
  const day1 = buildDialogue(s, 0), day2 = buildDialogue(s, 1);
  assert.equal(day1.twist, null);
  assert.equal(day2.turns[1].say, 'Sorry, did you say two or three?');
  assert.equal(day2.turns.filter((t, i) => t.say !== day1.turns[i].say).length, 1);
  assert.deepEqual(dialogueSteps(day1.turns).slice(0, 3).map((x) => [x.kind, !!x.hidden]), [['reply', false], ['focus', false], ['reply', true]]);
  const st = defaultState();
  st.profile = { focus: 'daily' };
  finishScenario(st, 'restaurant', '2026-01-01');
  assert.equal(scenarioVisit(st, 'restaurant', '2026-01-01'), 0, 'same day: same version');
  assert.equal(scenarioVisit(st, 'restaurant', '2026-01-02'), 1);
  assert.equal(todayScenario(st, '2026-01-02').id, 'restaurant');
  st.profile.focus = 'work';
  assert.equal(todayScenario(st, '2026-01-02').id, 'work-update');
});

test('quiet recordings are detected', () => {
  assert.equal(tooQuiet(analyzeFrames(Array(40).fill(0.001))), true);
  const speech = [...Array(10).fill(0.001), ...Array(12).fill(0.2), ...Array(10).fill(0.001), ...Array(8).fill(0.15)];
  const stats = analyzeFrames(speech);
  assert.equal(tooQuiet(stats), false);
  assert.equal(stats.pauses, 1);
  assert.equal(stats.voicedSec, 1);
});

test('retry deck: saved today, due tomorrow, spaced further after "got it"', () => {
  const st = defaultState();
  const card = addToDeck(st, { en: 'Three, please.', vi: 'Nhóm bạn có ba người.' }, '2026-01-01');
  addToDeck(st, { en: 'Three, please.', vi: 'x' }, '2026-01-01');
  assert.equal(st.deck.length, 1);
  assert.equal(dueCards(st, '2026-01-01').length, 0);
  assert.equal(dueCards(st, '2026-01-02').length, 1);
  assert.equal(reviewCard(st, card.id, true, '2026-01-02').due, '2026-01-05');
  assert.equal(reviewCard(st, card.id, false, '2026-01-05').due, '2026-01-06');
});

test('streak and weekly voice check', () => {
  let s = bumpStreak({ count: 0, last: null, best: 0 }, '2026-01-01');
  s = bumpStreak(s, '2026-01-02');
  assert.equal(s.count, 2);
  assert.equal(liveStreak(s, '2026-01-04'), 0);
  assert.equal(bumpStreak(s, '2026-01-04').count, 1);
  const st = defaultState();
  assert.equal(voiceStatus(st, '2026-01-01').stage, 'record');
  st.voice = { line: 0, first: { day: '2026-01-01', audio: 'k' }, history: [] };
  assert.deepEqual(voiceStatus(st, '2026-01-03'), { stage: 'wait', daysLeft: 5 });
  assert.equal(voiceStatus(st, addDays('2026-01-01', 7)).stage, 'compare');
});

test("today's plan has three tasks and tracks completion", () => {
  const st = defaultState();
  st.profile = { focus: 'daily' };
  const tasks = todayTasks(st, '2026-01-01');
  assert.deepEqual(tasks.map((t) => t.kind), ['talk', 'drill', 'voice']);
  markDone(st, 'talk', '2026-01-01');
  assert.equal(todayTasks(st, '2026-01-01')[0].done, true);
  assert.equal(finishLesson(st, tasks[1].id, [100, 50, null], '2026-01-01'), 75);
  assert.equal(shadowSet('2026-01-01').length, 5);
});

test('seed content', () => {
  assert.ok(LESSONS.length >= 25);
  for (const l of LESSONS) assert.ok(l.items.length >= 4 && l.tip && l.titleVi, l.id);
  assert.ok(VOCAB.length >= 50);
  assert.equal(new Set(VOCAB.map((v) => v.w)).size, VOCAB.length);
  assert.equal(SCENARIOS.length, 3);
});

test('free talk gives exactly one thing to practice, never scores', async () => {
  const { oneThing, countFillers, hardWord } = await import('../js/freetalk.js');
  assert.equal(oneThing({ transcript: null }).kind, 'listen');
  assert.equal(oneThing({ transcript: 'I like coffee' }).kind, 'longer');
  assert.equal(countFillers('um I um think uh you know it is um fine').total, 5);
  const long = 'this morning I woke up early and made some coffee before going to the office by bus';
  assert.equal(oneThing({ transcript: `um ${long} um and uh it was fine` }).kind, 'fillers');
  assert.equal(oneThing({ transcript: long, stats: { totalSec: 20, pauses: 9 } }).kind, 'pauses');
  assert.equal(oneThing({ transcript: `${long} and I am agree with my manager` }).drill, 'i agree');
  assert.deepEqual(hardWord('we finished the three reports'), { word: 'three', id: 'th' });
  const word = oneThing({ transcript: `${long} and I talked with my manager` });
  assert.equal(word.kind, 'word');
  assert.equal(word.drill, 'talked');
  for (const r of [word, oneThing({ transcript: long })]) assert.deepEqual(Object.keys(r).filter((k) => /score|pct/.test(k)), []);
});

test('model voice: the chosen voice wins, and a missing one falls back to the accent', () => {
  const list = [
    { name: 'Zira', accent: 'en-US', gender: 'female' },
    { name: 'David', accent: 'en-US', gender: 'male' },
    { name: 'Hazel', accent: 'en-GB', gender: 'female' },
  ];
  assert.equal(chooseVoice(list, 'en-US', 'female', 'David').name, 'David');
  assert.equal(chooseVoice(list, 'en-GB', 'female', 'Not on this device').name, 'Hazel');
  assert.equal(chooseVoice(list, 'en-US', 'male', null).name, 'David');
  assert.equal(chooseVoice([], 'en-US', 'female', 'David'), null);
});

test('my voice: a recording only answers for the sentence it says', () => {
  const state = defaultState();
  assert.deepEqual(addRecording(state, { name: 'Hai', audio: 'a1' }), []);
  assert.equal(state.myVoice.sample, 'a1');
  assert.equal(clipFor(state, 'Three, please.'), null);
  addRecording(state, { audio: 'a2', text: 'Three, please.' });
  assert.equal(clipFor(state, 'three please'), 'a2');
  assert.equal(clipFor(state, 'A table for three'), null);
  assert.deepEqual(addRecording(state, { audio: 'a3', text: 'Three please' }), ['a2']); // replaced take is reported for deletion
  assert.deepEqual(addRecording(state, { name: 'My voice' }), []); // rename only
  assert.equal(state.myVoice.name, 'My voice');
  assert.equal(clipCount(state), 1);
  state.settings.useMyVoice = true;
  assert.deepEqual(removeMyVoice(state).sort(), ['a1', 'a3']);
  assert.equal(state.myVoice, null);
  assert.equal(state.settings.useMyVoice, false);
});
