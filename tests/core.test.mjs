import test from 'node:test';
import assert from 'node:assert/strict';
import { matchLine, practiceTip, keywordHints } from '../js/match.js';
import { analyzeFrames, tooQuiet } from '../js/recorder.js';
import { buildDialogue, dialogueSteps, versionCount, todayScenario } from '../js/dialogue.js';
import { SCENARIOS } from '../js/content/scenarios.js';
import { LESSONS } from '../js/content/lessons.js';
import { VOCAB } from '../js/content/vocab.js';
import { VOICE_LINES } from '../js/content/voicelines.js';
import { defaultState, load, setStorage, addToDeck, dueCards, reviewCard, markDone, finishScenario, scenarioVisit, voiceStatus, finishLesson } from '../js/store.js';
import { bumpStreak, liveStreak, addDays } from '../js/days.js';
import { todayTasks, shadowSet } from '../js/plan.js';
import { chooseVoice } from '../js/speech.js';
import { scriptGroups, scriptProgress, extraLines, ownTakes, staleTakes } from '../js/voicescript.js';
import { learnerLines, lineKey, replyKey, takeFor, setTake, removeTake, keepTake, usedAudio, migrateMyVoice, addPack } from '../js/takes.js';
import { normalizeText } from '../js/scoring.js';

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

test('role-play: key words are soft hints, never a verdict', () => {
  const keys = SCENARIOS[0].turns[0].accept;
  for (const r of ['Three, please.', 'A table for three', 'there are 3 of us']) assert.deepEqual(keywordHints(keys, [r]).heard, ['three'], r);
  const none = keywordHints(keys, ['two please']);
  assert.deepEqual([none.transcript, none.heard, none.examples], ['two please', [], ['three']], 'no key word heard: the transcript and an example, nothing marked wrong');
  assert.equal(keywordHints(keys, ['tree please', 'three please']).transcript, 'three please', 'the transcript with the most key words is shown');
  assert.equal(keywordHints(keys, []), null);
});

test('every conversation: four guided turns with a key word in each sample answer, then one unchecked question', () => {
  for (const s of SCENARIOS) {
    for (let v = 0; v < versionCount(s); v++) {
      const { turns } = buildDialogue(s, v);
      assert.equal(turns.length, 4);
      for (const t of turns) {
        assert.ok(t.replies.length >= 3 && t.focus.tip.vi && t.task);
        for (const r of t.replies) assert.ok(keywordHints(t.accept, [r]).heard.length, `${s.id}: ${r}`);
      }
    }
    const { turns, final } = buildDialogue(s, 0), steps = dialogueSteps(turns, final), last = steps[steps.length - 1];
    assert.equal(steps.length, 13);
    assert.ok(last.open && last.hidden && last.turn === s.final && s.final.task, s.id);
    assert.ok(s.final.replies.length >= 3 && !s.final.accept && !s.final.focus, `${s.id}: the last question has useful phrases and is not checked`);
    assert.equal((s.final.say.match(/\?/g) || []).length, 1, `${s.id}: one question at a time`);
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
  for (const x of SCENARIOS) if (!x.optional) for (let d = 1; d <= 4; d++) finishScenario(st, x.id, `2026-02-0${d}`);
  assert.notEqual(todayScenario(st, '2026-03-01').id, 'interview-2', 'an optional conversation is never the daily one');
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
  assert.equal(SCENARIOS.length, 10);
  assert.deepEqual(SCENARIOS.filter((x) => x.optional).map((x) => x.id), ['interview-2'], 'the second interview is optional');
  assert.equal(SCENARIOS.find((x) => x.id === 'job-interview').next, 'interview-2');
  assert.deepEqual(SCENARIOS.slice(6).map((x) => x.id), ['meet-neighbor', 'delivery-driver', 'job-interview', 'interview-2'], 'new neighbour, then the delivery driver, then the interview');
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

test('saved takes: keys follow the text of the line, so a rewritten line never plays an old recording', () => {
  assert.equal(lineKey('Three, please.'), lineKey('three please'));
  assert.notEqual(lineKey('Three, please.'), lineKey('A table for three'));
  const s = SCENARIOS.find((x) => x.id === 'delivery-driver');
  assert.equal(replyKey(s.id, s.turns[1]), 'delivery-driver:okay i see it which entrance should i use');
  assert.notEqual(replyKey(s.id, s.turns[1]), replyKey(s.id, { say: 'Okay. Which gate should I use?' }), 'new wording, new key');
  const state = defaultState();
  setTake(state, replyKey(s.id, { say: 'An old prompt that was rewritten' }), { audio: 'a9', sec: 2, day: 'd', text: 'An old prompt that was rewritten' });
  setTake(state, lineKey('think'), { audio: 'a1', sec: 1, day: 'd', text: 'think' });
  assert.deepEqual(staleTakes(state), ['delivery-driver:an old prompt that was rewritten'], 'only the take of the rewritten line is unused');
  state.deck.push({ id: 'c1', en: 'x', audio: 'deck1' });
  state.voice = { line: 0, first: { day: 'd', audio: 'voice1' }, history: [] };
  assert.deepEqual([...usedAudio(state)].sort(), ['a1', 'a9', 'deck1', 'voice1'], 'audio still in use is never cleared');
});

test('saved takes: recordings from the earlier "My voice" become takes, nothing is dropped', () => {
  const old = { ...defaultState(), myVoice: { name: 'My voice', sample: 's1', clips: { 'this is a flower': 'f1', think: 't1' }, lines: { 'this is a flower': { t: 'This is a flower.', vi: 'Đây là một bông hoa.' }, think: { t: 'think', vi: '' } } } };
  old.settings.useMyVoice = true;
  const state = migrateMyVoice(old);
  assert.ok(!('myVoice' in state) && !('useMyVoice' in state.settings));
  assert.equal(takeFor(state, lineKey('This is a flower.')).audio, 'f1');
  assert.equal(takeFor(state, lineKey('Think')).audio, 't1');
  assert.deepEqual(takeFor(state, 'own:sample'), { audio: 's1', sec: null, day: null, text: 'My voice' });
  assert.deepEqual([...usedAudio(state)].sort(), ['f1', 's1', 't1']);
  assert.deepEqual(extraLines(state), [{ t: 'This is a flower.', vi: 'Đây là một bông hoa.', key: 'line:this is a flower', type: 'sentence', own: true }], 'own sentences form the shadowing set');
  assert.deepEqual(ownTakes(state).map((x) => x.key).sort(), ['line:this is a flower', 'own:sample']);
  assert.deepEqual(migrateMyVoice(state), state, 'running it again changes nothing');
});

test('saved takes: the recordings shipped with the app are added once and stay deleted', async () => {
  const state = defaultState();
  const pack = { id: 'p1', name: 'My voice', sample: 's.mp3', lines: [{ t: 'This is a flower.', vi: 'Đây là một bông hoa.', file: 'f.mp3' }] };
  const store = async (file) => `key:${file}`;
  assert.deepEqual(await addPack(state, pack, async (file) => (file === 'f.mp3' ? null : `key:${file}`)), ['key:s.mp3'], 'a failed file: the saved ones are handed back');
  assert.deepEqual([state.takes, state.voicePack], [{}, null], 'nothing changes, so the next visit tries again');
  assert.deepEqual(await addPack(state, pack, store), [], 'every file is used');
  assert.equal(takeFor(state, lineKey('this is a flower')).audio, 'key:f.mp3');
  assert.equal(takeFor(state, 'own:sample').audio, 'key:s.mp3');
  removeTake(state, lineKey('This is a flower.'));
  await addPack(state, pack, store);
  assert.equal(takeFor(state, lineKey('This is a flower.')), null, 'not added a second time');
  // A take the learner already has is kept; the pack fills in the rest.
  const mine = defaultState();
  setTake(mine, lineKey('This is a flower.'), { audio: 'a2', sec: 2, day: 'd', text: 'This is a flower.' });
  const two = { ...pack, lines: [...pack.lines, { t: 'It is close.', vi: 'Nó ở gần.', file: 'c.mp3' }] };
  assert.deepEqual(await addPack(mine, two, store), ['key:f.mp3'], 'the unused pack file is handed back');
  assert.deepEqual([takeFor(mine, lineKey('This is a flower.')).audio, takeFor(mine, lineKey('It is close.')).audio], ['a2', 'key:c.mp3']);
});

test('recording screen: every learner line is listed once, and "Recorded: X / Y" counts the saved ones', () => {
  const rows = scriptGroups().flatMap((g) => g.rows), state = defaultState();
  const total = scriptProgress(state).total;
  assert.equal(total, rows.length);
  assert.equal(new Set(rows.map((r) => r.key)).size, total, 'no line is listed twice');
  const delivery = SCENARIOS.find((x) => x.id === 'delivery-driver');
  for (const k of [lineKey('think'), lineKey('the side gate'), replyKey(delivery.id, delivery.final), replyKey('restaurant', SCENARIOS[0].turns[0])]) assert.ok(rows.some((r) => r.key === k), k);
  assert.ok(!rows.some((r) => r.key === lineKey('Good evening! How many people?')), "the partner's lines are the coach's, not the learner's");
  setTake(state, lineKey('Think'), { audio: 'a1', sec: 1, day: 'd', text: 'think' });
  setTake(state, lineKey('This is a flower.'), { audio: 'a2', sec: 2, day: 'd', text: 'This is a flower.' });
  assert.deepEqual(scriptProgress(state), { done: 1, total });
});

test('word matching: written forms are normalised and one skipped word does not shift the rest', () => {
  for (const [a, b] of [['neighbour', 'neighbor'], ['15', 'fifteen'], ['$12', 'twelve dollars'], ["I'll meet you", 'I will meet you'], ['Is there a café nearby?', 'is there a cafe nearby']]) {
    assert.equal(normalizeText(a), normalizeText(b), `${a} = ${b}`);
  }
  // "I'd" is "I would" or "I had": whichever the other side says counts.
  for (const [t, h] of [["I'd like tea", 'I would like tea'], ["I'd finished", 'I had finished'], ['I had finished', "I'd finished"], ["He's gone home", 'he has gone home']]) {
    assert.equal(matchLine(t, [h]).pct, 100, `${t} / ${h}`);
  }
  const m = matchLine('Turn left after the bank and go to the side gate', ['turn left after bank and go to the side gate']);
  assert.deepEqual(m.words.map((w) => w.status), ['heard', 'heard', 'heard', 'unclear', 'heard', 'heard', 'heard', 'heard', 'heard', 'heard', 'heard']);
  for (const [a, b] of [['3rd', 'third'], ['5:30', 'five thirty'], ['neighbours', 'neighbors'], ["Let's go", 'let us go'], ["there's a bank", 'there is a bank']]) {
    assert.equal(normalizeText(a), normalizeText(b), `${a} = ${b}`);
  }
  for (const [t, h] of [["It's been a long day", 'it has been a long day'], ["It's a flower", 'it is a flower'], ["She's here", 'she is here']]) {
    assert.equal(matchLine(t, [h]).pct, 100, `${t} / ${h}`);
  }
  // Endings are never matched away: a missing plural or -ed is reported, not forgiven.
  const ends = matchLine('I checked the painted parts', ['I check the painted part']);
  assert.deepEqual(ends.words.map((w) => [w.text, w.status]), [['I', 'heard'], ['checked', 'different'], ['the', 'heard'], ['painted', 'heard'], ['parts', 'different']]);
  assert.equal(matchLine('the side gate', ['the side gay']).words[2].status, 'different');
});

test('saved takes: saved per learner line, replaced only after the new one is stored', async () => {
  const delivery = SCENARIOS.find((x) => x.id === 'delivery-driver'), lines = learnerLines(delivery);
  assert.equal(lines.length, 8, 'four turns, three daily changes, one final question');
  assert.equal(new Set(lines.map((l) => l.key)).size, 8);
  const state = defaultState(), key = lines[1].key, stored = new Map(), blob = (text) => ({ size: text.length, type: 'audio/webm;codecs=opus', text });
  let n = 0, fail = null;
  const db = {
    saveAudio: async (b, _key, meta) => { if (fail === 'save') return null; const k = `a${++n}`; if (fail !== 'verify') stored.set(k, { b, meta }); return k; },
    loadAudio: async (k) => stored.get(k)?.b || null,
    deleteAudio: async (k) => { stored.delete(k); },
  };
  const text = lines[1].turn.say;
  assert.equal(await keepTake(state, key, { blob: blob('one'), sec: 3, day: '2026-01-01', text }, db), true);
  assert.deepEqual(takeFor(state, key), { audio: 'a1', sec: 3, day: '2026-01-01', text, mime: 'audio/webm;codecs=opus' }, 'the take keeps a snapshot of its line and the recording format');
  assert.deepEqual(stored.get('a1').meta, { text }, 'the snapshot is stored with the Blob too');
  for (fail of ['save', 'verify']) {
    assert.equal(await keepTake(state, key, { blob: blob('two'), sec: 5, day: '2026-01-02', text }, db), false, fail);
    assert.equal(takeFor(state, key).audio, 'a1', 'the earlier take is kept');
    assert.deepEqual([...stored.keys()], ['a1']);
  }
  fail = null;
  for (const empty of [null, { size: 0, type: 'audio/mp4' }]) assert.equal(await keepTake(state, key, { blob: empty, sec: 1, day: 'd', text }, db), false, 'a blank take never replaces a good one');
  assert.equal(takeFor(state, key).audio, 'a1');
  assert.equal(await keepTake(state, key, { blob: { size: 9, type: 'audio/mp4' }, sec: 4, day: '2026-01-03', text }, db), true);
  assert.deepEqual([takeFor(state, key).sec, takeFor(state, key).mime], [4, 'audio/mp4']);
  assert.equal(stored.size, 1, 'the replaced recording is deleted');
  assert.equal(removeTake(state, key), 'a3');
  assert.equal(takeFor(state, key), null);
  // Audio never goes into the saved state: only its key, length, day, text and format.
  assert.ok(JSON.stringify(state).length < 2000);
});

test('playback speed is 0.8x or 1x, also for states saved by earlier versions', () => {
  const mem = new Map();
  setStorage({ getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v), removeItem: (k) => mem.delete(k) });
  assert.equal(load().settings.rate, 1);
  for (const [old, now] of [[0.75, 0.8], [0.9, 1], [1, 1], [0.8, 0.8]]) {
    mem.set('siri-speaking:v1', JSON.stringify({ settings: { rate: old } }));
    const st = load();
    assert.equal(st.settings.rate, now);
    assert.deepEqual(st.takes, {});
    assert.ok(!('myVoice' in st));
  }
  setStorage(null);
});
