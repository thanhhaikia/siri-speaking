// Three short questions, one per screen: name, focus, model voice.
import { $, $$, esc, vi } from '../ui.js';

const FOCUS = [
  { id: 'daily', ic: '💬', en: 'Daily life', vi: 'Giao tiếp hằng ngày: nhà hàng, hàng xóm, mua sắm' },
  { id: 'work', ic: '💼', en: 'Work', vi: 'Công việc: báo cáo tiến độ, họp, trao đổi với đồng nghiệp' },
];
const ACCENTS = [{ id: 'en-US', ic: '🇺🇸', en: 'American English', vi: 'Giọng Anh-Mỹ' }, { id: 'en-GB', ic: '🇬🇧', en: 'British English', vi: 'Giọng Anh-Anh' }];

export default function onboarding(root, app) {
  const draft = { name: '', focus: 'daily', accent: 'en-US' };
  let step = 0;
  const choices = (list, key) => `<div class="choices">${list.map((c) => `<button type="button" class="choice ${draft[key] === c.id ? 'on' : ''}" data-key="${key}" data-id="${c.id}"><span class="ic">${c.ic}</span><span><b>${c.en}</b>${vi(c.vi)}</span></button>`).join('')}</div>`;
  const screens = [
    () => `<img class="logo" src="favicon.svg" alt=""><h1 class="center">Welcome to Siri-Speaking</h1>
      <p class="center muted">Clearer English for daily life and work, a few minutes a day.${vi('Nói tiếng Anh rõ ràng hơn trong đời sống và công việc, mỗi ngày vài phút.')}</p>
      <h2>What should we call you?${vi('Bạn tên là gì?')}</h2>
      <input type="text" id="name" maxlength="24" placeholder="Your name" value="${esc(draft.name)}" autocomplete="given-name">`,
    () => `<h1>Where do you need English most?${vi('Bạn cần tiếng Anh nhất ở đâu?')}</h1><p class="muted small">This decides which conversation comes first.</p>${choices(FOCUS, 'focus')}`,
    () => `<h1>Which model voice?${vi('Bạn muốn nghe giọng mẫu nào?')}</h1><p class="muted small">You can change it later in Profile.</p>${choices(ACCENTS, 'accent')}
      <div class="note" style="margin-top:16px">Your voice recordings and progress stay on this device. No account needed.${vi('Bản ghi âm và tiến độ chỉ lưu trên thiết bị này. Không cần tài khoản.')}</div>`,
  ];
  function paint() {
    root.innerHTML = `<div class="bar-top"><div class="progress"><i style="width:${((step + 1) / screens.length) * 100}%"></i></div></div>
      <form>${screens[step]()}<div class="footer">${step ? '<button type="button" class="btn ghost" data-back>Back</button>' : ''}<button class="btn">${step === screens.length - 1 ? 'Start' : 'Continue'}</button></div></form>`;
    $$('.choice', root).forEach((b) => b.addEventListener('click', () => { draft[b.dataset.key] = b.dataset.id; paint(); }));
    $('[data-back]', root)?.addEventListener('click', () => { step--; paint(); });
    $('form', root).addEventListener('submit', (e) => {
      e.preventDefault();
      if (step === 0) draft.name = $('#name', root).value.trim() || 'Friend';
      if (step < screens.length - 1) { step++; return paint(); }
      app.state.profile = { ...draft };
      app.save();
      app.go('#/');
    });
  }
  paint();
}
