/**
 * Seed the SQLite database from the Phase-1 static content layer.
 * Run: bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

import { profile } from "../src/content/profile";
import { timeline } from "../src/content/timeline";
import { cases } from "../src/content/cases";
import {
  certificates,
  research,
  volunteering,
} from "../src/content/achievements";
import { posts } from "../src/content/blog";
import { faq, resources, testimonials } from "../src/content/community";
import { sectionOrder, sectionHeadings } from "../src/content/sections";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding…");

  // ---- admin user -------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@toothfairysworld.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ToothFairy2027!";
  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      displayName: "Tooth Fairy's World",
    },
  });
  console.log(`  admin: ${adminEmail}`);

  // ---- profile ----------------------------------------------------------
  await db.profile.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      nameAr: profile.name.ar,
      nameEn: profile.name.en,
      initials: profile.initials,
      roleAr: profile.role.ar,
      roleEn: profile.role.en,
      universityAr: profile.university.ar,
      universityEn: profile.university.en,
      valueStatementAr: profile.valueStatement.ar,
      valueStatementEn: profile.valueStatement.en,
      portraitSrc: profile.portrait.src,
      portraitAltAr: profile.portrait.alt.ar,
      portraitAltEn: profile.portrait.alt.en,
      bioAr: JSON.stringify(profile.bio.map((p) => p.ar)),
      bioEn: JSON.stringify(profile.bio.map((p) => p.en)),
      philosophyAr: profile.philosophy.ar,
      philosophyEn: profile.philosophy.en,
      interestsAr: JSON.stringify(profile.interests.map((i) => i.ar)),
      interestsEn: JSON.stringify(profile.interests.map((i) => i.en)),
      instagram: profile.socials.instagram,
      cvPdf: profile.cvPdf,
      graduationDate: profile.graduationDate,
      isSample: true,
    },
  });
  console.log("  profile ✓");

  // ---- sections ---------------------------------------------------------
  await db.sectionConfig.deleteMany();
  await db.sectionConfig.createMany({
    data: sectionOrder.map((section, index) => {
      const heading = sectionHeadings[section.id as keyof typeof sectionHeadings];
      return {
        id: section.id,
        sortOrder: index,
        enabled: section.enabled,
        titleAr: heading?.title.ar ?? "",
        titleEn: heading?.title.en ?? "",
        subtitleAr: heading?.subtitle.ar ?? "",
        subtitleEn: heading?.subtitle.en ?? "",
      };
    }),
  });
  console.log(`  sections: ${sectionOrder.length}`);

  // ---- timeline ---------------------------------------------------------
  await db.timelineEntry.deleteMany();
  await db.timelineEntry.createMany({
    data: timeline.map((entry, index) => ({
      sortOrder: index,
      year: entry.year,
      titleAr: entry.title.ar,
      titleEn: entry.title.en,
      descriptionAr: entry.description.ar,
      descriptionEn: entry.description.en,
      skillsAr: JSON.stringify(entry.skills.map((s) => s.ar)),
      skillsEn: JSON.stringify(entry.skills.map((s) => s.en)),
      stats: JSON.stringify(
        entry.stats.map((s) => ({
          labelAr: s.label.ar,
          labelEn: s.label.en,
          value: s.value,
          suffixAr: s.suffix?.ar ?? "",
          suffixEn: s.suffix?.en ?? "",
        })),
      ),
      published: true,
    })),
  });
  console.log(`  timeline: ${timeline.length}`);

  // ---- cases ------------------------------------------------------------
  await db.caseStudy.deleteMany();
  await db.caseStudy.createMany({
    data: cases.map((c, index) => ({
      slug: c.slug,
      sortOrder: index,
      category: c.category,
      titleAr: c.title.ar,
      titleEn: c.title.en,
      summaryAr: c.summary.ar,
      summaryEn: c.summary.en,
      period: c.period,
      featured: c.featured ?? false,
      imageBefore: c.images.before,
      imageAfter: c.images.after,
      imageAltAr: c.images.alt.ar,
      imageAltEn: c.images.alt.en,
      story: JSON.stringify({
        complaintAr: c.story.complaint.ar,
        complaintEn: c.story.complaint.en,
        diagnosisAr: c.story.diagnosis.ar,
        diagnosisEn: c.story.diagnosis.en,
        planAr: c.story.plan.ar,
        planEn: c.story.plan.en,
        materialsAr: c.story.materials.ar,
        materialsEn: c.story.materials.en,
        learnedAr: c.story.learned.ar,
        learnedEn: c.story.learned.en,
      }),
      published: c.published,
      // sample cases are stock-photo demos — consent flag intentionally
      // false; the admin editor requires it before publishing real cases.
      patientConsent: false,
    })),
  });
  console.log(`  cases: ${cases.length}`);

  // ---- certificates / research / volunteering ----------------------------
  await db.certificate.deleteMany();
  await db.certificate.createMany({
    data: certificates.map((c, index) => ({
      sortOrder: index,
      titleAr: c.title.ar,
      titleEn: c.title.en,
      issuerAr: c.issuer.ar,
      issuerEn: c.issuer.en,
      date: c.date,
      pdf: c.pdf,
      published: true,
    })),
  });

  await db.researchItem.deleteMany();
  await db.researchItem.createMany({
    data: research.map((r, index) => ({
      sortOrder: index,
      titleAr: r.title.ar,
      titleEn: r.title.en,
      abstractAr: r.abstract.ar,
      abstractEn: r.abstract.en,
      link: r.link,
      year: r.year,
      published: true,
    })),
  });

  await db.volunteeringItem.deleteMany();
  await db.volunteeringItem.createMany({
    data: volunteering.map((v, index) => ({
      sortOrder: index,
      titleAr: v.title.ar,
      titleEn: v.title.en,
      descriptionAr: v.description.ar,
      descriptionEn: v.description.en,
      imageSrc: v.image.src,
      imageAltAr: v.image.alt.ar,
      imageAltEn: v.image.alt.en,
      impact: JSON.stringify(
        v.impact.map((s) => ({
          labelAr: s.label.ar,
          labelEn: s.label.en,
          value: s.value,
          suffixAr: s.suffix?.ar ?? "",
          suffixEn: s.suffix?.en ?? "",
        })),
      ),
      published: true,
    })),
  });
  console.log(
    `  certificates: ${certificates.length}, research: ${research.length}, volunteering: ${volunteering.length}`,
  );

  // ---- blog -------------------------------------------------------------
  await db.blogPost.deleteMany();
  await db.blogPost.createMany({
    data: posts.map((p, index) => ({
      slug: p.slug,
      sortOrder: index,
      titleAr: p.title.ar,
      titleEn: p.title.en,
      excerptAr: p.excerpt.ar,
      excerptEn: p.excerpt.en,
      category: JSON.stringify({
        ar: (p.category as { ar: string; en: string }).ar,
        en: (p.category as { ar: string; en: string }).en,
      }),
      date: p.date,
      readingMinutes: p.readingMinutes,
      coverSrc: p.cover.src,
      coverAltAr: p.cover.alt.ar,
      coverAltEn: p.cover.alt.en,
      bodyAr: JSON.stringify(p.body.ar),
      bodyEn: JSON.stringify(p.body.en),
      published: p.published,
    })),
  });
  console.log(`  blog: ${posts.length}`);

  // ---- faq / resources / testimonials ------------------------------------
  await db.faqItem.deleteMany();
  await db.faqItem.createMany({
    data: faq.map((f, index) => ({
      sortOrder: index,
      qAr: f.q.ar,
      qEn: f.q.en,
      aAr: f.a.ar,
      aEn: f.a.en,
      published: true,
    })),
  });

  await db.resourceItem.deleteMany();
  await db.resourceItem.createMany({
    data: resources.map((r, index) => ({
      sortOrder: index,
      titleAr: r.title.ar,
      titleEn: r.title.en,
      descriptionAr: r.description.ar,
      descriptionEn: r.description.en,
      file: r.file,
      downloads: r.downloads,
      kind: r.kind,
      published: true,
    })),
  });

  await db.testimonial.deleteMany();
  await db.testimonial.createMany({
    data: testimonials.map((t, index) => ({
      sortOrder: index,
      quoteAr: t.quote.ar,
      quoteEn: t.quote.en,
      name: t.name,
      roleAr: t.role.ar,
      roleEn: t.role.en,
      initials: t.initials,
      published: true,
    })),
  });
  console.log(
    `  faq: ${faq.length}, resources: ${resources.length}, testimonials: ${testimonials.length}`,
  );

  console.log("Seed complete ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
