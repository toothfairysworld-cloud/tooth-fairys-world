import Image from "next/image";
import {
  Award,
  BookOpen,
  CalendarCheck,
  FileText,
  HeartHandshake,
  HelpCircle,
  Mail,
  Quote,
  Route,
  Smile,
  Sparkles,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/common/reveal";
import { STAGGER } from "@/lib/motion";
import type { Locale } from "@/content/types";
import type { SectionRow } from "@/lib/data";

interface SectionHubProps {
  locale: Locale;
  sections?: SectionRow[];
  timelineCount: number;
  casesCount: number;
  certificatesCount: number;
  researchCount: number;
  volunteeringCount: number;
  postsCount: number;
  faqCount: number;
  resourcesCount: number;
  testimonialsCount: number;
}

export function SectionHub({
  locale,
  sections,
  timelineCount,
  casesCount,
  certificatesCount,
  researchCount,
  volunteeringCount,
  postsCount,
  faqCount,
  resourcesCount,
  testimonialsCount,
}: SectionHubProps) {
  const isAr = locale === "ar";

  const cards = [
    {
      id: "about",
      href: "/about",
      image: "/images/about-2.webp",
      imageAlt: isAr ? "عيادة أسنان حديثة وأجواء هادئة" : "Modern dental clinic atmosphere",
      icon: UserCheck,
      badge: isAr ? "الخلفية والأهداف" : "Background & Philosophy",
      title: isAr ? "عن عالم جنية الأسنان" : "About Tooth Fairy's World",
      description: isAr
        ? "فلسفة العمل، الرؤية السريرية، وقصة الشغف بطب الأسنان التجميلي وترميمات الأسنان الدقيقة."
        : "Clinical philosophy, academic vision, and dedication to gentle, precision restorative dentistry.",
      stat: isAr ? "دفعة 2027" : "Class of 2027",
      cta: isAr ? "تعرف على القصة الكاملة" : "Read Full Story",
    },
    {
      id: "experience",
      href: "/experience",
      image: "/images/hub-experience.webp",
      imageAlt: isAr ? "عيادة أسنان متطورة ومعدات التدريب السريري" : "Advanced dental clinic and clinical training operatory",
      icon: Route,
      badge: isAr ? "المسار السريري" : "Clinical Path",
      title: isAr ? "الخبرة والتدريب السريري" : "Clinical Experience & Timeline",
      description: isAr
        ? "سجل المراحل التدريبية وساعات التدريب في المستشفيات الجامعية عبر مختلف التخصصات السريرية."
        : "Documented rotations and university hospital clinical training phases across all dental disciplines.",
      stat: isAr ? `${timelineCount} محطات تدريبية` : `${timelineCount} Milestones`,
      cta: isAr ? "استعرض الخط الزمني" : "View Experience",
    },
    {
      id: "cases",
      href: "/cases",
      image: "/images/case-6-after.webp",
      imageAlt: isAr ? "ابتسامة طبيعية متألقة بعد العلاج الترميمي" : "Luminous smile restoration",
      icon: Smile,
      badge: isAr ? "حالات موثقة" : "Documented Cases",
      title: isAr ? "دراسات الحالة السريرية" : "Clinical Case Studies",
      description: isAr
        ? "حالات ترميمية وتجميلية موثقة بالصور والمقارنة التفاعلية قبل وبعد بموافقة المرضى."
        : "Restorative and cosmetic clinical cases documented with before-and-after sliders under patient consent.",
      stat: isAr ? `${casesCount} دراسات حالة` : `${casesCount} Case Studies`,
      cta: isAr ? "استكشف دراسات الحالة" : "Explore Cases",
    },
    {
      id: "certificates",
      href: "/certificates",
      image: "/images/hub-certificates.webp",
      imageAlt: isAr ? "مكبرات طب الأسنان الجراحية والشهادات الأكاديمية" : "Dental surgical loupes with diploma scroll and gold seal",
      icon: Award,
      badge: isAr ? "الشهادات والاعتمادات" : "Credentials",
      title: isAr ? "الشهادات والدورات المتقدمة" : "Certificates & Training",
      description: isAr
        ? "شهادات تدريبية معتمدة وورش عمل تطبيقية في أحدث تقنيات طب الأسنان والمواد الترميمية."
        : "Certified hands-on training, workshops, and symposiums in modern restorative materials and techniques.",
      stat: isAr ? `${certificatesCount} شهادات موثقة` : `${certificatesCount} Certificates`,
      cta: isAr ? "عرض الشهادات" : "View Certificates",
    },
    {
      id: "research",
      href: "/research",
      image: "/images/vol-3.webp",
      imageAlt: isAr ? "أبحاث علمية ودراسات أكاديمية مشتركة" : "Academic dental research and collaboration",
      icon: FileText,
      badge: isAr ? "الإنتاج العلمي" : "Academic Research",
      title: isAr ? "البحوث والمشاريع الأكاديمية" : "Research & Publications",
      description: isAr
        ? "أبحاث سريرية ودراسات إحصائية منشورة أو قيد الإعداد في مجالات طب الفم ومواد الترميم."
        : "Scientific research papers, epidemiological studies, and literature reviews in oral healthcare.",
      stat: isAr ? `${researchCount} أوراق بحثية` : `${researchCount} Publications`,
      cta: isAr ? "تصفح الأبحاث" : "Explore Research",
    },
    {
      id: "volunteering",
      href: "/volunteering",
      image: "/images/vol-1.webp",
      imageAlt: isAr ? "حملات التوعية المجتمعية بصحة الفم" : "Oral health community volunteering campaign",
      icon: HeartHandshake,
      badge: isAr ? "المسؤولية المجتمعية" : "Community Outreach",
      title: isAr ? "المبادرات التطوعية" : "Volunteering & Community",
      description: isAr
        ? "حملات التوعية الصحية الميدانية والفحوصات الوقائية في المدارس والمراكز المجتمعية."
        : "Community screenings, school awareness campaigns, and preventative dental health outreach initiatives.",
      stat: isAr ? `${volunteeringCount} مبادرات ميدانية` : `${volunteeringCount} Initiatives`,
      cta: isAr ? "عرض الأنشطة المجتمعية" : "View Volunteering",
    },
    {
      id: "blog",
      href: "/blog",
      image: "/images/blog-1.webp",
      imageAlt: isAr ? "أدوات العناية بصحة الفم والأسنان" : "Oral hygiene tools and health guide",
      icon: BookOpen,
      badge: isAr ? "التوعية والمعرفة" : "Oral Health Guides",
      title: isAr ? "المقالات التوعوية والمدونة" : "Articles & Blog",
      description: isAr
        ? "مقالات مبسطة وموثوقة علمياً لمساعدة المرضى والمهتمين على العناية الصحيحة بالأسنان واللثة."
        : "Evidence-based, patient-friendly articles explaining modern dental care, hygiene, and treatments.",
      stat: isAr ? `${postsCount} مقالات توعوية` : `${postsCount} Published Articles`,
      cta: isAr ? "اقرأ المقالات" : "Browse Blog",
    },
    {
      id: "ask",
      href: "/faq",
      image: "/images/about-1.webp",
      imageAlt: isAr ? "استشارة طبية ومطابقة درجات لون الأسنان" : "Dental consultation and shade matching",
      icon: HelpCircle,
      badge: isAr ? "إجابات شائعة" : "Q&A Knowledge Base",
      title: isAr ? "الأسئلة الشائعة والإرشادات" : "Frequently Asked Questions",
      description: isAr
        ? "إجابات واضحة عن التساؤلات الشائعة حول صحة الفم والإرشادات الأكاديمية لطلاب طب الأسنان."
        : "Clear answers to common patient questions, treatment advice, and student study guidance.",
      stat: isAr ? `${faqCount} أسئلة وإجابات` : `${faqCount} Answers`,
      cta: isAr ? "عرض جميع الأسئلة" : "Read FAQs",
    },
    {
      id: "resources",
      href: "/resources",
      image: "/images/about-3.webp",
      imageAlt: isAr ? "أدوات الفحص والترميم الدقيقة ومصادر التعلم" : "Precision clinical dental instruments and study notes",
      icon: CalendarCheck,
      badge: isAr ? "ملفات ومصادر" : "Downloads & Tools",
      title: isAr ? "المصادر الأكاديمية والتحميلات" : "Study Resources & Downloads",
      description: isAr
        ? "ملخصات دراسية، قواميس مصطلحات سريرية، وقوائم مراجعة قابلة للتحميل مجاناً للطلاب."
        : "Clinical checklists, terminology glossaries, and study templates available for free download.",
      stat: isAr ? `${resourcesCount} مصادر تعليمية` : `${resourcesCount} Resources`,
      cta: isAr ? "تحميل المصادر" : "Download Files",
    },
    {
      id: "testimonials",
      href: "/testimonials",
      image: "/images/vol-2.webp",
      imageAlt: isAr ? "جلسة فحص وتوجيه سريري في العيادة" : "Clinical supervision and mentor guidance in clinic",
      icon: Quote,
      badge: isAr ? "آراء المشرفين" : "Recommendations",
      title: isAr ? "شهادات المشرفين والزملاء" : "Testimonials & Feedback",
      description: isAr
        ? "انطباعات وشهادات المشرفين الأكاديميين وأطباء العيادات التعليمية حول الأداء السريري."
        : "Observations and feedback from clinical supervisors, professors, and peers on academic performance.",
      stat: isAr ? `${testimonialsCount} توصيات موثقة` : `${testimonialsCount} Testimonials`,
      cta: isAr ? "قراءة التوصيات" : "Read Testimonials",
    },
    {
      id: "contact",
      href: "/contact",
      image: "/images/hero-portrait.webp",
      imageAlt: isAr ? "طالبة طب أسنان بابتسامة هادئة ومعطف أبيض" : "Dental student ready for direct academic inquiries",
      icon: Mail,
      badge: isAr ? "تواصل مباشر" : "Get In Touch",
      title: isAr ? "التواصل والفرص الأكاديمية" : "Contact & Direct Inquiries",
      description: isAr
        ? "للاستفسارات الأكاديمية، دعوات الحملات التوعوية، أو فرص التدريب المتقدم."
        : "Send an inquiry, invite for awareness campaigns, or discuss academic training opportunities.",
      stat: isAr ? "رد خلال 48 ساعة" : "Replies in 48h",
      cta: isAr ? "إرسال رسالة مباشرة" : "Contact Now",
    },
  ];

  // Filter and sort based on dashboard SectionConfig if provided
  const visibleCards = cards.filter((card) => {
    const cfg = sections?.find((s) => s.id === card.id);
    return cfg ? cfg.enabled : true;
  });

  if (sections && sections.length > 0) {
    const orderMap = new Map(sections.map((s, idx) => [s.id, idx]));
    visibleCards.sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? 99;
      const orderB = orderMap.get(b.id) ?? 99;
      return orderA - orderB;
    });
  }

  return (
    <section className="section-pad bg-surface-1/40 border-t border-border/50">
      <div className="container-site">
        {/* Hub Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-caption font-semibold text-primary mb-4">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {isAr ? "دليل أقسام المحفظة الأكاديمية" : "Tooth Fairy's World Hub"}
          </span>
          <h2 className="text-h1 font-heading text-foreground tracking-tight">
            {isAr ? "استكشف جميع أقسام الموقع" : "Explore Every Section"}
          </h2>
          <p className="mt-4 text-body text-muted-foreground leading-relaxed">
            {isAr
              ? "كل قسم مخصص في صفحته المستقلة ليمنحك تجربة متعمقة وكاملة، مع صور تعبيرية مميزة ومعلومات شاملة عن كل تخصص."
              : "Each section lives on its own dedicated page with curated visual imagery, in-depth documentation, and interactive case records."}
          </p>
        </div>

        {/* Section Cards Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card, i) => {
            const Icon = card.icon;
            const cfg = sections?.find((s) => s.id === card.id);
            const displayTitle =
              (cfg?.title && (isAr ? cfg.title.ar : cfg.title.en)) || card.title;
            const displayDesc =
              (cfg?.subtitle && (isAr ? cfg.subtitle.ar : cfg.subtitle.en)) || card.description;
            const cardImage =
              cfg?.image && cfg.image.trim() !== "" ? cfg.image : card.image;

            return (
              <Reveal key={card.href} delay={STAGGER * (i % 3)}>
                <Link
                  href={card.href}
                  className="group relative flex min-h-[460px] sm:min-h-[480px] flex-col justify-between overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-glow hover:border-[#e7c08a]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {/* Clean Background Picture with Multi-Stop Scrim */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={cardImage}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    {/* Deep editorial scrim: transparent at top to showcase picture, rich deep gradient at bottom for crystal-clear text readability */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 transition-opacity duration-500 group-hover:from-black group-hover:via-black/70"
                    />
                  </div>

                  {/* Top Badges Floating Upon the Picture */}
                  <div className="relative z-10 flex items-center justify-between p-5 sm:p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-[#f2e8ea] shadow-md backdrop-blur-md transition-all duration-300 group-hover:border-[#e7c08a]/60 group-hover:bg-[#9c4a5c] group-hover:text-white group-hover:scale-105">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/45 px-3.5 py-1 text-xs font-semibold text-[#f2e8ea] shadow-sm backdrop-blur-md">
                      {card.stat}
                    </span>
                  </div>

                  {/* Clean Writing and Texts Directly Upon the Picture — No Enclosing White Box */}
                  <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#e7c08a] drop-shadow-sm">
                      {card.badge}
                    </span>

                    <h3 className="mt-2 text-xl sm:text-2xl font-heading font-bold text-white transition-colors duration-300 group-hover:text-[#e7c08a] drop-shadow-sm">
                      {displayTitle}
                    </h3>

                    <p className="mt-2.5 text-sm text-[#f2e8ea]/85 leading-relaxed line-clamp-3 font-normal drop-shadow-sm">
                      {displayDesc}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-semibold text-[#e7c08a] transition-colors group-hover:text-white">
                      <span className="tracking-wide">{card.cta}</span>
                      <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 group-hover:border-[#e7c08a] group-hover:bg-[#e7c08a] group-hover:text-[#191114] group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
                        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
