#!/bin/bash
# Phase 1 asset pipeline — fallback: curated Unsplash candidate pool, VLM-verified.
# Usage: bash /home/z/my-project/scripts/verify-photos.sh
set -u
BASE=/home/z/my-project/scripts
CAND=$BASE/cand
VLM=$BASE/vlm
mkdir -p "$CAND" "$VLM"

# name|unsplash-photo-id
CANDIDATES='
hero-a|1507003211169-0a1dd7228f2d
hero-b|1500648767791-00dcc994a43e
hero-c|1519085360753-af0119f7cbe7
hero-d|1472099645785-5658abf4ff4e
hero-e|1560250097-0b93528c311a
pw-a|1494790108377-be9c29b29330
pw-b|1438761681033-6461ffad8d80
pw-c|1544005313-94ddf0286df2
pw-d|1508214751196-bcfd7ca41a6f
den-a|1606811841689-23dfddce3e95
den-b|1598256989800-fe5f95da9787
den-c|1629909613654-28e377c37b09
den-d|1588776814546-1ffcf47267a5
den-e|1571772996211-2f02c9727629
den-f|1588771930296-88c2cb03f386
den-g|1609840114035-3c981478221b
den-h|1581595220892-b0739db3ba8c
den-i|1583912267550-d6c2ac3196c0
den-j|1579684385127-1ef15d508118
den-k|1576091160550-2173dba999ef
stu-a|1524995997946-a1c2e315a42f
stu-b|1434030216411-0b793f4b4173
stu-c|1522202176988-66273c2fd55f
stu-d|1543269865-cbf427effbad
stu-e|1523240795612-9a054b0db644
kid-a|1503676260728-1c00da094a0b
kid-b|1577896851231-70ef18881754
kid-c|1509062522246-3755977927d7
vol-a|1559027612-c46948ced777
vol-b|1593113646773-028c64a8f1b8
hyg-a|1585771724684-38269d6639fd
hyg-b|1551892312-0f169fa35c88
wat-a|1548839140-29a749e1f422
wat-b|1502740479091-635887520276
'

# --- 1. download thumbnails (parallel, x6) ---
dl() {
  local name="$1" id="$2"
  [ -s "$CAND/$name.jpg" ] && return
  curl -s --max-time 20 -o "$CAND/$name.jpg" "https://images.unsplash.com/photo-$id?w=360&q=60&fm=jpg" || rm -f "$CAND/$name.jpg"
}
while IFS='|' read -r name id; do
  [ -z "$name" ] && continue
  dl "$name" "$id" &
  if (( $(jobs -r | wc -l) >= 6 )); then wait -n 2>/dev/null || wait; fi
done <<< "$CANDIDATES"
wait
echo "downloaded: $(ls "$CAND" | wc -l) thumbs"

# --- 2. VLM-verify (parallel, x4) ---
verify() {
  local name="$1"
  [ -s "$VLM/$name.json" ] && return
  [ -s "$CAND/$name.jpg" ] || return
  z-ai vision -p "Describe the main subject of this image in one short sentence." \
    -i "$CAND/$name.jpg" -o "$VLM/$name.json" >/dev/null 2>&1
}
while IFS='|' read -r name id; do
  [ -z "$name" ] && continue
  verify "$name" &
  if (( $(jobs -r | wc -l) >= 4 )); then wait -n 2>/dev/null || wait; fi
done <<< "$CANDIDATES"
wait

# --- 3. summary table ---
echo
echo "================ VERIFICATION RESULTS ================"
for f in "$VLM"/*.json; do
  name=$(basename "$f" .json)
  desc=$(python3 -c "
import json
try:
    d = json.load(open('$f'))
    print(d['choices'][0]['message']['content'][:130])
except Exception as e:
    print('PARSE ERROR', e)
")
  printf '%-8s | %s\n' "$name" "$desc"
done
echo "====================================================="
