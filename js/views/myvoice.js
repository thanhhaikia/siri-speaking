// The recording screen (#/myvoice): the learner's saved takes, managed in one place so the lessons stay uncluttered.
// #/myvoice lists the groups with "Recorded: X / Y lines"; #/myvoice/:groupId lists one group's lines with
// Play / Replace / Delete (and Record for a missing line); #/myvoice/own lists the learner's own sentences and uploads.
import { speakBox } from './speakbox.js';
import { playAudio } from '../recorder.js';
import * as audiodb from '../audiodb.js';
import { takeFor, removeTake, keepTake, usedAudio } from '../takes.js';
import { scriptGroups, scriptProgress, recorded, ownTakes, staleTakes } from '../voicescript.js';
import { dayKey } from '../days.js';
import { openUpload } from './voicepicker.js';
import { QUIET } from './line.js';
import { $, $$, esc, vi, topBar, toast } from '../ui.js';

const LOCAL = `Saved on this device${vi('Chỉ lưu trên thiết bị này')}`;

/** Recordings nothing can play any more: takes of lines that were rewritten, and stored audio no take points to. */
async function unused(state) {
  const used = usedAudio(state), stale = staleTakes(state);
  const orphans = (await audiodb.audioKeys()).filter((k) => !used.has(k));
  return { stale, orphans, count: stale.length + orphans.length };
}

function overview(root, app) {
  const { state } = app, groups = scriptGroups(), { done, total } = scriptProgress(state), own = ownTakes(state);
  root.innerHTML = `${topBar((done / total) * 100, '#/')}
    <h1>My saved takes${vi('Các bản ghi âm bạn đã lưu')}</h1>
    <p class="muted">Your own recording of a line. “Listen (Coach)” never plays it: it plays from “My saved take” on that line and, if you choose, in Play full dialogue.${vi('Đây là bản ghi âm của chính bạn cho từng câu. Nút “Listen (Coach)” không bao giờ phát các bản ghi này: chúng chỉ phát ở nút “My saved take” của câu đó và, nếu bạn chọn, khi nghe toàn bộ hội thoại.')}</p>
    <p class="center"><span class="pct" data-done>Recorded: ${done} / ${total} lines</span><br><span class="muted small">${LOCAL}</span></p>
    <h2>My own sentences${vi('Câu của riêng bạn')}</h2>
    <div class="list"><a class="card item" href="#/myvoice/own"><span class="body"><b>My own sentences and uploads</b>${vi('Những câu bạn tự ghi âm hoặc tải lên, không thuộc bài học nào')}</span><span class="badge" data-own>${own.length}</span></a></div>
    <p class="row" style="margin-top:10px"><button type="button" class="btn sm ghost" data-upload>⬆ Upload a recording</button><button type="button" class="btn sm plain" data-clean hidden></button></p>
    ${['Sound drills', 'Conversations'].map((kind) => `<h2>${kind}</h2><div class="list">${groups.filter((g) => g.kind === kind).map((g) => {
    const n = recorded(state, g.rows);
    return `<a class="card item" href="#/myvoice/${g.id}"><span class="body"><b>${esc(g.title)}</b>${vi(g.titleVi)}</span><span class="badge ${n === g.rows.length ? 'ok' : ''}">${n} / ${g.rows.length}</span></a>`;
  }).join('')}</div>`).join('')}`;
  $('[data-upload]', root).addEventListener('click', () => openUpload(app, () => { toast('Saved on this device.'); overview(root, app); }));
  const clean = $('[data-clean]', root);
  unused(state).then((u) => {
    if (!u.count || !clean.isConnected) return;
    clean.hidden = false;
    clean.textContent = `Clear unused recordings (${u.count})`;
    clean.addEventListener('click', async () => {
      const now = await unused(state); // recount: nothing in use is ever removed
      now.stale.forEach((k) => audiodb.deleteAudio(removeTake(state, k)));
      now.orphans.forEach((k) => audiodb.deleteAudio(k));
      app.save();
      toast('Unused recordings cleared.');
      overview(root, app);
    });
  });
}

/** One group's lines, or the learner's own sentences: Play / Replace / Delete per line, Record for a missing one. */
function lines(root, app, group) {
  const { state } = app;
  let missing = true, box = null;
  const stopBox = () => { box?.destroy(); box = null; };
  const rows = () => (group ? group.rows : ownTakes(state).map(({ key, take }) => ({ key, text: take.text || key, vi: take.vi || '' })));

  function paint() {
    stopBox();
    const all = rows(), n = all.filter((r) => takeFor(state, r.key)).length, shown = all.filter((r) => missing || takeFor(state, r.key));
    root.innerHTML = `${topBar(all.length ? (n / all.length) * 100 : 0, '#/myvoice')}
      <div class="step-label">My saved takes</div>
      <h1>${group ? esc(group.title) : 'My own sentences and uploads'}${group ? vi(group.titleVi) : vi('Câu của riêng bạn và bản ghi đã tải lên')}</h1>
      <p class="center"><span class="pct" data-count>Recorded: ${n} / ${all.length} lines</span><br><span class="muted small">${LOCAL}</span></p>
      ${group ? `<label class="check"><input type="checkbox" data-missing ${missing ? 'checked' : ''}> <span>Show missing${vi('Hiện cả những câu chưa ghi âm')}</span></label>` : ''}
      ${shown.length ? '' : `<div class="note">${group ? 'No saved takes here yet. Tick Show missing to record them, or save a take while you practice.' : 'Nothing here yet. Upload a recording from the previous screen.'}</div>`}
      <div class="list">${shown.map((r) => {
    const take = takeFor(state, r.key);
    return `<div class="card take-row" data-key="${esc(r.key)}">${r.prompt ? `<p class="small muted" style="margin:0">${esc(r.prompt)}</p><p style="margin:4px 0 0" lang="vi">${esc(r.task)}</p><p class="small muted" style="margin:2px 0 0">For example: ${esc(r.sample)}</p>` : `<p style="margin:0"><b>${esc(r.text)}</b></p>${vi(r.vi)}`}
          <div class="row">${take ? `<button class="btn sm ghost" data-play>▶ My saved take${take.sec ? ` · ${take.sec} sec` : ''}</button>${group ? '<button class="btn sm ghost" data-rec>Replace</button>' : ''}<button class="btn sm plain" data-del>Delete</button>`
    : '<span class="small muted">Not recorded yet</span><button class="btn sm ghost" data-rec>🎙 Record</button>'}</div><div data-box></div></div>`;
  }).join('')}</div>`;
    $('[data-missing]', root)?.addEventListener('change', (e) => { missing = e.target.checked; paint(); });
    $$('.take-row', root).forEach((card) => {
      const key = card.dataset.key, row = all.find((r) => r.key === key);
      $('[data-play]', card)?.addEventListener('click', async () => {
        if (!(await playAudio(await audiodb.loadAudio(takeFor(state, key)?.audio)))) toast('This browser could not play that take.');
      });
      $('[data-del]', card)?.addEventListener('click', () => { audiodb.deleteAudio(removeTake(state, key)); app.save(); paint(); });
      $('[data-rec]', card)?.addEventListener('click', () => {
        stopBox();
        $$('[data-box]', root).forEach((el) => { el.innerHTML = ''; });
        const host = $('[data-box]', card);
        host.innerHTML = '<div data-speak></div><div class="result" data-result></div>';
        const out = $('[data-result]', host);
        box = speakBox($('[data-speak]', host), app, {
          maxSec: 14,
          async onResult(r) {
            if (!r.blob) { out.innerHTML = `<div class="note warn">Nothing was recorded. A take needs the microphone.${vi('Chưa ghi âm được. Cần có micro để ghi âm.')}</div>`; return; }
            if (r.quiet) { out.innerHTML = QUIET; return; }
            const had = !!takeFor(state, key);
            if (!(await keepTake(state, key, { blob: r.blob, sec: r.sec, day: dayKey(), text: row.text, vi: row.vi }, audiodb))) {
              out.innerHTML = `<div class="note warn">This browser could not save the take.${had ? ' Your earlier take is kept.' : ''}</div>`;
              return;
            }
            app.save();
            toast('Saved on this device.');
            paint();
          },
        });
        $('.typed', host).hidden = true; // typing cannot make a recording
      });
    });
  }
  paint();
  return stopBox;
}

export default function myvoice(root, app, [id]) {
  if (id === 'own') return lines(root, app, null);
  const group = id && scriptGroups().find((g) => g.id === id);
  return group ? lines(root, app, group) : overview(root, app);
}
