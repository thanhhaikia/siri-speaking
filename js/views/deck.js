// My deck: phrases the learner saved because they were hard. Next day each one comes back with the
// situation in Vietnamese first; the learner tries, then the English and both recordings are revealed.
import { dueCards, reviewCard, removeFromDeck, addToDeck, inDeck, markDone } from '../store.js';
import { dayKey } from '../days.js';
import { loadAudio, deleteAudio } from '../audiodb.js';
import { playAudio } from '../recorder.js';
import { matchLine } from '../match.js';
import { VOCAB } from '../content/vocab.js';
import { speakBox } from './speakbox.js';
import { wordsHtml, LEGEND, QUIET } from './line.js';
import { $, $$, esc, vi, topBar, toast } from '../ui.js';

function list(root, app) {
  const { state } = app, today = dayKey(), due = dueCards(state);
  const ideas = VOCAB.filter((v) => !inDeck(state, v.ex)).slice(0, 6);
  root.innerHTML = `<h1>My deck${vi('Các câu khó bạn đã lưu')}</h1>
    <p class="muted">Tap ☆ on any phrase that feels hard. Tomorrow you see the situation in Vietnamese and try it again.${vi('Chạm ☆ ở câu bạn thấy khó. Ngày mai bạn sẽ thấy tình huống bằng tiếng Việt và thử nói lại.')}</p>
    ${state.deck.length ? `<a class="btn big" href="#/deck/${due.length ? 'review' : 'all'}">${due.length ? `🔁 Retry ${due.length} phrase${due.length === 1 ? '' : 's'}` : '🔁 Practice all now'}</a>
      ${due.length ? '' : `<p class="center small muted" style="margin-top:10px">Nothing is due today. Saved phrases come back tomorrow.${vi('Hôm nay chưa có câu nào đến hạn. Câu đã lưu sẽ quay lại vào ngày mai.')}</p>`}` : ''}
    <h2>Saved phrases (${state.deck.length})</h2>
    <div class="list">${state.deck.map((c) => `<div class="card item"><span class="body"><b>${esc(c.en)}</b>${vi(c.vi)}</span>
      <span class="badge ${c.due <= today ? '' : 'ok'}">${c.due <= today ? 'Due' : c.audio ? '🎙 saved' : 'Later'}</span><button class="icon-btn" data-del="${c.id}" aria-label="Remove">✕</button></div>`).join('') || '<div class="note">Nothing saved yet. Do today\'s conversation and tap ☆ on a hard phrase.</div>'}</div>
    <h2>Useful phrases to add${vi('Gợi ý câu hữu ích')}</h2>
    <div class="list">${ideas.map((v) => `<div class="card item"><button class="icon-btn" data-say="${esc(v.ex)}" aria-label="Listen">🔊</button><span class="body"><b>${esc(v.ex)}</b>${vi(v.exVi)}<span class="small muted">${esc(v.w)} ${esc(v.ipa)} · ${esc(v.vi)}</span></span>
      <button class="icon-btn" data-add="${esc(v.w)}" aria-label="Save to my deck">☆</button></div>`).join('')}</div>`;
  $$('[data-say]', root).forEach((b) => b.addEventListener('click', () => app.say(b.dataset.say)));
  $$('[data-add]', root).forEach((b) => b.addEventListener('click', () => {
    const v = VOCAB.find((x) => x.w === b.dataset.add);
    addToDeck(state, { en: v.ex, vi: v.exVi, tip: `${v.w} ${v.ipa} — ${v.vi}` });
    app.save(); toast('Saved. It comes back tomorrow.'); list(root, app);
  }));
  $$('[data-del]', root).forEach((b) => b.addEventListener('click', () => { deleteAudio(removeFromDeck(state, b.dataset.del)?.audio); app.save(); list(root, app); }));
}

function review(root, app, cards) {
  let i = 0, part = null;
  function show() {
    part?.destroy();
    part = null;
    if (i >= cards.length) {
      markDone(app.state, 'deck'); app.save();
      root.innerHTML = `${topBar(100, '#/deck')}<h1 class="center">Deck done 🎉</h1><p class="center muted">Phrases you got come back later. The others return tomorrow.${vi('Câu bạn đã nói được sẽ quay lại sau vài ngày, các câu còn lại sẽ quay lại ngày mai.')}</p><div class="footer"><a class="btn ghost" href="#/deck">My deck</a><a class="btn" href="#/">Home</a></div>`;
      return;
    }
    const card = cards[i];
    root.innerHTML = `${topBar((i / cards.length) * 100, '#/deck')}<div class="step-label">Phrase ${i + 1} of ${cards.length}</div>
      <div class="situation"><b>How would you say this in English?</b><span lang="vi" style="font-size:1.25rem;font-weight:700">${esc(card.vi || card.en)}</span></div>
      <div data-speak></div><div class="result" data-result></div>
      <div class="footer" data-foot><button class="btn ghost" data-reveal>Show the English</button></div>`;
    const out = $('[data-result]', root);
    const reveal = (r) => {
      const match = r && !r.quiet ? matchLine(card.en, r.alternatives) : null;
      out.innerHTML = `<div class="stack">${r?.quiet ? QUIET : ''}<div class="target">${esc(card.en)}</div>${card.tip ? `<p class="center small muted" lang="vi">${esc(card.tip)}</p>` : ''}
        <div class="row center"><button class="btn sm ghost" data-model>🔊 Listen (Coach)</button>${r?.blob ? '<button class="btn sm ghost" data-now>▶ Me today</button>' : ''}${card.audio ? '<button class="btn sm ghost" data-old>▶ Me when I saved it</button>' : ''}</div>
        ${match ? `${wordsHtml(match)}<div class="heard-box small">Here's what the app heard: <q>${esc(match.transcript)}</q></div>${LEGEND}` : ''}</div>`;
      $('[data-model]', out).addEventListener('click', () => app.say(card.en));
      $('[data-now]', out)?.addEventListener('click', () => playAudio(r.blob));
      $('[data-old]', out)?.addEventListener('click', async () => playAudio(await loadAudio(card.audio)));
      $('[data-foot]', root).innerHTML = '<button class="btn ghost" data-again>Again tomorrow</button><button class="btn" data-got>Got it</button>';
      const done = (got) => { reviewCard(app.state, card.id, got); app.save(); i++; show(); };
      $('[data-again]', root).addEventListener('click', () => done(false));
      $('[data-got]', root).addEventListener('click', () => done(true));
      app.say(card.en);
    };
    $('[data-reveal]', root).addEventListener('click', () => reveal(null));
    part = speakBox($('[data-speak]', root), app, { maxSec: 12, onResult: reveal });
  }
  show();
  return () => part?.destroy();
}

export default function deck(root, app, [mode]) {
  if (!mode) return list(root, app);
  const cards = mode === 'all' ? [...app.state.deck] : dueCards(app.state);
  if (!cards.length) return app.go('#/deck');
  return review(root, app, cards);
}
