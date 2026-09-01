import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthView } from './components/auth/AuthView';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { AIAssistantView } from './components/AIAssistantView';
import { NotesGeneratorView } from './components/NotesGeneratorView';
import { QuizGeneratorView } from './components/QuizGeneratorView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { ProgressView } from './components/ProgressView';
import { SubjectsView } from './components/SubjectsView';
import { ResourcesView } from './components/ResourcesView';
import { SettingsView } from './components/SettingsView';
import { PlaceholderView } from './components/PlaceholderView';

function AuthenticatedApp() {
  const { isAuthenticated, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // If user is not authenticated, protect all routes and show Login/Signup/Forgot screens
  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Top Navigation Bar */}
        <TopNavbar
          setMobileOpen={setMobileOpen}
          setActiveTab={setActiveTab}
        />

        {/* Page Content Router View */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' ? (
            <DashboardView setActiveTab={setActiveTab} />
          ) : activeTab === 'ai-assistant' ? (
            <AIAssistantView setActiveTab={setActiveTab} />
          ) : activeTab === 'notes-generator' ? (
            <NotesGeneratorView setActiveTab={setActiveTab} />
          ) : activeTab === 'quiz-generator' ? (
            <QuizGeneratorView setActiveTab={setActiveTab} />
          ) : activeTab === 'study-planner' ? (
            <StudyPlannerView setActiveTab={setActiveTab} />
          ) : activeTab === 'progress' ? (
            <ProgressView setActiveTab={setActiveTab} />
          ) : activeTab === 'subjects' ? (
            <SubjectsView setActiveTab={setActiveTab} />
          ) : activeTab === 'resources' ? (
            <ResourcesView setActiveTab={setActiveTab} />
          ) : activeTab === 'settings' ? (
            <SettingsView setActiveTab={setActiveTab} />
          ) : (
            <PlaceholderView tabId={activeTab} setActiveTab={setActiveTab} />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white/50 py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400">
          <p>© 2026 StudyMind AI Assistant • Student Dashboard for {currentUser?.name || 'Aditya Sharma'} • Built with React, Vite & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AuthenticatedApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
