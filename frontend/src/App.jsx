import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DisclaimerModal from './components/DisclaimerModal';

function App() {
  const [accepted, setAccepted] = useState(false);

  if (!accepted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <DisclaimerModal
          onAccept={() => setAccepted(true)}
          onDecline={() => window.close()}
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
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Live
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
