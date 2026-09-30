"use client";

import { useTranslations } from "next-intl";
import { Check, Link2, Twitter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** Per-article share: X, copy link (clipboard + toast). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyLink"));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption font-semibold text-muted-foreground">
        {t("share")}:
      </span>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="rounded-pill gap-1.5"
      >
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="size-3.5" aria-hidden="true" />
          X
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copy}
        className="rounded-pill gap-1.5"
        aria-live="polite"
      >
        {copied ? (
          <Check className="size-3.5 text-success" aria-hidden="true" />
        ) : (
          <Link2 className="size-3.5" aria-hidden="true" />
        )}
        {copied ? t("linkCopied") : t("copyLink")}
      </Button>
    </div>
  );
}
