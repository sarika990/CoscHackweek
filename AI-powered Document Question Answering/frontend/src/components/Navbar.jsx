import React from 'react';
import { FiSun, FiMoon, FiTrash2, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { HiLightningBolt } from 'react-icons/hi';

export default function Navbar({ 
  darkMode, 
  toggleDarkMode, 
  onClearChat, 
  onResetKB, 
  onDownloadChat, 
  hasMessages,
  apiHealthy 
}) {
  return (
    <nav className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <HiLightningBolt size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">DocQA</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${apiHealthy ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></span>
            {apiHealthy ? 'RAG Engine Active' : 'Gemini Key Pending'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {hasMessages && (
          <button 
            onClick={onDownloadChat}
            title="Download Chat History"
            className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FiDownload size={18} />
          </button>
        )}

        {hasMessages && (
          <button 
            onClick={onClearChat}
            title="Clear Chat Window"
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <FiTrash2 size={18} />
          </button>
        )}

        <button 
          onClick={onResetKB}
          title="Reset Knowledge Base"
          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
        >
          <FiRefreshCw size={18} />
        </button>

        <button 
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </nav>
  );
}
