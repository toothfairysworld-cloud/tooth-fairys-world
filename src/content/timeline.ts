import type { TimelineEntry } from "./types";

/** Clinical experience timeline — cumulative procedure counts in the final entry. */
export const timeline: TimelineEntry[] = [
  {
    year: "2022",
    title: { ar: "أساسيات ما قبل السريرية", en: "Preclinical foundations" },
    description: {
      ar: "سنتان من الأساسات: تشريح الرأس والعنق، الأنسجة، مواد طب الأسنان، وفن قراءة الأشعة — البنية التي يقف عليها كل شيء بعدها.",
      en: "Two years of fundamentals: head and neck anatomy, histology, dental materials, and the art of reading radiographs — the structure everything else stands on.",
    },
    skills: [
      { ar: "تشريح الرأس والعنق", en: "Head & neck anatomy" },
      { ar: "مواد طب الأسنان", en: "Dental materials" },
      { ar: "قراءة الأشعة", en: "Radiographic interpretation" },
    ],
    stats: [],
  },
  {
    year: "2023",
    title: { ar: "مختبر المحاكاة", en: "Simulation lab" },
    description: {
      ar: "أول تحضير وحشو على أنماط التدريب (التايبودونت): قاعات دراسية كاملة، ومبرد لأول مرة بين يديّ — تحت إشراف دقيق خطوة بخطوة.",
      en: "First preps and fillings on typodonts: full simulation wards, a handpiece in my hands for the first time — under close step-by-step supervision.",
    },
    skills: [
      { ar: "التحضير المحافظ", en: "Conservative preparation" },
      { ar: "الحشوات المركبة", en: "Composite restorations" },
      { ar: "الطباعة والتشخيص", en: "Impressions & diagnosis" },
    ],
    stats: [{ label: { ar: "تمرين مختبري", en: "lab exercise" }, value: 85 }],
  },
  {
    year: "2024",
    title: { ar: "أول مرضى حقيقيين", en: "First real patients" },
    description: {
      ar: "بداية التدريب السريري: فحص وتشخيص، تنظيف ومنع، وحشوات بسيطة. أهم درس؟ اليد الجيدة تبدأ من جلسة إنصات جيدة.",
      en: "Clinical rotations begin: exams and diagnosis, prophylaxis, simple restorations. The biggest lesson? A good hand starts with a good listening session.",
    },
    skills: [
      { ar: "الفحص الشامل", en: "Comprehensive exam" },
      { ar: "التنظيف والوقاية", en: "Prophylaxis" },
      { ar: "التخدير الموضعي", en: "Local anesthesia" },
    ],
    stats: [
      { label: { ar: "حشوة", en: "fillings" }, value: 45 },
      { label: { ar: "جلسة لثة", en: "perio visits" }, value: 25 },
    ],
  },
  {
    year: "2025",
    title: { ar: "التوسع السريري", en: "Clinical expansion" },
    description: {
      ar: "سنوات التخصص الدقيق تبدأ: علاج جذور بالأدوات الدوارة، ترميمات أكبر، وبداية التعويضات الثابتة — مع أول حالات أمامية تجميلية.",
      en: "Specialty rotations begin: rotary endodontics, larger restorations, and the first fixed prosthesis cases — plus my first anterior esthetic cases.",
    },
    skills: [
      { ar: "علاج الجذور الدوّار", en: "Rotary endodontics" },
      { ar: "الترميمات الأمامية", en: "Anterior restorations" },
      { ar: "تحضير التيجان", en: "Crown preparation" },
    ],
    stats: [
      { label: { ar: "حشوة", en: "fillings" }, value: 38 },
      { label: { ar: "علاج جذور", en: "endo cases" }, value: 12 },
      { label: { ar: "تاج", en: "crowns" }, value: 6 },
    ],
  },
  {
    year: "2026",
    title: { ar: "سنة الحصيلة", en: "The tally so far" },
    description: {
      ar: "منتصف السنة الخامسة — هذه حصيلة ما أنجزته تحت الإشراف حتى الآن في عيادات الكلية، وأرقامها تنمو كل أسبوع.",
      en: "Mid fifth year — here's what I've completed under supervision in the faculty clinics so far, and the numbers grow every week.",
    },
    skills: [
      { ar: "إدارة موعد كامل", en: "Full appointment workflow" },
      { ar: "توثيق الحالات", en: "Case documentation" },
      { ar: "تثقيف المريض", en: "Patient education" },
    ],
    stats: [
      {
        label: { ar: "حشوة مكتملة", en: "completed fillings" },
        value: 120,
        suffix: { ar: "+", en: "+" },
      },
      {
        label: { ar: "علاج جذور", en: "endo treatments" },
        value: 45,
        suffix: { ar: "+", en: "+" },
      },
      {
        label: { ar: "جلسة معالجة لثة", en: "perio sessions" },
        value: 60,
        suffix: { ar: "+", en: "+" },
      },
      {
        label: { ar: "عمل تعويضي", en: "prosthetic works" },
        value: 15,
        suffix: { ar: "+", en: "+" },
      },
    ],
  },
  {
    year: "2027",
    title: { ar: "سنة التخرج", en: "Graduation year" },
    description: {
      ar: "التدريب الخارجي، مشروع التخرج، ثم اليميد ثم التخرج في يونيو 2027 بإذن الله — وبعده مباشرة: برامج التدريب المتقدم.",
      en: "Externship, the graduation project, then the oath and graduation in June 2027 — and right after: advanced training programs.",
    },
    skills: [
      { ar: "التدريب الخارجي", en: "Externship" },
      { ar: "مشروع التخرج", en: "Graduation project" },
      { ar: "الامتحان النهائي", en: "Final boards" },
    ],
    stats: [],
  },
];
