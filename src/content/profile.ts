import type { Localized } from "./types";

/**
 * SAMPLE persona — clearly marked. Swap via the dashboard in Phase 3.
 * <!-- Tooth Fairy's World -->
 * Arabic copy is gender-inflected for a female dentist (طالبة/طبيبة/تلك...).
 */
export const profile = {
  isSample: true as const,
  name: { ar: "عالم جنية الأسنان", en: "Tooth Fairy's World" } satisfies Localized<string>,
  initials: "TF",
  role: {
    ar: "طالبة طب أسنان — السنة الخامسة",
    en: "Fifth-year dental student",
  } satisfies Localized<string>,
  university: {
    ar: "[الجامعة] — كلية طب الأسنان",
    en: "[UNIVERSITY] — Faculty of Dentistry",
  } satisfies Localized<string>,
  valueStatement: {
    ar: "أؤمن أن العلاج الناجح يبدأ بالإنصات قبل الأدوات — أبني خبرتي السريرية حالةً بعد حالة، وأشارك ما أتعلمه على الطريق.",
    en: "I believe good treatment starts with listening, not tools — building my clinical experience one case at a time, and sharing what I learn along the way.",
  } satisfies Localized<string>,
  portrait: {
    src: "/images/hero-portrait.webp",
    alt: {
      ar: "صورة شخصية لطالبة طب أسنان ترتدي معطفاً أبيض وتحمل ابتسامة هادئة",
      en: "Portrait of a dental student in a white coat with a calm smile",
    } satisfies Localized<string>,
  },
  bio: [
    {
      ar: "أول لقاء لي مع طب الأسنان لم يكن سعيداً؛ كنت طفلةً خائفة من كرسي الأسنان، ولم يُبدّد خوفي ذلك اليوم سوى طبيبٍ عرف كيف يشرح ويطمئن قبل أن يلمس أي أداة. يومها قررت أن أكون تلك الطبيبة — الشخص الذي يجعل زيارة الأسنان أهون مما يتوقعها المريض.",
      en: "My first encounter with dentistry wasn't a happy one; I was a scared kid in a dental chair, and what calmed me down was a dentist who knew how to explain and reassure before touching a single instrument. That day I decided to become that dentist — the person who makes a visit easier than the patient expected.",
    },
    {
      ar: "اليوم أنا في السنة الخامسة، أتنقل بين العيادات التدريبية وحوض الأسنان، وأجدني أكثر ما أُسحر بترميم الأسنان الأمامية حيث تلتقي الدقة اليدوية بعلوم المواد، وبعلاج الجذور الذي يشبه حلّ لغز دقيق. خارج العيادة أتطوع في حملات التوعية وأكتب مقالات مبسطة لمرضاي المستقبليين.",
      en: "Today I'm in my fifth year, moving between teaching clinics and the dental unit. I'm most fascinated by anterior restorations — where hand precision meets material science — and by endodontics, which feels like solving a careful puzzle. Outside the clinic I volunteer in awareness campaigns and write plain-language articles for my future patients.",
    },
    {
      ar: "أؤمن أن طبيبة الأسنان الجيدة تجمع علمًا محدثاً ويداً مدربة وقلباً يُحسن الإنصات؛ لذلك أخطط لمواصلة التدريب بعد التخرج في الترميمات التجميلية، وأطمح لأن تكون عيادتي المستقبلية مكاناً لا يخاف أحد من دخوله.",
      en: "I believe a good dentist combines up-to-date science, a trained hand, and a heart that listens well; that's why I plan to continue training in esthetic restorations after graduation, and I aspire to build a future practice that nobody is afraid to walk into.",
    },
  ] satisfies Localized<string>[],
  philosophy: {
    ar: "أفضل علاج هو الذي يبدأ بالإنصات.",
    en: "The best treatment begins with listening.",
  } satisfies Localized<string>,
  interests: [
    { ar: "الحشوات التجميلية", en: "Cosmetic fillings" },
    { ar: "علاج الجذور", en: "Endodontics" },
    { ar: "صحة اللثة", en: "Periodontics" },
    { ar: "طب الأسنان الرقمي", en: "Digital dentistry" },
    { ar: "تثقيف المرضى", en: "Patient education" },
  ] satisfies Localized<string>[],
  socials: {
    instagram: "https://instagram.com/toothfairysworld",
  },
  cvPdf: "/pdfs/sample-cv.pdf",
  /** Sample graduation date — editable later from the dashboard. */
  graduationDate: "2027-06-30T18:30:00+03:00",
} as const;
