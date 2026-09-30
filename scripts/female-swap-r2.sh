#!/bin/bash
# Round 2: more candidates + hero framing evaluation
set -u
FD=/home/z/my-project/scripts/fd
mkdir -p "$FD"

CANDIDATES='
fden-21|1576091160550-2173dba999ef
fden-22|1584036561566-baf8f5f33b2b
fden-23|1559757175-5700dde675bc
fden-24|1584464491033-06628f3d6b3f
fden-25|1584635977899-1d5e10a7b52e
fden-26|1629909615186-b4e0d6c9d7a2
fden-27|1605294049652-7d7d2b1e2f39
fden-28|1598256646356-fd2e1e5d5a4d
fden-29|1492398660623-2a3c4e5a1a7d
fden-30|1576765608535-5f04d1e3f289
'
echo "=== Round 2 downloads ==="
echo "$CANDIDATES" | while IFS='|' read -r name id; do
  [ -z "$name" ] && continue
  curl -sL --max-time 30 "https://images.unsplash.com/photo-$id?w=1800&q=88&fm=jpg" -o "$FD/$name.jpg"
  sz=$(stat -c%s "$FD/$name.jpg" 2>/dev/null || echo 0)
  echo "$name: ${sz} bytes"
done

echo ""
echo "=== Round 2 VLM verify ==="
for f in "$FD"/fden-{21,22,23,24,25,26,27,28,29,30}.jpg; do
  name=$(basename "$f" .jpg)
  sz=$(stat -c%s "$f" 2>/dev/null || echo 0)
  [ "$sz" -lt 20000 ] && { echo "$name: TOO SMALL"; continue; }
  z-ai vision -i "$f" -p "One short paragraph: person gender+age, attire, activity, setting, orientation, mood." -o "$FD/$name.json" >/dev/null 2>&1
  echo -n "$name: "
  python3 -c "import json;print(json.load(open('$FD/$name.json'))['choices'][0]['message']['content'][:200])" 2>/dev/null || echo "VLM FAILED"
done

echo ""
echo "=== HERO framing evaluation (best candidates) ==="
for name in fden-15 fden-10 fden-14 fden-13 fden-04; do
  f="$FD/$name.jpg"
  [ -f "$f" ] || continue
  z-ai vision -i "$f" -p "Evaluate for a cinematic website hero background: 1) subject position in frame (left/center/right, top/bottom), 2) where is clean dark-able space for large white text overlay, 3) orientation and crop flexibility, 4) light quality, 5) rate 1-10 as a premium hero. Be concrete." -o "$FD/hero-eval-$name.json" >/dev/null 2>&1
  echo "== $name:"
  python3 -c "import json;print(json.load(open('$FD/hero-eval-$name.json'))['choices'][0]['message']['content'][:600])" 2>/dev/null || echo "FAILED"
  echo ""
done
