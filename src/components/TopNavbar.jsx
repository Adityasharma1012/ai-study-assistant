import React, { useState } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Flame,
  ChevronDown,
  BookMarked,
  Command,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { studentProfile } from '../data/studentData';

export const TopNavbar = ({ setMobileOpen, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of StudyMind AI?')) {
      await logout();
    }
  };

  const displayName = currentUser?.name || studentProfile.name;
  const displayInitials = currentUser?.avatarInitials || studentProfile.initials;
  const displayEmail = currentUser?.email || studentProfile.email;
  const displayMajor = currentUser?.major || studentProfile.major;

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6 lg:px-8">
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search subjects, AI notes, flashcards, topics..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
          <div className="absolute inset-y-0 right-0 hidden sm:flex items-center pr-3">
            <kbd className="inline-flex items-center rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Streak, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Study Streak Pill */}
        <div
          title="Active Continuous Study Streak!"
          className="hidden md:flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 border border-amber-200/70 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300"
        >
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{studentProfile.streakDays} Day Streak</span>
        </div>

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
            </span>
          </button>

          {/* Notifications Dropdown Preview */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  Notifications
                </span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2.5">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    Algorithms Midterm Quiz in 2 days
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 modules ready for revision</p>
                </div>
                <div className="py-2.5">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    AI Study Plan updated for today
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">2 morning tasks scheduled</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Card Header */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-3 shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 text-xs font-bold text-white shadow-xs">
              {displayInitials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                  {displayName}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate max-w-[120px]">
                {currentUser?.semester || 'Semester 5'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <BookMarked className="h-3 w-3" /> {displayMajor}
                </div>
              </div>
              <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
