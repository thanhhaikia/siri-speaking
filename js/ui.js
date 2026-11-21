// Small DOM helpers shared by views.
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** Vietnamese helper line under an English line (hidden when Vietnamese help is switched off). */
export const vi = (text) => (text ? `<span class="vi" lang="vi">${esc(text)}</span>` : '');
/** English text with its Vietnamese helper. */
export const t = (en, viText) => `${esc(en)}${vi(viText)}`;

export function toast(msg, ms = 2600) {
  let box = $('#toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.classList.add('out'), ms);
  setTimeout(() => el.remove(), ms + 400);
}

export function modal(inner, onClose) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Close">✕</button>${inner}</div>`;
  const close = () => { wrap.remove(); onClose?.(); };
  wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('.modal-x') || e.target.closest('[data-close]')) close(); });
  document.body.appendChild(wrap);
  return { el: wrap.firstElementChild, close };
}

export function ring(pct, size = 170, big = '', label = '') {
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return `<div class="ring ${pct >= 100 ? 'full' : ''}" style="width:${size}px;height:${size}px" role="img" aria-label="${esc(big)} ${esc(label)}">
    <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="${r}"/><circle class="ring-fg" cx="60" cy="60" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
    <div class="ring-val"><b>${esc(big)}</b><small>${esc(label)}</small></div></div>`;
}

export const topBar = (pct, backHref = '#/') => `<div class="bar-top"><a class="x" href="${backHref}" aria-label="Close">✕</a><div class="progress"><i style="width:${Math.round(pct)}%"></i></div><button class="voice-btn" data-voice aria-label="Change the model voice">🗣️ Voice</button></div>`;
export const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
