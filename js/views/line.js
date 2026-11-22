// Exact-repeat practice of one word or sentence: listen, record, replay, see what the browser heard.
// Two sounds per line, never mixed: "Listen (Coach)" is always the coach voice; "My saved take" is only the
// learner's own recording of this line, or "Not recorded yet".
import { speakBox } from './speakbox.js';
import { matchLine, practiceTip, LABELS } from '../match.js';
import { playAudio } from '../recorder.js';
import { saveAudio } from '../audiodb.js';
import * as audiodb from '../audiodb.js';
import { lineKey, takeFor, removeTake, keepTake } from '../takes.js';
import { dayKey } from '../days.js';
import { addToDeck, inDeck, logAttempt, noteSound } from '../store.js';
import { ipaFor } from '../content/ipa.js';
import { $, esc, vi, toast } from '../ui.js';

export const QUIET = `<div class="note warn"><b>That was too quiet to check.</b> Move closer to the microphone and try again.${vi('Âm thanh quá nhỏ nên chưa thể kiểm tra. Hãy nói gần micro hơn và thử lại.')}</div>`;

/**
 * The note shown when an attempt has no transcript. "Unclear" is kept for words in an utterance the browser did
 * transcribe; a service failure is called what it is, and the recording stays usable either way.
 */
export function noWords(app, r, tail) {
  const head = r.failed ? `<b>Word matching unavailable.</b> ${r.note ? `${esc(r.note.en)} ` : ''}Your recording is kept.`
    : app.transcribe() ? '<b>The browser could not make out the words.</b>' : '<b>Word matching is off.</b>';
  return `<div class="note">${head} ${tail}${r.failed ? '<div style="margin-top:8px"><button type="button" class="btn sm ghost" data-nomatch>Practice without word matching</button></div>' : ''}</div>`;
}
const FINAL_SOUND = new Set(['finalS', 'finalEd', 'finalCons']);
/** A transcript cannot show which sound differed, so the hint comes with one concrete thing to do. */
const cue = (pt) => `<span class="small" style="display:block;margin-top:6px">This is a likely cause, not a diagnosis: the browser only reports the words it heard. ${FINAL_SOUND.has(pt.id) ? `Listen to the final sound in “${esc(pt.word)}”, then try it once.` : `Listen to “${esc(pt.word)}” in the coach voice, then try it once.`}${vi(FINAL_SOUND.has(pt.id) ? `Hãy nghe kỹ âm cuối của “${pt.word}” trong giọng mẫu rồi thử lại một lần.` : `Hãy nghe “${pt.word}” trong giọng mẫu rồi thử lại một lần.`)}</span>`;

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
    // Saving a phrase again overwrites its earlier recording instead of leaving it behind.
    const audio = await saveAudio(getBlob?.() || null, app.state.deck.find((c) => c.en === card.en)?.audio || undefined);
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
 * The learner's saved take for one line: "▶ My saved take · 4 sec" with a one-tap Delete, or "Not recorded yet".
 * There is no fallback: a line without a take plays nothing here.
 */
export function takeRow(host, app, key) {
  const take = takeFor(app.state, key);
  host.innerHTML = take
    ? `<div class="row center take"><button type="button" class="btn sm ghost" data-take>▶ My saved take${take.sec ? ` · ${take.sec} sec` : ''}</button><button type="button" class="btn sm plain" data-take-del aria-label="Delete my saved take">Delete</button><span class="small muted">Saved on this device</span></div>`
    : `<p class="center small muted take">My saved take: Not recorded yet${vi('Bạn chưa lưu bản ghi nào cho câu này')}</p>`;
  $('[data-take]', host)?.addEventListener('click', async () => {
    if (!(await playAudio(await audiodb.loadAudio(take.audio)))) toast('This browser could not play that take.');
  });
  $('[data-take-del]', host)?.addEventListener('click', () => {
    audiodb.deleteAudio(removeTake(app.state, key));
    app.save();
    takeRow(host, app, key);
  });
}

/** "💾 Save this take": the only way an attempt replaces the saved take. A failed save keeps the earlier take. */
export function keepButton(btn, app, key, r, text, onSaved, viText = '') {
  btn.addEventListener('click', async () => {
    const had = !!takeFor(app.state, key);
    btn.disabled = true;
    if (await keepTake(app.state, key, { blob: r.blob, sec: r.sec, day: dayKey(), text, vi: viText }, audiodb)) {
      app.save();
      btn.textContent = '✓ Saved on this device';
      onSaved?.();
    } else {
      btn.disabled = false;
      toast(had ? 'This browser could not save the take. Your earlier take is kept.' : 'This browser could not save the take.', 4000);
    }
  });
}

/** The 0.8x / 1x switch for the coach voice, kept beside Listen so it can change during practice. */
export function speedButton(btn, app) {
  const s = app.state.settings, paint = () => { btn.textContent = s.rate < 1 ? '0.8x' : '1x'; btn.setAttribute('aria-label', `Coach speed ${btn.textContent}. Tap to change.`); };
  btn.addEventListener('click', () => { s.rate = s.rate < 1 ? 1 : 0.8; app.save(); paint(); });
  paint();
}

/**
 * @param {{item: {t: string, ipa?: string, s?: string, vi?: string, type?: string, key?: string, own?: boolean}, tip?: {en: string, vi: string},
 *   shadow?: boolean, kind?: string, onAttempt?: (a: {pct: number|null, ok: boolean}) => void}} opts
 */
export function linePractice(host, app, { item, tip = null, shadow = false, kind = 'drill', onAttempt }) {
  const isWord = item.type === 'word' || !/\s/.test(item.t);
  const key = item.key || lineKey(item.t);
  let last = null;
  host.innerHTML = `<div class="line">
    <div class="target ${isWord ? 'word' : ''}">${esc(item.t)}</div>
    <div class="hints">${item.ipa ? `<span>${esc(item.ipa)}</span>` : ''}${item.s ? `<span>${esc(item.s)}</span>` : ''}</div>
    ${vi(item.vi)}
    <div class="row center"><button class="btn sm ghost" data-say>🔊 Listen (Coach)</button><button class="btn sm ghost" data-speed></button></div>
    <div data-saved></div>
    ${tip ? `<div class="tip" style="margin-top:14px"><b>One tip</b>${esc(tip.en)}${vi(tip.vi)}</div>` : ''}
    ${shadow ? `<p class="center muted small" style="margin-top:12px">Listen, then repeat right away with the same rhythm.${vi('Nghe xong hãy nhại lại ngay, giữ đúng nhịp của giọng mẫu.')}</p>` : ''}
    <div data-speak></div><div class="result" data-result></div></div>`;
  const say = () => app.say(item.t);
  $('[data-say]', host).addEventListener('click', say);
  speedButton($('[data-speed]', host), app);
  const out = $('[data-result]', host), saved = $('[data-saved]', host);
  takeRow(saved, app, key);

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
        <div class="row center">${r.blob ? `<button class="btn sm ghost" data-me>▶ My recording · ${r.sec} sec</button><button class="btn sm ghost" data-keep>💾 Save this take</button>` : ''}<button class="btn sm ghost" data-model>🔊 Listen (Coach)</button></div>
        ${match ? `${wordsHtml(match)}
          <p class="center"><span class="pct">${match.heard} / ${match.total}</span><br><span class="muted small">words heard (${match.pct}%)${vi('số từ trình duyệt nghe được')}</span></p>
          <div class="heard-box small">Here's what the app heard: <q>${esc(match.transcript)}</q></div>
          ${pt ? `<div class="tip"><b>One thing to practice</b><strong>${esc(pt.word)}</strong>${known ? ` ${esc(known.ipa)} · ${esc(known.s)}` : ''}${pt.heard ? ` — heard as “${esc(pt.heard)}”` : ''}<br>${esc(pt.en)}${vi(pt.vi)}${cue(pt)}</div>` : `<div class="note ok">The browser heard every word. Listen to your recording next to the coach to check the sounds yourself.${vi('Trình duyệt nghe được đủ các từ. Hãy nghe lại giọng mình và giọng mẫu để tự kiểm tra từng âm.')}</div>`}
          ${LEGEND}`
    : noWords(app, r, `Play your recording, then the coach. Do they sound close?${vi('Hãy nghe bản ghi âm của bạn rồi nghe giọng mẫu. Hai giọng có gần giống nhau không?')}`)}
        <div class="row center" data-save></div></div>`;
      $('[data-me]', out)?.addEventListener('click', () => playAudio(r.blob));
      $('[data-model]', out).addEventListener('click', say);
      if (r.blob) keepButton($('[data-keep]', out), app, key, r, item.t, () => takeRow(saved, app, key), item.vi);
      if (item.vi || tip) saveButton($('[data-save]', out), app, { en: item.t, vi: item.vi || tip?.vi || '', tip: tip?.vi || '' }, () => last?.blob);
      onAttempt?.({ pct: match ? match.pct : null, ok: true });
      if (r.blob && shadow) playAudio(r.blob);
    },
  });
  // Shadowing starts with the sound to copy: the learner's own sentence in their own voice, any other line in the coach voice.
  if (shadow) { const own = item.own && takeFor(app.state, key); if (own) audiodb.loadAudio(own.audio).then((b) => playAudio(b)); else say(); }
  return { destroy: () => box.destroy() };
}
