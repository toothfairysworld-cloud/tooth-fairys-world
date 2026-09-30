#!/bin/bash
# Phase 1 verification — boots dev server, drives agent-browser through
# both locales at 360/768/1280, exercises core interactivity.
set -u
cd /home/z/my-project
SS=/home/z/my-project/scripts/screenshots
mkdir -p "$SS"
PASS=(); FAIL=()

check() { # name, condition
  if [ "$2" = "0" ]; then PASS+=("$1"); echo "✓ $1"; else FAIL+=("$1"); echo "✗ $1"; fi
}

# ---------- 1. boot dev server ----------
pkill -f "next dev" 2>/dev/null; sleep 1
setsid nohup bun run dev > /dev/null 2>&1 &
code=""
for i in $(seq 1 45); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 2
done
echo "server boot: HTTP $code"
[ "$code" = "200" ]; check "dev-server-boot" $?

# warm all routes (first-visit compile in dev)
for p in "/" "/en" "/cases" "/en/cases" "/cases/anterior-composite" "/en/blog/brushing-technique" "/blog" "/en/credits" "/en/privacy" "/nope"; do
  curl -s -o /dev/null --max-time 90 "http://localhost:3000$p"
done
echo "routes warmed"

# ---------- 2. desktop AR ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null
agent-browser wait --load networkidle >/dev/null 2>&1 || true
sleep 2
agent-browser screenshot "$SS/ar-1280-hero.png" >/dev/null
title=$(agent-browser get title 2>/dev/null)
echo "title(AR): $title"
[[ "$title" == *سارة* ]]; check "ar-title" $?
dir=$(agent-browser eval "document.documentElement.getAttribute('dir')" 2>/dev/null | tr -d '"' )
[ "$dir" = "rtl" ]; check "ar-dir-rtl" $?
lang=$(agent-browser eval "document.documentElement.getAttribute('lang')" 2>/dev/null | tr -d '"' )
[ "$lang" = "ar" ]; check "ar-lang" $?

# scroll to bottom progressively for reveal animations + lazy sections
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)" >/dev/null 2>&1
sleep 1
agent-browser screenshot --full "$SS/ar-1280-full.png" >/dev/null
h=$(agent-browser eval "document.body.scrollHeight" 2>/dev/null)
echo "page height: $h px"
# sticky footer check: scrolled to end, footer bottom == viewport bottom-ish
footer=$(agent-browser eval "Math.abs((document.querySelector('[data-site-footer]').getBoundingClientRect().bottom + window.scrollY) - document.body.scrollHeight)" 2>/dev/null | tr -d '"' )
echo "footer gap: $footer"
footOK=$(python3 -c "print(1 if $footer < 40 else 0)" 2>/dev/null || echo 0)
[ "$footOK" = "1" ]; check "sticky-footer-AR" $?

# overflow check at 1280
ovf=$(agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth" 2>/dev/null)
ovfOK=$(python3 -c "print(1 if $ovf <= 2 else 0)")
[ "$ovfOK" = "1" ]; check "no-horizontal-overflow-1280-AR" $?

# ---------- 3. theme toggle ----------
agent-browser eval "window.scrollTo(0,0)" >/dev/null
agent-browser find role button click --name "تبديل الوضع الفاتح والداكن" >/dev/null 2>&1
sleep 1
dark=$(agent-browser eval "document.documentElement.classList.contains('dark')" 2>/dev/null | tr -d '"' )
echo "dark mode: $dark"
[ "$dark" = "true" ]; check "theme-toggle-dark" $?
agent-browser screenshot "$SS/ar-1280-dark-hero.png" >/dev/null
agent-browser find role button click --name "تبديل الوضع الفاتح والداكن" >/dev/null 2>&1; sleep 0.5

# ---------- 4. case filter ----------
agent-browser eval "document.querySelector('#cases').scrollIntoView({behavior:'instant'})" >/dev/null
sleep 1
before=$(agent-browser get count "a[href*='/cases/']" 2>/dev/null | tr -d '"' )
echo "cases visible before filter: $before"
# click the "الحشوات" filter chip (2nd chip)
agent-browser find role button click --name "الحشوات" >/dev/null 2>&1; sleep 0.8
after=$(agent-browser get count "a[href*='/cases/']" 2>/dev/null | tr -d '"' )
echo "cases after filter 'fillings': $after"
filterOK=$(python3 -c "print(1 if $after < $before else 0)")
[ "$filterOK" = "1" ]; check "case-filter-chips" $?
agent-browser screenshot "$SS/ar-1280-cases-filtered.png" >/dev/null

# ---------- 5. before/after slider keyboard ----------
agent-browser eval "document.querySelector('[role=slider]').focus()" >/dev/null
v1=$(agent-browser eval "document.querySelector('[role=slider]').getAttribute('aria-valuenow')" 2>/dev/null)
agent-browser press ArrowLeft >/dev/null 2>&1
v2=$(agent-browser eval "document.querySelector('[role=slider]').getAttribute('aria-valuenow')" 2>/dev/null)
echo "slider: $v1 -> $v2 (ArrowLeft in RTL = +toward end)"
slideOK=$(python3 -c "print(1 if $v2 != $v1 else 0)")
[ "$slideOK" = "1" ]; check "slider-keyboard-rtl" $?

# ---------- 6. FAQ accordion ----------
agent-browser eval "document.querySelector('#ask').scrollIntoView({behavior:'instant'})" >/dev/null
sleep 0.8
agent-browser find role button click --name "كم مرة أزور طبيب الأسنان فعلاً؟" >/dev/null 2>&1
sleep 0.5
acc=$(agent-browser eval "document.querySelectorAll('#ask [data-state=open]').length" 2>/dev/null | tr -d '"' )
[ "$acc" -ge 1 ] 2>/dev/null; check "faq-accordion" $?

# ---------- 7. contact form validation + success ----------
agent-browser eval "document.querySelector('#contact').scrollIntoView({behavior:'instant'})" >/dev/null
sleep 0.8
CS=$(agent-browser snapshot -i -s "#contact" 2>/dev/null)
NAME_REF=$(echo "$CS" | grep 'textbox "الاسم الكامل"' | grep -o "ref=e[0-9]*" | head -1 | cut -d= -f2)
EMAIL_REF=$(echo "$CS" | grep 'textbox "البريد الإلكتروني"' | grep -o "ref=e[0-9]*" | head -1 | cut -d= -f2)
MSG_REF=$(echo "$CS" | grep 'textbox "رسالتك"' | grep -o "ref=e[0-9]*" | head -1 | cut -d= -f2)
SUBMIT_REF=$(echo "$CS" | grep 'button "إرسال الرسالة"' | grep -o "ref=e[0-9]*" | head -1 | cut -d= -f2)
echo "form refs: $NAME_REF $EMAIL_REF $MSG_REF $SUBMIT_REF"
agent-browser click "@$SUBMIT_REF" >/dev/null 2>&1
sleep 1.2
errn=$(agent-browser eval "document.querySelectorAll('#contact [role=alert]').length" 2>/dev/null | tr -d '"' )
echo "validation errors shown: $errn"
[ "$errn" -ge 2 ] 2>/dev/null; check "contact-inline-validation" $?
agent-browser fill "@$NAME_REF" "سارة العتيبي" >/dev/null 2>&1
agent-browser fill "@$EMAIL_REF" "sara@example.com" >/dev/null 2>&1
agent-browser fill "@$MSG_REF" "مرحبا سارة، أود التواصل بخصوص فرصة تدريب صيفية في العيادة." >/dev/null 2>&1
agent-browser click "@$SUBMIT_REF" >/dev/null 2>&1
sleep 2
sent=$(agent-browser eval "document.body.innerText.includes('وصلت رسالتك')" 2>/dev/null | tr -d '"' )
[ "$sent" = "true" ]; check "contact-form-success" $?

# ---------- 8. language switch preserves path ----------
agent-browser find text "EN" click >/dev/null 2>&1
sleep 3
url=$(agent-browser get url 2>/dev/null)
echo "url after switch: $url"
[[ "$url" == *"/en"* ]]; check "lang-switch-to-en" $?
dir2=$(agent-browser eval "document.documentElement.getAttribute('dir')" 2>/dev/null | tr -d '"' )
[ "$dir2" = "ltr" ]; check "en-dir-ltr" $?

# ---------- 9. viewports: 360 + 768 (EN + AR) ----------
agent-browser set viewport 360 740 >/dev/null
agent-browser open http://localhost:3000/en >/dev/null; agent-browser wait --load networkidle >/dev/null 2>&1; sleep 1.5
agent-browser screenshot "$SS/en-360-hero.png" >/dev/null
ovf360=$(agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth" 2>/dev/null)
ovf360OK=$(python3 -c "print(1 if $ovf360 <= 2 else 0)")
[ "$ovf360OK" = "1" ]; check "no-overflow-360-EN" $?
# mobile menu (bottom sheet)
agent-browser find role button click --name "Open main menu" >/dev/null 2>&1; sleep 1
drawer=$(agent-browser eval "document.querySelector('[data-state=open][role=dialog], [data-vaul-overlay]') !== null" 2>/dev/null | tr -d '"' )
[ "$drawer" = "true" ]; check "mobile-nav-drawer" $?
agent-browser screenshot "$SS/en-360-drawer.png" >/dev/null
agent-browser press Escape >/dev/null 2>&1; sleep 0.5

agent-browser open http://localhost:3000/ >/dev/null; agent-browser wait --load networkidle >/dev/null 2>&1; sleep 1.5
agent-browser screenshot "$SS/ar-360-hero.png" >/dev/null
ovfA=$(agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth" 2>/dev/null)
ovfAOK=$(python3 -c "print(1 if $ovfA <= 2 else 0)")
[ "$ovfAOK" = "1" ]; check "no-overflow-360-AR" $?

agent-browser set viewport 768 1024 >/dev/null
agent-browser open http://localhost:3000/ >/dev/null; agent-browser wait --load networkidle >/dev/null 2>&1; sleep 1.5
agent-browser screenshot "$SS/ar-768-hero.png" >/dev/null
ovf768=$(agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth" 2>/dev/null)
ovf768OK=$(python3 -c "print(1 if $ovf768 <= 2 else 0)")
[ "$ovf768OK" = "1" ]; check "no-overflow-768-AR" $?

# ---------- 10. detail pages + not-found ----------
agent-browser set viewport 1280 800 >/dev/null
agent-browser open http://localhost:3000/en/cases/anterior-composite >/dev/null; agent-browser wait --load networkidle >/dev/null 2>&1; sleep 1.5
agent-browser screenshot "$SS/en-1280-case-detail.png" >/dev/null
caseT=$(agent-browser get title 2>/dev/null)
echo "case title: $caseT"
caseOK=$(python3 -c "print(1 if 'composite' in '$caseT'.lower() else 0)")
[ "$caseOK" = "1" ]; check "case-detail-title" $?

agent-browser open http://localhost:3000/en/blog/brushing-technique >/dev/null; agent-browser wait --load networkidle >/dev/null 2>&1; sleep 1.5
agent-browser screenshot --full "$SS/en-1280-article-full.png" >/dev/null
art=$(agent-browser eval "document.body.innerText.includes('Two Minutes')" 2>/dev/null | tr -d '"' )
[ "$art" = "true" ]; check "article-content" $?

agent-browser open http://localhost:3000/en/nope >/dev/null; sleep 2
nfurl=$(agent-browser get url 2>/dev/null)
nf=$(agent-browser eval "document.body.innerText.includes('Page not found') || document.body.innerText.includes('الصفحة غير موجودة')" 2>/dev/null | tr -d '"' )
echo "not-found url: $nfurl, matched: $nf"
[ "$nf" = "true" ]; check "not-found-page" $?

# ---------- 11. console/page errors ----------
errors=$(agent-browser errors 2>/dev/null | grep -vE "^\s*$|^✗\s*$" | wc -l)
echo "real page errors: $errors"
[ "$errors" -eq 0 ] 2>/dev/null; check "zero-page-errors" $?

echo
echo "================ SUMMARY ================"
echo "PASS: ${#PASS[@]}  FAIL: ${#FAIL[@]}"
if [ ${#FAIL[@]} -gt 0 ]; then printf 'FAILED: %s\n' "${FAIL[@]}"; fi
ls "$SS"
