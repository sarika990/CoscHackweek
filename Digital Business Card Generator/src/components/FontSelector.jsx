import React from "react";
import { useCard } from "../context/CardContext";

const FONTS = [
  { id: "inter", name: "Inter (Modern)" },
  { id: "poppins", name: "Poppins (Friendly)" },
  { id: "roboto", name: "Roboto (Classic)" },
  { id: "montserrat", name: "Montserrat (Elegant)" }
];

export const FontSelector = () => {
  const { selectedFont, setSelectedFont } = useCard();

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
        Card Typography
      </label>
      <div className="grid grid-cols-2 gap-2">
        {FONTS.map(font => (
          <button
            key={font.id}
            onClick={() => setSelectedFont(font.id)}
            className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
              selectedFont === font.id
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold liquid-glow"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750"
            }`}
            style={{ fontFamily: font.id === "inter" ? "Inter" : font.id === "poppins" ? "Poppins" : font.id === "roboto" ? "Roboto" : "Montserrat" }}
          >
            {font.name}
          </button>
        ))}
      </div>
    </div>
  );
};
