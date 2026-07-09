import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for digital memory preservation.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} ChronosCapsule Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
