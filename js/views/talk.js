// Role-play: scripted conversations. A free answer is never graded: the browser's transcript cannot judge
// meaning, so a turn only shows what was heard, soft key-word hints, and always lets the learner continue.
// Two sounds are kept apart: "Listen (Coach)" is always the coach voice; the learner's own answer is
// "My saved take", stored only when they tap "Save this take".
import { orderedScenarios, buildDialogue, dialogueSteps, versionCount } from '../dialogue.js';
import { scenarioById } from '../content/scenarios.js';
import { scenarioVisit, finishScenario } from '../store.js';
import { keywordHints } from '../match.js';
import { playAudio, stopAudio } from '../recorder.js';
import { stopSpeaking } from '../speech.js';
import * as audiodb from '../audiodb.js';
import { replyKey, takeFor } from '../takes.js';
import { speakBox } from './speakbox.js';
import { linePractice, saveButton, takeRow, keepButton, speedButton, QUIET, noWords } from './line.js';
import { $, $$, esc, vi, topBar } from '../ui.js';

function list(root, app) {
  root.innerHTML = `<h1>Role-play${vi('Hội thoại nhập vai')}</h1>
    <p class="muted">Four turns, about two minutes. Open any conversation you like. Come back tomorrow and it changes a little.${vi('Bốn lượt nói, khoảng hai phút. Bạn có thể mở bất kỳ bài nào. Ngày mai quay lại, cuộc hội thoại sẽ khác đi một chút.')}</p>
    <div class="list">${orderedScenarios(app.state.profile.focus).map((s) => {
    const visit = scenarioVisit(app.state, s.id), { twist } = buildDialogue(s, visit);
    return `<a class="card" href="#/talk/${s.id}"><div class="cover" style="background:linear-gradient(135deg, ${s.color}33, ${s.color}88)">${s.icon}</div>
        <div class="spread"><div><b>${esc(s.title)}</b>${vi(s.titleVi)}</div><span class="badge">${s.optional ? 'Optional · ' : ''}Day ${(visit % versionCount(s)) + 1} of ${versionCount(s)}</span></div>
        ${twist ? `<p class="small muted" style="margin:8px 0 0">New today: ${esc(twist.note)}</p>` : ''}</a>`;
  }).join('')}</div>`;
}

/**
 * "Play full dialogue": the partner's lines in the coach voice; the learner's lines in the coach voice too, or —
 * with the one toggle on — as their saved takes, coach voice where a line has none. Returns a function that stops playback.
 */
function fullDialogue(host, app, scenario, lines) {
  const s = app.state.settings;
  let run = 0;
  const keys = lines.map((t) => replyKey(scenario.id, t));
  const saved = () => keys.filter((k) => takeFor(app.state, k)).length;
  host.innerHTML = `<label class="check"><input type="checkbox" data-use ${s.useTakes ? 'checked' : ''}> <span>Use my saved takes for my lines (coach voice if missing) <span class="small muted">· ${saved()} of ${lines.length} saved</span>${vi('Dùng các câu bạn đã lưu cho phần của bạn (câu nào chưa lưu thì dùng giọng mẫu)')}</span></label>
    <div class="dialogue">${lines.map((t, k) => `<div class="bubble them" data-row="p${k}"><span class="who">${esc(scenario.partner)}</span>${esc(t.say)}</div>
      <div class="bubble me" data-row="l${k}"><span class="who" style="color:#dbe7ff">You <span class="badge" data-src="${k}"></span></span>${esc(t.replies[0])}</div>`).join('')}</div>
    <p class="center"><button class="btn" data-play>▶ Play full dialogue</button></p>`;
  const btn = $('[data-play]', host), use = $('[data-use]', host);
  const mine = (k) => (use.checked ? takeFor(app.state, keys[k]) : null);
  const label = () => $$('[data-src]', host).forEach((b) => { b.textContent = mine(+b.dataset.src) ? 'My take' : 'Coach voice'; });
  const mark = (row) => $$('[data-row]', host).forEach((el) => el.classList.toggle('on', el.dataset.row === row));
  const stop = () => { run++; stopSpeaking(); stopAudio(); mark(null); btn.textContent = '▶ Play full dialogue'; };
  use.addEventListener('change', () => { s.useTakes = use.checked; app.save(); label(); });
  btn.addEventListener('click', async () => {
    if (btn.textContent.startsWith('■')) return stop();
    const me = ++run;
    btn.textContent = '■ Stop';
    for (let k = 0; k < lines.length && me === run; k++) {
      mark(`p${k}`);
      await app.say(lines[k].say);
      if (me !== run) return;
      mark(`l${k}`);
      const take = mine(k), blob = take && await audiodb.loadAudio(take.audio);
      if (me !== run) return;
      if (blob) await playAudio(blob); else await app.say(lines[k].replies[0]);
    }
    if (me === run) stop();
  });
  label();
  return stop;
}

function play(root, app, scenario) {
  const visit = scenarioVisit(app.state, scenario.id);
  const { turns, twist, final } = buildDialogue(scenario, visit);
  const lines = final ? [...turns, final] : turns; // every learner line of today's version
  const steps = dialogueSteps(turns, final);
  const heard = lines.map(() => null); // last transcript per line, for the summary
  const focusPct = turns.map(() => null); // % of words heard in each focus phrase
  let i = -1, part = null;

  const frame = (pct, body, nextLabel) => {
    part?.destroy();
    part = null;
    root.innerHTML = `${topBar(pct, '#/talk')}${body}<div class="footer"><button class="btn" data-next>${nextLabel}</button></div>`;
    $('[data-next]', root).addEventListener('click', () => { i++; show(); });
  };
  const attempted = () => { $('[data-next]', root).textContent = i === steps.length - 1 ? 'Finish' : 'Next'; };

  function intro() {
    frame(0, `<div class="cover" style="background:linear-gradient(135deg, ${scenario.color}33, ${scenario.color}88)">${scenario.icon}</div>
      <h1>${esc(scenario.title)}${vi(scenario.titleVi)}</h1>
      <p>${esc(scenario.intro)}${vi(scenario.introVi)}</p>
      ${twist ? `<div class="note warn"><b>New today:</b> ${esc(twist.note)}${vi(twist.noteVi)}</div>` : ''}
      <div class="note" style="margin-top:12px">For each turn: answer, hear yourself, practice one phrase, then answer again without the text. A short answer is fine, and nothing is marked wrong. At the end there is one optional question to answer without the script.${vi('Mỗi lượt: trả lời, nghe lại giọng mình, luyện một cụm từ, rồi trả lời lại mà không nhìn câu mẫu. Trả lời ngắn cũng được, và không có câu nào bị chấm sai. Cuối bài có một câu hỏi không bắt buộc để bạn tự trả lời, không có câu mẫu.')}</div>
      <details class="full"><summary>Play full dialogue${vi('Nghe toàn bộ cuộc hội thoại')}</summary><div data-full></div></details>`, 'Start');
    const stop = fullDialogue($('[data-full]', root), app, scenario, lines);
    part = { destroy: stop };
  }

  function reply(step) {
    const { turn, hidden, index, open } = step, key = replyKey(scenario.id, turn);
    const label = open ? 'Optional · Try without the script' : `Turn ${index + 1} of ${turns.length}${hidden ? ' · without the text' : ''}`;
    frame((i / steps.length) * 100, `<div class="step-label">${label}</div>
      <div class="bubble them"><span class="who">${esc(scenario.partner)}</span>${esc(turn.say)}${vi(turn.vi)}
        <div class="row" style="margin-top:8px"><button class="btn sm ghost" data-say>🔊 Listen (Coach)</button><button class="btn sm ghost" data-speed></button></div></div>
      <div class="situation"><b>Your turn${open ? ' — in your own words' : hidden ? ' — answer again from memory' : ''}</b><span lang="vi">${esc(turn.task)}</span></div>
      ${open ? '<div data-phrases hidden><p class="small muted">Useful phrases — compare them with what you said (tap to hear the coach):</p><div class="samples" data-samples></div></div>'
    : hidden ? '<div class="center"><button class="btn sm plain" data-hint>Show a sample answer</button></div><div class="samples" data-samples hidden></div>' : '<p class="small muted">You could say (tap to hear the coach). A short answer is fine.</p><div class="samples" data-samples></div>'}
      <div data-saved></div>
      <div data-speak></div><div class="result" data-result></div>`, 'Skip');
    const samples = $('[data-samples]', root), savedRow = $('[data-saved]', root);
    samples.innerHTML = turn.replies.map((r, k) => `<button type="button" class="sample" data-k="${k}">🔊 <span>${esc(r)}</span></button>`).join('');
    $$('.sample', samples).forEach((b) => b.addEventListener('click', () => app.say(turn.replies[b.dataset.k])));
    $('[data-hint]', root)?.addEventListener('click', (e) => { samples.hidden = false; e.target.hidden = true; });
    $('[data-say]', root).addEventListener('click', () => app.say(turn.say));
    speedButton($('[data-speed]', root), app);
    takeRow(savedRow, app, key);
    app.say(turn.say);
    const out = $('[data-result]', root);
    let last = null;
    part = speakBox($('[data-speak]', root), app, {
      maxSec: 12,
      onResult(r) {
        last = r;
        if (r.quiet) { out.innerHTML = QUIET; return; }
        // Turn 5 is never checked; a guided turn gets soft key-word hints only.
        const alts = (r.alternatives || []).filter((a) => a && a.trim());
        const check = open ? (alts.length ? { transcript: alts[0], heard: [] } : null) : keywordHints(turn.accept, r.alternatives);
        if (check) heard[index] = check;
        const status = !check ? noWords(app, r, `Listen to your recording: did you answer the question? Then try again or continue.${vi('Hãy nghe lại bản ghi âm: bạn đã trả lời đúng câu hỏi chưa? Sau đó thử lại hoặc đi tiếp.')}`)
          : open ? `<div class="note">This answer is not checked. Replay it and compare it with the useful phrases below.${vi('Câu trả lời này không được chấm. Hãy nghe lại và so sánh với các cụm từ gợi ý bên dưới.')}</div>`
            : check.heard.length ? `<div class="note ok">Key words the browser heard: ${check.heard.map((w) => `<b>${esc(w)}</b>`).join(', ')}. This is a hint, not a grade.${vi('Những từ khóa trình duyệt nghe được. Đây chỉ là gợi ý, không phải điểm.')}</div>`
              : `<div class="note">The browser did not pick up a key word such as ${check.examples.map((w) => `“${esc(w)}”`).join(' or ')}. It can mishear, and other answers are fine too: replay your recording, then try again or continue.${vi('Trình duyệt chưa nghe được từ khóa nào. Máy có thể nghe nhầm, và câu trả lời khác vẫn có thể đúng: hãy nghe lại bản ghi âm rồi thử lại hoặc đi tiếp.')}</div>`;
        out.innerHTML = `<div class="bubble me"><span class="who" style="color:#dbe7ff">You</span>${check ? `<span class="small">Here's what the app heard:</span><br>“${esc(check.transcript)}”` : 'Your recording'}
          ${r.blob ? `<div class="row" style="margin-top:8px"><button class="btn sm ghost" data-me>▶ My recording · ${r.sec} sec</button><button class="btn sm ghost" data-keep>💾 Save this take</button></div>` : ''}</div>${status}<div class="row center" style="margin-top:12px" data-save></div>`;
        $('[data-me]', out)?.addEventListener('click', () => playAudio(r.blob));
        if (r.blob) keepButton($('[data-keep]', out), app, key, r, turn.say, () => takeRow(savedRow, app, key));
        saveButton($('[data-save]', out), app, { en: turn.replies[0], vi: turn.task, tip: turn.focus?.tip.vi || '' }, () => last?.blob);
        samples.hidden = false;
        if ($('[data-phrases]', root)) $('[data-phrases]', root).hidden = false;
        if ($('[data-hint]', root)) $('[data-hint]', root).hidden = true;
        attempted();
      },
    });
  }

  function focus(step) {
    frame((i / steps.length) * 100, `<div class="step-label">Turn ${step.index + 1} · practice this phrase</div><div data-line></div>`, 'Skip');
    const fz = step.turn.focus;
    part = linePractice($('[data-line]', root), app, { item: { t: fz.t, ipa: fz.ipa, s: fz.s, vi: step.turn.task }, tip: fz.tip, kind: 'talk', onAttempt: (a) => { focusPct[step.index] = a.pct; attempted(); } });
  }

  function summary() {
    finishScenario(app.state, scenario.id);
    app.save();
    part?.destroy();
    part = null;
    // The focus phrase the browser heard least completely; the first one when nothing was transcribed.
    const weakest = focusPct.reduce((best, p, k) => (p != null && (best < 0 || p < focusPct[best]) ? k : best), -1);
    const first = turns[Math.max(0, weakest)].focus, more = scenario.next && scenarioById(scenario.next);
    root.innerHTML = `${topBar(100, '#/talk')}<h1 class="center">Conversation done 🎉</h1><p class="center muted">${esc(scenario.title)}${vi('Bạn đã hoàn thành cuộc hội thoại hôm nay.')}</p>
      <h2>Here's what the app heard${vi('Những gì máy nghe được')}</h2>
      <div class="list">${lines.map((tn, k) => `<div class="card"><p class="small muted" style="margin:0">${esc(tn.say)}</p>
        <p style="margin:4px 0 0"><b>${heard[k] ? `“${esc(heard[k].transcript)}”` : '<span class="muted">Not transcribed — check your recording by ear</span>'}</b>${heard[k]?.heard.length ? ` <span class="badge ok">key words heard: ${esc(heard[k].heard.join(', '))}</span>` : ''}</p></div>`).join('')}</div>
      <h2>Here's one thing to practice${vi('Một điều nên luyện thêm')}</h2>
      <div class="tip"><b>${esc(first.t)} ${esc(first.ipa)}</b>${esc(first.tip.en)}${vi(first.tip.vi)}</div>
      <h2>Play full dialogue${vi('Nghe toàn bộ cuộc hội thoại')}</h2>
      <div data-full></div>
      ${more ? `<h2>Want more?${vi('Muốn luyện thêm?')}</h2><a class="card item" href="#/talk/${more.id}"><span class="body"><b>${esc(more.title)}</b>${vi(more.titleVi)}</span><span class="badge">Optional</span></a>` : ''}
      <p class="small muted center" style="margin-top:14px">Tomorrow this conversation changes a little.${vi('Ngày mai cuộc hội thoại này sẽ thay đổi một chút.')}</p>
      <div class="footer"><a class="btn ghost" href="#/talk">More role-plays</a><a class="btn" href="#/">Home</a></div>`;
    part = { destroy: fullDialogue($('[data-full]', root), app, scenario, lines) };
  }

  function show() {
    if (i < 0) return intro();
    if (i >= steps.length) return summary();
    return steps[i].kind === 'reply' ? reply(steps[i]) : focus(steps[i]);
  }
  show();
  return () => part?.destroy();
}

export default function talk(root, app, [id]) {
  const scenario = id && scenarioById(id);
  return scenario ? play(root, app, scenario) : list(root, app);
}
