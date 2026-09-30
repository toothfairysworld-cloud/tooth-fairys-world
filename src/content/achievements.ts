import type { Certificate, ResearchItem, VolunteeringItem } from "./types";

/** SAMPLE certificates — issuer, date; optional PDF/image arrives with real uploads. */
export const certificates: Certificate[] = [
  {
    id: "bls-2025",
    title: { ar: "دعم الحياة الأساسية (BLS)", en: "Basic Life Support (BLS)" },
    issuer: { ar: "مركز تدريب معتمد — بالشراكة مع AHA", en: "Certified training center — AHA aligned" },
    date: "2025-10-12",
    isSample: true,
  },
  {
    id: "infection-control-2025",
    title: {
      ar: "ورشة مكافحة العدوى في عيادات الأسنان",
      en: "Infection Control in Dental Clinics Workshop",
    },
    issuer: { ar: "إدارة التدريب الصحي المستمر", en: "Continuing Health Training Directorate" },
    date: "2025-05-20",
    isSample: true,
  },
  {
    id: "esthetic-course-2026",
    title: {
      ar: "دورة الحشوات التجميلية المتقدمة",
      en: "Advanced Esthetic Restorations Course",
    },
    issuer: { ar: "الجمعية العلمية لطب الأسنان", en: "Dental Scientific Association" },
    date: "2026-02-08",
    isSample: true,
  },
  {
    id: "rotary-endo-2026",
    title: {
      ar: "ورشة علاج الجذور بالأدوات الدوّارة",
      en: "Rotary Endodontics Workshop",
    },
    issuer: { ar: "قسم علاج الجذور — كلية طب الأسنان", en: "Endodontics Department, Faculty of Dentistry" },
    date: "2026-03-15",
    isSample: true,
  },
  {
    id: "dental-conference-2025",
    title: {
      ar: "حضور المؤتمر الدولي لطب الأسنان",
      en: "International Dental Conference — Attendance",
    },
    issuer: { ar: "الهيئة المنظمة للمؤتمر", en: "Conference Organizing Authority" },
    date: "2025-11-03",
    isSample: true,
  },
  {
    id: "digital-dentistry-2026",
    title: {
      ar: "مقدمة في طب الأسنان الرقمي",
      en: "Introduction to Digital Dentistry",
    },
    issuer: { ar: "أكاديمية التعليم المستمر", en: "Continuing Education Academy" },
    date: "2026-06-21",
    isSample: true,
  },
];

/** SAMPLE research & projects. */
export const research: ResearchItem[] = [
  {
    id: "hygiene-survey",
    title: {
      ar: "عادات العناية بالفم بين طلاب الجامعات: مسح مقطعي",
      en: "Oral Hygiene Habits Among University Students: A Cross-Sectional Survey",
    },
    abstract: {
      ar: "مسح شمل 412 طالباً في ثلاث كليات: فحص سريري واستبيان عن عادات التنظيف. أظهرت النتائج أن 61% لا ينظفون أسنانهم مرتين يومياً، ويتذكرون الخيط «عندما تنزف اللثة فقط» — والارتباط الأقوى كان بالمعرفة وليس بالوقت المتاح، ما يرجّح أولوية التوعية على الوعظ.",
      en: "A survey of 412 students across three colleges: clinical screening plus a hygiene-habits questionnaire. Results showed 61% skip twice-daily brushing and remember floss 'only when gums bleed' — the strongest correlation was with knowledge, not available time, suggesting education beats lecturing.",
    },
    link: "/pdfs/sample-cv.pdf",
    year: "2025",
    isSample: true,
  },
  {
    id: "perio-diabetes-review",
    title: {
      ar: "العلاقة بين أمراض اللثة والسكري من النوع الثاني: مراجعة أدبية",
      en: "The Periodontitis–Type 2 Diabetes Link: A Literature Review",
    },
    abstract: {
      ar: "مراجعة لـ 38 دراسة منشورة بين 2015 و2025 حول العلاقة ثنائية الاتجاه بين التهاب اللثة المزمن والتحكم السكري، وتلخّص الأدلة على أن علاج اللثة يحسّن HbA1c بمقدار يعادل إضافة دواء — وأثرها العملي على تنسيق العناية بين طبيب الأسنان وطبيب الباطنة.",
      en: "A review of 38 studies published 2015–2025 on the bidirectional relationship between chronic periodontitis and glycemic control, consolidating evidence that periodontal therapy improves HbA1c by an effect size comparable to adding a medication — and its practical impact on coordinated care between dentists and physicians.",
    },
    link: "/pdfs/sample-cv.pdf",
    year: "2026",
    isSample: true,
  },
  {
    id: "case-report-anterior",
    title: {
      ar: "تقرير حالة: ترميم كسر أمامي بالطبقات المركبة",
      en: "Case Report: Layered Composite Restoration of an Anterior Fracture",
    },
    abstract: {
      ar: "توثيق مقارن خطوة بخطوة لترميم كسر غير معقّد في سن أمامي بتقنية الطبقات، مع قياس مطابقة اللون بعد 6 أشهر وصور سريرية موثقة — من المتوقع عرضه كملصق علمي في اليوم البحثي للكلية.",
      en: "A step-by-step comparative documentation of an uncomplicated anterior fracture restored with the layering technique, including 6-month shade stability readings and clinical photography — submitted as a poster to the faculty research day.",
    },
    year: "2026",
    isSample: true,
  },
];

/** SAMPLE volunteering & community campaigns. */
export const volunteering: VolunteeringItem[] = [
  {
    id: "smile-week",
    title: { ar: "أسبوع الابتسامة", en: "Smile Week" },
    description: {
      ar: "حملة توعية في أربع مدارس ابتدائية: عروض تفاعلية عن التنظيف الصحيح، فحص فمي مبدئي، وهدايا فرش ومعاجين أسنان للأطفال — مع رسالة للأهالي عن أول زيارة لطبيب الأسنان.",
      en: "An awareness campaign across four elementary schools: interactive brushing demos, preliminary oral screening, and brush-and-paste gifts for the kids — plus a take-home message to parents about the first dental visit.",
    },
    image: {
      src: "/images/vol-1.webp",
      alt: {
        ar: "متطوعون يعلمون أطفالاً الطريقة الصحيحة لتنظيف الأسنان في مدرسة",
        en: "Volunteers teaching children the correct way to brush at a school",
      },
    },
    impact: [
      { label: { ar: "طفل فُحص", en: "children screened" }, value: 320 },
      { label: { ar: "حصة توعية", en: "awareness sessions" }, value: 12 },
    ],
    isSample: true,
  },
  {
    id: "ramadan-checkups",
    title: { ar: "فحوصات رمضان الوقائية", en: "Ramadan Preventive Checkups" },
    description: {
      ar: "خيمة صحية في حيّ المدينة قبل رمضان بأسبوع: فحوصات مجانية وتثقيف عن صحة الفم أثناء الصيام، بالتعاون مع عيادة متنقلة ومتطوعين من الكلية.",
      en: "A neighborhood health tent a week before Ramadan: free screenings and education about oral health while fasting, in partnership with a mobile clinic and faculty volunteers.",
    },
    image: {
      src: "/images/vol-2.webp",
      alt: {
        ar: "خيمة صحية مجتمعية للفحوصات الوقائية",
        en: "A community health tent for preventive checkups",
      },
    },
    impact: [
      { label: { ar: "فحص وقائي", en: "preventive checks" }, value: 180 },
      { label: { ar: "متطوع شارك", en: "volunteers involved" }, value: 14 },
    ],
    isSample: true,
  },
  {
    id: "juniors-mentoring",
    title: { ar: "إرشاد طلاب السنوات الأولى", en: "Junior Students Mentoring" },
    description: {
      ar: "جلسات شهرية مفتوحة لطلاب السنوات الأولى: كيف تتغلب على مواد ما قبل السريرية، وتجربتي الأولى مع المرضى — لأن أحداً لم يرشدني حين احتجت، فلأكن أنا من يفعل.",
      en: "Monthly open sessions for first-year students: how to survive preclinical courses, and what my first patient encounters taught me — because nobody mentored me when I needed it, so I choose to be that person.",
    },
    image: {
      src: "/images/vol-3.webp",
      alt: {
        ar: "جلسة إرشاد جماعية لطلاب طب الأسنان",
        en: "A group mentoring session for dental students",
      },
    },
    impact: [
      { label: { ar: "طالب استفاد", en: "students reached" }, value: 95 },
      { label: { ar: "جلسة", en: "sessions" }, value: 9 },
    ],
    isSample: true,
  },
];
