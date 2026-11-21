// Profile: streak calendar, "words heard" history, what the browser often heard differently, settings.
import { dayKey, addDays, liveStreak } from '../days.js';
import { voiceStatus, reset } from '../store.js';
import { clearAudio } from '../audiodb.js';
import { HINTS } from '../phonics.js';
import { $, $$, esc, vi } from '../ui.js';

function chart(points) {
  if (points.length < 2) return `<p class="muted small">Do a few drills with transcription on to see this chart.${vi('Hãy luyện vài bài có bật nhận diện chữ để xem biểu đồ.')}</p>`;
  const W = 320, H = 120, x = (i) => 10 + (i / (points.length - 1)) * (W - 20), y = (p) => H - 14 - (p / 100) * (H - 28);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Words heard per practice day"><line x1="10" x2="${W - 10}" y1="${y(50)}" y2="${y(50)}" stroke="#e2e8f0" stroke-dasharray="4 4"/>
    <polyline fill="none" stroke="#2563eb" stroke-width="3" stroke-linejoin="round" points="${points.map((p, i) => `${x(i)},${y(p.pct)}`).join(' ')}"/>
    ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.pct)}" r="4" fill="#2563eb"><title>${p.day}: ${p.pct}%</title></circle>`).join('')}</svg>`;
}

export default function profile(root, app) {
  const { state } = app, s = state.settings, today = dayKey();
  const days = Array.from({ length: 28 }, (_, i) => addDays(today, i - 27));
  const byDay = {};
  for (const a of state.history) if (a.pct != null) (byDay[a.day] ||= []).push(a.pct);
  const points = Object.keys(byDay).sort().slice(-14).map((day) => ({ day, pct: Math.round(byDay[day].reduce((x, y) => x + y, 0) / byDay[day].length) }));
  const sounds = Object.entries(state.sounds).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const vs = voiceStatus(state);
  const seg = (key, opts) => `<span class="seg">${opts.map(([val, label]) => `<button data-set="${key}" data-val="${val}" class="${String(s[key]) === String(val) ? 'on' : ''}">${label}</button>`).join('')}</span>`;
  root.innerHTML = `<h1>${esc(state.profile.name)}</h1>
    <p class="muted">🔥 ${liveStreak(state.streak)}-day streak · best ${state.streak.best} · ${Object.keys(state.done).length} practice days</p>
    <a class="card task" href="#/voice"><span class="ic">🎙️</span><span class="body"><b>Weekly voice check</b>${vi(vs.stage === 'record' ? 'Ghi âm một câu để so sánh sau 7 ngày' : vs.stage === 'wait' ? `Còn ${vs.daysLeft} ngày nữa đến lần so sánh` : 'Đã đến lúc so sánh giọng của bạn')}</span><span class="badge">${vs.stage === 'wait' ? `${vs.daysLeft} d` : vs.stage === 'compare' ? 'Ready' : 'Start'}</span></a>
    <h2>Last 4 weeks${vi('4 tuần gần đây')}</h2>
    <div class="card"><div class="cal">${days.map((d) => `<i class="${state.done[d] ? 'on' : ''} ${d === today ? 'today' : ''}">${Number(d.slice(8))}</i>`).join('')}</div></div>
    <h2>Words heard in drills${vi('Tỉ lệ từ trình duyệt nghe được khi luyện âm')}</h2>
    <div class="card">${chart(points)}<p class="legend" style="margin:8px 0 0">This shows how many expected words the browser recognised, not how well each sound was made.</p></div>
    <h2>Often heard differently${vi('Những âm máy hay nghe thành từ khác')}</h2>
    <div class="list">${sounds.map(([id, n]) => `<div class="tip"><b>${esc(HINTS[id].sound)} · ${n}×</b>${esc(HINTS[id].en)}${vi(HINTS[id].vi)}</div>`).join('') || '<p class="muted small">Nothing yet. This fills in as you practice.</p>'}</div>
    <h2>Settings${vi('Cài đặt')}</h2>
    <div class="card">
      <div class="setting"><span>Model voice${vi('Giọng mẫu: chạm để nghe thử và đổi giọng')}</span><span class="row" style="justify-content:flex-end"><button class="btn sm ghost" data-voice>🗣️ <span data-voice-name></span></button><button class="btn sm ghost" data-voice="upload">⬆ Upload my voice</button></span></div>
      <div class="setting"><span>Speed${vi('Tốc độ đọc')}</span>${seg('rate', [[0.75, 'Slow'], [0.9, 'Normal'], [1, 'Fast']])}</div>
      <div class="setting"><span>Show what the app heard${vi('Nhận diện chữ (không bắt buộc). Auto: bật trên máy tính, tắt trên điện thoại')}</span>${seg('transcribe', [['auto', 'Auto'], ['on', 'On'], ['off', 'Off']])}</div>
      <div class="setting"><span>Vietnamese help${vi('Hiện phần giải thích tiếng Việt')}</span>${seg('showVi', [[true, 'On'], [false, 'Off']])}</div>
      <div class="setting"><span>Focus${vi('Trọng tâm')}</span>${seg('focus', [['daily', 'Daily life'], ['work', 'Work']]).replace(`data-val="${state.profile.focus}" class=""`, `data-val="${state.profile.focus}" class="on"`)}</div>
    </div>
    <p class="center" style="margin-top:18px"><button class="btn sm plain" data-reset>Reset all progress</button></p>
    <p class="center small muted">Recordings and progress are stored only in this browser.</p>`;
  $$('[data-set]', root).forEach((b) => b.addEventListener('click', () => {
    const { set, val } = b.dataset;
    if (set === 'focus') { state.profile.focus = val; state.today = null; } else s[set] = set === 'rate' ? Number(val) : set === 'showVi' ? val === 'true' : val;
    app.save(); app.go('#/me');
  }));
  $('[data-reset]', root).addEventListener('click', async () => {
    if (!confirm('Delete all progress and recordings on this device?')) return;
    reset(); await clearAudio(); location.hash = ''; location.reload();
  });
}
