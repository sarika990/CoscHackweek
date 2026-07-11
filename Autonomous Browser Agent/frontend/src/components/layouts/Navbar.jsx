import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Cpu, Bell, User, Menu, X, LayoutDashboard, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-accent/10 bg-bg-primary/90 backdrop-blur-glass px-4 lg:px-6 h-16 flex items-center justify-between">
      {/* Left — Brand + Sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-text-muted hover:text-accent rounded-lg hover:bg-bg-card transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 border border-accent/25">
            <Globe className="h-4.5 w-4.5 text-accent" />
          </div>
          <span className="font-heading font-bold text-lg tracking-wide bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent glow-accent">
            BrowserPilot AI
          </span>
          <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
            v1.0
          </span>
        </Link>
      </div>

      {/* Center — Quick nav (desktop) */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all
              ${isActive ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-text-secondary hover:bg-bg-card'}`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right — Status + Actions */}
      <div className="flex items-center gap-2">
        {/* AI indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/8 border border-accent/15 text-text-muted">
          <Cpu className="h-3.5 w-3.5 text-accent" />
          <span>Gemini Flash</span>
          <span className="status-dot active ml-0.5" />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 text-text-muted hover:text-accent hover:bg-bg-card rounded-lg transition-colors"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-text-muted hover:text-accent hover:bg-bg-card rounded-lg transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-accent/20 hover:border-accent/40 bg-bg-card/60 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-bg-primary font-bold text-xs">
              BP
            </div>
            <span className="hidden sm:block text-xs text-text-secondary font-medium">Operator</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 glass-card rounded-xl p-2 shadow-glass animate-fade-in border border-accent/15">
              <div className="px-3 py-2 border-b border-accent/10 mb-1">
                <p className="text-sm font-semibold text-text-primary">Operator Account</p>
                <p className="text-xs text-text-muted">pilot@browserpilot.ai</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"
              >
                <User className="h-4 w-4" /> Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
