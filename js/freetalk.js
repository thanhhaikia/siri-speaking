// Free talk feedback: no scores. One transcript error would distort every score built on it,
// so the app shows what it heard and picks exactly one thing to practice.
import { checkGrammar } from './grammar.js';
import { dayNumber } from './days.js';

export const TOPICS = [
  { en: 'Describe your morning today.', vi: 'Hãy kể về buổi sáng hôm nay của bạn.' },
  { en: 'What did you do at work or at home this week?', vi: 'Tuần này bạn đã làm gì ở chỗ làm hoặc ở nhà?' },
  { en: 'Talk about a meal you like and how it is made.', vi: 'Hãy nói về một món ăn bạn thích và cách nấu món đó.' },
  { en: 'Describe the place where you live.', vi: 'Hãy tả nơi bạn đang sống.' },
  { en: 'What are your plans for the weekend?', vi: 'Cuối tuần này bạn định làm gì?' },
  { en: 'Explain your job to someone you just met.', vi: 'Hãy giải thích công việc của bạn cho một người mới quen.' },
  { en: 'Talk about a person who helped you.', vi: 'Hãy nói về một người đã từng giúp đỡ bạn.' },
];
export const topicOfDay = (day, shift = 0) => TOPICS[(dayNumber(day) + shift) % TOPICS.length];

const FILLERS = ['um', 'uh', 'er', 'erm', 'hmm', 'ah', 'you know', 'i mean', 'kind of', 'sort of'];
export function countFillers(text) {
  const s = ` ${String(text || '').toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ')} `;
  const found = [];
  for (const f of FILLERS) { const n = s.split(` ${f} `).length - 1 + (s.match(new RegExp(` ${f} (?=${f} )`, 'g')) || []).length; if (n) found.push({ word: f, n }); }
  return { total: found.reduce((a, b) => a + b.n, 0), found: found.sort((a, b) => b.n - a.n) };
}

// Words with the sounds Vietnamese speakers most often lose; used to pick a word from the learner's own speech.
const SOUNDS = [
  { id: 'th', re: /^(th\w{2,}|\w+th)$/, skip: /^(the|this|that|they|then|them|there|their|these|those|than|with)$/ },
  { id: 'finalEd', re: /^\w{3,}ed$/ },
  { id: 'sh', re: /^\w*sh\w*$/, skip: /^she$/ },
  { id: 'finalS', re: /^\w{4,}[^su]s$/, skip: /^(this|always|perhaps|sometimes)$/ },
];
export function hardWord(text) {
  const words = String(text || '').toLowerCase().match(/[a-z']+/g) || [];
  for (const s of SOUNDS) { const w = words.find((x) => s.re.test(x) && !s.skip?.test(x)); if (w) return { word: w, id: s.id }; }
  return null;
}

/**
 * Exactly one suggestion. Order: nothing usable, fillers, long pauses, a sentence pattern, a word to repeat.
 * @param {{transcript: string|null, stats?: {totalSec: number, pauses: number}|null}} take
 * @returns {{kind: string, en: string, vi: string, drill?: string}}
 */
export function oneThing({ transcript, stats = null }) {
  const words = (transcript || '').match(/[A-Za-z']+/g) || [];
  if (!words.length) return { kind: 'listen', en: 'Play your recording once. Pick the one sentence that was hardest to say and say it again, slower.', vi: 'Hãy nghe lại bản ghi âm một lần. Chọn câu khó nói nhất và nói lại câu đó chậm hơn.' };
  if (words.length < 12) return { kind: 'longer', en: 'Say a little more next time: add one reason or one example to your answer.', vi: 'Lần sau hãy nói dài hơn một chút: thêm một lý do hoặc một ví dụ.' };
  const fillers = countFillers(transcript);
  if (fillers.total >= 3) return { kind: 'fillers', en: `The app heard "${fillers.found[0].word}" ${fillers.found[0].n} times. When you need time to think, stay silent for a moment instead.`, vi: `Máy nghe thấy "${fillers.found[0].word}" ${fillers.found[0].n} lần. Khi cần nghĩ, hãy im lặng một nhịp thay vì chêm từ đệm.` };
  if (stats?.totalSec >= 15 && stats.pauses / stats.totalSec > 0.25) return { kind: 'pauses', en: 'There were many long stops. Plan one short sentence at a time, then say it without stopping.', vi: 'Bạn ngắt quãng khá nhiều. Hãy nghĩ sẵn từng câu ngắn, rồi nói liền một hơi hết câu.' };
  const issue = checkGrammar(transcript).issues[0];
  if (issue) return { kind: 'pattern', en: `The app heard "${issue.wrong}". If that is what you said, try "${issue.right}". ${issue.en}`, vi: issue.vi, drill: issue.right };
  const hard = hardWord(transcript);
  if (hard) return { kind: 'word', id: hard.id, en: `You used the word "${hard.word}". Say it again on its own and listen to how it ends and begins.`, vi: `Bạn đã dùng từ "${hard.word}". Hãy nói riêng từ này và nghe kỹ âm đầu, âm cuối.`, drill: hard.word };
  return { kind: 'listen', en: 'Play your recording and listen to the last sound of each word. Choose one sentence and say it again.', vi: 'Hãy nghe lại bản ghi âm và chú ý âm cuối của từng từ. Chọn một câu và nói lại.' };
}
