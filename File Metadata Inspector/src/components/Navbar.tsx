import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Moon, Sun, Keyboard } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "../lib/utils";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  totalFiles: number;
}

const SHORTCUTS = [
  { key: "U", desc: "Open upload dialog" },
  { key: "Del", desc: "Delete selected file" },
  { key: "F", desc: "Toggle favorite" },
  { key: "Esc", desc: "Close preview / dialog" },
  { key: "↑↓", desc: "Navigate files" },
];

export function Navbar({ isDark, onToggleTheme, totalFiles }: NavbarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-surface-900/95 backdrop-blur-xl border-b border-surface-700/60 shadow-lg shadow-black/20"
            : "bg-surface-900/80 backdrop-blur-md border-b border-surface-700/30"
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-900/50">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-surface-50 text-sm tracking-tight">
                  MetaInspect
                </span>
                <div className="text-[10px] text-surface-500 font-medium -mt-0.5 tracking-wider">
                  FILE METADATA INSPECTOR
                </div>
              </div>
            </div>

            {/* Center pill — file count */}
            <AnimatePresence>
              {totalFiles > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-800 border border-surface-700/60 text-xs font-medium text-surface-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {totalFiles} file{totalFiles !== 1 ? "s" : ""} loaded
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(true)}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                title="Keyboard shortcuts"
                aria-label="Show keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                title="View on GitHub"
                aria-label="View source on GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>

              <button
                onClick={onToggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all duration-200"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-surface-800 border border-surface-700 shadow-2xl p-6"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-5">
                <Keyboard className="w-5 h-5 text-brand-400" />
                <h2 className="font-bold text-surface-100">Keyboard Shortcuts</h2>
              </div>
              <div className="space-y-2">
                {SHORTCUTS.map(({ key, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-surface-700/50 last:border-0">
                    <span className="text-sm text-surface-400">{desc}</span>
                    <kbd className="px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-600 text-xs font-mono text-surface-300">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm text-surface-200 font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
