import React from "react";
import { useCard } from "../context/CardContext";
import { colorSuggestions } from "../utils/colorSuggestion";
import { FaPalette, FaRobot } from "react-icons/fa";

const PRESETS = [
  { name: "Emerald", color: "#10b981" },
  { name: "Blue", color: "#2563eb" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Orange", color: "#ea580c" },
  { name: "Indigo", color: "#4f46e5" },
  { name: "Slate", color: "#0f172a" },
  { name: "Rose", color: "#f43f5e" }
];

export const ColorSuggestions = () => {
  const { cardData, accentColor, setAccentColor, triggerColorSuggestion } = useCard();

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Accent Color System
        </label>
        
        {/* Suggestion indicator based on current profession */}
        {cardData.jobTitle && (
          <button
            onClick={() => triggerColorSuggestion(cardData.jobTitle)}
            className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 hover:text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10 transition-all cursor-pointer"
            title="Auto recommend accent based on profession"
          >
            <FaRobot />
            <span>AI Suggest</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Custom Color Input Wrapper */}
        <div className="relative flex items-center gap-2">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-800 bg-white"
            title="Choose custom color"
          />
          <FaPalette className="absolute pointer-events-none text-slate-400/80 text-xs left-2.5" />
        </div>

        {/* Preset Palettes */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {PRESETS.map(preset => (
            <button
              key={preset.color}
              onClick={() => setAccentColor(preset.color)}
              className="w-6 h-6 rounded-full border transition-all cursor-pointer hover:scale-110 active:scale-95"
              style={{
                backgroundColor: preset.color,
                borderColor: accentColor === preset.color ? "#10b981" : "rgba(0,0,0,0.1)",
                boxShadow: accentColor === preset.color ? "0 0 8px rgba(16,185,129,0.5)" : "none"
              }}
              title={preset.name}
              aria-label={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
