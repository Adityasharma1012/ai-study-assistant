/**
 * Progress & Analytics Statistics Calculator
 * Computes dynamic student analytics from actual localStorage data:
 * - Tasks: study_assistant_all_tasks
 * - Quizzes: study_assistant_quiz_history
 * - Notes: study_assistant_saved_notes
 */

export const LOCAL_STORAGE_TASKS_KEY = 'study_assistant_all_tasks';
export const LOCAL_STORAGE_QUIZ_KEY = 'study_assistant_quiz_history';
export const LOCAL_STORAGE_NOTES_KEY = 'study_assistant_saved_notes';

// Baseline fallback seed metrics for Aditya Sharma (Semester 5)
const BASELINE_STATS = {
  baselineHours: 142.0,
  streakDays: 12,
  subjectBaseHours: {
    'CS301': 42.5,
    'CS304': 38.0,
    'CS307': 34.5,
    'CS310': 27.0,
  },
  baseWeeklyDays: [
    { day: 'Mon', fullDay: 'Monday', hours: 4.5, target: 5.0, focus: 'Algorithms DP' },
    { day: 'Tue', fullDay: 'Tuesday', hours: 5.0, target: 5.0, focus: 'Virtual Memory' },
    { day: 'Wed', fullDay: 'Wednesday', hours: 3.5, target: 5.0, focus: 'SQL Indexing' },
    { day: 'Thu', fullDay: 'Thursday', hours: 6.0, target: 5.0, focus: 'Graph BFS/DFS' },
    { day: 'Fri', fullDay: 'Friday', hours: 4.8, target: 5.0, focus: 'OS Deadlocks' },
    { day: 'Sat', fullDay: 'Saturday', hours: 5.5, target: 5.0, focus: 'AI Quiz Blitz' },
    { day: 'Sun', fullDay: 'Sunday', hours: 5.2, target: 5.0, focus: 'Revision Plan', isToday: true },
  ]
};

export function getCalculatedProgressStats() {
  // 1. Read actual localStorage data
  let tasks = [];
  let quizzes = [];
  let notes = [];

  try {
    if (typeof localStorage !== 'undefined') {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
      if (savedTasks) tasks = JSON.parse(savedTasks);
    }
  } catch (e) {
    console.error(e);
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const savedQuizzes = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
      if (savedQuizzes) quizzes = JSON.parse(savedQuizzes);
    }
  } catch (e) {
    console.error(e);
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const savedNotes = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (savedNotes) notes = JSON.parse(savedNotes);
    }
  } catch (e) {
    console.error(e);
  }

  // 2. Compute Task Metrics
  const completedTasks = tasks.filter((t) => t.completed);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = tasks.length || 1;
  const taskCompletionRate = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Compute additional study hours from completed tasks (each task is ~0.75 - 1.5h)
  let taskEarnedHours = 0;
  completedTasks.forEach((t) => {
    const minsMatch = t.estimatedTime?.match(/(\d+)/);
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 45;
    taskEarnedHours += mins / 60;
  });

  // Additional hours from quizzes & notes (each quiz ~ 0.3h, each note ~ 0.5h)
  const quizEarnedHours = quizzes.length * 0.35;
  const notesEarnedHours = notes.length * 0.5;

  const totalStudyHours = Math.round((BASELINE_STATS.baselineHours + taskEarnedHours + quizEarnedHours + notesEarnedHours) * 10) / 10;
  const weeklyStudyHours = Math.round((28.5 + taskEarnedHours) * 10) / 10;
  const monthlyStudyHours = Math.round((totalStudyHours * 0.72) * 10) / 10;

  // 3. Compute Quiz Metrics
  let totalQuizScoreSum = 0;
  let totalQuizQuestionsAnswered = 0;
  let totalQuizQuestionsCorrect = 0;

  if (quizzes.length > 0) {
    quizzes.forEach((q) => {
      totalQuizScoreSum += q.percentage || 0;
      totalQuizQuestionsAnswered += q.totalQuestions || 5;
      totalQuizQuestionsCorrect += q.correctCount || 0;
    });
  } else {
    // Default baseline
    totalQuizScoreSum = 89.4 * 5;
    totalQuizQuestionsAnswered = 25;
    totalQuizQuestionsCorrect = 22;
  }

  const quizAttemptsCount = quizzes.length || 5;
  const avgQuizScore = Math.round((totalQuizScoreSum / quizAttemptsCount) * 10) / 10;
  const quizAccuracy = Math.round((totalQuizQuestionsCorrect / (totalQuizQuestionsAnswered || 1)) * 100);

  // 4. Completed Topics List (deduplicated from completed tasks and notes)
  const completedTopicsSet = new Set();
  completedTasks.forEach((t) => {
    if (t.topic) completedTopicsSet.add(t.topic);
    else if (t.title) completedTopicsSet.add(t.title);
  });
  notes.forEach((n) => {
    if (n.title) completedTopicsSet.add(n.title);
  });

  // Ensure default core topics if empty
  if (completedTopicsSet.size === 0) {
    completedTopicsSet.add("Binary Search & Divide and Conquer");
    completedTopicsSet.add("Recursion & Call Stack Modeling");
    completedTopicsSet.add("ACID Properties & Transactions");
    completedTopicsSet.add("CPU Scheduling Algorithms");
  }

  const completedTopics = Array.from(completedTopicsSet);

  // 5. Subject-wise Progress Calculation
  const subjectsData = [
    {
      code: 'CS301',
      title: 'Design & Analysis of Algorithms',
      color: 'from-indigo-600 to-blue-500',
      tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      baseProgress: 82,
      hours: BASELINE_STATS.subjectBaseHours['CS301'] + (completedTasks.filter(t => t.subject?.includes('301')).length * 0.8),
    },
    {
      code: 'CS304',
      title: 'Operating Systems Architecture',
      color: 'from-purple-600 to-pink-500',
      tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      baseProgress: 76,
      hours: BASELINE_STATS.subjectBaseHours['CS304'] + (completedTasks.filter(t => t.subject?.includes('304')).length * 0.8),
    },
    {
      code: 'CS307',
      title: 'Database Management Systems',
      color: 'from-emerald-600 to-teal-500',
      tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      baseProgress: 88,
      hours: BASELINE_STATS.subjectBaseHours['CS307'] + (completedTasks.filter(t => t.subject?.includes('307')).length * 0.8),
    },
    {
      code: 'CS310',
      title: 'Artificial Intelligence & ML',
      color: 'from-amber-500 to-orange-500',
      tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      baseProgress: 65,
      hours: BASELINE_STATS.subjectBaseHours['CS310'] + (completedTasks.filter(t => t.subject?.includes('310')).length * 0.8),
    },
  ];

  // Adjust subject progress dynamically based on completed tasks & notes
  const subjectProgress = subjectsData.map((sub) => {
    const subTasks = completedTasks.filter((t) => t.subject?.includes(sub.code));
    const subNotes = notes.filter((n) => n.subject?.includes(sub.code));
    const subQuizzes = quizzes.filter((q) => q.subject?.includes(sub.code));

    const bonus = Math.min(18, subTasks.length * 2 + subNotes.length * 3 + subQuizzes.length * 2);
    const progress = Math.min(100, sub.baseProgress + bonus);

    return {
      ...sub,
      progress,
      tasksDone: subTasks.length + 4,
      totalTasks: subTasks.length + 8,
      notesCount: subNotes.length + 3,
      hours: Math.round(sub.hours * 10) / 10,
    };
  });

  const overallProgress = Math.round(
    subjectProgress.reduce((sum, s) => sum + s.progress, 0) / subjectProgress.length
  );

  // 6. Weekly Study Days with dynamic today adjustment
  const weeklyDays = BASELINE_STATS.baseWeeklyDays.map((d) => {
    if (d.isToday) {
      return {
        ...d,
        hours: Math.round((5.2 + taskEarnedHours) * 10) / 10,
      };
    }
    return d;
  });

  return {
    totalStudyHours,
    weeklyStudyHours,
    monthlyStudyHours,
    studyStreak: BASELINE_STATS.streakDays + (completedTasksCount > 2 ? 1 : 0),
    overallProgress,
    avgQuizScore,
    quizAccuracy,
    totalQuizzesTaken: quizzes.length > 0 ? quizzes.length : 5,
    completedTasksCount,
    totalTasksCount: tasks.length,
    completedTopicsCount: completedTopics.length,
    completedTopics,
    subjectProgress,
    weeklyDays,
    recentQuizzes: quizzes.slice(0, 5),
    savedNotesCount: notes.length,
  };
}
