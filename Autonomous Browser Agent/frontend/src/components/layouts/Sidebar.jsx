import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Compass, LayoutDashboard, History,
  Settings, Info, Terminal, Wifi
} from 'lucide-react';

const navLinks = [
  { to: '/',          label: 'Home',         icon: Home },
  { to: '/features',  label: 'Features',     icon: Compass },
  { to: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/history',   label: 'Task History', icon: History },
  { to: '/settings',  label: 'Settings',     icon: Settings },
  { to: '/about',     label: 'About',        icon: Info },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-bg-primary/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col
          border-r border-accent/10 bg-bg-secondary/95 backdrop-blur-glass
          pt-20 pb-6 transition-transform duration-300 ease-in-out
          lg:sticky lg:top-16 lg:translate-x-0 lg:h-[calc(100vh-4rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-accent/12 text-accent border border-accent/25 shadow-accent'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-card border border-transparent'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-accent' : ''}`} />
                  {label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Status Box */}
        <div className="mx-3 mt-4 p-3.5 rounded-xl glass-card border border-accent/12">
          <div className="flex items-center gap-2 mb-2.5">
            <Terminal className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-text-secondary">Agent Node</span>
          </div>
          <div className="space-y-1.5 text-xs text-text-muted">
            <div className="flex items-center justify-between">
              <span>Backend</span>
              <div className="flex items-center gap-1.5">
                <span className="status-dot active" />
                <span className="text-success font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Engine</span>
              <div className="flex items-center gap-1.5">
                <span className="status-dot active" />
                <span className="text-success font-medium">Gemini</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Browser</span>
              <div className="flex items-center gap-1.5">
                <span className="status-dot idle" />
                <span className="text-text-muted">Chromium</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
