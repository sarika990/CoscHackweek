import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Comparisons from './pages/Comparisons';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Pages Container */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/comparisons" element={<Comparisons />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/50 dark:border-dark-border/50">
        © 2026 ImagoCompare. Crafted for high-performance visual search.
      </footer>

      {/* Global Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800 text-slate-900 bg-white border border-slate-100 shadow-xl rounded-xl',
          duration: 4000,
        }}
      />
    </div>
  );
}

export default App;
