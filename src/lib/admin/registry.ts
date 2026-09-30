import type { Bi } from "./dict";

/**
 * Entity registry — declarative field definitions that drive BOTH the
 * list views and the edit forms. Pure data (no Prisma imports) so it is
 * safe to pass from server pages to client components.
 *
 * Column conventions:
 * - `XxxAr` / `XxxEn`   → bilingual simple fields
 * - kind "stringList"   → per-locale JSON `string[]` in `${key}Ar` + `${key}En`
 * - kind "pairs"        → same columns, edited as aligned AR/EN rows
 * - kind "stats"        → single JSON column `key` with StatRow[]
 * - kind "blocks"       → per-locale JSON `ArticleBlock[]` in `${key}Ar` + `${key}En`
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "url"
  | "date"
  | "datetime"
  | "month"
  | "pairs" // aligned AR/EN string lists (skills, interests, bio)
  | "stats" // [{labelAr,labelEn,value,suffixAr,suffixEn}]
  | "blocks" // ArticleBlock[] per locale (blog body)
  | "story"; // bilingual case-story JSON (complaint/diagnosis/plan/materials/learned)

export type FieldGroup = "ar" | "en" | "shared";

export interface FieldDef {
  key: string;
  kind: FieldKind;
  label: Bi;
  group?: FieldGroup; // defaults to "shared"
  options?: { value: string; label: Bi }[];
  help?: Bi;
  rows?: number; // textarea height hint
  required?: boolean;
  half?: boolean; // render at half width in shared group
}

export interface EntityDef {
  key: string;
  label: Bi;
  icon: string; // lucide icon name (mapped in AdminShell)
  /** prisma delegate key used by the server actions */
  model:
    | "timelineEntry"
    | "caseStudy"
    | "certificate"
    | "researchItem"
    | "volunteeringItem"
    | "blogPost"
    | "faqItem"
    | "resourceItem"
    | "testimonial"
    | "sectionConfig";
  /** column whose `${col}Ar` / `${col}En` shows as the row title */
  titleField?: string;
  /** single-column title (shared string field) */
  titleSharedField?: string;
  slugField?: string;
  fixed?: boolean; // no create/delete (sections)
  sortOrderField?: "sortOrder";
  fields: FieldDef[];
  consentGate?: boolean; // cases: publish requires patientConsent
}

const pub: FieldDef = {
  key: "published",
  kind: "checkbox",
  group: "shared",
  label: { ar: "منشور على الموقع", en: "Published on the site" },
  help: {
    ar: "أوقفيه ليصبح مسودة غير مرئية للزوار",
    en: "Turn off to keep it as an invisible draft",
  },
};

export const ENTITIES: EntityDef[] = [
  // ---------------------------------------------------------------- timeline
  {
    key: "timeline",
    label: { ar: "الخبرة السريرية", en: "Clinical timeline" },
    icon: "Route",
    model: "timelineEntry",
    titleField: "title",
    sortOrderField: "sortOrder",
    fields: [
      { key: "year", kind: "text", group: "shared", label: { ar: "السنة", en: "Year" }, required: true, half: true },
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "descriptionAr", kind: "textarea", group: "ar", label: { ar: "الوصف", en: "Description" }, rows: 4, required: true },
      { key: "descriptionEn", kind: "textarea", group: "en", label: { ar: "الوصف", en: "Description" }, rows: 4, required: true },
      { key: "skills", kind: "pairs", group: "shared", label: { ar: "المهارات", en: "Skills" } },
      { key: "stats", kind: "stats", group: "shared", label: { ar: "أرقام (تُعدّ تصاعدياً)", en: "Stats (count-up)" } },
      pub,
    ],
  },

  // ------------------------------------------------------------------ cases
  {
    key: "cases",
    label: { ar: "دراسات الحالة", en: "Case studies" },
    icon: "Smile",
    model: "caseStudy",
    titleField: "title",
    slugField: "slug",
    sortOrderField: "sortOrder",
    consentGate: true,
    fields: [
      { key: "slug", kind: "text", group: "shared", label: { ar: "المعرّف (بالإنجليزية)", en: "Slug" }, help: { ar: "يظهر في الرابط: /cases/slug", en: "Appears in the URL: /cases/slug" }, required: true, half: true },
      {
        key: "category", kind: "select", group: "shared", label: { ar: "التصنيف", en: "Category" }, half: true,
        options: [
          { value: "fillings", label: { ar: "الحشوات", en: "Fillings" } },
          { value: "endo", label: { ar: "علاج الجذور", en: "Root canal" } },
          { value: "gum", label: { ar: "اللثة", en: "Gum" } },
          { value: "prosth", label: { ar: "التعويضات", en: "Prosthetics" } },
        ],
      },
      { key: "period", kind: "month", group: "shared", label: { ar: "الشهر", en: "Period" }, half: true },
      { key: "featured", kind: "checkbox", group: "shared", label: { ar: "حالة مميزة (تظهر أولى مع مقارنة قبل/بعد)", en: "Featured (first, with before/after slider)" }, half: true },
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "summaryAr", kind: "textarea", group: "ar", label: { ar: "الملخص", en: "Summary" }, rows: 3, required: true },
      { key: "summaryEn", kind: "textarea", group: "en", label: { ar: "الملخص", en: "Summary" }, rows: 3, required: true },
      { key: "imageBefore", kind: "image", group: "shared", label: { ar: "صورة «قبل»", en: "“Before” photo" } },
      { key: "imageAfter", kind: "image", group: "shared", label: { ar: "صورة «بعد»", en: "“After” photo" } },
      { key: "imageAltAr", kind: "text", group: "ar", label: { ar: "نص بديل للصورة", en: "Image alt text" } },
      { key: "imageAltEn", kind: "text", group: "en", label: { ar: "نص بديل للصورة", en: "Image alt text" } },
      { key: "story", kind: "story", group: "shared", label: { ar: "قصة الحالة", en: "Case story" } },
      {
        key: "patientConsent", kind: "checkbox", group: "shared",
        label: { ar: "موافقة كتابية من المريض على النشر", en: "Patient's written consent to publish" },
        help: { ar: "إلزامية قبل النشر", en: "Required before publishing" },
      },
      pub,
    ],
  },

  // ------------------------------------------------------------ certificates
  {
    key: "certificates",
    label: { ar: "الشهادات", en: "Certificates" },
    icon: "Award",
    model: "certificate",
    titleField: "title",
    sortOrderField: "sortOrder",
    fields: [
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "اسم الشهادة", en: "Certificate title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "اسم الشهادة", en: "Certificate title" }, required: true },
      { key: "issuerAr", kind: "text", group: "ar", label: { ar: "الجهة المانحة", en: "Issuer" }, required: true },
      { key: "issuerEn", kind: "text", group: "en", label: { ar: "الجهة المانحة", en: "Issuer" }, required: true },
      { key: "date", kind: "date", group: "shared", label: { ar: "التاريخ", en: "Date" }, half: true },
      { key: "pdf", kind: "url", group: "shared", label: { ar: "رابط ملف الشهادة (اختياري)", en: "Certificate PDF link (optional)" } },
      pub,
    ],
  },

  // ---------------------------------------------------------------- research
  {
    key: "research",
    label: { ar: "البحوث", en: "Research" },
    icon: "FlaskConical",
    model: "researchItem",
    titleField: "title",
    sortOrderField: "sortOrder",
    fields: [
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "abstractAr", kind: "textarea", group: "ar", label: { ar: "الملخص", en: "Abstract" }, rows: 4, required: true },
      { key: "abstractEn", kind: "textarea", group: "en", label: { ar: "الملخص", en: "Abstract" }, rows: 4, required: true },
      { key: "year", kind: "text", group: "shared", label: { ar: "السنة", en: "Year" }, half: true },
      { key: "link", kind: "url", group: "shared", label: { ar: "رابط (اختياري)", en: "Link (optional)" } },
      pub,
    ],
  },

  // ------------------------------------------------------------ volunteering
  {
    key: "volunteering",
    label: { ar: "التطوع", en: "Volunteering" },
    icon: "HeartHandshake",
    model: "volunteeringItem",
    titleField: "title",
    sortOrderField: "sortOrder",
    fields: [
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "النشاط", en: "Activity" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "النشاط", en: "Activity" }, required: true },
      { key: "descriptionAr", kind: "textarea", group: "ar", label: { ar: "الوصف", en: "Description" }, rows: 4, required: true },
      { key: "descriptionEn", kind: "textarea", group: "en", label: { ar: "الوصف", en: "Description" }, rows: 4, required: true },
      { key: "imageSrc", kind: "image", group: "shared", label: { ar: "الصورة", en: "Photo" } },
      { key: "imageAltAr", kind: "text", group: "ar", label: { ar: "نص بديل للصورة", en: "Image alt text" } },
      { key: "imageAltEn", kind: "text", group: "en", label: { ar: "نص بديل للصورة", en: "Image alt text" } },
      { key: "impact", kind: "stats", group: "shared", label: { ar: "أثر التطوع (أرقام)", en: "Impact stats" } },
      pub,
    ],
  },

  // -------------------------------------------------------------------- blog
  {
    key: "blog",
    label: { ar: "المقالات", en: "Articles" },
    icon: "Newspaper",
    model: "blogPost",
    titleField: "title",
    slugField: "slug",
    sortOrderField: "sortOrder",
    fields: [
      { key: "slug", kind: "text", group: "shared", label: { ar: "المعرّف (بالإنجليزية)", en: "Slug" }, help: { ar: "يظهر في الرابط: /blog/slug", en: "Appears in the URL: /blog/slug" }, required: true, half: true },
      { key: "date", kind: "date", group: "shared", label: { ar: "تاريخ النشر", en: "Publish date" }, half: true },
      { key: "readingMinutes", kind: "number", group: "shared", label: { ar: "دقائق القراءة", en: "Reading minutes" }, half: true },
      {
        key: "categoryAr", kind: "text", group: "ar", label: { ar: "التصنيف", en: "Category" }, half: true,
      },
      { key: "categoryEn", kind: "text", group: "en", label: { ar: "التصنيف", en: "Category" }, half: true },
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "excerptAr", kind: "textarea", group: "ar", label: { ar: "المقتطف", en: "Excerpt" }, rows: 2, required: true },
      { key: "excerptEn", kind: "textarea", group: "en", label: { ar: "المقتطف", en: "Excerpt" }, rows: 2, required: true },
      { key: "coverSrc", kind: "image", group: "shared", label: { ar: "صورة الغلاف", en: "Cover photo" } },
      { key: "coverAltAr", kind: "text", group: "ar", label: { ar: "نص بديل للغلاف", en: "Cover alt text" } },
      { key: "coverAltEn", kind: "text", group: "en", label: { ar: "نص بديل للغلاف", en: "Cover alt text" } },
      { key: "body", kind: "blocks", group: "shared", label: { ar: "نص المقال", en: "Article body" } },
      pub,
    ],
  },

  // --------------------------------------------------------------------- faq
  {
    key: "faq",
    label: { ar: "الأسئلة الشائعة", en: "FAQ" },
    icon: "CircleHelp",
    model: "faqItem",
    titleField: "q",
    sortOrderField: "sortOrder",
    fields: [
      { key: "qAr", kind: "text", group: "ar", label: { ar: "السؤال", en: "Question" }, required: true },
      { key: "qEn", kind: "text", group: "en", label: { ar: "السؤال", en: "Question" }, required: true },
      { key: "aAr", kind: "textarea", group: "ar", label: { ar: "الجواب", en: "Answer" }, rows: 4, required: true },
      { key: "aEn", kind: "textarea", group: "en", label: { ar: "الجواب", en: "Answer" }, rows: 4, required: true },
      pub,
    ],
  },

  // ---------------------------------------------------------------- resources
  {
    key: "resources",
    label: { ar: "المصادر", en: "Resources" },
    icon: "BookOpen",
    model: "resourceItem",
    titleField: "title",
    sortOrderField: "sortOrder",
    fields: [
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "العنوان", en: "Title" }, required: true },
      { key: "descriptionAr", kind: "textarea", group: "ar", label: { ar: "الوصف", en: "Description" }, rows: 3, required: true },
      { key: "descriptionEn", kind: "textarea", group: "en", label: { ar: "الوصف", en: "Description" }, rows: 3, required: true },
      { key: "file", kind: "url", group: "shared", label: { ar: "رابط الملف (PDF)", en: "File link (PDF)" }, required: true },
      {
        key: "kind", kind: "select", group: "shared", label: { ar: "النوع", en: "Kind" }, half: true,
        options: [
          { value: "notes", label: { ar: "ملخصات", en: "Notes" } },
          { value: "checklist", label: { ar: "قائمة تحقق", en: "Checklist" } },
          { value: "plan", label: { ar: "خطة دراسية", en: "Study plan" } },
          { value: "glossary", label: { ar: "مسرد مصطلحات", en: "Glossary" } },
        ],
      },
      { key: "downloads", kind: "number", group: "shared", label: { ar: "مرات التحميل", en: "Downloads" }, half: true },
      pub,
    ],
  },

  // ------------------------------------------------------------ testimonials
  {
    key: "testimonials",
    label: { ar: "التزكيات", en: "Testimonials" },
    icon: "Quote",
    model: "testimonial",
    titleField: "quote",
    sortOrderField: "sortOrder",
    fields: [
      { key: "quoteAr", kind: "textarea", group: "ar", label: { ar: "التزكية", en: "Quote" }, rows: 3, required: true },
      { key: "quoteEn", kind: "textarea", group: "en", label: { ar: "التزكية", en: "Quote" }, rows: 3, required: true },
      { key: "name", kind: "text", group: "shared", label: { ar: "الاسم", en: "Name" }, required: true, half: true },
      { key: "initials", kind: "text", group: "shared", label: { ar: "الأحرف الأولى", en: "Initials" }, half: true },
      { key: "roleAr", kind: "text", group: "ar", label: { ar: "الصفة", en: "Role" } },
      { key: "roleEn", kind: "text", group: "en", label: { ar: "الصفة", en: "Role" } },
      pub,
    ],
  },

  // ---------------------------------------------------------------- sections
  {
    key: "sections",
    label: { ar: "أقسام الصفحة الرئيسية", en: "Homepage sections" },
    icon: "LayoutList",
    model: "sectionConfig",
    titleField: "title",
    fixed: true,
    sortOrderField: "sortOrder",
    fields: [
      { key: "titleAr", kind: "text", group: "ar", label: { ar: "عنوان القسم", en: "Section title" }, required: true },
      { key: "titleEn", kind: "text", group: "en", label: { ar: "عنوان القسم", en: "Section title" }, required: true },
      { key: "subtitleAr", kind: "textarea", group: "ar", label: { ar: "السطر التوضيحي", en: "Subtitle" }, rows: 2 },
      { key: "subtitleEn", kind: "textarea", group: "en", label: { ar: "السطر التوضيحي", en: "Subtitle" }, rows: 2 },
      { key: "image", kind: "image", group: "shared", label: { ar: "صورة بطاقة القسم في الواجهة", en: "Section card image" }, help: { ar: "الصورة المعروضة في بطاقة هذا القسم في الصفحة الرئيسية (اتركها فارغة لاستخدام الصورة الافتراضية)", en: "Card image on homepage hub (leave empty to use default)" } },
      { key: "enabled", kind: "checkbox", group: "shared", label: { ar: "القسم مرئي", en: "Section visible" } },
    ],
  },
];

export function getEntity(key: string): EntityDef | undefined {
  return ENTITIES.find((e) => e.key === key);
}

/** Section labels for the fixed rows (hero has no editable heading). */
export const SECTION_ROW_LABELS: Record<string, Bi> = {
  hero: { ar: "الواجهة (Hero)", en: "Hero" },
  about: { ar: "نبذة", en: "About" },
  experience: { ar: "الخبرة", en: "Experience" },
  cases: { ar: "دراسات الحالة", en: "Cases" },
  certificates: { ar: "الشهادات", en: "Certificates" },
  research: { ar: "البحوث", en: "Research" },
  volunteering: { ar: "التطوع", en: "Volunteering" },
  blog: { ar: "المدونة", en: "Blog" },
  ask: { ar: "الأسئلة", en: "FAQ" },
  resources: { ar: "المصادر", en: "Resources" },
  testimonials: { ar: "التزكيات", en: "Testimonials" },
  contact: { ar: "التواصل", en: "Contact" },
};

/** Profile field definitions — singleton editor. */
export const PROFILE_FIELDS: FieldDef[] = [
  { key: "nameAr", kind: "text", group: "ar", label: { ar: "الاسم", en: "Name" }, required: true, half: true },
  { key: "nameEn", kind: "text", group: "en", label: { ar: "الاسم", en: "Name" }, required: true, half: true },
  { key: "initials", kind: "text", group: "shared", label: { ar: "الأحرف الأولى (للشعار)", en: "Initials (logo)" }, half: true },
  { key: "roleAr", kind: "text", group: "ar", label: { ar: "الصفة", en: "Role" }, required: true, half: true },
  { key: "roleEn", kind: "text", group: "en", label: { ar: "الصفة", en: "Role" }, required: true, half: true },
  { key: "universityAr", kind: "text", group: "ar", label: { ar: "الجامعة", en: "University" }, required: true, half: true },
  { key: "universityEn", kind: "text", group: "en", label: { ar: "الجامعة", en: "University" }, required: true, half: true },
  { key: "valueStatementAr", kind: "textarea", group: "ar", label: { ar: "جملة التعريف (تظهر في الواجهة)", en: "Value statement (hero)" }, rows: 3, required: true },
  { key: "valueStatementEn", kind: "textarea", group: "en", label: { ar: "جملة التعريف (تظهر في الواجهة)", en: "Value statement (hero)" }, rows: 3, required: true },
  { key: "portraitSrc", kind: "image", group: "shared", label: { ar: "صورة الواجهة الرئيسية", en: "Hero portrait" } },
  { key: "portraitAltAr", kind: "text", group: "ar", label: { ar: "نص بديل للصورة", en: "Portrait alt text" } },
  { key: "portraitAltEn", kind: "text", group: "en", label: { ar: "نص بديل للصورة", en: "Portrait alt text" } },
  { key: "aboutImage1", kind: "image", group: "shared", label: { ar: "صورة 1 في قسم «نبذة»", en: "About photo 1" } },
  { key: "aboutImage2", kind: "image", group: "shared", label: { ar: "صورة 2 في قسم «نبذة»", en: "About photo 2" } },
  { key: "aboutImage3", kind: "image", group: "shared", label: { ar: "صورة 3 في قسم «نبذة»", en: "About photo 3" } },
  { key: "bio", kind: "pairs", group: "shared", label: { ar: "قصة «نبذة» (فقرات)", en: "About story (paragraphs)" } },
  { key: "philosophyAr", kind: "textarea", group: "ar", label: { ar: "الاقتباس المميز", en: "Signature quote" }, rows: 2, required: true },
  { key: "philosophyEn", kind: "textarea", group: "en", label: { ar: "الاقتباس المميز", en: "Signature quote" }, rows: 2, required: true },
  { key: "interests", kind: "pairs", group: "shared", label: { ar: "اهتمامات (شارات)", en: "Interests (chips)" } },
  { key: "instagram", kind: "url", group: "shared", label: { ar: "رابط إنستغرام", en: "Instagram link" }, half: true },
  { key: "cvPdf", kind: "url", group: "shared", label: { ar: "رابط السيرة الذاتية (PDF)", en: "CV PDF link" }, half: true },
  { key: "graduationDate", kind: "datetime", group: "shared", label: { ar: "تاريخ التخرج (العدّاد)", en: "Graduation date (countdown)" }, half: true },
  { key: "isSample", kind: "checkbox", group: "shared", label: { ar: "وضع المحتوى التجريبي (يعرض تنبيه «عينة»)", en: "Sample-content mode (shows SAMPLE badges)" } },
];
