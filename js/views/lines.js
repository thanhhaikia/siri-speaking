// Sound drills (#/drill/:lessonId) and shadowing (#/shadow, or #/shadow/mine for the learner's own recordings): a run of exact-repeat lines.
import { lessonById } from '../content/lessons.js';
import { shadowSet } from '../plan.js';
import { voiceLines } from '../myvoice.js';
import { finishLesson, markDone } from '../store.js';
import { linePractice } from './line.js';
import { $, esc, vi, topBar } from '../ui.js';

export default function lines(root, app, [id], route) {
  const shadow = route === 'shadow';
  const lesson = shadow ? null : lessonById(id);
  if (!shadow && !lesson) return app.go('#/practice');
  const mine = shadow && id === 'mine';
  const items = mine ? voiceLines(app.state) : shadow ? shadowSet() : lesson.items;
  if (!items.length) return app.go('#/practice');
  const title = mine ? `Shadow ${app.state.myVoice.name}` : shadow ? 'Shadowing' : lesson.title;
  const pcts = items.map(() => null);
  let i = 0, part = null;

  function show() {
    part?.destroy();
    part = null;
    if (i >= items.length) return summary();
    root.innerHTML = `${topBar((i / items.length) * 100, '#/practice')}
      <div class="step-label">${esc(title)} · ${i + 1} of ${items.length}</div>
      ${!shadow && i === 0 ? `<div class="tip" style="margin-bottom:14px" lang="vi"><b>Mẹo</b>${esc(lesson.tip)}</div>` : ''}
      <div data-line></div><div class="footer"><button class="btn" data-next>Skip</button></div>`;
    const next = $('[data-next]', root);
    next.addEventListener('click', () => { i++; show(); });
    part = linePractice($('[data-line]', root), app, {
      item: items[i], shadow, kind: shadow ? 'shadow' : 'drill',
      onAttempt: (a) => { pcts[i] = a.pct; next.textContent = i === items.length - 1 ? 'Finish' : 'Next'; },
    });
  }

  function summary() {
    let avg = null;
    if (shadow) { markDone(app.state, 'shadow'); const xs = pcts.filter((p) => p != null); avg = xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null; } else avg = finishLesson(app.state, lesson.id, pcts);
    app.save();
    const weakest = pcts.reduce((best, p, k) => (p != null && p < 100 && (best < 0 || p < pcts[best]) ? k : best), -1);
    root.innerHTML = `${topBar(100, '#/practice')}<h1 class="center">${shadow ? 'Shadowing done' : 'Drill done'} 🎉</h1><p class="center muted">${esc(title)}</p>
      ${avg != null ? `<p class="center"><span class="pct">${avg}%</span><br><span class="muted small">of the words were heard by the browser${vi('số từ trình duyệt nghe được — không phải điểm phát âm')}</span></p>` : `<div class="note">No transcription this time. Your recordings were for listening and comparing.${vi('Lần này không có phần nhận diện chữ. Bạn đã luyện bằng cách nghe lại và so sánh.')}</div>`}
      <div class="list" style="margin-top:14px">${items.map((it, k) => `<div class="card spread"><span>${esc(it.t)}</span><span class="badge ${pcts[k] === 100 ? 'ok' : ''}">${pcts[k] == null ? '—' : `${pcts[k]}%`}</span></div>`).join('')}</div>
      ${weakest >= 0 ? `<h2>Here's one thing to practice${vi('Một điều nên luyện thêm')}</h2><div class="tip"><b>Say this again tomorrow</b>${esc(items[weakest].t)}${vi(items[weakest].vi)}</div>` : ''}
      <div class="footer"><a class="btn ghost" href="#/practice">More practice</a><a class="btn" href="#/">Home</a></div>`;
  }
  show();
  return () => part?.destroy();
}
