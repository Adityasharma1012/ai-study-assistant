import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Check,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Activity,
  Layers,
  GraduationCap,
  FileText,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { getCalculatedProgressStats } from '../utils/progressStats';
import { studentProfile } from '../data/studentData';

export const ProgressView = ({ setActiveTab }) => {
  const [stats, setStats] = useState(getCalculatedProgressStats);
  const [activeBarHover, setActiveBarHover] = useState(null);
  const [activeTimeframe, setActiveTimeframe] = useState('weekly'); // 'weekly' | 'monthly' | 'all-time'

  // Refresh stats dynamically on mount and when tab becomes visible
  useEffect(() => {
    const updateStats = () => {
      setStats(getCalculatedProgressStats());
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-teal-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100 backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Live Student Analytics • Semester 5
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-300/30">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                {stats.studyStreak} Day Active Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Learning Analytics & Progress Tracker 📈
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Real-time calculated study hours, subject syllabus mastery, and test analytics for <span className="font-bold text-white">{studentProfile.fullName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStats(getCalculatedProgressStats())}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Analytics
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards (Calculated from actual LocalStorage data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Hours */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Hours</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalStudyHours}h
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" /> All-time
          </span>
        </div>

        {/* Weekly Hours */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Weekly Hours</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            {stats.weeklyStudyHours}h
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Target: 35.0h
          </span>
        </div>

        {/* Monthly Hours */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Monthly Hours</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {stats.monthlyStudyHours}h
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" /> +18.4%
          </span>
        </div>

        {/* Overall Progress */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Overall Progress</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-2">
            {stats.overallProgress}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across 4 subjects
          </span>
        </div>

        {/* Quiz Avg Score */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Quiz Average</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {stats.avgQuizScore}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.totalQuizzesTaken} Quizzes Taken
          </span>
        </div>

        {/* Completed Topics */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Topics Mastered</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.completedTopicsCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats.completedTasksCount} Tasks Done
          </span>
        </div>
      </div>

      {/* 3. Charts Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Weekly Study Activity (Span 7) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Weekly Study Hours & Daily Distribution
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calculated study output comparing daily sessions against 5.0h daily targets
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {['weekly', 'monthly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveTimeframe(mode)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTimeframe === mode
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="pt-4">
            <div className="flex items-end justify-between gap-3 h-52 border-b border-slate-100 dark:border-slate-800 pb-3">
              {stats.weeklyDays.map((d, index) => {
                const maxChartHours = 7.0;
                const heightPercent = Math.min(100, Math.round((d.hours / maxChartHours) * 100));
                const isHovered = activeBarHover === index;

                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => setActiveBarHover(index)}
                    onMouseLeave={() => setActiveBarHover(null)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative cursor-pointer"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-30 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in fade-in zoom-in-95">
                        <p>{d.fullDay}: <span className="text-amber-400">{d.hours}h</span></p>
                        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-normal">{d.focus}</p>
                      </div>
                    )}

                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {d.hours}h
                    </span>

                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-2xl overflow-hidden flex flex-col justify-end h-36">
                      <div
                        className={`w-full rounded-t-2xl transition-all duration-300 ${
                          d.isToday
                            ? 'bg-gradient-to-t from-teal-600 to-indigo-600 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40'
                            : d.hours >= d.target
                            ? 'bg-gradient-to-t from-indigo-500 to-sky-400 group-hover:from-indigo-600 group-hover:to-sky-500'
                            : 'bg-indigo-200 dark:bg-indigo-950/80 group-hover:bg-indigo-300'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-bold ${
                        d.isToday
                          ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-4'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600" />
                <span>Today's Logged Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-400" />
                <span>Goal Met (&ge; 5.0 hrs)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Quiz Scores & Test Mastery (Span 5) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Quiz Performance Metrics
                </h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Grade A Average
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accuracy and score trends across your active test attempts
            </p>

            {/* Quiz Stats Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase text-slate-400">Average Score</span>
                <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                  {stats.avgQuizScore}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase text-slate-400">Question Accuracy</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {stats.quizAccuracy}%
                </p>
              </div>
            </div>

            {/* Recent Quizzes List */}
            <div className="mt-5 space-y-2.5">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                Recent Quiz Attempts
              </span>
              {stats.recentQuizzes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                  Take a quiz to see score trend analysis!
                </div>
              ) : (
                stats.recentQuizzes.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                      {q.topic}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{q.score}</span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {q.percentage}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('quiz-generator')}
            className="w-full rounded-2xl bg-amber-500 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-4 w-4" /> Start Quick Practice Quiz
          </button>
        </div>
      </div>

      {/* 4. Subject-Wise Progress Matrix */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Subject-Wise Curriculum & Mastery Breakdown
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculated from completed syllabus tasks, generated lecture notes, and practice quizzes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.subjectProgress.map((sub) => (
            <div
              key={sub.code}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4 hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {sub.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sub.title}
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  {sub.progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-500`}
                  style={{ width: `${sub.progress}%` }}
                />
              </div>

              {/* Subject Micro Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Hours Logged</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{sub.hours}h</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Tasks Done</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{sub.tasksDone}/{sub.totalTasks}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Notes Created</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{sub.notesCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Completed Topics Showcase */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Mastered Study Topics ({stats.completedTopics.length})
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('notes-generator')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
          >
            Create New Topic Notes &rarr;
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {stats.completedTopics.map((topic, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200"
            >
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
