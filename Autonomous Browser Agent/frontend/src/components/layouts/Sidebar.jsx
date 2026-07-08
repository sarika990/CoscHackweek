import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, LayoutDashboard, History, Settings, Info, Terminal, HelpCircle } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/features', label: 'Features', icon: Compass },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/history', label: 'Task History', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/about', label: 'About', icon: Info }
  ];

  const sidebarClass = `
    fixed inset-y-0 left-0 z-35 w-64 border-r border-emerald-900/40 bg-emerald-950/60 backdrop-blur-md pt-20 px-4 transition-transform duration-300 lg:static lg:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile background mask */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={sidebarClass}>
        <div className="flex flex-col h-full justify-between pb-8">
          <div className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-900/40 border-l-2 border-neonGreen text-white shadow-neon' 
                      : 'text-emerald-400/80 hover:text-white hover:bg-emerald-900/20'}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/20 text-xs text-emerald-500/80">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-emerald-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>Execution Node</span>
            </div>
            <p className="mb-2">Active Node: localhost:8000</p>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-neonGreen animate-pulse" />
              <span>Status: Connected</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
