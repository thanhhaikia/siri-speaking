// Scripted conversations. Each has 4 turns. A turn:
//   say / vi   — the partner's line and its Vietnamese meaning
//   task       — the situation, in Vietnamese: what the learner needs to get across
//   replies    — sample answers the learner can say or adapt; a short one is complete and correct
//   focus      — one word or phrase from the answer to repeat exactly, with one tip
// final: one optional last question with the script hidden. The learner answers in their own words; it is never
//   checked: `replies` are useful phrases shown afterwards for the learner to compare with.
// accept: the turn's key words, used only as soft hints ("the browser heard: side") — a reply is never marked wrong.
// Ids follow the text: when a conversation is rewritten it gets a new id, so old progress and takes never attach to new lines.
// optional: an extra conversation, never picked for "Practice today"; next: the id of a follow-up conversation to offer.
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
    final: {
      say: 'Is everything okay with your meal?', vi: 'Món ăn của quý khách ổn chứ ạ?',
      task: 'Trả lời bằng lời của bạn: món ăn thế nào?',
      replies: ['Yes, everything is delicious. Thank you.', "It's very good, thanks.", 'Yes, the food is great.'],
    },
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
    final: {
      say: 'Oh, before I go: any plans for tonight?', vi: 'À, trước khi đi: tối nay bạn có kế hoạch gì không?',
      task: 'Trả lời bằng lời của bạn: tối nay bạn định làm gì?',
      replies: ["I'm going to stay home and rest.", 'I will have dinner with my family.', 'Not really. Maybe I will watch a movie.'],
    },
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
    final: {
      say: 'One more question: how is your workload this week?', vi: 'Thêm một câu: tuần này khối lượng công việc của bạn thế nào?',
      task: 'Trả lời bằng lời của bạn: tuần này bạn bận hay vẫn ổn?',
      replies: ["It's busy, but I can manage.", 'It is fine this week.', 'A little heavy, but it is okay.'],
    },
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
  {
    id: 'hotel', icon: '🏨', color: '#8b5cf6', focus: 'daily', partner: 'Receptionist', partnerVi: 'Lễ tân',
    title: 'Checking in at a hotel', titleVi: 'Nhận phòng khách sạn',
    intro: 'You arrive at your hotel after a long flight.', introVi: 'Bạn đến khách sạn sau một chuyến bay dài.',
    turns: [
      {
        say: 'Good afternoon. Do you have a reservation?', vi: 'Chào quý khách. Quý khách đã đặt phòng chưa ạ?',
        task: 'Bạn đã đặt phòng, tên người đặt là Nguyen.',
        replies: ['Yes, I have a reservation under Nguyen.', 'Yes, I booked a room. The name is Nguyen.', 'I do. It is under the name Nguyen.'], accept: [['reservation'], ['booked'], ['booking'], ['name'], ['nguyen'], ['yes']],
        focus: f('reservation', '/ˌrezərˈveɪʃən/', 'res·er·VA·tion', 'Stress the third part and say /ʃ/ in "-tion": res-er-VAY-shun.', 'Nhấn âm tiết thứ ba và đọc "-tion" với âm /ʃ/: res-er-VAY-shun.'),
      },
      {
        say: 'How many nights will you be staying?', vi: 'Quý khách ở mấy đêm ạ?',
        task: 'Bạn ở ba đêm.',
        replies: ['Three nights, please.', "I'm staying for three nights.", 'Three nights, until Friday.'], accept: [['three']],
        focus: f('three nights', '/θriː naɪts/', 'THREE NIGHTS', 'End "nights" with /ts/. Without it, it sounds like one night.', 'Kết thúc "nights" bằng /ts/. Thiếu âm này sẽ nghe như chỉ một đêm.'),
      },
      {
        say: 'Would you like a room with a city view or a garden view?', vi: 'Quý khách muốn phòng nhìn ra thành phố hay nhìn ra vườn?',
        task: 'Bạn chọn phòng nhìn ra vườn cho yên tĩnh.',
        replies: ['A garden view, please.', "I'd like the garden view. It's quieter.", 'The garden view sounds good.'], accept: [['garden']],
        focus: f('garden view', '/ˈɡɑːrdn vjuː/', 'GAR·den VIEW', 'Start "view" with /v/: top teeth touch the bottom lip. It is not /w/.', 'Bắt đầu "view" bằng /v/: răng trên chạm môi dưới. Không đọc thành /w/.'),
      },
      {
        say: 'Here is your key. Breakfast is from six to ten. Anything else?', vi: 'Chìa khóa của quý khách đây. Bữa sáng từ sáu đến mười giờ. Quý khách cần gì nữa không ạ?',
        task: 'Hỏi mật khẩu wifi.',
        replies: ['Yes, what is the wifi password?', 'Could I have the wifi password, please?', 'How do I connect to the wifi?'], accept: [['wifi'], ['wi', 'fi'], ['password'], ['internet']],
        focus: f('password', '/ˈpæswɜːrd/', 'PASS·word', 'Stress the first part and finish with a clear /d/: PASS-word.', 'Nhấn âm tiết đầu và bật rõ âm /d/ ở cuối: PASS-word.'),
      },
    ],
    final: {
      say: 'One last thing: would you like a wake-up call tomorrow?', vi: 'Một điều nữa: quý khách có cần gọi báo thức sáng mai không ạ?',
      task: 'Trả lời bằng lời của bạn: bạn có cần gọi báo thức không, lúc mấy giờ?',
      replies: ['Yes, at six thirty, please.', "Yes, please. Seven o'clock.", "No, thank you. I don't need one."],
    },
    twists: [
      {
        at: 1, note: 'The receptionist has the wrong number of nights.', noteVi: 'Hôm nay lễ tân ghi nhầm số đêm.',
        turn: {
          say: 'I have you here for two nights. Is that right?', vi: 'Tôi thấy quý khách đặt hai đêm. Có đúng không ạ?',
          task: 'Sửa lại: bạn đã đặt ba đêm.',
          replies: ['No, I booked three nights.', "Actually, it's three nights.", 'That should be three nights, not two.'], accept: [['three']],
          focus: f('I booked three nights', '/aɪ bʊkt θriː naɪts/', 'I BOOKED THREE NIGHTS', '"Booked" is one syllable ending in /kt/ — not "book-ed".', '"Booked" chỉ có một âm tiết, kết thúc bằng /kt/ — không đọc thành "book-ed".'),
        },
      },
      {
        at: 2, note: 'Only second-floor rooms are left.', noteVi: 'Hôm nay chỉ còn phòng ở tầng hai.',
        turn: {
          say: "I'm sorry, we only have rooms on the second floor. Is that okay?", vi: 'Xin lỗi, chúng tôi chỉ còn phòng ở tầng hai. Như vậy được không ạ?',
          task: 'Đồng ý, và hỏi có thang máy không.',
          replies: ["That's fine. Is there an elevator?", 'No problem. Do you have an elevator?', 'Sure. Is there a lift?'], accept: [['elevator'], ['lift'], ['fine'], ['no', 'problem'], ['sure'], ['okay'], ['ok']],
          focus: f('elevator', '/ˈelɪveɪtər/', 'EL·e·va·tor', 'Stress the first syllable, EL-e-va-tor, and say a clear /v/.', 'Nhấn âm tiết đầu, EL-e-va-tor, và đọc rõ âm /v/.'),
        },
      },
      {
        at: 3, note: 'Your room is not ready yet.', noteVi: 'Hôm nay phòng của bạn chưa dọn xong.',
        turn: {
          say: 'Your room will be ready at two. Would you like to leave your bags here?', vi: 'Hai giờ phòng mới sẵn sàng. Quý khách có muốn gửi hành lý ở đây không ạ?',
          task: 'Đồng ý gửi hành lý và cảm ơn.',
          replies: ['Yes, please. Thank you.', "That would be great. I'll leave my bags.", 'Yes, I will leave my bags here.'], accept: [['yes'], ['bags'], ['great'], ['leave'], ['thank', 'you'], ['thanks']],
          focus: f('leave my bags', '/liːv maɪ bæɡz/', 'LEAVE my BAGS', 'A long /iː/ in "leave" (not "live"), and /z/ at the end of "bags".', 'Âm /iː/ dài trong "leave" (khác "live"), và âm /z/ ở cuối "bags".'),
        },
      },
    ],
  },
  {
    id: 'directions', icon: '🧭', color: '#10b981', focus: 'daily', partner: 'Passer-by', partnerVi: 'Người đi đường',
    title: 'Asking for directions', titleVi: 'Hỏi đường',
    intro: 'You are in a new city and cannot find the train station. A person stops to help.', introVi: 'Bạn đang ở một thành phố lạ và không tìm thấy ga tàu. Một người dừng lại giúp bạn.',
    turns: [
      {
        say: 'Hi there. You look lost. Can I help you?', vi: 'Chào bạn. Trông bạn như đang lạc đường. Tôi giúp gì được không?',
        task: 'Hỏi đường đến ga tàu.',
        replies: ['Yes, please. Where is the train station?', 'How do I get to the train station?', "I'm looking for the train station."], accept: [['station']],
        focus: f('train station', '/treɪn ˈsteɪʃən/', 'TRAIN STA·tion', 'Keep /tr/ together, and say /ʃ/ in "station": STAY-shun.', 'Đọc liền /tr/, và đọc "station" với âm /ʃ/: STAY-shun.'),
      },
      {
        say: 'It is about ten minutes from here. Are you walking or driving?', vi: 'Cách đây khoảng mười phút. Bạn đi bộ hay lái xe?',
        task: 'Bạn đi bộ.',
        replies: ["I'm walking.", 'On foot.', "I'm going to walk."], accept: [['walking'], ['walk'], ['foot']],
        focus: f('walking', '/ˈwɔːkɪŋ/', 'WALK·ing', 'The "l" is silent: WAW-king. Round your lips for /w/.', 'Chữ "l" câm: WAW-king. Tròn môi khi đọc /w/.'),
      },
      {
        say: 'Okay. Go straight, then turn left at the bank. Did you get that?', vi: 'Được rồi. Đi thẳng, rồi rẽ trái ở ngân hàng. Bạn nghe kịp không?',
        task: 'Nhắc lại cho chắc: đi thẳng, rẽ trái ở ngân hàng.',
        replies: ['Go straight, then turn left at the bank.', 'Straight, and left at the bank. Got it.', 'So I go straight and turn left at the bank?'], accept: [['left'], ['straight']],
        focus: f('turn left', '/tɜːrn left/', 'TURN LEFT', 'Finish "left" with /ft/ — both sounds, not "lef".', 'Kết thúc "left" bằng /ft/ — đủ cả hai âm, không đọc thành "lef".'),
      },
      {
        say: 'That is right. The station is next to the post office. You cannot miss it.', vi: 'Đúng rồi. Ga nằm cạnh bưu điện. Bạn sẽ thấy ngay.',
        task: 'Cảm ơn người đó đã giúp.',
        replies: ['Thank you so much!', 'Thanks for your help.', 'Great, thank you. Have a nice day!'], accept: [['thank'], ['thanks']],
        focus: f('thanks for your help', '/θæŋks fər jər help/', 'THANKS for your HELP', '/θ/ at the start of "thanks", and /lp/ at the end of "help": tongue up for /l/, then close your lips.', '/θ/ ở đầu "thanks", và /lp/ ở cuối "help": nâng lưỡi cho /l/ rồi khép môi.'),
      },
    ],
    final: {
      say: 'By the way, is this your first time in the city?', vi: 'À mà đây là lần đầu bạn đến thành phố này à?',
      task: 'Trả lời bằng lời của bạn: đây có phải lần đầu bạn đến đây không?',
      replies: ['Yes, it is my first time here.', 'Yes, I arrived this morning.', 'No, I came here last year.'],
    },
    twists: [
      {
        at: 1, note: 'The station is farther than you thought.', noteVi: 'Hôm nay ga tàu xa hơn bạn nghĩ.',
        turn: {
          say: 'It is quite far, about thirty minutes on foot. Do you want to take the bus?', vi: 'Khá xa đấy, đi bộ khoảng ba mươi phút. Bạn có muốn đi xe buýt không?',
          task: 'Đồng ý đi xe buýt và hỏi trạm xe buýt ở đâu.',
          replies: ['Yes. Where is the bus stop?', 'The bus is better. Where can I catch it?', 'Okay, which bus should I take?'], accept: [['bus']],
          focus: f('bus stop', '/bʌs stɑːp/', 'BUS STOP', 'Two /s/ sounds meet: hold one long /s/, then release the /p/ at the end.', 'Hai âm /s/ gặp nhau: giữ một âm /s/ dài, rồi bật âm /p/ ở cuối.'),
        },
      },
      {
        at: 2, note: 'The way is different today.', noteVi: 'Hôm nay đường đi khác.',
        turn: {
          say: 'Go past the supermarket and turn right at the traffic lights. Okay?', vi: 'Đi qua siêu thị rồi rẽ phải ở đèn giao thông. Được chứ?',
          task: 'Nhắc lại: qua siêu thị, rẽ phải ở đèn giao thông.',
          replies: ['Past the supermarket, then right at the traffic lights.', 'So I turn right at the traffic lights?', 'Okay, right at the lights.'], accept: [['right'], ['lights'], ['supermarket']],
          focus: f('right at the lights', '/raɪt ət ðə laɪts/', 'RIGHT at the LIGHTS', '"Right" and "lights" start differently: curl the tongue back for /r/, touch behind the top teeth for /l/.', '"Right" và "lights" có âm đầu khác nhau: /r/ cuộn lưỡi về sau, /l/ chạm đầu lưỡi sau răng trên.'),
        },
      },
      {
        at: 0, note: 'Today you are looking for a different place.', noteVi: 'Hôm nay bạn tìm một nơi khác.',
        turn: {
          say: 'Hello. Are you looking for something?', vi: 'Chào bạn. Bạn đang tìm gì à?',
          task: 'Hỏi gần đây có hiệu thuốc không.',
          replies: ['Yes. Is there a pharmacy near here?', "I'm looking for a pharmacy.", 'Where is the nearest pharmacy?'], accept: [['pharmacy'], ['drugstore'], ['chemist']],
          focus: f('near here', '/nɪr hɪr/', 'NEAR HERE', 'Say the /h/ in "here" with a little breath, so it does not sound like "near ear".', 'Đọc âm /h/ trong "here" có bật hơi nhẹ, để không nghe thành "near ear".'),
        },
      },
    ],
  },
  {
    id: 'pharmacy', icon: '💊', color: '#ef4444', focus: 'daily', partner: 'Pharmacist', partnerVi: 'Dược sĩ',
    title: 'At the pharmacy', titleVi: 'Ở hiệu thuốc',
    intro: 'You have had a headache since this morning, so you go to a pharmacy.', introVi: 'Bạn bị đau đầu từ sáng nên ghé vào hiệu thuốc.',
    turns: [
      {
        say: 'Hello. How can I help you today?', vi: 'Xin chào. Tôi giúp gì được cho bạn?',
        task: 'Bạn bị đau đầu và cần mua thuốc.',
        replies: ['I have a headache. Do you have something for it?', 'I need something for a headache.', 'My head hurts. What can I take?'], accept: [['headache'], ['head']],
        focus: f('headache', '/ˈhedeɪk/', 'HEAD·ache', '"Ache" sounds like "ake": HED-ake. The "ch" is /k/.', '"Ache" đọc như "ake": HED-ake. Chữ "ch" ở đây là âm /k/.'),
      },
      {
        say: 'I see. How long have you had it?', vi: 'Tôi hiểu rồi. Bạn bị bao lâu rồi?',
        task: 'Bạn bị từ sáng nay.',
        replies: ['Since this morning.', 'It started this morning.', 'For a few hours, since I woke up.'], accept: [['morning'], ['hours'], ['today'], ['woke']],
        focus: f('since this morning', '/sɪns ðɪs ˈmɔːrnɪŋ/', 'SINCE this MORN·ing', '"This" starts with the voiced /ð/: tongue between the teeth. It is not /d/ or /z/.', '"This" bắt đầu bằng âm hữu thanh /ð/: lưỡi giữa hai hàm răng. Không đọc thành /d/ hay /z/.'),
      },
      {
        say: 'Are you allergic to any medicine?', vi: 'Bạn có dị ứng với thuốc nào không?',
        task: 'Bạn không dị ứng với thuốc nào.',
        replies: ["No, I'm not allergic to anything.", 'No, I have no allergies.', 'Not that I know of.'], accept: [['no'], ['not'], ['none']],
        focus: f('allergic', '/əˈlɜːrdʒɪk/', 'al·LER·gic', 'Stress the middle: a-LER-jik. The "g" is /dʒ/, as in "job".', 'Nhấn âm tiết giữa: a-LER-jik. Chữ "g" đọc là /dʒ/ như trong "job".'),
      },
      {
        say: 'Take one tablet every six hours, after food. Do you need anything else?', vi: 'Uống một viên mỗi sáu tiếng, sau khi ăn. Bạn cần gì nữa không?',
        task: 'Không cần gì thêm. Hỏi giá tiền.',
        replies: ["No, that's all. How much is it?", 'That is everything. How much do I pay?', 'Nothing else, thanks. What is the price?'], accept: [['how', 'much'], ['price'], ['pay'], ['all'], ['everything'], ['nothing']],
        focus: f('how much is it', '/haʊ mʌtʃ ɪz ɪt/', 'HOW MUCH is it', 'Link the words — "much-iz-it" — and release /tʃ/ at the end of "much".', 'Nối các từ lại: "much-iz-it", và bật rõ âm /tʃ/ cuối từ "much".'),
      },
    ],
    final: {
      say: 'Would you like a bag?', vi: 'Bạn có cần túi không?',
      task: 'Trả lời bằng lời của bạn: bạn có cần túi không?',
      replies: ['No, thank you.', 'Yes, please.', "No, I don't need a bag, thanks."],
    },
    twists: [
      {
        at: 0, note: 'A different problem today.', noteVi: 'Hôm nay bạn gặp vấn đề khác.',
        turn: {
          say: 'Good morning. What seems to be the problem?', vi: 'Chào buổi sáng. Bạn đang gặp vấn đề gì?',
          task: 'Bạn bị đau họng và ho.',
          replies: ['I have a sore throat and a cough.', 'My throat hurts and I keep coughing.', 'I need something for a sore throat.'], accept: [['throat'], ['cough'], ['coughing']],
          focus: f('sore throat', '/sɔːr θroʊt/', 'SORE THROAT', '"Throat" starts with /θr/: tongue between the teeth, then pull it back for /r/. Not "troat".', '"Throat" bắt đầu bằng /θr/: lưỡi giữa hai răng rồi kéo về sau cho /r/. Không đọc thành "troat".'),
        },
      },
      {
        at: 3, note: 'The pharmacist asks you to repeat the dose.', noteVi: 'Hôm nay dược sĩ nhờ bạn nhắc lại liều dùng.',
        turn: {
          say: 'Take two tablets three times a day. Can you repeat that for me?', vi: 'Uống hai viên, ba lần một ngày. Bạn nhắc lại giúp tôi được không?',
          task: 'Nhắc lại liều dùng: hai viên, ba lần một ngày.',
          replies: ['Two tablets, three times a day.', 'I take two tablets three times a day.', 'Two tablets, three times daily.'], accept: [['two', 'three'], ['three', 'times']],
          focus: f('three times a day', '/θriː taɪmz ə deɪ/', 'THREE TIMES a DAY', '/θ/ in "three", /z/ at the end of "times", then link: "times-a".', '/θ/ trong "three", /z/ cuối "times", rồi nối âm: "times-a".'),
        },
      },
      {
        at: 2, note: 'The pharmacist asks about other medicine.', noteVi: 'Hôm nay dược sĩ hỏi về thuốc bạn đang dùng.',
        turn: {
          say: 'Are you taking any other medicine right now?', vi: 'Hiện bạn có đang uống thuốc nào khác không?',
          task: 'Bạn chỉ uống vitamin mỗi ngày.',
          replies: ['Only vitamins, every day.', 'Just vitamins. Nothing else.', 'No, only some vitamins.'], accept: [['vitamins'], ['vitamin'], ['no'], ['nothing']],
          focus: f('vitamins', '/ˈvaɪtəmɪnz/', 'VI·ta·mins', 'Start with /v/ (top teeth on the bottom lip) and end with /z/.', 'Bắt đầu bằng /v/ (răng trên chạm môi dưới) và kết thúc bằng /z/.'),
        },
      },
    ],
  },
  {
    id: 'meet-neighbor', icon: '🏡', color: '#14b8a6', focus: 'daily', partner: 'Neighbor', partnerVi: 'Người hàng xóm',
    title: 'Meet a new neighbor', titleVi: 'Làm quen hàng xóm mới',
    intro: 'You have just moved into an apartment. You meet a neighbor in the hallway.', introVi: 'Bạn vừa chuyển đến một căn hộ. Bạn gặp một người hàng xóm ở hành lang.',
    turns: [
      {
        say: "Hello! I don't think we've met. Are you new here?", vi: 'Chào bạn! Hình như mình chưa gặp nhau. Bạn mới đến à?',
        task: 'Bạn vừa chuyển đến căn 3B.',
        replies: ['Yes, I just moved in. I live in 3B.', "Yes, I'm your new neighbor in 3B.", 'Yes, I moved in last week.'], accept: [['yes'], ['moved'], ['new']],
        focus: f('I just moved in', '/aɪ dʒʌst muːvd ɪn/', 'I just MOVED in', 'The -ed in "moved" is a /d/. Link it to "in": "moov-din".', 'Đuôi -ed trong "moved" đọc là /d/. Nối với "in": "moov-din".'),
      },
      {
        say: "Welcome! I'm Anna, from 3A. What's your name?", vi: 'Chào mừng bạn! Tôi là Anna, ở căn 3A. Bạn tên gì?',
        task: 'Nói tên bạn (câu mẫu dùng tên "Minh") và nói rất vui được gặp cô ấy.',
        replies: ["I'm Minh. Nice to meet you, Anna.", 'My name is Minh. Nice to meet you.', "It's Minh. Nice to meet you, Anna."], accept: [['nice', 'meet'], ['name'], ['i', 'am']],
        focus: f('nice to meet you', '/naɪs tə miːt juː/', 'NICE to MEET you', '"To" is weak here, /tə/, and "meet" has a long /iː/ and a final /t/.', '"To" ở đây đọc nhẹ thành /tə/, còn "meet" có âm /iː/ dài và âm /t/ ở cuối.'),
      },
      {
        say: 'Nice to meet you too. Is there anything you need to know about the area?', vi: 'Tôi cũng rất vui được gặp bạn. Bạn có cần biết gì về khu này không?',
        task: 'Hỏi một câu: gần đây có quán cà phê không?',
        replies: ['Is there a café nearby?', 'Yes. Is there a coffee shop near here?', 'Where is the nearest café?'], accept: [['cafe'], ['coffee']],
        focus: f('Is there a café nearby?', '/ɪz ðer ə kæˈfeɪ ˌnɪrˈbaɪ/', 'is there a ca·FÉ near·BY', 'This is a yes/no question, so your voice goes up at the end: near-BY↗.', 'Đây là câu hỏi có/không nên lên giọng ở cuối câu: near-BY↗.'),
      },
      {
        say: "It's just downstairs. I can show you now, if you like.", vi: 'Ở ngay tầng dưới thôi. Nếu bạn muốn, tôi chỉ cho bạn ngay bây giờ.',
        task: 'Nhận lời và cảm ơn.',
        replies: ['That would be great. Thank you!', 'Yes, please. Thank you, Anna.', 'Thanks, that is very kind.'], accept: [['thank'], ['thanks'], ['yes'], ['please']],
        focus: f('that would be great', '/ðæt wʊd bi ɡreɪt/', 'that would be GREAT', 'Finish "great" with a /t/. Without it, it sounds like "gray".', 'Đọc rõ âm /t/ ở cuối "great". Thiếu âm này sẽ nghe thành "gray".'),
      },
    ],
    final: {
      say: 'So, how do you like the building so far?', vi: 'Thế bạn thấy tòa nhà này thế nào?',
      task: 'Trả lời bằng lời của bạn: bạn thấy tòa nhà thế nào?',
      replies: ['I like it. It is quiet and clean.', "It's nice. The neighbors are friendly.", 'I really like it so far.'],
    },
    twists: [
      {
        at: 2, note: 'Today you ask about parking.', noteVi: 'Hôm nay bạn hỏi về chỗ để xe.',
        turn: {
          say: 'Nice to meet you too. Is there anything you would like to know about the building?', vi: 'Tôi cũng rất vui được gặp bạn. Bạn có muốn biết gì về tòa nhà không?',
          task: 'Hỏi một câu: để xe máy ở đâu?',
          replies: ['Where can I park my motorbike?', 'Is there parking for motorbikes?', 'Where is the parking area?'], accept: [['park'], ['parking']],
          focus: f('park my motorbike', '/pɑːrk maɪ ˈmoʊtərbaɪk/', 'PARK my MO·tor·bike', 'Both "park" and "bike" end with /k/. Release it lightly; do not drop it.', 'Cả "park" và "bike" đều kết thúc bằng /k/. Bật nhẹ âm này, đừng bỏ mất.'),
        },
      },
      {
        at: 2, note: 'Today you ask about the trash.', noteVi: 'Hôm nay bạn hỏi về chỗ đổ rác.',
        turn: {
          say: 'Nice to meet you too. Do you have any questions about living here?', vi: 'Tôi cũng rất vui được gặp bạn. Bạn có thắc mắc gì về việc sống ở đây không?',
          task: 'Hỏi một câu: đổ rác ở đâu?',
          replies: ['Where do I take the trash?', 'Where should I put my trash?', 'Where is the trash area?'], accept: [['trash'], ['rubbish'], ['garbage']],
          focus: f('trash', '/træʃ/', 'TRASH', 'Keep /tr/ together and end with /ʃ/, as in "she". It is not "tras".', 'Đọc liền /tr/ và kết thúc bằng /ʃ/ như trong "she". Không đọc thành "tras".'),
        },
      },
      {
        at: 1, note: 'A different second question.', noteVi: 'Hôm nay cô ấy hỏi bạn sống với ai.',
        turn: {
          say: "Welcome! I'm Anna, from 3A. Do you live alone or with your family?", vi: 'Chào mừng bạn! Tôi là Anna, ở căn 3A. Bạn sống một mình hay với gia đình?',
          task: 'Bạn sống với bố mẹ và em gái.',
          replies: ['I live with my family.', 'With my parents and my sister.', 'I live with my parents and my younger sister.'], accept: [['family'], ['parents'], ['sister']],
          focus: f('with my family', '/wɪð maɪ ˈfæməli/', 'with my FAM·i·ly', 'End "with" with /ð/, then stress the first part of "family".', 'Kết thúc "with" bằng /ð/, rồi nhấn âm tiết đầu của "family".'),
        },
      },
    ],
  },
  {
    id: 'delivery-driver', icon: '🛵', color: '#f59e0b', focus: 'daily', partner: 'Delivery driver', partnerVi: 'Tài xế giao hàng',
    title: 'Help a delivery driver find you', titleVi: 'Chỉ đường cho tài xế giao hàng',
    intro: 'You ordered lunch. The driver calls you because he cannot find your building.', introVi: 'Bạn đặt bữa trưa. Tài xế gọi điện vì không tìm thấy tòa nhà của bạn.',
    turns: [
      {
        say: "Hello, I have your food order. I'm outside, but I can't find your building.", vi: 'Xin chào, tôi giao đồ ăn cho bạn. Tôi đang ở ngoài nhưng không tìm thấy tòa nhà.',
        task: 'Bạn ở tòa nhà màu trắng, cạnh ngân hàng.',
        replies: ["Hi! It's the white building next to the bank.", "I'm in the white building, next to the bank.", 'Look for the white building beside the bank.'], accept: [['white'], ['bank']],
        focus: f('next to the bank', '/nekst tə ðə bæŋk/', 'NEXT to the BANK', 'Finish "bank" with /k/. "Next to" is said together: "nex-to".', 'Đọc rõ âm /k/ ở cuối "bank". "Next to" đọc liền thành "nex-to".'),
      },
      {
        say: 'Okay, I see it. Which entrance should I use?', vi: 'Được rồi, tôi thấy rồi. Tôi nên vào bằng cổng nào?',
        task: 'Bảo tài xế đến cổng phụ (side gate).',
        replies: ['The side gate, please.', 'Please come to the side gate.', 'Use the side gate, not the front door.'], accept: [['side']],
        focus: f('the side gate', '/ðə saɪd ɡeɪt/', 'the SIDE GATE', '"Side" ends with /d/ and "gate" ends with /t/. Say both final sounds.', '"Side" kết thúc bằng /d/, "gate" kết thúc bằng /t/. Hãy đọc đủ cả hai âm cuối.'),
      },
      {
        say: 'The side gate... where is that?', vi: 'Cổng phụ... nó ở đâu vậy?',
        task: 'Chỉ một hướng: rẽ trái sau ngân hàng.',
        replies: ['Turn left after the bank.', 'Go past the bank and turn left.', "It's on the left, after the bank."], accept: [['left']],
        focus: f('turn left', '/tɜːrn left/', 'TURN LEFT', '"Left" ends with two sounds, /f/ then /t/. Do not stop at "lef".', '"Left" kết thúc bằng hai âm /f/ rồi /t/. Đừng dừng ở "lef".'),
      },
      {
        say: 'Got it. Where should I meet you?', vi: 'Hiểu rồi. Tôi gặp bạn ở đâu?',
        task: 'Xác nhận điểm gặp: bạn đang ở cổng phụ.',
        replies: ["I'm at the side gate.", "I'll meet you at the side gate.", 'I am waiting at the side gate.'], accept: [['gate'], ['side']],
        focus: f("I'll meet you at the gate", '/aɪl miːt ju ət ðə ɡeɪt/', "I'll MEET you at the GATE", 'Say the "ll" in "I\'ll", and link "meet you": "mee-chu".', 'Đọc rõ âm "ll" trong "I\'ll" và nối "meet you" thành "mee-chu".'),
      },
    ],
    final: {
      say: 'Sorry, I forgot. Which gate?', vi: 'Xin lỗi, tôi quên mất. Cổng nào nhỉ?',
      task: 'Trả lời bằng lời của bạn: tài xế hỏi lại là cổng nào.',
      replies: ['The side gate, please.', "The side gate. I'm waiting there.", 'The side one, next to the bank.'],
    },
    twists: [
      {
        at: 3, note: 'The driver is late.', noteVi: 'Hôm nay tài xế đến trễ.',
        turn: {
          say: "Got it. Sorry, there's a lot of traffic. I'll be there in ten minutes. Is that okay?", vi: 'Hiểu rồi. Xin lỗi, đường đang kẹt xe. Mười phút nữa tôi tới. Như vậy được không?',
          task: 'Đồng ý và nói bạn sẽ chờ ở cổng phụ.',
          replies: ["That's fine. I'll wait at the side gate.", 'No problem. See you in ten minutes.', 'Okay, I can wait.'], accept: [['fine'], ['problem'], ['okay'], ['wait']],
          focus: f("I'll wait at the side gate", '/aɪl weɪt ət ðə saɪd ɡeɪt/', "I'll WAIT at the SIDE GATE", '"Wait" and "gate" both end with /t/. Link "wait at": "wei-tat".', '"Wait" và "gate" đều kết thúc bằng /t/. Nối "wait at" thành "wei-tat".'),
        },
      },
      {
        at: 3, note: 'Something is missing from the order.', noteVi: 'Hôm nay đơn hàng bị thiếu món.',
        turn: {
          say: "Got it. One more thing: the restaurant forgot your drink. I'm sorry about that.", vi: 'Hiểu rồi. Còn một việc: quán quên đồ uống của bạn. Tôi xin lỗi nhé.',
          task: 'Nói không sao và lịch sự xin hoàn tiền đồ uống.',
          replies: ['That is okay. Could I get a refund for the drink?', 'No problem. Could I have a refund, please?', "It's fine. Could you refund the drink?"], accept: [['refund']],
          focus: f('Could I get a refund?', '/kʊd aɪ ɡet ə ˈriːfʌnd/', 'could I get a RE·fund', '"Could I…" is a polite way to ask. Link it: "cu-dai".', '"Could I…" là cách hỏi lịch sự. Nối âm thành "cu-dai".'),
        },
      },
      {
        at: 0, note: 'The driver is at the wrong address.', noteVi: 'Hôm nay tài xế đến nhầm địa chỉ.',
        turn: {
          say: "Hi, this is your delivery driver. I think I'm at the wrong address. What's your building number?", vi: 'Chào bạn, tôi là tài xế giao hàng. Hình như tôi đến nhầm địa chỉ. Tòa nhà của bạn số mấy?',
          task: 'Tòa nhà của bạn là số 15, đường Trần Phú.',
          replies: ["It's number fifteen, Tran Phu Street.", 'Number 15 on Tran Phu Street.', 'Building fifteen, Tran Phu Street.'], accept: [['fifteen']],
          focus: f('fifteen', '/ˌfɪfˈtiːn/', 'fif·TEEN', 'Stress the end and finish with /n/: fif-TEEN. With the stress at the start it sounds like "fifty".', 'Nhấn âm tiết cuối và đọc rõ âm /n/: fif-TEEN. Nhấn âm đầu sẽ nghe thành "fifty".'),
        },
      },
    ],
  },
  {
    id: 'job-interview', icon: '🤝', color: '#0f766e', focus: 'work', partner: 'Interviewer', partnerVi: 'Người phỏng vấn', next: 'interview-2',
    title: 'A short job interview', titleVi: 'Phỏng vấn xin việc ngắn',
    intro: 'You are interviewing for a job. Use your real job, or the example: quality control at a factory.', introVi: 'Bạn đang phỏng vấn xin việc. Hãy dùng công việc thật của bạn, hoặc ví dụ: kiểm tra chất lượng ở nhà máy.',
    turns: [
      {
        say: 'Good morning. Please tell me a little about yourself.', vi: 'Chào buổi sáng. Bạn giới thiệu đôi chút về mình nhé.',
        task: 'Giới thiệu tên và công việc của bạn (câu mẫu: Lan, kiểm tra chất lượng ở nhà máy).',
        replies: ["I'm Lan. I work in quality control at a factory.", 'My name is Lan, and I work in quality control.', "I'm Lan. I have worked in a factory for three years."], accept: [['work'], ['worked'], ['name'], ['i', 'am'], ['job']],
        focus: f('quality control', '/ˈkwɑːləti kənˈtroʊl/', 'QUAL·i·ty con·TROL', 'Stress QUAL in "quality" and TROL in "control". "Qu" is /kw/.', 'Nhấn QUAL trong "quality" và TROL trong "control". "Qu" đọc là /kw/.'),
      },
      {
        say: 'What do you do in your job every day?', vi: 'Hằng ngày bạn làm những việc gì?',
        task: 'Mô tả công việc (câu mẫu: kiểm tra lỗi trên các chi tiết đã sơn).',
        replies: ['I check painted parts for defects.', 'I inspect the parts and write a report.', 'I check the products before they are shipped.'], accept: [['check'], ['inspect'], ['parts'], ['products'], ['report'], ['customers'], ['work']],
        focus: f('painted parts', '/ˈpeɪntɪd pɑːrts/', 'PAINT·ed PARTS', 'After /t/, -ed is an extra syllable: PAIN-tid. "Parts" ends with /ts/.', 'Sau âm /t/, đuôi -ed là một âm tiết riêng: PAIN-tid. "Parts" kết thúc bằng /ts/.'),
      },
      {
        say: 'Can you give me one example of a problem you solved?', vi: 'Bạn nêu một ví dụ về vấn đề bạn đã giải quyết được không?',
        task: 'Nêu một ví dụ (câu mẫu: tháng trước bạn phát hiện lỗi sơn và báo tổ trưởng).',
        replies: ['Last month I found a paint defect and told my team leader.', 'I found a defect early, so we fixed it the same day.', 'Once I noticed a problem and stopped the line.'], accept: [['found'], ['fixed'], ['solved'], ['noticed'], ['problem'], ['defect']],
        focus: f('found a defect', '/faʊnd ə ˈdiːfekt/', 'FOUND a DE·fect', 'Link "found a": "foun-da". "Defect" ends with /kt/; say both sounds.', 'Nối "found a" thành "foun-da". "Defect" kết thúc bằng /kt/; đọc đủ cả hai âm.'),
      },
      {
        say: 'Thank you. Do you have any questions for me?', vi: 'Cảm ơn bạn. Bạn có câu hỏi nào cho tôi không?',
        task: 'Hỏi một câu để kết thúc: giờ làm việc thế nào?',
        replies: ['Yes. What are the working hours?', 'Could I ask about the working hours?', 'Yes. When does the job start?'], accept: [['hours'], ['start'], ['when'], ['what'], ['could']],
        focus: f('Could I ask about the working hours?', '/kʊd aɪ æsk əˈbaʊt ðə ˈwɜːrkɪŋ ˈaʊərz/', 'could I ASK about the WORK·ing HOURS', '"Could I ask…" is polite. The "h" in "hours" is silent: "ow-erz".', '"Could I ask…" là cách hỏi lịch sự. Chữ "h" trong "hours" là âm câm: "ow-erz".'),
      },
    ],
    final: {
      say: 'One last thing: can you work on weekends if we need you?', vi: 'Câu cuối: khi cần, bạn có thể làm việc cuối tuần không?',
      task: 'Trả lời bằng lời của bạn: bạn có làm cuối tuần được không?',
      replies: ['Yes, I can work on Saturdays.', "Yes, that's no problem.", 'Sometimes, but not every week.'],
    },
    twists: [
      {
        at: 1, note: 'A question about your tools.', noteVi: 'Hôm nay người phỏng vấn hỏi về công cụ bạn dùng.',
        turn: {
          say: 'What tools or software do you use at work?', vi: 'Ở chỗ làm bạn dùng công cụ hay phần mềm gì?',
          task: 'Bạn dùng Excel và email mỗi ngày.',
          replies: ['I use Excel and email every day.', 'Mostly Excel, and email for reports.', 'I use Excel to record the results.'], accept: [['excel'], ['use']],
          focus: f('I use Excel', '/aɪ juːz ɪkˈsel/', 'I USE ex·CEL', 'The verb "use" ends with /z/, and "Excel" is stressed at the end: ex-CEL.', 'Động từ "use" kết thúc bằng /z/, còn "Excel" nhấn ở cuối: ex-CEL.'),
        },
      },
      {
        at: 2, note: 'A question about teamwork.', noteVi: 'Hôm nay người phỏng vấn hỏi về làm việc nhóm.',
        turn: {
          say: 'Tell me about a time you worked with a team.', vi: 'Hãy kể về một lần bạn làm việc cùng nhóm.',
          task: 'Nhóm bạn đã cùng hoàn thành một đơn hàng lớn đúng hạn.',
          replies: ['We finished a big order on time together.', 'My team and I finished a large order on time.', 'Last year we worked together on a big order.'], accept: [['team'], ['together'], ['we']],
          focus: f('finished on time', '/ˈfɪnɪʃt ɑːn taɪm/', 'FIN·ished on TIME', 'The -ed in "finished" is a /t/: FIN-isht. Link it: "finish-ton".', 'Đuôi -ed trong "finished" đọc là /t/: FIN-isht. Nối âm: "finish-ton".'),
        },
      },
      {
        at: 3, note: 'A different closing question.', noteVi: 'Hôm nay bạn hỏi về lịch làm việc.',
        turn: {
          say: 'Thank you. Do you have any questions about the schedule or the salary?', vi: 'Cảm ơn bạn. Bạn có câu hỏi nào về lịch làm việc hay mức lương không?',
          task: 'Lịch sự hỏi về lịch làm việc.',
          replies: ['Could you tell me about the schedule?', 'Yes. Is there overtime?', 'What is the salary for this position?'], accept: [['schedule'], ['overtime'], ['salary']],
          focus: f('schedule', '/ˈskedʒuːl/', 'SCHED·ule', 'In American English it starts with /sk/: SKED-jool.', 'Trong tiếng Anh Mỹ, từ này bắt đầu bằng /sk/: SKED-jool.'),
        },
      },
    ],
  },
  {
    id: 'interview-2', icon: '⭐', color: '#0369a1', focus: 'work', partner: 'Interviewer', partnerVi: 'Người phỏng vấn', optional: true,
    title: 'Interview 2: strengths and experience', titleVi: 'Phỏng vấn 2: điểm mạnh và kinh nghiệm',
    intro: 'An optional second interview, if you want more practice. This time you talk about your experience and strengths.', introVi: 'Buổi phỏng vấn thứ hai, không bắt buộc, nếu bạn muốn luyện thêm. Lần này bạn nói về kinh nghiệm và điểm mạnh của mình.',
    turns: [
      {
        say: 'Thanks for coming back. How much experience do you have?', vi: 'Cảm ơn bạn đã quay lại. Bạn có bao nhiêu năm kinh nghiệm?',
        task: 'Bạn có ba năm kinh nghiệm chăm sóc khách hàng (hoặc nói về công việc thật của bạn).',
        replies: ['I have three years of experience in customer service.', "I've worked in customer service for three years.", 'Three years. I work in customer service.'], accept: [['experience'], ['customer', 'service'], ['years']],
        focus: f('experience', '/ɪkˈspɪriəns/', 'ex·PE·ri·ence', 'Stress the second part, ex-PE-ri-ence, and finish with a clear /s/.', 'Nhấn âm tiết thứ hai: ex-PE-ri-ence, và đọc rõ âm /s/ ở cuối.'),
      },
      {
        say: 'Why do you want to work here?', vi: 'Vì sao bạn muốn làm việc ở đây?',
        task: 'Bạn muốn học hỏi thêm và phát triển cùng công ty.',
        replies: ['I want to learn more and grow with the company.', "I'd like to learn new things and grow here.", 'Because I can learn and grow with your team.'], accept: [['learn'], ['grow']],
        focus: f('grow with the company', '/ɡroʊ wɪð ðə ˈkʌmpəni/', 'GROW with the COM·pa·ny', 'Keep /ɡr/ together. "With the" has two /ð/ sounds: tongue between the teeth for both.', 'Đọc liền /ɡr/. "With the" có hai âm /ð/: đặt lưỡi giữa hai hàm răng cho cả hai.'),
      },
      {
        say: 'What is your greatest strength?', vi: 'Điểm mạnh nhất của bạn là gì?',
        task: 'Bạn làm việc nhóm tốt và giữ bình tĩnh khi áp lực.',
        replies: ['I work well in a team, and I stay calm under pressure.', "I'm a good team player and I stay calm.", 'I stay calm under pressure and I work well with others.'], accept: [['team'], ['calm'], ['pressure']],
        focus: f('calm under pressure', '/kɑːm ˈʌndər ˈpreʃər/', 'CALM un·der PRES·sure', 'The "l" in "calm" is silent, and "pressure" has /ʃ/, as in "she".', 'Chữ "l" trong "calm" là âm câm, và "pressure" có âm /ʃ/ như trong "she".'),
      },
      {
        say: 'When can you start?', vi: 'Khi nào bạn có thể bắt đầu?',
        task: 'Bạn có thể bắt đầu từ tháng sau.',
        replies: ['I can start next month.', 'Next month would be good for me.', "I'm available from next month."], accept: [['month']],
        focus: f('next month', '/nekst mʌnθ/', 'NEXT MONTH', '"Month" ends with /θ/: tongue between the teeth. Not "mont" or "mons".', '"Month" kết thúc bằng /θ/: lưỡi giữa hai hàm răng. Không đọc thành "mont" hay "mons".'),
      },
    ],
    final: {
      say: 'Is there anything else you would like to tell me?', vi: 'Bạn còn điều gì muốn chia sẻ thêm không?',
      task: 'Trả lời bằng lời của bạn: nói thêm một điều về bạn, hoặc cảm ơn.',
      replies: ['I learn fast and I work hard.', 'I am very interested in this job.', 'No, thank you. I look forward to hearing from you.'],
    },
    twists: [
      {
        at: 0, note: 'A question about your current job.', noteVi: 'Hôm nay người phỏng vấn hỏi về công việc hiện tại.',
        turn: {
          say: 'Welcome back. What do you do in your current job?', vi: 'Chào bạn. Ở công việc hiện tại bạn làm gì?',
          task: 'Bạn trả lời email và cuộc gọi của khách hàng.',
          replies: ['I answer emails and calls from customers.', 'I help customers by email and phone.', 'I reply to customer emails and take their calls.'], accept: [['customers'], ['customer'], ['emails'], ['email']],
          focus: f('customers', '/ˈkʌstəmərz/', 'CUS·tom·ers', 'Stress the first part and finish with /z/: CUS-tom-erz.', 'Nhấn âm tiết đầu và kết thúc bằng /z/: CUS-tom-erz.'),
        },
      },
      {
        at: 2, note: 'A question about what you want to improve.', noteVi: 'Hôm nay người phỏng vấn hỏi điều bạn muốn cải thiện.',
        turn: {
          say: 'What is one thing you would like to improve?', vi: 'Bạn muốn cải thiện điều gì ở bản thân?',
          task: 'Bạn muốn nói tiếng Anh tự tin hơn.',
          replies: ['I want to speak English more confidently.', "I'd like to improve my English speaking.", 'My English. I am practising every day.'], accept: [['english']],
          focus: f('more confidently', '/mɔːr ˈkɑːnfɪdəntli/', 'more CON·fi·dent·ly', 'Stress the first part of "confidently": CON-fi-dent-ly. Do not skip the /d/.', 'Nhấn âm tiết đầu của "confidently": CON-fi-dent-ly. Đừng bỏ âm /d/.'),
        },
      },
      {
        at: 3, note: 'A question about the future.', noteVi: 'Hôm nay người phỏng vấn hỏi về kế hoạch tương lai.',
        turn: {
          say: 'Where do you see yourself in three years?', vi: 'Ba năm nữa bạn thấy mình ở vị trí nào?',
          task: 'Bạn muốn trở thành trưởng nhóm.',
          replies: ['I would like to be a team leader.', 'I hope to lead a small team.', "I'd like to become a team leader here."], accept: [['team'], ['leader'], ['lead']],
          focus: f('team leader', '/tiːm ˈliːdər/', 'TEAM LEAD·er', 'Both words have a long /iː/. Close your lips for the /m/ at the end of "team".', 'Cả hai từ đều có âm /iː/ dài. Khép môi để đọc âm /m/ cuối từ "team".'),
        },
      },
    ],
  },
];

export const scenarioById = (id) => SCENARIOS.find((s) => s.id === id);
