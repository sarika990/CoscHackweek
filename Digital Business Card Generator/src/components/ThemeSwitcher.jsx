import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useCard } from "../context/CardContext";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useCard();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750 dark:hover:text-white transition-all cursor-pointer"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      aria-label="Theme toggle"
    >
      {theme === "light" ? (
        <FaMoon className="text-base transition-transform hover:rotate-12 duration-300" />
      ) : (
        <FaSun className="text-base transition-transform hover:rotate-45 duration-300" />
      )}
    </button>
  );
};
