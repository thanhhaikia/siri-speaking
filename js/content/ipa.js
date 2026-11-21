// Word → IPA and stress guide, collected from the lessons and the phrase list.
import { LESSONS } from './lessons.js';
import { VOCAB } from './vocab.js';

const map = new Map();
for (const l of LESSONS) for (const it of l.items) if (it.type === 'word') map.set(it.t.toLowerCase(), { ipa: it.ipa, s: it.s });
for (const v of VOCAB) if (!map.has(v.w)) map.set(v.w, { ipa: v.ipa, s: v.s });

export const ipaFor = (word) => map.get(String(word || '').toLowerCase().replace(/[^a-z']/g, '')) || null;
