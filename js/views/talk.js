// Role-play: three scripted conversations. Free answers are never marked word by word —
// any reply that carries an accepted idea completes the turn.
import { orderedScenarios, buildDialogue, dialogueSteps, versionCount } from '../dialogue.js';
import { scenarioById } from '../content/scenarios.js';
import { scenarioVisit, finishScenario } from '../store.js';
import { replyDone } from '../match.js';
import { playAudio } from '../recorder.js';
import { speakBox } from './speakbox.js';
import { linePractice, saveButton, QUIET } from './line.js';
import { $, $$, esc, vi, topBar } from '../ui.js';

function list(root, app) {
  root.innerHTML = `<h1>Role-play${vi('Hội thoại nhập vai')}</h1>
    <p class="muted">Four turns, about two minutes. Come back tomorrow and the conversation changes a little.${vi('Bốn lượt nói, khoảng hai phút. Ngày mai quay lại, cuộc hội thoại sẽ khác đi một chút.')}</p>
    <div class="list">${orderedScenarios(app.state.profile.focus).map((s) => {
    const visit = scenarioVisit(app.state, s.id), { twist } = buildDialogue(s, visit);
    return `<a class="card" href="#/talk/${s.id}"><div class="cover" style="background:linear-gradient(135deg, ${s.color}33, ${s.color}88)">${s.icon}</div>
        <div class="spread"><div><b>${esc(s.title)}</b>${vi(s.titleVi)}</div><span class="badge">Day ${(visit % versionCount(s)) + 1} of ${versionCount(s)}</span></div>
        ${twist ? `<p class="small muted" style="margin:8px 0 0">New today: ${esc(twist.note)}</p>` : ''}</a>`;
  }).join('')}</div>`;
}

function play(root, app, scenario) {
  const visit = scenarioVisit(app.state, scenario.id);
  const { turns, twist } = buildDialogue(scenario, visit);
  const steps = dialogueSteps(turns);
  const heard = turns.map(() => null); // last transcript per turn, for the summary
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
      <div class="note" style="margin-top:12px">For each turn: answer, hear yourself, practice one phrase, then answer again without the text.${vi('Mỗi lượt: trả lời, nghe lại giọng mình, luyện một cụm từ, rồi trả lời lại mà không nhìn câu mẫu.')}</div>`, 'Start');
  }

  function reply(step) {
    const { turn, hidden, index } = step;
    frame((i / steps.length) * 100, `<div class="step-label">Turn ${index + 1} of ${turns.length}${hidden ? ' · without the text' : ''}</div>
      <div class="bubble them"><span class="who">${esc(scenario.partner)} <button class="icon-btn" data-say aria-label="Listen again">🔊</button></span>${esc(turn.say)}${vi(turn.vi)}</div>
      <div class="situation"><b>Your turn${hidden ? ' — answer again from memory' : ''}</b><span lang="vi">${esc(turn.task)}</span></div>
      ${hidden ? '<div class="center"><button class="btn sm plain" data-hint>Show a sample answer</button></div><div class="samples" data-samples hidden></div>' : '<p class="small muted">You could say (tap to listen):</p><div class="samples" data-samples></div>'}
      <div data-speak></div><div class="result" data-result></div>`, 'Skip');
    const samples = $('[data-samples]', root);
    samples.innerHTML = turn.replies.map((r, k) => `<button type="button" class="sample" data-k="${k}">🔊 <span>${esc(r)}</span></button>`).join('');
    $$('.sample', samples).forEach((b) => b.addEventListener('click', () => app.say(turn.replies[b.dataset.k])));
    $('[data-hint]', root)?.addEventListener('click', (e) => { samples.hidden = false; e.target.hidden = true; });
    $('[data-say]', root).addEventListener('click', () => app.say(turn.say));
    app.say(turn.say);
    const out = $('[data-result]', root);
    let last = null;
    part = speakBox($('[data-speak]', root), app, {
      maxSec: 12,
      onResult(r) {
        last = r;
        if (r.quiet) { out.innerHTML = QUIET; return; }
        const check = replyDone(turn.accept, r.alternatives);
        if (check) heard[index] = check;
        const status = !check
          ? `<div class="note">${r.note ? `${esc(r.note.en)} ` : ''}Listen to your recording. Did you answer the question?${vi('Hãy nghe lại bản ghi âm. Bạn đã trả lời đúng câu hỏi chưa?')}</div>`
          : check.done ? `<div class="note ok">✓ That answers the question.${vi('Câu trả lời của bạn phù hợp với câu hỏi.')}</div>`
            : `<div class="note">The app heard something different from the samples. If you answered the question, go on — otherwise try again.${vi('Máy nghe ra câu khác với các câu mẫu. Nếu bạn đã trả lời đúng ý thì cứ tiếp tục, nếu chưa hãy thử lại.')}</div>`;
        out.innerHTML = `<div class="bubble me"><span class="who" style="color:#dbe7ff">You</span>${check ? `<span class="small">Here's what the app heard:</span><br>“${esc(check.transcript)}”` : 'Your recording'}
          ${r.url ? '<div style="margin-top:8px"><button class="btn sm ghost" data-me>▶ My voice</button></div>' : ''}</div>${status}<div class="row center" style="margin-top:12px" data-save></div>`;
        $('[data-me]', out)?.addEventListener('click', () => playAudio(r.url));
        saveButton($('[data-save]', out), app, { en: turn.replies[0], vi: turn.task, tip: turn.focus.tip.vi }, () => last?.blob);
        samples.hidden = false;
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
    const first = turns[Math.max(0, weakest)].focus;
    root.innerHTML = `${topBar(100, '#/talk')}<h1 class="center">Conversation done 🎉</h1><p class="center muted">${esc(scenario.title)}${vi('Bạn đã hoàn thành cuộc hội thoại hôm nay.')}</p>
      <h2>Here's what the app heard${vi('Những gì máy nghe được')}</h2>
      <div class="list">${turns.map((tn, k) => `<div class="card"><p class="small muted" style="margin:0">${esc(tn.say)}</p>
        <p style="margin:4px 0 0"><b>${heard[k] ? `“${esc(heard[k].transcript)}”` : '<span class="muted">Not transcribed — check your recording by ear</span>'}</b>${heard[k]?.done ? ' <span class="badge ok">answers the question</span>' : ''}</p></div>`).join('')}</div>
      <h2>Here's one thing to practice${vi('Một điều nên luyện thêm')}</h2>
      <div class="tip"><b>${esc(first.t)} ${esc(first.ipa)}</b>${esc(first.tip.en)}${vi(first.tip.vi)}</div>
      <p class="small muted center" style="margin-top:14px">Tomorrow this conversation changes a little.${vi('Ngày mai cuộc hội thoại này sẽ thay đổi một chút.')}</p>
      <div class="footer"><a class="btn ghost" href="#/talk">More role-plays</a><a class="btn" href="#/">Home</a></div>`;
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
