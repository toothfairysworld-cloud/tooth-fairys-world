import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const day = new Date().toISOString().slice(0, 10);
try {
  const r = await db.pageView.upsert({
    where: { day_path_locale: { day, path: "/debug", locale: "ar" } },
    update: { views: { increment: 1 } },
    create: { day, path: "/debug", locale: "ar", views: 1 },
  });
  console.log("OK:", r);
} catch (e) {
  console.error("UPSERT FAILED:", e instanceof Error ? e.message : e);
}
await db.$disconnect();
