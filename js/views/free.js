// Free talk: speak for 30–60 seconds on a topic. Two outputs only:
// "Here's what the app heard" and "Here's one thing to practice".
import { topicOfDay, oneThing } from '../freetalk.js';
import { HINTS } from '../phonics.js';
import { markDone } from '../store.js';
import { playAudio } from '../recorder.js';
import { ipaFor } from '../content/ipa.js';
import { speakBox } from './speakbox.js';
import { linePractice, QUIET } from './line.js';
import { $, esc, vi, topBar } from '../ui.js';

const MIN_SEC = 30, MAX_SEC = 60;

export default function free(root, app) {
  let shift = 0, part = null;
  const clock = (sec) => `0:${String(Math.floor(sec)).padStart(2, '0')}`;

  function record() {
    part?.destroy();
    const topic = topicOfDay(undefined, shift);
    root.innerHTML = `${topBar(0, '#/practice')}<div class="step-label">Free talk · ${MIN_SEC}–${MAX_SEC} seconds</div>
      <div class="situation"><b>Your topic</b><span style="font-size:1.25rem;font-weight:700">${esc(topic.en)}</span>${vi(topic.vi)}</div>
      <div class="center"><button class="btn sm plain" data-other>Another topic</button></div>
      <p class="center pct" data-clock style="margin:14px 0 0">0:00</p>
      <p class="center small muted" data-goal>Speak for at least ${MIN_SEC} seconds. Tap the button again to stop.${vi(`Hãy nói ít nhất ${MIN_SEC} giây. Chạm lần nữa để dừng.`)}</p>
      <div data-speak></div><div class="result" data-result></div>`;
    $('[data-other]', root).addEventListener('click', () => { shift++; record(); });
    const clockEl = $('[data-clock]', root), goal = $('[data-goal]', root), out = $('[data-result]', root);
    part = speakBox($('[data-speak]', root), app, {
      maxSec: MAX_SEC, autoStop: false,
      onStart: () => { out.innerHTML = ''; },
      onTick: (sec) => { clockEl.textContent = clock(sec); if (sec >= MIN_SEC) goal.innerHTML = `Good. Finish your sentence, then tap to stop.${vi('Tốt lắm. Nói hết câu rồi chạm để dừng.')}`; },
      onResult(r) {
        if (r.quiet) { out.innerHTML = QUIET; return; }
        result(topic, r);
      },
    });
  }

  function result(topic, r) {
    part?.destroy();
    part = null;
    const transcript = r.alternatives?.[0] || null;
    const thing = oneThing({ transcript, stats: r.stats });
    markDone(app.state, 'free');
    app.save();
    const hint = thing.id ? HINTS[thing.id] : null, known = thing.drill ? ipaFor(thing.drill) : null;
    root.innerHTML = `${topBar(100, '#/practice')}<p class="small muted">${esc(topic.en)}</p>
      <h2 style="margin-top:6px">Here's what the app heard${vi('Những gì máy nghe được')}</h2>
      ${transcript ? `<div class="heard-box">${esc(transcript)}</div><p class="legend">This is the browser's guess at your words. It can be wrong even when you spoke clearly.${vi('Đây là phần trình duyệt đoán ra từ giọng của bạn. Nó có thể sai ngay cả khi bạn nói rõ.')}</p>`
    : `<div class="note">${r.note ? `${esc(r.note.en)} ` : ''}No transcript this time. Listen to your recording instead.${vi('Lần này không có phần chữ. Hãy nghe lại bản ghi âm của bạn.')}</div>`}
      ${r.blob ? '<div class="row center" style="margin-top:10px"><button class="btn sm ghost" data-me>▶ My recording</button></div>' : ''}
      <h2>Here's one thing to practice${vi('Một điều nên luyện thêm')}</h2>
      <div class="tip">${esc(thing.en)}${vi(thing.vi)}${hint ? `<br><span class="small">${esc(hint.en)}</span>${vi(hint.vi)}` : ''}</div>
      ${thing.drill ? '<div data-line style="margin-top:16px"></div>' : ''}
      <div class="footer"><button class="btn ghost" data-again>Talk again</button><a class="btn" href="#/">Home</a></div>`;
    $('[data-me]', root)?.addEventListener('click', () => playAudio(r.blob));
    $('[data-again]', root).addEventListener('click', record);
    if (thing.drill) part = linePractice($('[data-line]', root), app, { item: { t: thing.drill, ipa: known?.ipa, s: known?.s }, kind: 'free' });
  }

  record();
  return () => part?.destroy();
}
