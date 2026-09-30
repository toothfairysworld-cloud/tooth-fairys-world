import { setRequestLocale } from "next-intl/server";

import { InboxList } from "@/components/admin/inbox-list";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Contact inbox — active + archived tabs, dialog detail view. */
export default async function AdminInbox({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const serialized = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    locale: m.locale,
    read: m.read,
    archived: m.archived,
    createdAt: m.createdAt.toISOString(),
  }));

  return <InboxList locale={locale} messages={serialized} />;
}
