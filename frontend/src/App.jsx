import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import DisclaimerModal from './components/DisclaimerModal';
import AuthPage from './components/AuthPage';
import { LogOut } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    window.history.pushState({ page: 'dashboard' }, '', '#dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccepted(false);
    window.history.pushState({ page: 'login' }, '', '#login');
  };

  // Handle popstate for back button behavior (Requirement 10)
  useEffect(() => {
    const handlePopState = () => {
      if (isAuthenticated && window.location.hash !== '#dashboard') {
        handleLogout();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Handle automatic logout on backspace (Requirement 12)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAuthenticated && e.key === 'Backspace') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          handleLogout();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  // Handle URL access without login (Requirement 11)
  useEffect(() => {
    if (!isAuthenticated && window.location.hash === '#dashboard') {
      window.history.replaceState({ page: 'login' }, '', '#login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (!accepted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <DisclaimerModal
          onAccept={() => setAccepted(true)}
          onDecline={() => handleLogout()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">FS</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">INRForexSense</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Live
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors bg-slate-700/30 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-700/50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
