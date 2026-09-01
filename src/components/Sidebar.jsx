import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  TrendingUp,
  BookOpen,
  FolderGit2,
  Settings,
  X,
  Sparkles,
  ChevronRight,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { studentProfile } from '../data/studentData';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
  { id: 'notes-generator', label: 'Notes Generator', icon: FileText, badge: null },
  { id: 'quiz-generator', label: 'Quiz Generator', icon: HelpCircle, badge: 'New' },
  { id: 'study-planner', label: 'Study Planner', icon: Calendar, badge: '3 tasks' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, badge: null },
  { id: 'subjects', label: 'Subjects', icon: BookOpen, badge: '4' },
  { id: 'resources', label: 'Resources', icon: FolderGit2, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export const Sidebar = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) => {
  const { currentUser, logout } = useAuth();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of StudyMind AI?')) {
      await logout();
    }
  };

  const displayName = currentUser?.name || studentProfile.name;
  const displayInitials = currentUser?.avatarInitials || studentProfile.initials;
  const displaySemester = currentUser?.semester || 'Semester 5';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 dark:border-slate-800/80 dark:bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 shadow-md shadow-indigo-500/20 text-white font-bold">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  StudyMind
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
                  <Sparkles className="h-2.5 w-2.5" /> AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Smart Learning Hub</p>
            </div>
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Navigation
          </div>

          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-600 dark:text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'AI' || item.badge === 'New'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Student Mini Profile Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <div className="rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/80 p-3.5 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm ring-2 ring-indigo-500/20">
                {displayInitials}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {displaySemester}
                </p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>XP Progress</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {studentProfile.totalXp} / {studentProfile.nextLevelXp}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
                  style={{
                    width: `${(studentProfile.totalXp / studentProfile.nextLevelXp) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Logout Shortcut Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

