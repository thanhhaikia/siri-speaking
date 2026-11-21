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
];

export const scenarioById = (id) => SCENARIOS.find((s) => s.id === id);
