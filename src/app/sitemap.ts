import type { MetadataRoute } from "next";

import { getPublishedCases, getPublishedPosts } from "@/lib/data";
import { site } from "@/lib/site";

/**
 * Locale-aware sitemap with hreflang alternates:
 * ar → /, en → /en, x-default → /
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [cases, posts] = await Promise.all([
    getPublishedCases(),
    getPublishedPosts(),
  ]);

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${site.url}${path}`,
        ar: `${site.url}/ar${path}`,
        "x-default": `${site.url}${path}`,
      },
    },
  });

  return [
    entry("", 1, "weekly"),
    entry("/about", 0.9, "monthly"),
    entry("/experience", 0.9, "monthly"),
    entry("/cases", 0.9, "monthly"),
    entry("/certificates", 0.8, "monthly"),
    entry("/research", 0.8, "monthly"),
    entry("/volunteering", 0.8, "monthly"),
    entry("/blog", 0.9, "weekly"),
    entry("/faq", 0.7, "monthly"),
    entry("/resources", 0.7, "monthly"),
    entry("/testimonials", 0.7, "monthly"),
    entry("/contact", 0.8, "monthly"),
    entry("/credits", 0.2, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    ...cases.map((c) => entry(`/cases/${c.slug}`, 0.7, "monthly")),
    ...posts.map((p) => entry(`/blog/${p.slug}`, 0.8, "monthly")),
  ];
}
