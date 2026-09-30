#!/usr/bin/env python3
"""Phase 1 asset pipeline — sample PDFs (CV + student resources).
All clearly marked SAMPLE. English-only (Arabic shaping in reportlab
needs extra deps; real content arrives via the dashboard anyway).
Run: python3 /home/z/my-project/scripts/build-pdfs.py
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

OUT = "/home/z/my-project/public/pdfs"
# Rosé Editorial palette (kept legacy names for shared helpers)
TEAL = HexColor("#9C4A5C")   # deep rosewood
AMBER = HexColor("#9E6B25")   # champagne gold
ROSE = HexColor("#9C4A5C")
GOLD = HexColor("#9E6B25")
MUTED = HexColor("#5D4A50")

os.makedirs(OUT, exist_ok=True)


def watermark(c, w, h):
    c.saveState()
    c.setFont("Helvetica-Bold", 34)
    c.setFillColor(HexColor("#0F766E"))
    try:
        c.setFillAlpha(0.08)
    except Exception:
        pass
    c.translate(w / 2, h / 2)
    c.rotate(35)
    c.drawCentredString(0, 0, "SAMPLE CONTENT")
    c.restoreState()


def footer(c, w):
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(20 * mm, 12 * mm, "Academic portfolio sample - replace via the dashboard")
    c.drawRightString(w - 20 * mm, 12 * mm, "toothfairysworld.com")


def build_cv():
    path = os.path.join(OUT, "sample-cv.pdf")
    c = canvas.Canvas(path, pagesize=A4)
    w, h = A4
    watermark(c, w, h)

    c.setFillColor(ROSE)
    c.setFont("Helvetica-Bold", 26)
    c.drawString(20 * mm, h - 30 * mm, "Tooth Fairy's World")
    c.setFont("Helvetica", 12)
    c.setFillColor(MUTED)
    c.drawString(20 * mm, h - 38 * mm, "Fifth-Year Dental Student  |  [UNIVERSITY] - Faculty of Dentistry")
    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.line(20 * mm, h - 43 * mm, w - 20 * mm, h - 43 * mm)

    sections = [
        ("PROFILE", [
            "Believes good treatment starts with listening, not tools - building",
            "clinical experience one case at a time.",
        ]),
        ("CLINICAL EXPERIENCE", [
            "120+ completed fillings  |  45+ endodontic treatments",
            "60+ periodontal sessions  |  15+ prosthetic works",
            "Rotations: restorative, endodontics, periodontics, prosthodontics",
        ]),
        ("CERTIFICATES & COURSES", [
            "Basic Life Support (BLS) - 2025",
            "Infection Control in Dental Clinics - 2025",
            "Advanced Esthetic Restorations Course - 2026",
            "Rotary Endodontics Workshop - 2026",
        ]),
        ("RESEARCH", [
            "Oral Hygiene Habits Among University Students: cross-sectional survey",
            "The Periodontitis-Type 2 Diabetes Link: literature review",
        ]),
        ("SKILLS & INTERESTS", [
            "Composite restorations, rotary endodontics, digital dentistry,",
            "patient education, community volunteering",
        ]),
    ]
    y = h - 60 * mm
    for title, lines in sections:
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(20 * mm, y, title)
        y -= 7 * mm
        c.setFillColor(HexColor("#271E22"))
        c.setFont("Helvetica", 10.5)
        for line in lines:
            c.drawString(24 * mm, y, line)
            y -= 5.5 * mm
        y -= 5 * mm

    footer(c, w)
    c.showPage()
    c.save()
    print("OK sample-cv.pdf")


def build_resource(title, subtitle, lines, filename):
    path = os.path.join(OUT, filename)
    c = canvas.Canvas(path, pagesize=A4)
    w, h = A4
    watermark(c, w, h)

    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(20 * mm, h - 35 * mm, title)
    c.setFont("Helvetica", 11)
    c.setFillColor(MUTED)
    c.drawString(20 * mm, h - 42 * mm, subtitle)
    c.setStrokeColor(AMBER)
    c.setLineWidth(2)
    c.line(20 * mm, h - 47 * mm, w - 20 * mm, h - 47 * mm)

    y = h - 60 * mm
    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#1B2A28"))
    for line in lines:
        c.drawString(24 * mm, y, line)
        y -= 7 * mm

    footer(c, w)
    c.showPage()
    c.save()
    print(f"OK {filename}")


build_cv()
build_resource(
    "Simplified Dental Anatomy Notes",
    "Sample study notes for junior students - 32-page summary (excerpt)",
    [
        "1. Permanent incisors: single root, incisal edge, lingual fossa.",
        "2. Canines: longest root in the arch, single cusp.",
        "3. Premolars: buccal and lingual cusps, occlusal grooves.",
        "4. Molars: 4-5 cusps, multi-rooted, maximal occlusal surface.",
        "5. Primary vs permanent: smaller crowns, whiter enamel,",
        "   thinner enamel/dentin, larger pulp chambers.",
        "...",
        "(This is a sample file - the real notes are uploaded by the owner",
        " from the dashboard media library.)",
    ],
    "resource-anatomy.pdf",
)
build_resource(
    "Composite Restoration Steps Checklist",
    "18-step printable checklist for the simulation lab",
    [
        "[ ] 1. Isolate with rubber dam",
        "[ ] 2. Clean the cavity, verify caries removal",
        "[ ] 3. Bevel enamel margins (anterior)",
        "[ ] 4. Select shade BEFORE isolation (three light sources)",
        "[ ] 5. Etch / bond per adhesive protocol",
        "[ ] 6. Incremental placement, max 2mm layers",
        "[ ] 7. Cure each layer 20s, check depth of cure",
        "[ ] 8. Contour and occlusal anatomy",
        "[ ] 9. Finish: discs and strips, interproximal check",
        "[ ] 10. Polish and fluoride varnish",
        "... (18 steps in the full sample)",
    ],
    "resource-composite.pdf",
)
build_resource(
    "Fifth-Year Study Plan",
    "A weekly template that balances clinics, exams, and sleep",
    [
        "Morning (08:00-12:00): clinical rotation - arrive 15 min early",
        "Midday (12:00-13:00): documentation while fresh",
        "Afternoon (14:00-17:00): lectures and lab work",
        "Evening (19:00-21:30): 2 focus blocks (50/10 method)",
        "Friday: full rest or 1 light review block only",
        "Rules: sleep 7h minimum; document cases the same day;",
        "weekly review every Saturday morning, 45 minutes.",
    ],
    "resource-plan.pdf",
)
build_resource(
    "Dental Glossary: English-Arabic",
    "200+ common clinical terms organized by specialty (excerpt)",
    [
        "Composite resin - rosin mukkab (composite filling material)",
        "Rubber dam - al-sadd al-matati'",
        "Working length - al-tul al-ijra'i",
        "Gingival margin - hafat al-litha",
        "Occlusal surface - al-sath al-mabdi'",
        "Periapical lesion - al-afa hawla qimat al-juthur",
        "Impression - al-tibaa",
        "... (full glossary uploaded via the dashboard)",
    ],
    "resource-glossary.pdf",
)
print("All PDFs built.")
