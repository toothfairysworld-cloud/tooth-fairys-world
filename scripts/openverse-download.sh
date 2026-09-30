#!/bin/bash
# Phase 1 asset pipeline — download Openverse picks + VLM verify.
# Usage: bash /home/z/my-project/scripts/openverse-download.sh
set -u
BASE=/home/z/my-project/scripts
CAND=$BASE/cand
VLM=$BASE/vlm
mkdir -p "$CAND" "$VLM"

# name|url
PICKS='
ov-teeth-1|https://live.staticflickr.com/25/99860428_0a1b95ed3b_b.jpg
ov-teeth-2|https://live.staticflickr.com/6055/6267947182_bba8c7d693_b.jpg
ov-teeth-3|https://live.staticflickr.com/6039/6294892436_9c45ff6ac9_b.jpg
ov-teeth-4|https://live.staticflickr.com/2421/3646863034_d0e18000d9_b.jpg
ov-teeth-5|https://live.staticflickr.com/1035/605143992_5d558ad361_b.jpg
ov-teeth-6|https://live.staticflickr.com/78/177784859_c562bf21cc_b.jpg
ov-tools-1|https://pd.w.org/2026/04/67469efbf72491a05.40591059-2048x1536.jpg
ov-xray-1|https://live.staticflickr.com/8216/8317014004_b8cc28285d_b.jpg
ov-xray-2|https://live.staticflickr.com/249/456498004_5dfb5ab032_b.jpg
ov-floss-1|https://upload.wikimedia.org/wikipedia/commons/a/aa/Dental_flossing_9344.JPG
ov-water-1|https://live.staticflickr.com/7215/7190209429_6d6b828104_b.jpg
ov-brush-1|https://live.staticflickr.com/65535/11693757123_3dae068266_b.jpg
ov-brush-2|https://live.staticflickr.com/5471/11693522135_36af35917c_b.jpg
ov-brush-3|https://live.staticflickr.com/2692/4320286404_634d168e07_b.jpg
'

while IFS='|' read -r name url; do
  [ -z "$name" ] && continue
  if [ ! -s "$CAND/$name.jpg" ]; then
    curl -sL --max-time 30 -o "$CAND/$name.jpg" "$url" || rm -f "$CAND/$name.jpg"
  fi
  if [ -s "$CAND/$name.jpg" ] && [ ! -s "$VLM/$name.json" ]; then
    for attempt in 1 2 3; do
      z-ai vision -p "Describe the main subject of this image in one short sentence." \
        -i "$CAND/$name.jpg" -o "$VLM/$name.json" >/dev/null 2>&1
      [ -s "$VLM/$name.json" ] && break
      sleep $((attempt * 20))
    done
    echo "verified: $name"
    sleep 5
  fi
done <<< "$PICKS"

echo
echo "================ OPENVERSE PICKS ================"
for n in ov-teeth-1 ov-teeth-2 ov-teeth-3 ov-teeth-4 ov-teeth-5 ov-teeth-6 ov-tools-1 ov-xray-1 ov-xray-2 ov-floss-1 ov-water-1 ov-brush-1 ov-brush-2 ov-brush-3; do
  if [ -s "$VLM/$n.json" ]; then
    desc=$(python3 -c "
import json
try:
    d = json.load(open('$VLM/$n.json'))
    print(d['choices'][0]['message']['content'][:120])
except Exception:
    print('PARSE ERROR')
")
    printf '%-11s | %s\n' "$n" "$desc"
  else
    printf '%-11s | (no image or failed)\n' "$n"
  fi
done
