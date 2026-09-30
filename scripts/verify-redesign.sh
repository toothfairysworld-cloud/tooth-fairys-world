#!/bin/bash
# Phase 1.5 redesign verification — screenshots + checks for the new
# cinematic hero / floating navbar / rose palette, AR + EN, 3 viewports.
set -u
cd /home/z/my-project
SS=/home/z/my-project/scripts/screenshots
mkdir -p "$SS"
PASS=(); FAIL=()

check() {
  if [ "$2" = "0" ]; then PASS+=("$1"); echo "✓ $1"; else FAIL+=("$1"); echo "✗ $1"; fi
}

# server assumed running; verify
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/ 2>/dev/null)
echo "server: HTTP $code"
[ "$code" = "200" ]; check "server-up" $?

for p in "/" "/en" "/cases" "/en/blog/brushing-technique" "/en/credits"; do
  curl -s -o /dev/null --max-time 90 "http://localhost:3000$p"
done
echo "routes warmed"

# ---------- AR desktop ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5

agent-browser screenshot "$SS/r2-ar-1280-hero.png" >/dev/null
title=$(agent-browser get title 2>/dev/null)
echo "title(AR): $title"
[[ "$title" == *جنية* ]]; check "ar-title-tooth-fairy" $?
dir=$(agent-browser eval "document.documentElement.getAttribute('dir')" 2>/dev/null | tr -d '"')
[ "$dir" = "rtl" ]; check "ar-dir-rtl" $?

# hero present + scrim + fixed header pill
hero=$(agent-browser eval "!!document.getElementById('hero')" 2>/dev/null | tr -d '"')
[ "$hero" = "true" ]; check "hero-exists" $?
scrim=$(agent-browser eval "!!document.querySelector('.hero-scrim')" 2>/dev/null | tr -d '"')
[ "$scrim" = "true" ]; check "hero-scrim" $?
pill=$(agent-browser eval "!!document.querySelector('[data-nav-pill]')" 2>/dev/null | tr -d '"')
[ "$pill" = "true" ]; check "nav-pill" $?
imgs=$(agent-browser eval "document.querySelector('#hero img')?.getAttribute('src') || 'none'" 2>/dev/null | tr -d '"')
echo "hero img: $imgs"
[[ "$imgs" == *hero-portrait* ]]; check "hero-image" $?

# hero height ~ viewport
hh=$(agent-browser eval "document.getElementById('hero').offsetHeight" 2>/dev/null | tr -d '"')
echo "hero height: $hh (viewport 800)"
[ "$hh" -ge 700 ]; check "hero-fullscreen" $?

# overflow check
ow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
echo "scrollWidth: $ow"
[ "$ow" -le 1280 ]; check "ar-no-x-overflow" $?

# scroll past hero — navbar becomes light pill
agent-browser eval "window.scrollTo(0, 900)" >/dev/null
sleep 0.5
agent-browser eval "window.scrollTo(0, 850)" >/dev/null
sleep 0.8
agent-browser screenshot "$SS/r2-ar-1280-scrolled-nav.png" >/dev/null
navbg=$(agent-browser eval "getComputedStyle(document.querySelector('[data-nav-pill]')).getPropertyValue('background-color')" 2>/dev/null)
echo "nav bg scrolled: $navbg"

# scroll to bottom for sections + footer
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-ar-1280-bottom.png" >/dev/null

# mid-page screenshot (about section)
agent-browser eval "document.getElementById('about')?.scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-ar-1280-about.png" >/dev/null

# body font + heading font check (Amiri loaded for AR headings)
hf=$(agent-browser eval "getComputedStyle(document.querySelector('#about h2') || document.querySelector('h2')).fontFamily" 2>/dev/null)
echo "AR h2 font: $hf"
case "$hf" in *Amiri*|*amiri*) ok=0;; *) ok=1;; esac
check "ar-heading-amiri" $?

# ---------- EN desktop ----------
agent-browser open http://localhost:3000/en >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5
agent-browser screenshot "$SS/r2-en-1280-hero.png" >/dev/null
title=$(agent-browser get title 2>/dev/null)
echo "title(EN): $title"
[[ "$title" == *Tooth* ]]; check "en-title-tooth-fairy" $?
lang=$(agent-browser eval "document.documentElement.getAttribute('lang')" 2>/dev/null | tr -d '"')
[ "$lang" = "en" ]; check "en-lang" $?
hf=$(agent-browser eval "getComputedStyle(document.querySelector('#hero h1')).fontFamily" 2>/dev/null)
echo "EN h1 font: $hf"
case "$hf" in *Fraunces*|*fraunces*) ok=0;; *) ok=1;; esac
check "en-heading-fraunces" $?
style=$(agent-browser eval "getComputedStyle(document.querySelector('#hero h1')).fontStyle" 2>/dev/null | tr -d '"')
[ "$style" = "italic" ]; check "en-hero-italic" $?

agent-browser eval "window.scrollTo(0, 900)" >/dev/null
sleep 0.8
agent-browser screenshot "$SS/r2-en-1280-scrolled-nav.png" >/dev/null
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-en-1280-bottom.png" >/dev/null

# dark mode
agent-browser eval "document.querySelector('[aria-pressed]').click()" >/dev/null 2>&1 || true
sleep 1
agent-browser eval "window.scrollTo(0, 0)" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-en-1280-dark-hero.png" >/dev/null
agent-browser eval "document.getElementById('about')?.scrollIntoView()" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-en-1280-dark-about.png" >/dev/null

# ---------- mobile 360 ----------
agent-browser set viewport 360 780 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2.5
agent-browser screenshot "$SS/r2-ar-360-hero.png" >/dev/null
ow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$ow" -le 360 ]; check "ar-360-no-overflow" $?
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)" >/dev/null
sleep 1
agent-browser screenshot "$SS/r2-ar-360-bottom.png" >/dev/null

agent-browser open http://localhost:3000/en >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2
agent-browser screenshot "$SS/r2-en-360-hero.png" >/dev/null
ow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$ow" -le 360 ]; check "en-360-no-overflow" $?

# ---------- tablet 768 ----------
agent-browser set viewport 768 1024 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2
agent-browser screenshot "$SS/r2-ar-768-hero.png" >/dev/null
ow=$(agent-browser eval "document.documentElement.scrollWidth" 2>/dev/null | tr -d '"')
[ "$ow" -le 768 ]; check "ar-768-no-overflow" $?

# ---------- errors ----------
errs=$(agent-browser eval "window.__nextErrors ? window.__nextErrors.length : 0" 2>/dev/null | tr -d '"')
echo "client errors (instrumented): $errs"

echo ""
echo "PASS: ${#PASS[@]}  FAIL: ${#FAIL[@]}"
[ ${#FAIL[@]} -eq 0 ] && echo "ALL CHECKS PASSED" || echo "FAILED: ${FAIL[*]}"
