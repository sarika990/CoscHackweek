import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="p-4 mb-6 rounded-full bg-emerald-900/20 border border-emerald-700/30">
        <AlertTriangle className="h-16 w-16 text-yellow-400" />
      </div>
      <h1 className="text-6xl font-extrabold font-heading bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <p className="text-xl font-semibold text-white mb-2">Page Not Found</p>
      <p className="text-emerald-500/70 text-sm max-w-md mb-8 leading-relaxed">
        The page you're looking for doesn't exist in this agent's memory. You may have followed an outdated link or mistyped the URL.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-7 py-3 bg-neonGreen hover:bg-emerald-400 text-emerald-950 rounded-xl font-bold transition-all hover:shadow-neon-strong hover:scale-105"
      >
        <Home className="h-4 w-4" />
        Return to Home
      </Link>
    </div>
  );
}
