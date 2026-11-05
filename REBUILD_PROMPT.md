# Complete Prompt to Rebuild the AI Study Assistant from Scratch

Copy and paste the single prompt inside the code block below into any AI coding assistant (such as Antigravity, Cursor, ChatGPT, or Claude) to recreate this exact project from scratch.

```markdown
You are an expert full-stack developer and UI/UX designer. Build a complete, production-ready, responsive web and mobile application called "AI Study Assistant" (StudyMind AI) from scratch using React 19, Vite, Tailwind CSS v4, Lucide React, and Capacitor for Android.

Follow the exact specifications, architecture, tech stack, data models, and features outlined below. Do not omit any files, components, or functionality.

---

### 1. PROJECT GOAL & OVERVIEW
Build an intelligent, all-in-one AI-powered academic companion and study platform designed for university and college students (pre-seeded for Computer Science & Engineering students, Semester 5).

The application must provide a unified, beautiful SaaS dashboard that combines:
1. Authentication & Session Management (Login, Signup, Password Reset, and One-Click Demo Account).
2. Global Navigation (Collapsible desktop sidebar, mobile slide-over drawer, top navbar with global search, 12-day streak pill, dark/light theme toggle, notification menu, and user profile menu).
3. Student Overview Dashboard (Personalized welcome, XP & level progression, 4 key KPI metric cards, 4 quick action launcher cards, today's task checklist with quick-add, upcoming exams countdown with readiness meters, subject progress bars, weekly study activity chart with hover details, and recent activity log).
4. AI Study Assistant (A ChatGPT-style interactive academic tutor with suggested prompt chips, real-time responses, custom markdown parsing for headers, bullet points, blockquotes, code blocks with syntax highlighting and copy buttons, response regeneration, chat history persistence, and clear chat).
5. AI Notes Generator (Subject, topic, difficulty, and length selectors; generates notes structured into 7 distinct sections: Topic Overview, Key Concepts, Important Definitions, Code Examples, Key Points, Summary, and Important Questions with interactive revealable answers; includes note saving, markdown copying, and .md file downloading).
6. AI Quiz Generator (Configurable topic, difficulty, and 3/5/10 question count; interactive question-by-question stepper with progress bar and option selection; instant grading with score percentages, diagnostic weak topic identification, revision recommendations, and detailed question-by-question explanations with answer review; saved quiz history).
7. AI Study Planner (Exam date-driven day-by-day revision schedule generator; morning theory and afternoon active recall sessions; comprehensive task manager with manual task addition, modal editing, deletion, status filtering, subject filtering, search, and list vs. calendar day grouping views).
8. Learning Analytics & Progress Tracker (Live statistics computed dynamically from actual LocalStorage tasks, quizzes, and saved notes; displays total study hours, weekly hours, study streak, overall progress %, average quiz score %, quiz accuracy %, completed topics tags, subject progress bars, and recent quiz tables).
9. Subject Management (Pre-seeded with 5 core CS subjects: CS301 Algorithms, CS307 DBMS, CS304 OS, CS302 Computer Networks, CS310 AI/ML; supports adding, editing, and deleting subjects; detailed subject view with syllabus topic checklists, subject-filtered notes, quizzes, and tasks).
10. Learning Resources Library (Curated educational materials like MIT OCW, OSTEP, CMU Database Systems, and CS231n; filterable by subject and resource type: Website, YouTube, PDF, Document, Other; searchable; with add, edit, delete, and copy link functionality).
11. Settings & Data Management (Profile settings, theme preferences, daily study reminders, default AI difficulty, complete data export to JSON backup file, and danger zone for data clearing with confirmation typing).
12. Fallback / Roadmap View (Placeholder component for any undefined routes).
13. Cross-Platform Android APK Setup (Capacitor configuration with relative asset paths for seamless Android WebView rendering).

---

### 2. EXACT TECH STACK & DEPENDENCIES
Use these exact libraries and tools:
- Programming Languages: JavaScript (ES Modules), HTML5, CSS3
- Frontend Framework: React `^19.2.8` with `react-dom` `^19.2.8`
- Build Tool: Vite `^8.2.2` with `@vitejs/plugin-react` `^6.1.0`
- Styling: Tailwind CSS `^4.3.3` with `@tailwindcss/vite` `^4.3.3`
- Icons: `lucide-react` `^1.38.0`
- Class Merging: `clsx` `^2.1.1`, `tailwind-merge` `^3.6.0`
- Static Hosting: `gh-pages` `^6.3.0`
- Linting: `oxlint` `^1.79.0`
- Mobile Native Bridge: `@capacitor/core` `^8.5.2`, `@capacitor/cli` `^8.5.2`, `@capacitor/android` `^8.5.2`
- Typography: Plus Jakarta Sans (headers/display) and Inter (body) via Google Fonts
- Storage: Browser `localStorage` (no server database required for standalone operation)
- AI Strategy: Dual-mode architecture:
  - If `VITE_AI_BACKEND_URL` is configured, send requests to the backend server to protect the Google Gemini API key.
  - If no backend is supplied, automatically fall back to an intelligent built-in Academic Study Engine with pre-seeded domain knowledge for Computer Science (Binary Search, Recursion, DBMS, Operating Systems, Revision Planning) and realistic network latency simulation. Never expose the raw Gemini API key in client-side static bundles.

---

### 3. PROJECT DIRECTORY & FILE STRUCTURE
Create the project with this exact folder layout:

```text
ai-study-assistant/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD to build and publish dist/ to GitHub Pages
├── android/                        # Capacitor Android native project generated via npx cap add android
├── public/
│   ├── favicon.svg                 # Application favicon (Graduation cap SVG)
│   └── icons.svg                   # SVG icon definitions
├── src/
│   ├── assets/                     # Static assets (hero image, react.svg, vite.svg)
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthView.jsx        # Login, Signup, Forgot Password, and Demo Login screens
│   │   ├── AIAssistantView.jsx     # ChatGPT-style academic chat interface with code copy & formatting
│   │   ├── DashboardView.jsx       # Main student dashboard with streak, KPIs, tasks, exams, progress
│   │   ├── NotesGeneratorView.jsx  # AI notes generator with 7 sections, download, copy, and library
│   │   ├── PlaceholderView.jsx     # Roadmap/fallback card for placeholder routes
│   │   ├── ProgressView.jsx        # Analytics dashboard computed from actual local tasks, quizzes & notes
│   │   ├── QuizGeneratorView.jsx   # Interactive quiz engine (taking, grading, diagnostic reviews, history)
│   │   ├── ResourcesView.jsx       # Resource repository with subject/type filters, search, add/edit/delete
│   │   ├── SettingsView.jsx        # Profile preferences, reminder times, data export to JSON, clear storage
│   │   ├── Sidebar.jsx             # Left desktop navigation & mobile slide-out drawer
│   │   ├── StudyPlannerView.jsx    # Exam-oriented study plan generator and interactive task organizer
│   │   ├── SubjectsView.jsx        # Subject management with syllabus checklists and linked notes/quizzes
│   │   └── TopNavbar.jsx           # Top app bar with search, streak badge, dark mode toggle, profile menu
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication context (session state, login, signup, demo, logout)
│   │   ├── ThemeContext.jsx        # Dark/light theme context synced to HTML documentElement and localStorage
│   │   └── ToastContext.jsx        # Global floating toast notification system (success, error, info, warning)
│   ├── data/
│   │   └── studentData.js          # Default mock student profile, exams, subject lists, activity feeds
│   ├── services/
│   │   ├── aiService.js            # AI orchestration layer (askAI, generateNotes, generateQuiz, generateStudyPlan)
│   │   └── authService.js          # Authentication service handling localStorage user records & session tokens
│   ├── utils/
│   │   └── progressStats.js        # Analytics engine aggregating hours, streaks, accuracy, and subject completion
│   ├── App.css                     # Global custom overrides
│   ├── App.jsx                     # Root application coordinator with tab routing and auth protection
│   ├── index.css                   # Tailwind CSS v4 entrypoint, Plus Jakarta Sans font, custom scrollbars
│   └── main.jsx                    # React 19 StrictMode entry point rendering App into #root
├── .env.example                    # Example environment variable template (VITE_AI_BACKEND_URL)
├── .gitignore                      # Git ignore rules (node_modules, dist, .env, android build artifacts)
├── .oxlintrc.json                  # Oxlint configuration
├── capacitor.config.json           # Capacitor config (appId: "com.aistudyassistant.app", appName: "AI Study Assistant", webDir: "dist")
├── index.html                      # HTML entry with Plus Jakarta Sans & Inter Google Fonts
├── package.json                    # Project metadata, scripts (dev, build, preview, deploy), dependencies
├── README.md                       # Comprehensive markdown documentation
└── vite.config.js                  # Vite configuration with React, Tailwind v4, and base: './'
```

---

### 4. STEP-BY-STEP BUILD INSTRUCTIONS

#### Step 4.1: Project Setup & Dependencies
1. Initialize the Vite project with React:
   ```bash
   npm create vite@latest ai-study-assistant -- --template react
   cd ai-study-assistant
   ```
2. In `package.json`, configure:
   ```json
   {
     "name": "ai-study-assistant",
     "private": true,
     "version": "0.0.0",
     "homepage": "https://adityasharma1012.github.io/ai-study-assistant/",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "lint": "oxlint",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "dependencies": {
       "@capacitor/core": "^8.5.2",
       "@tailwindcss/vite": "^4.3.3",
       "clsx": "^2.1.1",
       "lucide-react": "^1.38.0",
       "react": "^19.2.8",
       "react-dom": "^19.2.8",
       "tailwind-merge": "^3.6.0",
       "tailwindcss": "^4.3.3"
     },
     "devDependencies": {
       "@capacitor/android": "^8.5.2",
       "@capacitor/cli": "^8.5.2",
       "@types/react": "^19.2.18",
       "@types/react-dom": "^19.2.4",
       "@vitejs/plugin-react": "^6.1.0",
       "gh-pages": "^6.3.0",
       "oxlint": "^1.79.0",
       "vite": "^8.2.2"
     }
   }
   ```
3. Run `npm install` to install all packages.

#### Step 4.2: Build & Styling Configuration
1. Configure `vite.config.js`:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     base: './', // CRITICAL: Relative base ensures assets load on GitHub Pages and Capacitor localhost
     plugins: [
       react(),
       tailwindcss(),
     ],
   })
   ```
2. Configure `capacitor.config.json`:
   ```json
   {
     "appId": "com.aistudyassistant.app",
     "appName": "AI Study Assistant",
     "webDir": "dist"
   }
   ```
3. Configure `index.html`:
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>AI Study Assistant | Student Dashboard</title>
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
     </head>
     <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
       <div id="root"></div>
       <script type="module" src="/src/main.jsx"></script>
     </body>
   </html>
   ```
4. Configure `src/index.css`:
   ```css
   @import "tailwindcss";

   @layer base {
     :root {
       --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     }

     body {
       font-family: var(--font-sans);
       margin: 0;
       padding: 0;
       min-height: 100vh;
     }

     #root {
       min-height: 100vh;
       width: 100%;
       margin: 0;
       max-width: none;
       display: block;
       text-align: left;
       border: none;
     }
   }

   ::-webkit-scrollbar {
     width: 6px;
     height: 6px;
   }
   ::-webkit-scrollbar-track {
     background: transparent;
   }
   ::-webkit-scrollbar-thumb {
     background: rgba(148, 163, 184, 0.4);
     border-radius: 9999px;
   }
   .dark ::-webkit-scrollbar-thumb {
     background: rgba(71, 85, 105, 0.5);
   }
   ::-webkit-scrollbar-thumb:hover {
     background: rgba(100, 116, 139, 0.7);
   }
   ```

#### Step 4.3: Seed Data (`src/data/studentData.js`)
Create and export the student dataset:
- `studentProfile`: Contains student identity (Aditya Sharma, B.Tech CSE Semester 5), streak (12 days), total study hours (148.5h), GPA (3.88), XP (3450 / Scholar Lv. 4), and avatar initials ("AS").
- `mainMetrics`: 4 top overview metric cards: Study Streak (+1 day), Total Study Hours (+14.2%), Overall Progress (+6%), Average Quiz Score (89.4%).
- `quickActionCards`: 4 launcher cards for Ask AI, Generate Notes, Generate Quiz, and Create Study Plan.
- `initialTodayTasks`: Seeded tasks for Algorithms (DP), DBMS (B+ Trees), OS (Virtual Memory), and AI/ML (Backpropagation).
- `upcomingExams`: 3 upcoming exams (CS301 Algorithms in 4d, CS304 OS in 8d, CS307 DBMS in 14d) with readiness percentage and dates.
- `subjectProgressList`: 4 enrolled courses with module completion status, grades, and upcoming tags.
- `weeklyStudyDays`: Monday through Sunday study hours with daily focus topics, flagging Tuesday as `isToday: true`.
- `recentActivityLog`: 5 chronological student action events with score badges and direct tab links.

#### Step 4.4: Context Providers (`src/context/`)
1. `ThemeContext.jsx`:
   - State for `theme`: `'light'` | `'dark'`.
   - Persists in `localStorage` under `study_assistant_theme`.
   - Automatically applies or removes the `'dark'` class from `document.documentElement`.
   - Provides `{ theme, toggleTheme, setTheme }` via `useTheme()`.
2. `ToastContext.jsx`:
   - Maintains a list of active floating toasts (max 4).
   - Provides methods: `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`.
   - Renders a floating notification container at bottom-right (`fixed bottom-5 right-5 z-50`) with backdrop blur, custom color accents, and auto-dismiss timer.
   - Provides `{ toast, addToast, removeToast }` via `useToast()`.
3. `AuthContext.jsx`:
   - State for `currentUser`, `isAuthenticated`, `isLoading`, `authError`.
   - Handles login, signup, demo login, logout, and password reset requests.
   - Interacts with `authService.js` and provides `useAuth()`.

#### Step 4.5: Services & Utilities (`src/services/` & `src/utils/`)
1. `authService.js`:
   - Uses `study_assistant_auth_users` and `study_assistant_auth_session` in `localStorage`.
   - Pre-seeds a default student user:
     ```javascript
     const DEFAULT_DEMO_USER = {
       id: 'user_aditya_1',
       name: 'Aditya Sharma',
       email: 'aditya.sharma@university.edu',
       password: 'Password123!',
       avatarInitials: 'AS',
       major: 'B.Tech Computer Science & Engineering',
       semester: 'Semester 5',
       createdAt: '2026-08-15T00:00:00.000Z',
     };
     ```
   - Implements `login(email, password)`, `signup(name, email, password, metadata)`, `logout()`, `resetPassword(email)`, `getCurrentUser()`, and `demoLogin()`.
2. `progressStats.js`:
   - Exports `getCalculatedProgressStats()`.
   - Reads `study_assistant_all_tasks`, `study_assistant_quiz_history`, and `study_assistant_saved_notes`.
   - Computes: totalStudyHours, weeklyStudyHours, monthlyStudyHours, studyStreak, overallProgress, avgQuizScore, quizAccuracy, completedTopics, subjectProgress, and weekly study days.
3. `aiService.js`:
   - Reads `VITE_AI_BACKEND_URL` from `import.meta.env`.
   - Exports:
     - `askAI(prompt, history)`: Sends query to backend if configured, or uses local keyword-matching knowledge base (Binary Search, Recursion, DBMS 10 interview questions, Revision plan) or generates a formatted academic answer.
     - `generateNotes(topic, subject, difficulty, length)`: Returns an object with 7 structured sections: `overview`, `keyConcepts`, `definitions`, `examples` (with code), `keyPoints`, `summary`, and `questions` (with answers), plus `rawMarkdown`.
     - `generateQuiz(subject, topic, count, difficulty)`: Randomizes questions from an academic question bank, returning `{ id, subject, topic, questions: [...] }`.
     - `generateStudyPlan(subject, topics, examDate, hoursPerDay, difficulty)`: Splits the revision period into daily morning theory and afternoon active recall/quiz tasks.

#### Step 4.6: View Components (`src/components/`)
1. `Sidebar.jsx`:
   - Fixed desktop navigation (w-72) with backdrop-blurred card background.
   - Brand logo with `GraduationCap` icon, "StudyMind" brand text, and glowing "AI" badge.
   - 9 Navigation tabs with active indicator, hover effects, and count badges.
   - Bottom student profile card displaying name, initials, and logout button.
   - Mobile-responsive slide-out drawer with backdrop close handler.
2. `TopNavbar.jsx`:
   - Sticky top bar with backdrop blur.
   - Global search input with `⌘K` keyboard shortcut pill.
   - Continuous 12-day streak pill with animated fire icon.
   - Theme toggle button with smooth icon rotation (Sun/Moon).
   - Notifications bell with indicator badge and dropdown menu.
   - User profile dropdown showing avatar initials, email, degree, and logout option.
3. `auth/AuthView.jsx`:
   - Centered auth card with branded header and tab switcher (Sign In, Create Account, Forgot Password).
   - "Instant Demo Access" button for one-click testing using the seeded credentials.
   - Form inputs with icons, validation error banners, and loading state spinner.
4. `DashboardView.jsx`:
   - Personalized welcome banner showing student degree, GPA, study hours, and XP level.
   - 4 main KPI metric cards.
   - 4 quick action cards that switch active tabs to AI tools.
   - Interactive Today's Tasks list with strike-through completion toggle and inline new task input.
   - Upcoming Exams cards with days-left countdown and readiness meters.
   - Subject Progress bars.
   - Weekly Study Hours bar chart with goal comparison line.
   - Recent Activity log stream.
5. `AIAssistantView.jsx`:
   - Conversational AI tutor interface.
   - Suggested question pills at top ("Explain binary search simply", "Explain recursion with an example", etc.).
   - Message list auto-scrolling to bottom on new messages.
   - Custom markdown renderer parsing headers, bullet lists, numbered steps, blockquotes, and code blocks with syntax styling and one-click copy button.
   - Copy response, regenerate response, and clear chat history options.
   - Input textarea with auto-grow and Enter-to-send support.
6. `NotesGeneratorView.jsx`:
   - Configuration bar: Subject selector, topic input, difficulty toggle (Beginner, Intermediate, Advanced), length toggle (Concise, Standard, Deep Dive).
   - Quick topic recommendation pills.
   - Generates 7 structured sections with individual accordion toggles:
     1. Topic Overview
     2. Key Concepts (with descriptions)
     3. Important Definitions
     4. Code Examples (with syntax highlighting and copy code button)
     5. Key Points
     6. Summary
     7. Important Questions (with interactive reveal/hide answer buttons)
   - Action bar: Save Note, Copy Markdown, Download `.md` file, and Saved Notes Drawer.
   - Slide-over Saved Notes drawer to view, reload, or delete saved notes from localStorage.
7. `QuizGeneratorView.jsx`:
   - Multi-step quiz journey: Configuration -> Active Test -> Results -> Solution Review.
   - Configuration: Subject, topic, question count (3, 5, 10), difficulty.
   - Active Test: Question stepper, progress bar, radio buttons for options, Previous and Next/Submit buttons.
   - Results: Overall score %, verdict badge (Mastery Achieved / Good Effort / Revision Needed), weak topic diagnostics, and revision advice.
   - Solution Review: Per-question evaluation with green checks for correct options, red crosses for wrong selections, and comprehensive explanation boxes.
   - Past Quiz History drawer stored in localStorage.
8. `StudyPlannerView.jsx`:
   - AI Plan Generator modal: Subject, topics (comma-separated), exam date picker, study hours/day slider, difficulty level, and preset quick-fills.
   - Generates morning theory and afternoon quiz tasks.
   - Task manager: Add custom task, edit task modal, delete task, toggle completion.
   - Search bar and filtering by status (All, Today, Pending, Completed, High Priority) and subject.
   - Switch between List View and Calendar / Day Grouping View.
9. `ProgressView.jsx`:
   - Calculated statistics banner with streak and study hours.
   - 6 KPI metric boxes (Total Hours, Weekly Hours, Active Streak, Overall Progress %, Average Quiz Score, Completed Topics Count).
   - Weekly Study Hours bar chart with hover tooltips and daily focus subjects.
   - Subject breakdown progress bars with hours and task counts.
   - Completed topics badge tags.
   - Recent quiz performance table.
10. `SubjectsView.jsx`:
    - Grid of enrolled subjects (CS301, CS307, CS304, CS302, CS310).
    - Add Subject modal (Code, Name, Description, Credits, Study Hours, Color).
    - Edit Subject modal and Delete Subject confirmation.
    - Subject Detail View: syllabus checklist with interactive topic completion toggle and add/delete topic; filtered tabs showing notes, quizzes, and tasks associated with this subject; quick launch buttons for AI Tutor, Notes, and Quiz.
11. `ResourcesView.jsx`:
    - Grid of learning resources.
    - Filters by Subject and Resource Type (Website, YouTube, PDF, Document, Other).
    - Search bar.
    - Add Resource modal (Title, URL, Subject, Type, Description).
    - Edit Resource modal and Delete Resource action.
    - Copy link button and safe external link opening (`target="_blank" rel="noopener noreferrer"`).
12. `SettingsView.jsx`:
    - Student Profile form (Name, Email, Major, Semester, Initials).
    - Preferences: Dark/Light theme toggle, study reminder toggle, daily reminder time, default AI difficulty, notes length, auto-save.
    - Export Data button: downloads complete JSON backup containing profile, tasks, notes, quizzes, subjects, and resources.
    - Danger Zone: Clear all study data button requiring typing "DELETE" to confirm.
13. `PlaceholderView.jsx`:
    - Clean fallback card detailing upcoming features for undefined routes.
14. `App.jsx`:
    - Wraps application with `ThemeProvider`, `AuthProvider`, and `ToastProvider`.
    - `AuthenticatedApp`: If `!isAuthenticated`, renders `AuthView`.
    - Otherwise, renders `Sidebar`, `TopNavbar`, active tab router view (`dashboard`, `ai-assistant`, `notes-generator`, `quiz-generator`, `study-planner`, `progress`, `subjects`, `resources`, `settings`), and footer.

#### Step 4.7: Android APK Configuration (Capacitor)
1. Initialize Capacitor:
   ```bash
   npx cap init "AI Study Assistant" "com.aistudyassistant.app" --web-dir dist
   ```
2. Add Android platform:
   ```bash
   npx cap add android
   ```
3. Build web assets and sync:
   ```bash
   npm run build
   npx cap sync android
   ```
4. Build the debug APK with Gradle using JDK 21:
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

#### Step 4.8: CI/CD Deployment (`.github/workflows/deploy.yml`)
Create GitHub Actions workflow to build and deploy to GitHub Pages on every push to `main`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 5. COMMANDS TO RUN AND TEST THE PROJECT
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview

# 5. Deploy to GitHub Pages manually
npm run deploy

# 6. Build Android APK
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

---

### 6. VERIFICATION & ACCEPTANCE CRITERIA
1. The app must run cleanly with zero build errors and zero runtime exceptions.
2. The initial screen must show the Login/Signup screen. Clicking "Instant Demo Access" must immediately log in as Aditya Sharma and load the dashboard.
3. Dark mode and light mode must switch seamlessly with theme persistence across page refreshes.
4. The AI Assistant chat, Notes Generator, Quiz Generator, and Study Planner must function fully with rich academic outputs even when no external API key is provided.
5. All tasks, notes, quizzes, subjects, resources, and settings must persist in `localStorage`.
6. Assets must use relative paths so that the site loads with zero 404 errors on GitHub Pages and runs without a blank white screen on Android mobile devices.
```
