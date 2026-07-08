import React from 'react';
import { FiCpu } from 'react-icons/fi';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 w-full animate-pulse justify-start">
      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
        <FiCpu className="w-4 h-4" />
      </div>

      <div className="flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl glass-card text-slate-100 flex items-center gap-2">
          <span className="text-sm text-slate-400">AI is thinking</span>
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
