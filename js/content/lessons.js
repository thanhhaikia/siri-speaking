// Original pronunciation lessons. Each item: t = text to say, s = stress hint (CAPS = stressed syllable/word),
// ipa = phonetic guide for single words, vi = Vietnamese meaning.
export const LESSON_TOPICS = [
  { id: 'sounds', en: 'Tricky sounds', vi: 'Âm khó' },
  { id: 'endings', en: 'Ending sounds', vi: 'Âm cuối' },
  { id: 'stress', en: 'Word stress', vi: 'Trọng âm từ' },
  { id: 'intonation', en: 'Intonation & rhythm', vi: 'Ngữ điệu & nhịp' },
  { id: 'daily', en: 'Daily life', vi: 'Đời sống hằng ngày' },
  { id: 'work', en: 'Work & study', vi: 'Công việc & học tập' },
  { id: 'travel', en: 'Travel', vi: 'Du lịch' },
];

const w = (t, s, ipa, vi) => ({ t, s, ipa, vi, type: 'word' });
const x = (t, s, vi) => ({ t, s, vi, type: 'sentence' });

export const LESSONS = [
  {
    id: 'th-voiceless', topic: 'sounds', level: 1, title: 'The /θ/ sound (think)', titleVi: 'Âm /θ/ như trong "think"',
    tip: 'Đặt đầu lưỡi giữa hai hàm răng, thổi hơi nhẹ ra — không đọc thành /t/ hay /s/. Ví dụ "think" không phải "tink" hay "sink".',
    items: [w('think', 'THINK', '/θɪŋk/', 'nghĩ'), w('three', 'THREE', '/θriː/', 'số ba'), w('birthday', 'BIRTH·day', '/ˈbɜːθdeɪ/', 'sinh nhật'), w('healthy', 'HEAL·thy', '/ˈhelθi/', 'khỏe mạnh'), x('I think it is Thursday.', 'I THINK it is THURS·day', 'Tôi nghĩ hôm nay là thứ Năm.'), x('Thank you for the three books.', 'THANK you for the THREE BOOKS', 'Cảm ơn bạn vì ba cuốn sách.')],
  },
  {
    id: 'th-voiced', topic: 'sounds', level: 1, title: 'The /ð/ sound (this)', titleVi: 'Âm /ð/ như trong "this"',
    tip: 'Giống /θ/ nhưng rung dây thanh. Đặt tay lên cổ họng, bạn sẽ thấy rung. Không đọc "this" thành "dis" hay "zis".',
    items: [w('this', 'THIS', '/ðɪs/', 'này'), w('mother', 'MOTH·er', '/ˈmʌðər/', 'mẹ'), w('weather', 'WEATH·er', '/ˈweðər/', 'thời tiết'), w('together', 'to·GETH·er', '/təˈɡeðər/', 'cùng nhau'), x('My mother and father live there.', 'my MOTH·er and FATH·er LIVE THERE', 'Bố mẹ tôi sống ở đó.'), x('The weather is better than yesterday.', 'the WEATH·er is BET·ter than YES·ter·day', 'Thời tiết tốt hơn hôm qua.')],
  },
  {
    id: 'sh-s', topic: 'sounds', level: 1, title: '/ʃ/ vs /s/ (she / see)', titleVi: 'Phân biệt /ʃ/ và /s/',
    tip: '/s/: lưỡi gần răng, môi bình thường. /ʃ/: môi tròn và hơi chu ra, lưỡi lùi về sau. Người Việt hay đọc "she" thành "si".',
    items: [w('she', 'SHE', '/ʃiː/', 'cô ấy'), w('see', 'SEE', '/siː/', 'nhìn thấy'), w('shoes', 'SHOES', '/ʃuːz/', 'giày'), w('station', 'STA·tion', '/ˈsteɪʃən/', 'nhà ga'), x('She sells sea shells.', 'SHE SELLS SEA SHELLS', 'Cô ấy bán vỏ sò.'), x('Please show me your passport.', 'PLEASE SHOW me your PASS·port', 'Vui lòng cho tôi xem hộ chiếu.')],
  },
  {
    id: 'short-long-i', topic: 'sounds', level: 1, title: '/ɪ/ vs /iː/ (ship / sheep)', titleVi: 'Âm i ngắn và i dài',
    tip: '/iː/ kéo dài, miệng cười rộng (sheep). /ɪ/ ngắn, thả lỏng (ship). Đọc sai có thể đổi nghĩa: "ship" (tàu) ≠ "sheep" (cừu).',
    items: [w('ship', 'SHIP', '/ʃɪp/', 'con tàu'), w('sheep', 'SHEEP', '/ʃiːp/', 'con cừu'), w('live', 'LIVE', '/lɪv/', 'sống'), w('leave', 'LEAVE', '/liːv/', 'rời đi'), x('Please sit in this seat.', 'PLEASE SIT in THIS SEAT', 'Vui lòng ngồi vào ghế này.'), x('We eat fish and green beans.', 'we EAT FISH and GREEN BEANS', 'Chúng tôi ăn cá và đậu xanh.')],
  },
  {
    id: 'ae-e', topic: 'sounds', level: 2, title: '/æ/ vs /e/ (bad / bed)', titleVi: 'Phân biệt /æ/ và /e/',
    tip: '/æ/: mở miệng rộng, hàm dưới hạ thấp, giữa "a" và "e" (bad, man). /e/: miệng mở vừa (bed, men).',
    items: [w('bad', 'BAD', '/bæd/', 'tệ'), w('bed', 'BED', '/bed/', 'giường'), w('apple', 'AP·ple', '/ˈæpəl/', 'quả táo'), w('family', 'FAM·i·ly', '/ˈfæməli/', 'gia đình'), x('The man has a black cat.', 'the MAN has a BLACK CAT', 'Người đàn ông có một con mèo đen.'), x('Can you send me the plan?', 'CAN you SEND me the PLAN', 'Bạn gửi tôi kế hoạch được không?')],
  },
  {
    id: 'r-l', topic: 'sounds', level: 2, title: '/r/ vs /l/ (right / light)', titleVi: 'Phân biệt /r/ và /l/',
    tip: '/l/: đầu lưỡi chạm lợi trên. /r/ (giọng Mỹ): cuộn lưỡi về sau, KHÔNG chạm vòm miệng, môi hơi tròn. Không rung lưỡi như "r" tiếng Việt.',
    items: [w('right', 'RIGHT', '/raɪt/', 'đúng / bên phải'), w('light', 'LIGHT', '/laɪt/', 'ánh sáng'), w('really', 'REAL·ly', '/ˈrɪəli/', 'thật sự'), w('library', 'LI·brar·y', '/ˈlaɪbreri/', 'thư viện'), x('Turn right at the traffic light.', 'TURN RIGHT at the TRAF·fic LIGHT', 'Rẽ phải ở đèn giao thông.'), x('I really like reading at the library.', 'I REAL·ly LIKE READ·ing at the LI·brar·y', 'Tôi rất thích đọc sách ở thư viện.')],
  },
  {
    id: 'v-w', topic: 'sounds', level: 2, title: '/v/ vs /w/ (very / well)', titleVi: 'Phân biệt /v/ và /w/',
    tip: '/v/: răng trên chạm môi dưới, rung. /w/: tròn môi như chuẩn bị nói "u", không chạm răng.',
    items: [w('very', 'VER·y', '/ˈveri/', 'rất'), w('well', 'WELL', '/wel/', 'tốt'), w('video', 'VID·e·o', '/ˈvɪdioʊ/', 'video'), w('weekend', 'WEEK·end', '/ˈwiːkend/', 'cuối tuần'), x('We have a very good view.', 'we HAVE a VER·y GOOD VIEW', 'Chúng tôi có tầm nhìn rất đẹp.'), x('I will visit you on Wednesday.', 'I will VIS·it you on WEDNES·day', 'Tôi sẽ thăm bạn vào thứ Tư.')],
  },
  {
    id: 'final-s', topic: 'endings', level: 1, title: 'Ending -s and -es', titleVi: 'Âm cuối -s / -es',
    tip: 'Người Việt hay bỏ âm cuối. Luôn phát âm rõ -s: /s/ (books), /z/ (dogs), /ɪz/ (buses). Bỏ -s sẽ làm sai ngữ pháp số nhiều.',
    items: [w('books', 'BOOKS', '/bʊks/', 'những cuốn sách'), w('dogs', 'DOGS', '/dɔːɡz/', 'những con chó'), w('buses', 'BUS·es', '/ˈbʌsɪz/', 'xe buýt (số nhiều)'), w('watches', 'WATCH·es', '/ˈwɑːtʃɪz/', 'đồng hồ / xem'), x('She works in two big cities.', 'she WORKS in TWO BIG CIT·ies', 'Cô ấy làm việc ở hai thành phố lớn.'), x('He likes cats and dogs.', 'he LIKES CATS and DOGS', 'Anh ấy thích mèo và chó.')],
  },
  {
    id: 'final-ed', topic: 'endings', level: 2, title: 'Past tense -ed', titleVi: 'Âm cuối -ed',
    tip: '-ed có ba cách đọc: /t/ (worked), /d/ (played), /ɪd/ sau t/d (wanted). Không đọc "worked" thành "wor-ked".',
    items: [w('worked', 'WORKED', '/wɜːrkt/', 'đã làm việc'), w('played', 'PLAYED', '/pleɪd/', 'đã chơi'), w('wanted', 'WANT·ed', '/ˈwɑːntɪd/', 'đã muốn'), w('finished', 'FIN·ished', '/ˈfɪnɪʃt/', 'đã hoàn thành'), x('I watched a movie and laughed a lot.', 'I WATCHED a MOV·ie and LAUGHED a LOT', 'Tôi đã xem phim và cười rất nhiều.'), x('We started at nine and finished at five.', 'we START·ed at NINE and FIN·ished at FIVE', 'Chúng tôi bắt đầu lúc 9 giờ và xong lúc 5 giờ.')],
  },
  {
    id: 'final-stops', topic: 'endings', level: 1, title: 'Final /t/ /d/ /k/', titleVi: 'Âm cuối /t/ /d/ /k/',
    tip: 'Giữ âm cuối thật rõ, có hơi bật nhẹ. "light" khác "line", "bed" khác "bet". Đừng nuốt mất âm cuối.',
    items: [w('cat', 'CAT', '/kæt/', 'con mèo'), w('good', 'GOOD', '/ɡʊd/', 'tốt'), w('back', 'BACK', '/bæk/', 'phía sau / trở lại'), w('street', 'STREET', '/striːt/', 'đường phố'), x('I need a good night of sleep.', 'I NEED a GOOD NIGHT of SLEEP', 'Tôi cần một giấc ngủ ngon.'), x('Put the book back on the desk.', 'PUT the BOOK BACK on the DESK', 'Đặt cuốn sách lại lên bàn.')],
  },
  {
    id: 'clusters', topic: 'endings', level: 3, title: 'Consonant clusters', titleVi: 'Cụm phụ âm',
    tip: 'Tiếng Việt không có cụm phụ âm. Đọc liền "str", "spr", "-sts" mà không chèn nguyên âm: "street" không phải "sơ-trít".',
    items: [w('street', 'STREET', '/striːt/', 'đường phố'), w('spring', 'SPRING', '/sprɪŋ/', 'mùa xuân'), w('months', 'MONTHS', '/mʌnθs/', 'các tháng'), w('texts', 'TEXTS', '/teksts/', 'tin nhắn'), x('The students asked six questions.', 'the STU·dents ASKED SIX QUES·tions', 'Các sinh viên đã hỏi sáu câu.'), x('Spring is my favorite season.', 'SPRING is my FA·vor·ite SEA·son', 'Mùa xuân là mùa tôi thích nhất.')],
  },
  {
    id: 'stress-two', topic: 'stress', level: 1, title: 'Two-syllable word stress', titleVi: 'Trọng âm từ hai âm tiết',
    tip: 'Phần lớn danh từ/tính từ hai âm tiết nhấn âm 1 (TA·ble, HAP·py); phần lớn động từ nhấn âm 2 (be·GIN, re·LAX). Âm nhấn: to hơn, dài hơn, cao hơn.',
    items: [w('table', 'TA·ble', '/ˈteɪbəl/', 'cái bàn'), w('happy', 'HAP·py', '/ˈhæpi/', 'vui vẻ'), w('begin', 'be·GIN', '/bɪˈɡɪn/', 'bắt đầu'), w('relax', 're·LAX', '/rɪˈlæks/', 'thư giãn'), w('present', 'PRES·ent (n) / pre·SENT (v)', '/ˈprezənt/', 'món quà / trình bày'), x('Let us begin the lesson and relax.', 'let us be·GIN the LES·son and re·LAX', 'Hãy bắt đầu bài học và thư giãn.')],
  },
  {
    id: 'stress-long', topic: 'stress', level: 2, title: 'Long words: -tion, -ic, -ity', titleVi: 'Trọng âm từ dài: -tion, -ic, -ity',
    tip: 'Từ tận cùng -tion, -sion, -ic, -ity thường nhấn âm tiết ngay TRƯỚC đuôi: in·for·MA·tion, e·co·NOM·ic, u·ni·VER·si·ty.',
    items: [w('information', 'in·for·MA·tion', '/ˌɪnfərˈmeɪʃən/', 'thông tin'), w('economic', 'e·co·NOM·ic', '/ˌiːkəˈnɑːmɪk/', 'thuộc kinh tế'), w('university', 'u·ni·VER·si·ty', '/ˌjuːnɪˈvɜːrsəti/', 'trường đại học'), w('photography', 'pho·TOG·ra·phy', '/fəˈtɑːɡrəfi/', 'nhiếp ảnh'), x('I need more information about the university.', 'I NEED MORE in·for·MA·tion a·BOUT the u·ni·VER·si·ty', 'Tôi cần thêm thông tin về trường đại học.'), x('Photography is a creative activity.', 'pho·TOG·ra·phy is a cre·A·tive ac·TIV·i·ty', 'Nhiếp ảnh là một hoạt động sáng tạo.')],
  },
  {
    id: 'stress-tricky', topic: 'stress', level: 3, title: 'Commonly mis-stressed words', titleVi: 'Từ hay nhấn sai trọng âm',
    tip: 'Những từ này người Việt hay nhấn sai. Hãy nghe mẫu và bắt chước: VEG·e·ta·ble (4 âm nhưng nói như 3), com·FOR·ta·ble → COMF·ta·ble.',
    items: [w('vegetable', 'VEG·ta·ble', '/ˈvedʒtəbəl/', 'rau'), w('comfortable', 'COMF·ta·ble', '/ˈkʌmftəbəl/', 'thoải mái'), w('hotel', 'ho·TEL', '/hoʊˈtel/', 'khách sạn'), w('develop', 'de·VEL·op', '/dɪˈveləp/', 'phát triển'), w('interesting', 'IN·tres·ting', '/ˈɪntrəstɪŋ/', 'thú vị'), x('This hotel room is very comfortable.', 'THIS ho·TEL ROOM is VER·y COMF·ta·ble', 'Phòng khách sạn này rất thoải mái.')],
  },
  {
    id: 'questions', topic: 'intonation', level: 2, title: 'Question intonation', titleVi: 'Ngữ điệu câu hỏi',
    tip: 'Câu hỏi Yes/No: lên giọng ở cuối ↗ (Are you ready↗?). Câu hỏi Wh-: xuống giọng ở cuối ↘ (Where do you live↘?).',
    items: [x('Are you ready?', 'are you READ·y ↗', 'Bạn sẵn sàng chưa?'), x('Do you like coffee?', 'do you LIKE COF·fee ↗', 'Bạn có thích cà phê không?'), x('Where do you live?', 'WHERE do you LIVE ↘', 'Bạn sống ở đâu?'), x('What time is it?', 'WHAT TIME is it ↘', 'Mấy giờ rồi?'), x('Can I help you?', 'can I HELP you ↗', 'Tôi có thể giúp gì cho bạn?'), x('How was your weekend?', 'HOW was your WEEK·end ↘', 'Cuối tuần của bạn thế nào?')],
  },
  {
    id: 'linking', topic: 'intonation', level: 3, title: 'Linking & sentence stress', titleVi: 'Nối âm & trọng âm câu',
    tip: 'Nối phụ âm cuối với nguyên âm đầu của từ sau: "turn_off" → "tur-noff". Nhấn mạnh từ mang nghĩa (danh từ, động từ chính), đọc lướt từ chức năng (a, the, of, to).',
    items: [x('Turn it off.', 'TURN_it_OFF', 'Tắt nó đi.'), x('Pick it up.', 'PICK_it_UP', 'Nhặt nó lên.'), x('I want to get a cup of tea.', 'I WANT to GET_a CUP_of TEA', 'Tôi muốn lấy một tách trà.'), x('Not at all.', 'NOT_at_ALL', 'Không có gì.'), x('What are you doing this evening?', 'WHAT are you DO·ing this EVE·ning', 'Tối nay bạn làm gì?'), x('An apple a day keeps the doctor away.', 'an AP·ple a DAY KEEPS the DOC·tor a·WAY', 'Mỗi ngày một quả táo, bác sĩ tránh xa.')],
  },
  {
    id: 'daily-greetings', topic: 'daily', level: 1, title: 'Greetings & small talk', titleVi: 'Chào hỏi & nói chuyện xã giao',
    tip: 'Câu xã giao nên nói tự nhiên, liền mạch. Nhấn vào từ khóa: "NICE to MEET you".',
    items: [x('Nice to meet you.', 'NICE to MEET you', 'Rất vui được gặp bạn.'), x('How are you doing today?', 'HOW are you DO·ing to·DAY', 'Hôm nay bạn thế nào?'), x("I'm doing great, thanks.", "I'm DO·ing GREAT, THANKS", 'Tôi khỏe, cảm ơn.'), x('What do you do for a living?', 'WHAT do you DO for a LIV·ing', 'Bạn làm nghề gì?'), x('It was great talking to you.', 'it was GREAT TALK·ing to you', 'Rất vui được nói chuyện với bạn.'), x('See you next week.', 'SEE you NEXT WEEK', 'Hẹn gặp bạn tuần sau.')],
  },
  {
    id: 'daily-food', topic: 'daily', level: 1, title: 'Food & restaurants', titleVi: 'Ăn uống & nhà hàng',
    tip: 'Khi gọi món, dùng "I would like…" hoặc "Could I have…" để lịch sự. Phát âm rõ âm cuối: "bill", "check".',
    items: [w('menu', 'MEN·u', '/ˈmenjuː/', 'thực đơn'), w('delicious', 'de·LI·cious', '/dɪˈlɪʃəs/', 'ngon'), x("I'd like a bowl of noodle soup.", "I'd LIKE a BOWL of NOO·dle SOUP", 'Tôi muốn một bát phở/mì nước.'), x('Could I have the bill, please?', 'could I HAVE the BILL, PLEASE', 'Cho tôi xin hóa đơn.'), x('Is this dish spicy?', 'is this DISH SPIC·y ↗', 'Món này có cay không?'), x('The food was delicious.', 'the FOOD was de·LI·cious', 'Đồ ăn rất ngon.')],
  },
  {
    id: 'daily-shopping', topic: 'daily', level: 1, title: 'Shopping', titleVi: 'Mua sắm',
    tip: 'Chú ý đọc số và giá tiền: "fifteen" (nhấn âm 2) khác "fifty" (nhấn âm 1).',
    items: [w('fifteen', 'fif·TEEN', '/ˌfɪfˈtiːn/', 'mười lăm'), w('fifty', 'FIF·ty', '/ˈfɪfti/', 'năm mươi'), x('How much is this jacket?', 'HOW MUCH is this JACK·et', 'Cái áo khoác này bao nhiêu tiền?'), x('Do you have it in a larger size?', 'do you HAVE it in a LARG·er SIZE ↗', 'Bạn có cỡ lớn hơn không?'), x('Can I pay by card?', 'can I PAY by CARD ↗', 'Tôi trả bằng thẻ được không?'), x("I'm just looking, thank you.", "I'm JUST LOOK·ing, THANK you", 'Tôi chỉ xem thôi, cảm ơn.')],
  },
  {
    id: 'work-meetings', topic: 'work', level: 2, title: 'Meetings', titleVi: 'Cuộc họp',
    tip: 'Trong họp, nói chậm và rõ ràng. Nhấn vào ý chính: "I AGREE with that POINT".',
    items: [w('schedule', 'SCHED·ule', '/ˈskedʒuːl/', 'lịch trình'), w('deadline', 'DEAD·line', '/ˈdedlaɪn/', 'hạn chót'), x("Let's get started.", "LET'S get START·ed", 'Chúng ta bắt đầu nhé.'), x('Could you repeat that, please?', 'could you re·PEAT THAT, PLEASE', 'Bạn có thể nhắc lại không?'), x('I agree with your point.', 'I a·GREE with your POINT', 'Tôi đồng ý với ý của bạn.'), x("Let's move on to the next item.", "LET'S MOVE ON to the NEXT I·tem", 'Chúng ta chuyển sang mục tiếp theo.')],
  },
  {
    id: 'work-interview', topic: 'work', level: 2, title: 'Job interviews', titleVi: 'Phỏng vấn xin việc',
    tip: 'Tự tin, nói rõ ràng, giữ ngữ điệu xuống ở cuối câu khẳng định để nghe chắc chắn.',
    items: [w('experience', 'ex·PE·ri·ence', '/ɪkˈspɪriəns/', 'kinh nghiệm'), w('responsible', 're·SPON·si·ble', '/rɪˈspɑːnsəbəl/', 'có trách nhiệm'), x('I have three years of experience in marketing.', 'I HAVE THREE YEARS of ex·PE·ri·ence in MAR·ket·ing', 'Tôi có ba năm kinh nghiệm marketing.'), x('My greatest strength is teamwork.', 'my GREAT·est STRENGTH is TEAM·work', 'Điểm mạnh lớn nhất của tôi là làm việc nhóm.'), x("I'm a fast learner.", "I'm a FAST LEARN·er", 'Tôi học hỏi nhanh.'), x('Thank you for your time.', 'THANK you for your TIME', 'Cảm ơn anh/chị đã dành thời gian.')],
  },
  {
    id: 'work-presentation', topic: 'work', level: 3, title: 'Presentations', titleVi: 'Thuyết trình',
    tip: 'Ngắt nghỉ ở cuối mỗi ý (|). Nhấn mạnh con số và từ khóa để người nghe dễ theo dõi.',
    items: [x("Good morning, everyone. Today I'll talk about our results.", "good MORN·ing, EV·ery·one | to·DAY I'll TALK a·bout our re·SULTS", 'Chào buổi sáng mọi người. Hôm nay tôi sẽ nói về kết quả.'), x('Sales increased by twenty percent.', 'SALES in·CREASED by TWEN·ty per·CENT', 'Doanh số tăng 20%.'), x("Let's look at this chart.", "LET'S LOOK at this CHART", 'Hãy nhìn biểu đồ này.'), x('To sum up, we had a great year.', 'to SUM UP | we had a GREAT YEAR', 'Tóm lại, chúng ta có một năm tuyệt vời.'), x('Are there any questions?', 'are there an·y QUES·tions ↗', 'Có câu hỏi nào không?'), w('analysis', 'a·NAL·y·sis', '/əˈnæləsɪs/', 'phân tích')],
  },
  {
    id: 'travel-airport', topic: 'travel', level: 1, title: 'At the airport', titleVi: 'Tại sân bay',
    tip: 'Phát âm rõ "gate", "flight", "luggage" — giữ âm cuối /t/ và /dʒ/.',
    items: [w('luggage', 'LUG·gage', '/ˈlʌɡɪdʒ/', 'hành lý'), w('boarding pass', 'BOARD·ing PASS', '/ˈbɔːrdɪŋ pæs/', 'thẻ lên máy bay'), x('Where is gate twelve?', 'WHERE is GATE TWELVE ↘', 'Cổng số 12 ở đâu?'), x('My flight was delayed.', 'my FLIGHT was de·LAYED', 'Chuyến bay của tôi bị hoãn.'), x('I would like a window seat, please.', 'I would LIKE a WIN·dow SEAT, PLEASE', 'Tôi muốn ghế cạnh cửa sổ.'), x('I have one bag to check in.', 'I have ONE BAG to CHECK IN', 'Tôi có một túi để ký gửi.')],
  },
  {
    id: 'travel-hotel', topic: 'travel', level: 1, title: 'At the hotel', titleVi: 'Tại khách sạn',
    tip: 'Nhớ nhấn "ho·TEL" ở âm thứ hai. "Reservation" nhấn âm "VA".',
    items: [w('reservation', 'res·er·VA·tion', '/ˌrezərˈveɪʃən/', 'đặt phòng'), w('receipt', 're·CEIPT', '/rɪˈsiːt/', 'biên lai (p câm)'), x('I have a reservation under the name Nguyen.', 'I HAVE a res·er·VA·tion UN·der the NAME Nguyen', 'Tôi đã đặt phòng tên Nguyễn.'), x('What time is breakfast?', 'WHAT TIME is BREAK·fast ↘', 'Bữa sáng lúc mấy giờ?'), x('Could I have a late check-out?', 'could I HAVE a LATE CHECK-OUT ↗', 'Tôi có thể trả phòng muộn không?'), x('The air conditioner is not working.', 'the AIR con·DI·tion·er is NOT WORK·ing', 'Máy lạnh không hoạt động.')],
  },
  {
    id: 'travel-directions', topic: 'travel', level: 2, title: 'Asking for directions', titleVi: 'Hỏi đường',
    tip: 'Dùng "Excuse me" để mở lời lịch sự. Chú ý "straight" có cụm /str/ và âm cuối /t/.',
    items: [w('straight', 'STRAIGHT', '/streɪt/', 'thẳng'), w('opposite', 'OP·po·site', '/ˈɑːpəzɪt/', 'đối diện'), x('Excuse me, how do I get to the station?', 'ex·CUSE me | HOW do I GET to the STA·tion', 'Xin lỗi, tôi đến nhà ga thế nào?'), x('Go straight and turn left.', 'GO STRAIGHT and TURN LEFT', 'Đi thẳng rồi rẽ trái.'), x('Is it far from here?', 'is it FAR from HERE ↗', 'Có xa đây không?'), x("It's next to the bank.", "it's NEXT to the BANK", 'Nó ở cạnh ngân hàng.')],
  },
];

export const lessonById = (id) => LESSONS.find((l) => l.id === id);
