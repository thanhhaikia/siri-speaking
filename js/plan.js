// Today's plan: three short tasks, reached from the single "Practice today" button.
import { LESSONS } from './content/lessons.js';
import { dayKey, dayNumber } from './days.js';
import { dueCards, voiceStatus, doneToday } from './store.js';
import { todayScenario } from './dialogue.js';

const TOPIC_ORDER = {
  daily: ['sounds', 'endings', 'daily', 'travel', 'stress', 'intonation', 'work'],
  work: ['sounds', 'endings', 'work', 'stress', 'intonation', 'daily', 'travel'],
};

/** Lessons ordered for this learner: easier first, then the topics that fit their focus. */
export function orderedLessons(profile) {
  const order = TOPIC_ORDER[profile?.focus === 'work' ? 'work' : 'daily'];
  const rank = (l) => l.level * 10 + order.indexOf(l.topic);
  return LESSONS.map((l, i) => ({ l, i })).sort((a, b) => rank(a.l) - rank(b.l) || a.i - b.i).map((x) => x.l);
}
export const nextLesson = (state) => { const list = orderedLessons(state.profile); return list.find((l) => !state.lessons[l.id]?.done) || list[dayNumber() % list.length]; };

/** A shadowing set: `count` short sentences, rotating daily. */
export function shadowSet(day = dayKey(), count = 5) {
  const pool = LESSONS.filter((l) => l.level <= 2).flatMap((l) => l.items.filter((it) => it.type === 'sentence'));
  const start = (dayNumber(day) * count) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

const INFO = {
  talk: { icon: '💬', en: "Today's conversation", vi: 'Hội thoại hôm nay', min: 2, href: (id) => `#/talk/${id}` },
  deck: { icon: '🔁', en: 'Retry your saved phrases', vi: 'Thử lại các câu đã lưu', min: 3, href: () => '#/deck/review' },
  drill: { icon: '🎯', en: 'Sound drill', vi: 'Luyện âm', min: 4, href: (id) => `#/drill/${id}` },
  voice: { icon: '🎙️', en: 'Weekly voice check', vi: 'So sánh giọng hằng tuần', min: 1, href: () => '#/voice' },
  shadow: { icon: '🎧', en: 'Shadow 5 sentences', vi: 'Nghe và nhại lại 5 câu', min: 3, href: () => '#/shadow' },
};

export function buildTasks(state, day = dayKey()) {
  const tasks = [{ kind: 'talk', id: todayScenario(state, day).id }];
  tasks.push(dueCards(state, day).length ? { kind: 'deck', id: 'review' } : { kind: 'drill', id: nextLesson(state).id });
  tasks.push(voiceStatus(state, day).stage !== 'wait' ? { kind: 'voice', id: 'check' } : { kind: 'shadow', id: 'today' });
  return tasks;
}

/** Today's tasks, fixed once generated for the day so the list does not shift while the learner works. */
export function todayTasks(state, day = dayKey()) {
  if (state.today?.day !== day) state.today = { day, tasks: buildTasks(state, day) };
  return state.today.tasks.map((t) => {
    const info = INFO[t.kind];
    return { ...t, icon: info.icon, en: info.en, vi: info.vi, min: info.min, href: info.href(t.id), done: doneToday(state, t.kind, day) };
  });
}
