import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

/** Friendly page-level loading state (designed, not a blank screen). */
export default function Loading() {
  const t = useTranslations("loading");

  return (
    <div className="container-site py-16" role="status" aria-busy="true">
      <span className="sr-only">{t("generic")}</span>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>
        <Skeleton className="aspect-[4/5] w-full max-w-sm justify-self-center rounded-t-full" />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <Skeleton className="h-40 rounded-2xl md:col-span-2" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
