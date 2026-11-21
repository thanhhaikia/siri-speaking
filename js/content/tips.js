// Daily tips on the mistakes Vietnamese speakers make most often. One per day, in rotation.
import { dayNumber } from '../days.js';

export const TIPS = [
  { title: '"think", not "sink"', en: 'For "th", put your tongue between your teeth and blow: think, three, thanks.', vi: 'Với "th", đặt lưỡi giữa hai hàm răng và thổi hơi: think, three, thanks. Đừng đọc thành "sink" hay "tink".' },
  { title: 'Say the final -s', en: '"Two books", "she works": the last /s/ carries meaning. Hold it for a moment.', vi: 'Tiếng Việt không có âm /s/ cuối nên rất dễ bỏ sót. "Two book" nghe sai ngữ pháp — hãy kéo nhẹ âm /s/.' },
  { title: 'Three ways to say -ed', en: 'worked /t/, played /d/, wanted /ɪd/. Only /t/ and /d/ sounds before -ed add a syllable.', vi: 'worked /t/, played /d/, wanted /ɪd/. Chỉ khi động từ kết thúc bằng /t/ hoặc /d/ thì -ed mới thành một âm tiết riêng.' },
  { title: 'Finish the word', en: '"Like", "light", "life" and "line" differ only in the last sound. Release it.', vi: '"Like", "light", "life", "line" chỉ khác nhau ở âm cuối. Nếu nuốt âm cuối, người nghe phải đoán.' },
  { title: '"she" is not "see"', en: 'For /ʃ/ round your lips as if saying "shhh". For /s/ keep them flat.', vi: 'Âm /ʃ/: chu tròn môi như khi nói "suỵt". Âm /s/: môi dẹt. "She" khác "see".' },
  { title: 'Stress one syllable', en: 'English words have one strong syllable: ho-TEL, com-PU-ter, PHO-to-graph. Make it longer and louder.', vi: 'Mỗi từ tiếng Anh có một âm tiết mạnh: ho-TEL, com-PU-ter. Đọc âm đó dài và to hơn, các âm còn lại lướt nhẹ.' },
  { title: 'Long and short "i"', en: '"ship" is short, "sheep" is long. "live" is short, "leave" is long.', vi: '"ship" ngắn, "sheep" dài; "live" ngắn, "leave" dài. Kéo dài nguyên âm khi thấy "ee" hoặc "ea".' },
  { title: 'Do not add a vowel', en: 'Say "stop", not "sờ-top"; "blue", not "bờ-lue". Keep the consonants together.', vi: 'Đọc liền các phụ âm: "stop" chứ không phải "sờ-tóp", "blue" chứ không phải "bờ-lu".' },
  { title: 'Link your words', en: '"Pick it up" sounds like "pi-ki-tup". Join a final consonant to the next vowel.', vi: 'Nối phụ âm cuối với nguyên âm đầu của từ sau: "pick it up" nghe như "pi-ki-tup".' },
  { title: 'Questions go up, or down', en: 'Yes/no questions rise at the end. Wh- questions (what, where, why) fall.', vi: 'Câu hỏi Yes/No lên giọng ở cuối. Câu hỏi có what, where, why thì xuống giọng.' },
  { title: '/l/ at the end', en: 'In "feel", "school" and "people", lift your tongue for the final /l/. Do not turn it into "u" or "n".', vi: 'Trong "feel", "school", "people", hãy nâng đầu lưỡi cho âm /l/ cuối. Đừng đọc thành "u" hay "n".' },
  { title: 'Slow is clear', en: 'Clear and a little slow is easier to understand than fast with missing endings.', vi: 'Nói rõ và hơi chậm dễ hiểu hơn nói nhanh mà mất âm cuối.' },
];
export const tipOfDay = (day) => TIPS[dayNumber(day) % TIPS.length];
