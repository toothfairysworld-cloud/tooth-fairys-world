-- ============================================================================
-- Tooth Fairy's World — Academic Portfolio
-- Supabase / Postgres migration kit (mirrors prisma/schema.prisma)
--
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL → New query).
-- It creates: 13 tables, row-level security policies, the aggregate
-- page-view function, and the storage bucket for uploads.
--
-- Access model
--   anon          → SELECT published content only; INSERT contact messages;
--                   INSERT page views (via security-definer function);
--                   NO read access to messages / analytics / admin users.
--   authenticated → the owner's dashboard (full CRUD) — or use the direct
--                   Postgres connection string from the app (bypasses RLS,
--                   guarded by the app's server-side auth).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- tables
-- ---------------------------------------------------------------------------

create table if not exists admin_users (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  password_hash text not null,               -- scrypt "salt:hash" (superseded by Supabase Auth, kept for migration parity)
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists profile (
  id                 text primary key default 'main',
  name_ar            text not null,
  name_en            text not null,
  initials           text not null default 'TF',
  role_ar            text not null,
  role_en            text not null,
  university_ar      text not null,
  university_en      text not null,
  value_statement_ar text not null,
  value_statement_en text not null,
  portrait_src       text not null default '/images/hero-portrait.webp',
  portrait_alt_ar    text not null default '',
  portrait_alt_en    text not null default '',
  bio_ar             jsonb not null default '[]',   -- string[]
  bio_en             jsonb not null default '[]',
  philosophy_ar      text not null default '',
  philosophy_en      text not null default '',
  interests_ar       jsonb not null default '[]',   -- string[]
  interests_en       jsonb not null default '[]',
  instagram          text,
  cv_pdf             text,
  graduation_date    text not null default '2027-06-30T18:30:00+03:00',
  is_sample          boolean not null default true,
  about_image1       text not null default '/images/about-1.webp',
  about_image2       text not null default '/images/about-2.webp',
  about_image3       text not null default '/images/about-3.webp',
  updated_at         timestamptz not null default now()
);

create table if not exists section_configs (
  id          text primary key,              -- section key: hero, about, experience, …
  sort_order  integer not null default 0,
  enabled     boolean not null default true,
  title_ar    text not null default '',
  title_en    text not null default '',
  subtitle_ar text not null default '',
  subtitle_en text not null default '',
  image       text not null default ''
);

create table if not exists timeline_entries (
  id             uuid primary key default gen_random_uuid(),
  sort_order     integer not null default 0,
  year           text not null,
  title_ar       text not null,
  title_en       text not null,
  description_ar text not null,
  description_en text not null,
  skills_ar      jsonb not null default '[]',
  skills_en      jsonb not null default '[]',
  stats          jsonb not null default '[]', -- [{value, suffix, label_ar, label_en}]
  published      boolean not null default true
);

create table if not exists case_studies (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  sort_order      integer not null default 0,
  category        text not null default 'fillings',  -- fillings|endo|gum|prosth
  title_ar        text not null,
  title_en        text not null,
  summary_ar      text not null,
  summary_en      text not null,
  period          text not null,
  featured        boolean not null default false,
  image_before    text not null default '',
  image_after     text not null default '',
  image_alt_ar    text not null default '',
  image_alt_en    text not null default '',
  story           jsonb not null default '{}',  -- bilingual story fields
  published       boolean not null default false,
  patient_consent boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists certificates (
  id         uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  title_ar   text not null,
  title_en   text not null,
  issuer_ar  text not null,
  issuer_en  text not null,
  date       text not null,
  pdf        text,
  published  boolean not null default true
);

create table if not exists research_items (
  id          uuid primary key default gen_random_uuid(),
  sort_order  integer not null default 0,
  title_ar    text not null,
  title_en    text not null,
  abstract_ar text not null,
  abstract_en text not null,
  link        text,
  year        text not null,
  published   boolean not null default true
);

create table if not exists volunteering_items (
  id            uuid primary key default gen_random_uuid(),
  sort_order    integer not null default 0,
  title_ar      text not null,
  title_en      text not null,
  description_ar text not null,
  description_en text not null,
  image_src     text not null default '',
  image_alt_ar  text not null default '',
  image_alt_en  text not null default '',
  impact        jsonb not null default '[]',
  published     boolean not null default true
);

create table if not exists blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  sort_order      integer not null default 0,
  title_ar        text not null,
  title_en        text not null,
  excerpt_ar      text not null,
  excerpt_en      text not null,
  category        text not null default '',
  date            text not null,
  reading_minutes integer not null default 3,
  cover_src       text not null default '',
  cover_alt_ar    text not null default '',
  cover_alt_en    text not null default '',
  body_ar         jsonb not null default '[]',  -- [{type:'p'|'h2'|'ul', …}]
  body_en         jsonb not null default '[]',
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists faq_items (
  id        uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  q_ar      text not null,
  q_en      text not null,
  a_ar      text not null,
  a_en      text not null,
  published boolean not null default true
);

create table if not exists resource_items (
  id            uuid primary key default gen_random_uuid(),
  sort_order    integer not null default 0,
  title_ar      text not null,
  title_en      text not null,
  description_ar text not null,
  description_en text not null,
  file          text not null,
  downloads     integer not null default 0,
  kind          text not null default 'notes', -- notes|checklist|plan|glossary
  published     boolean not null default true
);

create table if not exists testimonials (
  id        uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  quote_ar  text not null,
  quote_en  text not null,
  name      text not null,
  role_ar   text not null,
  role_en   text not null,
  initials  text not null,
  published boolean not null default true
);

create table if not exists contact_messages (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  email     text not null,
  subject   text,
  message   text not null,
  locale    text not null default 'ar',
  read      boolean not null default false,
  archived  boolean not null default false,
  ip_hash   text,
  created_at timestamptz not null default now()
);

-- Privacy-friendly aggregate page views (no identifiers, no cookies)
create table if not exists page_views (
  id         uuid primary key default gen_random_uuid(),
  day        text not null,                   -- YYYY-MM-DD (UTC)
  path       text not null,
  locale     text not null default 'ar',
  views      integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (day, path, locale)
);
create index if not exists page_views_day_idx on page_views (day);

-- ---------------------------------------------------------------------------
-- row-level security
-- ---------------------------------------------------------------------------

alter table admin_users      enable row level security;
alter table profile          enable row level security;
alter table section_configs  enable row level security;
alter table timeline_entries enable row level security;
alter table case_studies     enable row level security;
alter table certificates     enable row level security;
alter table research_items   enable row level security;
alter table volunteering_items enable row level security;
alter table blog_posts       enable row level security;
alter table faq_items        enable row level security;
alter table resource_items   enable row level security;
alter table testimonials     enable row level security;
alter table contact_messages enable row level security;
alter table page_views       enable row level security;

-- public site: read published content (anonymous visitors)
create policy "public read profile"      on profile          for select using (true);
create policy "public read sections"     on section_configs  for select using (true);
create policy "public read timeline"     on timeline_entries for select using (published);
create policy "public read cases"        on case_studies     for select using (published);
create policy "public read certificates" on certificates     for select using (published);
create policy "public read research"     on research_items   for select using (published);
create policy "public read volunteering" on volunteering_items for select using (published);
create policy "public read blog"         on blog_posts       for select using (published);
create policy "public read faq"          on faq_items        for select using (published);
create policy "public read resources"    on resource_items   for select using (published);
create policy "public read testimonials" on testimonials     for select using (published);

-- contact form: anonymous INSERT only, never readable by anon
-- (mirrors the app's "write-only inbox" design)
create policy "anon insert messages" on contact_messages
  for insert to anon with check (
    char_length(name) between 2 and 120
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(message) between 10 and 2000
  );

-- page views: anonymous callers may only bump the counter via this
-- security-definer function — no direct table access, no reads
create or replace function record_page_view(p_path text, p_locale text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text := left(split_part(p_path, '?', 1), 200);
  v_day  text := to_char(now() at time zone 'utc', 'YYYY-MM-DD');
  v_locale text := case when p_locale = 'en' then 'en' else 'ar' end;
begin
  if v_path !~ '^/' or v_path like '/admin%' then
    return; -- dashboard paths are never tracked
  end if;
  insert into page_views (day, path, locale, views)
  values (v_day, v_path, v_locale, 1)
  on conflict (day, path, locale)
  do update set views = page_views.views + 1, updated_at = now();
end;
$$;

revoke all on page_views from anon, authenticated;
grant execute on function record_page_view(text, text) to anon;

-- ---------------------------------------------------------------------------
-- owner access (the dashboard)
--
-- Option A (recommended): connect the Next.js app with the direct Postgres
-- connection string — Prisma talks to the DB as the table owner and the
-- app's requireAdmin() guard enforces authentication. RLS above stays as
-- defense-in-depth for anything that ever touches the anon key.
--
-- Option B: create a Supabase Auth user for the owner and use the
-- `authenticated` role through PostgREST:
--
--   create policy "owner manage everything" on profile
--     for all to authenticated using (true) with check (true);
--   -- (repeat for each content table)
--   create policy "owner read messages" on contact_messages
--     for select to authenticated using (true);
--   create policy "owner read analytics" on page_views
--     for select to authenticated using (true);
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- storage bucket for dashboard image uploads
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', true, 5242880)  -- public read, 5 MB cap
on conflict (id) do nothing;

-- anyone may read uploaded images (they are public site content)
create policy "public read uploads" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'uploads');

-- only the dashboard (service role / authenticated) may write
create policy "owner write uploads" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'uploads');

create policy "owner update uploads" on storage.objects
  for update to authenticated
  using (bucket_id = 'uploads');

create policy "owner delete uploads" on storage.objects
  for delete to authenticated
  using (bucket_id = 'uploads');
