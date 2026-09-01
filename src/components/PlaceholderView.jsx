import React from 'react';
import {
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  TrendingUp,
  BookOpen,
  FolderGit2,
  Settings,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Zap,
  Rocket
} from 'lucide-react';
import { studentProfile } from '../data/studentData';

const featureMeta = {
  'ai-assistant': {
    title: 'AI Study Assistant',
    subtitle: 'Your personal 24/7 intelligent academic tutor and problem solver',
    icon: Bot,
    color: 'from-indigo-500 to-sky-500',
    description: 'Ask complex questions, get step-by-step mathematical & coding proofs, and simplify lecture concepts.',
    features: [
      'Step-by-step problem solver for CS & Math',
      'Context-aware question answering based on your syllabus',
      'Code explanation and debugging assistant',
      'Interactive Socratic learning mode'
    ]
  },
  'notes-generator': {
    title: 'AI Notes Generator',
    subtitle: 'Transform slides, PDFs, and lectures into structured summaries',
    icon: FileText,
    color: 'from-purple-500 to-indigo-600',
    description: 'Upload lecture slides or past notes to generate concise summaries, mindmaps, and interactive flashcards.',
    features: [
      'Smart bulleted lecture summaries',
      'Automated key formula & term extractor',
      'Anki & Quizlet compatible flashcard exporter',
      'Audio lecture to structured note transcriber'
    ]
  },
  'quiz-generator': {
    title: 'Adaptive Quiz Generator',
    subtitle: 'Test your understanding with AI-generated targeted questions',
    icon: HelpCircle,
    color: 'from-emerald-500 to-teal-600',
    description: 'Create customized multiple choice, short answer, and code snippet quizzes based on your weak areas.',
    features: [
      'Adaptive difficulty based on past performance',
      'Instant grading and detailed explanations',
      'Spaced repetition question banks',
      'Exam simulation timed practice mode'
    ]
  },
  'study-planner': {
    title: 'Smart Study Planner',
    subtitle: 'Dynamic schedule optimization aligned with your exam dates',
    icon: Calendar,
    color: 'from-amber-500 to-orange-600',
    description: 'Automated study session scheduler that balances your course load, deadlines, and personal energy levels.',
    features: [
      'Automated syllabus breakdown and milestone planning',
      'Integration with Google Calendar & Outlook',
      'Pomodoro timer with smart focus breaks',
      'Workload fatigue & burnout prevention alerts'
    ]
  },
  'progress': {
    title: 'Academic Progress & Analytics',
    subtitle: 'Deep insights into your learning velocity, scores, and mastery',
    icon: TrendingUp,
    color: 'from-blue-600 to-indigo-700',
    description: 'Visualize your GPA trajectory, subject mastery radar, and time allocation across semesters.',
    features: [
      'Subject mastery heatmaps and skill radar',
      'Quiz score trends and weak topic diagnostics',
      'Weekly learning velocity and goal trackers',
      'Comparative peer percentile benchmarks'
    ]
  },
  'subjects': {
    title: 'Enrolled Subjects & Curriculum',
    subtitle: 'Manage your courses, modules, syllabus, and study materials',
    icon: BookOpen,
    color: 'from-violet-600 to-fuchsia-600',
    description: 'Centralized repository for all your 4 active semester courses, syllabus trackers, and lecture notes.',
    features: [
      'Module-by-module completion checklists',
      'Course grade estimator and assignment weight tracker',
      'Lecture slides and reference textbook repository',
      'Professor office hours and TA contact directory'
    ]
  },
  'resources': {
    title: 'Study Resources & Library',
    subtitle: 'Curated cheat sheets, past papers, documentation, and tools',
    icon: FolderGit2,
    color: 'from-teal-500 to-cyan-600',
    description: 'Access reference materials, documentation cheatsheets, past semester papers, and AI-curated guides.',
    features: [
      'Past university examination question banks',
      'Standard algorithm & data structures cheatsheets',
      'Recommended research papers and tutorials',
      'Student community shared flashcard decks'
    ]
  },
  'settings': {
    title: 'App & Account Settings',
    subtitle: 'Customize preferences, AI model temperature, and notification rules',
    icon: Settings,
    color: 'from-slate-700 to-slate-900',
    description: 'Manage profile details for Aditya Sharma, theme styles, study reminder alerts, and AI tutoring style.',
    features: [
      'Profile information & University ID settings',
      'AI tutor response style (Concise vs Detailed)',
      'Daily study notification and streak reminders',
      'Data export and offline note backups'
    ]
  }
};

export const PlaceholderView = ({ tabId, setActiveTab }) => {
  const info = featureMeta[tabId] || {
    title: 'Section Under Construction',
    subtitle: 'This feature will be built in the next step',
    icon: Sparkles,
    color: 'from-indigo-500 to-sky-500',
    description: 'We are focusing on layout and project scaffolding first.',
    features: ['Feature coming soon in the next update']
  };

  const Icon = info.icon;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${info.color} text-white shadow-lg shadow-indigo-500/20`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold text-indigo-300 mb-2 border border-white/10">
                <Sparkles className="h-3 w-3" /> Navigation Placeholder
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {info.title}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {info.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </div>

        {/* Decorative blur */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Feature Details & Roadmap Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <Rocket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Feature Scope & Capabilities
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {info.description}
          </p>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Planned Modules for {studentProfile.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/60 dark:bg-slate-800/30 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Context Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
              <Zap className="h-4 w-4 text-amber-500" />
              Active Session Status
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Student</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{studentProfile.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Current Major</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{studentProfile.major}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Study Streak</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">🔥 {studentProfile.streakDays} Days</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <Clock className="h-3 w-3" /> Scaffolding Ready
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Return to Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
