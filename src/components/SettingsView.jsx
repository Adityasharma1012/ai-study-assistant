import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  Sliders,
  Download,
  Trash2,
  Save,
  Check,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  X,
  RefreshCw,
  Mail,
  Camera,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { studentProfile } from '../data/studentData';
import { LOCAL_STORAGE_TASKS_KEY, LOCAL_STORAGE_QUIZ_KEY, LOCAL_STORAGE_NOTES_KEY } from '../utils/progressStats';
import { LOCAL_STORAGE_SUBJECTS_KEY } from './SubjectsView';
import { LOCAL_STORAGE_RESOURCES_KEY } from './ResourcesView';
import { useToast } from '../context/ToastContext';

const LOCAL_STORAGE_SETTINGS_KEY = 'study_assistant_user_settings';

const DEFAULT_SETTINGS = {
  name: 'Aditya Sharma',
  email: 'aditya.sharma@university.edu',
  major: 'B.Tech Computer Science & Engineering',
  semester: 'Semester 5',
  avatarInitials: 'AS',
  studyReminders: true,
  reminderTime: '19:30',
  defaultDifficulty: 'Intermediate',
  notesLength: 'Standard',
  autoSaveNotes: true,
};

export const SettingsView = ({ setActiveTab }) => {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  // Load user settings from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [clearInputText, setClearInputText] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Handle Form Change
  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save Settings
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    toast.success('Profile settings updated successfully!');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Export Complete Study Data
  const handleExportData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        student: settings,
        tasks: JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY) || '[]'),
        notes: JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTES_KEY) || '[]'),
        quizzes: JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY) || '[]'),
        subjects: JSON.parse(localStorage.getItem(LOCAL_STORAGE_SUBJECTS_KEY) || '[]'),
        resources: JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY) || '[]'),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `StudyMind_Backup_${settings.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccess(true);
      toast.success('Complete study backup JSON downloaded.');
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to export study data', e);
      toast.error('Failed to export study data.');
    }
  };

  // Clear All Application Data
  const handleClearAllData = () => {
    if (clearInputText !== 'CLEAR DATA') return;

    try {
      localStorage.removeItem(LOCAL_STORAGE_TASKS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_NOTES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_QUIZ_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SUBJECTS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_RESOURCES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);

      setShowClearConfirmModal(false);
      setClearInputText('');
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear application data', e);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Settings className="h-3.5 w-3.5 text-indigo-300" />
              <span>Student Account & Preferences</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Application Settings ⚙️
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage your student profile, study reminders, theme preferences, and data backups for <span className="font-bold text-white">{settings.name}</span>.
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-md animate-in fade-in">
              <Check className="h-4 w-4" />
              Settings Saved Successfully!
            </div>
          )}
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. PROFILE SECTION */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Profile Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize your study assistant experience and greeting tags
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar and Name Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
            <div className="relative group">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-xl font-extrabold text-white shadow-lg ring-4 ring-indigo-50 dark:ring-slate-800">
                {settings.avatarInitials}
              </div>
              <button
                type="button"
                onClick={() => {
                  const newInitials = prompt('Enter 2-letter avatar initials:', settings.avatarInitials);
                  if (newInitials && newInitials.trim().length <= 3) {
                    handleChange('avatarInitials', newInitials.trim().toUpperCase());
                  }
                }}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md hover:bg-indigo-600 dark:bg-slate-700 transition-colors cursor-pointer"
                title="Change Avatar Initials"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {settings.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settings.major} • {settings.semester}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mt-1">
                Student ID: CS-2023-8941
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                University Email Address
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Academic Program / Major
              </label>
              <input
                type="text"
                value={settings.major}
                onChange={(e) => handleChange('major', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Current Semester
              </label>
              <select
                value={settings.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
              >
                {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. PREFERENCES SECTION */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Application & Study Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize theme mode, default quiz parameters, and study reminders
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Light / Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Color Appearance Mode
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Currently active: <strong className="capitalize">{theme} Mode</strong>
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Study Reminders Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Daily Revision Reminders
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send reminder alerts for today's pending study tasks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {settings.studyReminders && (
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => handleChange('reminderTime', e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              )}
              <button
                onClick={() => handleChange('studyReminders', !settings.studyReminders)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  settings.studyReminders ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    settings.studyReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Default Difficulty Level */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Default AI Study Difficulty
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sets default complexity across Notes Generator, Quiz Generator, and Study Plans
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleChange('defaultDifficulty', diff)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    settings.defaultDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DATA MANAGEMENT & DANGER ZONE */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Backup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export study notes, tasks, and quizzes or reset application storage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Data */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Export Study Backup
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Download a complete JSON file containing all your notes, quiz records, tasks, subjects, and resources.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                exportSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-xs'
              }`}
            >
              {exportSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Backup Downloaded!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download JSON Backup
                </>
              )}
            </button>
          </div>

          {/* Clear All Data */}
          <div className="flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-rose-50/30 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-sm">
                <Trash2 className="h-4 w-4 text-rose-600" />
                Clear All Application Data
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300/80 mt-1 leading-relaxed">
                Irreversibly wipe all generated notes, quiz history, tasks, custom subjects, and saved resources from localStorage.
              </p>
            </div>

            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              Reset & Wipe All Data
            </button>
          </div>
        </div>
      </div>

      {/* 5. Clear All Data Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 space-y-6 animate-in zoom-in-95 duration-200 border border-rose-200 dark:border-rose-900/60 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mx-auto">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Confirm Irreversible Data Wipe
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This will delete all your generated study notes, quiz scores, planned tasks, and custom subjects. To confirm, type <strong className="text-rose-600 font-mono">CLEAR DATA</strong> below:
              </p>
            </div>

            <input
              type="text"
              value={clearInputText}
              onChange={(e) => setClearInputText(e.target.value)}
              placeholder="Type CLEAR DATA here..."
              className="w-full rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2.5 text-center font-mono text-xs font-bold text-rose-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirmModal(false);
                  setClearInputText('');
                }}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clearInputText !== 'CLEAR DATA'}
                onClick={handleClearAllData}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition-all cursor-pointer ${
                  clearInputText === 'CLEAR DATA'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'
                }`}
              >
                Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
