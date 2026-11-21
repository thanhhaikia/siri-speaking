// Record my voice for the lessons (#/myvoice, #/myvoice/:groupId): one line at a time, each recording becomes
// what Listen plays for that line. Nothing here is generated: a line has the learner's voice only once they say it.
import { speakBox } from './speakbox.js';
import { playAudio } from '../recorder.js';
import { saveAudio, loadAudio, deleteAudio } from '../audiodb.js';
import { addRecording, clipFor } from '../myvoice.js';
import { scriptGroups, scriptProgress, recorded } from '../voicescript.js';
import { matchLine } from '../match.js';
import { showVoiceName } from './voicepicker.js';
import { QUIET } from './line.js';
import { $, esc, vi, topBar } from '../ui.js';

function overview(root, app) {
  const { state } = app, groups = scriptGroups(), { done, total } = scriptProgress(state);
  const next = groups.find((g) => recorded(state, g.items) < g.items.length);
  const name = state.myVoice?.name || 'My voice';
  root.innerHTML = `${topBar((done / total) * 100, '#/')}
    <h1>Record ${esc(name)} for the lessons${vi('Ghi âm giọng của bạn cho các bài học')}</h1>
    <p class="muted">Say each line once. From then on, Listen plays your own recording on that line. Lines you have not recorded keep the browser voice.${vi('Đọc mỗi câu một lần. Từ đó nút Listen sẽ phát đúng bản ghi âm của bạn cho câu ấy. Câu chưa ghi âm vẫn dùng giọng của trình duyệt.')}</p>
    <p class="center"><span class="pct" data-done>${done} / ${total}</span><br><span class="muted small">lines recorded${vi('số câu đã ghi âm')}</span></p>
    ${next ? `<a class="btn big" href="#/myvoice/${next.id}">🎙 Record the next line</a>` : `<div class="note ok">Every line is recorded. Listen now plays your voice everywhere.${vi('Bạn đã ghi âm tất cả các câu.')}</div>`}
    ${['Sound drills', 'Conversations', 'More'].map((kind) => `<h2>${kind}</h2><div class="list">${groups.filter((g) => g.kind === kind).map((g) => {
    const n = recorded(state, g.items);
    return `<a class="card item" href="#/myvoice/${g.id}"><span class="body"><b>${esc(g.title)}</b>${vi(g.titleVi)}</span><span class="badge ${n === g.items.length ? 'ok' : ''}">${n} / ${g.items.length}</span></a>`;
  }).join('')}</div>`).join('')}`;
}

function record(root, app, group) {
  const { state } = app, { items } = group;
  const missing = items.findIndex((it) => !clipFor(state, it.t));
  let i = Math.max(0, missing), box = null;

  function show() {
    box?.destroy();
    box = null;
    if (i >= items.length) return app.go('#/myvoice');
    const item = items[i];
    root.innerHTML = `${topBar((i / items.length) * 100, '#/myvoice')}
      <div class="step-label">${esc(group.title)} · ${i + 1} of ${items.length}</div>
      <div class="line"><div class="target ${/\s/.test(item.t) ? '' : 'word'}">${esc(item.t)}</div>${vi(item.vi)}
        <p class="center small" data-status aria-live="polite"></p>
        <div data-speak></div><div class="result" data-result></div></div>
      <div class="footer">${i ? '<button class="btn ghost" data-prev>Back</button>' : ''}<button class="btn" data-next>Skip</button></div>`;
    const status = $('[data-status]', root), out = $('[data-result]', root), next = $('[data-next]', root);
    const paint = () => {
      const has = clipFor(state, item.t);
      status.innerHTML = has ? `✓ Recorded in ${esc(state.myVoice.name)}. <button class="btn sm ghost" data-play>▶ Play</button> Tap the microphone to record it again.` : `Tap the microphone and say this line.${vi('Chạm vào micro rồi đọc câu này.')}`;
      $('[data-play]', status)?.addEventListener('click', async () => playAudio(await loadAudio(clipFor(state, item.t))));
      next.textContent = has ? (i === items.length - 1 ? 'Done' : 'Next') : 'Skip';
    };
    paint();
    next.addEventListener('click', () => { i++; show(); });
    $('[data-prev]', root)?.addEventListener('click', () => { i--; show(); });
    box = speakBox($('[data-speak]', root), app, {
      maxSec: 14,
      async onResult(r) {
        if (!r.blob) { out.innerHTML = `<div class="note warn">Nothing was recorded. A recording needs the microphone.${vi('Chưa ghi âm được. Cần có micro để ghi âm.')}</div>`; return; }
        if (r.quiet) { out.innerHTML = QUIET; return; }
        const audio = await saveAudio(r.blob);
        if (!audio) { out.innerHTML = '<div class="note warn">This browser could not save the recording.</div>'; return; }
        const first = !state.myVoice;
        addRecording(state, { audio, text: item.t, vi: item.vi }).forEach(deleteAudio);
        if (first) state.settings.useMyVoice = true;
        app.save();
        showVoiceName(app);
        const m = matchLine(item.t, r.alternatives);
        out.innerHTML = m && m.pct < 100 ? `<div class="heard-box small">The browser heard: <q>${esc(m.transcript)}</q>. If you misread the line, record it again.${vi('Nếu bạn đọc nhầm, hãy ghi âm lại.')}</div>` : '';
        paint();
        playAudio(r.blob);
      },
    });
    $('.typed', root).hidden = true; // typing cannot make a recording
  }
  show();
  return () => box?.destroy();
}

export default function myvoice(root, app, [id]) {
  const group = id && scriptGroups().find((g) => g.id === id);
  return group ? record(root, app, group) : overview(root, app);
}
