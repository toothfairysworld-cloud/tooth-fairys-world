#!/bin/bash
# Phase 1 asset pipeline — sequential VLM verification with 429 backoff.
# Usage: bash /home/z/my-project/scripts/verify-remaining.sh
set -u
BASE=/home/z/my-project/scripts
CAND=$BASE/cand
VLM=$BASE/vlm

# Remove invalid (HTML body) downloads
for f in "$CAND"/*.jpg; do
  if ! file "$f" | grep -q "JPEG image data"; then rm -f "$f"; fi
done

remaining() {
  for f in "$CAND"/*.jpg; do
    name=$(basename "$f" .jpg)
    [ -s "$VLM/$name.json" ] || echo "$name"
  done
}

while true; do
  TODO=$(remaining)
  [ -z "$TODO" ] && break
  name=$(echo "$TODO" | head -1)
  ok=0
  for attempt in 1 2 3; do
    z-ai vision -p "Describe the main subject of this image in one short sentence." \
      -i "$CAND/$name.jpg" -o "$VLM/$name.json" >/dev/null 2>&1
    if [ -s "$VLM/$name.json" ]; then ok=1; break; fi
    sleep $((attempt * 20))
  done
  if [ "$ok" = "1" ]; then echo "verified: $name"; else echo "FAILED: $name"; touch "$VLM/$name.failed"; fi
  sleep 6
done

echo
echo "================ RESULTS ================"
for f in "$VLM"/*.json; do
  name=$(basename "$f" .json)
  desc=$(python3 -c "
import json
try:
    d = json.load(open('$f'))
    print(d['choices'][0]['message']['content'][:140])
except Exception:
    print('PARSE ERROR')
")
  printf '%-8s | %s\n' "$name" "$desc"
done
