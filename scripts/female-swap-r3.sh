#!/bin/bash
# Round 3: Pexels + extra candidates for a female dentist IN a dental clinic
set -u
FD=/home/z/my-project/scripts/fd
mkdir -p "$FD"

echo "=== Pexels candidates ==="
PEXELS='
pex-01|4173251
pex-02|6528856
pex-03|3845810
pex-04|6529032
pex-05|5216958
pex-06|3845624
pex-07|4173239
pex-08|3762453
pex-09|5207032
pex-10|6129454
pex-11|8376277
pex-12|6621333
'
echo "$PEXELS" | while IFS='|' read -r name id; do
  [ -z "$name" ] && continue
  curl -sL --max-time 30 "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1800" -o "$FD/$name.jpg"
  sz=$(stat -c%s "$FD/$name.jpg" 2>/dev/null || echo 0)
  echo "$name: ${sz} bytes"
done

echo ""
echo "=== Pexels VLM verify ==="
for f in "$FD"/pex-*.jpg; do
  name=$(basename "$f" .jpg)
  sz=$(stat -c%s "$f" 2>/dev/null || echo 0)
  [ "$sz" -lt 20000 ] && { echo "$name: TOO SMALL"; continue; }
  z-ai vision -i "$f" -p "Brief: is the MAIN person a woman? Is she a dentist/medical professional? Attire, setting (dental clinic?), activity, smile visible no mask, orientation, quality. Then rate 1-10 as a cinematic feminine dental website hero." -o "$FD/$name.json" >/dev/null 2>&1
  echo -n "$name: "
  python3 -c "import json;print(json.load(open('$FD/$name.json'))['choices'][0]['message']['content'][:260])" 2>/dev/null || echo "VLM FAILED"
  sleep 2
done
