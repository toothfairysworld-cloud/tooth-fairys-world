#!/bin/bash
# Female persona swap — Phase 1.5 redesign asset pipeline.
# 1) VLM-audit existing person images for male subjects
# 2) Download female-dentist candidate pool from Unsplash (direct CDN, free license)
# 3) VLM-verify each candidate
set -u
BASE=/home/z/my-project/scripts
FD=$BASE/fd
mkdir -p "$FD"

echo "=== VLM audit of existing site images ==="
for img in about-1 about-2 about-3 vol-1 vol-2 vol-3 blog-1 blog-2 blog-3 blog-4; do
  f=/home/z/my-project/public/images/$img.webp
  [ -f "$f" ] || continue
  z-ai vision -i "$f" -p "One line: are there any PEOPLE in this image? If yes, state each person's gender and role (dentist/patient/other) and whether they are the main subject." -o "$FD/audit-$img.json" >/dev/null 2>&1
  echo -n "$img: "
  python3 -c "import json;print(json.load(open('$FD/audit-$img.json'))['choices'][0]['message']['content'][:160])" 2>/dev/null || echo "FAILED"
done

echo ""
echo "=== Downloading female-dentist candidate pool ==="
CANDIDATES='
fden-01|1609840114035-3c981478221b
fden-02|1588776814546-1ffcf47267a5
fden-03|1598256989800-fe5f95da9787
fden-04|1571772996211-2f02c9727629
fden-05|1588771930296-88c2cb03f386
fden-06|1581595220892-b0739db3ba8c
fden-07|1583912267550-d6c2ac3196c0
fden-08|1579684385127-1ef15d508118
fden-09|1576091160399-112ba8d25d1f
fden-10|1559839734-2b71ea197ec2
fden-11|1537368910025-700350fe46c7
fden-12|1582750433449-648ed127bb54
fden-13|1607746882042-944635dfe10e
fden-14|1580489944761-15a19d654956
fden-15|1591604021695-0c69b7c05981
fden-16|1587854692152-cbe660dbde88
fden-17|1606811841689-23dfddce3e95
fden-18|1629909613654-28e377c37b09
fden-19|1573496985817-8b1f5b2a8d94
fden-20|1595406064586-5c5b6d2b3f2f
'
echo "$CANDIDATES" | while IFS='|' read -r name id; do
  [ -z "$name" ] && continue
  curl -sL --max-time 30 "https://images.unsplash.com/photo-$id?w=1800&q=88&fm=jpg" -o "$FD/$name.jpg"
  sz=$(stat -c%s "$FD/$name.jpg" 2>/dev/null || echo 0)
  echo "$name: ${sz} bytes"
done

echo ""
echo "=== VLM verification of candidates ==="
for f in "$FD"/fden-*.jpg; do
  name=$(basename "$f" .jpg)
  sz=$(stat -c%s "$f" 2>/dev/null || echo 0)
  [ "$sz" -lt 20000 ] && { echo "$name: TOO SMALL, skip"; continue; }
  z-ai vision -i "$f" -p "Describe precisely: person gender, apparent age range, attire, activity/pose, setting, image orientation (portrait/landscape/square), resolution feel, overall mood. One short paragraph." -o "$FD/$name.json" >/dev/null 2>&1
  echo -n "$name: "
  python3 -c "import json;print(json.load(open('$FD/$name.json'))['choices'][0]['message']['content'][:220])" 2>/dev/null || echo "VLM FAILED"
done
