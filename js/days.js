// Day keys and the practice streak.
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n)); };
export const dayNumber = (key = dayKey()) => { const [y, m, d] = key.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); };
export const daysBetween = (from, to) => dayNumber(to) - dayNumber(from);

export function bumpStreak(streak, today = dayKey()) {
  if (streak.last === today) return streak;
  const count = streak.last === addDays(today, -1) ? streak.count + 1 : 1;
  return { count, last: today, best: Math.max(streak.best || 0, count) };
}
/** Streak as it stands today: 0 once a full day has been missed. */
export const liveStreak = (streak, today = dayKey()) => (streak.last === today || streak.last === addDays(today, -1) ? streak.count : 0);
