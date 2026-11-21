// Home: greeting, streak, today's progress ring, one "Practice today" button and the day's three tasks.
import { todayTasks } from '../plan.js';
import { dayKey, addDays, liveStreak } from '../days.js';
import { tipOfDay } from '../content/tips.js';
import { clipCount } from '../myvoice.js';
import { esc, vi, ring } from '../ui.js';

export default function home(root, app) {
  const { state } = app;
  const tasks = todayTasks(state);
  app.save();
  const done = tasks.filter((t) => t.done).length;
  const next = tasks.find((t) => !t.done);
  const today = dayKey(), streak = liveStreak(state.streak);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const tip = tipOfDay();
  root.innerHTML = `
    <div class="top"><div><h1>${greet}, ${esc(state.profile.name)} 👋</h1></div>
      <span class="flame" title="Days in a row">🔥 ${streak}<span class="small">&nbsp;day${streak === 1 ? '' : 's'}</span></span></div>
    <div class="hero">${ring((done / tasks.length) * 100, 170, `${done}/${tasks.length}`, 'done today')}
      <p class="center muted" style="margin:6px 0 0">${done === tasks.length ? 'All done for today. See you tomorrow!' : `About ${tasks.filter((t) => !t.done).reduce((s, t) => s + t.min, 0)} minutes left today`}${vi(done === tasks.length ? 'Bạn đã xong hôm nay. Hẹn gặp ngày mai!' : 'Hoàn thành 3 bài ngắn để giữ chuỗi ngày luyện tập.')}</p></div>
    <a class="btn big" href="${next ? next.href : tasks[0].href}" id="practice-today">${next ? '🎤 Practice today' : '🎤 Practice again'}</a>
    <h2>Today's tasks${vi('Bài hôm nay')}</h2>
    ${tasks.map((t) => `<a class="card task ${t.done ? 'done' : ''}" href="${t.href}"><span class="ic">${t.done ? '✅' : t.icon}</span>
      <span class="body"><b>${esc(t.en)}</b>${vi(t.vi)}</span><span class="badge ${t.done ? 'ok' : ''}">${t.done ? 'Done' : `${t.min} min`}</span></a>`).join('')}
    ${clipCount(state) ? `<h2>In your own voice${vi('Bằng giọng của chính bạn')}</h2>
    <a class="card task" href="#/shadow/mine"><span class="ic">🎙</span><span class="body"><b>Shadow ${esc(state.myVoice.name)}</b>${vi('Nút Listen phát đúng bản ghi âm của bạn cho từng câu, rồi bạn nhại theo')}</span><span class="badge">${clipCount(state)} lines</span></a>` : ''}
    <h2>This week${vi('Tuần này')}</h2>
    <div class="card"><div class="week">${week.map((d) => `<div class="${state.done[d] ? 'on' : ''} ${d === today ? 'today' : ''}"><i></i>${new Date(d + 'T12:00').toLocaleDateString('en', { weekday: 'short' })}</div>`).join('')}</div></div>
    <h2>Tip of the day${vi('Mẹo hôm nay')}</h2>
    <div class="tip"><b>${esc(tip.title)}</b>${esc(tip.en)}${vi(tip.vi)}</div>`;
}
