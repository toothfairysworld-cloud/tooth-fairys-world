/**
 * Image credits registry — rendered on /credits and mirrored in CREDITS.md.
 * Every photo is from a free-license source; Phase 2's media library
 * captures this metadata automatically at upload time.
 */
export interface CreditEntry {
  /** Public file path served on the site. */
  file: string;
  usage: { ar: string; en: string };
  source: string;
  sourceUrl: string;
  license: string;
  licenseUrl?: string;
  author?: string;
}

export const photoCredits: CreditEntry[] = [
  {
    file: "/images/hub-experience.webp",
    usage: { ar: "دليل الأقسام — الخبرة والمسار السريري", en: "Section Hub — Clinical experience & operatory" },
    source: "Atelier Studio",
    sourceUrl: "https://toothfairysworld.com",
    license: "Editorial Custom Asset",
  },
  {
    file: "/images/hub-certificates.webp",
    usage: { ar: "دليل الأقسام — الشهادات والاعتمادات الجراحية", en: "Section Hub — Certificates & surgical loupes" },
    source: "Atelier Studio",
    sourceUrl: "https://toothfairysworld.com",
    license: "Editorial Custom Asset",
  },
  {
    file: "/images/hero-portrait.webp",
    usage: { ar: "صورة البطل (الصفحة الرئيسية)", en: "Hero portrait (homepage)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/about-1.webp",
    usage: { ar: "قسم نبذة — مطابقة درجة لون الأسنان", en: "About section — dental shade matching" },
    source: "Pexels",
    sourceUrl:
      "https://www.pexels.com/photo/3845624/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
  },
  {
    file: "/images/about-2.webp",
    usage: { ar: "قسم نبذة — عيادة أسنان حديثة", en: "About section — modern dental office" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/about-3.webp",
    usage: { ar: "قسم نبذة — أدوات الأسنان", en: "About section — dental instruments" },
    source: "WordPress Photo Directory (pd.w.org)",
    sourceUrl:
      "https://pd.w.org/2026/04/67469efbf72491a05.40591059-2048x1536.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    file: "/images/case-1-after.webp",
    usage: { ar: "دراسة حالة — ترميم أمامي (بعد)", en: "Case study — anterior restoration (after)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/case-2-after.webp",
    usage: { ar: "دراسة حالة — حشوة خلفية (بعد)", en: "Case study — posterior restoration (after)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/case-3-after.webp",
    usage: { ar: "دراسة حالة — علاج جذور (إجراء)", en: "Case study — root canal (procedure)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/case-4-after.webp",
    usage: { ar: "دراسة حالة — علاج اللثة (بعد)", en: "Case study — gum therapy (after)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/case-5-after.webp",
    usage: { ar: "دراسة حالة — تاج زيركون", en: "Case study — zirconia crown" },
    source: "Rawpixel (via Openverse)",
    sourceUrl:
      "https://www.rawpixel.com/image/6020787/dental-clinic-free-public-domain-cc0-photo",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    file: "/images/case-6-after.webp",
    usage: { ar: "دراسة حالة — تأهيل ابتسامة (بعد)", en: "Case study — smile rehabilitation (after)" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/vol-1.webp",
    usage: { ar: "التطوع — أسبوع الابتسامة", en: "Volunteering — Smile Week" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/vol-2.webp",
    usage: { ar: "التطوع — الفحوصات الوقائية", en: "Volunteering — preventive checkups" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/vol-3.webp",
    usage: { ar: "التطوع — إرشاد الطلاب", en: "Volunteering — student mentoring" },
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  },
  {
    file: "/images/blog-1.webp",
    usage: { ar: "غلاف مقال — التنظيف الصحيح", en: "Article cover — proper brushing" },
    source: "Rawpixel (via Openverse)",
    sourceUrl:
      "https://www.rawpixel.com/image/5921240/photo-image-public-domain-blue-free",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    file: "/images/blog-2.webp",
    usage: { ar: "غلاف مقال — نزيف اللثة", en: "Article cover — bleeding gums" },
    source: "Pexels",
    sourceUrl:
      "https://www.pexels.com/photo/3845810/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
  },
  {
    file: "/images/blog-3.webp",
    usage: { ar: "غلاف مقال — الحساسية", en: "Article cover — sensitivity" },
    source: "Rawpixel (via Openverse)",
    sourceUrl:
      "https://www.rawpixel.com/image/8812231/glass-water",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    file: "/images/blog-4.webp",
    usage: { ar: "غلاف مقال — خيط الأسنان", en: "Article cover — flossing" },
    source: "Rawpixel (via Openverse)",
    sourceUrl:
      "https://www.rawpixel.com/image/6113693/photo-image-public-domain-free-healthcare",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
];

/** Case "before" images are locally derived from the after photos. */
export const derivedNote = {
  ar: "صور «قبل» في دراسات الحالة مشتقة محلياً من الصورة الأصلية (فلاتر ألوان) لأغراض العرض فقط.",
  en: 'Case-study "before" images are locally derived from the original photo (color filters) for demo purposes only.',
};

export const iconCredits = {
  ar: "أيقونات Lucide — رخصة ISC.",
  en: "Lucide icons — ISC license.",
};
