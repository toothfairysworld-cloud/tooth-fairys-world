import type { CaseEntry, CategoryLabel, CaseCategory } from "./types";

export const caseCategories: CategoryLabel[] = [
  { id: "fillings", label: { ar: "الحشوات", en: "Fillings" } },
  { id: "endo", label: { ar: "علاج الجذور", en: "Root canal" } },
  { id: "gum", label: { ar: "اللثة", en: "Gum" } },
  { id: "prosth", label: { ar: "التعويضات", en: "Prosthetics" } },
];

export const categoryLabel = (
  id: CaseCategory,
): CaseLabel => caseCategories.find((c) => c.id === id)!;
type CaseLabel = CategoryLabel;

/**
 * SAMPLE case studies — stock photos, consent-gated publishing arrives in
 * Phase 2 (the checkbox is enforced there before any real case goes live).
 */
export const cases: CaseEntry[] = [
  {
    slug: "anterior-composite",
    category: "fillings",
    featured: true,
    title: {
      ar: "ترميم سن أمامي مكسور بالحشوة المركبة",
      en: "Restoring a fractured front tooth with composite",
    },
    summary: {
      ar: "كسر في الثلث الحادي للسن الجانبي بعد حادث منزلي — ترميم طبقي بلونين في جلسة واحدة.",
      en: "A fracture in the lateral incisor's incisal third after a household accident — layered two-shade restoration in a single visit.",
    },
    period: "2026-03",
    images: {
      before: "/images/case-1-before.webp",
      after: "/images/case-1-after.webp",
      alt: {
        ar: "مقارنة قبل وبعد لترميم سن أمامي مكسور",
        en: "Before and after comparison of a fractured front tooth restoration",
      },
    },
    story: {
      complaint: {
        ar: "شاب في العشرينيات يأتي بعد ساعة من كسر زاوية السن الجانبي العلوي أثناء فتح زجاجة — لا ألم، لكن الخجل من الابتسامة واضح.",
        en: "A man in his twenties arrives an hour after breaking the corner of his upper lateral incisor while opening a bottle — no pain, but clearly embarrassed to smile.",
      },
      diagnosis: {
        ar: "كسر غير معقّد في الثلث القاطع بدون إصابة اللب أو النفق — الاختبارات الحسية طبيعية، والصورة الشعاعية استبعدت امتداد الكسر إلى الجذر.",
        en: "An uncomplicated fracture of the incisal third with no pulp or canal involvement — vitality tests normal, and the radiograph ruled out fracture extension to the root.",
      },
      plan: {
        ar: "ترميم مباشر بالحشوة المركبة بتقنية الطبقات: قاعدة معتمة (دنتين) ثم طبقة شفافة (مينا) لاصطناع انكسار الضوء الطبيعي، مع إعادة بناء الزاوية بالكامل.",
        en: "Direct composite restoration using the layering technique: an opaque dentin base, then a translucent enamel layer to mimic natural light transmission, fully rebuilding the corner.",
      },
      materials: {
        ar: "مركب نانوهجين مركب بلونين (A2 دنتين + مينا شفافة)، رابط ذاتي التخمير، وأقراص تلميع ماصة بأربعة أطوار.",
        en: "Two-shade nanohybrid composite (A2 dentin + translucent enamel), self-etch adhesive, and four-stage polishing discs.",
      },
      learned: {
        ar: "النجاح في الأسنان الأمامية قرار فني بقدر ما هو طبي: مطابقة اللون تحت ثلاث إضاءات مختلفة قبل البدء وفّرت عليّ إعادة العمل، وقال المريض إنه لم يعد يفرّق السن عن جيرانه.",
        en: "Anterior success is an artistic decision as much as a medical one: shade-matching under three different lights before starting saved me a redo — the patient said he can no longer tell the tooth from its neighbors.",
      },
    },
    published: true,
    isSample: true,
  },
  {
    slug: "class-ii-composite",
    category: "fillings",
    title: {
      ar: "حشوة خلفية مزدوجة بضرسين متجاورين",
      en: "Class II double-surface posterior restoration",
    },
    summary: {
      ar: "تسوس تحت حشوة قديمة في ضرسين متجاورين — إزالة، عزل، وترميم مزدوج بتقنية الصندوق وخطوة اللمسة السفلية.",
      en: "Caries under an old filling in two adjacent molars — removal, isolation, and a double restoration with the box technique and proximal contact rebuild.",
    },
    period: "2025-11",
    images: {
      before: "/images/case-2-before.webp",
      after: "/images/case-2-after.webp",
      alt: {
        ar: "مقارنة قبل وبعد لحشوة ضرس خلفي",
        en: "Before and after comparison of a posterior molar restoration",
      },
    },
    story: {
      complaint: {
        ar: "أم في الأربعينيات تشكو من تحسس بارد متكرر عند الطرف الخلفي الأيمن، وخيط الأسنان يتمزق عند نقطة واحدة بعينها.",
        en: "A woman in her forties complains of recurring cold sensitivity in the upper right back area, and floss shredding at one specific spot.",
      },
      diagnosis: {
        ar: "تسوس ثانوي تحت حشوة ملغمة قديمة مع كسر جزئي في حافتها، وتسوس سطحين تقريبيين في الضرس المجاور — واضح في الأشعة البتّاوية.",
        en: "Secondary caries under an old amalgam restoration with a partially fractured margin, plus proximal caries on the neighboring molar — clear on the bitewing radiograph.",
      },
      plan: {
        ar: "جلسة واحدة تحت عزل بالسدّ المطاطي: إزالة الحشوة والتسوس، ثم ترميم مزدوج بشرائط فاصلة لاستعادة نقطة التلامس الطبيعية بين السنين دون فراغ طعام.",
        en: "A single rubber-dam-isolated session: removal of the old restoration and caries, then a double composite rebuild with separating matrices to restore a natural contact point without food traps.",
      },
      materials: {
        ar: "مركب خلفي قابل للتعبئة، شرائط تلامس مقوّاة، رابط شامل، وسدّ مطاطي.",
        en: "Packable posterior composite, reinforced contact matrices, universal adhesive, and a rubber dam.",
      },
      learned: {
        ar: "نقطة التلامس ليست تفصيلاً: فراغ بقدر رأس الدبوس يعني ضيق طعام والتهاب لثة متكرر بعد أسبوع. القياس قبل وبعد بالخيط صار عادةً عندي في كل حشوة خلفية.",
        en: "The contact point isn't a detail: a gap the width of a pin head means food impaction and recurring gingivitis within a week. Measuring floss pass before and after is now a habit on every posterior restoration.",
      },
    },
    published: true,
    isSample: true,
  },
  {
    slug: "molar-endo",
    category: "endo",
    title: {
      ar: "علاج جذور ضرس العقل الأول بنظام دوّار",
      en: "Rotary endodontic treatment of a first molar",
    },
    summary: {
      ar: "لب متنخر بعد تسوس عميق — ثلاث قنوات، نظام دوّار، وحشو ثلاثي الأبعاد في جلستين.",
      en: "A necrotic pulp after deep caries — three canals, a rotary system, and warm three-dimensional obturation in two visits.",
    },
    period: "2026-01",
    images: {
      before: "/images/case-3-before.webp",
      after: "/images/case-3-after.webp",
      alt: {
        ar: "صورة إشعاعية لعلاج جذور ضرس قبل وبعد الحشو",
        en: "Radiograph of a molar root canal before and after obturation",
      },
    },
    story: {
      complaint: {
        ar: "رجل ثلاثيني يوقظ من نومه ألماً ليلياً نابضاً في ضرسه الأول السفلي الأيمن، مع شعور بأن السن «أطول من جيرانه» عند الإطباق.",
        en: "A man in his thirties is woken by throbbing night pain in his lower right first molar, and a feeling that the tooth is 'taller than its neighbors' when biting.",
      },
      diagnosis: {
        ar: "تسوس عميق مؤدٍ إلى تنخر اللب (التهاب لب غير رجعي/تنخري) مع حساسية إطباقية — الأشعة أظهرت آفة حول قمة الجذر.",
        en: "Deep caries leading to irreversible pulp necrosis with percussion tenderness — the radiograph showed a periapical lesion.",
      },
      plan: {
        ar: "علاج جذور كامل: فتح، قياس القنوات الثلاث بجهاز القياس الإلكتروني، تنظير وتوسيع بالأدوات الدوارة، مطهر بالكلورهيكسيدين، ثم حشو بالسدّ الساخن، وترميم نهائي بعدها بأسبوع.",
        en: "Full root canal treatment: access, electronic working-length measurement of all three canals, rotary shaping, chlorhexidine irrigation, warm vertical obturation, and a definitive restoration a week later.",
      },
      materials: {
        ar: "ملفات NiTi دوّارة، جهاز قياس إلكتروني، سدّ مائي بحرارة، وأوتار غير قابل للذوبان حيوياً.",
        en: "Rotary NiTi files, an apex locator, warm gutta-percha, and a biocompatible sealer.",
      },
      learned: {
        ar: "المريض عاد يقول: «نمت أول ليلة كاملة منذ أسابيع». علاج الجذور المشهور بألقه ليس مؤلماً بذاته؛ الألم هو تركه دون علاج. الدقة في القياس هي ما يمنع إعادة العلاج.",
        en: "The patient returned saying: 'I slept a full night for the first time in weeks.' Root canals' notorious reputation isn't from the treatment itself — the pain is leaving it untreated. Measurement precision is what prevents retreatment.",
      },
    },
    published: true,
    isSample: true,
  },
  {
    slug: "gingivitis-therapy",
    category: "gum",
    title: {
      ar: "برنامج علاج لثة شامل لالتهاب مزمن",
      en: "Comprehensive gum therapy program for chronic gingivitis",
    },
    summary: {
      ar: "نزف لثة عند التنظيف استمر سنة — تنظيف مهني، تعديل تقنية الفرشاة، ومتابعة ثلاثية أعادت اللثة صحية في 21 يوماً.",
      en: "A year of bleeding gums — professional cleaning, brushing technique coaching, and a three-week follow-up that restored healthy gums in 21 days.",
    },
    period: "2025-09",
    images: {
      before: "/images/case-4-before.webp",
      after: "/images/case-4-after.webp",
      alt: {
        ar: "مقارنة قبل وبعد لعلاج التهاب اللثة",
        en: "Before and after comparison of gingivitis therapy",
      },
    },
    story: {
      complaint: {
        ar: "طالبة جامعية في العشرينيات: «دم في المغسل كل صباح» وتجنبت التنظيف في المواضع التي تنزف — فازداد الأمر سوءاً.",
        en: "A university student in her twenties: 'blood in the sink every morning' — she avoided brushing the areas that bled, which only made it worse.",
      },
      diagnosis: {
        ar: "التهاب لثة مزمن بلا جيوب عميقة أو فقد عظمي (مرحلة مبكرة قابلة للعكس تماماً) مترافق مع تراكم جير فوق اللثة وتنظيف عشوائي مرة يومياً.",
        en: "Chronic gingivitis without deep pockets or bone loss — an early, fully reversible stage — accompanied by supragingival calculus and random once-daily brushing.",
      },
      plan: {
        ar: "تنظيف مهني فوق وتحت اللثة في جلسة، ثم جلسة تدريب على فرشاة ناعمة وطريقة باص المعدلة 45 درجة، خيط يومي، ومواعيد متابعة في اليوم السابع والحادي والعشرين.",
        en: "Professional supragingival and subgingival cleaning in one visit, then a coaching session on a soft brush and the modified 45-degree Bass technique, daily floss, and follow-ups on day 7 and day 21.",
      },
      materials: {
        ar: "مقلع جير يدوي وموجات فوق صوتية، فرشاة ناعمة مزدوجة الشعيرات، وخيط شمعي.",
        en: "Hand and ultrasonic scalers, a soft dual-tufted brush, and waxed floss.",
      },
      learned: {
        ar: "أهم «أداة» في العلاج كانت دقيقة تدريب لا جهازاً: تغيير طريقة التنظيف غيّر النتيجة أكثر من التنظيف المهني نفسه. المريضة صارت تعلّم زميلاتها في السكن الطريقة الصحيحة.",
        en: "The most important 'instrument' in this treatment was a coaching minute, not a device: changing the brushing method changed the outcome more than the professional cleaning itself. The patient ended up teaching her dormmates the correct technique.",
      },
    },
    published: true,
    isSample: true,
  },
  {
    slug: "zirconia-crown",
    category: "prosth",
    title: {
      ar: "تاج زيركون لضرس ضعيف بعد حشوة كبيرة",
      en: "Zirconia crown for a weakened molar after a large filling",
    },
    summary: {
      ar: "ضرس فقد أكثر من نصف بنيته بعد كسر حشوة — تحضير كامل، طبعة رقمية، وتاج زيركون أحادي اللبس.",
      en: "A molar that lost over half its structure after a filling fracture — full preparation, a digital scan, and a monolithic zirconia crown.",
    },
    period: "2026-05",
    images: {
      before: "/images/case-5-before.webp",
      after: "/images/case-5-after.webp",
      alt: {
        ar: "مقارنة قبل وبعد لتركيب تاج زيركون",
        en: "Before and after comparison of a zirconia crown placement",
      },
    },
    story: {
      complaint: {
        ar: "أب في الأربعينيات يكسر حشوته الضخمة «كل أشهر تقريباً» ويطلب حلاً نهائياً يتحمل مضغه القوي.",
        en: "A father in his forties breaks his large filling 'almost every month' and asks for a definitive solution that survives his strong chewing.",
      },
      diagnosis: {
        ar: "ضرس أول سفلي فقد أكثر من 50% من تاجه مع حشوات متكررة — مرشح واضح للتغطية الكاملة بدلاً من إصلاح ثالث.",
        en: "A lower first molar that lost over 50% of its crown with repeated restorations — a clear candidate for full coverage rather than a third repair.",
      },
      plan: {
        ar: "تحضير كامل بانحدار محسوب، طبعة بماسح فموي رقمي (بدون معاجين الطبعات المزعجة)، تاج زيركون أحادي مُصمم رقمياً، تثبيت مؤقت أسبوعاً ثم لصق نهائي.",
        en: "Full preparation with a calculated taper, a digital oral-scanner impression (no messy putty), a digitally designed monolithic zirconia crown, one week of temporary cementation, then final bonding.",
      },
      materials: {
        ar: "زيركون أحادي عالي الشفافية، ماسح رقمي، وسمنت زجاجي أيونومري لاصق.",
        en: "High-translucency monolithic zirconia, a digital scanner, and adhesive glass-ionomer cement.",
      },
      learned: {
        ar: "الطبعة الرقمية حوّلت أكثر خطوة يكرهها المرضى إلى مشهد «مستقبلي» يصورونه بهواتفهم. وعلمتني المتابعة أن جودة التحضير تُختبر عند اللصق: تاج يجلس دون ضغط يعني تحضيراً صحيحاً.",
        en: "The digital scan turned the most hated step into a 'futuristic' moment patients film on their phones. Follow-up taught me that preparation quality is truly tested at seating: a crown that settles without pressure means the prep was right.",
      },
    },
    published: true,
    isSample: true,
  },
  {
    slug: "smile-rehabilitation",
    category: "prosth",
    title: {
      ar: "تأهيل ابتسامة بترميمات أمامية متعددة",
      en: "Smile rehabilitation with multiple anterior restorations",
    },
    summary: {
      ar: "تآكل مينا واسع بعد ارتجاع معدي — خطة مرحلية حافظة بدل تيجان كاملة: ترميمات مركبة مبنية على تصميم ابتسامة رقمي.",
      en: "Widespread enamel erosion after acid reflux — a staged, conservative plan instead of full crowns: composite restorations built on a digital smile design.",
    },
    period: "2026-06",
    images: {
      before: "/images/case-6-before.webp",
      after: "/images/case-6-after.webp",
      alt: {
        ar: "مقارنة قبل وبعد لتأهيل ابتسامة بترميمات أمامية",
        en: "Before and after comparison of an anterior smile rehabilitation",
      },
    },
    story: {
      complaint: {
        ar: "مدرّسة ثلاثينية تجنّبت الضحك أمام طلابها: أسنان أمامية «قصرت وتآكلت» وأصبح لونها باهتاً حبيباً، مع حساسية باردة مزمنة.",
        en: "A teacher in her thirties avoided laughing in front of her students: her front teeth 'shortened and eroded' to a matte, opaque shade, with chronic cold sensitivity.",
      },
      diagnosis: {
        ar: "تآكل حمضي معمم في الأسنان الأمامية العلوية نتيجة ارتجاع معدي غير مُدار — مع فقد طول قاطع قابل للقياس، وبدون تسوس نشط.",
        en: "Generalized acid erosion of the upper anterior teeth from unmanaged gastric reflux — with measurable loss of incisal length and no active caries.",
      },
      plan: {
        ar: "المرحلة صفر: إحالة لإدارة الارتجاع طبياً (بدونها سيفشل أي ترميم). ثم تصميم ابتسامة رقمي، نموذج تجريبي في الفم، وأخيراً ترميمات مركبة طبقية موزعة على جلستين — دون بَرّ زائد عن الحاجة.",
        en: "Phase zero: a medical referral to manage the reflux (any restoration fails without it). Then a digital smile design, an in-mouth mock-up, and finally layered composite restorations across two visits — with no unnecessary drilling.",
      },
      materials: {
        ar: "نظام مركب متعدد الشفافيات، قوالب سيليكون من النموذج، وورنيش فلورايد موضعي للحماية.",
        en: "A multi-translucency composite system, silicone indices from the mock-up, and topical fluoride varnish for protection.",
      },
      learned: {
        ar: "أحلى لحظة: دخلت المريضة للجلسة الثانية فطلبت رؤية الصورة «قبل» ثم ضحكت بصوت مسموع أول مرة. والدرس الأهم: علاج السبب قبل علاج النتيجة — وإلا أعدت الترميم كل سنة.",
        en: "The sweetest moment: at the second visit she asked to see the 'before' photo, then laughed out loud for the first time. And the biggest lesson: treat the cause before the consequence — otherwise you redo the restoration every year.",
      },
    },
    published: true,
    isSample: true,
  },
];
