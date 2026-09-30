#!/bin/bash
# Phase 1 asset pipeline — step 1: image search (saves JSON results)
# Usage: bash /home/z/my-project/scripts/search-images.sh
set -u
OUT=/home/z/my-project/scripts/img
mkdir -p "$OUT"

run() {
  local name="$1"; shift
  local query="$1"; shift
  if [ -s "$OUT/$name.json" ]; then echo "skip $name (exists)"; return; fi
  echo "searching: $name — $query"
  z-ai image-search -q "$query" -c 4 --gl us --no-rank -o "$OUT/$name.json" >/dev/null 2>&1
  echo "  -> $name done"
}

# Batch 1 — hero, about, female smile cases
run hero            "young arab man dental student portrait in white coat smiling in a modern dental clinic" &
run about-1         "dental student studying with books and laptop at university library" &
run about-2         "modern dental clinic interior with dental chair and equipment" &
run about-3         "dental instruments arranged on a tray in a clinic closeup" &
run case-female     "young woman smiling with healthy white teeth closeup portrait" &
wait

# Batch 2 — male smile cases, xray, gum, volunteering
run case-male       "man smiling showing healthy teeth closeup portrait" &
run case-xray       "dental x-ray radiograph of molar teeth" &
run case-gum        "dentist examining patient gums with dental mirror in clinic" &
run vol-1           "volunteer teaching children how to brush teeth at school" &
run vol-2           "community health campaign volunteers at outdoor tent" &
wait

# Batch 3 — mentoring, blog covers, crown model
run vol-3           "university students group mentoring discussion at table" &
run blog-1          "toothbrush and toothpaste tube on bathroom sink" &
run blog-3          "glass of ice cold water with condensation droplets" &
run blog-4          "dental floss being used between teeth closeup" &
run case-crown      "dental crown ceramic teeth model closeup" &
wait

echo "ALL SEARCHES DONE"
for f in "$OUT"/*.json; do
  n=$(grep -o '"original_url"' "$f" | wc -l)
  echo "$(basename "$f"): $n urls"
done
