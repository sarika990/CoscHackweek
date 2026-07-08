import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Loader2 } from 'lucide-react';

export default function Loader() {
  const { isLoading } = useSimulator();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="bg-brand-dark/40 border border-glass-border p-8 rounded-2xl flex flex-col items-center gap-4 shadow-glow max-w-xs text-center backdrop-blur-xl">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div>
          <h3 className="text-white font-semibold text-lg">Processing Image</h3>
          <p className="text-gray-400 text-sm mt-1">Applying pixel transformations...</p>
        </div>
      </div>
    </div>
  );
}
