"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  deleteEntityAction,
  moveEntityAction,
  togglePublishedAction,
} from "@/lib/admin/actions";
import { al, bi, type Bi } from "@/lib/admin/dict";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ListItem {
  id: string;
  title: string;
  meta: string[];
  visible: boolean;
}

/**
 * Registry-driven entity list — reorderable, publishable, deletable.
 * Designed for a non-technical owner: big rows, obvious states.
 */
export function EntityList({
  locale,
  entityKey,
  label,
  fixed,
  consentGate,
  items,
}: {
  locale: Locale;
  entityKey: string;
  label: Bi;
  fixed: boolean;
  consentGate: boolean;
  items: ListItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const isSections = entityKey === "sections";

  function refresh() {
    router.refresh();
  }

  function toggle(item: ListItem, next: boolean) {
    startTransition(async () => {
      const result = await togglePublishedAction(entityKey, item.id, next);
      if (result.ok) {
        toast.success(
          next ? al("published", locale) : al("draft", locale),
        );
        refresh();
      } else if (result.error === "consent") {
        toast.error(al("consentGate", locale));
      } else {
        toast.error(al("saveError", locale));
      }
    });
  }

  function move(id: string, dir: "up" | "down") {
    startTransition(async () => {
      const result = await moveEntityAction(entityKey, id, dir);
      if (result.ok) refresh();
      else toast.error(al("saveError", locale));
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteEntityAction(entityKey, id);
      if (result.ok) {
        toast.success(al("del", locale));
        setConfirmId(null);
        refresh();
      } else {
        toast.error(al("saveError", locale));
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-heading">{bi(label, locale)}</h1>
          <p className="mt-1.5 text-caption text-muted-foreground">
            {items.length} {al("itemCount", locale)}
          </p>
        </div>
        {!fixed && (
          <Button asChild className="rounded-full px-5">
            <Link href={`/admin/content/${entityKey}/new`}>
              <Plus className="size-4" aria-hidden="true" />
              {al("addItem", locale)}
            </Link>
          </Button>
        )}
      </header>

      <ul className="mt-6 grid gap-3">
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-caption text-muted-foreground">
            {al("emptyList", locale)}
          </li>
        )}
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "grid gap-4 rounded-2xl border p-5 shadow-xs transition-colors",
              item.visible
                ? "border-border bg-card"
                : "border-dashed border-border bg-surface-2/40",
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* order controls */}
              <span className="flex flex-col gap-0.5">
                <button
                  type="button"
                  aria-label={al("moveUp", locale)}
                  disabled={index === 0 || pending}
                  onClick={() => move(item.id, "up")}
                  className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-25"
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={al("moveDown", locale)}
                  disabled={index === items.length - 1 || pending}
                  onClick={() => move(item.id, "down")}
                  className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-25"
                >
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                </button>
              </span>

              <span className="grid min-w-0 flex-1 place-items-center">
                <span className="w-full truncate text-sm font-semibold">
                  {item.title}
                </span>
                {item.meta.length > 0 && (
                  <span
                    dir="ltr"
                    className="w-full truncate text-caption text-muted-foreground/80"
                  >
                    {item.meta.join(" · ")}
                  </span>
                )}
              </span>

              {/* state chip */}
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold",
                  item.visible
                    ? "bg-primary/12 text-primary"
                    : "bg-surface-2 text-muted-foreground",
                )}
              >
                {item.visible ? (
                  <Eye className="size-3" aria-hidden="true" />
                ) : (
                  <EyeOff className="size-3" aria-hidden="true" />
                )}
                {item.visible
                  ? al("published", locale)
                  : al("draft", locale)}
              </span>

              {/* actions */}
              <span className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`pub-${item.id}`}>
                  {al("published", locale)}
                </label>
                <Switch
                  id={`pub-${item.id}`}
                  checked={item.visible}
                  disabled={pending}
                  onCheckedChange={(next) => toggle(item, next)}
                />
                <Button asChild size="icon" variant="outline" className="rounded-xl">
                  <Link
                    href={`/admin/content/${entityKey}/${item.id}`}
                    aria-label={al("edit", locale)}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                {!fixed && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={al("del", locale)}
                    disabled={pending}
                    onClick={() => setConfirmId(item.id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </span>
            </div>

            {consentGate && !item.visible && (
              <p className="ps-10 text-caption text-muted-foreground">
                {al("consentGate", locale)}
              </p>
            )}

            {/* inline delete confirmation */}
            {confirmId === item.id && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
                <p className="text-caption font-medium text-destructive">
                  {al("confirmDelete", locale)}
                </p>
                <span className="flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    disabled={pending}
                    onClick={() => remove(item.id)}
                  >
                    {al("del", locale)}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setConfirmId(null)}
                  >
                    {al("cancel", locale)}
                  </Button>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
