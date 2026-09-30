#!/bin/bash
# "Rosé Atelier" UI-upgrade verification — new hero ribbon/grain, segmented
# filter bar, gradient counters, aurora sections, dark editorial footer.
# AR + EN, desktop + mobile + dark mode.
set -u
cd /home/z/my-project
SS=/home/z/my-project/scripts/screenshots
mkdir -p "$SS"
PASS=(); FAIL=()

check() {
  if [ "$2" = "0" ]; then PASS+=("$1"); echo "✓ $1"; else FAIL+=("$1"); echo "✗ $1"; fi
}

code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/ 2>/dev/null)
echo "server: HTTP $code"
[ "$code" = "200" ]; check "server-up" $?

for p in "/" "/en"; do
  curl -s -o /dev/null --max-time 90 "http://localhost:3000$p"
done
echo "routes warmed"

# ---------- AR desktop ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5

agent-browser screenshot "$SS/at-ar-1280-hero.png" >/dev/null
title=$(agent-browser get title 2>/dev/null)
echo "title(AR): $title"
[[ "$title" == *جنية* ]]; check "ar-title-tooth-fairy" $?
dir=$(agent-browser eval "document.documentElement.getAttribute('dir')" 2>/dev/null | tr -d '"')
[ "$dir" = "rtl" ]; check "ar-dir-rtl" $?

# hero + new elements
hero=$(agent-browser eval "!!document.getElementById('hero')" 2>/dev/null | tr -d '"')
[ "$hero" = "true" ]; check "hero-exists" $?
grain=$(agent-browser eval "!!document.querySelector('#hero.noise-grain')" 2>/dev/null | tr -d '"')
[ "$grain" = "true" ]; check "hero-grain" $?
ribbon=$(agent-browser eval "!!document.querySelector('#hero .animate-marquee-slow')" 2>/dev/null | tr -d '"')
[ "$ribbon" = "true" ]; check "hero-ribbon-marquee" $?
ribbon_txt=$(agent-browser eval "document.querySelector('#hero .animate-marquee-slow')?.textContent?.includes('2027') || false" 2>/dev/null | tr -d '"')
[ "$ribbon_txt" = "true" ]; check "ribbon-phrases" $?
imgs=$(agent-browser eval "document.querySelector('#hero img')?.getAttribute('src') || 'none'" 2>/dev/null | tr -d '"')
[[ "$imgs" == *hero-portrait* ]]; check "hero-image" $?
hh=$(agent-browser eval "document.getElementById('hero').offsetHeight" 2>/dev/null | tr -d '"')
echo "hero height: $hh"
[ "$hh" -ge 700 ]; check "hero-fullscreen" $?
ow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$ow" -le 1280 ]; check "ar-no-x-overflow-hero" $?

# scroll to cases — segmented filter + bento
agent-browser eval "document.getElementById('cases').scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-1280-cases.png" >/dev/null
fbar=$(agent-browser eval "!!document.querySelector('#cases .glass-light[role=group]')" 2>/dev/null | tr -d '"')
[ "$fbar" = "true" ]; check "segmented-filter-bar" $?
pressed=$(agent-browser eval "document.querySelectorAll('#cases [aria-pressed=true]').length" 2>/dev/null | tr -d '"')
[ "$pressed" = "1" ]; check "filter-one-active" $?
gcards=$(agent-browser eval "document.querySelectorAll('#cases .gradient-border').length" 2>/dev/null | tr -d '"')
echo "gradient-border cards (cases): $gcards"
[ "$gcards" -ge 1 ]; check "featured-gradient-border" $?
spot=$(agent-browser eval "document.querySelectorAll('.spotlight').length" 2>/dev/null | tr -d '"')
echo "spotlight wrappers: $spot"
[ "$spot" -ge 5 ]; check "spotlight-cards" $?

# filter interaction still works
before=$(agent-browser eval "document.querySelectorAll('#cases article').length" 2>/dev/null | tr -d '"')
agent-browser eval "document.querySelectorAll('#cases [role=group] button')[3].click()" >/dev/null
sleep 0.6
after=$(agent-browser eval "document.querySelectorAll('#cases article').length" 2>/dev/null | tr -d '"')
echo "filter cards: $before -> $after"
[ "$after" -lt "$before" ]; check "case-filter-works" $?
agent-browser eval "document.querySelectorAll('#cases [role=group] button')[0].click()" >/dev/null
sleep 0.4

# timeline — aurora + gold badge + gradient counters
agent-browser eval "document.getElementById('experience').scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-1280-timeline.png" >/dev/null
aurora=$(agent-browser eval "getComputedStyle(document.getElementById('experience')).backgroundImage.includes('radial-gradient')" 2>/dev/null | tr -d '"')
[ "$aurora" = "true" ]; check "timeline-aurora-bg" $?
ybadge=$(agent-browser eval "getComputedStyle(document.querySelector('#experience article span')).backgroundImage.includes('gradient')" 2>/dev/null | tr -d '"')
[ "$ybadge" = "true" ]; check "gold-year-badge" $?
gradnum=$(agent-browser eval "const el=[...document.querySelectorAll('#experience dd')].find(d=>d.textContent.trim().length>0); getComputedStyle(el).webkitBackgroundClip==='text' || getComputedStyle(el).backgroundClip==='text'" 2>/dev/null | tr -d '"')
[ "$gradnum" = "true" ]; check "gradient-counters" $?

# testimonials marquee cards
agent-browser eval "document.getElementById('testimonials').scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-1280-testimonials.png" >/dev/null
tcard=$(agent-browser eval "document.querySelectorAll('#testimonials .gradient-border').length" 2>/dev/null | tr -d '"')
echo "gradient-border testimonial cards: $tcard"
[ "$tcard" -ge 8 ]; check "testimonial-gradient-cards" $?

# footer — dark editorial
agent-browser eval "document.querySelector('[data-site-footer]').scrollIntoView({block:'end'})" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-1280-footer.png" >/dev/null
fbg=$(agent-browser eval "getComputedStyle(document.querySelector('[data-site-footer]')).backgroundColor" 2>/dev/null | tr -d '"')
echo "footer bg: $fbg"
echo "$fbg" | grep -qE "191114|25, 17, 20"; check "footer-dark-plum" $?
wm=$(agent-browser eval "[...document.querySelectorAll('[data-site-footer] div[aria-hidden=true]')].some(d=>d.textContent.includes('سارة'))" 2>/dev/null | tr -d '"')
[ "$wm" = "true" ]; check "footer-watermark-name" $?
disc=$(agent-browser eval "document.querySelector('[data-site-footer]').textContent.includes('محفظة أكاديمية')" 2>/dev/null | tr -d '"')
[ "$disc" = "true" ]; check "footer-disclaimer-kept" $?
btt=$(agent-browser eval "!!document.querySelector('[data-site-footer] a[href=\"#hero\"]')" 2>/dev/null | tr -d '"')
[ "$btt" = "true" ]; check "footer-back-to-top" $?

# FAQ accordion
agent-browser eval "document.getElementById('ask').scrollIntoView()" >/dev/null
sleep 0.8
agent-browser eval "document.querySelector('#ask [data-state=closed]')?.click() || document.querySelector('#ask button[aria-expanded]').click()" >/dev/null
sleep 0.6
faq_open=$(agent-browser eval "document.querySelectorAll('#ask [data-state=open]').length" 2>/dev/null | tr -d '"')
echo "open FAQ items: $faq_open"
[ "$faq_open" -ge 1 ]; check "faq-accordion-opens" $?

# page errors
errs=$(agent-browser errors 2>/dev/null | grep -c "error" || true)
echo "page errors: $errs"
[ "$errs" = "0" ]; check "ar-zero-errors" $?

# ---------- EN desktop ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/en >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5
agent-browser screenshot "$SS/at-en-1280-hero.png" >/dev/null
etitle=$(agent-browser get title 2>/dev/null)
echo "title(EN): $etitle"
[[ "$etitle" == *Tooth* ]]; check "en-title-tooth-fairy" $?
edir=$(agent-browser eval "document.documentElement.getAttribute('dir')" 2>/dev/null | tr -d '"')
[ "$edir" = "ltr" ]; check "en-dir-ltr" $?
eribbon=$(agent-browser eval "document.querySelector('#hero .animate-marquee-slow')?.textContent?.includes('Class of 2027') || false" 2>/dev/null | tr -d '"')
[ "$eribbon" = "true" ]; check "en-ribbon-phrases" $?
eow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$eow" -le 1280 ]; check "en-no-x-overflow" $?
agent-browser eval "document.querySelector('[data-site-footer]').scrollIntoView({block:'end'})" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-en-1280-footer.png" >/dev/null
ewm=$(agent-browser eval "[...document.querySelectorAll('[data-site-footer] div[aria-hidden=true]')].some(d=>d.textContent.includes('Tooth Fairy'))" 2>/dev/null | tr -d '"')
[ "$ewm" = "true" ]; check "en-footer-watermark" $?
eerrs=$(agent-browser errors 2>/dev/null | grep -c "error" || true)
[ "$eerrs" = "0" ]; check "en-zero-errors" $?

# ---------- AR mobile 360 ----------
agent-browser set viewport 360 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5
agent-browser screenshot "$SS/at-ar-360-hero.png" >/dev/null
mow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
echo "mobile scrollWidth: $mow"
[ "$mow" -le 360 ]; check "ar-360-no-x-overflow" $?
mrib=$(agent-browser eval "!!document.querySelector('#hero .animate-marquee-slow')" 2>/dev/null | tr -d '"')
[ "$mrib" = "true" ]; check "ar-360-ribbon" $?
agent-browser eval "document.querySelector('[data-site-footer]').scrollIntoView({block:'end'})" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-360-footer.png" >/dev/null
mow2=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$mow2" -le 360 ]; check "ar-360-footer-no-overflow" $?
merr=$(agent-browser errors 2>/dev/null | grep -c "error" || true)
[ "$merr" = "0" ]; check "ar-360-zero-errors" $?

# ---------- dark mode (AR desktop) ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2
agent-browser eval "localStorage.setItem('theme','dark'); document.documentElement.classList.add('dark')" >/dev/null
sleep 1.5
agent-browser screenshot "$SS/at-ar-dark-1280-hero.png" >/dev/null
agent-browser eval "document.getElementById('cases').scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-dark-1280-cases.png" >/dev/null
agent-browser eval "document.querySelector('[data-site-footer]').scrollIntoView({block:'end'})" >/dev/null
sleep 1
agent-browser screenshot "$SS/at-ar-dark-1280-footer.png" >/dev/null
derr=$(agent-browser errors 2>/dev/null | grep -c "error" || true)
[ "$derr" = "0" ]; check "dark-zero-errors" $?

# sticky footer contract
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2
foot_h=$(agent-browser eval "document.querySelector('[data-site-footer]').offsetHeight" 2>/dev/null | tr -d '"')
echo "footer height: $foot_h"
[ "$foot_h" -ge 200 ]; check "footer-substantial" $?

echo
echo "======================================"
echo "PASS: ${#PASS[@]}  FAIL: ${#FAIL[@]}"
if [ ${#FAIL[@]} -gt 0 ]; then printf 'FAILED: %s\n' "${FAIL[@]}"; exit 1; fi
echo "ALL CHECKS PASSED"
