import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import CompareSlider from '../Compare/CompareSlider';
import CompareSplit from '../Compare/CompareSplit';
import Toolbar from './Toolbar';
import { Columns, Split, Layout, Maximize2 } from 'lucide-react';
import { getProcessedCanvas } from '../../utils/canvasUtils';

export default function ImagePreview() {
  const { 
    image, 
    activeMode, 
    compareMode, 
    setCompareMode, 
    zoom, 
    pan, 
    setPan, 
    isFullscreen, 
    setIsFullscreen 
  } = useSimulator();

  const [singleProcessedUrl, setSingleProcessedUrl] = React.useState('');
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });

  // Generate single preview processed image URL
  React.useEffect(() => {
    if (!image) return;
    const canvas = getProcessedCanvas(image, activeMode);
    setSingleProcessedUrl(canvas.toDataURL());
  }, [image, activeMode]);

  const handlePointerDown = (e) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  React.useEffect(() => {
    const handlePointerMove = (e) => {
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        });
      }
    };

    const handlePointerUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isPanning, panStart, setPan]);

  if (!image) return null;

  const renderPreviewContent = () => {
    if (compareMode === 'sideBySide') {
      return <CompareSplit />;
    }
    if (compareMode === 'slider') {
      return <CompareSlider />;
    }

    // Default Single View
    const transformStyle = {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
      transformOrigin: 'center center',
      transition: isPanning ? 'none' : 'transform 0.1s ease-out'
    };

    return (
      <div 
        className="relative w-full h-full overflow-hidden flex items-center justify-center bg-brand-dark/20 rounded-2xl border border-glass-border select-none min-h-[450px]"
        onPointerDown={handlePointerDown}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div style={transformStyle} className="relative flex items-center justify-center">
          <img 
            src={singleProcessedUrl || image.src} 
            alt="Simulated View" 
            className="max-h-[60vh] object-contain pointer-events-none"
            draggable="false"
          />
        </div>
        <div className="absolute top-4 left-4 bg-accent/20 backdrop-blur-md text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20 uppercase tracking-wider">
          {activeMode} View
        </div>
      </div>
    );
  };

  const fullscreenClasses = isFullscreen 
    ? 'fixed inset-0 bg-brand-dark z-50 p-6 flex flex-col justify-between overflow-auto' 
    : 'w-full flex flex-col gap-4';

  return (
    <div className={fullscreenClasses}>
      {/* Compare View Option Selector & Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            Image Preview 
            {isFullscreen && <span className="text-xs font-normal text-accent">(Fullscreen)</span>}
          </h2>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setCompareMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                compareMode === 'single'
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Single
            </button>
            <button
              onClick={() => setCompareMode('slider')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                compareMode === 'slider'
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Slider
            </button>
            <button
              onClick={() => setCompareMode('sideBySide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                compareMode === 'sideBySide'
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side by Side
            </button>
          </div>
        </div>

        <Toolbar />
      </div>

      {/* Main Render Area */}
      <div className={`relative flex-grow flex items-center justify-center ${isFullscreen ? 'h-[80vh] mt-4' : 'h-[50vh] min-h-[450px]'}`}>
        {renderPreviewContent()}
      </div>

      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold self-center transition-all cursor-pointer"
        >
          Exit Fullscreen
        </button>
      )}
    </div>
  );
}
