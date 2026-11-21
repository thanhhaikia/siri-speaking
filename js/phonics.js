// Sound-level hints without a phoneme model: compare the spelling of the target word with what the
// recogniser heard and map the difference to the pronunciation errors Vietnamese learners make most.
import { similarity } from './scoring.js';

export const HINTS = {
  th: { sound: 'th /θ/ /ð/', en: 'Put the tip of your tongue between your teeth for "th" — not /t/, /d/ or /s/.', vi: 'Đặt đầu lưỡi giữa hai hàm răng khi đọc "th", đừng đọc thành /t/, /d/ hay /s/.' },
  finalS: { sound: 'final -s', en: 'Pronounce the final -s / -es clearly.', vi: 'Đọc rõ âm cuối -s / -es, đừng bỏ mất.' },
  finalEd: { sound: 'final -ed', en: 'Pronounce the -ed ending: /t/, /d/ or /ɪd/.', vi: 'Đọc rõ đuôi -ed: /t/, /d/ hoặc /ɪd/.' },
  finalCons: { sound: 'final consonant', en: 'Finish the word: release the last consonant.', vi: 'Đọc trọn từ: bật rõ phụ âm cuối.' },
  sh: { sound: 'sh /ʃ/', en: 'Round your lips and pull the tongue back for "sh" — it is not /s/.', vi: 'Tròn môi và lùi lưỡi về sau khi đọc "sh", khác với /s/.' },
  lr: { sound: '/l/ – /r/', en: 'For /r/ curl the tongue back without touching; for /l/ touch the ridge behind the teeth.', vi: '/r/: cuộn lưỡi về sau, không chạm vòm miệng; /l/: đầu lưỡi chạm lợi trên.' },
  ln: { sound: '/l/ – /n/', en: 'Do not mix /l/ and /n/: air leaves through the nose for /n/, around the tongue for /l/.', vi: 'Đừng lẫn /l/ và /n/: /n/ hơi ra mũi, /l/ hơi ra hai bên lưỡi.' },
  vw: { sound: '/v/ – /w/', en: 'For /v/ the top teeth touch the lower lip; for /w/ round the lips.', vi: '/v/: răng trên chạm môi dưới; /w/: tròn môi.' },
  pb: { sound: '/p/ – /b/', en: 'For /p/ push out a puff of air; /b/ is voiced.', vi: '/p/ bật hơi mạnh, không rung; /b/ rung dây thanh.' },
  vowelLen: { sound: '/ɪ/ – /iː/', en: 'Watch the vowel length: short /ɪ/ (ship) versus long /iː/ (sheep).', vi: 'Chú ý độ dài nguyên âm: /ɪ/ ngắn (ship) và /iː/ dài (sheep).' },
  ae: { sound: '/æ/ – /e/', en: 'Open your mouth wider for /æ/ (bad) than for /e/ (bed).', vi: 'Mở miệng rộng hơn cho /æ/ (bad) so với /e/ (bed).' },
  cluster: { sound: 'consonant cluster', en: 'Say the consonants together without adding a vowel between them.', vi: 'Đọc liền cụm phụ âm, không chèn nguyên âm vào giữa.' },
  stress: { sound: 'word stress', en: 'Check the word stress: make the stressed syllable longer and louder.', vi: 'Kiểm tra trọng âm: đọc âm tiết nhấn dài và to hơn.' },
  missing: { sound: 'missing word', en: 'This word was not heard. Say every word, including small ones.', vi: 'Không nghe thấy từ này. Hãy đọc đủ mọi từ, kể cả từ ngắn.' },
  generic: { sound: 'unclear', en: 'This word was unclear. Listen to the model and copy it slowly.', vi: 'Từ này chưa rõ. Hãy nghe mẫu và đọc chậm theo.' },
};

const VOWELS = 'aeiouy';
const ONSETS = /^(thr|str|spr|scr|spl|st|sp|sk|sc|sm|sn|sl|sw|tr|dr|pr|br|cr|gr|fr|pl|bl|cl|gl|fl)/;
const CODAS = /(sts|sks|xts|ths|lds|nds|kst|xt|sked|lps|mpt|nth)$/;
const same = (a, b, map) => a !== b && map(a) === map(b);

/** Rough syllable count from spelling. */
export function syllables(word) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.replace(/(?:[^laeiouy]es|[^tdaeiouy]ed|[^laeiouy]e)$/, '').match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Up to two hint ids explaining why `heard` differs from `target` (both lower-case words). */
export function hintIds(target, heard) {
  const t = String(target || '').toLowerCase().replace(/[^a-z']/g, '');
  const h = String(heard || '').toLowerCase().replace(/[^a-z' ]/g, '').trim();
  if (!t) return [];
  if (!h) return ['missing'];
  if (t === h) return [];
  const ids = [];
  const add = (id) => { if (!ids.includes(id)) ids.push(id); };
  if (t.includes('th') && !h.includes('th')) add('th');
  if (/sh/.test(t) && !/sh/.test(h)) add('sh');
  if (/s$/.test(t) && !/[sz]$/.test(h) && similarity(t.replace(/e?s$/, ''), h) >= 0.7) add('finalS');
  if (/ed$/.test(t) && !/(ed|t|d)$/.test(h)) add('finalEd');
  if (same(t, h, (s) => s.replace(/r/g, 'l'))) add('lr');
  if (same(t, h, (s) => s.replace(/^n/, 'l'))) add('ln');
  if (same(t, h, (s) => s.replace(/w/g, 'v'))) add('vw');
  if (same(t, h, (s) => s.replace(/p/g, 'b'))) add('pb');
  if (same(t, h, (s) => s.replace(/ee|ea|ie/g, 'i'))) add('vowelLen');
  if (same(t, h, (s) => s.replace(/a/g, 'e'))) add('ae');
  const tc = t.match(ONSETS)?.[0];
  if ((tc && !h.startsWith(tc)) || (CODAS.test(t) && !CODAS.test(h))) add('cluster');
  const last = t[t.length - 1];
  if (!ids.length && !VOWELS.includes(last) && last !== h[h.length - 1] && (t.startsWith(h) || similarity(t.slice(0, -1), h) >= 0.75)) add('finalCons');
  if (!ids.length && syllables(t) >= 3 && similarity(t, h) >= 0.5) add('stress');
  if (!ids.length) add('generic');
  return ids.slice(0, 2);
}

/** Hints for every imperfect word of a scored attempt: [{word, heard, ids}] plus the unique hint list. */
export function attemptHints(words) {
  const perWord = [];
  const seen = new Map();
  for (const w of words) {
    if (w.status === 'correct') continue;
    const tw = w.norm.split(' ');
    const hw = (w.heard || '').split(' ');
    const ids = w.status === 'missing' ? ['missing'] : hintIds(tw[tw.length - 1], hw[hw.length - 1] || '');
    perWord.push({ word: w.text, heard: w.heard, ids });
    for (const id of ids) seen.set(id, (seen.get(id) || 0) + 1);
  }
  const list = [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ id, count, ...HINTS[id] }));
  return { perWord, list };
}

const FUNCTION_WORDS = new Set("a an the of to in on at for from with by and or but if as than that this these those is am are was were be been do does did have has had will would can could should may might must i you he she it we they me him her us them my your his its our their there not n't so very just too it's i'm i'll i'd you're we're they're he's she's that's".split(' '));

/** Generic sentence-stress guide: content words in CAPS, function words in lower case. */
export function sentenceStress(text) {
  return String(text || '').split(/\s+/).filter(Boolean).map((w) => {
    const bare = w.toLowerCase().replace(/[^a-z']/g, '');
    return FUNCTION_WORDS.has(bare) ? w.toLowerCase() : w.toUpperCase();
  }).join(' ');
}
