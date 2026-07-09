import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-6 dark:border-slate-800/80 dark:bg-slate-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} vCardForge. Handcrafted for professional networking.</p>
        <p className="mt-1 opacity-75">
          Powered by React 19, Vite, Tailwind CSS, Framer Motion, and jsPDF.
        </p>
      </div>
    </footer>
  );
};
