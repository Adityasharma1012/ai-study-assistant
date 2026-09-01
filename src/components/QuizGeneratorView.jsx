import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  ArrowRight,
  ArrowLeft,
  Clock,
  Flame,
  BarChart3,
  Bookmark,
  Check,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Layers,
  Zap,
  Target,
  FileText,
  X,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { generateQuiz } from '../services/aiService';
import { studentProfile } from '../data/studentData';
import { useToast } from '../context/ToastContext';

const SUBJECT_OPTIONS = [
  'CS301: Design & Analysis of Algorithms',
  'CS304: Operating Systems Architecture',
  'CS307: Database Management Systems',
  'CS310: Artificial Intelligence & Machine Learning',
  'CS302: Computer Networks',
  'General Computer Science & Foundations',
];

const SUGGESTED_QUIZ_TOPICS = [
  { topic: 'Dynamic Programming & Memoization', subject: 'CS301: Design & Analysis of Algorithms' },
  { topic: 'Virtual Memory, TLB & Paging', subject: 'CS304: Operating Systems Architecture' },
  { topic: 'Database Normalization, BCNF & ACID', subject: 'CS307: Database Management Systems' },
  { topic: 'Neural Networks & Gradient Descent', subject: 'CS310: Artificial Intelligence & Machine Learning' },
  { topic: 'Binary Search Trees & Complexity', subject: 'CS301: Design & Analysis of Algorithms' },
];

const LOCAL_STORAGE_QUIZ_KEY = 'study_assistant_quiz_history';

export const QuizGeneratorView = ({ setActiveTab }) => {
  const toast = useToast();
  // Config state
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);

  // Flow states: 'config' | 'taking' | 'results' | 'review'
  const [quizState, setQuizState] = useState('config');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Active quiz-taking state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }

  // Result metrics
  const [quizResult, setQuizResult] = useState(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Quiz history from localStorage
  const [quizHistory, setQuizHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify(quizHistory));
    } catch (e) {
      console.error('Failed to save quiz history', e);
    }
  }, [quizHistory]);

  // Generate Quiz
  const handleGenerateQuiz = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const quiz = await generateQuiz(subject, topic, questionCount, difficulty);
      setCurrentQuiz(quiz);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizState('taking');
    } catch (err) {
      console.error('Failed to generate quiz', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select Option
  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit Quiz & Compute Analytics
  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    let correctCount = 0;
    const weakTopicsSet = new Set();
    const reviewData = [];

    currentQuiz.questions.forEach((q) => {
      const userChoice = selectedAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;

      if (isCorrect) {
        correctCount++;
      } else {
        if (q.topic) weakTopicsSet.add(q.topic);
      }

      reviewData.push({
        ...q,
        userChoice,
        isCorrect,
      });
    });

    const total = currentQuiz.questions.length;
    const wrongCount = total - correctCount;
    const percentage = Math.round((correctCount / total) * 100);
    const accuracy = `${percentage}.0%`;

    let performanceMessage = '';
    let gradeBadge = '';
    if (percentage >= 90) {
      performanceMessage = 'Outstanding Mastery! 🎓 Top 5% performance across class cohorts.';
      gradeBadge = 'Grade A+ (Mastery)';
    } else if (percentage >= 70) {
      performanceMessage = 'Great Job! 👍 Solid grasp on fundamental concepts with minor areas for review.';
      gradeBadge = 'Grade B+ (Proficient)';
    } else {
      performanceMessage = 'Targeted Revision Recommended 📚 Review definitions and formulas below.';
      gradeBadge = 'Needs Practice';
    }

    const weakTopics = Array.from(weakTopicsSet);
    const recommendedTopics = weakTopics.length > 0
      ? weakTopics.map((t) => `Review core theorems and formulas for ${t}`)
      : ['Take an Advanced Difficulty Quiz to further sharpen your skills', 'Practice timed examination coding proofs'];

    const result = {
      id: `result-${Date.now()}`,
      quizId: currentQuiz.id,
      topic: currentQuiz.topic,
      subject: currentQuiz.subject,
      difficulty: currentQuiz.difficulty,
      totalQuestions: total,
      correctCount,
      wrongCount,
      score: `${correctCount} / ${total}`,
      percentage,
      accuracy,
      performanceMessage,
      gradeBadge,
      weakTopics,
      recommendedTopics,
      reviewData,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setQuizResult(result);
    setQuizHistory([result, ...quizHistory]);
    setQuizState('results');
    toast.success(`Quiz completed! You scored ${result.score} (${result.percentage}%).`);
  };

  // Restart Current Quiz
  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('taking');
    toast.info('Restarting quiz session. Good luck!');
  };

  // Generate New Quiz
  const handleNewQuiz = () => {
    setQuizState('config');
    setQuizResult(null);
  };

  // Delete an item from History
  const handleDeleteHistoryItem = (e, id) => {
    e.stopPropagation();
    setQuizHistory(quizHistory.filter((h) => h.id !== id));
    toast.info('Quiz record removed from history.');
  };

  const currentQ = currentQuiz?.questions[currentQuestionIndex];
  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;
  const totalAnsweredCount = currentQuiz ? Object.keys(selectedAnswers).length : 0;

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span>Adaptive Active-Recall Practice Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Adaptive Quiz Generator 🎯
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Test your knowledge, identify weak subject areas, and prepare for upcoming midterm exams with instant explanations for <span className="font-bold text-white">{studentProfile.fullName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistoryDrawer(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Trophy className="h-4 w-4 text-amber-300" />
              Quiz History ({quizHistory.length})
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Mode 1: CONFIGURATION VIEW */}
      {quizState === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Config Form (Span 6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Customize Practice Quiz
                </h2>
              </div>

              <form onSubmit={handleGenerateQuiz} className="space-y-4">
                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    1. Target Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 transition-all cursor-pointer"
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
                    2. Specific Topic / Subtopic
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Dynamic Programming, Virtual Memory, ACID..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all"
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

                {/* Difficulty Selector */}
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
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    4. Question Count
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                          questionCount === count
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit / Generate Button */}
                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className={`w-full rounded-2xl py-3 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isLoading || !topic.trim()
                      ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400 shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating Practice Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Start Practice Quiz
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Preset Topics & Advice (Span 6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Popular Exam Quiz Sets
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Click any topic below to automatically configure your quiz parameters:
              </p>

              <div className="space-y-2.5">
                {SUGGESTED_QUIZ_TOPICS.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setTopic(item.topic);
                      setSubject(item.subject);
                    }}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 hover:border-emerald-400 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-500 cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {item.subject}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.topic}
                      </h4>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800 dark:text-emerald-400 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Mode 2: ACTIVE QUIZ-TAKING VIEW */}
      {quizState === 'taking' && currentQuiz && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Progress & Navigation Status Bar */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {currentQuiz.subject}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {currentQuiz.difficulty}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {currentQuiz.topic}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </span>
                <p className="text-[11px] text-slate-400">
                  {totalAnsweredCount} answered
                </p>
              </div>
              <button
                onClick={handleSubmitQuiz}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Submit Quiz
              </button>
            </div>
          </div>

          {/* Question Stepper Bar */}
          <div className="flex items-center gap-1.5">
            {currentQuiz.questions.map((q, idx) => {
              const isCurr = idx === currentQuestionIndex;
              const hasAns = selectedAnswers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                    isCurr
                      ? 'bg-emerald-600 ring-2 ring-emerald-400/40'
                      : hasAns
                      ? 'bg-emerald-400 dark:bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  title={`Go to Question ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Active Question Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left flex items-center gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-md ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-emerald-500'
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  currentQuestionIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>

              {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all cursor-pointer"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" /> Finish & View Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Mode 3: POST-SUBMISSION RESULTS DASHBOARD */}
      {quizState === 'results' && quizResult && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Score Summary Banner */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800/80 dark:bg-slate-900 text-center space-y-6">
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/30">
              <Trophy className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                {quizResult.gradeBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Quiz Results: {quizResult.topic}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                {quizResult.performanceMessage}
              </p>
            </div>

            {/* 4 Performance Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Score</span>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {quizResult.score}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Percentage</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {quizResult.percentage}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Correct Answers</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-5 w-5" /> {quizResult.correctCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Wrong Answers</span>
                <p className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 flex items-center justify-center gap-1">
                  <XCircle className="h-5 w-5" /> {quizResult.wrongCount}
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Restart Quiz
              </button>

              <button
                onClick={() => setQuizState('review')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <BookOpen className="h-4 w-4" /> Review Answers & Explanations
              </button>

              <button
                onClick={handleNewQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" /> Generate New Quiz
              </button>
            </div>
          </div>

          {/* Diagnostic Analytics: Weak Topics & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Topics Box */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Identified Weak Areas
                </h3>
              </div>

              {quizResult.weakTopics.length === 0 ? (
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>No weak areas detected! You answered 100% correctly on this set.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {quizResult.weakTopics.map((topicItem, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-900/40 dark:bg-rose-950/20 text-xs text-rose-800 dark:text-rose-300"
                    >
                      <span className="font-semibold">{topicItem}</span>
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                        Needs Revision
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Revision Topics */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Recommended Study Actions
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  {quizResult.recommendedTopics.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('notes-generator')}
                className="mt-5 w-full rounded-xl bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" /> Generate Summary Notes on Weak Topics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Mode 4: DETAILED ANSWER REVIEW VIEW */}
      {quizState === 'review' && quizResult && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          {/* Top Bar with Back Action */}
          <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Detailed Answer Key & Explanations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score: {quizResult.score} ({quizResult.accuracy}) • {quizResult.topic}
              </p>
            </div>

            <button
              onClick={() => setQuizState('results')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Score Summary
            </button>
          </div>

          {/* Question Review Cards */}
          <div className="space-y-4">
            {quizResult.reviewData.map((q, idx) => (
              <div
                key={q.id}
                className={`rounded-3xl border p-6 space-y-4 transition-all ${
                  q.isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                    : 'border-rose-200/80 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Question {idx + 1} {q.topic && `• ${q.topic}`}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold shrink-0 ${
                      q.isCorrect
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {q.isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = q.userChoice === optIdx;
                    const isActualCorrect = q.correctIndex === optIdx;

                    let cardStyle = 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                    if (isActualCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-100/70 font-bold text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                    } else if (isUserChoice && !isActualCorrect) {
                      cardStyle = 'border-rose-500 bg-rose-100/70 line-through text-rose-950 dark:bg-rose-950/60 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 ${cardStyle}`}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                        {isActualCorrect && <Check className="h-3.5 w-3.5 ml-auto text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* In-depth Explanation */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80 text-xs space-y-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Detailed Explanation:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleNewQuiz}
              className="rounded-2xl bg-emerald-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Generate Another Quiz
            </button>
          </div>
        </div>
      )}

      {/* 6. Quiz History Drawer */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Completed Quiz History ({quizHistory.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryDrawer(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {quizHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No quizzes completed yet. Complete a quiz to build your history!
                  </div>
                ) : (
                  quizHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setQuizResult(item);
                        setQuizState('results');
                        setShowHistoryDrawer(false);
                      }}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 hover:border-emerald-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-500 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[220px]">
                          {item.subject}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {item.percentage}%
                          </span>
                          <button
                            onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Delete"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.topic}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Score: {item.score} • {item.completedAt}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowHistoryDrawer(false)}
              className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
