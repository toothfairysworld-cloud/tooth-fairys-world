import { cases, caseCategories, categoryLabel } from "./cases";
import { timeline } from "./timeline";
import { certificates, research, volunteering } from "./achievements";
import { posts } from "./blog";
import { faq, resources, testimonials } from "./community";
import { profile } from "./profile";
import { sectionOrder, sectionHeadings, sectionHeading } from "./sections";

export type { SectionId } from "./sections";

export {
  profile,
  timeline,
  cases,
  caseCategories,
  categoryLabel,
  certificates,
  research,
  volunteering,
  posts,
  faq,
  resources,
  testimonials,
  sectionOrder,
  sectionHeadings,
  sectionHeading,
};

export { pick } from "./types";
export type {
  Localized,
  Locale,
  CaseEntry,
  CaseCategory,
  CaseStat,
  CategoryLabel,
  Certificate,
  ResearchItem,
  VolunteeringItem,
  BlogPost,
  ArticleBlock,
  FaqItem,
  ResourceItem,
  Testimonial,
  TimelineEntry,
} from "./types";

/** Legacy getters — kept for reference; the live site reads src/lib/data.ts. */
export const getPublishedPosts = () => posts.filter((p) => p.published);
export const getPost = (slug: string) =>
  posts.find((p) => p.slug === slug && p.published);
export const getPublishedCases = () => cases.filter((c) => c.published);
export const getCase = (slug: string) =>
  cases.find((c) => c.slug === slug && c.published);
export const getRelatedPosts = (
  slug: string,
  category: string,
  count = 2,
) =>
  getPublishedPosts()
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.category as { ar: string; en: string }).ar === category,
    )
    .slice(0, count);
