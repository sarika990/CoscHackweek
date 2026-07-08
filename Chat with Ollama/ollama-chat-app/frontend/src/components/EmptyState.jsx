import React from 'react';
import { FiMessageSquare, FiCode, FiMail, FiHelpCircle } from 'react-icons/fi';

const EmptyState = ({ onSelectSuggestion }) => {
  const suggestions = [
    {
      text: "Explain quantum computing in simple terms.",
      icon: <FiHelpCircle className="w-4 h-4 text-emerald-400" />,
      label: "Explain"
    },
    {
      text: "Write a JavaScript function to throttle API calls.",
      icon: <FiCode className="w-4 h-4 text-emerald-400" />,
      label: "Code"
    },
    {
      text: "Draft a polite email requesting project feedback.",
      icon: <FiMail className="w-4 h-4 text-emerald-400" />,
      label: "Writing"
    },
    {
      text: "Brainstorm 5 ideas for a green tech startup.",
      icon: <FiMessageSquare className="w-4 h-4 text-emerald-400" />,
      label: "Brainstorm"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto liquid-glow">
      {/* Premium Liquid Glass Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center backdrop-blur-md shadow-2xl shadow-emerald-500/20 pulse-green">
          {/* Custom Glass Glow SVG */}
          <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {/* Floating background glass orbs */}
        <div className="absolute -top-4 -left-4 w-6 h-6 rounded-full bg-mint-500/20 blur-md"></div>
        <div className="absolute -bottom-2 -right-4 w-8 h-8 rounded-full bg-emerald-500/20 blur-lg"></div>
      </div>

      <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2 tracking-tight">
        Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-mint-300">Ollama Chat</span>
      </h2>
      <p className="text-slate-400 max-w-md text-sm sm:text-base mb-8">
        Run local, private models without sharing data. Connect directly to your local instance.
      </p>

      {/* Suggested Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {suggestions.map((sug, idx) => (
          <div
            key={idx}
            onClick={() => onSelectSuggestion(sug.text)}
            className="glass-card p-4 rounded-2xl text-left cursor-pointer flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/10 shrink-0">
              {sug.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">{sug.label}</span>
              <p className="text-slate-200 text-sm mt-0.5 font-medium leading-snug line-clamp-2">{sug.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
