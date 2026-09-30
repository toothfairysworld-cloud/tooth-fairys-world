import { db } from "@/lib/db";
import type {
  ArticleBlock,
  CaseCategory,
  CaseEntry,
  CaseStat,
  Certificate,
  FaqItem,
  Locale,
  Localized,
  ResearchItem,
  ResourceItem,
  Testimonial,
  TimelineEntry,
  VolunteeringItem,
  BlogPost,
} from "@/content/types";

/**
 * Data access layer — DB-backed replacements for the Phase-1 static
 * content getters. Returns the *exact* typed shapes the components
 * already consume, so the data-source swap is invisible to the UI.
 *
 * Every getter reads only PUBLISHED rows (the admin sees drafts).
 */

export interface SectionRow {
  id: string;
  enabled: boolean;
  title: Localized<string>;
  subtitle: Localized<string>;
  image: string;
}

export interface ProfileData {
  isSample: boolean;
  name: Localized<string>;
  initials: string;
  role: Localized<string>;
  university: Localized<string>;
  valueStatement: Localized<string>;
  portrait: { src: string; alt: Localized<string> };
  aboutImages: [string, string, string];
  bio: Localized<string>[];
  philosophy: Localized<string>;
  interests: Localized<string>[];
  socials: { instagram: string };
  cvPdf: string | null;
  graduationDate: string;
}

// ---------------------------------------------------------------------------
// helpers

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Rebuild `Localized<T>[]` from two per-locale JSON arrays. */
function zipLocalized(
  arList: string[],
  enList: string[],
): Localized<string>[] {
  const length = Math.max(arList.length, enList.length);
  return Array.from({ length }, (_, i) => ({
    ar: arList[i] ?? enList[i] ?? "",
    en: enList[i] ?? arList[i] ?? "",
  }));
}

interface StatRow {
  labelAr: string;
  labelEn: string;
  value: number;
  suffixAr?: string;
  suffixEn?: string;
}

function mapStats(rows: StatRow[]): CaseStat[] {
  return rows
    .filter((r) => r.labelAr || r.labelEn)
    .map((r) => ({
      label: { ar: r.labelAr, en: r.labelEn },
      value: r.value,
      suffix:
        r.suffixAr || r.suffixEn
          ? { ar: r.suffixAr ?? "", en: r.suffixEn ?? "" }
          : undefined,
    }));
}

// ---------------------------------------------------------------------------
// profile / sections

export async function getProfile(): Promise<ProfileData | null> {
  const row = await db.profile.findUnique({ where: { id: "main" } });
  if (!row) return null;

  return {
    isSample: row.isSample,
    name: { ar: row.nameAr, en: row.nameEn },
    initials: row.initials,
    role: { ar: row.roleAr, en: row.roleEn },
    university: { ar: row.universityAr, en: row.universityEn },
    valueStatement: {
      ar: row.valueStatementAr,
      en: row.valueStatementEn,
    },
    portrait: {
      src: row.portraitSrc,
      alt: { ar: row.portraitAltAr, en: row.portraitAltEn },
    },
    aboutImages: [
      (row as unknown as { aboutImage1?: string }).aboutImage1 || "/images/about-1.webp",
      (row as unknown as { aboutImage2?: string }).aboutImage2 || "/images/about-2.webp",
      (row as unknown as { aboutImage3?: string }).aboutImage3 || "/images/about-3.webp",
    ],
    bio: zipLocalized(
      parseJson<string[]>(row.bioAr, []),
      parseJson<string[]>(row.bioEn, []),
    ),
    philosophy: { ar: row.philosophyAr, en: row.philosophyEn },
    interests: zipLocalized(
      parseJson<string[]>(row.interestsAr, []),
      parseJson<string[]>(row.interestsEn, []),
    ),
    socials: {
      instagram: row.instagram ?? "",
    },
    cvPdf: row.cvPdf,
    graduationDate: row.graduationDate,
  };
}

export async function getSections(): Promise<SectionRow[]> {
  const rows = await db.sectionConfig.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    enabled: row.enabled,
    title: { ar: row.titleAr, en: row.titleEn },
    subtitle: { ar: row.subtitleAr, en: row.subtitleEn },
    image: (row as unknown as { image?: string }).image || "",
  }));
}

// ---------------------------------------------------------------------------
// timeline

export async function getTimeline(): Promise<TimelineEntry[]> {
  const rows = await db.timelineEntry.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    year: row.year,
    title: { ar: row.titleAr, en: row.titleEn },
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    skills: zipLocalized(
      parseJson<string[]>(row.skillsAr, []),
      parseJson<string[]>(row.skillsEn, []),
    ),
    stats: mapStats(parseJson<StatRow[]>(row.stats, [])),
    isSample: true as const,
  }));
}

// ---------------------------------------------------------------------------
// cases

interface StoryRow {
  complaintAr?: string;
  complaintEn?: string;
  diagnosisAr?: string;
  diagnosisEn?: string;
  planAr?: string;
  planEn?: string;
  materialsAr?: string;
  materialsEn?: string;
  learnedAr?: string;
  learnedEn?: string;
}

export async function getPublishedCases(): Promise<CaseEntry[]> {
  const rows = await db.caseStudy.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(mapCase);
}

export async function getAllCases(): Promise<CaseEntry[]> {
  const rows = await db.caseStudy.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(mapCase);
}

export async function getCase(slug: string): Promise<CaseEntry | null> {
  const row = await db.caseStudy.findFirst({
    where: { slug, published: true },
  });
  return row ? mapCase(row) : null;
}

type CaseRow = Awaited<ReturnType<typeof db.caseStudy.findFirst>>;

function mapCase(row: NonNullable<CaseRow>): CaseEntry {
  const story = parseJson<Record<string, string>>(row.story, {});
  const part = (key: string): Localized<string> => ({
    ar: story[`${key}Ar`] ?? "",
    en: story[`${key}En`] ?? "",
  });
  return {
    slug: row.slug,
    category: row.category as CaseCategory,
    title: { ar: row.titleAr, en: row.titleEn },
    summary: { ar: row.summaryAr, en: row.summaryEn },
    period: row.period,
    featured: row.featured,
    images: {
      before: row.imageBefore,
      after: row.imageAfter,
      alt: { ar: row.imageAltAr, en: row.imageAltEn },
    },
    story: {
      complaint: part("complaint"),
      diagnosis: part("diagnosis"),
      plan: part("plan"),
      materials: part("materials"),
      learned: part("learned"),
    },
    published: row.published,
    isSample: true as const,
  };
}

// ---------------------------------------------------------------------------
// certificates / research / volunteering

export async function getCertificates(): Promise<Certificate[]> {
  const rows = await db.certificate.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    title: { ar: row.titleAr, en: row.titleEn },
    issuer: { ar: row.issuerAr, en: row.issuerEn },
    date: row.date,
    pdf: row.pdf ?? undefined,
    isSample: true as const,
  }));
}

export async function getResearch(): Promise<ResearchItem[]> {
  const rows = await db.researchItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    title: { ar: row.titleAr, en: row.titleEn },
    abstract: { ar: row.abstractAr, en: row.abstractEn },
    link: row.link ?? undefined,
    year: row.year,
    isSample: true as const,
  }));
}

export async function getVolunteering(): Promise<VolunteeringItem[]> {
  const rows = await db.volunteeringItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    title: { ar: row.titleAr, en: row.titleEn },
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    image: {
      src: row.imageSrc,
      alt: { ar: row.imageAltAr, en: row.imageAltEn },
    },
    impact: mapStats(parseJson<StatRow[]>(row.impact, [])),
    isSample: true as const,
  }));
}

// ---------------------------------------------------------------------------
// blog

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const rows = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { date: "desc" }],
  });
  return rows.map(mapPost);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const row = await db.blogPost.findFirst({ where: { slug, published: true } });
  return row ? mapPost(row) : null;
}

export async function getRelatedPosts(
  slug: string,
  category: Localized<string>,
  count = 2,
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts
    .filter((p) => p.slug !== slug && p.category.ar === category.ar)
    .slice(0, count);
}

type PostRow = Awaited<ReturnType<typeof db.blogPost.findFirst>>;

function mapPost(row: NonNullable<PostRow>): BlogPost {
  return {
    slug: row.slug,
    title: { ar: row.titleAr, en: row.titleEn },
    excerpt: { ar: row.excerptAr, en: row.excerptEn },
    category: parseJson<Localized<string>>(row.category, { ar: "", en: "" }),
    date: row.date,
    readingMinutes: row.readingMinutes,
    cover: {
      src: row.coverSrc,
      alt: { ar: row.coverAltAr, en: row.coverAltEn },
    },
    body: {
      ar: parseJson<ArticleBlock[]>(row.bodyAr, []),
      en: parseJson<ArticleBlock[]>(row.bodyEn, []),
    },
    published: row.published,
    isSample: true as const,
  };
}

// ---------------------------------------------------------------------------
// faq / resources / testimonials

export async function getFaq(): Promise<FaqItem[]> {
  const rows = await db.faqItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    q: { ar: row.qAr, en: row.qEn },
    a: { ar: row.aAr, en: row.aEn },
    isSample: true as const,
  }));
}

export async function getResources(): Promise<ResourceItem[]> {
  const rows = await db.resourceItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    title: { ar: row.titleAr, en: row.titleEn },
    description: { ar: row.descriptionAr, en: row.descriptionEn },
    file: row.file,
    downloads: row.downloads,
    kind: row.kind as ResourceItem["kind"],
    isSample: true as const,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    quote: { ar: row.quoteAr, en: row.quoteEn },
    name: row.name,
    role: { ar: row.roleAr, en: row.roleEn },
    initials: row.initials,
    isSample: true as const,
  }));
}

// ---------------------------------------------------------------------------
// pick re-export so pages can grab locale variants

export { pick } from "@/content/types";
export type { Locale } from "@/content/types";
