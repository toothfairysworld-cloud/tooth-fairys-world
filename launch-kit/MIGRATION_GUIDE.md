# Launch Guide · دليل الإطلاق

**From this sandbox → your live site at `toothfairysworld.com`**

Everything below is a one-time setup. After it, you manage 100% of the
content from `/admin` — no code, no developer needed.

كل ما يلي إعداد لمرة واحدة فقط. بعدها تديرين 100% من المحتوى عبر لوحة التحكم
`/admin` — دون أي كود أو مبرمج.

---

## What you need · ما تحتاجينه

| Account | Purpose | Free tier |
|---|---|---|
| [Supabase](https://supabase.com) | Database + image storage | ✔ |
| [Vercel](https://vercel.com) | Hosting | ✔ |
| Domain `toothfairysworld.com` | Your address (registrar of your choice) | — |

---

## Step 1 — Create the database · إنشاء قاعدة البيانات

1. Create a project at **supabase.com** (name it e.g. `toothfairysworld`).
   Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste the entire contents of
   `supabase-schema.sql` (in this folder), and **Run**.
3. This creates all 13 tables, the privacy rules (RLS), the page-view
   counter, and the `uploads` image bucket — in one shot.
4. **Import the current content**: the sandbox database
   (`db/custom.db`) already holds every section, case, post and the
   seeded profile. Either:
   - export it as SQL from the sandbox and run it in the same editor
     (ask the assistant to generate `data-export.sql`), **or**
   - re-enter the content through `/admin` — it's all editable.

## Step 2 — Point the app at the database · ربط التطبيق بقاعدة البيانات

In Supabase: **Project Settings → Database → Connection string → URI**
(session pooler is fine). You will set this as an environment variable in
Step 3:

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

> The app uses Prisma. On first production boot it expects the schema
> to exist (Step 1 already created it). No migration to run — the SQL
> kit and `prisma/schema.prisma` are kept in sync by design.

## Step 3 — Deploy to Vercel · النشر على Vercel

1. Push this project folder to a **GitHub repository** (private is fine).
2. In Vercel: **Add New → Project → import the repo**.
   Framework preset: *Next.js* — detected automatically.
3. Add the **Environment Variables**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | the Supabase URI from Step 2 |
| `ADMIN_SESSION_SECRET` | any long random string (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | `https://toothfairysworld.com` |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase → Settings → API (server-only) |

4. Click **Deploy**. First build takes ~2 minutes.
5. Visit the deployment URL — the site runs exactly like the preview,
   English at `/` and Arabic at `/ar`.

## Step 4 — Connect the domain · ربط النطاق

1. In Vercel: **Project → Settings → Domains → Add `toothfairysworld.com`**.
2. Vercel shows the DNS records to create at your registrar:
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
3. Wait for the SSL certificate (automatic, ~5–30 minutes after DNS
   propagates). `https://toothfairysworld.com` is now live.

## Step 5 — Go-live checklist · قائمة التشغيل

- [ ] Change the admin password: **/admin → settings** (the seeded
      `admin@toothfairysworld.com / ToothFairy2027!` is demo-only).
- [ ] Set the real graduation date and social links in **/admin → profile**.
- [ ] Turn off the sample banner: in **/admin → profile**, untick
      “sample content” — the banner and the ✨ sample badges disappear.
- [ ] Replace every sample photo with your own (each item's edit page →
      **upload image**; patient photos need the consent checkbox).
- [ ] Submit `https://toothfairysworld.com/sitemap.xml` in
      [Google Search Console](https://search.google.com/search-console).
- [ ] Test the contact form once and check the message lands in
      **/admin → inbox**.

---

## Production notes · ملاحظات الإنتاج

**Image uploads** — the dashboard's upload endpoint writes to Supabase
Storage in production (the `uploads` bucket created by the SQL kit).
In the code this is one function: `src/app/api/upload/route.ts`
(swaps `fs` writes for a storage `upload()` call — ~10 lines).

**Sessions & login** — today the app signs its own session cookie with
`ADMIN_SESSION_SECRET` (scrypt + HMAC, 12-hour expiry, login rate-limiting
included). Supabase Auth can replace it later without touching the UI:
the code boundary is `src/lib/auth.ts` (`createSession / requireAdmin`).

**Page-view analytics** — already aggregate-only (no cookies, no
identifiers; see the privacy page). On Supabase the beacon calls the
`record_page_view()` SQL function directly through the REST endpoint —
the RLS policies keep it write-only for anonymous traffic.

**Backups** — Supabase runs daily backups on the free tier; the content
is also exportable as SQL at any time from the dashboard.

---

## Where things live · خريطة الملفات

| Path | What |
|---|---|
| `supabase-schema.sql` | tables + RLS + storage bucket (run once) |
| `src/lib/admin/*` | dashboard actions, entity registry, OG generator |
| `src/lib/auth.ts` | login + sessions (swap point for Supabase Auth) |
| `prisma/schema.prisma` | database schema (kept in sync with the SQL kit) |
| `CREDITS.md` | image licenses — keep when publishing |
