import React from "react";
import { useCard } from "../context/CardContext";
import { motion } from "framer-motion";

const TEMPLATES = [
  { id: "modern", name: "Modern White", desc: "Clean and contemporary" },
  { id: "corporate", name: "Dark Professional", desc: "Premium dark layout" },
  { id: "minimal", name: "Ultra Minimal", desc: "Sleek and simple" },
  { id: "gradient", name: "Vibrant Gradient", desc: "Bold and colorful" },
  { id: "glassmorphism", name: "Glassmorphism", desc: "Futuristic frosted layout" }
];

export const TemplateSelector = () => {
  const { selectedTemplate, setSelectedTemplate, accentColor } = useCard();

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
        Business Card Template
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {TEMPLATES.map(tmpl => {
          const isActive = selectedTemplate === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`relative text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                isActive
                  ? "border-emerald-500 bg-white dark:bg-slate-900 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-750"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="template-active-indicator"
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <h3 className={`text-xs font-bold ${isActive ? "text-emerald-500" : "text-slate-800 dark:text-slate-100"}`}>
                {tmpl.name}
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-450 mt-0.5">{tmpl.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
