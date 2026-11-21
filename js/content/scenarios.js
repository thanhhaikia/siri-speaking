// Scripted conversations. Each has 4 turns. A turn:
//   say / vi   — the partner's line and its Vietnamese meaning
//   task       — the situation, in Vietnamese: what the learner needs to get across
//   replies    — sample answers (any of them, or anything with the same idea, completes the turn)
//   accept     — ideas that complete the turn: the reply must contain every word of at least one group
//   focus      — one word or phrase from the answer to repeat exactly, with one tip
// twists: one-turn changes. Each new day the learner returns, the next twist replaces turn `at`,
// so the conversation is slightly different from yesterday's.
const f = (t, ipa, s, en, vi) => ({ t, ipa, s, tip: { en, vi } });

export const SCENARIOS = [
  {
    id: 'restaurant', icon: '🍽️', color: '#f97316', focus: 'daily', partner: 'Waiter', partnerVi: 'Nhân viên phục vụ',
    title: 'A table at a restaurant', titleVi: 'Gọi bàn ở nhà hàng',
    intro: 'You arrive at a restaurant with two friends.', introVi: 'Bạn đến nhà hàng cùng hai người bạn.',
    turns: [
      {
        say: 'Good evening! How many people?', vi: 'Chào buổi tối! Quý khách đi mấy người ạ?',
        task: 'Nhóm bạn có ba người. Hãy trả lời nhân viên.',
        replies: ['Three, please.', 'A table for three, please.', 'There are three of us.'], accept: [['three']],
        focus: f('three', '/θriː/', 'THREE', 'Start with your tongue between your teeth: /θ/. With a /t/ it becomes "tree".', 'Đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi: /θ/. Đọc bằng /t/ sẽ thành "tree" (cái cây).'),
      },
      {
        say: 'Would you like to sit inside or outside?', vi: 'Quý khách muốn ngồi trong nhà hay ngoài trời?',
        task: 'Bạn muốn ngồi bên trong.',
        replies: ['Inside, please.', "We'd like to sit inside.", 'Inside would be great.'], accept: [['inside'], ['indoors']],
        focus: f('inside', '/ˌɪnˈsaɪd/', 'in·SIDE', 'Stress the second part and finish with a clear /d/: in-SIDE.', 'Nhấn vào âm tiết thứ hai và bật rõ âm /d/ ở cuối: in-SIDE.'),
      },
      {
        say: 'What would you like to drink?', vi: 'Quý khách muốn uống gì ạ?',
        task: 'Gọi ba ly trà đá.',
        replies: ['Three iced teas, please.', "We'd like three iced teas.", 'Can we have three iced teas?'], accept: [['tea'], ['teas']],
        focus: f('three iced teas', '/θriː aɪst tiːz/', 'THREE ICED TEAS', 'More than one tea: add a /z/ at the end — "teaz".', 'Từ hai ly trở lên phải có âm /z/ ở cuối: "teas" đọc như "tiz".'),
      },
      {
        say: 'Are you ready to order, or do you need a few more minutes?', vi: 'Quý khách gọi món luôn hay cần thêm vài phút ạ?',
        task: 'Xin thêm vài phút để xem thực đơn.',
        replies: ['A few more minutes, please.', 'We need a few more minutes.', 'Not yet. Could you give us a minute?'], accept: [['minutes'], ['minute'], ['not', 'yet'], ['more', 'time']],
        focus: f('a few more minutes', '/ə fjuː mɔːr ˈmɪnɪts/', 'a FEW more MIN·utes', 'Finish "minutes" with /ts/, like the end of "cats".', 'Kết thúc "minutes" bằng /ts/, giống cuối từ "cats".'),
      },
    ],
    twists: [
      {
        at: 1, note: 'The waiter did not catch your answer.', noteVi: 'Hôm nay nhân viên nghe chưa rõ câu trả lời của bạn.',
        turn: {
          say: 'Sorry, did you say two or three?', vi: 'Xin lỗi, quý khách nói hai hay ba ạ?',
          task: 'Nói lại cho rõ: ba người.',
          replies: ['Three, please. Three people.', 'I said three.', 'Three — a table for three.'], accept: [['three']],
          focus: f('three people', '/θriː ˈpiːpl/', 'THREE PEO·ple', 'Make /θ/ clearly different from the /t/ in "two".', 'Đọc /θ/ thật khác với /t/ trong "two" để người nghe không nhầm.'),
        },
      },
      {
        at: 2, note: 'They are out of iced tea today.', noteVi: 'Hôm nay quán hết trà đá.',
        turn: {
          say: "I'm sorry, we're out of iced tea. Would you like something else?", vi: 'Xin lỗi, quán hết trà đá rồi. Quý khách dùng thứ khác nhé?',
          task: 'Đổi sang ba chai nước suối.',
          replies: ['Three bottles of water, then.', 'Water is fine, thanks.', "We'll have three waters, please."], accept: [['water'], ['waters']],
          focus: f('three bottles of water', '/θriː ˈbɑːtlz əv ˈwɔːtər/', 'THREE BOT·tles of WA·ter', 'Say the /z/ at the end of "bottles" and link it: "bottles-of".', 'Đọc âm /z/ cuối "bottles" và nối sang "of": "bottles-of".'),
        },
      },
      {
        at: 3, note: 'The restaurant is full tonight.', noteVi: 'Tối nay nhà hàng kín bàn.',
        turn: {
          say: 'Your table will be ready in ten minutes. Is that okay?', vi: 'Mười phút nữa mới có bàn. Như vậy được không ạ?',
          task: 'Đồng ý và nói rằng nhóm bạn sẽ đợi.',
          replies: ["That's fine, we'll wait.", 'No problem, thank you.', 'Sure, we can wait.'], accept: [['wait'], ['fine'], ['no', 'problem'], ['sure'], ['okay'], ['ok']],
          focus: f("that's fine", '/ðæts faɪn/', "THAT'S FINE", 'Both words need their endings: /ts/ in "that\'s" and /n/ in "fine".', 'Cả hai từ đều cần âm cuối: /ts/ trong "that\'s" và /n/ trong "fine".'),
        },
      },
    ],
  },
  {
    id: 'smalltalk', icon: '☕', color: '#0ea5e9', focus: 'daily', partner: 'Neighbor', partnerVi: 'Người hàng xóm',
    title: 'Daily small talk', titleVi: 'Trò chuyện hằng ngày',
    intro: 'You meet a friendly neighbor in the elevator.', introVi: 'Bạn gặp một người hàng xóm thân thiện trong thang máy.',
    turns: [
      {
        say: 'Hi! How was your weekend?', vi: 'Chào bạn! Cuối tuần của bạn thế nào?',
        task: 'Cuối tuần rất vui: bạn về thăm bố mẹ.',
        replies: ['It was great. I visited my parents.', 'Pretty good! I went to see my parents.', 'Really nice. I spent it with my family.'], accept: [['parents'], ['family'], ['great'], ['good'], ['nice']],
        focus: f('visited', '/ˈvɪzɪtɪd/', 'VIS·it·ed', 'After /t/, -ed is a full extra syllable: VIS-it-id.', 'Sau âm /t/, đuôi -ed đọc thành một âm tiết riêng /ɪd/: VIS-it-id.'),
      },
      {
        say: 'Nice! What do you usually do after work?', vi: 'Hay quá! Sau giờ làm bạn thường làm gì?',
        task: 'Bạn thường nấu bữa tối rồi xem phim.',
        replies: ['I usually cook dinner and watch a movie.', 'I cook, and then I watch movies.', 'Usually I make dinner and relax with a film.'], accept: [['cook'], ['dinner'], ['watch'], ['movie'], ['movies'], ['film']],
        focus: f('usually', '/ˈjuːʒuəli/', 'U·su·al·ly', 'The middle sound is /ʒ/, as in "television" — not /z/ or /s/.', 'Âm giữa là /ʒ/ như trong "television", không phải /z/ hay /s/.'),
      },
      {
        say: "It's so hot these days, isn't it?", vi: 'Dạo này trời nóng quá nhỉ?',
        task: 'Đồng ý, và nói bạn thích thời tiết mát hơn.',
        replies: ['Yes, it is. I prefer cooler weather.', "It really is! I like it when it's cooler.", "I agree. I can't stand the heat."], accept: [['yes'], ['agree'], ['cooler'], ['heat'], ['really', 'is'], ['hot']],
        focus: f('cooler weather', '/ˈkuːlər ˈweðər/', 'COOL·er WEATH·er', 'The "th" in "weather" is voiced /ð/: tongue between the teeth, throat buzzing.', '"th" trong "weather" là âm hữu thanh /ð/: lưỡi giữa hai răng, cổ họng rung.'),
      },
      {
        say: 'Well, this is my floor. See you tomorrow!', vi: 'Tới tầng của tôi rồi. Mai gặp nhé!',
        task: 'Chào tạm biệt và chúc một ngày tốt lành.',
        replies: ['See you tomorrow! Have a nice day.', 'Bye! Take care.', 'See you. Have a good one!'], accept: [['see', 'you'], ['bye'], ['take', 'care'], ['nice', 'day'], ['good', 'one']],
        focus: f('have a nice day', '/hæv ə naɪs deɪ/', 'HAVE a NICE DAY', 'Link "have" to "a" — "hav-a" — and keep the /s/ at the end of "nice".', 'Nối "have" với "a" thành "hav-a" và giữ âm /s/ cuối từ "nice".'),
      },
    ],
    twists: [
      {
        at: 0, note: 'A different opening question.', noteVi: 'Hôm nay người hàng xóm hỏi một câu khác.',
        turn: {
          say: 'Hi! Did you do anything fun last night?', vi: 'Chào bạn! Tối qua bạn có làm gì vui không?',
          task: 'Tối qua bạn đi ăn tối với vài người bạn.',
          replies: ['Yes, I had dinner with some friends.', 'I went out for dinner with friends.', 'Not much, just dinner with a few friends.'], accept: [['dinner'], ['friends'], ['friend']],
          focus: f('with some friends', '/wɪð səm frendz/', 'with some FRIENDS', 'Finish "friends" with /dz/. Without it, it sounds like one friend.', 'Kết thúc "friends" bằng /dz/. Thiếu âm này sẽ nghe như chỉ có một người bạn.'),
        },
      },
      {
        at: 2, note: 'The weather has changed.', noteVi: 'Hôm nay trời mưa.',
        turn: {
          say: "It's been raining all week, hasn't it?", vi: 'Mưa suốt cả tuần rồi nhỉ?',
          task: 'Đồng ý, và nói hôm nay bạn quên mang ô.',
          replies: ['Yes, and I forgot my umbrella today.', 'It has! I left my umbrella at home.', 'I know. I got wet this morning.'], accept: [['umbrella'], ['yes'], ['it', 'has'], ['wet'], ['know']],
          focus: f('umbrella', '/ʌmˈbrelə/', 'um·BREL·la', 'Stress the middle: um-BREL-la. Keep /br/ together without an extra vowel.', 'Nhấn âm tiết giữa: um-BREL-la. Đọc liền /br/, không chêm nguyên âm.'),
        },
      },
      {
        at: 1, note: 'A holiday is coming.', noteVi: 'Sắp đến kỳ nghỉ lễ.',
        turn: {
          say: 'Do you have any plans for the holiday?', vi: 'Bạn có kế hoạch gì cho kỳ nghỉ chưa?',
          task: 'Bạn định đi Đà Lạt ba ngày.',
          replies: ["Yes, I'm going to Da Lat for three days.", 'I plan to visit Da Lat.', "I'm taking a three-day trip to Da Lat."], accept: [['da', 'lat'], ['dalat'], ['three', 'days'], ['trip'], ['going'], ['plan']],
          focus: f('for three days', '/fər θriː deɪz/', 'for THREE DAYS', '/θ/ in "three", then a /z/ at the end of "days".', '/θ/ trong "three", rồi âm /z/ ở cuối "days".'),
        },
      },
    ],
  },
  {
    id: 'work-update', icon: '💼', color: '#6366f1', focus: 'work', partner: 'Manager', partnerVi: 'Quản lý',
    title: 'A quick update at work', titleVi: 'Báo cáo nhanh tiến độ công việc',
    intro: 'Your manager stops by your desk in the morning.', introVi: 'Buổi sáng, quản lý ghé qua bàn làm việc của bạn.',
    turns: [
      {
        say: 'Good morning. Can you give me a quick update on the report?', vi: 'Chào buổi sáng. Bạn cập nhật nhanh về bản báo cáo được không?',
        task: 'Báo cáo gần xong, chiều nay bạn sẽ gửi.',
        replies: ["It's almost finished. I'll send it this afternoon.", "Almost done. You'll have it this afternoon.", "I'm nearly finished and will send it today."], accept: [['finished'], ['done'], ['send'], ['afternoon'], ['today']],
        focus: f('almost finished', '/ˈɔːlmoʊst ˈfɪnɪʃt/', 'AL·most FIN·ished', 'After /ʃ/, -ed is just /t/: "finisht" — two syllables, not three.', 'Sau âm /ʃ/, đuôi -ed chỉ đọc là /t/: "finisht" — hai âm tiết, không phải ba.'),
      },
      {
        say: 'Great. Is anything blocking you?', vi: 'Tốt. Có gì đang cản trở bạn không?',
        task: 'Bạn vẫn cần số liệu bán hàng từ nhóm kinh doanh.',
        replies: ['Yes, I still need the sales figures.', "I'm waiting for the numbers from the sales team.", 'I need the sales data to finish.'], accept: [['sales'], ['figures'], ['numbers'], ['data']],
        focus: f('sales figures', '/seɪlz ˈfɪɡjərz/', 'SALES FIG·ures', 'Both words end in /z/. Drop it and "sales" becomes "sale".', 'Cả hai từ đều kết thúc bằng /z/. Bỏ âm này thì "sales" thành "sale".'),
      },
      {
        say: 'Okay. When can we meet to review it?', vi: 'Được. Khi nào chúng ta họp để xem lại?',
        task: 'Đề xuất họp lúc ba giờ chiều thứ Năm.',
        replies: ['How about Thursday at three?', 'Thursday at three p.m. works for me.', 'Can we meet on Thursday afternoon?'], accept: [['thursday'], ['three']],
        focus: f('Thursday at three', '/ˈθɜːrzdeɪ ət θriː/', 'THURS·day at THREE', 'Two /θ/ sounds. "Thursday" with a /t/ can be heard as "Tuesday".', 'Có hai âm /θ/. Đọc "Thursday" bằng /t/ dễ bị nghe thành "Tuesday".'),
      },
      {
        say: 'Perfect. Anything else before we finish?', vi: 'Tuyệt. Còn gì nữa không trước khi kết thúc?',
        task: 'Không còn gì. Cảm ơn và hẹn gặp thứ Năm.',
        replies: ["No, that's all. Thanks, see you on Thursday.", "That's everything. Thank you!", 'Nothing else from me. See you Thursday.'], accept: [['all'], ['everything'], ['nothing'], ['thanks'], ['thank', 'you'], ['see', 'you']],
        focus: f("that's all, thanks", '/ðæts ɔːl θæŋks/', "THAT'S ALL, THANKS", '"Thanks" starts with /θ/ and ends with /ks/.', '"Thanks" bắt đầu bằng /θ/ và kết thúc bằng /ks/.'),
      },
    ],
    twists: [
      {
        at: 2, note: 'Your manager is busy on Thursday.', noteVi: 'Hôm nay quản lý bận vào thứ Năm.',
        turn: {
          say: "I'm busy on Thursday. Could we do Friday instead?", vi: 'Thứ Năm tôi bận. Chuyển sang thứ Sáu được không?',
          task: 'Đồng ý, đề xuất mười giờ sáng thứ Sáu.',
          replies: ['Sure, Friday at ten works.', 'Friday is fine. How about ten a.m.?', "Yes, let's meet on Friday morning."], accept: [['friday'], ['ten'], ['sure'], ['fine']],
          focus: f('Friday at ten', '/ˈfraɪdeɪ ət ten/', 'FRI·day at TEN', 'Keep /fr/ together — no vowel between /f/ and /r/.', 'Đọc liền /fr/, không chêm nguyên âm giữa /f/ và /r/.'),
        },
      },
      {
        at: 0, note: 'A different project today.', noteVi: 'Hôm nay quản lý hỏi về một việc khác.',
        turn: {
          say: 'Morning! How is the client presentation going?', vi: 'Chào buổi sáng! Bài thuyết trình cho khách hàng tới đâu rồi?',
          task: 'Các slide đã xong, bạn đang luyện phần mở đầu.',
          replies: ["The slides are ready. I'm practicing the opening.", "Good. The slides are done and I'm rehearsing.", "It's going well. I'm working on the introduction."], accept: [['slides'], ['ready'], ['done'], ['well'], ['practicing'], ['practising'], ['working']],
          focus: f('the slides are ready', '/ðə slaɪdz ər ˈredi/', 'the SLIDES are READ·y', '/sl/ together at the start and /dz/ at the end of "slides".', 'Đọc liền /sl/ ở đầu và /dz/ ở cuối từ "slides".'),
        },
      },
      {
        at: 1, note: 'Your manager offers help.', noteVi: 'Hôm nay quản lý đề nghị hỗ trợ.',
        turn: {
          say: 'Do you need any help from the team?', vi: 'Bạn có cần nhóm hỗ trợ gì không?',
          task: 'Nhờ ai đó kiểm tra lại các con số.',
          replies: ['Yes, could someone check the numbers?', 'It would help if someone reviewed the figures.', 'Can someone double-check the numbers for me?'], accept: [['check'], ['numbers'], ['figures'], ['review'], ['reviewed'], ['help']],
          focus: f('check the numbers', '/tʃek ðə ˈnʌmbərz/', 'CHECK the NUM·bers', 'Release the /k/ in "check" and add /z/ to "numbers".', 'Bật âm /k/ cuối "check" và thêm /z/ cuối "numbers".'),
        },
      },
    ],
  },
];

export const scenarioById = (id) => SCENARIOS.find((s) => s.id === id);
