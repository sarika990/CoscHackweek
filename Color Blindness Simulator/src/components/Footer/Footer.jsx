import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-glass-border bg-brand-dark/40 py-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        
        {/* Attribution */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-400">Color Vision Simulator</span>
          <span>&copy; {new Date().getFullYear()} - All rights reserved.</span>
        </div>

        {/* Local Processing Guarantee */}
        <div className="flex items-center gap-1.5 text-accent/80 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Processed entirely client-side. No files are uploaded to any server.</span>
        </div>
      </div>
    </footer>
  );
}
