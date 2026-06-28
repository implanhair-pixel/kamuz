import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'les_greetings',
    pathId: 'path_everyday',
    order: 1,
    title: { en: 'Greetings & Introductions', fa: 'احوال‌پرسی و معرفی', ku: 'سڵاو و ناساندن' },
    description: {
      en: 'Learn the most common ways to greet people and introduce yourself.',
      fa: 'رایج‌ترین روش‌های احوال‌پرسی و معرفی خود را یاد بگیر.',
      ku: 'باوەرترین ڕێگاکانی سڵاوکردن و ناساندنی خۆت فێربە.',
    },
    content: {
      en: 'In Kurdish culture, greetings are warm and often lengthy. A simple "slav" goes a long way, but asking about family shows respect.',
      fa: 'در فرهنگ کردی، احوال‌پرسی‌ها گرم و اغلب طولانی هستند. یک "سڵاو" ساده بسیار کمک می‌کند، اما پرسیدن از خانواده نشانه احترام است.',
      ku: 'لە کولتوری کوردیدا، سڵاوکردن گەرم و زۆرجار درێژە. تەنها "سڵاو" زۆر یارمەتیدەرە، بەڵام پرسیار لە بارەی خێزان نیشانەی ڕێزە.',
    },
    vocab: [
      { term: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' }, meaning: { en: 'A greeting', fa: 'احوال‌پرسی', ku: 'سڵاوکردن' } },
      { term: { en: 'How are you?', fa: 'چطوری؟', ku: 'چۆنی؟' }, meaning: { en: 'Asking about wellbeing', fa: 'پرسیدن از حال', ku: 'پرسیار لە بارەی حال' } },
      { term: { en: 'Thank you', fa: 'ممنون', ku: 'سوپاس' }, meaning: { en: 'Expression of gratitude', fa: 'بیان تشکر', ku: 'دەربڕینی سوپاس' } },
      { term: { en: 'Welcome', fa: 'خوش آمدید', ku: 'بەخێربێیت' }, meaning: { en: 'Greeting a guest', fa: 'خوش‌آمدگویی', ku: 'بەخێرهاتنی میوان' } },
    ],
    flashcards: [
      { id: 'fc_g1', front: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' }, back: { en: 'slav', fa: 'سڵاو', ku: 'سڵاو' }, dialect: { en: 'Sorani', fa: 'سورانی', ku: 'سۆرانی' } },
      { id: 'fc_g2', front: { en: 'Thank you', fa: 'ممنون', ku: 'سوپاس' }, back: { en: 'supas', fa: 'سوپاس', ku: 'سوپاس' } },
      { id: 'fc_g3', front: { en: 'Yes', fa: 'بله', ku: 'بەڵێ' }, back: { en: 'belê', fa: 'بەڵێ', ku: 'بەڵێ' } },
      { id: 'fc_g4', front: { en: 'No', fa: 'نه', ku: 'نەخێر' }, back: { en: 'nexêr', fa: 'نەخێر', ku: 'نەخێر' } },
      { id: 'fc_g5', front: { en: 'Welcome', fa: 'خوش آمدید', ku: 'بەخێربێیت' }, back: { en: 'bixêrbêjit', fa: 'بەخێربێیت', ku: 'بەخێربێیت' } },
    ],
    quiz: [
      {
        id: 'q_g1',
        question: { en: 'How do you say "Hello" in Sorani Kurdish?', fa: '«سلام» را به کردی سورانی چطور می‌گوییم؟', ku: '«سڵاو» بە سۆرانی چۆن دەڵێین؟' },
        options: [
          { en: 'supas', fa: 'سوپاس', ku: 'سوپاس' },
          { en: 'slav', fa: 'سڵاو', ku: 'سڵاو' },
          { en: 'belê', fa: 'بەڵێ', ku: 'بەڵێ' },
          { en: 'nexêr', fa: 'نەخێر', ku: 'نەخێر' },
        ],
        correctIndex: 1,
        explanation: { en: '"slav" (سڵاو) means hello in Sorani.', fa: '«سڵاو» به معنای سلام در سورانی است.', ku: '«سڵاو» بە واتای سڵاوە لە سۆرانیدا.' },
      },
      {
        id: 'q_g2',
        question: { en: 'What does "supas" mean?', fa: '«سوپاس» یعنی چه؟', ku: '«سوپاس» چی مانا دەهێنێت؟' },
        options: [
          { en: 'Goodbye', fa: 'خداحافظ', ku: 'خواتخواز' },
          { en: 'Thank you', fa: 'ممنون', ku: 'سوپاس' },
          { en: 'Please', fa: 'لطفاً', ku: 'تکایە' },
          { en: 'Sorry', fa: 'ببخشید', ku: 'ببوورە' },
        ],
        correctIndex: 1,
        explanation: { en: '"supas" means thank you.', fa: '«سوپاس» یعنی ممنون.', ku: '«سوپاس» واتای سوپاس دەهێنێت.' },
      },
      {
        id: 'q_g3',
        question: { en: 'How do you say "No" in Sorani?', fa: '«نه» را به سورانی چطور می‌گوییم؟', ku: '«نەخێر» بە سۆرانی چۆن دەڵێین؟' },
        options: [
          { en: 'belê', fa: 'بەڵێ', ku: 'بەڵێ' },
          { en: 'slav', fa: 'سڵاو', ku: 'سڵاو' },
          { en: 'nexêr', fa: 'نەخێر', ku: 'نەخێر' },
          { en: 'supas', fa: 'سوپاس', ku: 'سوپاس' },
        ],
        correctIndex: 2,
        explanation: { en: '"nexêr" (نەخێر) means no.', fa: '«نەخێر» یعنی نه.', ku: '«نەخێر» واتای نەخێرە.' },
      },
    ],
    matching: [
      { id: 'm_g1', term: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' }, meaning: { en: 'slav', fa: 'سڵاو', ku: 'سڵاو' } },
      { id: 'm_g2', term: { en: 'Thank you', fa: 'ممنون', ku: 'سوپاس' }, meaning: { en: 'supas', fa: 'سوپاس', ku: 'سوپاس' } },
      { id: 'm_g3', term: { en: 'Yes', fa: 'بله', ku: 'بەڵێ' }, meaning: { en: 'belê', fa: 'بەڵێ', ku: 'بەڵێ' } },
      { id: 'm_g4', term: { en: 'No', fa: 'نه', ku: 'نەخێر' }, meaning: { en: 'nexêr', fa: 'نەخێر', ku: 'نەخێر' } },
    ],
  },
  {
    id: 'les_numbers',
    pathId: 'path_everyday',
    order: 2,
    title: { en: 'Counting & Numbers', fa: 'شمارش و اعداد', ku: 'ژمارە و کۆکردنەوە' },
    description: {
      en: 'Master the numbers 1–10 and beyond in Kurdish.',
      fa: 'اعداد ۱ تا ۱۰ و فراتر را در کردی یاد بگیر.',
      ku: 'ژمارەکانی ١–١٠ و زیاتر لە کوردیدا فێربە.',
    },
    content: {
      en: 'Numbers in Sorani follow a base-10 system similar to Persian, using the same Eastern Arabic numerals (١، ٢، ٣…).',
      fa: 'اعداد در سورانی از سیستم پایه ۱۰ پیروی می‌کنند و مشابه فارسی از اعداد عربی شرقی استفاده می‌کنند.',
      ku: 'ژمارەکان لە سۆرانیدا سیستەمی بنکە ١٠ بەکاردەهێنن و هاوشێوەی فارسی ئەعدادی عەرەبی ڕۆژهەڵات بەکاردەهێنن.',
    },
    vocab: [
      { term: { en: 'One', fa: 'یک', ku: 'یەک' }, meaning: { en: 'The number 1', fa: 'عدد ۱', ku: 'ژمارە ١' } },
      { term: { en: 'Two', fa: 'دو', ku: 'دوو' }, meaning: { en: 'The number 2', fa: 'عدد ۲', ku: 'ژمارە ٢' } },
      { term: { en: 'Three', fa: 'سه', ku: 'سێ' }, meaning: { en: 'The number 3', fa: 'عدد ۳', ku: 'ژمارە ٣' } },
      { term: { en: 'Five', fa: 'پنج', ku: 'پێنج' }, meaning: { en: 'The number 5', fa: 'عدد ۵', ku: 'ژمارە ٥' } },
    ],
    flashcards: [
      { id: 'fc_n1', front: { en: 'One', fa: 'یک', ku: 'یەک' }, back: { en: 'yek', fa: 'یەک', ku: 'یەک' } },
      { id: 'fc_n2', front: { en: 'Two', fa: 'دو', ku: 'دوو' }, back: { en: 'du', fa: 'دوو', ku: 'دوو' } },
      { id: 'fc_n3', front: { en: 'Three', fa: 'سه', ku: 'سێ' }, back: { en: 'sê', fa: 'سێ', ku: 'سێ' } },
      { id: 'fc_n4', front: { en: 'Four', fa: 'چهار', ku: 'چوار' }, back: { en: 'çwar', fa: 'چوار', ku: 'چوار' } },
      { id: 'fc_n5', front: { en: 'Five', fa: 'پنج', ku: 'پێنج' }, back: { en: 'pênc', fa: 'پێنج', ku: 'پێنج' } },
    ],
    quiz: [
      {
        id: 'q_n1',
        question: { en: 'What is "yek" in English?', fa: '«یەک» به انگلیسی چیست؟', ku: '«یەک» بە ئینگلیزی چییە؟' },
        options: [
          { en: 'Two', fa: 'دو', ku: 'دوو' },
          { en: 'One', fa: 'یک', ku: 'یەک' },
          { en: 'Ten', fa: 'ده', ku: 'دە' },
          { en: 'Five', fa: 'پنج', ku: 'پێنج' },
        ],
        correctIndex: 1,
        explanation: { en: '"yek" means one.', fa: '«یەک» یعنی یک.', ku: '«یەک» واتای یەکە.' },
      },
      {
        id: 'q_n2',
        question: { en: 'How do you say "Three" in Sorani?', fa: '«سه» را به سورانی چطور می‌گوییم؟', ku: '«سێ» بە سۆرانی چۆن دەڵێین؟' },
        options: [
          { en: 'du', fa: 'دوو', ku: 'دوو' },
          { en: 'sê', fa: 'سێ', ku: 'سێ' },
          { en: 'çwar', fa: 'چوار', ku: 'چوار' },
          { en: 'pênc', fa: 'پێنج', ku: 'پێنج' },
        ],
        correctIndex: 1,
        explanation: { en: '"sê" means three.', fa: '«سێ» یعنی سه.', ku: '«سێ» واتای سێیە.' },
      },
    ],
    matching: [
      { id: 'm_n1', term: { en: 'One', fa: 'یک', ku: 'یەک' }, meaning: { en: 'yek', fa: 'یەک', ku: 'یەک' } },
      { id: 'm_n2', term: { en: 'Two', fa: 'دو', ku: 'دوو' }, meaning: { en: 'du', fa: 'دوو', ku: 'دوو' } },
      { id: 'm_n3', term: { en: 'Three', fa: 'سه', ku: 'سێ' }, meaning: { en: 'sê', fa: 'سێ', ku: 'سێ' } },
      { id: 'm_n4', term: { en: 'Five', fa: 'پنج', ku: 'پێنج' }, meaning: { en: 'pênc', fa: 'پێنج', ku: 'پێنج' } },
    ],
  },
  {
    id: 'les_family_basics',
    pathId: 'path_everyday',
    order: 3,
    title: { en: 'Family Basics', fa: 'خانواده — مبانی', ku: 'خێزان — بنەڕەت' },
    description: {
      en: 'Learn the words for immediate family members.',
      fa: 'واژگان اعضای نزدیک خانواده را یاد بگیر.',
      ku: 'وشەکانی ئەندامانی نزیکی خێزان فێربە.',
    },
    content: {
      en: 'Family is central to Kurdish life. Knowing the words for mother, father, brother and sister lets you connect on a personal level.',
      fa: 'خانواده در زندگی کردی محوری است. دانستن واژگان مادر، پدر، برادر و خواهر به شما کمک می‌کند ارتباط شخصی برقرار کنید.',
      ku: 'خێزان لە ژیانی کوردیدا ناوەندییە. زانینی وشەکانی دایک، باوک، برا و خوشک یارمەتیت دەدات پەیوەندی کەسی بکەیت.',
    },
    vocab: [
      { term: { en: 'Father', fa: 'پدر', ku: 'باوک' }, meaning: { en: 'Male parent', fa: 'والد مرد', ku: 'باوک' } },
      { term: { en: 'Mother', fa: 'مادر', ku: 'دایک' }, meaning: { en: 'Female parent', fa: 'والد زن', ku: 'دایک' } },
      { term: { en: 'Brother', fa: 'برادر', ku: 'برا' }, meaning: { en: 'Male sibling', fa: 'خواهر/برادر مرد', ku: 'برا' } },
      { term: { en: 'Sister', fa: 'خواهر', ku: 'خوشک' }, meaning: { en: 'Female sibling', fa: 'خواهر زن', ku: 'خوشک' } },
    ],
    flashcards: [
      { id: 'fc_f1', front: { en: 'Father', fa: 'پدر', ku: 'باوک' }, back: { en: 'bawk', fa: 'باوک', ku: 'باوک' } },
      { id: 'fc_f2', front: { en: 'Mother', fa: 'مادر', ku: 'دایک' }, back: { en: 'dayk', fa: 'دایک', ku: 'دایک' } },
      { id: 'fc_f3', front: { en: 'Brother', fa: 'برادر', ku: 'برا' }, back: { en: 'bra', fa: 'برا', ku: 'برا' } },
      { id: 'fc_f4', front: { en: 'Sister', fa: 'خواهر', ku: 'خوشک' }, back: { en: 'xuşk', fa: 'خوشک', ku: 'خوشک' } },
    ],
    quiz: [
      {
        id: 'q_f1',
        question: { en: 'What does "dayk" mean?', fa: '«دایک» یعنی چه؟', ku: '«دایک» چی مانا دەهێنێت؟' },
        options: [
          { en: 'Father', fa: 'پدر', ku: 'باوک' },
          { en: 'Mother', fa: 'مادر', ku: 'دایک' },
          { en: 'Sister', fa: 'خواهر', ku: 'خوشک' },
          { en: 'Brother', fa: 'برادر', ku: 'برا' },
        ],
        correctIndex: 1,
        explanation: { en: '"dayk" means mother.', fa: '«دایک» یعنی مادر.', ku: '«دایک» واتای دایکە.' },
      },
      {
        id: 'q_f2',
        question: { en: 'How do you say "Brother" in Sorani?', fa: '«برادر» به سورانی چطور است؟', ku: '«برا» بە سۆرانی چۆنە؟' },
        options: [
          { en: 'bawk', fa: 'باوک', ku: 'باوک' },
          { en: 'bra', fa: 'برا', ku: 'برا' },
          { en: 'dayk', fa: 'دایک', ku: 'دایک' },
          { en: 'xuşk', fa: 'خوشک', ku: 'خوشک' },
        ],
        correctIndex: 1,
        explanation: { en: '"bra" means brother.', fa: '«برا» یعنی برادر.', ku: '«برا» واتای برایە.' },
      },
    ],
    matching: [
      { id: 'm_f1', term: { en: 'Father', fa: 'پدر', ku: 'باوک' }, meaning: { en: 'bawk', fa: 'باوک', ku: 'باوک' } },
      { id: 'm_f2', term: { en: 'Mother', fa: 'مادر', ku: 'دایک' }, meaning: { en: 'dayk', fa: 'دایک', ku: 'دایک' } },
      { id: 'm_f3', term: { en: 'Brother', fa: 'برادر', ku: 'برا' }, meaning: { en: 'bra', fa: 'برا', ku: 'برا' } },
      { id: 'm_f4', term: { en: 'Sister', fa: 'خواهر', ku: 'خوشک' }, meaning: { en: 'xuşk', fa: 'خوشک', ku: 'خوشک' } },
    ],
  },
  {
    id: 'les_travel_essentials',
    pathId: 'path_travel',
    order: 1,
    title: { en: 'Travel Essentials', fa: 'ضروریات سفر', ku: 'پێویستییەکانی گەشت' },
    description: {
      en: 'The key phrases every traveler in Kurdistan needs.',
      fa: 'عبارات کلیدی که هر مسافری در کردستان به آن نیاز دارد.',
      ku: 'دەستەواژە سەرەکییەکان کە هەر گەشتیارێک لە کوردستان پێویستی پێیەتی.',
    },
    content: {
      en: 'Whether ordering tea or finding your hotel, these phrases will make your trip smoother and warmer.',
      fa: 'چه برای سفار چای چه برای پیدا کردن هتل، این عبارات سفرتان را روان‌تر و گرم‌تر می‌کنند.',
      ku: 'نەک تەنها بۆ داواکردنی چا بەڵکو بۆ دۆزینەوەی هوتێل، ئەم دەستەواژانە گەشتەکەت نەرمتر و گەرمتر دەکەن.',
    },
    vocab: [
      { term: { en: 'Hotel', fa: 'هتل', ku: 'هوتێل' }, meaning: { en: 'A place to stay', fa: 'محل اقامت', ku: 'شوێنی مانەوە' } },
      { term: { en: 'Airport', fa: 'فرودگاه', ku: 'فڕۆکەخانە' }, meaning: { en: 'Where planes land', fa: 'محل فرود هواپیما', ku: 'شوێنی دانیشتنی فڕۆکە' } },
      { term: { en: 'Map', fa: 'نقشه', ku: 'نەخشە' }, meaning: { en: 'A guide to places', fa: 'راهنمای مکان‌ها', ku: 'ڕێبەری شوێنەکان' } },
    ],
    flashcards: [
      { id: 'fc_t1', front: { en: 'Hotel', fa: 'هتل', ku: 'هوتێل' }, back: { en: 'hotêl', fa: 'هوتێل', ku: 'هوتێل' } },
      { id: 'fc_t2', front: { en: 'Airport', fa: 'فرودگاه', ku: 'فڕۆکەخانە' }, back: { en: 'frôkexane', fa: 'فڕۆکەخانە', ku: 'فڕۆکەخانە' } },
      { id: 'fc_t3', front: { en: 'Map', fa: 'نقشه', ku: 'نەخشە' }, back: { en: 'nexşe', fa: 'نەخشە', ku: 'نەخشە' } },
      { id: 'fc_t4', front: { en: 'Road', fa: 'جاده', ku: 'ڕێگا' }, back: { en: 'rêga', fa: 'ڕێگا', ku: 'ڕێگا' } },
    ],
    quiz: [
      {
        id: 'q_t1',
        question: { en: 'What does "hotêl" mean?', fa: '«هوتێل» یعنی چه؟', ku: '«هوتێل» چی مانا دەهێنێت؟' },
        options: [
          { en: 'Airport', fa: 'فرودگاه', ku: 'فڕۆکەخانە' },
          { en: 'Hotel', fa: 'هتل', ku: 'هوتێل' },
          { en: 'Road', fa: 'جاده', ku: 'ڕێگا' },
          { en: 'Map', fa: 'نقشه', ku: 'نەخشە' },
        ],
        correctIndex: 1,
        explanation: { en: '"hotêl" means hotel.', fa: '«هوتێل» یعنی هتل.', ku: '«هوتێل» واتای هوتێلە.' },
      },
    ],
    matching: [
      { id: 'm_t1', term: { en: 'Hotel', fa: 'هتل', ku: 'هوتێل' }, meaning: { en: 'hotêl', fa: 'هوتێل', ku: 'هوتێل' } },
      { id: 'm_t2', term: { en: 'Map', fa: 'نقشه', ku: 'نەخشە' }, meaning: { en: 'nexşe', fa: 'نەخشە', ku: 'نەخشە' } },
      { id: 'm_t3', term: { en: 'Road', fa: 'جاده', ku: 'ڕێگا' }, meaning: { en: 'rêga', fa: 'ڕێگا', ku: 'ڕێگا' } },
    ],
  },
  {
    id: 'les_directions',
    pathId: 'path_travel',
    order: 2,
    title: { en: 'Asking Directions', fa: 'پرسیدن مسیر', ku: 'پرسیاری ئاراستە' },
    description: {
      en: 'Find your way around any Kurdish-speaking city.',
      fa: 'در هر شهر کردی‌زبان مسیر خود را پیدا کن.',
      ku: 'لە هەر شارێکی کوردی‌زباندا ڕێگات بدۆزەرەوە.',
    },
    content: {
      en: 'Asking "where is…?" (كوێتە؟) is your key to navigation. Pair it with a place name and locals will gladly help.',
      fa: 'پرسیدن «كوێتە؟» (کجاست؟) کلید مسیریابی شماست. آن را با نام یک مکان ترکیب کنید و مردم محلی با کمال میل کمک می‌کنند.',
      ku: 'پرسیاری «كوێتە؟» کلیلی ڕێنماییکردنتە. بی بە ناوی شوێنێکەوە بهێنە و خەڵکی ناوچەکە بە خۆشحاڵی یارمەتیت دەدەن.',
    },
    vocab: [
      { term: { en: 'Where?', fa: 'کجا؟', ku: 'كوێ؟' }, meaning: { en: 'Asking location', fa: 'پرسیدن مکان', ku: 'پرسیاری شوێن' } },
      { term: { en: 'Here', fa: 'اینجا', ku: 'لێرە' }, meaning: { en: 'This place', fa: 'این مکان', ku: 'ئەم شوێنە' } },
      { term: { en: 'There', fa: 'آنجا', ku: 'لەوێ' }, meaning: { en: 'That place', fa: 'آن مکان', ku: 'ئەو شوێنە' } },
    ],
    flashcards: [
      { id: 'fc_d1', front: { en: 'Where?', fa: 'کجا؟', ku: 'كوێ؟' }, back: { en: 'kê?', fa: 'كوێ', ku: 'كوێ' } },
      { id: 'fc_d2', front: { en: 'Here', fa: 'اینجا', ku: 'لێرە' }, back: { en: 'lêre', fa: 'لێرە', ku: 'لێرە' } },
      { id: 'fc_d3', front: { en: 'There', fa: 'آنجا', ku: 'لەوێ' }, back: { en: 'lewê', fa: 'لەوێ', ku: 'لەوێ' } },
    ],
    quiz: [
      {
        id: 'q_d1',
        question: { en: 'What does "kê?" mean?', fa: '«كوێ؟» یعنی چه؟', ku: '«كوێ؟» چی مانا دەهێنێت؟' },
        options: [
          { en: 'Here', fa: 'اینجا', ku: 'لێرە' },
          { en: 'There', fa: 'آنجا', ku: 'لەوێ' },
          { en: 'Where?', fa: 'کجا؟', ku: 'كوێ؟' },
          { en: 'When?', fa: 'کی؟', ku: 'كەی؟' },
        ],
        correctIndex: 2,
        explanation: { en: '"kê?" means where.', fa: '«كوێ» یعنی کجا.', ku: '«كوێ» واتای كوێە.' },
      },
    ],
    matching: [
      { id: 'm_d1', term: { en: 'Where?', fa: 'کجا؟', ku: 'كوێ؟' }, meaning: { en: 'kê?', fa: 'كوێ', ku: 'كوێ' } },
      { id: 'm_d2', term: { en: 'Here', fa: 'اینجا', ku: 'لێرە' }, meaning: { en: 'lêre', fa: 'لێرە', ku: 'لێرە' } },
      { id: 'm_d3', term: { en: 'There', fa: 'آنجا', ku: 'لەوێ' }, meaning: { en: 'lewê', fa: 'لەوێ', ku: 'لەوێ' } },
    ],
  },
  {
    id: 'les_formal_phrases',
    pathId: 'path_business',
    order: 1,
    title: { en: 'Formal Phrases', fa: 'عبارات رسمی', ku: 'دەستەواژە فەرمییەکان' },
    description: {
      en: 'Polite, professional expressions for formal settings.',
      fa: 'عبارات مؤدبانه و حرفه‌ای برای موقعیت‌های رسمی.',
      ku: 'دەستەواژە بەڕێز و پیشەییەکان بۆ بارودۆخی فەرمی.',
    },
    content: {
      en: 'In business contexts, use the plural/formal pronoun "hûn" (شما) instead of "tu" (تو) to show respect.',
      fa: 'در موقعیت‌های تجاری، از ضمیر جمع/محترمانه «hûn» (شما) به‌جای «tu» (تو) برای نشان دادن احترام استفاده کنید.',
      ku: 'لە بارودۆخی بازرگانیدا، لە جیاتی «tu» (تۆ) لە «hûn» (ئێوە) بەکاربهێنە بۆ نیشاندانی ڕێز.',
    },
    vocab: [
      { term: { en: 'You (formal)', fa: 'شما', ku: 'ئێوە' }, meaning: { en: 'Polite you', fa: 'ضمیر محترمانه', ku: 'تۆی بەڕێز' } },
      { term: { en: 'Excuse me', fa: 'ببخشید', ku: 'ببوورە' }, meaning: { en: 'Polite interruption', fa: 'قطع مؤدبانه', ku: 'بڕینی بەڕێز' } },
    ],
    flashcards: [
      { id: 'fc_p1', front: { en: 'You (formal)', fa: 'شما', ku: 'ئێوە' }, back: { en: 'hûn', fa: 'ئێوە', ku: 'ئێوە' } },
      { id: 'fc_p2', front: { en: 'Excuse me', fa: 'ببخشید', ku: 'ببوورە' }, back: { en: 'bibûre', fa: 'ببوورە', ku: 'ببوورە' } },
    ],
    quiz: [
      {
        id: 'q_p1',
        question: { en: 'What does "hûn" mean?', fa: '«ئێوە» یعنی چه؟', ku: '«ئێوە» چی مانا دەهێنێت؟' },
        options: [
          { en: 'I', fa: 'من', ku: 'من' },
          { en: 'You (formal)', fa: 'شما', ku: 'ئێوە' },
          { en: 'He', fa: 'او (مرد)', ku: 'ئەو' },
          { en: 'We', fa: 'ما', ku: 'ئێمە' },
        ],
        correctIndex: 1,
        explanation: { en: '"hûn" is the formal/plural "you".', fa: '«ئێوە» ضمیر محترمانه/جمع «شما» است.', ku: '«ئێوە» تۆی فەرمی/کۆکراوەیە.' },
      },
    ],
    matching: [
      { id: 'm_p1', term: { en: 'You (formal)', fa: 'شما', ku: 'ئێوە' }, meaning: { en: 'hûn', fa: 'ئێوە', ku: 'ئێوە' } },
      { id: 'm_p2', term: { en: 'Excuse me', fa: 'ببخشید', ku: 'ببوورە' }, meaning: { en: 'bibûre', fa: 'ببوورە', ku: 'ببوورە' } },
    ],
  },
  {
    id: 'les_meeting_vocab',
    pathId: 'path_business',
    order: 2,
    title: { en: 'Meeting Vocabulary', fa: 'واژگان جلسات', ku: 'وشەکانی کۆبوونەوە' },
    description: {
      en: 'Words for scheduling, agendas and discussion.',
      fa: 'واژگان زمان‌بندی، دستور جلسه و بحث.',
      ku: 'وشەکانی کاتدانان، ئەجێندا و گفتوگۆ.',
    },
    content: {
      en: 'A productive meeting in Kurdish starts with "bi xêr hatin" (welcome) and ends with "sipas bo demtangî" (thanks for your time).',
      fa: 'یک جلسه پربار در کردی با «bi xêr hatin» (خوش آمدید) شروع و با «sipas bo demtangî» (ممنون از وقتتان) تمام می‌شود.',
      ku: 'کۆبوونەوەیەکی بەرهەمدار لە کوردیدا بە «bi xêr hatin» (بەخێربێیت) دەست پێ دەکات و بە «sipas bo demtangî» (سوپاس بۆ کاتت) کۆتایی دێت.',
    },
    vocab: [
      { term: { en: 'Meeting', fa: 'جلسه', ku: 'کۆبوونەوە' }, meaning: { en: 'A discussion', fa: 'بحث', ku: 'گفتوگۆ' } },
      { term: { en: 'Schedule', fa: 'برنامه', ku: 'کاتدانان' }, meaning: { en: 'A plan of times', fa: 'برنامه زمانی', ku: 'پلانی کاتەکان' } },
    ],
    flashcards: [
      { id: 'fc_m1', front: { en: 'Meeting', fa: 'جلسه', ku: 'کۆبوونەوە' }, back: { en: 'kobûnewe', fa: 'کۆبوونەوە', ku: 'کۆبوونەوە' } },
      { id: 'fc_m2', front: { en: 'Schedule', fa: 'برنامه', ku: 'کاتدانان' }, back: { en: 'katdanan', fa: 'کاتدانان', ku: 'کاتدانان' } },
    ],
    quiz: [
      {
        id: 'q_m1',
        question: { en: 'What does "kobûnewe" mean?', fa: '«کۆبوونەوە» یعنی چه؟', ku: '«کۆبوونەوە» چی مانا دەهێنێت؟' },
        options: [
          { en: 'Schedule', fa: 'برنامه', ku: 'کاتدانان' },
          { en: 'Meeting', fa: 'جلسه', ku: 'کۆبوونەوە' },
          { en: 'Office', fa: 'دفتر', ku: 'ئۆفیس' },
          { en: 'Report', fa: 'گزارش', ku: 'ڕاپۆرت' },
        ],
        correctIndex: 1,
        explanation: { en: '"kobûnewe" means meeting.', fa: '«کۆبوونەوە» یعنی جلسه.', ku: '«کۆبوونەوە» واتای کۆبوونەوەیە.' },
      },
    ],
    matching: [
      { id: 'm_m1', term: { en: 'Meeting', fa: 'جلسه', ku: 'کۆبوونەوە' }, meaning: { en: 'kobûnewe', fa: 'کۆبوونەوە', ku: 'کۆبوونەوە' } },
      { id: 'm_m2', term: { en: 'Schedule', fa: 'برنامه', ku: 'کاتدانان' }, meaning: { en: 'katdanan', fa: 'کاتدانان', ku: 'کاتدانان' } },
    ],
  },
];

export const lessonById = new Map(lessons.map((l) => [l.id, l]));
