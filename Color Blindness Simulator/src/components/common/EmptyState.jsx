import React from 'react';
import { Eye, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import UploadBox from '../Upload/UploadBox';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Real-time GPU-accelerated Simulation
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Simulate <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Color Blindness</span> Instantly
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Upload any image to preview how it is viewed by people with Protanopia, Deuteranopia, Tritanopia, or Achromatopsia. Completely client-side.
        </p>
      </div>

      <UploadBox />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
        <div className="bg-glass-card border border-glass-border p-5 rounded-2xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-white font-semibold mb-2 text-sm">4 Deficiency Models</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Accurately transforms red, green, blue spectrums, or drops all hues for total color blindness.
          </p>
        </div>

        <div className="bg-glass-card border border-glass-border p-5 rounded-2xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <ShieldAlert className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-white font-semibold mb-2 text-sm">100% Client-Side Privacy</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            No server uploads, no cookies. Your files are processed entirely within the safety of your own browser.
          </p>
        </div>

        <div className="bg-glass-card border border-glass-border p-5 rounded-2xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <ImageIcon className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-white font-semibold mb-2 text-sm">Export High Resolution</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Maintain full original image dimensions and properties on simulated downloads.
          </p>
        </div>
      </div>
    </div>
  );
}
