// Exact-repeat practice of one word or sentence: listen, record, replay, see what the browser heard.
import { speakBox } from './speakbox.js';
import { matchLine, practiceTip, LABELS } from '../match.js';
import { playAudio } from '../recorder.js';
import { saveAudio } from '../audiodb.js';
import { addToDeck, inDeck, logAttempt, noteSound } from '../store.js';
import { ipaFor } from '../content/ipa.js';
import { $, esc, vi, toast } from '../ui.js';

export const QUIET = `<div class="note warn"><b>That was too quiet to check.</b> Move closer to the microphone and try again.${vi('Âm thanh quá nhỏ nên chưa thể kiểm tra. Hãy nói gần micro hơn và thử lại.')}</div>`;

/** The words of a line, coloured and labelled by what the browser heard. */
export function wordsHtml(match) {
  return `<div class="words">${match.words.map((w) => `<span class="w ${w.status}">${esc(w.text)}<small>${LABELS[w.status].en}</small>${w.status === 'different' && w.heard ? `<em>“${esc(w.heard)}”</em>` : ''}</span>`).join('')}</div>`;
}
export const LEGEND = `<p class="legend">Green means the browser heard the expected word. It is not a grade of your sounds.${vi('Màu xanh nghĩa là trình duyệt nghe ra đúng từ đó — không phải điểm chấm từng âm của bạn.')}</p>`;

/** "Save to my deck" button wiring shared by lines and conversation replies. */
export function saveButton(host, app, card, getBlob) {
  const btn = document.createElement('button');
  btn.type = 'button';
  const paint = () => { const on = inDeck(app.state, card.en); btn.className = `btn sm ghost ${on ? 'on' : ''}`; btn.innerHTML = on ? '★ Saved to my deck' : '☆ Save to my deck'; };
  btn.addEventListener('click', async () => {
    const audio = await saveAudio(getBlob?.() || null);
    addToDeck(app.state, { ...card, audio });
    app.save();
    paint();
    toast('Saved. It comes back tomorrow, Vietnamese first.');
  });
  paint();
  host.appendChild(btn);
  return btn;
}

/**
 * @param {{item: {t: string, ipa?: string, s?: string, vi?: string, type?: string}, tip?: {en: string, vi: string},
 *   shadow?: boolean, kind?: string, onAttempt?: (a: {pct: number|null, ok: boolean}) => void}} opts
 */
export function linePractice(host, app, { item, tip = null, shadow = false, kind = 'drill', onAttempt }) {
  const isWord = item.type === 'word' || !/\s/.test(item.t);
  let last = null;
  host.innerHTML = `<div class="line">
    <div class="target ${isWord ? 'word' : ''}">${esc(item.t)}</div>
    <div class="hints">${item.ipa ? `<span>${esc(item.ipa)}</span>` : ''}${item.s ? `<span>${esc(item.s)}</span>` : ''}</div>
    ${vi(item.vi)}
    <div class="row center"><button class="btn sm ghost" data-say>🔊 Listen</button><button class="btn sm ghost" data-slow>🐢 Slow</button></div>
    ${tip ? `<div class="tip" style="margin-top:14px"><b>One tip</b>${esc(tip.en)}${vi(tip.vi)}</div>` : ''}
    ${shadow ? `<p class="center muted small" style="margin-top:12px">Listen, then repeat right away with the same rhythm.${vi('Nghe xong hãy nhại lại ngay, giữ đúng nhịp của giọng mẫu.')}</p>` : ''}
    <div data-speak></div><div class="result" data-result></div></div>`;
  $('[data-say]', host).addEventListener('click', () => app.say(item.t));
  $('[data-slow]', host).addEventListener('click', () => app.say(item.t, { slow: true }));
  const out = $('[data-result]', host);

  const box = speakBox($('[data-speak]', host), app, {
    maxSec: isWord ? 6 : 14,
    onResult(r) {
      last = r;
      if (r.quiet) { out.innerHTML = QUIET; return; }
      const match = matchLine(item.t, r.alternatives);
      const pt = match ? practiceTip(match) : null;
      const known = pt ? ipaFor(pt.word) : null;
      logAttempt(app.state, kind, item.t, match ? match.pct : null);
      if (pt) noteSound(app.state, pt.id);
      app.save();
      out.innerHTML = `<div class="stack">
        <div class="row center">${r.url ? '<button class="btn sm ghost" data-me>▶ My voice</button>' : ''}<button class="btn sm ghost" data-model>🔊 Model</button></div>
        ${match ? `${wordsHtml(match)}
          <p class="center"><span class="pct">${match.heard} / ${match.total}</span><br><span class="muted small">words heard (${match.pct}%)${vi('số từ trình duyệt nghe được')}</span></p>
          <div class="heard-box small">Here's what the app heard: <q>${esc(match.transcript)}</q></div>
          ${pt ? `<div class="tip"><b>One thing to practice</b><strong>${esc(pt.word)}</strong>${known ? ` ${esc(known.ipa)} · ${esc(known.s)}` : ''}${pt.heard ? ` — heard as “${esc(pt.heard)}”` : ''}<br>${esc(pt.en)}${vi(pt.vi)}</div>` : `<div class="note ok">The browser heard every word. Listen to your recording next to the model to check the sounds yourself.${vi('Trình duyệt nghe được đủ các từ. Hãy nghe lại giọng mình và giọng mẫu để tự kiểm tra từng âm.')}</div>`}
          ${LEGEND}`
    : `<div class="note">${r.note ? `${esc(r.note.en)} ` : ''}Play your voice, then the model. Do they sound close?${vi('Hãy nghe giọng của bạn rồi nghe giọng mẫu. Hai giọng có gần giống nhau không?')}</div>`}
        <div class="row center" data-save></div></div>`;
      $('[data-me]', out)?.addEventListener('click', () => playAudio(r.url));
      $('[data-model]', out).addEventListener('click', () => app.say(item.t));
      if (item.vi || tip) saveButton($('[data-save]', out), app, { en: item.t, vi: item.vi || tip?.vi || '', tip: tip?.vi || '' }, () => last?.blob);
      onAttempt?.({ pct: match ? match.pct : null, ok: true });
      if (r.url && shadow) playAudio(r.url);
    },
  });
  if (shadow) app.say(item.t);
  return { destroy: () => box.destroy() };
}
