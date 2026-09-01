import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Search,
  Filter,
  Layers,
  Flame,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  ListTodo,
  CalendarDays,
  Target,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { generateStudyPlan } from '../services/aiService';
import { studentProfile, initialTodayTasks } from '../data/studentData';
import { useToast } from '../context/ToastContext';

const SUBJECT_OPTIONS = [
  'CS301: Design & Analysis of Algorithms',
  'CS304: Operating Systems Architecture',
  'CS307: Database Management Systems',
  'CS310: Artificial Intelligence & Machine Learning',
  'CS302: Computer Networks',
  'General Engineering & Mathematics',
];

const PRESET_PLANS = [
  {
    subject: 'CS301: Design & Analysis of Algorithms',
    topics: 'Dynamic Programming, Graph Algorithms, Divide & Conquer, Master Theorem',
    days: 4,
    hours: 5,
    difficulty: 'Intermediate',
  },
  {
    subject: 'CS304: Operating Systems Architecture',
    topics: 'Process Scheduling, Semaphores & Deadlocks, Virtual Memory, Page Replacement',
    days: 5,
    hours: 4,
    difficulty: 'Intermediate',
  },
  {
    subject: 'CS307: Database Management Systems',
    topics: 'ACID Transactions, 1NF/2NF/3NF/BCNF Normalization, B+ Trees, SQL Joins',
    days: 3,
    hours: 4,
    difficulty: 'Intermediate',
  },
];

const LOCAL_STORAGE_ALL_TASKS_KEY = 'study_assistant_all_tasks';

export const StudyPlannerView = ({ setActiveTab }) => {
  const toast = useToast();
  // Plan Generator State
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [topics, setTopics] = useState('');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  // View state: 'list' | 'calendar'
  const [viewMode, setViewMode] = useState('list');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'today' | 'pending' | 'completed' | 'high'
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Task list synchronized with localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      // Initialize with realistic today's tasks
      return initialTodayTasks.map((t, idx) => ({
        ...t,
        id: `init-task-${idx + 1}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dayLabel: 'Today',
        dayNumber: 1,
      }));
    } catch {
      return [];
    }
  });

  // Task Modal (Add / Edit)
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalFormData, setModalFormData] = useState({
    title: '',
    subject: 'CS301',
    topic: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    priority: 'High',
    estimatedTime: '60 mins',
    timeRange: '10:00 AM - 11:00 AM',
    dayLabel: 'Today',
  });

  // Sync tasks to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to sync tasks to localStorage', e);
    }
  }, [tasks]);

  // Generate Study Plan
  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    if (!topics.trim()) return;

    setIsGenerating(true);
    try {
      const plan = await generateStudyPlan(subject, topics, examDate, hoursPerDay, difficulty);
      // Merge generated tasks into task list
      setTasks((prev) => [...plan.tasks, ...prev]);
    } catch (err) {
      console.error('Failed to generate study plan', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) toast.success(`Task completed! +50 XP earned.`);
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.info('Task deleted from study schedule.');
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setModalFormData({
      title: '',
      subject: subject.split(':')[0].trim(),
      topic: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      priority: 'High',
      estimatedTime: '60 mins',
      timeRange: '10:00 AM - 11:00 AM',
      dayLabel: 'Today',
    });
    setShowTaskModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalFormData({
      title: task.title,
      subject: task.subject,
      topic: task.topic || '',
      date: task.date,
      priority: task.priority,
      estimatedTime: task.estimatedTime,
      timeRange: task.timeRange || '10:00 AM - 11:00 AM',
      dayLabel: task.dayLabel || 'Today',
    });
    setShowTaskModal(true);
  };

  // Save Modal (Create or Update)
  const handleSaveModalTask = (e) => {
    e.preventDefault();
    if (!modalFormData.title.trim()) return;

    if (editingTask) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...modalFormData }
            : t
        )
      );
      toast.success('Study task updated.');
    } else {
      // Create new
      const newTask = {
        id: `custom-task-${Date.now()}`,
        ...modalFormData,
        completed: false,
        dayNumber: 1,
      };
      setTasks((prev) => [newTask, ...prev]);
      toast.success('New study task added to schedule.');
    }
    setShowTaskModal(false);
  };

  // Load a preset plan
  const handleApplyPreset = (preset) => {
    setSubject(preset.subject);
    setTopics(preset.topics);
    setAvailableHours(preset.hours);
    setDifficulty(preset.difficulty);
    toast.info(`Loaded preset plan for ${preset.subject.split(':')[0]}.`);
  };

  // Filter & Search Logic
  const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const filteredTasks = tasks.filter((task) => {
    // Search query match
    const matchSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.topic && task.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    // Status filter
    if (statusFilter === 'today') {
      if (task.dayLabel !== 'Today' && task.date !== todayFormatted) return false;
    } else if (statusFilter === 'pending') {
      if (task.completed) return false;
    } else if (statusFilter === 'completed') {
      if (!task.completed) return false;
    } else if (statusFilter === 'high') {
      if (task.priority !== 'High') return false;
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      if (!task.subject.includes(subjectFilter)) return false;
    }

    return true;
  });

  // Metrics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Group tasks by Date for Calendar/Timeline View
  const groupedTasksByDate = tasks.reduce((acc, task) => {
    const key = task.date || 'Upcoming';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Smart Revision Planner & Scheduler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Study Planner & Roadmap 📅
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Generate structured, milestone-driven daily study schedules for <span className="font-bold text-white">{studentProfile.fullName}</span> with task management and dashboard synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-blue-900 shadow-md hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Custom Task
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Planned Tasks</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalTasksCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <span className="text-[11px] font-bold uppercase text-slate-400">Tasks Completed</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-6 w-6" /> {completedTasksCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <span className="text-[11px] font-bold uppercase text-slate-400">Schedule Completion</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {progressPercent}%
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
          <span className="text-[11px] font-bold uppercase text-slate-400">Daily Study Target</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {hoursPerDay} hrs/day
          </p>
        </div>
      </div>

      {/* 3. Study Plan Generator & Task Manager Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Plan Generator Form (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Generate AI Study Schedule
              </h2>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  1. Subject / Course
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 transition-all cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((subj, idx) => (
                    <option key={idx} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topics Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  2. Focus Topics (Comma separated)
                </label>
                <textarea
                  rows={2}
                  required
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Graph Algorithms, Master Theorem..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all resize-none"
                />
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  3. Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all cursor-pointer"
                />
              </div>

              {/* Available Study Hours */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    4. Available Hours / Day
                  </label>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {hoursPerDay} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  5. Plan Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating || !topics.trim()}
                className={`w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isGenerating || !topics.trim()
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400 shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-blue-600/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating Study Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate & Add Tasks
                  </>
                )}
              </button>
            </form>

            {/* Quick Preset Plans */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                Recommended Semester Plans
              </span>
              <div className="space-y-2">
                {PRESET_PLANS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="w-full text-left rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 text-xs text-slate-700 hover:border-blue-400 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-blue-500 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-bold text-blue-600 dark:text-blue-400 text-[11px] mb-0.5">
                      <span>{p.subject.split(':')[0]}</span>
                      <span>{p.days} Days • {p.hours}h/day</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {p.topics}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Task Manager (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Strip: Search, Filters & View Toggle */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by topic, subject or keywords..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all"
                />
              </div>

              {/* View Mode Toggle (List vs Calendar) */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <ListTodo className="h-3.5 w-3.5" /> List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'calendar'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" /> Calendar Roadmap
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'today', label: "Today's Tasks" },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
                { id: 'high', label: 'High Priority' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {/* Subject Filter Dropdown */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="ml-auto rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                <option value="all">All Subjects</option>
                <option value="CS301">CS301 (Algorithms)</option>
                <option value="CS304">CS304 (OS)</option>
                <option value="CS307">CS307 (DBMS)</option>
                <option value="CS310">CS310 (AI/ML)</option>
              </select>
            </div>
          </div>

          {/* VIEW 1: LIST VIEW */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
                  <ListTodo className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    No Tasks Match Your Filters
                  </h3>
                  <p className="text-xs text-slate-400">
                    Try changing your search keywords or click "Add Custom Task" to create one.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      task.completed
                        ? 'border-slate-200/50 bg-slate-50/50 opacity-70 dark:border-slate-800/40 dark:bg-slate-900/40'
                        : 'border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-blue-600'
                    }`}
                  >
                    {/* Checkbox & Title */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                          task.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 hover:border-blue-500 dark:border-slate-600 dark:hover:border-blue-400'
                        }`}
                      >
                        {task.completed && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            {task.subject}
                          </span>
                          <span className="text-[10px] text-slate-400">• {task.date}</span>
                          <span
                            className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-bold truncate ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" /> {task.estimatedTime}
                      </span>

                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VIEW 2: CALENDAR ROADMAP VIEW */}
          {viewMode === 'calendar' && (
            <div className="space-y-6">
              {Object.keys(groupedTasksByDate).map((dateKey) => {
                const dayTasks = groupedTasksByDate[dateKey];
                const dayCompleted = dayTasks.filter((t) => t.completed).length;

                return (
                  <div
                    key={dateKey}
                    className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {dateKey}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {dayCompleted} / {dayTasks.length} Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className={`rounded-2xl border p-3.5 transition-all cursor-pointer ${
                            task.completed
                              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                              : 'border-slate-200/80 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              {task.subject}
                            </span>
                            <span
                              className={`rounded-md px-1.5 py-0.2 text-[9px] font-bold ${
                                task.completed
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {task.completed ? 'Done' : task.priority}
                            </span>
                          </div>

                          <h4
                            className={`text-xs font-bold leading-snug line-clamp-2 ${
                              task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </h4>

                          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {task.estimatedTime} • {task.timeRange || 'Flexible'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Add / Edit Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTask ? 'Edit Study Task' : 'Add New Study Task'}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={modalFormData.title}
                  onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                  placeholder="e.g. Master Bellman-Ford Recurrence Proof"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={modalFormData.subject}
                    onChange={(e) => setModalFormData({ ...modalFormData, subject: e.target.value })}
                    placeholder="e.g. CS301"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={modalFormData.date}
                    onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
                    placeholder="e.g. Sep 02, 2026"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={modalFormData.priority}
                    onChange={(e) => setModalFormData({ ...modalFormData, priority: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={modalFormData.estimatedTime}
                    onChange={(e) => setModalFormData({ ...modalFormData, estimatedTime: e.target.value })}
                    placeholder="e.g. 90 mins"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
