import { db } from "@/lib/db";

/**
 * Privacy-friendly page-view analytics.
 *
 * Design contract (mirrors the future Supabase RLS policy):
 * - one aggregate row per (UTC day, path, locale) — no cookies, no IPs,
 *   no visitor identifiers, nothing that can single anyone out
 * - admin pages are never recorded
 * - failures are swallowed: analytics must never break a page
 */

const DAY_MS = 86_400_000;

function dayKey(offsetDays = 0): string {
  return new Date(Date.now() - offsetDays * DAY_MS).toISOString().slice(0, 10);
}

/** Record one view (upsert + increment). */
export async function recordPageView(
  path: string,
  locale: string,
): Promise<void> {
  try {
    const day = dayKey();
    await db.pageView.upsert({
      where: { day_path_locale: { day, path, locale } },
      update: { views: { increment: 1 } },
      create: { day, path, locale, views: 1 },
    });
  } catch {
    // never surface analytics errors
  }
}

export interface DayViews {
  day: string;
  views: number;
}

export interface AnalyticsSummary {
  /** Total views over the last 30 days. */
  total30: number;
  /** Views so far today (UTC). */
  today: number;
  /** Last 14 days, zero-filled, oldest first. */
  days: DayViews[];
  /** Top 5 paths over the last 30 days. */
  topPages: { path: string; views: number }[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const since30 = dayKey(29);
  const since14 = dayKey(13);

  const [totalRow, dayRows, topRows] = await Promise.all([
    db.pageView.aggregate({
      _sum: { views: true },
      where: { day: { gte: since30 } },
    }),
    db.pageView.groupBy({
      by: ["day"],
      _sum: { views: true },
      where: { day: { gte: since14 } },
    }),
    db.pageView.groupBy({
      by: ["path"],
      _sum: { views: true },
      where: { day: { gte: since30 } },
      orderBy: { _sum: { views: "desc" } },
      take: 5,
    }),
  ]);

  const byDay = new Map(dayRows.map((r) => [r.day, r._sum.views ?? 0]));
  const days: DayViews[] = Array.from({ length: 14 }, (_, i) => {
    const day = dayKey(13 - i);
    return { day, views: byDay.get(day) ?? 0 };
  });

  return {
    total30: totalRow._sum.views ?? 0,
    today: byDay.get(dayKey()) ?? 0,
    days,
    topPages: topRows.map((r) => ({
      path: r.path,
      views: r._sum.views ?? 0,
    })),
  };
}
