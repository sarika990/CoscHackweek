import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Expand, 
  FileText 
} from 'lucide-react';
import ImageInfo from './ImageInfo';

export default function Toolbar() {
  const { 
    zoom, 
    setZoom, 
    setPan, 
    isFullscreen, 
    setIsFullscreen, 
    resetSimulator 
  } = useSimulator();

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
  };

  const handleActualSize = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    setZoom(0.75); // Safe initial fit zoom
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full bg-glass-card/50 border border-glass-border p-3 rounded-2xl backdrop-blur-md">
      <ImageInfo />

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/40 disabled:opacity-50 disabled:hover:bg-white/5 transition-all cursor-pointer"
          title="Zoom Out (50% min)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-white text-xs font-semibold px-2 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/40 disabled:opacity-50 disabled:hover:bg-white/5 transition-all cursor-pointer"
          title="Zoom In (400% max)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-white/10 mx-1" />

        <button
          onClick={handleActualSize}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/40 transition-all cursor-pointer text-xs flex items-center gap-1 font-medium"
          title="Actual Size (100%)"
        >
          <Maximize2 className="w-4 h-4 text-accent" />
          <span className="hidden md:inline">1:1</span>
        </button>

        <button
          onClick={handleFitToScreen}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/40 transition-all cursor-pointer text-xs flex items-center gap-1 font-medium"
          title="Fit to Screen"
        >
          <Minimize2 className="w-4 h-4 text-accent" />
          <span className="hidden md:inline">Fit</span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 mx-1" />

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isFullscreen 
              ? 'bg-primary text-white border-primary/50 shadow-glow' 
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-primary/40'
          }`}
          title="Toggle Fullscreen"
        >
          <Expand className="w-4 h-4" />
        </button>

        <button
          onClick={resetSimulator}
          className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
          title="Clear & Upload New"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
