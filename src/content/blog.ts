import type { BlogPost } from "./types";

/** SAMPLE blog articles — patient-friendly, plain-language oral health content. */
export const posts: BlogPost[] = [
  {
    slug: "brushing-technique",
    title: {
      ar: "دقيقتان تغيّران كل شيء: الطريقة الصحيحة لتنظيف أسنانك",
      en: "Two Minutes That Change Everything: How to Brush Properly",
    },
    excerpt: {
      ar: "معظمنا ينظف أسنانه كل يوم — لكن 4 من كل 5 يفعلونها بطريقة تترك الترس يسكنها. إليك ما يحدث في الدقيقتين الصحيحتين.",
      en: "Most of us brush every day — but 4 out of 5 do it in a way that leaves plaque living comfortably behind. Here's what happens in the right two minutes.",
    },
    category: { ar: "العناية اليومية", en: "Daily care" },
    date: "2026-08-12",
    readingMinutes: 4,
    cover: {
      src: "/images/blog-1.webp",
      alt: {
        ar: "فرشاة أسنان ومعجون بجانب مغسلة",
        en: "A toothbrush and toothpaste beside a sink",
      },
    },
    body: {
      ar: [
        {
          type: "p",
          text: "في العيادة التدريبية أبدأ كل جلسة تنظيف بسؤال بسيط: «كيف تنظف أسنانك؟» ثم أستمع. الإجابة الأكثر تكراراً: «فرشاة أفقية سريعة، دقيقة أو أقل، وضغط قوي» — أي بالضبط الوصفة التي تجعل الترس يفرّ من الشعيرات ويسكن اللثة.",
        },
        {
          type: "h2",
          text: "المشكلة ليست في الاجتهاد، بل في الاتجاه",
        },
        {
          type: "p",
          text: "الترس الجرثومي طبقة رقيقة تلتصق عند خط التقاء السن باللثة — النقطة التي لا تصلها حركة أفقية مهما اجتهدت، بل تدفعها غالباً نحو اللثة فتثيرها. ما تحتاجه هو زاوية 45 درجة: أمل الفرشاة نحو اللثة بحيث تدخل الشعيرات بلطف تحت حافتها، ثم حركات قصيرة مهزوزة موضعية، سنًّاً بعد سن.",
        },
        {
          type: "p",
          text: "الضغط القوي خطأ شائع ثانٍ: الشعيرات تنثني فتفقد ملامستها للسطح، وتتآكل اللثة مع الوقت وتتراجع كاشفةً جذوراً حساسة. القاعدة: ضغط بوزن عملة صغيرة فقط، وفرشاة ناعمة دائماً.",
        },
        { type: "h2", text: "خطة الدقيقتين" },
        {
          type: "ul",
          items: [
            "قسّم فمك إلى أرباع: أعلى يمين، أعلى يسار، أسفل يمين، أسفل يسار.",
            "امنح كل ربع 30 ثانية — مؤقت الهاتف يحل المشكلة تماماً.",
            "الأسطح الخارجية والداخلية والطاحنة: كل سطح له دوره، والزوايا الداخلية للأنياب هي أكثر ما يُنسى.",
            "نظف لسانك في آخر 10 ثوانٍ؛ نصف رائحة الفم تسكنه.",
            "استبدل الفرشاة كل 3 أشهر أو بعد أي مرض حلق.",
          ],
        },
        {
          type: "p",
          text: "لاحظ فرقاً في غضون أسبوعين: نزيف أقل عند التنظيف، ونفس أنقى في الصباح. وإن نزفت اللثة في البدايات فلا تتوقف — التنظيف الصحيح هو العلاج، لا السبب.",
        },
        {
          type: "p",
          text: "هذا المقال تثقيف عام لا يغني عن الفحص الدوري؛ حالتك الخاصة قد تحتاج خطة مختلفة — اسأل طبيبك دائماً.",
        },
      ],
      en: [
        {
          type: "p",
          text: "In the teaching clinic I start every hygiene session with one simple question: 'How do you brush?' Then I listen. The most common answer: 'a quick horizontal scrub, under a minute, with strong pressure' — which is exactly the recipe that lets plaque dodge the bristles and settle at the gumline.",
        },
        { type: "h2", text: "The problem isn't effort — it's direction" },
        {
          type: "p",
          text: "Dental plaque is a thin film that clings where tooth meets gum — the exact spot a horizontal scrub never reaches, and usually just pushes into the gums, irritating them. What works is a 45-degree angle: tilt the brush toward the gums so the bristles slip gently under the gum margin, then short, gentle jiggling strokes, tooth by tooth.",
        },
        {
          type: "p",
          text: "Pressing hard is the second classic mistake: bristles bend away from the surface, and gums slowly recede, exposing sensitive roots. The rule: the pressure of a small coin at most, and always a soft brush.",
        },
        { type: "h2", text: "The two-minute plan" },
        {
          type: "ul",
          items: [
            "Split your mouth into quarters: upper right, upper left, lower right, lower left.",
            "Give each quarter 30 seconds — your phone timer solves this completely.",
            "Outer, inner, and chewing surfaces all get their turn; the inner corners of the canines are the most forgotten spot.",
            "Brush your tongue for the last 10 seconds; half of breath odor lives there.",
            "Replace your brush every 3 months, or right after any throat illness.",
          ],
        },
        {
          type: "p",
          text: "Expect a difference within two weeks: less bleeding when you brush and a fresher morning breath. And if your gums bleed a little at first, don't stop — correct brushing is the treatment, not the cause.",
        },
        {
          type: "p",
          text: "This article is general education, not a substitute for regular check-ups; your specific situation may need a different plan — always ask your dentist.",
        },
      ],
    },
    published: true,
    isSample: true,
  },
  {
    slug: "bleeding-gums",
    title: {
      ar: "لماذا تنزف لثتك عند التنظيف؟ (ولماذا لا يجب تجاهلها؟)",
      en: "Why Do Your Gums Bleed When You Brush? (and Why You Shouldn't Ignore It)",
    },
    excerpt: {
      ar: "الدم في المغسل ليس «شيئاً طبيعياً» كما يظن كثيرون — إنه أول نداء استغاثة من لثة قابلة للشفاء تماماً إن تعاملت معه مبكراً.",
      en: "Blood in the sink isn't 'just normal' as many assume — it's the first distress call from gums that are completely healable if you act early.",
    },
    category: { ar: "صحة اللثة", en: "Gum health" },
    date: "2026-07-03",
    readingMinutes: 5,
    cover: {
      src: "/images/blog-2.webp",
      alt: {
        ar: "طبيب أسنان يفحص لثة مريض بمرآة فحص",
        en: "A dentist examining a patient's gums with a dental mirror",
      },
    },
    body: {
      ar: [
        {
          type: "p",
          text: "«دم بسيط عند التنظيف، وينقطع بعد يومين إذا استرحت من الفرشاة» — هذه الجملة أسمعها أسبوعياً في العيادة، وهي أخطر ما في الموضوع: النزيف يقل لأن اللثة الملتهبة تهدأ مؤقتاً عند تركها، بينما يستمر السبب الحقيقي في العمل بصمت.",
        },
        { type: "h2", text: "ما الذي يحدث فعلاً؟" },
        {
          type: "p",
          text: "النزيف في الغالبية الساحقة من الحالات ليس من السن بل من اللثة الملتهبة بالترس الجرثومي المتراكم عند خط اللثة. الجسم يرسل دماً أكثر إلى المنطقة كجزء من التهاب دفاعي، فتتورم الأوعية الدقيقة وتنزف عند أي لمسة. التوقف عن التنظيف يعني هدنة مؤقتة مع تراكم مستمر — والمرحلة التالية اسمها الجيوب وتراجع العظم، وهنا يصبح الطريق أطول بكثير.",
        },
        {
          type: "p",
          text: "الخبر الجيد: في مرحلة الالتهاب البسيط (قبل الجيوب) يستغرق الشفاء أسبوعين إلى ثلاثة من التنظيف الصحيح فقط — دون أدوية في معظم الحالات.",
        },
        { type: "h2", text: "خطة الأسبوعين" },
        {
          type: "ul",
          items: [
            "استمر بالتنظيف مرتين يومياً بالطريقة الصحيحة (زاوية 45 درجة، ضغط خفيف) — النزيف سيقل يوماً بعد يوم.",
            "أدخل الخيط مرة واحدة يومياً؛ هو الوحيد القادر على تنظيف ما بين الأسنان حيث يبدأ نصف الالتهابات.",
            "فرشاة ناعمة جديدة تبدأ العد من جديد — الشعيرات البالية تخدش ولا تنظف.",
            "إن استمر النزيف بعد 14 يوماً من الالتزام، أو رافق رائحة ثابتة أو انحساراً في اللثة، فهذا موعد وليس اجتهاداً.",
          ],
        },
        {
          type: "p",
          text: "حالات تستدعي زيارة أسرع: نزيف تلقائي دون تنظيف، أو مصحوب بأدوية مسيّلة للدم أو سكري غير متحكم به أو حمل — كلها تغيّر الخطة وتحتاج تقييماً مهنياً.",
        },
      ],
      en: [
        {
          type: "p",
          text: "'A little blood when I brush — it stops after two days if I give the brush a rest.' I hear this weekly in the clinic, and it's the most dangerous part: the bleeding eases because irritated gums calm down when left alone, while the real cause keeps working silently.",
        },
        { type: "h2", text: "What's actually happening?" },
        {
          type: "p",
          text: "In the vast majority of cases the blood comes not from the teeth but from gums inflamed by plaque accumulated at the gumline. The body sends extra blood to the area as part of a defensive inflammation, so the tiny vessels swell and bleed at the slightest touch. Stopping brushing buys a temporary truce while accumulation continues — and the next stage is called pockets and bone loss, a much longer road.",
        },
        {
          type: "p",
          text: "The good news: at the simple gingivitis stage (before pockets), healing takes two to three weeks of correct brushing alone — no medication in most cases.",
        },
        { type: "h2", text: "The two-week plan" },
        {
          type: "ul",
          items: [
            "Keep brushing twice daily with the correct technique (45-degree angle, light pressure) — the bleeding will ease day by day.",
            "Add floss once a day; it's the only tool that cleans between teeth, where half of all inflammation begins.",
            "A new soft brush resets the clock — worn bristles scratch instead of clean.",
            "If bleeding persists after 14 consistent days, or comes with persistent odor or gum recession, that's an appointment, not more effort.",
          ],
        },
        {
          type: "p",
          text: "Cases that warrant a sooner visit: spontaneous bleeding without brushing, or bleeding alongside blood thinners, uncontrolled diabetes, or pregnancy — all of these change the plan and need professional assessment.",
        },
      ],
    },
    published: true,
    isSample: true,
  },
  {
    slug: "tooth-sensitivity",
    title: {
      ar: "حساسية الأسنان: الأسباب السبعة والحلول التي تعمل فعلاً",
      en: "Tooth Sensitivity: Seven Causes and What Actually Helps",
    },
    excerpt: {
      ar: "شربت ماءً بارداً فتئزّ؟ الحساسية رسالة من السن — افهم لغتها قبل أن تشتري المبيّض التالي.",
      en: "Wincing at a cold drink? Sensitivity is your tooth's message — learn its language before buying the next whitening kit.",
    },
    category: { ar: "نصائح", en: "Tips" },
    date: "2026-06-18",
    readingMinutes: 6,
    cover: {
      src: "/images/blog-3.webp",
      alt: {
        ar: "كوب ماء بارد بجانب قطع ثلج",
        en: "A cold glass of water beside ice cubes",
      },
    },
    body: {
      ar: [
        {
          type: "p",
          text: "الحساسية ليست مرضاً بذاتها بل عرضاً: أنبوبات مجهرية داخل المينا المكشوفة تنقل البرد والحامض مباشرة إلى عصب السن. معرفة السبب هي نصف العلاج — وإليك الأسباب السبعة التي أراها مرتبة بالشيوع.",
        },
        {
          type: "ul",
          items: [
            "تنظيف قاسٍ وفرشاة خشنة يتركان اللثة منحسرة عن الجذر الحساس.",
            "ترس حمضي من المشروبات الغازية والحامضية والارتجاع المريئي يذيب المينا ببطء.",
            "صرّ الأسنان الليلي يطحن طبقة المينا على الأسطح الطاحنة.",
            "تسوس أو حشوة مكسورة — الحساسية المركزة في سن واحد تحديداً.",
            "فوراً بعد تنظيف مهني أو تبييض: مؤقتة وطبيعية وتنتهي خلال أيام.",
            "لثة منحسرة عمراً أو بعد علاج لثة، فتنكشف جذور بلا مينا أصلاً.",
            "حساسية مستمرة بعد علاج جذور حديث تستدعي مراجعة الطبيب.",
          ],
        },
        { type: "h2", text: "ما الذي يعمل فعلاً؟" },
        {
          type: "p",
          text: "معجون الحساسية (مركبات البوتاسيوم والفلورايد القوي) ليس خرافة — لكنه يحتاج أسبوعين إلى أربعة من الاستخدام المنتظم مرتين يومياً حتى يغلق الأنبوبات، ويفقد أثره عند التوقف. مرّر المعجون بإصبعك على المواضع الحساسة قبل النوم واتركه دون غسل ليلة كاملة؛ هذه الحيلة تضاعف الأثر.",
        },
        {
          type: "p",
          text: "المينا لا تُشترى من الرف: اشرب المشروبات الحامضية بماصة، وانتظر 30 دقيقة قبل التنظيف بعد أي مشروب حمضي (المينا تليّن مؤقتاً والفرشاة المبكرة تجرفها)، وغالباً ما يكشف النقاش مع طبيبك سبباً بسيطاً — ضغط الفرشاة مثلاً — يوفر عليك شهوراً من المعجون.",
        },
        {
          type: "p",
          text: "علامة تحذير: ألم يوقظك ليلاً أو يستمر بعد إزالة المؤثر — هذا ليس تعريفاً للحساسية، بل غالباً لبٌّ يحتاج تقييماً فورياً.",
        },
      ],
      en: [
        {
          type: "p",
          text: "Sensitivity isn't a disease of its own but a symptom: microscopic tubules in exposed dentin transmit cold and acid straight to the tooth's nerve. Knowing the cause is half the cure — here are the seven causes I see, ordered by frequency.",
        },
        {
          type: "ul",
          items: [
            "Aggressive brushing and hard brushes, leaving gums receded over sensitive root surfaces.",
            "Acid wear from sodas, acidic drinks, and reflux, slowly dissolving enamel.",
            "Nighttime grinding, wearing enamel off the chewing surfaces.",
            "Caries or a fractured filling — sensitivity concentrated in one specific tooth.",
            "Right after professional cleaning or whitening: temporary, normal, and gone within days.",
            "Gums receded with age or after gum treatment, exposing dentin that never had enamel.",
            "Persistent sensitivity after a recent root canal — worth having your dentist re-examine.",
          ],
        },
        { type: "h2", text: "What actually works?" },
        {
          type: "p",
          text: "Sensitivity toothpaste (potassium and stannous fluoride compounds) isn't a gimmick — but it needs two to four weeks of consistent twice-daily use to plug the tubules, and the effect fades once you stop. Rub a fingertip of it onto the sensitive spots before bed and leave it unwashed overnight; this trick multiplies the effect.",
        },
        {
          type: "p",
          text: "Enamel isn't bought off a shelf: drink acidic beverages through a straw, wait 30 minutes before brushing after any acidic drink (enamel is temporarily softened and early brushing sweeps it away), and the conversation with your dentist often reveals a simple cause — brush pressure, for instance — that spares you months of paste.",
        },
        {
          type: "p",
          text: "A warning sign: pain that wakes you at night or lingers after the trigger is gone — that's not the definition of sensitivity, it's most often a pulp that needs urgent assessment.",
        },
      ],
    },
    published: true,
    isSample: true,
  },
  {
    slug: "flossing",
    title: {
      ar: "خيط الأسنان: الخطوة التي يتجاهلها معظمنا",
      en: "Flossing: The Step Most of Us Skip",
    },
    excerpt: {
      ar: "الفرشاة تنظف 3 من 5 أسطح في فمك — الخيط هو الوحيد الذي يصل إلى السطحين الباقيين. لماذا نتجنبه؟ وكيف نستطيع جعله عادة؟",
      en: "Your brush cleans 3 of the 5 surfaces in your mouth — floss is the only thing that reaches the remaining two. Why do we skip it, and how do we make it stick?",
    },
    category: { ar: "العناية اليومية", en: "Daily care" },
    date: "2026-05-22",
    readingMinutes: 3,
    cover: {
      src: "/images/blog-4.webp",
      alt: {
        ar: "خيط أسنان ملتف حول إصبعين",
        en: "Dental floss wrapped around two fingers",
      },
    },
    body: {
      ar: [
        {
          type: "p",
          text: "إذا كان فمك شقةً من خمس غرف، فالفرشاة عامل نظافة يدخل ثلاثاً منها فقط. السطحان الباقيان — ما بين كل سنّين متجاورين — هما حيّ الترس الراقي: لا هواء، لا لعاب، ولا شعيرات فرشاة. الخيط هو الزائر الوحيد المسموح له بالدخول.",
        },
        { type: "h2", text: "لماذا نتجنله إذاً؟" },
        {
          type: "ul",
          items: [
            "أول تجربة كانت مؤلمة (لثة ملتهبة تنزف) فحكمنا على العادة من أول يوم.",
            "لا أحد أرانا كيف: الخيط مهارة يدوية تحتاج تمريناً كأي مهارة.",
            "نربطه بمناسبات خاصة «قبل موعد الطبيب» بدل ربطه بالماء والفرشاة.",
          ],
        },
        {
          type: "p",
          text: "القاعدة العملية: ابدأ بثلاثة أسنان فقط كل ليلة — الأنياب السفلية مثلاً — لمدة أسبوع. الألم والنزيف يتراجعان خلال أيام لأن الالتهاب نفسه يبدأ بالانسحاب. ثم وسّع تدريجياً حتى تشمل الجولة كاملة. ربطه بعادة قائمة (بعد فرشاة المساء مباشرة) يجعله تلقائياً.",
        },
        {
          type: "p",
          text: "خيطك يخبرك عن صحة فمك أيضاً: رائحة على الخيط بعد تنظيف منطقة معينة تعني أن الترس ما يزال يعيش هناك — مؤشر تقدمك الخاص.",
        },
      ],
      en: [
        {
          type: "p",
          text: "If your mouth were a five-room apartment, the brush would be a cleaner who only enters three rooms. The remaining two surfaces — between every pair of adjacent teeth — are plaque's luxury district: no airflow, no saliva wash, no bristles. Floss is the only visitor allowed in.",
        },
        { type: "h2", text: "So why do we skip it?" },
        {
          type: "ul",
          items: [
            "The first experience hurt (inflamed gums bleeding), so we judged the habit by day one.",
            "Nobody showed us how: flossing is a manual skill that needs practice like any skill.",
            "We tie it to special occasions ('before the dentist appointment') instead of pairing it with water and brush.",
          ],
        },
        {
          type: "p",
          text: "The practical rule: start with just three teeth each night — the lower canines, say — for one week. Pain and bleeding recede within days because the inflammation itself starts withdrawing. Then expand gradually until the full tour. Pairing it with an existing habit (right after the evening brush) makes it automatic.",
        },
        {
          type: "p",
          text: "Your floss also reports on your oral health: an odor on the floss after cleaning a specific area means plaque still lives there — your own progress dashboard.",
        },
      ],
    },
    published: true,
    isSample: true,
  },
];
