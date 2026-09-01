import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  FileText,
  HelpCircle,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Layers,
  ChevronRight,
  Target,
  BarChart2,
  Check,
  X,
  RefreshCw,
  FolderOpen,
  GraduationCap
} from 'lucide-react';
import { studentProfile } from '../data/studentData';
import { LOCAL_STORAGE_TASKS_KEY, LOCAL_STORAGE_QUIZ_KEY, LOCAL_STORAGE_NOTES_KEY } from '../utils/progressStats';
import { useToast } from '../context/ToastContext';

export const LOCAL_STORAGE_SUBJECTS_KEY = 'study_assistant_subjects';

const INITIAL_SUBJECTS = [
  {
    id: 'subj-1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    description: 'Master advanced algorithms, algorithmic paradigms (Dynamic Programming, Greedy, Divide & Conquer), and graph traversal techniques.',
    color: 'from-indigo-600 to-blue-500',
    tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    studyHours: 42.5,
    credits: 4,
    topics: [
      { name: 'Binary Search & Divide and Conquer', completed: true },
      { name: 'Dynamic Programming & Memoization', completed: true },
      { name: 'Graph BFS/DFS & Shortest Paths (Dijkstra)', completed: true },
      { name: 'Minimum Spanning Trees (Prim / Kruskal)', completed: false },
      { name: 'Recurrence Relations & Master Theorem', completed: true },
      { name: 'NP-Completeness & Complexity Classes', completed: false },
    ],
  },
  {
    id: 'subj-2',
    code: 'CS307',
    name: 'Database Management Systems (DBMS)',
    description: 'Comprehensive study of relational algebra, SQL optimization, ACID transactions, and normalization theory.',
    color: 'from-emerald-600 to-teal-500',
    tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    studyHours: 34.5,
    credits: 4,
    topics: [
      { name: 'Entity-Relationship (ER) Modeling', completed: true },
      { name: 'Relational Algebra & Advanced SQL Joins', completed: true },
      { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: true },
      { name: 'Transaction Management & ACID Guarantees', completed: true },
      { name: 'Two-Phase Locking (2PL) & Deadlock Handling', completed: true },
      { name: 'B+ Tree Indexing & Query Optimization', completed: false },
    ],
  },
  {
    id: 'subj-3',
    code: 'CS304',
    name: 'Operating Systems Architecture',
    description: 'Core concepts of process scheduling, thread synchronization, memory hierarchy, virtual memory demand paging, and file systems.',
    color: 'from-purple-600 to-pink-500',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    studyHours: 38.0,
    credits: 4,
    topics: [
      { name: 'Process States & CPU Scheduling (Round Robin, SRTF)', completed: true },
      { name: 'Semaphores, Mutex & Classical Concurrency Problems', completed: true },
      { name: 'Deadlock Detection & Banker Algorithm', completed: true },
      { name: 'Virtual Memory, TLB & Demand Paging', completed: true },
      { name: 'Page Replacement Algorithms (LRU, FIFO, Optimal)', completed: false },
      { name: 'File System Allocation & Disk Scheduling', completed: false },
    ],
  },
  {
    id: 'subj-4',
    code: 'CS302',
    name: 'Computer Networks',
    description: 'OSI and TCP/IP stack architectures, routing protocols, flow control, transport layer congestion algorithms, and socket programming.',
    color: 'from-cyan-600 to-blue-600',
    tagColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    studyHours: 24.0,
    credits: 3,
    topics: [
      { name: 'OSI 7-Layer Model & Protocol Encapsulation', completed: true },
      { name: 'TCP 3-Way Handshake & Reliable Data Transfer', completed: true },
      { name: 'UDP vs TCP Performance Trade-offs', completed: true },
      { name: 'IP Addressing, Subnetting & CIDR Notation', completed: false },
      { name: 'Routing Protocols (OSPF, BGP, Distance Vector)', completed: false },
      { name: 'Network Security (TLS/SSL, DNSSEC)', completed: false },
    ],
  },
  {
    id: 'subj-5',
    code: 'CS310',
    name: 'Artificial Intelligence & Machine Learning',
    description: 'Foundations of intelligent agents, search algorithms (A*, Minimax), neural networks, backpropagation, and machine learning models.',
    color: 'from-amber-500 to-orange-500',
    tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    studyHours: 27.0,
    credits: 4,
    topics: [
      { name: 'Uninformed & Heuristic Search (A*, Greedy Best-First)', completed: true },
      { name: 'Adversarial Search & Alpha-Beta Pruning', completed: true },
      { name: 'Linear & Logistic Regression Classifiers', completed: true },
      { name: 'Neural Networks & Backpropagation Gradient Descent', completed: false },
      { name: 'Convolutional Neural Networks (CNNs)', completed: false },
      { name: 'Model Evaluation (Precision, Recall, ROC-AUC)', completed: false },
    ],
  },
];

export const SubjectsView = ({ setActiveTab }) => {
  const toast = useToast();
  // Load subjects from localStorage with initial seeds
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SUBJECTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  // Selected subject for detailed view
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [modalFormData, setModalFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 4,
    topicsString: '',
    color: 'from-indigo-600 to-blue-500',
  });

  // Local storage related items
  const [savedNotes, setSavedNotes] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  // Sync subjects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SUBJECTS_KEY, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to sync subjects to localStorage', e);
    }
  }, [subjects]);

  // Load related notes, quizzes, tasks
  useEffect(() => {
    try {
      const n = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (n) setSavedNotes(JSON.parse(n));

      const q = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
      if (q) setQuizHistory(JSON.parse(q));

      const t = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (t) setAllTasks(JSON.parse(t));
    } catch (e) {
      console.error(e);
    }
  }, [selectedSubjectId]);

  // Helper: compute subject progress
  const getSubjectMetrics = (subj) => {
    const totalTopics = subj.topics.length || 1;
    const completedTopics = subj.topics.filter((t) => t.completed).length;
    const topicPercent = (completedTopics / totalTopics) * 70;

    // Check notes and quizzes associated with this subject
    const subjectNotes = savedNotes.filter((n) => n.subject?.includes(subj.code) || n.subject?.includes(subj.name));
    const subjectQuizzes = quizHistory.filter((q) => q.subject?.includes(subj.code) || q.subject?.includes(subj.name));
    const subjectTasks = allTasks.filter((t) => t.subject?.includes(subj.code));

    const bonus = Math.min(30, subjectNotes.length * 5 + subjectQuizzes.length * 5);
    const progress = Math.min(100, Math.round(topicPercent + bonus));

    return {
      progress,
      completedTopics,
      totalTopics,
      notesCount: subjectNotes.length,
      quizzesCount: subjectQuizzes.length,
      tasksCount: subjectTasks.length,
      relatedNotes: subjectNotes,
      relatedQuizzes: subjectQuizzes,
      relatedTasks: subjectTasks,
    };
  };

  // Toggle Topic Completion
  const handleToggleTopic = (subjectId, topicIndex) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newTopics = [...s.topics];
        const nextState = !newTopics[topicIndex].completed;
        newTopics[topicIndex] = {
          ...newTopics[topicIndex],
          completed: nextState,
        };
        if (nextState) {
          toast.success(`Topic "${newTopics[topicIndex].name}" mastered! +25 XP`);
        }
        return { ...s, topics: newTopics };
      })
    );
  };

  // Delete Subject
  const handleDeleteSubject = (subjectId, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
      if (selectedSubjectId === subjectId) {
        setSelectedSubjectId(null);
      }
      toast.info(`Subject "${name}" deleted.`);
    }
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingSubject(null);
    setModalFormData({
      code: '',
      name: '',
      description: '',
      credits: 4,
      topicsString: '',
      color: 'from-indigo-600 to-blue-500',
    });
    setShowSubjectModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (subj) => {
    setEditingSubject(subj);
    setModalFormData({
      code: subj.code,
      name: subj.name,
      description: subj.description,
      credits: subj.credits || 4,
      topicsString: subj.topics.map((t) => t.name).join('\n'),
      color: subj.color,
    });
    setShowSubjectModal(true);
  };

  // Save Subject Modal
  const handleSaveModalSubject = (e) => {
    e.preventDefault();
    if (!modalFormData.name.trim()) return;

    const topicsArray = modalFormData.topicsString
      .split(/[\n,;]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name, completed: false }));

    if (editingSubject) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === editingSubject.id
            ? {
                ...s,
                code: modalFormData.code || 'CS',
                name: modalFormData.name,
                description: modalFormData.description,
                credits: Number(modalFormData.credits),
                topics: topicsArray.length > 0 ? topicsArray : s.topics,
                color: modalFormData.color,
              }
            : s
        )
      );
      toast.success('Subject details updated.');
    } else {
      const newSubject = {
        id: `subj-${Date.now()}`,
        code: modalFormData.code || 'CS',
        name: modalFormData.name,
        description: modalFormData.description,
        studyHours: 0,
        credits: Number(modalFormData.credits) || 3,
        topics: topicsArray.length > 0 ? topicsArray : [{ name: 'Introduction & Core Foundations', completed: false }],
        color: modalFormData.color,
        tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      };
      setSubjects((prev) => [newSubject, ...prev]);
      toast.success(`Course "${newSubject.name}" created.`);
    }
    setShowSubjectModal(false);
  };

  // Search Filter
  const filteredSubjects = subjects.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchQuery;
  });

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedMetrics = selectedSubject ? getSubjectMetrics(selectedSubject) : null;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Semester 5 Curriculum Management
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-blue-200 border border-white/10">
                <BookOpen className="h-3.5 w-3.5" />
                {subjects.length} Enrolled Courses
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Academic Subjects & Curriculum 📚
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Explore syllabus topics, track modular completion, and launch integrated AI notes, quizzes, and revision plans for <span className="font-bold text-white">{studentProfile.fullName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedSubjectId ? (
              <button
                onClick={() => setSelectedSubjectId(null)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Subjects
              </button>
            ) : (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Subject
              </button>
            )}
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. MODE A: ALL SUBJECTS GRID VIEW */}
      {!selectedSubjectId && (
        <div className="space-y-6">
          {/* Search Bar & Stats Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects by name, code or topics..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Showing {filteredSubjects.length} of {subjects.length} Subjects</span>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subj) => {
              const metrics = getSubjectMetrics(subj);

              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-indigo-600 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {subj.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
                          {subj.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(subj);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          title="Edit Subject"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubject(subj.id, subj.name);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          title="Delete Subject"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {subj.description}
                    </p>

                    {/* Progress Bar & Stats */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Syllabus Completion</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{metrics.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${subj.color} transition-all duration-500`}
                          style={{ width: `${metrics.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Micro Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/70 p-2.5 text-center text-xs dark:bg-slate-800/40">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Topics</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {metrics.completedTopics}/{metrics.totalTopics}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hours</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {subj.studyHours}h
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Credits</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {subj.credits || 4}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>View Syllabus & Actions</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white transition-all">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MODE B: SUBJECT DETAILS DRILL-DOWN VIEW */}
      {selectedSubjectId && selectedSubject && selectedMetrics && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Detailed Subject Overview Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedSubject.code}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {selectedSubject.credits || 4} Credits
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedMetrics.progress}% Mastered
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {selectedSubject.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
                  {selectedSubject.description}
                </p>
              </div>

              {/* Subject Action Hub Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('notes-generator')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" /> Generate Notes
                </button>
                <button
                  onClick={() => setActiveTab('quiz-generator')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Practice Quiz
                </button>
                <button
                  onClick={() => setActiveTab('study-planner')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5" /> Schedule Revision
                </button>
              </div>
            </div>

            {/* Syllabus Topics Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Syllabus Modules & Topics ({selectedMetrics.completedTopics}/{selectedMetrics.totalTopics} Completed)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Click to toggle mastery</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSubject.topics.map((topicItem, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleTopic(selectedSubject.id, idx)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all cursor-pointer ${
                      topicItem.completed
                        ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200'
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          topicItem.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {topicItem.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          topicItem.completed
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {topicItem.name}
                      </span>
                    </div>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                        topicItem.completed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200/70 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {topicItem.completed ? 'Mastered' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Artifacts Row (Notes & Quizzes) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generated Notes for this Subject */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Generated Lecture Notes ({selectedMetrics.relatedNotes.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('notes-generator')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 cursor-pointer"
                >
                  Create Notes &rarr;
                </button>
              </div>

              {selectedMetrics.relatedNotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                  No notes saved for this subject yet. Click "Create Notes" to generate exam summaries.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedMetrics.relatedNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setActiveTab('notes-generator')}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 hover:border-purple-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-purple-600 cursor-pointer transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {note.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {note.difficulty} • {note.createdAt}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        View &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Attempts for this Subject */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Completed Quizzes ({selectedMetrics.relatedQuizzes.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('quiz-generator')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                >
                  Take Quiz &rarr;
                </button>
              </div>

              {selectedMetrics.relatedQuizzes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                  No practice quizzes taken for this course yet. Test your knowledge!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedMetrics.relatedQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      onClick={() => setActiveTab('quiz-generator')}
                      className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 hover:border-emerald-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-600 cursor-pointer transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {quiz.topic}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Score: {quiz.score} ({quiz.percentage}%) • {quiz.completedAt}
                        </p>
                      </div>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {quiz.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Subject Add / Edit Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalSubject} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={modalFormData.code}
                    onChange={(e) => setModalFormData({ ...modalFormData, code: e.target.value })}
                    placeholder="e.g. CS305"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={modalFormData.name}
                    onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                    placeholder="e.g. Theory of Computation"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Course Description
                </label>
                <textarea
                  rows={2}
                  value={modalFormData.description}
                  onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                  placeholder="Overview of core syllabus topics..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Syllabus Topics (One per line or comma separated)
                </label>
                <textarea
                  rows={3}
                  value={modalFormData.topicsString}
                  onChange={(e) => setModalFormData({ ...modalFormData, topicsString: e.target.value })}
                  placeholder="Finite Automata&#10;Context-Free Grammars&#10;Turing Machines"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
