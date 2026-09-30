#!/bin/bash
# Phase 2/3 regression — public site (AR+EN) after the DB migration,
# admin smoke checks, and layout stability at three widths.
set -u
cd /home/z/my-project
SS=/home/z/my-project/scripts/screenshots
mkdir -p "$SS"
PASS=(); FAIL=()

check() {
  if [ "$2" = "0" ]; then PASS+=("$1"); echo "✓ $1"; else FAIL+=("$1"); echo "✗ $1"; fi
}

agent-browser set viewport 1280 800 >/dev/null

# ---------------------------------------------------------------- public AR
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
T=$(agent-browser get title)
[[ "$T" == *"سارة الراشد"* ]] ; check "AR title" $?
D=$(agent-browser eval "document.documentElement.dir" | tr -d '[]" ')
[ "$D" = "rtl" ] ; check "AR dir=rtl" $?
L=$(agent-browser eval "document.documentElement.lang" | tr -d '[]" ')
[ "$L" = "ar" ] ; check "AR lang=ar" $?

# hero scrim + pill navbar + full-bleed image
H=$(agent-browser eval "!!document.querySelector('.hero-scrim')")
[ "$H" = "true" ] ; check "hero gradient scrim present" $?
I=$(agent-browser eval "!!document.querySelector('#hero img')")
[ "$I" = "true" ] ; check "hero full-bleed image" $?

# all 11 content sections render from DB
SECTIONS=$(agent-browser eval "['about','experience','cases','certificates','research','volunteering','blog','ask','resources','testimonials','contact'].filter(id=>document.getElementById(id)).length")
[ "$SECTIONS" = "11" ] ; check "11 sections rendered from DB" $?

# timeline has 6 DB entries
TL=$(agent-browser get count "#experience h3")
[ "$TL" = "6" ] ; check "timeline 6 entries" $?

# case filter interaction (6 → filtered)
agent-browser find text "علاج الجذور" click >/dev/null 2>&1
sleep 1
CARDS=$(agent-browser eval "document.querySelectorAll('#cases a[href*=\"/cases/\"]').length")
[ "$CARDS" -gt 0 ] 2>/dev/null; check "case filter works" $?
agent-browser find text "الكل" click >/dev/null 2>&1
sleep 1

# FAQ accordion
agent-browser eval "document.getElementById('ask').scrollIntoView({behavior:'instant'})" >/dev/null
sleep 1
agent-browser find role button click --name "$(agent-browser get text '#ask h3')" >/dev/null 2>&1

# footer disclaimer
FD=$(agent-browser eval "document.body.textContent.includes('محفظة أكاديمية')")
[ "$FD" = "true" ] ; check "footer academic disclaimer" $?

# no horizontal overflow 1280
OV=$(agent-browser eval "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
[ "$OV" = "false" ] ; check "no x-overflow @1280 AR" $?

agent-browser screenshot "$SS/r4-ar-1280-full.png" --full >/dev/null

# ---------------------------------------------------------------- public EN
agent-browser open http://localhost:3000/en >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
T2=$(agent-browser get title)
[[ "$T2" == *"Sarah Al-Rashid"* ]] ; check "EN title" $?
D2=$(agent-browser eval "document.documentElement.dir" | tr -d '[]" ')
[ "$D2" = "ltr" ] ; check "EN dir=ltr" $?
OV2=$(agent-browser eval "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
[ "$OV2" = "false" ] ; check "no x-overflow @1280 EN" $?

# ---------------------------------------------------------------- detail pages
agent-browser open http://localhost:3000/cases/anterior-composite >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
CS=$(agent-browser get title)
[[ "$CS" == *"ترميم سن أمامي"* ]] ; check "case detail from DB" $?

agent-browser open http://localhost:3000/en/blog/brushing-technique >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
BT=$(agent-browser get title)
[[ "$BT" == *"Brush"* ]] ; check "blog article loads EN" $?
B=$(agent-browser eval "document.querySelectorAll('article h2').length")
[ "$B" -gt 1 ] 2>/dev/null; check "blog blocks render" $?

# ---------------------------------------------------------------- mobile 360
agent-browser set viewport 360 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1
sleep 1
OV3=$(agent-browser eval "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
[ "$OV3" = "false" ] ; check "no x-overflow @360 AR" $?
agent-browser screenshot "$SS/r4-ar-360.png" >/dev/null

# mobile drawer
agent-browser eval "window.scrollTo(0,0)" >/dev/null
agent-browser find role button click --name "فتح القائمة الرئيسية" >/dev/null 2>&1
sleep 1
DR=$(agent-browser eval "!!document.querySelector('[data-state=open]')" | tr -d '[]" ')
[ "$DR" = "true" ] ; check "mobile drawer opens" $?

# ---------------------------------------------------------------- errors
EP=$(agent-browser errors | grep -c "Error\|error" || true)
[ "$EP" = "0" ] ; check "zero page errors" $?

echo ""
echo "PASS: ${#PASS[@]}  FAIL: ${#FAIL[@]}"
if [ ${#FAIL[@]} -gt 0 ]; then printf 'FAILED: %s\n' "${FAIL[@]}"; exit 1; fi
