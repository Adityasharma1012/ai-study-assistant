import React, { useState, useEffect } from 'react';
import {
  studentProfile,
  quickActionCards,
  initialTodayTasks,
  upcomingExams,
  recentActivityLog,
} from '../data/studentData';
import { getCalculatedProgressStats, LOCAL_STORAGE_TASKS_KEY } from '../utils/progressStats';
import {
  Flame,
  Clock,
  TrendingUp,
  Award,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
  BookOpen,
  MapPin,
  CalendarDays,
  Zap,
  Target,
  BarChart3,
  Check,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const iconMap = {
  Flame,
  Clock,
  TrendingUp,
  Award,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Target,
};

export const DashboardView = ({ setActiveTab }) => {
  // Load tasks from shared localStorage, falling back to initialTodayTasks
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return initialTodayTasks.map((t, idx) => ({
        ...t,
        id: `init-task-${idx + 1}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayLabel: 'Today',
        dayNumber: 1,
      }));
    } catch {
      return initialTodayTasks;
    }
  });

  const [dynamicStats, setDynamicStats] = useState(getCalculatedProgressStats);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('CS301');
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeBarHover, setActiveBarHover] = useState(null);

  // Re-calculate stats on mount and whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
      setDynamicStats(getCalculatedProgressStats());
    } catch (e) {
      console.error('Failed to sync tasks from Dashboard', e);
    }
  }, [tasks]);

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      estimatedTime: '45 mins',
      timeRange: 'Flexible • Today',
      subject: newTaskSubject,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dayLabel: 'Today',
      priority: 'Medium',
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedCount / (tasks.length || 1)) * 100);

  // Dynamic 4 Main Metric Cards
  const computedMetrics = [
    {
      id: 'streak',
      title: 'Study Streak',
      value: `${dynamicStats.studyStreak} Days`,
      subtext: 'Active Consistency',
      trend: '+1 day',
      accent: 'from-amber-500 to-orange-500',
      icon: 'Flame',
    },
    {
      id: 'total-hours',
      title: 'Total Study Hours',
      value: `${dynamicStats.totalStudyHours} hrs`,
      subtext: `${dynamicStats.weeklyStudyHours}h logged this week`,
      trend: '+4.5h',
      accent: 'from-indigo-600 to-blue-500',
      icon: 'Clock',
    },
    {
      id: 'overall-progress',
      title: 'Overall Progress',
      value: `${dynamicStats.overallProgress}%`,
      subtext: `${dynamicStats.completedTopicsCount} Topics Mastered`,
      trend: '+6%',
      accent: 'from-emerald-500 to-teal-500',
      icon: 'TrendingUp',
    },
    {
      id: 'quiz-score',
      title: 'Average Quiz Score',
      value: `${dynamicStats.avgQuizScore}%`,
      subtext: `${dynamicStats.totalQuizzesTaken} Practice Quizzes`,
      trend: '+2.1%',
      accent: 'from-purple-600 to-pink-500',
      icon: 'Award',
    },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/15">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Semester 5 • Computer Science & Engineering
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-300/30">
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                {dynamicStats.studyStreak} Day Streak
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Good morning, {studentProfile.name} 👋
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              You have <span className="font-bold text-white">{tasks.filter(t => !t.completed).length} tasks remaining</span> and your <span className="font-bold text-amber-300">Algorithms Midterm</span> is coming up in 4 days. Let's make today productive!
            </p>
          </div>

          {/* Banner Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-800 shadow-lg shadow-black/10 hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Bot className="h-4 w-4 text-indigo-600" />
              Ask AI Doubt
            </button>
            <button
              onClick={() => setActiveTab('study-planner')}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500/25 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              View Study Plan
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Four Prominent Quick-Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Study Accelerators
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            One-click creation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionCards.map((card) => {
            const Icon = iconMap[card.icon] || Sparkles;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.targetTab)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 cursor-pointer ${card.hoverBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${card.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    {card.btnText}
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Key Metrics / Stats Row (Live Computed) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {computedMetrics.map((metric) => {
          const Icon = iconMap[metric.icon] || Sparkles;
          return (
            <div
              key={metric.id}
              onClick={() => {
                if (metric.id === 'overall-progress') setActiveTab('progress');
                if (metric.id === 'quiz-score') setActiveTab('quiz-generator');
                if (metric.id === 'total-hours' || metric.id === 'streak') setActiveTab('progress');
              }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${metric.accent} text-white shadow-xs`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-3.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {metric.value}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {metric.subtext}
                </span>
                <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {metric.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Tasks, Exams, Subjects */}
        <div className="space-y-8 lg:col-span-2">
          {/* A. Today's Study Tasks */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Today's Study Tasks
                  </h2>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {completedCount} / {tasks.length} Done ({completionRate}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Check off items to earn XP and maintain your daily study streak
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showAddTask ? 'Cancel' : 'Add Task'}
                </button>
                <button
                  onClick={() => setActiveTab('study-planner')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Full Planner <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Inline Add Task Form */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="mb-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter study task name (e.g. Revise Graph BFS/DFS)..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option value="CS301">CS301 • Algorithms</option>
                    <option value="CS304">CS304 • OS</option>
                    <option value="CS307">CS307 • DBMS</option>
                    <option value="CS310">CS310 • AI / ML</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            )}

            {/* Task Items List */}
            <div className="space-y-3">
              {tasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-150 ${
                    task.completed
                      ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-800/20 opacity-70'
                      : 'border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform active:scale-90 cursor-pointer"
                      title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 hover:text-indigo-600" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {task.estimatedTime || task.time || '45 mins'}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {task.subject}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. Upcoming Exams & Readiness */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upcoming Examinations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Keep track of test dates, syllabus weightage, and revision readiness
                </p>
              </div>
              <button
                onClick={() => setActiveTab('study-planner')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
              >
                Exam Schedule <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/70"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {exam.courseCode}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          exam.daysLeft <= 5
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        In {exam.daysLeft} Days
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {exam.courseName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {exam.examType} • {exam.weightage} of Grade
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{exam.date} ({exam.time})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{exam.venue}</span>
                      </div>
                    </div>

                    {/* Readiness Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Readiness</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          {exam.readiness}% ({exam.readinessText})
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${exam.color}`}
                          style={{ width: `${exam.readiness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('quiz-generator')}
                      className="flex-1 rounded-xl bg-indigo-600 py-1.5 text-center text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Practice Quiz
                    </button>
                    <button
                      onClick={() => setActiveTab('notes-generator')}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Review Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Subject Progress & Mastery (Dynamic) */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Subject Progress & Curriculum
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mastery tracking across your 4 active Semester 5 courses
                </p>
              </div>
              <button
                onClick={() => setActiveTab('progress')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
              >
                View Analytics <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicStats.subjectProgress.map((sub) => (
                <div
                  key={sub.code}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4.5 transition-all hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {sub.code}
                      </span>
                      <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {sub.tasksDone} Tasks
                      </span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${sub.tagColor}`}>
                      {sub.hours} hrs
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {sub.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>Syllabus Completed</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{sub.progress}%</span>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-xs">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sub.notesCount} Notes Created
                    </span>
                    <button
                      onClick={() => setActiveTab('progress')}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Activity Chart & Recent Activity Feed */}
        <div className="space-y-8">
          {/* A. Weekly Study Activity Chart (Dynamic) */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Weekly Study Activity
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily target: 5.0 hrs • Total: {dynamicStats.weeklyStudyHours}h
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Live Data
              </span>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between gap-2 h-44 border-b border-slate-100 dark:border-slate-800 pb-2">
                {dynamicStats.weeklyDays.map((d, index) => {
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
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-10 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md dark:bg-white dark:text-slate-900">
                          {d.fullDay}: {d.hours}h ({d.focus})
                        </div>
                      )}

                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {d.hours}h
                      </span>

                      <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-28">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            d.isToday
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40'
                              : d.hours >= d.target
                              ? 'bg-gradient-to-t from-indigo-400 to-sky-400 group-hover:from-indigo-500 group-hover:to-sky-500'
                              : 'bg-indigo-200 dark:bg-indigo-950/80 group-hover:bg-indigo-300'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      <span
                        className={`text-[11px] font-bold ${
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

              {/* Chart Legend */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  <span>Today's Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-300 dark:bg-indigo-900" />
                  <span>Past Sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* B. Recent Activity Feed */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
              </div>
              <span className="text-xs text-slate-400">Live Feed</span>
            </div>

            <div className="space-y-4">
              {recentActivityLog.map((act) => {
                const Icon = iconMap[act.icon] || Sparkles;
                return (
                  <div
                    key={act.id}
                    onClick={() => setActiveTab(act.targetTab)}
                    className="group flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white transition-all mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {act.category}
                        </span>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {act.scoreBadge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {act.action}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {act.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Quick AI Doubt Resolver Prompt Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/10 border border-indigo-200/80 p-5 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Stuck on a concept?
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3.5">
              Ask your 24/7 AI tutor to explain Algorithms, solve Recurrence trees, or generate code snippets.
            </p>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Start Interactive AI Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
