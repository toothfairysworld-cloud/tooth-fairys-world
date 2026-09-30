#!/bin/bash
# Phase 1 asset pipeline — Openverse free-license search for missing subjects.
# Usage: bash /home/z/my-project/scripts/openverse-search.sh
set -u
OUT=/home/z/my-project/scripts/ov
mkdir -p "$OUT"

search() {
  local name="$1" query="$2"
  [ -s "$OUT/$name.json" ] && { echo "skip $name"; return; }
  echo "openverse: $name — $query"
  curl -s --max-time 30 \
    "https://api.openverse.org/v1/images/?q=$(echo "$query" | sed 's/ /%20/g')&page_size=12&license_type=commercial&extension=jpg" \
    -H "Accept: application/json" -o "$OUT/$name.json"
  sleep 1.5
}

search teeth-smile  "smile teeth closeup"
search teeth-white  "white teeth woman smiling"
search toothbrush   "toothbrush toothpaste bathroom"
search floss        "dental floss teeth"
search ice-water    "glass ice water"
search dental-tools "dental instruments tray"
search dental-xray  "dental x-ray teeth"
search tooth-model  "tooth dental model"
search dentist-work "dentist treating patient clinic"

echo
echo "================ OPENVERSE RESULTS ================"
for f in "$OUT"/*.json; do
  name=$(basename "$f" .json)
  echo "--- $name ---"
  python3 - "$f" <<'EOF'
import json, sys
try:
    d = json.load(open(sys.argv[1]))
    for i, r in enumerate(d.get('results', [])[:12]):
        w = r.get('width') or 0
        h = r.get('height') or 0
        print(f"  [{i}] {w}x{h} | {r['license']}-{r.get('license_version','')} | {r['provider']} | {r['title'][:40]} | {r['url'][:100]}")
except Exception as e:
    print("  ERROR:", e)
EOF
done
