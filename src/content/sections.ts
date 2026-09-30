import type { Localized } from "./types";

/**
 * Section registry — order and visibility.
 * In Phase 1 this is a static file; in Phase 3 the dashboard manages it
 * (drag-to-reorder + on/off toggles) backed by a Supabase table.
 */
export type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "cases"
  | "certificates"
  | "research"
  | "volunteering"
  | "blog"
  | "ask"
  | "resources"
  | "testimonials"
  | "contact";

export interface SectionConfig {
  id: SectionId;
  enabled: boolean;
}

export const sectionOrder: SectionConfig[] = [
  { id: "hero", enabled: true },
  { id: "about", enabled: true },
  { id: "experience", enabled: true },
  { id: "cases", enabled: true },
  { id: "certificates", enabled: true },
  { id: "research", enabled: true },
  { id: "volunteering", enabled: true },
  { id: "blog", enabled: true },
  { id: "ask", enabled: true },
  { id: "resources", enabled: true },
  { id: "testimonials", enabled: true },
  { id: "contact", enabled: true },
];

/** Section headings — dashboard-editable content (not UI chrome). */
export const sectionHeadings: Record<
  Exclude<SectionId, "hero">,
  { title: Localized<string>; subtitle: Localized<string> }
> = {
  about: {
    title: { ar: "قصة قبل أن تكون سيرة", en: "A story before it's a bio" },
    subtitle: {
      ar: "من طفلة تخاف كرسي الأسنان إلى طالبة في سنتها الخامسة تروي الحكاية.",
      en: "From a kid scared of the chair to a fifth-year student telling the tale.",
    },
  },
  experience: {
    title: { ar: "الخبرة السريرية", en: "Clinical experience" },
    subtitle: {
      ar: "ست سنوات بالتقويم، ومئات المواعيد بالذاكرة — إليك المسار.",
      en: "Six years on the calendar, hundreds of appointments in memory — here's the path.",
    },
  },
  cases: {
    title: { ar: "دراسات حالة مختارة", en: "Selected case studies" },
    subtitle: {
      ar: "حالات موثقة من عيادات الكلية — بالقصة كاملة، لا بالصورة فقط.",
      en: "Documented cases from the faculty clinics — the full story, not just the photo.",
    },
  },
  certificates: {
    title: { ar: "الشهادات والدورات", en: "Certificates & courses" },
    subtitle: {
      ar: "تدريب مستمر فوق مقاعد الدراسة: إنقاذ حياة، مكافحة عدوى، وتجميل ابتسامات.",
      en: "Training beyond the syllabus: saving lives, controlling infections, and designing smiles.",
    },
  },
  research: {
    title: { ar: "البحوث والمشاريع", en: "Research & projects" },
    subtitle: {
      ar: "أسئلة بدأت في العيادة وانتهت أوراقاً علمية.",
      en: "Questions that started in the clinic and ended up as papers.",
    },
  },
  volunteering: {
    title: { ar: "التطوع والمجتمع", en: "Volunteering & community" },
    subtitle: {
      ar: "طب الأسنان الذي يصل الناس قبل أن يصل العيادات.",
      en: "Dentistry that reaches people before it reaches clinics.",
    },
  },
  blog: {
    title: { ar: "مقالات بصحة الفم", en: "Oral health articles" },
    subtitle: {
      ar: "بلغة يفهمها المرضى — لا بلغة المجلات العلمية.",
      en: "In language patients understand — not journal jargon.",
    },
  },
  ask: {
    title: { ar: "اسأل الطالبة", en: "Ask the student" },
    subtitle: {
      ar: "أسئلة حقيقية وردت في العيادة والحملات، وأجوبتها بلغة واضحة.",
      en: "Real questions from the clinic and campaigns, answered in plain language.",
    },
  },
  resources: {
    title: { ar: "مصادر لطلاب السنوات الأولى", en: "Resources for junior students" },
    subtitle: {
      ar: "ملخصات وقوائم أنجزتها ووجدتها نافعة — خذها ومرّرها.",
      en: "Summaries and checklists I made and found useful — take them and pass them on.",
    },
  },
  testimonials: {
    title: { ar: "قالوا عني", en: "In their words" },
    subtitle: {
      ar: "من مشرفي وزملاء وطلاب قابلوني في العيادة والقاعة.",
      en: "From supervisors, colleagues, and students I met in clinic and class.",
    },
  },
  contact: {
    title: { ar: "تواصل معي", en: "Contact me" },
    subtitle: {
      ar: "فرصة تدريب، سؤال علمي، أو دعوة حملة توعية — ريساني مرتب.",
      en: "A training opportunity, a science question, or an awareness invite — my inbox is open.",
    },
  },
};

/** Pick a section's heading in the requested locale. */
export function sectionHeading(
  id: Exclude<SectionId, "hero">,
  locale: "ar" | "en",
): { title: string; subtitle: string } {
  const entry = sectionHeadings[id];
  return { title: entry.title[locale], subtitle: entry.subtitle[locale] };
}
