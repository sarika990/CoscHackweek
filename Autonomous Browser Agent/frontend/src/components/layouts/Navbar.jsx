import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ShieldAlert, Cpu, User, Menu, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onToggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-emerald-900/40 bg-emerald-950/70 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-heading tracking-wider bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 bg-clip-text text-transparent glow-text">
            BROWSERPILOT AI
          </span>
          <span className="hidden md:inline px-2 py-0.5 text-[10px] font-semibold text-neonGreen-glow bg-emerald-950 border border-emerald-500/30 rounded-full">
            v1.0.0 Stable
          </span>
        </Link>
      </div>

      {/* Action utilities */}
      <div className="flex items-center gap-3">
        {/* API Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-900/20 border border-emerald-500/10 rounded-full text-xs text-emerald-400">
          <Cpu className="h-3.5 w-3.5 text-neonGreen animate-pulse" />
          <span>Gemini Agent Engine</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded-lg transition-all"
          title="Toggle Theme Mode"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded-lg transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-neonGreen-glow animate-ping" />
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 border border-emerald-500/20 hover:border-emerald-500/40 rounded-full bg-emerald-900/20 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-emerald-950 font-bold text-sm">
              BP
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-emerald-900/45 bg-emerald-950/95 backdrop-blur-md p-2 shadow-2xl animate-slide-up">
              <div className="px-3 py-2 border-b border-emerald-900/20 text-xs">
                <p className="font-semibold text-emerald-300">Operator Account</p>
                <p className="text-emerald-500/70 truncate">pilot@browserpilot.ai</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/20 rounded-md transition-colors"
              >
                <User className="h-4 w-4" /> Account Info
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
