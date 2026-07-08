import React, { useState, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { getProcessedCanvas } from '../../utils/canvasUtils';

export default function CompareSplit() {
  const { image, activeMode, zoom, pan, setPan } = useSimulator();
  const [processedUrl, setProcessedUrl] = useState('');
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!image) return;

    const canvas = getProcessedCanvas(image, activeMode);
    setProcessedUrl(canvas.toDataURL());
  }, [image, activeMode]);

  const handlePointerDown = (e) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  useEffect(() => {
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

  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full min-h-[450px]"
      onPointerDown={handlePointerDown}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      {/* Original Image Panel */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-brand-dark/20 rounded-2xl border border-glass-border select-none">
        <div style={transformStyle} className="relative flex items-center justify-center">
          <img 
            src={image.src} 
            alt="Original" 
            className="max-h-[50vh] object-contain pointer-events-none"
            draggable="false"
          />
        </div>
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider">
          Original Vision
        </div>
      </div>

      {/* Simulated Image Panel */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-brand-dark/20 rounded-2xl border border-glass-border select-none">
        <div style={transformStyle} className="relative flex items-center justify-center">
          <img 
            src={processedUrl || image.src} 
            alt="Simulated" 
            className="max-h-[50vh] object-contain pointer-events-none"
            draggable="false"
          />
        </div>
        <div className="absolute top-4 left-4 bg-accent/25 backdrop-blur-md text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20 uppercase tracking-wider">
          {activeMode} Mode
        </div>
      </div>
    </div>
  );
}
