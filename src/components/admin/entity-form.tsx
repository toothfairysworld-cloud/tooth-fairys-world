"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { saveEntityAction, saveProfileAction } from "@/lib/admin/actions";
import { al, bi, type Bi } from "@/lib/admin/dict";
import type { FieldDef } from "@/lib/admin/registry";
import type { Locale } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Blocks = {
  ar: { type: "p" | "h2" | "ul"; text: string; items?: string[] }[];
  en: { type: "p" | "h2" | "ul"; text: string; items?: string[] }[];
};
type StoryRow = Record<string, string>;

const STORY_PARTS: { key: string; label: Bi }[] = [
  { key: "complaint", label: { ar: "الشكوى", en: "Complaint" } },
  { key: "diagnosis", label: { ar: "التشخيص", en: "Diagnosis" } },
  { key: "plan", label: { ar: "خطة العلاج", en: "Treatment plan" } },
  { key: "materials", label: { ar: "المواد", en: "Materials" } },
  { key: "learned", label: { ar: "ما تعلمته", en: "What I learned" } },
];

/**
 * Registry-driven entity form.
 * Layout: shared settings → Arabic column (RTL) → English column (LTR).
 * Specialized editors for stats lists, bilingual pairs, article blocks
 * and the case story.
 */
export function EntityForm({
  locale,
  entityKey,
  label,
  fields,
  id,
  isNew,
  slugField,
  consentGate,
  values: initial,
}: {
  locale: Locale;
  entityKey: string;
  label: Bi;
  fields: FieldDef[];
  id: string | null;
  isNew: boolean;
  slugField: string | null;
  consentGate: boolean;
  values: Record<string, unknown>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const arFields = fields.filter((f) => f.group === "ar");
  const enFields = fields.filter((f) => f.group === "en");

  const sharedOnly = useMemo(
    () => fields.filter((f) => (f.group ?? "shared") === "shared"),
    [fields],
  );

  function set(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    setError(null);
    // client-side required validation for simple fields
    for (const field of fields) {
      if (field.required) {
        const v = values[field.key];
        if (
          field.kind !== "pairs" &&
          field.kind !== "stats" &&
          field.kind !== "story" &&
          (v === undefined || v === null || String(v).trim() === "")
        ) {
          setError(al("saveError", locale));
          toast.error(al("saveError", locale));
          return;
        }
      }
    }
    if (slugField) {
      const slug = String(values[slugField] ?? "").trim().toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        setError("slug");
        toast.error(al("slugTaken", locale));
        return;
      }
      set(slugField, slug);
    }
    if (consentGate && values.published && !values.patientConsent) {
      toast.error(al("consentGate", locale));
      return;
    }

    startTransition(async () => {
      // profile singleton routes to its dedicated action
      const result =
        entityKey === "__profile__"
          ? await saveProfileAction(values)
          : await saveEntityAction(entityKey, id, values);
      if (result.ok) {
        toast.success(al("saved", locale));
        if (entityKey === "__profile__") {
          router.refresh();
        } else {
          router.push(`/admin/content/${entityKey}`);
          router.refresh();
        }
      } else {
        const message =
          result.error === "slug_taken"
            ? al("slugTaken", locale)
            : result.error === "consent"
              ? al("consentGate", locale)
              : al("saveError", locale);
        setError(result.error ?? "db");
        toast.error(message);
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={`/admin/content/${entityKey}`}
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {bi(label, locale)}
          </Link>
          <h1 className="mt-2 text-h1 font-heading">
            {isNew ? al("newTitle", locale) : al("editTitle", locale)}
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-primary">{bi(label, locale)}</span>
          </h1>
        </div>
      </header>

      {error === "slug" && (
        <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-caption font-medium text-destructive">
          {al("slugTaken", locale)}
        </p>
      )}

      {/* -------------------------------------------------- shared fields */}
      <Section
        title={al("sharedSection", locale)}
        icon="⚙"
        fields={sharedOnly}
        values={values}
        set={set}
        locale={locale}
      />

      {/* -------------------------------------------------- arabic column */}
      {arFields.length > 0 && (
        <Section
          title={al("arSection", locale)}
          icon="ع"
          dir="rtl"
          fields={arFields}
          values={values}
          set={set}
          locale={locale}
        />
      )}

      {/* -------------------------------------------------- english column */}
      {enFields.length > 0 && (
        <Section
          title={al("enSection", locale)}
          icon="EN"
          dir="ltr"
          fields={enFields}
          values={values}
          set={set}
          locale={locale}
        />
      )}

      {/* -------------------------------------------------- sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md start-0 lg:start-[17rem] sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="hidden text-caption text-muted-foreground sm:block">
            {isNew ? al("newTitle", locale) : al("editTitle", locale)} ·{" "}
            {bi(label, locale)}
          </p>
          <div className="flex gap-3">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href={`/admin/content/${entityKey}`}>
                {al("cancel", locale)}
              </Link>
            </Button>
            <Button
              onClick={save}
              disabled={pending}
              size="lg"
              className="rounded-full px-7"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {al("saving", locale)}
                </>
              ) : (
                <>
                  <Save className="size-4" aria-hidden="true" />
                  {al("save", locale)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// section wrapper

function Section({
  title,
  icon,
  dir,
  fields,
  values,
  set,
  locale,
}: {
  title: string;
  icon: string;
  dir?: "rtl" | "ltr";
  fields: FieldDef[];
  values: Record<string, unknown>;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2.5 text-h3">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <div dir={dir} className="mt-4 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7">
        {fields.map((field) => (
          <FieldRow
            key={field.key}
            field={field}
            value={values[field.key]}
            set={set}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// field row dispatcher

function FieldRow({
  field,
  value,
  set,
  locale,
}: {
  field: FieldDef;
  value: unknown;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  switch (field.kind) {
    case "textarea":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <Textarea
            rows={field.rows ?? 3}
            value={String(value ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-2/40 px-4 py-3.5">
          <div>
            <Label htmlFor={field.key} className="text-sm font-semibold">
              {bi(field.label, locale)}
            </Label>
            {field.help && (
              <p className="mt-0.5 text-caption text-muted-foreground">
                {bi(field.help, locale)}
              </p>
            )}
          </div>
          <Switch
            id={field.key}
            checked={Boolean(value)}
            onCheckedChange={(v) => set(field.key, v)}
          />
        </div>
      );

    case "number":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <Input
            type="number"
            dir="ltr"
            value={Number(value ?? 0)}
            onChange={(e) => set(field.key, Number(e.target.value))}
            className="rounded-xl"
          />
        </div>
      );

    case "select":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <select
            value={String(value ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/40"
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {bi(option.label, locale)}
              </option>
            ))}
          </select>
        </div>
      );

    case "image":
      return (
        <ImageField field={field} value={String(value ?? "")} set={set} locale={locale} />
      );

    case "pairs":
      return (
        <PairsEditor field={field} value={value as { ar: string[]; en: string[] }} set={set} locale={locale} />
      );

    case "stats":
      return (
        <StatsEditor field={field} value={value as StatsRowUI[]} set={set} locale={locale} />
      );

    case "blocks":
      return (
        <BlocksEditor field={field} value={value as Blocks} set={set} locale={locale} />
      );

    case "story":
      return (
        <StoryEditor value={value as StoryRow} set={set} locale={locale} />
      );

    case "date":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <Input
            type="date"
            dir="ltr"
            value={String(value ?? "").slice(0, 10)}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
        </div>
      );

    case "datetime":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <Input
            type="datetime-local"
            dir="ltr"
            value={toDatetimeLocal(String(value ?? ""))}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
        </div>
      );

    case "month":
      return (
        <div className="grid gap-2">
          <FieldLabel field={field} locale={locale} />
          <Input
            type="month"
            dir="ltr"
            value={String(value ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
        </div>
      );

    default:
      return (
        <div className={cn("grid gap-2", field.half && "sm:grid-cols-2 sm:gap-4")}>
          <FieldLabel field={field} locale={locale} />
          <Input
            type={field.kind === "url" ? "url" : "text"}
            dir={field.kind === "url" ? "ltr" : undefined}
            value={String(value ?? "")}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
        </div>
      );
  }
}

function FieldLabel({ field, locale }: { field: FieldDef; locale: Locale }) {
  return (
    <Label htmlFor={field.key} className="flex items-baseline gap-2">
      <span className="text-sm font-semibold">{bi(field.label, locale)}</span>
      {field.required && (
        <span className="text-caption text-accent-warm">
          * {al("required", locale)}
        </span>
      )}
      {field.help && (
        <span className="text-caption font-normal text-muted-foreground">
          {bi(field.help, locale)}
        </span>
      )}
    </Label>
  );
}

function toDatetimeLocal(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// ---------------------------------------------------------------------------
// image field with upload

function ImageField({
  field,
  value,
  set,
  locale,
}: {
  field: FieldDef;
  value: string;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("upload failed");
      const data = (await res.json()) as { path: string };
      set(field.key, data.path);
      toast.success(al("saved", locale));
    } catch {
      toast.error(al("uploadError", locale));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <FieldLabel field={field} locale={locale} />
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-2">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground/50">
              <ImagePlus className="size-6" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="grid min-w-48 flex-1 gap-2">
          <Input
            dir="ltr"
            placeholder="/images/…"
            value={value}
            onChange={(e) => set(field.key, e.target.value)}
            className="rounded-xl"
          />
          <label className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-dashed border-primary/50 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {al("uploading", locale)}
              </>
            ) : (
              <>
                <ImagePlus className="size-4" aria-hidden="true" />
                {al("upload", locale)}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// pairs editor (aligned AR/EN lists)

function PairsEditor({
  field,
  value,
  set,
  locale,
}: {
  field: FieldDef;
  value: { ar: string[]; en: string[] } | undefined;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  const ar = value?.ar ?? [""];
  const en = value?.en ?? [""];

  const length = Math.max(ar.length, en.length, 1);
  const rows = Array.from({ length }, (_, i) => ({
    ar: ar[i] ?? "",
    en: en[i] ?? "",
  }));

  function update(index: number, which: "ar" | "en", text: string) {
    const next = rows.map((row, i) =>
      i === index ? { ...row, [which]: text } : row,
    );
    set(field.key, {
      ar: next.map((r) => r.ar),
      en: next.map((r) => r.en),
    });
  }

  function add() {
    set(field.key, {
      ar: [...rows.map((r) => r.ar), ""],
      en: [...rows.map((r) => r.en), ""],
    });
  }

  function remove(index: number) {
    set(field.key, {
      ar: rows.filter((_, i) => i !== index).map((r) => r.ar),
      en: rows.filter((_, i) => i !== index).map((r) => r.en),
    });
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="px-0 text-sm font-semibold">
        {bi(field.label, locale)}
      </legend>
      <div className="grid gap-2.5">
        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 px-1 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground/70">
          <span>العربية</span>
          <span>English</span>
          <span />
        </div>
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              dir="rtl"
              value={row.ar}
              onChange={(e) => update(index, "ar", e.target.value)}
              className="rounded-xl"
              aria-label={`${bi(field.label, locale)} — AR ${index + 1}`}
            />
            <Input
              dir="ltr"
              value={row.en}
              onChange={(e) => update(index, "en", e.target.value)}
              className="rounded-xl"
              aria-label={`${bi(field.label, locale)} — EN ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
              aria-label={`${al("removeRow", locale)} ${index + 1}`}
              disabled={rows.length <= 1}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-full"
          onClick={add}
        >
          <Plus className="size-4" aria-hidden="true" />
          {al("addRow", locale)}
        </Button>
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// stats editor

interface StatsRowUI {
  labelAr: string;
  labelEn: string;
  value: number;
  suffixAr: string;
  suffixEn: string;
}

function StatsEditor({
  field,
  value,
  set,
  locale,
}: {
  field: FieldDef;
  value: StatsRowUI[] | undefined;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  const rows =
    value && Array.isArray(value) && value.length > 0
      ? value
      : [
          {
            labelAr: "",
            labelEn: "",
            value: 0,
            suffixAr: "",
            suffixEn: "",
          },
        ];

  function update(index: number, patch: Partial<StatsRowUI>) {
    const next = rows.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    set(field.key, next);
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="px-0 text-sm font-semibold">
        {bi(field.label, locale)}
      </legend>
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-border bg-surface-2/40 p-3.5"
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
              <Input
                dir="rtl"
                placeholder="التسمية بالعربية"
                value={row.labelAr}
                onChange={(e) => update(index, { labelAr: e.target.value })}
                className="rounded-xl bg-background"
              />
              <Input
                dir="ltr"
                placeholder="Label in English"
                value={row.labelEn}
                onChange={(e) => update(index, { labelEn: e.target.value })}
                className="rounded-xl bg-background"
              />
            </div>
            <div className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2">
              <Input
                type="number"
                dir="ltr"
                value={row.value}
                onChange={(e) => update(index, { value: Number(e.target.value) })}
                className="w-24 rounded-xl bg-background"
                aria-label={al("statsValue", locale)}
              />
              <Input
                dir="rtl"
                placeholder="لاحقة"
                value={row.suffixAr}
                onChange={(e) => update(index, { suffixAr: e.target.value })}
                className="rounded-xl bg-background"
                aria-label={`${al("statSuffix", locale)} AR`}
              />
              <Input
                dir="ltr"
                placeholder="suffix"
                value={row.suffixEn}
                onChange={(e) => update(index, { suffixEn: e.target.value })}
                className="rounded-xl bg-background"
                aria-label={`${al("statSuffix", locale)} EN`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl text-muted-foreground hover:text-destructive"
                onClick={() =>
                  set(
                    field.key,
                    rows.filter((_, i) => i !== index),
                  )
                }
                aria-label={al("removeRow", locale)}
                disabled={rows.length <= 1}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-full"
          onClick={() =>
            set(field.key, [
              ...rows,
              { labelAr: "", labelEn: "", value: 0, suffixAr: "", suffixEn: "" },
            ])
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          {al("addRow", locale)}
        </Button>
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// article blocks editor (per-locale tabs)

function BlocksEditor({
  field,
  value,
  set,
  locale,
}: {
  field: FieldDef;
  value: Blocks | undefined;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  const [tab, setTab] = useState<"ar" | "en">("ar");
  const blocks = value ?? { ar: [], en: [] };
  const list = blocks[tab] ?? [];

  function updateBlocks(next: Blocks["ar"]) {
    set(field.key, { ...blocks, [tab]: next });
  }

  function updateBlock(index: number, patch: Partial<Blocks["ar"][number]>) {
    updateBlocks(list.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="flex w-full flex-wrap items-center justify-between gap-3 px-0 text-sm font-semibold">
        <span>{bi(field.label, locale)}</span>
        <span className="flex rounded-full border border-border p-1 text-xs font-bold">
          {(["ar", "en"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full px-3.5 py-1 transition-colors",
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "ar" ? "العربية" : "English"}
            </button>
          ))}
        </span>
      </legend>

      <div dir={tab === "ar" ? "rtl" : "ltr"} className="grid gap-3">
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-4 text-center text-caption text-muted-foreground">
            {al("emptyList", locale)}
          </p>
        )}
        {list.map((block, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-border bg-surface-2/40 p-3.5"
          >
            <div className="flex items-center gap-2">
              <select
                value={block.type}
                onChange={(e) =>
                  updateBlock(index, {
                    type: e.target.value as Blocks["ar"][number]["type"],
                  })
                }
                className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold shadow-xs"
                aria-label={`${bi(field.label, locale)} — ${index + 1}`}
              >
                <option value="p">{al("blockP", locale)}</option>
                <option value="h2">{al("blockH2", locale)}</option>
                <option value="ul">{al("blockUl", locale)}</option>
              </select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ms-auto rounded-xl text-muted-foreground hover:text-destructive"
                onClick={() =>
                  updateBlocks(list.filter((_, i) => i !== index))
                }
                aria-label={al("removeBlock", locale)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>

            {block.type === "ul" ? (
              <div className="grid gap-1.5">
                <Textarea
                  rows={4}
                  placeholder={
                    tab === "ar"
                      ? "كل سطر نقطة واحدة\nنقطة ثانية"
                      : "One line per bullet\nSecond bullet"
                  }
                  value={(block.items ?? []).join("\n")}
                  onChange={(e) =>
                    updateBlock(index, {
                      items: e.target.value.split("\n"),
                      text: "",
                    })
                  }
                  className="rounded-xl bg-background"
                />
                <p className="text-[0.7rem] text-muted-foreground">
                  {al("blockUlHelp", locale)}
                </p>
              </div>
            ) : (
              <Textarea
                rows={block.type === "h2" ? 1 : 3}
                value={block.text}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                className="rounded-xl bg-background"
              />
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit rounded-full"
          onClick={() => updateBlocks([...list, { type: "p", text: "" }])}
        >
          <Plus className="size-4" aria-hidden="true" />
          {al("addBlock", locale)}
        </Button>
      </div>
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// case story editor

function StoryEditor({
  value,
  set,
  locale,
}: {
  value: StoryRow | undefined;
  set: (key: string, value: unknown) => void;
  locale: Locale;
}) {
  const story: StoryRow = value ?? {};

  function update(part: string, which: "Ar" | "En", text: string) {
    set("story", { ...story, [`${part}${which}`]: text });
  }

  return (
    <fieldset className="grid gap-4">
      <legend className="px-0 text-sm font-semibold">
        {bi({ ar: "قصة الحالة", en: "Case story" }, locale)}
      </legend>
      {STORY_PARTS.map((part) => (
        <div
          key={part.key}
          className="grid gap-2 rounded-xl border border-border bg-surface-2/40 p-3.5"
        >
          <p className="text-caption font-bold text-accent-warm">
            {bi(part.label, locale)}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Textarea
              dir="rtl"
              rows={3}
              placeholder="بالعربية…"
              value={story[`${part.key}Ar`] ?? ""}
              onChange={(e) => update(part.key, "Ar", e.target.value)}
              className="rounded-xl bg-background"
              aria-label={`${bi(part.label, locale)} AR`}
            />
            <Textarea
              dir="ltr"
              rows={3}
              placeholder="In English…"
              value={story[`${part.key}En`] ?? ""}
              onChange={(e) => update(part.key, "En", e.target.value)}
              className="rounded-xl bg-background"
              aria-label={`${bi(part.label, locale)} EN`}
            />
          </div>
        </div>
      ))}
    </fieldset>
  );
}
