import React from 'react';
import { LayoutDashboard, Star, Lock, Unlock, Settings, Eye } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, stats }) => {
  const menuItems = [
    { id: 'all', label: 'All Capsules', icon: LayoutDashboard, count: stats?.total || 0 },
    { id: 'locked', label: 'Locked', icon: Lock, count: stats?.locked || 0 },
    { id: 'unlocked', label: 'Unlocked', icon: Unlock, count: stats?.unlocked || 0 },
    { id: 'favorites', label: 'Favorites', icon: Star, count: null }, // count dynamically handled in state
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col space-y-6 h-fit">
      <div className="text-slate-800 dark:text-white font-bold text-lg px-2">
        Manage Memories
      </div>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== null && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-primary-700/60 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
