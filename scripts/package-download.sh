#!/bin/bash
# Package the full project source for local download/backup.
# Excludes build artifacts, deps, logs, and internal platform dirs.
set -euo pipefail

PROJECT=/home/z/my-project
OUT_DIR="$PROJECT/download"
ZIP="$OUT_DIR/toothfairysworld-source.zip"
STAGE=$(mktemp -d)

echo "Staging source files..."
mkdir -p "$STAGE/toothfairysworld"

cd "$PROJECT"

# Core source + config
rsync -a --exclude node_modules --exclude .next --exclude .git \
  --exclude dev.log --exclude server.log --exclude tsconfig.tsbuildinfo \
  --exclude '*.log' \
  src prisma public db scripts CREDITS.md \
  package.json bun.lock next.config.ts tailwind.config.ts postcss.config.mjs \
  tsconfig.json components.json eslint.config.mjs next-env.d.ts \
  .gitignore \
  "$STAGE/toothfairysworld/" 2>/dev/null || true

# Seed script lives in scripts/ already? verify; else copy
[ -f "$STAGE/toothfairysworld/scripts/seed.ts" ] || echo "NOTE: seed.ts not in scripts/" >&2

# Include the Supabase launch kit + download README (go-live instructions)
mkdir -p "$STAGE/toothfairysworld/launch-kit"
rsync -a "$OUT_DIR/supabase-migration/" "$STAGE/toothfairysworld/launch-kit/" 2>/dev/null || true

# Keep screenshots dir lightweight: skip it (not needed to run)

echo "Writing local-run README..."
cat > "$STAGE/toothfairysworld/RUN-ON-YOUR-PC.md" <<'EOF'
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
EOF

# .env.example for local runs
cat > "$STAGE/toothfairysworld/.env.example" <<'EOF'
DATABASE_URL="file:./db/custom.db"
EOF

# SQLite db file — include the seeded data so it works out of the box
if [ -f "$PROJECT/db/custom.db" ]; then
  cp "$PROJECT/db/custom.db" "$STAGE/toothfairysworld/db/custom.db"
fi

echo "Zipping..."
cd "$STAGE"
rm -f "$ZIP"
zip -qr "$ZIP" toothfairysworld
rm -rf "$STAGE"

ls -lh "$ZIP"
echo "DONE"
