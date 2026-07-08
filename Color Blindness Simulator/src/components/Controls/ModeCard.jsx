import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function ModeCard({ mode, isActive, onSelect }) {
  const { id, name, type, description, affected } = mode;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden backdrop-blur-md flex flex-col justify-between cursor-pointer ${
        isActive
          ? 'bg-primary/10 border-primary shadow-glow text-white'
          : 'bg-glass-card border-glass-border hover:border-white/20 text-gray-300 hover:text-white'
      }`}
    >
      {/* Selection Border Glow Indicator */}
      {isActive && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-xl rounded-full -mr-6 -mt-6 pointer-events-none" />
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-bold text-base leading-tight">{name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
            isActive 
              ? 'bg-accent/25 border-accent/30 text-accent' 
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}>
            {type}
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4 min-h-[40px]">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
        <span className="text-[10px] text-gray-500 font-medium">
          Affects: <span className="text-gray-400">{affected}</span>
        </span>

        {isActive ? (
          <Eye className="w-4 h-4 text-accent animate-pulse" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-600" />
        )}
      </div>
    </motion.button>
  );
}
