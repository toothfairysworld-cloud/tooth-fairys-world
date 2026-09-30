"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  Inbox as InboxIcon,
  MailOpen,
  Reply,
  Trash2,
} from "lucide-react";

import { messageAction } from "@/lib/admin/actions";
import { al, bi } from "@/lib/admin/dict";
import type { Locale } from "@/content/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  locale: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

/** Inbox — tabs (active/archived), detail dialog, per-message actions. */
export function InboxList({
  locale,
  messages,
}: {
  locale: Locale;
  messages: InboxMessage[];
}) {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState(messages);
  const [pending, startTransition] = useTransition();

  const active = items.filter((m) => !m.archived);
  const archived = items.filter((m) => m.archived);
  const shown = tab === "active" ? active : archived;
  const open = items.find((m) => m.id === openId) ?? null;

  function run(id: string, action: Parameters<typeof messageAction>[1]) {
    startTransition(async () => {
      const result = await messageAction(id, action);
      if (result.ok) {
        setItems((prev) =>
          action === "delete"
            ? prev.filter((m) => m.id !== id)
            : prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      read:
                        action === "read"
                          ? true
                          : action === "unread"
                            ? false
                            : m.read,
                      archived:
                        action === "archive"
                          ? true
                          : action === "unarchive"
                            ? false
                            : m.archived,
                    }
                  : m,
              ),
        );
      } else {
        toast.error(al("saveError", locale));
      }
    });
  }

  function openMessage(m: InboxMessage) {
    setOpenId(m.id);
    if (!m.read) run(m.id, "read");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-heading">{al("inbox", locale)}</h1>
          <p className="mt-1.5 text-caption text-muted-foreground">
            {active.filter((m) => !m.read).length} {al("unreadMessages", locale)}
          </p>
        </div>
        <div
          role="tablist"
          aria-label={al("inbox", locale)}
          className="flex rounded-full border border-border bg-card p-1 shadow-xs"
        >
          {(["active", "archived"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "active" ? (
                <InboxIcon className="size-4" aria-hidden="true" />
              ) : (
                <Archive className="size-4" aria-hidden="true" />
              )}
              {key === "active" ? al("activeTab", locale) : al("archivedTab", locale)}
              <span className="tabular-nums">
                {key === "active" ? active.length : archived.length}
              </span>
            </button>
          ))}
        </div>
      </header>

      <ul className="mt-6 grid gap-3">
        {shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-caption text-muted-foreground">
            {tab === "active"
              ? al("noMessages", locale)
              : al("noArchived", locale)}
          </li>
        )}
        {shown.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => openMessage(m)}
              className={cn(
                "grid w-full gap-3 rounded-2xl border p-5 text-start shadow-xs transition-all hover:border-primary/40 hover:shadow-md",
                m.read
                  ? "border-border bg-card"
                  : "border-primary/35 bg-primary/5",
              )}
            >
              <span className="flex flex-wrap items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full text-caption font-bold",
                    m.read
                      ? "bg-surface-2 text-muted-foreground"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  {m.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-semibold">{m.name}</span>
                {!m.read && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-bold text-primary">
                    {al("newMsg", locale)}
                  </span>
                )}
                <time
                  dir="ltr"
                  className="ms-auto text-caption text-muted-foreground/80 tabular-nums"
                >
                  {new Date(m.createdAt).toLocaleString(
                    locale === "ar" ? "ar" : "en",
                    { dateStyle: "medium", timeStyle: "short" },
                  )}
                </time>
              </span>
              <span className="line-clamp-2 text-caption text-muted-foreground">
                {m.message}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* detail dialog */}
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-w-lg rounded-3xl p-8">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {open.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-start">{open.name}</span>
                </DialogTitle>
                <DialogDescription dir="ltr" className="text-start">
                  <a
                    href={`mailto:${open.email}`}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {open.email}
                  </a>
                  {" · "}
                  {new Date(open.createdAt).toLocaleString(
                    locale === "ar" ? "ar" : "en",
                    { dateStyle: "full", timeStyle: "short" },
                  )}
                </DialogDescription>
              </DialogHeader>

              <p className="max-h-72 overflow-y-auto whitespace-pre-wrap text-body leading-relaxed scrollbar-slim">
                {open.message}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Button asChild className="rounded-full">
                  <a href={`mailto:${open.email}?subject=Re: toothfairysworld.com`}>
                    <Reply className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                    {al("replyByEmail", locale)}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={pending}
                  onClick={() => run(open.id, open.read ? "unread" : "read")}
                >
                  <MailOpen className="size-4" aria-hidden="true" />
                  {open.read ? al("markUnread", locale) : al("markRead", locale)}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={pending}
                  onClick={() => {
                    run(open.id, open.archived ? "unarchive" : "archive");
                    setOpenId(null);
                  }}
                >
                  {open.archived ? (
                    <>
                      <ArchiveRestore className="size-4" aria-hidden="true" />
                      {al("unarchive", locale)}
                    </>
                  ) : (
                    <>
                      <Archive className="size-4" aria-hidden="true" />
                      {al("archive", locale)}
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full"
                  disabled={pending}
                  onClick={() => {
                    run(open.id, "delete");
                    setOpenId(null);
                  }}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  {al("deleteMsg", locale)}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
