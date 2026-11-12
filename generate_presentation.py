import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation
prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette Constants
BG_DARK = RGBColor(15, 23, 42)        # #0F172A Deep Navy
CARD_BG = RGBColor(30, 41, 59)        # #1E293B Slate Blue
CARD_BORDER = RGBColor(51, 65, 85)    # #334155 Slate 700
CARD_BORDER_ACCENT = RGBColor(99, 102, 241) # #6366F1 Indigo 500

TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_LIGHT = RGBColor(241, 245, 249)  # #F1F5F9 Slate 100
TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8 Slate 400
TEXT_CYAN = RGBColor(56, 189, 248)    # #38BDF8 Sky 400
TEXT_INDIGO = RGBColor(129, 140, 248) # #818CF8 Indigo 400
TEXT_EMERALD = RGBColor(52, 211, 153) # #34D399 Emerald 400
TEXT_ROSE = RGBColor(251, 113, 133)   # #FB7185 Rose 400
TEXT_AMBER = RGBColor(251, 191, 36)   # #FBBF24 Amber 400

FONT_HEADING = 'Segoe UI'
FONT_BODY = 'Segoe UI'

SCREENSHOTS_DIR = r"c:\ai assistant project\screenshots"

def create_base_slide(badge_text="CSE279 ARTIFICIAL INTELLIGENCE PROJECT", slide_num=None, title="", subtitle=""):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background fill
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    
    # Top subtle decorative accent line
    top_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.03))
    top_line.fill.solid()
    top_line.fill.fore_color.rgb = CARD_BORDER_ACCENT
    top_line.line.fill.background()

    # Top Header Badge
    badge_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.55), Inches(4.2), Inches(0.38))
    badge_box.fill.solid()
    badge_box.fill.fore_color.rgb = CARD_BG
    badge_box.line.color.rgb = CARD_BORDER_ACCENT
    badge_box.line.width = Pt(1)
    tf_b = badge_box.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = tf_b.margin_bottom = 0
    p_b = tf_b.paragraphs[0]
    p_b.text = badge_text.upper()
    p_b.font.name = FONT_HEADING
    p_b.font.size = Pt(10)
    p_b.font.bold = True
    p_b.font.color.rgb = TEXT_CYAN
    p_b.alignment = PP_ALIGN.CENTER

    # Title & Subtitle block
    if title:
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(10.5), Inches(1.1))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
        
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.space_after = Pt(3)

        if subtitle:
            p_s = tf_t.add_paragraph()
            p_s.text = subtitle
            p_s.font.name = FONT_BODY
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = TEXT_MUTED

    # Slide Number in bottom corner
    if slide_num is not None:
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(7.05), Inches(1.0), Inches(0.3))
        tf_n = num_box.text_frame
        tf_n.word_wrap = False
        tf_n.margin_left = tf_n.margin_right = tf_n.margin_top = tf_n.margin_bottom = 0
        p_n = tf_n.paragraphs[0]
        p_n.text = f"{slide_num:02d} / 10"
        p_n.font.name = FONT_BODY
        p_n.font.size = Pt(11)
        p_n.font.color.rgb = TEXT_MUTED
        p_n.alignment = PP_ALIGN.RIGHT
        
    return slide

def add_card(slide, left, top, width, height, title="", title_color=TEXT_CYAN, border_color=CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = border_color
    card.line.width = Pt(1.2)
    
    if title:
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.45))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = title_color
    return card

def add_bullet(tf, bold_prefix, text, size=12, text_color=TEXT_LIGHT, space_after=8):
    p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
    p.space_after = Pt(space_after)
    p.font.size = Pt(size)
    p.font.name = FONT_BODY
    
    run_bullet = p.add_run()
    run_bullet.text = "• "
    run_bullet.font.bold = True
    run_bullet.font.color.rgb = TEXT_CYAN
    
    if bold_prefix:
        run_bold = p.add_run()
        run_bold.text = bold_prefix + " "
        run_bold.font.bold = True
        run_bold.font.color.rgb = TEXT_WHITE
        
    run_text = p.add_run()
    run_text.text = text
    run_text.font.bold = False
    run_text.font.color.rgb = text_color

def set_speaker_notes(slide, notes_text):
    notes = slide.notes_slide.notes_text_frame
    notes.text = notes_text.strip()


print("Building Slide 1: Title Slide...")
# ==========================================
# SLIDE 1: TITLE PAGE
# ==========================================
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg1.fill.solid()
bg1.fill.fore_color.rgb = BG_DARK
bg1.line.fill.background()

# Top accent bar
bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(0.8), Inches(10.333), Inches(0.04))
bar1.fill.solid()
bar1.fill.fore_color.rgb = CARD_BORDER_ACCENT
bar1.line.fill.background()

# Badge
badge1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.666), Inches(1.1), Inches(6.0), Inches(0.45))
badge1.fill.solid()
badge1.fill.fore_color.rgb = CARD_BG
badge1.line.color.rgb = CARD_BORDER_ACCENT
badge1.line.width = Pt(1.5)
tf_b1 = badge1.text_frame
tf_b1.margin_left = tf_b1.margin_right = tf_b1.margin_top = tf_b1.margin_bottom = 0
p_b1 = tf_b1.paragraphs[0]
p_b1.text = "CSE279 ARTIFICIAL INTELLIGENCE PROJECT PRESENTATION"
p_b1.font.name = FONT_HEADING
p_b1.font.size = Pt(11)
p_b1.font.bold = True
p_b1.font.color.rgb = TEXT_CYAN
p_b1.alignment = PP_ALIGN.CENTER

# Main Title & Subtitle Box
title_tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.75), Inches(11.333), Inches(1.8))
tf_t1 = title_tb1.text_frame
tf_t1.word_wrap = True
tf_t1.margin_left = tf_t1.margin_right = tf_t1.margin_top = tf_t1.margin_bottom = 0

p_t1 = tf_t1.paragraphs[0]
p_t1.text = "AI Study Assistant (StudyMind AI)"
p_t1.font.name = FONT_HEADING
p_t1.font.size = Pt(36)
p_t1.font.bold = True
p_t1.font.color.rgb = TEXT_WHITE
p_t1.alignment = PP_ALIGN.CENTER
p_t1.space_after = Pt(8)

p_s1 = tf_t1.add_paragraph()
p_s1.text = "Unified AI-Powered Academic Companion, Study Planner & Exam Analytics Platform"
p_s1.font.name = FONT_BODY
p_s1.font.size = Pt(16)
p_s1.font.color.rgb = TEXT_CYAN
p_s1.alignment = PP_ALIGN.CENTER

# Presenter Details Card
card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(3.8), Inches(8.933), Inches(2.7))
card1.fill.solid()
card1.fill.fore_color.rgb = CARD_BG
card1.line.color.rgb = CARD_BORDER
card1.line.width = Pt(1.5)

tb_details = slide1.shapes.add_textbox(Inches(2.6), Inches(4.05), Inches(8.133), Inches(2.2))
tf_d = tb_details.text_frame
tf_d.word_wrap = True
tf_d.margin_left = tf_d.margin_right = tf_d.margin_top = tf_d.margin_bottom = 0

add_bullet(tf_d, "Student Name:", "Aditya Sharma", size=15, space_after=8)
add_bullet(tf_d, "Registration Number:", "12528929", size=15, space_after=8)
add_bullet(tf_d, "Department:", "Department of Computer Science & Engineering (B.Tech, Semester 5)", size=15, space_after=8)
add_bullet(tf_d, "Platforms Built:", "Responsive Modern Web Application & Standalone Native Android APK", size=15, space_after=6)

set_speaker_notes(slide1, """Good morning respected professors and evaluators. My name is Aditya Sharma, registration number 12528929. Today, I am presenting my CSE279 Artificial Intelligence project titled 'AI Study Assistant' or 'StudyMind AI'.

Hinglish Note: College students ko exam prep ke time sabse badi problem hoti hai multiple disjoint apps manage karna — alag app notes ke liye, alag doubts ke liye, alag quiz ke liye. Is project me maine ek unified AI-driven platform develop kiya hai jo web aur mobile Android dono par seamlessly kaam karta hai.""")


print("Building Slide 2: Introduction & Background...")
# ==========================================
# SLIDE 2: INTRODUCTION & BACKGROUND
# ==========================================
slide2 = create_base_slide(
    badge_text="CSE279 ACADEMIC BACKGROUND & CONTEXT",
    slide_num=2,
    title="Introduction & Background",
    subtitle="Transforming Academic Preparation with AI-Driven Personalization"
)

# Left Column Card: The Problem Context
add_card(slide2, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5), "The Fragmented Study Struggle", TEXT_ROSE, CARD_BORDER)
tb_l2 = slide2.shapes.add_textbox(Inches(1.05), Inches(2.85), Inches(5.1), Inches(3.6))
tf_l2 = tb_l2.text_frame
tf_l2.word_wrap = True
tf_l2.margin_left = tf_l2.margin_right = tf_l2.margin_top = tf_l2.margin_bottom = 0

add_bullet(tf_l2, "Heavy Cognitive Overload:", "Engineering students juggle 5+ parallel subjects, complex syllabus topics, and approaching exam deadlines.", size=12, space_after=12)
add_bullet(tf_l2, "Disconnected Study Workflow:", "Students lose 30-40% of productive time switching between search engines, note apps, syllabus trackers, and test portals.", size=12, space_after=12)
add_bullet(tf_l2, "Information Overwhelm:", "Generic web searches return unorganized, non-curated explanations that lack academic depth and syllabus alignment.", size=12, space_after=12)
add_bullet(tf_l2, "Fatigue & Broken Streaks:", "Lack of automated countdowns and scheduled active recall leads to procrastination and cramming.", size=12, space_after=6)

# Right Column Card: The Solution Pillars
add_card(slide2, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5), "The StudyMind AI Solution", TEXT_EMERALD, CARD_BORDER_ACCENT)
tb_r2 = slide2.shapes.add_textbox(Inches(7.05), Inches(2.85), Inches(5.2), Inches(3.6))
tf_r2 = tb_r2.text_frame
tf_r2.word_wrap = True
tf_r2.margin_left = tf_r2.margin_right = tf_r2.margin_top = tf_r2.margin_bottom = 0

add_bullet(tf_r2, "Centralized Academic Workspace:", "Unifies AI doubt-solving, 7-section structured notes, diagnostic quizzes, and revision planning into one dashboard.", size=12, space_after=12)
add_bullet(tf_r2, "Syllabus-Aligned Intelligence:", "Specifically tuned to university Computer Science modules (Algorithms, OS, DBMS) with exam-oriented focus.", size=12, space_after=12)
add_bullet(tf_r2, "Dual-Platform Delivery:", "Responsive web app for desktop study and standalone Capacitor Android APK for mobile revision on the go.", size=12, space_after=12)
add_bullet(tf_r2, "100% Privacy by Design:", "Local-first storage model ensures student tasks and notes remain fully owned on-device without cloud snooping.", size=12, space_after=6)

set_speaker_notes(slide2, """Modern college curricula require students to absorb dense theoretical concepts and coding algorithms rapidly. Currently, students face fragmented workflows: they open ChatGPT for concept explanations, Google Drive for notes, another app for timers, and spreadsheets for syllabus tracking.

Hinglish Note: Is fragmentation ki wajah se study flow break hota hai. StudyMind AI ek complete digital companion hai jisme syllabus management, AI doubt solving, structured notes generation aur real-time exam countdown ek single interface par milte hain.""")


print("Building Slide 3: Objective & Technical Scope...")
# ==========================================
# SLIDE 3: OBJECTIVE & TECHNICAL SCOPE
# ==========================================
slide3 = create_base_slide(
    badge_text="PROJECT SCOPE & BOUNDARIES",
    slide_num=3,
    title="Project Objective & Technical Scope",
    subtitle="Clear Targets and Well-Defined Engineering Boundaries"
)

# Left Column Card: Project Objectives
add_card(slide3, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5), "Core Project Objectives", TEXT_CYAN, CARD_BORDER)
tb_l3 = slide3.shapes.add_textbox(Inches(1.05), Inches(2.85), Inches(5.1), Inches(3.6))
tf_l3 = tb_l3.text_frame
tf_l3.word_wrap = True
tf_l3.margin_left = tf_l3.margin_right = tf_l3.margin_top = tf_l3.margin_bottom = 0

add_bullet(tf_l3, "Centralize Academic Workflow:", "Unify doubt-solving, note-making, quiz generation, and exam planning into one cohesive dashboard.", size=12, space_after=12)
add_bullet(tf_l3, "Dual-Mode AI Availability:", "Provide intelligent tutoring with zero external downtime using a built-in curriculum engine and secure backend Gemini API support.", size=12, space_after=12)
add_bullet(tf_l3, "Cross-Platform Deployment:", "Deploy a production web application on GitHub Pages and package a standalone Android APK via Capacitor.", size=12, space_after=12)
add_bullet(tf_l3, "Local-First Privacy Architecture:", "Ensure 100% student data ownership by persisting tasks, notes, and quiz histories on the client device.", size=12, space_after=6)

# Right Column Card: Technical Scope & Boundaries
add_card(slide3, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5), "Technical Scope & Boundaries", TEXT_INDIGO, CARD_BORDER)
tb_r3 = slide3.shapes.add_textbox(Inches(7.05), Inches(2.85), Inches(5.2), Inches(3.6))
tf_r3 = tb_r3.text_frame
tf_r3.word_wrap = True
tf_r3.margin_left = tf_r3.margin_right = tf_r3.margin_top = tf_r3.margin_bottom = 0

add_bullet(tf_r3, "In-Scope (Fully Implemented):", "Client-side session authentication with demo login, 9 responsive views, custom markdown code renderer, full CRUD on tasks/subjects/resources, and JSON backup export.", size=12, space_after=14)
add_bullet(tf_r3, "Architectural Boundaries:", "No centralized server-side SQL/NoSQL database; all records reside securely in browser localStorage without external tracking.", size=12, space_after=14)
add_bullet(tf_r3, "API Key Protection:", "Zero API keys exposed in public static bundles; dual-mode proxy fallback keeps keys completely off client devices.", size=12, space_after=6)

set_speaker_notes(slide3, """Our objective was to build a functional, production-ready study platform tailored specifically for Computer Science students. 

Hinglish Note: Scope ke terms me humne intentional architectural decision liya: client-side localStorage use karke zero external database setup rakha hai. Iska benefit ye hai ki student ka data completely private rehta hai device par, aur application bina kisi paid server hosting ke bhi 100% operational rehti hai.""")


print("Building Slide 4: The Gap in Existing Tools...")
# ==========================================
# SLIDE 4: THE GAP IN EXISTING TOOLS
# ==========================================
slide4 = create_base_slide(
    badge_text="PROBLEM STATEMENT & COMPETITIVE ANALYSIS",
    slide_num=4,
    title="The Academic Problem & Existing Gaps",
    subtitle="Why Existing Generic AI Tools Fall Short for University Students"
)

# Left Column Card: Existing Tools Gaps
add_card(slide4, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5), "Traditional Generic Tools", TEXT_ROSE, CARD_BORDER)
tb_l4 = slide4.shapes.add_textbox(Inches(1.05), Inches(2.85), Inches(5.1), Inches(3.6))
tf_l4 = tb_l4.text_frame
tf_l4.word_wrap = True
tf_l4.margin_left = tf_l4.margin_right = tf_l4.margin_top = tf_l4.margin_bottom = 0

add_bullet(tf_l4, "Generic Chatbots (ChatGPT/Claude):", "Produce isolated text answers without syllabus checklists, exam countdowns, revision reminders, or mastery metrics.", size=12, space_after=12)
add_bullet(tf_l4, "Manual Note Apps (Notion/Anki):", "Require tedious manual note structuring and flashcard authoring; lack automated Socratic tutoring and quiz generation.", size=12, space_after=12)
add_bullet(tf_l4, "API Key Security Leakage:", "Most student projects bake paid Gemini/OpenAI API keys directly into frontend JS bundles, causing catastrophic key exposure.", size=12, space_after=12)
add_bullet(tf_l4, "Fragmented Mobile Access:", "Desktop-only web apps fail to offer smooth mobile revision without proper Android native packaging.", size=12, space_after=6)

# Right Column Card: The StudyMind Edge
add_card(slide4, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5), "The StudyMind AI Edge", TEXT_EMERALD, CARD_BORDER_ACCENT)
tb_r4 = slide4.shapes.add_textbox(Inches(7.05), Inches(2.85), Inches(5.2), Inches(3.6))
tf_r4 = tb_r4.text_frame
tf_r4.word_wrap = True
tf_r4.margin_left = tf_r4.margin_right = tf_r4.margin_top = tf_r4.margin_bottom = 0

add_bullet(tf_r4, "Syllabus-Contextualized AI:", "Tailors output directly into structured academic modules (Overview, Definitions, Code, Exam Q&A, Pitfalls).", size=12, space_after=12)
add_bullet(tf_r4, "Zero-Downtime Offline Fallback:", "Pre-configured domain knowledgebase ensures uninterrupted student study even when offline or quota-limited.", size=12, space_after=12)
add_bullet(tf_r4, "Secure Dual-Mode API Design:", "Routes live requests through backend proxy; prevents browser key leaks while maintaining zero-setup demo mode.", size=12, space_after=12)
add_bullet(tf_r4, "Native Android Ecosystem:", "Packaged with Capacitor as a standalone Android APK with touch-friendly drawer navigation and responsive layout.", size=12, space_after=6)

set_speaker_notes(slide4, """If we look at existing tools, ChatGPT answers doubts but doesn't know your exam schedule or syllabus. Notion organizes notes but doesn't test you or create quizzes automatically.

Hinglish Note: Sabse bada gap ye tha ki normal generic chatbots students ko structured academic format me output nahi dete (jaise 7 sections: Overview, Definitions, Code, Exam Q&A). StudyMind is gap ko fill karta hai aur API key ko browser me leak hone se bachata hai.""")


print("Building Slide 5: System Methodology — Tech Stack...")
# ==========================================
# SLIDE 5: METHODOLOGY — TECH STACK
# ==========================================
slide5 = create_base_slide(
    badge_text="SYSTEM METHODOLOGY & TOOLS",
    slide_num=5,
    title="System Methodology: Technology Stack",
    subtitle="Modern, High-Performance Production Tools & Libraries"
)

# 2x2 Grid of Tech Stack Layers
layers = [
    ("Layer 1: Frontend & Reactive UI", TEXT_CYAN, Inches(0.8), Inches(2.2), [
        ("React 19 (^19.2.8):", "Modern component architecture, concurrent rendering, and reactive state hooks."),
        ("Vite ^8.2.2:", "Ultra-fast ES-module bundling, instant dev server, and optimized Rollup tree-shaking."),
        ("Context Architecture:", "Global AuthContext, ThemeContext, and ToastContext for seamless app-wide state.")
    ]),
    ("Layer 2: Styling & Design System", TEXT_INDIGO, Inches(6.8), Inches(2.2), [
        ("Tailwind CSS v4 (^4.3.3):", "Utility-first modern CSS engine with zero runtime overhead via @tailwindcss/vite."),
        ("Lucide React (^1.38.0):", "30+ crisp, accessible vector icons for clean visual cues and navigation."),
        ("Accessible Theming:", "High-contrast Dark Mode and clean Light Mode with Plus Jakarta Sans & Inter typography.")
    ]),
    ("Layer 3: AI Orchestration & Security", TEXT_EMERALD, Inches(0.8), Inches(4.55), [
        ("Dual-Mode aiService.js:", "Orchestrator switching between live Gemini API and offline academic engine."),
        ("Google Gemini API:", "Generates deep contextual explanations, multi-turn tutoring, and practice quizzes."),
        ("Academic Knowledge Engine:", "Built-in curriculum knowledge for DSA, DBMS, and OS ensuring 100% offline uptime.")
    ]),
    ("Layer 4: Mobile & Storage Architecture", TEXT_AMBER, Inches(6.8), Inches(4.55), [
        ("Capacitor Android (^8.5.2):", "Compiles web dist/ to native Android WebView container (SDK 35, OpenJDK 21)."),
        ("Browser LocalStorage:", "7 structured namespaces for tasks, notes, quizzes, subjects, and user preferences."),
        ("CI/CD & Deployment:", "Automated GitHub Actions building and deploying live to GitHub Pages.")
    ])
]

for title_l, col_l, left_l, top_l, bullets in layers:
    add_card(slide5, left_l, top_l, Inches(5.7), Inches(2.15), title_l, col_l, CARD_BORDER)
    tb_ly = slide5.shapes.add_textbox(left_l + Inches(0.2), top_l + Inches(0.55), Inches(5.3), Inches(1.5))
    tf_ly = tb_ly.text_frame
    tf_ly.word_wrap = True
    tf_ly.margin_left = tf_ly.margin_right = tf_ly.margin_top = tf_ly.margin_bottom = 0
    for bp, text in bullets:
        add_bullet(tf_ly, bp, text, size=11, space_after=6)

set_speaker_notes(slide5, """Slide 5 details our technology stack. We chose React 19 paired with the latest Tailwind CSS version 4 and Vite. 

Hinglish Note: Humne build tool ke liye Vite use kiya hai jo legacy Webpack se 10x fast hai. Mobile support ke liye humne Capacitor use kiya, jisse bina alag se Java/Kotlin me poora app rewrite kiye, humne existing web dashboard ko high-performance native Android WebView APK me compile kar liya.""")


print("Building Slide 6: System Architecture & Data Flow...")
# ==========================================
# SLIDE 6: ARCHITECTURE & DATA FLOW
# ==========================================
slide6 = create_base_slide(
    badge_text="SYSTEM ARCHITECTURE & PIPELINE",
    slide_num=6,
    title="System Architecture & Dual-Mode AI Flow",
    subtitle="Secure Data Pipeline from Student Prompt to Structured Response"
)

# Main Container Card
add_card(slide6, Inches(0.8), Inches(2.15), Inches(11.733), Inches(4.65), "End-to-End Architectural Data Flow", TEXT_CYAN, CARD_BORDER)

# Step 1: User Input
b1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(2.8), Inches(3.2), Inches(0.85))
b1.fill.solid(); b1.fill.fore_color.rgb = RGBColor(40, 53, 76); b1.line.color.rgb = CARD_BORDER_ACCENT
tf_b1 = b1.text_frame; tf_b1.word_wrap = True; tf_b1.margin_left = tf_b1.margin_right = tf_b1.margin_top = tf_b1.margin_bottom = 0
p1 = tf_b1.paragraphs[0]; p1.text = "Student / User Input"; p1.font.bold = True; p1.font.size = Pt(13); p1.font.color.rgb = TEXT_WHITE; p1.alignment = PP_ALIGN.CENTER
p1_s = tf_b1.add_paragraph(); p1_s.text = "Chat prompt, Note topic, Quiz request"; p1_s.font.size = Pt(10); p1_s.font.color.rgb = TEXT_MUTED; p1_s.alignment = PP_ALIGN.CENTER

# Step 2: React 19 UI & Context
b2 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.05), Inches(2.8), Inches(3.2), Inches(0.85))
b2.fill.solid(); b2.fill.fore_color.rgb = RGBColor(40, 53, 76); b2.line.color.rgb = CARD_BORDER_ACCENT
tf_b2 = b2.text_frame; tf_b2.word_wrap = True; tf_b2.margin_left = tf_b2.margin_right = tf_b2.margin_top = tf_b2.margin_bottom = 0
p2 = tf_b2.paragraphs[0]; p2.text = "React 19 UI & State Layer"; p2.font.bold = True; p2.font.size = Pt(13); p2.font.color.rgb = TEXT_WHITE; p2.alignment = PP_ALIGN.CENTER
p2_s = tf_b2.add_paragraph(); p2_s.text = "Views, AuthContext, Theme, Toasts"; p2_s.font.size = Pt(10); p2_s.font.color.rgb = TEXT_MUTED; p2_s.alignment = PP_ALIGN.CENTER

# Step 3: aiService.js
b3 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.0), Inches(2.8), Inches(3.2), Inches(0.85))
b3.fill.solid(); b3.fill.fore_color.rgb = RGBColor(40, 53, 76); b3.line.color.rgb = CARD_BORDER_ACCENT
tf_b3 = b3.text_frame; tf_b3.word_wrap = True; tf_b3.margin_left = tf_b3.margin_right = tf_b3.margin_top = tf_b3.margin_bottom = 0
p3 = tf_b3.paragraphs[0]; p3.text = "Service Layer: aiService.js"; p3.font.bold = True; p3.font.size = Pt(13); p3.font.color.rgb = TEXT_CYAN; p3.alignment = PP_ALIGN.CENTER
p3_s = tf_b3.add_paragraph(); p3_s.text = "Dual-Mode Dispatcher & Orchestrator"; p3_s.font.size = Pt(10); p3_s.font.color.rgb = TEXT_MUTED; p3_s.alignment = PP_ALIGN.CENTER

# Branch A: Mode A (Proxy + Gemini API)
b_ma = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(4.0), Inches(5.1), Inches(1.1))
b_ma.fill.solid(); b_ma.fill.fore_color.rgb = RGBColor(24, 45, 60); b_ma.line.color.rgb = TEXT_CYAN; b_ma.line.width = Pt(1.5)
tf_ma = b_ma.text_frame; tf_ma.word_wrap = True; tf_ma.margin_left = tf_ma.margin_right = tf_ma.margin_top = tf_ma.margin_bottom = 0
p_ma1 = tf_ma.paragraphs[0]; p_ma1.text = "Mode A: Secure Backend Proxy (Optional)"; p_ma1.font.bold = True; p_ma1.font.size = Pt(12); p_ma1.font.color.rgb = TEXT_CYAN
p_ma2 = tf_ma.add_paragraph(); p_ma2.text = "• Serverless/Node Proxy holds protected GEMINI_API_KEY\n• Calls Google Gemini API for real-time generative answers\n• Zero secret exposure in client-side static JavaScript"; p_ma2.font.size = Pt(10); p_ma2.font.color.rgb = TEXT_LIGHT

# Branch B: Mode B (Offline Academic Engine)
b_mb = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(4.0), Inches(5.1), Inches(1.1))
b_mb.fill.solid(); b_mb.fill.fore_color.rgb = RGBColor(20, 50, 45); b_mb.line.color.rgb = TEXT_EMERALD; b_mb.line.width = Pt(1.5)
tf_mb = b_mb.text_frame; tf_mb.word_wrap = True; tf_mb.margin_left = tf_mb.margin_right = tf_mb.margin_top = tf_mb.margin_bottom = 0
p_mb1 = tf_mb.paragraphs[0]; p_mb1.text = "Mode B: Built-in Academic Engine (Default / Offline)"; p_mb1.font.bold = True; p_mb1.font.size = Pt(12); p_mb1.font.color.rgb = TEXT_EMERALD
p_mb2 = tf_mb.add_paragraph(); p_mb2.text = "• Pre-seeded CS Knowledgebase (Algorithms, DBMS, OS)\n• 7-Section Academic Notes & Diagnostic Quiz Generator\n• 100% Zero Downtime guarantee; instant simulated response"; p_mb2.font.size = Pt(10); p_mb2.font.color.rgb = TEXT_LIGHT

# Merged Step: Output & LocalStorage
b_out = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(5.45), Inches(11.1), Inches(1.05))
b_out.fill.solid(); b_out.fill.fore_color.rgb = RGBColor(40, 53, 76); b_out.line.color.rgb = CARD_BORDER_ACCENT
tf_out = b_out.text_frame; tf_out.word_wrap = True; tf_out.margin_left = tf_out.margin_right = tf_out.margin_top = tf_out.margin_bottom = 0
p_o1 = tf_out.paragraphs[0]; p_o1.text = "Response Formatter & Client-Side LocalStorage Persistence"; p_o1.font.bold = True; p_o1.font.size = Pt(13); p_o1.font.color.rgb = TEXT_WHITE; p_o1.alignment = PP_ALIGN.CENTER
p_o2 = tf_out.add_paragraph(); p_o2.text = "Custom Markdown code blocks with syntax highlighting & 1-click copy  •  Synchronized with 7 browser localStorage namespaces  •  Exportable JSON backup"; p_o2.font.size = Pt(11); p_o2.font.color.rgb = TEXT_CYAN; p_o2.alignment = PP_ALIGN.CENTER

set_speaker_notes(slide6, """This slide explains our complete architecture. Notice the dual-mode design in aiService.js.

Hinglish Note: Jab user koi question puchhta hai, to app check karta hai ki kya backend proxy configured hai. Agar haan, to request secure server par jaati hai jo Gemini API call karta hai bina key ko frontend me expose kiye. Agar backend set nahi hai, to app crash nahi hota! Hamara built-in academic knowledge engine instantly response generate kar deta hai.""")


print("Building Slide 7: Results (Part 1) — Web Application Features...")
# ==========================================
# SLIDE 7: RESULTS (PART 1) — WEB FEATURES
# ==========================================
slide7 = create_base_slide(
    badge_text="EXPERIMENTAL RESULTS & LIVE DEMO",
    slide_num=7,
    title="Results: Web Application Features",
    subtitle="Live Functional Verification of the AI Study Platform"
)

# 2x2 Screenshot Grid
shots_s7 = [
    ("screenshots/02_dashboard.png", "Live Student Overview Dashboard", "12-day streak, 4 KPI cards, task checklist, and upcoming exams countdown", Inches(0.8), Inches(2.2)),
    ("screenshots/04_ai_assistant_chat.png", "Conversational AI Study Assistant", "Binary Search explanation with syntax-highlighted code & copy actions", Inches(6.8), Inches(2.2)),
    ("screenshots/05_notes_generator.png", "7-Section Structured Notes Generator", "Academic notes for Dynamic Programming with Q&A accordion", Inches(0.8), Inches(4.55)),
    ("screenshots/07_quiz_results.png", "Adaptive Diagnostic Quiz Engine", "Real-time score percentage, grade badge, and weak-topic breakdown", Inches(6.8), Inches(4.55))
]

for img_rel, card_t, cap, left_pos, top_pos in shots_s7:
    # Outer frame
    frame = add_card(slide7, left_pos, top_pos, Inches(5.7), Inches(2.25), border_color=CARD_BORDER_ACCENT)
    
    # Image (aspect ratio 16:10 -> 2.6in wide x 1.625in high)
    img_path = os.path.join(r"c:\ai assistant project", img_rel)
    if os.path.exists(img_path):
        slide7.shapes.add_picture(img_path, left_pos + Inches(0.18), top_pos + Inches(0.18), width=Inches(2.55))
        
    # Text details beside image
    tb_c = slide7.shapes.add_textbox(left_pos + Inches(2.88), top_pos + Inches(0.2), Inches(2.65), Inches(1.85))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = tf_c.margin_bottom = 0
    
    p_t = tf_c.paragraphs[0]
    p_t.text = card_t
    p_t.font.name = FONT_HEADING
    p_t.font.size = Pt(13)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_CYAN
    p_t.space_after = Pt(6)
    
    p_d = tf_c.add_paragraph()
    p_d.text = cap
    p_d.font.name = FONT_BODY
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = TEXT_LIGHT

set_speaker_notes(slide7, """Slide 7 shows actual screenshots from our running application. 

Hinglish Note: Yahan aap dekh sakte hain hamara actual web application. Dashboard par student ko live 12-day streak, pending tasks aur upcoming exams ka countdown milta hai. AI Assistant code blocks ko syntax highlighting aur copy button ke sath render karta hai, aur Quiz Engine student ki weak areas ko diagnose karke detailed explanations provide karta hai.""")


print("Building Slide 8: Results (Part 2) — Mobile App & Analytics...")
# ==========================================
# SLIDE 8: RESULTS (PART 2) — MOBILE & ANALYTICS
# ==========================================
slide8 = create_base_slide(
    badge_text="CROSS-PLATFORM & ANALYTICS VERIFICATION",
    slide_num=8,
    title="Results: Native Android App & Student Analytics",
    subtitle="True Cross-Platform Mobility and In-Depth Learning Metrics"
)

# Left Column: Native Android Mobile APK
card_m = add_card(slide8, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.6), "Native Android Mobile APK", TEXT_EMERALD, CARD_BORDER_ACCENT)

img13_path = os.path.join(r"c:\ai assistant project\screenshots", "13_android_app_dashboard.png")
img14_path = os.path.join(r"c:\ai assistant project\screenshots", "14_android_app_menu.png")

# Android mobile images (786 x 1704 -> aspect ratio 0.46)
# Height 3.4 in -> width = 1.56 in
if os.path.exists(img13_path):
    slide8.shapes.add_picture(img13_path, Inches(1.15), Inches(2.85), height=Inches(3.1))
if os.path.exists(img14_path):
    slide8.shapes.add_picture(img14_path, Inches(2.9), Inches(2.85), height=Inches(3.1))

tb_m_cap = slide8.shapes.add_textbox(Inches(1.05), Inches(6.15), Inches(5.1), Inches(0.55))
tf_mc = tb_m_cap.text_frame
tf_mc.word_wrap = True
tf_mc.margin_left = tf_mc.margin_right = tf_mc.margin_top = tf_mc.margin_bottom = 0
p_mc = tf_mc.paragraphs[0]
p_mc.text = "Standalone Android APK (com.aistudyassistant.app) with responsive slide-out mobile drawer on smartphone viewport."
p_mc.font.size = Pt(10.5)
p_mc.font.color.rgb = TEXT_LIGHT

# Right Column: Desktop Analytics & Dark Mode
card_r8 = add_card(slide8, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.6), "Learning Analytics & Accessibility", TEXT_CYAN, CARD_BORDER)

# Screenshot 09: Progress Analytics
img09_path = os.path.join(r"c:\ai assistant project\screenshots", "09_progress_analytics.png")
if os.path.exists(img09_path):
    slide8.shapes.add_picture(img09_path, Inches(7.05), Inches(2.85), width=Inches(2.4))
tb_d09 = slide8.shapes.add_textbox(Inches(9.6), Inches(2.85), Inches(2.75), Inches(1.3))
tf_d09 = tb_d09.text_frame; tf_d09.word_wrap = True; tf_d09.margin_left = tf_d09.margin_right = tf_d09.margin_top = tf_d09.margin_bottom = 0
p_09a = tf_d09.paragraphs[0]; p_09a.text = "Real-Time Analytics"; p_09a.font.bold = True; p_09a.font.size = Pt(12); p_09a.font.color.rgb = TEXT_CYAN
p_09b = tf_d09.add_paragraph(); p_09b.text = "Dynamic syllabus mastery bars, study hours calculation, and weekly charts computed live from LocalStorage."; p_09b.font.size = Pt(10); p_09b.font.color.rgb = TEXT_LIGHT

# Screenshot 03: Dark Mode
img03_path = os.path.join(r"c:\ai assistant project\screenshots", "03_dashboard_dark.png")
if os.path.exists(img03_path):
    slide8.shapes.add_picture(img03_path, Inches(7.05), Inches(4.55), width=Inches(2.4))
tb_d03 = slide8.shapes.add_textbox(Inches(9.6), Inches(4.55), Inches(2.75), Inches(1.3))
tf_d03 = tb_d03.text_frame; tf_d03.word_wrap = True; tf_d03.margin_left = tf_d03.margin_right = tf_d03.margin_top = tf_d03.margin_bottom = 0
p_03a = tf_d03.paragraphs[0]; p_03a.text = "High-Contrast Dark Mode"; p_03a.font.bold = True; p_03a.font.size = Pt(12); p_03a.font.color.rgb = TEXT_INDIGO
p_03b = tf_d03.add_paragraph(); p_03b.text = "WCAG-accessible theme toggle, portable JSON data export, and full student privacy controls."; p_03b.font.size = Pt(10); p_03b.font.color.rgb = TEXT_LIGHT

set_speaker_notes(slide8, """Slide 8 demonstrates our mobile Android packaging and progress analytics.

Hinglish Note: Humne Capacitor use karke poore application ko Android APK me package kiya hai. Screenshot 13 aur 14 me aap mobile screen aur drawer navigation dekh sakte hain jo phone par 100% smooth chalta hai. Sath hi Progress screen student ke real completed tasks aur quizzes se live analytics calculate karti hai.""")


print("Building Slide 9: Conclusion & Future Scope...")
# ==========================================
# SLIDE 9: CONCLUSION & FUTURE SCOPE
# ==========================================
slide9 = create_base_slide(
    badge_text="PROJECT SUMMARY & ROADMAP",
    slide_num=9,
    title="Conclusion & Future Scope",
    subtitle="Key Achievements and Engineering Roadmap for StudyMind AI"
)

# Left Column: Key Achievements
add_card(slide9, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5), "Key Project Achievements", TEXT_EMERALD, CARD_BORDER)
tb_l9 = slide9.shapes.add_textbox(Inches(1.05), Inches(2.85), Inches(5.1), Inches(3.6))
tf_l9 = tb_l9.text_frame
tf_l9.word_wrap = True
tf_l9.margin_left = tf_l9.margin_right = tf_l9.margin_top = tf_l9.margin_bottom = 0

add_bullet(tf_l9, "Unified 6 Disjoint Utilities:", "Integrated AI Tutor, Notes Generator, Quizzes, Study Planner, Subjects, and Analytics into one seamless student portal.", size=12, space_after=12)
add_bullet(tf_l9, "Dual-Mode Secure AI Architecture:", "Eliminated client API key leakage while guaranteeing zero-downtime offline execution via built-in CS knowledge engine.", size=12, space_after=12)
add_bullet(tf_l9, "True Cross-Platform Mobility:", "Delivered a live responsive web app on GitHub Pages and a standalone Capacitor Android APK (SDK 35).", size=12, space_after=12)
add_bullet(tf_l9, "Zero Maintenance & 100% Privacy:", "Local-first storage eliminates expensive backend server costs and guarantees student data remains fully private.", size=12, space_after=6)

# Right Column: Future Scope
add_card(slide9, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5), "Future Engineering Roadmap", TEXT_INDIGO, CARD_BORDER_ACCENT)
tb_r9 = slide9.shapes.add_textbox(Inches(7.05), Inches(2.85), Inches(5.2), Inches(3.6))
tf_r9 = tb_r9.text_frame
tf_r9.word_wrap = True
tf_r9.margin_left = tf_r9.margin_right = tf_r9.margin_top = tf_r9.margin_bottom = 0

add_bullet(tf_r9, "Cloud Multi-Device Sync:", "Integrate Firebase or Supabase authentication and cloud database for real-time synchronization between laptop and phone.", size=12, space_after=12)
add_bullet(tf_r9, "PDF Upload with RAG:", "Implement Retrieval-Augmented Generation to allow students to upload professor slide decks and chat directly with their textbooks.", size=12, space_after=12)
add_bullet(tf_r9, "Native Android Push Reminders:", "Add automated notification triggers for morning revision tasks, upcoming test deadlines, and study streaks.", size=12, space_after=12)
add_bullet(tf_r9, "AI Voice Mode (Gemini Live):", "Incorporate real-time speech-to-speech tutoring and audio chapter summaries for hands-free revision.", size=12, space_after=6)

set_speaker_notes(slide9, """To conclude, StudyMind AI solves real-world academic fragmentation for engineering students through a responsive, reliable, and privacy-preserving design.

Hinglish Note: Future scope me hum isme RAG pipeline integrate karna chahte hain jisse students apne college professors ki PPTs aur PDFs upload karke direct unme se quiz aur notes bana sakein. Sath hi Firebase add karke mobile aur laptop ke beech real-time cloud sync provide karenge.""")


print("Building Slide 10: Thank You & Questions...")
# ==========================================
# SLIDE 10: THANK YOU & QUESTIONS
# ==========================================
slide10 = prs.slides.add_slide(prs.slide_layouts[6])
bg10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg10.fill.solid()
bg10.fill.fore_color.rgb = BG_DARK
bg10.line.fill.background()

# Top accent bar
bar10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(0.8), Inches(10.333), Inches(0.04))
bar10.fill.solid()
bar10.fill.fore_color.rgb = CARD_BORDER_ACCENT
bar10.line.fill.background()

# Title
t_tb10 = slide10.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.333), Inches(1.4))
tf_10 = t_tb10.text_frame
tf_10.word_wrap = True
tf_10.margin_left = tf_10.margin_right = tf_10.margin_top = tf_10.margin_bottom = 0

p_th = tf_10.paragraphs[0]
p_th.text = "Thank You!"
p_th.font.name = FONT_HEADING
p_th.font.size = Pt(38)
p_th.font.bold = True
p_th.font.color.rgb = TEXT_WHITE
p_th.alignment = PP_ALIGN.CENTER
p_th.space_after = Pt(4)

p_ths = tf_10.add_paragraph()
p_ths.text = "Questions & Technical Discussion"
p_ths.font.name = FONT_BODY
p_ths.font.size = Pt(17)
p_ths.font.color.rgb = TEXT_CYAN
p_ths.alignment = PP_ALIGN.CENTER

# Center Summary Card
c_card10 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(2.9), Inches(8.933), Inches(1.85))
c_card10.fill.solid()
c_card10.fill.fore_color.rgb = CARD_BG
c_card10.line.color.rgb = CARD_BORDER_ACCENT
c_card10.line.width = Pt(1.5)

tb_c10 = slide10.shapes.add_textbox(Inches(2.5), Inches(3.05), Inches(8.333), Inches(1.55))
tf_c10 = tb_c10.text_frame
tf_c10.word_wrap = True
tf_c10.margin_left = tf_c10.margin_right = tf_c10.margin_top = tf_c10.margin_bottom = 0

add_bullet(tf_c10, "Project:", "AI Study Assistant (StudyMind AI) — Capstone Implementation", size=13, space_after=6)
add_bullet(tf_c10, "Presented By:", "Aditya Sharma  (Registration Number: 12528929)", size=13, space_after=6)
add_bullet(tf_c10, "Course & Dept:", "CSE279 Artificial Intelligence Project, Dept of Computer Science & Engineering", size=13, space_after=4)

# 3 Project Link Badges across bottom
link_items = [
    ("Live Web Application", "https://adityasharma1012.github.io/ai-study-assistant/", Inches(1.0), Inches(5.1)),
    ("GitHub Source Repository", "https://github.com/Adityasharma1012/ai-study-assistant", Inches(4.9), Inches(5.1)),
    ("Native Android APK", "com.aistudyassistant.app (Debug APK SDK 35)", Inches(8.8), Inches(5.1))
]

for title_link, url_text, left_pos, top_pos in link_items:
    l_card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, top_pos, Inches(3.533), Inches(1.2))
    l_card.fill.solid()
    l_card.fill.fore_color.rgb = CARD_BG
    l_card.line.color.rgb = CARD_BORDER
    l_card.line.width = Pt(1)
    
    tb_l = slide10.shapes.add_textbox(left_pos + Inches(0.15), top_pos + Inches(0.2), Inches(3.233), Inches(0.8))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0
    
    p_lt = tf_l.paragraphs[0]
    p_lt.text = title_link
    p_lt.font.name = FONT_HEADING
    p_lt.font.size = Pt(12)
    p_lt.font.bold = True
    p_lt.font.color.rgb = TEXT_CYAN
    p_lt.alignment = PP_ALIGN.CENTER
    p_lt.space_after = Pt(4)
    
    p_lu = tf_l.add_paragraph()
    p_lu.text = url_text
    p_lu.font.name = FONT_BODY
    p_lu.font.size = Pt(9.5)
    p_lu.font.color.rgb = TEXT_LIGHT
    p_lu.alignment = PP_ALIGN.CENTER

# Q&A Prompt Footer
q_tb = slide10.shapes.add_textbox(Inches(2.0), Inches(6.55), Inches(9.333), Inches(0.4))
tf_q = q_tb.text_frame
p_q = tf_q.paragraphs[0]
p_q.text = "[ Open for Faculty Evaluation, Code Review & Technical Viva Discussion ]"
p_q.font.name = FONT_BODY
p_q.font.size = Pt(12)
p_q.font.bold = True
p_q.font.color.rgb = TEXT_EMERALD
p_q.alignment = PP_ALIGN.CENTER

set_speaker_notes(slide10, """Thank you very much, respected panel members, for your time and attention. I am now open to any questions, suggestions, or technical discussions regarding the architecture, AI fallback mechanisms, or mobile compilation of StudyMind AI.""")


# Save Presentation
output_path = r"c:\ai assistant project\StudyMind_AI_College_Presentation.pptx"
prs.save(output_path)
print(f"Presentation successfully created and saved to: {output_path}")
