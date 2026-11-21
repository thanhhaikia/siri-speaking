// Weekly voice comparison: save one short recording, say the same line a week later, play both back
// and answer one concrete listening question.
import { VOICE_LINES } from '../content/voicelines.js';
import { voiceStatus, markDone, VOICE_GAP_DAYS } from '../store.js';
import { dayKey } from '../days.js';
import { saveAudio, loadAudio, deleteAudio } from '../audiodb.js';
import { playAudio } from '../recorder.js';
import { speakBox } from './speakbox.js';
import { QUIET } from './line.js';
import { $, $$, esc, vi, topBar, fmtDate, toast } from '../ui.js';

export default function voice(root, app, [mode]) {
  const { state } = app;
  state.voice ||= { line: 0, first: null, history: [] };
  const v = state.voice, line = VOICE_LINES[v.line % VOICE_LINES.length];
  const status = voiceStatus(state);
  const stage = status.stage === 'wait' && mode === 'now' ? 'compare' : status.stage;
  let part = null, take = null;
  const head = `${topBar(stage === 'record' ? 0 : stage === 'wait' ? 50 : 90, '#/me')}<h1>Weekly voice check${vi('So sánh giọng nói hằng tuần')}</h1>`;
  const lineCard = `<div class="card" style="margin:14px 0"><div class="target" style="font-size:1.4rem">${esc(line.t)}</div>${vi(line.vi)}<div class="row center" style="margin-top:8px"><button class="btn sm ghost" data-model>🔊 Listen</button></div></div>`;

  if (stage === 'wait') {
    root.innerHTML = `${head}<p class="muted">Recorded on ${fmtDate(new Date(v.first.day + 'T12:00'))}. Say the same line again in ${status.daysLeft} day${status.daysLeft === 1 ? '' : 's'} and hear the difference.${vi(`Bạn đã ghi âm. ${status.daysLeft} ngày nữa hãy nói lại câu này để nghe sự khác biệt.`)}</p>
      ${lineCard}<div class="row center"><button class="btn sm ghost" data-old>▶ My first recording</button></div>
      <div class="footer"><a class="btn ghost" href="#/voice/now">Compare now</a><a class="btn" href="#/">Home</a></div>`;
    $('[data-old]', root).addEventListener('click', async () => playAudio(await loadAudio(v.first.audio)));
    $('[data-model]', root).addEventListener('click', () => app.say(line.t));
    return undefined;
  }

  root.innerHTML = `${head}<p class="muted">${stage === 'record' ? `Say this line once. In ${VOICE_GAP_DAYS} days you will say it again and compare.` : 'Say the same line again, then listen to both recordings.'}${vi(stage === 'record' ? 'Hãy nói câu này một lần. Sau 7 ngày bạn sẽ nói lại và so sánh.' : 'Hãy nói lại đúng câu này, rồi nghe cả hai bản ghi âm.')}</p>
    ${lineCard}<div data-speak></div><div class="result" data-result></div><div class="footer" data-foot><a class="btn plain" href="#/">Not now</a></div>`;
  $('[data-model]', root).addEventListener('click', () => app.say(line.t));
  const out = $('[data-result]', root), foot = $('[data-foot]', root);
  part = speakBox($('[data-speak]', root), app, {
    maxSec: 10,
    onResult(r) {
      if (r.quiet || !r.blob) { out.innerHTML = r.blob ? QUIET : `<div class="note warn">This check needs a recording, so it needs a microphone.${vi('Phần này cần ghi âm nên cần có micro.')}</div>`; return; }
      take = r;
      if (stage === 'record') {
        out.innerHTML = '<div class="row center"><button class="btn sm ghost" data-now>▶ My recording</button></div>';
        foot.innerHTML = '<button class="btn" data-keep>Save this recording</button>';
        $('[data-keep]', root).addEventListener('click', async () => {
          const audio = await saveAudio(take.blob);
          if (!audio) { toast('This browser could not save the recording, so there is nothing to compare later.'); return; }
          v.first = { day: dayKey(), audio };
          markDone(state, 'voice'); app.save(); app.go('#/voice');
        });
      } else {
        out.innerHTML = `<div class="row center"><button class="btn sm ghost" data-old>▶ ${fmtDate(new Date(v.first.day + 'T12:00'))}</button><button class="btn sm ghost" data-now>▶ Today</button></div>
          <div class="tip" style="margin-top:14px"><b>Listen for one thing</b>${esc(line.ask)}${vi(line.askVi)}</div>
          <div class="choices" style="margin-top:12px">${[['yes', 'Yes, clearly today', 'Có, hôm nay nghe rõ'], ['same', 'About the same', 'Gần như không đổi'], ['no', 'Not yet', 'Chưa nghe thấy']].map(([id, en, viText]) => `<button class="choice" data-ans="${id}"><span><b>${en}</b>${vi(viText)}</span></button>`).join('')}</div>`;
        foot.innerHTML = '';
        $('[data-old]', out).addEventListener('click', async () => playAudio(await loadAudio(v.first.audio)));
        $$('[data-ans]', out).forEach((b) => b.addEventListener('click', async () => {
          const old = v.first.audio;
          v.history.unshift({ line: line.t, from: v.first.day, to: dayKey(), answer: b.dataset.ans });
          // "Yes" moves on to a new line; otherwise today's recording becomes the one to beat next week.
          // If today's recording cannot be saved, the old one stays as the baseline.
          const audio = b.dataset.ans === 'yes' ? null : await saveAudio(take.blob);
          if (b.dataset.ans === 'yes') { v.line++; v.first = null; } else if (audio) v.first = { day: dayKey(), audio };
          if (v.first?.audio !== old) deleteAudio(old);
          markDone(state, 'voice'); app.save(); app.go('#/me');
        }));
      }
      $('[data-now]', out).addEventListener('click', () => playAudio(take.blob));
    },
  });
  return () => part?.destroy();
}
