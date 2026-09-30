# Tooth Fairy's World — Run on your own PC

Bilingual (English / Arabic RTL) academic portfolio for a fifth-year dental
student, with a full content dashboard at /admin.

## Requirements
- Node.js 20+ (or Bun 1.1+)
- npm (or bun)

## Quick start (local, SQLite — zero external services)

```bash
npm install                 # or: bun install
cp .env.example .env        # create if missing, see below
npx prisma db push          # creates SQLite db/custom.db
npm run dev                 # or: bun run dev
```

Open http://localhost:3000 (English) and http://localhost:3000/ar (Arabic).

### .env contents (local SQLite)
```
DATABASE_URL="file:./db/custom.db"
```

### Seed the demo content
```bash
npx tsx scripts/seed.ts     # or: bun run scripts/seed.ts
```

### Admin dashboard
- URL:  http://localhost:3000/admin
- Email: admin@toothfairysworld.com
- Password: ToothFairy2027!   (change it from the dashboard after first login)

## Production
- `npm run build && npm start`
- For Supabase + Vercel + custom domain, follow
  `launch-kit/MIGRATION_GUIDE.md` (bilingual step-by-step).

## Notes
- Security headers (X-Frame-Options / frame-ancestors) are automatically
  strict in production and relaxed in dev so sandbox previews can embed.
- All images are free-license; see CREDITS.md.
