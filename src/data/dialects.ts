import type { DialectInfo } from '@/types';

export const dialects: DialectInfo[] = [
  {
    id: 'sorani',
    name: {
      en: 'Sorani',
      fa: 'سورانی',
      ku: 'سۆرانی',
    },
    script: 'Arabic-based (RTL)',
    region: {
      en: 'Iraq & Iran (Central Kurdistan)',
      fa: 'عراق و ایران (کردستان مرکزی)',
      ku: 'عێراق و ئێران (کوردستانی ناوەڕاست)',
    },
    speakers: '~8 million',
    description: {
      en: 'Sorani is the most widely written Kurdish dialect, using a modified Arabic script. It is official in the Kurdistan Region of Iraq.',
      fa: 'سورانی پرکاربردترین گویش نوشتاری کردی است که از خط عربیِ تغییر یافته استفاده می‌کند و در اقلیم کردستان عراق رسمی است.',
      ku: 'سۆرانی زۆرترین گۆشە نووسراوەی زمانی کوردییە و لە ناوچەی کوردستانی عێراق فەرمییە.',
    },
    exampleWord: { word: 'سڵاو', meaning: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' } },
    color: 'amber',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'border-amber-500/30',
  },
  {
    id: 'kalhori',
    name: {
      en: 'Kalhori',
      fa: 'کلهوری',
      ku: 'کەلهوڕی',
    },
    script: 'Arabic-based (RTL)',
    region: {
      en: 'Iran (Kermanshah, Ilam, Lorestan)',
      fa: 'ایران (کرمانشاه، ایلام، لرستان)',
      ku: 'ئێران (کرمانشاه، ئیلام، لۆڕستان)',
    },
    speakers: '~3 million',
    description: {
      en: 'Kalhori is a Southern Kurdish dialect spoken in western Iran. It has unique phonological features and vocabulary distinct from Sorani.',
      fa: 'کلهوری یک گویش کردی جنوبی است که در غرب ایران صحبت می‌شود و ویژگی‌های آوایی و واژگان منحصر به فردی دارد.',
      ku: 'کەلهوڕی یەکێک لە زاراوەکانی کوردیی باشوورە کە لە ڕۆژهەڵاتی کوردستان قسەی پێ دەکرێت و تایبەتمەندییەکی دەنگی و وشەی جیاوازی هەیە.',
    },
    exampleWord: { word: 'سڵاو', meaning: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' } },
    color: 'green',
    glow: 'rgba(74, 222, 128, 0.4)',
    border: 'border-green-500/30',
  },
  {
    id: 'kurmanji',
    name: {
      en: 'Kurmanji',
      fa: 'کرمانجی',
      ku: 'کرمانجی',
    },
    script: 'Latin (LTR)',
    region: {
      en: 'Turkey, Syria & Armenia (Northern Kurdistan)',
      fa: 'ترکیه، سوریه و ارمنستان (کردستان شمالی)',
      ku: 'تورکیا، سوریا و ئەرمەنستان (کوردستانی باکوور)',
    },
    speakers: '~20 million',
    description: {
      en: 'Kurmanji is the most spoken Kurdish dialect, written in a Latin alphabet. It dominates among Kurds in Turkey and Syria.',
      fa: 'کرمانجی پرگویش‌ترین گویش کردی است که با خط لاتین نوشته می‌شود و میان کردهای ترکیه و سوریه غالب است.',
      ku: 'کرمانجی زۆرترین قسەکراوی زمانی کوردییە و بە ئەلفوبێی لاتین دەنووسرێت.',
    },
    exampleWord: { word: 'Silav', meaning: { en: 'Hello', fa: 'سلام', ku: 'سڵاو' } },
    color: 'cyan',
    glow: 'rgba(34, 211, 238, 0.4)',
    border: 'border-cyan-500/30',
  },
];

export const dialectById = new Map(dialects.map((d) => [d.id, d]));