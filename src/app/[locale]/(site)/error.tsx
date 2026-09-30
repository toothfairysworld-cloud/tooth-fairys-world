"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-warning/10 text-warning">
        <TriangleAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-h2">{t("title")}</h1>
      <p className="mt-3 max-w-md text-body text-muted-foreground">
        {t("text")}
      </p>
      <Button onClick={reset} className="mt-8 rounded-xl px-6">
        <RefreshCw className="size-4" aria-hidden="true" />
        {t("retry")}
      </Button>
    </div>
  );
}
