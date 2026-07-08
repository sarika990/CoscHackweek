import React from 'react';
import { FiCpu, FiRefreshCw, FiGithub, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Navbar = ({ backendStatus, onRefresh }) => {
  const getStatusBadge = () => {
    if (!backendStatus.online) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25">
          <FiAlertCircle className="w-3.5 h-3.5" />
          Server Offline
        </span>
      );
    }
    if (!backendStatus.ollama) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
          <FiAlertCircle className="w-3.5 h-3.5" />
          Ollama Down
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 pulse-green">
        <FiCheckCircle className="w-3.5 h-3.5" />
        Ollama Connected
      </span>
    );
  };

  return (
    <header className="h-16 border-b border-glass-border glass-panel flex items-center justify-between px-6 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-mint-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <FiCpu className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            Ollama <span className="text-emerald-400">GlassChat</span>
          </h1>
          <p className="text-[10px] text-slate-400 hidden sm:block">Local LLM Interface</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {getStatusBadge()}
        
        <button
          onClick={onRefresh}
          title="Refresh Connection"
          className="p-2 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 hover:text-emerald-300 transition-all duration-200 active:scale-95"
        >
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
