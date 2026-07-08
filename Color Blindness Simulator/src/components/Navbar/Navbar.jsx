import React, { useState } from 'react';
import { Eye, Info, Github } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AboutModal from './AboutModal';

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-brand-dark/80 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-glow">
              <Eye className="w-5 h-5 text-brand-dark" />
            </div>
            <div>
              <span className="font-extrabold text-sm md:text-base tracking-tight text-white block">
                Color Vision
              </span>
              <span className="text-[10px] text-accent font-semibold tracking-wider uppercase -mt-1 block">
                Simulator
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            
            {/* About Modal Trigger */}
            <button
              onClick={() => setAboutOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:border-primary/50 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">About</span>
            </button>

            {/* GitHub Placeholder Button */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            <div className="h-6 w-[1px] bg-white/10 mx-1" />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
