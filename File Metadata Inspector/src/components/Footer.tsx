import { ScanLine, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-surface-700/40 bg-surface-900/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-surface-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
              <ScanLine className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-surface-400">MetaInspect</span>
            <span>·</span>
            <span>© {year}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            Built with
            <Heart className="w-3 h-3 text-red-400 mx-0.5 fill-current" />
            using React, Vite & Tailwind CSS
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-surface-500 hover:text-surface-300 transition-colors"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-surface-600">·</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
