import type { FaqItem, ResourceItem, Testimonial } from "./types";

/** SAMPLE "Ask the student" FAQ — oral health Q&A. */
export const faq: FaqItem[] = [
  {
    q: { ar: "كم مرة أزور طبيب الأسنان فعلاً؟", en: "How often do I really need to see a dentist?" },
    a: {
      ar: "القاعدة العامة كل 6 أشهر للفحص والتنظيف، لكنها ليست رقماً مقدساً: من لديه لثة ملتهبة أو تقويم أو تاريخ تسوس نشط قد يحتاج كل 3-4 أشهر، ومن حالته مستقرة قد تكفيه زيارة سنوية. القرار يُبنى على فحص، لا على تقويم عام.",
      en: "The general rule is every 6 months for a check-up and cleaning, but it isn't sacred: anyone with gum inflammation, braces, or an active caries history may need every 3–4 months, while a stable mouth might do fine with an annual visit. The decision is built on an exam, not a calendar.",
    },
  },
  {
    q: { ar: "هل تبييض الأسنان آمن؟ يُضعف المينا؟", en: "Is teeth whitening safe? Does it weaken enamel?" },
    a: {
      ar: "التبييض الاحترافي تحت إشراف طبيب آمن ولا يُذيب المينا — قد يسبب حساسية مؤقتة تُدار بمعاجين الفلورايد. أما الخطرة الحقيقية ففي المنتجات العشوائية عالية التركيز وبلا فحص مسبق: حشوات قديمة أو تسوس كامن يتحول بعدها إلى ألم حقيقي. الفحص أولاً، ثم التبييض.",
      en: "Professional whitening supervised by a dentist is safe and doesn't dissolve enamel — it may cause temporary sensitivity managed with fluoride pastes. The real danger is random high-concentration products used without a prior exam: old fillings or hidden caries can turn into real pain afterward. Exam first, whiten second.",
    },
  },
  {
    q: { ar: "الفرشاة الكهربائية أفضل من العادية؟", en: "Are electric brushes better than manual ones?" },
    a: {
      ar: "لمن يتقن التنظيف اليدوي، الفرق صغير. لكن الدراسات تُظهر أن الفرشاة الكهربائية ذات رأس دوّار تعطي تنظيفاً أفضل لمن يندفع بالضغط القوي أو يحرك الفرشاة بعشوائية، ولأصحاب التقويم والمهارات اليدوية المحدودة. التقنية الأهم تبقى: زاوية 45 درجة ووقت كافٍ.",
      en: "For someone with perfect manual technique, the difference is small. But studies show rotating electric brushes clean better for those who press hard or brush erratically, and for people with braces or limited manual dexterity. The technique that matters most stays the same: a 45-degree angle and enough time.",
    },
  },
  {
    q: { ar: "متى أول زيارة لطفلي لطبيب الأسنان؟", en: "When should my child first see a dentist?" },
    a: {
      ar: "مع بزوغ أول سن — أي حوالي عمر السنة — أو بعدها بستة أشهر على الأكثر. الزيارة الأولى ليست عن العلاج بل عن التعوّد: طبيب ودود، كرسي «سحري»، وتقييم سريع لعادة مصّ الإصبع أو اللسان، وأهم شيء: أن تخرجا قبل أن يملّ الطفل.",
      en: "When the first tooth erupts — around age one — or within six months after at the latest. The first visit isn't about treatment but about getting comfortable: a friendly dentist, a 'magic' chair, a quick look at thumb-sucking habits, and most importantly, leaving before the child gets bored.",
    },
  },
  {
    q: { ar: "هل علاج الجذور مؤلم فعلاً كما يشاع؟", en: "Is a root canal as painful as its reputation?" },
    a: {
      ar: "الشهرة قديمة من عصر قبل التخدير الحديث. اليوم: تخدير موضعي فعّال يجعل الجلسة أقرب لحشوة عادية، والألم الذي يُذكر تاريخياً هو ألم اللب الملتهب قبل العلاج — أي أن العلاج نفسه هو الذي يوقف الألم. مريضي بعد أول جلسة: «هذا كل شيء؟».",
      en: "The reputation dates from an era before modern anesthesia. Today: effective local anesthesia makes the session closer to a normal filling, and the pain people remember historically is the inflamed pulp hurting *before* treatment — meaning the treatment itself is what stops the pain. My patients after a first session: 'That's it?'",
    },
  },
  {
    q: { ar: "نزيف اللثة يجب أن أتوقف عن التنظيف حين يحدث؟", en: "Bleeding gums mean I should stop brushing?" },
    a: {
      ar: "العكس تماماً — هو نداء للاستمرار بشكل صحيح. النزيف علامة التهاب من الترس المتراكم، والتنظيف اللطيف بزاوية 45 درجة مرتين يومياً هو العلاج الأولي. إن استمر النزيف أكثر من أسبوعين رغم الالتزام، فالزيارة التالية تصبح ضرورة.",
      en: "Exactly the opposite — it's a call to continue, correctly. Bleeding signals inflammation from accumulated plaque, and gentle twice-daily brushing at a 45-degree angle is the first-line treatment. If bleeding persists beyond two weeks despite the effort, the next visit becomes a necessity.",
    },
  },
];

/** SAMPLE downloadable resources for younger students. */
export const resources: ResourceItem[] = [
  {
    id: "anatomy-notes",
    title: { ar: "مذكرة تشريح الأسنان المبسطة", en: "Simplified Dental Anatomy Notes" },
    description: {
      ar: "32 صفحة تلخص تشريح تيجان الأسنان برسوم مكتوبة بخط اليد — من محاضرات السنة الثانية بعد إعادة ترتيبها.",
      en: "32 pages summarizing crown anatomy with hand-drawn diagrams — reorganized from second-year lectures.",
    },
    file: "/pdfs/resource-anatomy.pdf",
    downloads: 64,
    kind: "notes",
    isSample: true,
  },
  {
    id: "composite-checklist",
    title: { ar: "قائمة مراجعة خطوات الحشوة المركبة", en: "Composite Restoration Steps Checklist" },
    description: {
      ar: "قائمة من 18 خطوة من العزل حتى التلميع — اطبعها وعلّقها أمام كرسيك في المختبر.",
      en: "An 18-step list from isolation to polishing — print it and hang it in front of your lab chair.",
    },
    file: "/pdfs/resource-composite.pdf",
    downloads: 38,
    kind: "checklist",
    isSample: true,
  },
  {
    id: "study-plan",
    title: { ar: "خطة مذاكرة السنة الخامسة", en: "Fifth-Year Study Plan" },
    description: {
      ar: "كيف وازنت بين العيادات الصباحية والامتحانات والنوم — جدول أسبوعي قابل للتعديل.",
      en: "How I balanced morning clinics with exams and sleep — an editable weekly schedule.",
    },
    file: "/pdfs/resource-plan.pdf",
    downloads: 52,
    kind: "plan",
    isSample: true,
  },
  {
    id: "glossary",
    title: { ar: "دليل المصطلحات: إنجليزي-عربي", en: "Dental Glossary: English–Arabic" },
    description: {
      ar: "أكثر من 200 مصطلح سريري شائع مرتبة حسب التخصص — لأن أغلب مراجعنا بالإنجليزية ومرضانا يتكلمون العربية.",
      en: "Over 200 common clinical terms organized by specialty — because most of our references are English while our patients speak Arabic.",
    },
    file: "/pdfs/resource-glossary.pdf",
    downloads: 27,
    kind: "glossary",
    isSample: true,
  },
];

/** SAMPLE testimonials from supervisors and peers. */
export const testimonials: Testimonial[] = [
  {
    id: "supervisor",
    quote: {
      ar: "جنية الأسنان نموذج متميز يسأل «لماذا» قبل «كيف». يدها مطمئنة وشرحها للمرضى يبعث على الراحة والأمان.",
      en: "Tooth Fairy's World embodies the rare standard of asking 'why' before 'how'. Steady hands, gentle care, and patient explanations that build real confidence.",
    },
    name: "Dr. A. Khalil",
    role: { ar: "مشرف سريري — قسم الترميمات", en: "Clinical supervisor — Restorative Dept." },
    initials: "AK",
    isSample: true,
  },
  {
    id: "professor",
    quote: {
      ar: "حضورها في المحاضرات لا يكتفي بالتسجيل؛ أسئلتها تفتح النقاش دائماً. أتوقع لها بحثاً جيداً في مشروع التخرج.",
      en: "In lectures she doesn't just take notes; her questions always open the discussion. I expect strong research from her graduation project.",
    },
    name: "Prof. L. Mansour",
    role: { ar: "أستاذة مساعدة — علاج الجذور", en: "Associate professor — Endodontics" },
    initials: "LM",
    isSample: true,
  },
  {
    id: "classmate",
    quote: {
      ar: "في الليلات التي سبقت امتحان علاج الجذور كانت ملخصاتها تنتقل بين الطلاب أكثر من الكتاب نفسه.",
      en: "On the nights before our endodontics exam, her summaries circulated among students more than the textbook itself.",
    },
    name: "Hamad A.",
    role: { ar: "زميل دفعة", en: "Classmate" },
    initials: "HA",
    isSample: true,
  },
  {
    id: "junior",
    quote: {
      ar: "جلساتها الإرشادية اختصرت لي شهراً من التخبط في السنة الثانية. تشرح كأنها تجلس معك في السن ذاته.",
      en: "Her mentoring sessions saved me a month of floundering in second year. She explains as if she's sitting in that same year with you.",
    },
    name: "Nouf S.",
    role: { ar: "طالبة سنة ثالثة", en: "Third-year student" },
    initials: "NS",
    isSample: true,
  },
  {
    id: "campaign",
    quote: {
      ar: "في حملة أسبوع الابتسامة أدارت 60 طفلاً في صباح واحد دون أن تفقد ابتسامتها — عادت ليكتب تقريراً كاملاً في المساء.",
      en: "During Smile Week she managed 60 children in a single morning without losing her smile — then went home and wrote the full report that evening.",
    },
    name: "Rania F.",
    role: { ar: "منسقة حملات التوعية", en: "Awareness campaign coordinator" },
    initials: "RF",
    isSample: true,
  },
];
