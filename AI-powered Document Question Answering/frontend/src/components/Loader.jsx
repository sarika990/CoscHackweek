import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-2 select-none">
      <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-600 animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-600 animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-600 animate-bounce"></div>
    </div>
  );
}
