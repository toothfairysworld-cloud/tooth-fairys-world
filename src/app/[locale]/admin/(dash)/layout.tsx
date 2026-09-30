import { setRequestLocale } from "next-intl/server";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Guarded dashboard shell — every (dash) page sits behind requireAdmin. */
export default async function AdminDashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const admin = await requireAdmin();
  const unread = await db.contactMessage.count({
    where: { read: false, archived: false },
  });

  return (
    <AdminShell locale={locale} admin={admin} unread={unread}>
      {children}
    </AdminShell>
  );
}
