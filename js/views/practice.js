// Practice tab: shadowing and the sound-drill library.
import { LESSON_TOPICS } from '../content/lessons.js';
import { orderedLessons } from '../plan.js';
import { $, $$, esc, vi } from '../ui.js';

export default function practice(root, app) {
  let topic = 'all';
  const all = orderedLessons(app.state.profile);
  function paint() {
    const list = all.filter((l) => topic === 'all' || l.topic === topic);
    root.innerHTML = `<h1>Practice${vi('Luyện tập')}</h1>
      <a class="card task" href="#/shadow" style="margin-top:14px"><span class="ic">🎧</span><span class="body"><b>Shadowing</b>${vi('Nghe giọng mẫu rồi nhại lại ngay 5 câu ngắn')}</span><span class="badge">3 min</span></a>
      <h2>Sound drills${vi('Luyện các âm người Việt hay gặp khó')}</h2>
      <div class="chips"><button class="chip ${topic === 'all' ? 'on' : ''}" data-topic="all">All</button>${LESSON_TOPICS.map((tp) => `<button class="chip ${topic === tp.id ? 'on' : ''}" data-topic="${tp.id}">${esc(tp.en)}</button>`).join('')}</div>
      <div class="list" style="margin-top:10px">${list.map((l) => {
    const rec = app.state.lessons[l.id];
    return `<a class="card item" href="#/drill/${l.id}"><span class="body"><b>${esc(l.title)}</b>${vi(l.titleVi)}
          <span class="dots" title="Difficulty">${[1, 2, 3].map((n) => `<i class="${n <= l.level ? 'on' : ''}"></i>`).join('')}</span></span>
          ${rec?.done ? `<span class="badge ok">✓${rec.best != null ? ` ${rec.best}% heard` : ' done'}</span>` : `<span class="badge">${l.items.length} lines</span>`}</a>`;
  }).join('')}</div>`;
    $$('[data-topic]', root).forEach((b) => b.addEventListener('click', () => { topic = b.dataset.topic; paint(); $('.chips', root).scrollIntoView({ block: 'nearest' }); }));
  }
  paint();
}
