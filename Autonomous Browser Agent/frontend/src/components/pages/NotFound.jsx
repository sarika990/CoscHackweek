import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="p-5 rounded-2xl bg-accent/8 border border-accent/15 mb-6">
        <AlertTriangle className="h-16 w-16 text-warn" />
      </div>
      <h1 className="text-8xl font-heading font-black bg-gradient-to-b from-accent to-accent/20 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <p className="text-xl font-heading font-bold text-text-primary mb-2">Page Not Found</p>
      <p className="text-text-muted text-sm max-w-md mb-8 leading-relaxed">
        This page doesn't exist in the agent's memory. You may have followed a broken link or typed an incorrect URL.
      </p>
      <Link
        to="/"
        className="btn-primary flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold"
      >
        <Home className="h-4.5 w-4.5" /> Return Home
      </Link>
    </div>
  );
}
