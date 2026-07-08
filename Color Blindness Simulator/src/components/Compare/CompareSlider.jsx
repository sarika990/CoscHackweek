import React, { useRef, useState, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { getProcessedCanvas } from '../../utils/canvasUtils';

export default function CompareSlider() {
  const { 
    image, 
    activeMode, 
    zoom, 
    pan, 
    setPan, 
    sliderPosition, 
    setSliderPosition 
  } = useSimulator();

  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const [processedUrl, setProcessedUrl] = useState('');
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Generate processed image URL for fast CSS layer overlay
  useEffect(() => {
    if (!image) return;

    const canvas = getProcessedCanvas(image, activeMode);
    const url = canvas.toDataURL();
    setProcessedUrl(url);

    return () => {
      // Clean up to avoid memory leaks
    };
  }, [image, activeMode]);

  // Handle slider drag
  const handleSliderMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDownSlider = (e) => {
    e.preventDefault();
    setIsDraggingSlider(true);
  };

  // Handle pan
  const handlePointerDownPan = (e) => {
    if (e.target.closest('.slider-handle')) return; // ignore slider handle drags
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      } else if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        });
      }
    };

    const handlePointerUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };

    if (isDraggingSlider || isPanning) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSlider, isPanning, panStart, pan, setPan]);

  if (!image) return null;

  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden flex items-center justify-center bg-brand-dark/20 rounded-2xl select-none"
      onPointerDown={handlePointerDownPan}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      {/* Zoom / Pan Wrapper */}
      <div 
        className="relative max-w-full max-h-full flex items-center justify-center transition-all"
        style={transformStyle}
      >
        {/* Original Image Layer (Left/Background) */}
        <img 
          src={image.src} 
          alt="Original" 
          className="max-h-[60vh] object-contain pointer-events-none"
          draggable="false"
        />

        {/* Processed Image Layer (Right/Foreground) */}
        {processedUrl && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ 
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` 
            }}
          >
            <img 
              src={processedUrl} 
              alt="Simulated" 
              className="max-h-[60vh] object-contain pointer-events-none"
              draggable="false"
            />
          </div>
        )}

        {/* Draggable Slider Line */}
        <div 
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-glow-accent cursor-ew-resize flex items-center justify-center pointer-events-auto"
          style={{ left: `${sliderPosition}%` }}
          onPointerDown={handlePointerDownSlider}
        >
          <div className="slider-handle w-8 h-8 rounded-full bg-accent text-brand-dark flex items-center justify-center border border-white shadow-lg pointer-events-none">
            <span className="text-[10px] font-bold">↔</span>
          </div>
        </div>
      </div>

      {/* Floating Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-accent/25 backdrop-blur-md text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20 uppercase tracking-wider">
        {activeMode}
      </div>
    </div>
  );
}
