import React from 'react';

export const StatSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="backdrop-blur-md bg-white/40 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 rounded-2xl p-4 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3"></div>
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="overflow-hidden backdrop-blur-md bg-white/40 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 rounded-2xl animate-pulse">
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 w-full"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
