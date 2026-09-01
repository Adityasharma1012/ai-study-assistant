import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Save,
  Copy,
  Download,
  Trash2,
  Check,
  BookOpen,
  ArrowRight,
  Code2,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Bookmark,
  CheckCircle2,
  FolderOpen,
  X,
  RefreshCw,
  AlertCircle,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { generateNotes } from '../services/aiService';
import { studentProfile } from '../data/studentData';
import { useToast } from '../context/ToastContext';

const SUBJECT_OPTIONS = [
  'CS301: Design & Analysis of Algorithms',
  'CS304: Operating Systems Architecture',
  'CS307: Database Management Systems',
  'CS310: Artificial Intelligence & Machine Learning',
  'CS302: Computer Networks',
  'General Engineering & Mathematics',
];

const SUGGESTED_TOPICS = [
  { topic: 'Dynamic Programming & Memoization', subject: 'CS301: Design & Analysis of Algorithms' },
  { topic: 'Virtual Memory & Demand Paging', subject: 'CS304: Operating Systems Architecture' },
  { topic: 'Database Normalization & BCNF', subject: 'CS307: Database Management Systems' },
  { topic: 'Neural Networks Backpropagation', subject: 'CS310: Artificial Intelligence & Machine Learning' },
  { topic: 'Dijkstra Shortest Path Algorithm', subject: 'CS301: Design & Analysis of Algorithms' },
];

const LOCAL_STORAGE_SAVED_NOTES_KEY = 'study_assistant_saved_notes';

export const NotesGeneratorView = ({ setActiveTab }) => {
  const toast = useToast();
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [length, setLength] = useState('Standard');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [currentNote, setCurrentNote] = useState(null);
  const [error, setError] = useState(null);

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);

  // Accordion open/close state for the 7 sections
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    concepts: true,
    definitions: true,
    examples: true,
    keyPoints: true,
    summary: true,
    questions: true,
  });

  // Toggle individual question answers
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Saved notes library in localStorage
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_NOTES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync saved notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_NOTES_KEY, JSON.stringify(savedNotes));
    } catch (e) {
      console.error('Failed to sync saved notes', e);
    }
  }, [savedNotes]);

  // Loading step timer
  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(1);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAnswer = (idx) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Generate Notes Handler
  const handleGenerateNotes = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setCopied(false);
    setSavedSuccess(false);

    try {
      const note = await generateNotes(topic, subject, difficulty, length);
      setCurrentNote(note);
    } catch (err) {
      setError('Failed to generate study notes. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save Current Note
  const handleSaveNote = () => {
    if (!currentNote) return;

    const exists = savedNotes.some((n) => n.id === currentNote.id || (n.title === currentNote.title && n.subject === currentNote.subject));
    if (!exists) {
      setSavedNotes([currentNote, ...savedNotes]);
    }
    setSavedSuccess(true);
    toast.success(`"${currentNote.title}" saved to your notes library!`);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Copy Full Markdown
  const handleCopyNotes = () => {
    if (!currentNote) return;
    navigator.clipboard.writeText(currentNote.rawMarkdown);
    setCopied(true);
    toast.info('Full markdown notes copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Markdown File
  const handleDownloadNotes = () => {
    if (!currentNote) return;
    const blob = new Blob([currentNote.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentNote.title.replace(/[^a-z0-9]/gi, '_')}_Notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Study notes downloaded as .md file!');
  };

  // Delete Current Note
  const handleDeleteCurrentNote = () => {
    if (!currentNote) return;
    if (window.confirm(`Are you sure you want to delete notes for "${currentNote.title}"?`)) {
      setSavedNotes(savedNotes.filter((n) => n.id !== currentNote.id));
      setCurrentNote(null);
      toast.info('Notes removed from view and library.');
    }
  };

  // Load a Saved Note
  const handleLoadSavedNote = (note) => {
    setCurrentNote(note);
    setSubject(note.subject || SUBJECT_OPTIONS[0]);
    setTopic(note.title);
    setDifficulty(note.difficulty || 'Intermediate');
    setLength(note.length || 'Standard');
    setShowSavedDrawer(false);
    toast.info(`Loaded notes for "${note.title}".`);
  };

  // Delete from Saved Notes List
  const handleDeleteSavedNote = (e, id) => {
    e.stopPropagation();
    setSavedNotes(savedNotes.filter((n) => n.id !== id));
    if (currentNote && currentNote.id === id) {
      setCurrentNote(null);
    }
    toast.info('Note deleted from library.');
  };

  const isCurrentNoteSaved = currentNote && savedNotes.some((n) => n.id === currentNote.id || (n.title === currentNote.title && n.subject === currentNote.subject));

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>AI Lecture & Syllabus Summarizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Study Notes Generator 📝
            </h1>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              Generate structured, 7-section exam study notes for <span className="font-bold text-white">{studentProfile.fullName}</span> with key definitions, code examples, and high-yield test questions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSavedDrawer(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Bookmark className="h-4 w-4 text-amber-300" />
              Saved Library ({savedNotes.length})
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Configure Notes Parameters
              </h2>
            </div>

            <form onSubmit={handleGenerateNotes} className="space-y-4">
              {/* Subject Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  1. Subject / Course
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 transition-all cursor-pointer"
                >
                  {SUBJECT_OPTIONS.map((subj, idx) => (
                    <option key={idx} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  2. Study Topic
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Dynamic Programming & Memoization..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all"
                  />
                  {topic && (
                    <button
                      type="button"
                      onClick={() => setTopic('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  3. Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                          : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Length */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  4. Notes Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Concise', label: 'Concise' },
                    { id: 'Standard', label: 'Standard' },
                    { id: 'Deep Dive', label: 'Deep Dive' },
                  ].map((len) => (
                    <button
                      key={len.id}
                      type="button"
                      onClick={() => setLength(len.id)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        length === len.id
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                          : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {len.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className={`w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading || !topic.trim()
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400 shadow-none'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-purple-600/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating Study Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Structured Notes
                  </>
                )}
              </button>
            </form>

            {/* Quick Topic Chips */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                Suggested Exam Topics
              </span>
              <div className="space-y-1.5">
                {SUGGESTED_TOPICS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(item.topic);
                      setSubject(item.subject);
                    }}
                    className="w-full text-left rounded-xl p-2 text-xs text-slate-600 hover:bg-purple-50 hover:text-purple-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-300 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate">{item.topic}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-purple-600 dark:text-purple-400 shrink-0 transition-opacity ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Notes Output (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Loading State */}
          {isLoading && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center space-y-6 min-h-[480px] flex flex-col justify-center items-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/30">
                <FileText className="h-8 w-8 animate-pulse" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 ring-2 ring-white dark:ring-slate-900">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Generating 7-Section Notes on "{topic}"
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {loadingStep === 1 && 'Analyzing curriculum requirements and prerequisites...'}
                  {loadingStep === 2 && 'Structuring core definitions, formulas & code examples...'}
                  {loadingStep === 3 && 'Synthesizing high-yield exam questions and answers...'}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${loadingStep * 33.3}%` }}
                />
              </div>
            </div>
          )}

          {/* B. Error State */}
          {!isLoading && error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 dark:border-rose-900/60 dark:bg-rose-950/20 text-center space-y-4">
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                  Generation Error
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
                  {error}
                </p>
              </div>
              <button
                onClick={handleGenerateNotes}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          )}

          {/* C. Empty State */}
          {!isLoading && !currentNote && !error && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center min-h-[480px] flex flex-col justify-center items-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <BookOpen className="h-8 w-8" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Study Notes Generated Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter a subject and topic on the left to generate clean, structured 7-section study notes tailored for your semester exams.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTopic('Dynamic Programming & Memoization');
                    setSubject(SUBJECT_OPTIONS[0]);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Try: Dynamic Programming
                </button>
                <button
                  onClick={() => {
                    setTopic('Virtual Memory & Demand Paging');
                    setSubject(SUBJECT_OPTIONS[1]);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Try: Virtual Memory
                </button>
              </div>
            </div>
          )}

          {/* D. Rendered Generated Notes Output (All 7 Sections) */}
          {!isLoading && currentNote && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
              {/* Note Header & Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      {currentNote.subject}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {currentNote.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" /> {currentNote.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentNote.title}
                  </h2>
                </div>

                {/* Prominent Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Save Note Button */}
                  <button
                    onClick={handleSaveNote}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer ${
                      isCurrentNoteSaved || savedSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    title="Save to local library"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : isCurrentNoteSaved ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>In Library</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopyNotes}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Copy full markdown text"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={handleDownloadNotes}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Download .md file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={handleDeleteCurrentNote}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete notes"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 7 Structured Sections */}
              <div className="space-y-4">
                {/* 1. Topic Overview */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('overview')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        1
                      </span>
                      <span>Topic Overview</span>
                    </div>
                    {expandedSections.overview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.overview && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                      {currentNote.overview}
                    </div>
                  )}
                </div>

                {/* 2. Key Concepts */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('concepts')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        2
                      </span>
                      <span>Key Concepts</span>
                    </div>
                    {expandedSections.concepts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.concepts && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                      {currentNote.keyConcepts.map((concept, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200/60 bg-white p-3.5 dark:border-slate-700/60 dark:bg-slate-800/80"
                        >
                          <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                            {concept.name}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {concept.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Important Definitions */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('definitions')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        3
                      </span>
                      <span>Important Definitions</span>
                    </div>
                    {expandedSections.definitions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.definitions && (
                    <div className="mt-3 space-y-2.5 pl-8">
                      {currentNote.definitions.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200/60 bg-white p-3.5 dark:border-slate-700/60 dark:bg-slate-800/80 text-xs leading-relaxed"
                        >
                          <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                            {item.term}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">
                            {item.definition}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Examples & Code */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('examples')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        4
                      </span>
                      <span>Examples & Code Snippets</span>
                    </div>
                    {expandedSections.examples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.examples && (
                    <div className="mt-3 space-y-3 pl-8">
                      {currentNote.examples.map((ex, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xs">
                          <div className="flex items-center justify-between border-b border-slate-800 px-3.5 py-1.5 text-[11px] font-mono text-slate-400">
                            <span>{ex.title}</span>
                          </div>
                          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                            <code>{ex.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Key Points */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('keyPoints')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        5
                      </span>
                      <span>High-Yield Key Points</span>
                    </div>
                    {expandedSections.keyPoints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.keyPoints && (
                    <div className="mt-3 space-y-2 pl-8">
                      {currentNote.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Summary */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('summary')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        6
                      </span>
                      <span>Summary & Quick Takeaways</span>
                    </div>
                    {expandedSections.summary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.summary && (
                    <div className="mt-3 pl-8">
                      <div className="rounded-xl border border-purple-200/60 bg-purple-50/50 p-4 dark:border-purple-900/40 dark:bg-purple-950/20 text-xs sm:text-sm text-purple-900 dark:text-purple-200 leading-relaxed font-medium">
                        {currentNote.summary}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Important Questions */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <button
                    onClick={() => toggleSection('questions')}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 text-xs font-bold dark:bg-purple-950 dark:text-purple-300">
                        7
                      </span>
                      <span>Important Exam Questions ({currentNote.questions.length})</span>
                    </div>
                    {expandedSections.questions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {expandedSections.questions && (
                    <div className="mt-3 space-y-3 pl-8">
                      {currentNote.questions.map((qItem, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-800/80 text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-bold text-slate-900 dark:text-white">
                              Q{idx + 1}: {qItem.q}
                            </p>
                            <button
                              onClick={() => toggleAnswer(idx)}
                              className="text-purple-600 dark:text-purple-400 font-bold shrink-0 hover:underline cursor-pointer"
                            >
                              {revealedAnswers[idx] ? 'Hide Answer' : 'Reveal Answer'}
                            </button>
                          </div>

                          {revealedAnswers[idx] && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150">
                              <strong className="text-emerald-600 dark:text-emerald-400">Answer: </strong>
                              {qItem.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Saved Notes Library Drawer / Modal */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Saved Notes Library ({savedNotes.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowSavedDrawer(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {savedNotes.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No notes saved yet. Click "Save Notes" after generating a topic.
                  </div>
                ) : (
                  savedNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleLoadSavedNote(n)}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 hover:border-purple-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-purple-500 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 truncate max-w-[240px]">
                          {n.subject}
                        </span>
                        <button
                          onClick={(e) => handleDeleteSavedNote(e, n.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {n.difficulty} • {n.createdAt}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowSavedDrawer(false)}
              className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
