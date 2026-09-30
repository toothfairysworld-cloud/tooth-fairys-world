import type { AppLocale } from "@/i18n/routing";

/**
 * Content layer types.
 *
 * Every localized field mirrors the future Supabase column model:
 * a row has `title_ar` / `title_en` etc. — represented here as
 * `Localized<T>` so Phase 2 becomes a data-source swap, not a rewrite.
 */

export type Locale = AppLocale;
export type Localized<T> = { ar: T; en: T };

/** Pick the locale variant of a localized field. */
export function pick<T>(field: Localized<T>, locale: Locale): T {
  return field[locale];
}

export type CaseCategory = "fillings" | "endo" | "gum" | "prosth";

export interface CategoryLabel {
  id: CaseCategory;
  label: Localized<string>;
}

export interface CaseStat {
  label: Localized<string>;
  value: number;
  suffix?: Localized<string>;
}

/** Clinical case study — publishing gated by consent checkbox (Phase 2). */
export interface CaseEntry {
  slug: string;
  category: CaseCategory;
  title: Localized<string>;
  summary: Localized<string>;
  period: string; // ISO month, displayed via locale formatter
  featured?: boolean;
  images: {
    before: string;
    after: string;
    alt: Localized<string>;
  };
  story: {
    complaint: Localized<string>;
    diagnosis: Localized<string>;
    plan: Localized<string>;
    materials: Localized<string>;
    learned: Localized<string>;
  };
  /** Schema parity with Phase 2 */
  published: boolean;
  isSample: true;
}

export interface TimelineEntry {
  year: string;
  title: Localized<string>;
  description: Localized<string>;
  skills: Localized<string>[];
  stats: CaseStat[];
}

export interface Certificate {
  id: string;
  title: Localized<string>;
  issuer: Localized<string>;
  date: string; // ISO
  pdf?: string;
  isSample: true;
}

export interface ResearchItem {
  id: string;
  title: Localized<string>;
  abstract: Localized<string>;
  link?: string;
  year: string;
  isSample: true;
}

export interface VolunteeringItem {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  image: { src: string; alt: Localized<string> };
  impact: CaseStat[];
  isSample: true;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  category: Localized<string>;
  date: string; // ISO
  readingMinutes: number;
  cover: { src: string; alt: Localized<string> };
  body: Localized<ArticleBlock[]>;
  published: boolean;
  isSample: true;
}

export interface FaqItem {
  q: Localized<string>;
  a: Localized<string>;
}

export interface ResourceItem {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  file: string;
  downloads: number;
  kind: "notes" | "checklist" | "plan" | "glossary";
  isSample: true;
}

export interface Testimonial {
  id: string;
  quote: Localized<string>;
  name: string;
  role: Localized<string>;
  initials: string;
  isSample: true;
}
