import React, { useState, useRef, useEffect } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';
import './ComparisonCard.css';

export default function ComparisonCard({ originalUrl, compressedUrl }) {
  const [mode, setMode] = useState('split'); // 'side-by-side' or 'split'
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos(prev => Math.max(0, prev - 2));
    } else if (e.key === 'ArrowRight') {
      setSliderPos(prev => Math.min(100, prev + 2));
    }
  };

  return (
    <div className="comparison-card glass-card">
      <div className="comparison-header">
        <h4 className="comparison-title">Interactive Comparison</h4>
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${mode === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setMode('side-by-side')}
            title="Side-by-Side Comparison"
          >
            <Columns size={16} />
            <span>Side-by-Side</span>
          </button>
          <button 
            className={`mode-btn ${mode === 'split' ? 'active' : ''}`}
            onClick={() => setMode('split')}
            title="Split-Slider Comparison"
          >
            <SplitSquareVertical size={16} />
            <span>Interactive Split</span>
          </button>
        </div>
      </div>

      <div className="comparison-viewport-wrapper">
        {mode === 'side-by-side' ? (
          <div className="side-by-side-layout">
            <div className="compare-pane">
              <div className="pane-tag tag-original">Original</div>
              <img src={originalUrl} alt="Original comparison" className="compare-img" />
            </div>
            <div className="compare-pane">
              <div className="pane-tag tag-compressed">Compressed</div>
              <img src={compressedUrl} alt="Compressed comparison" className="compare-img" />
            </div>
          </div>
        ) : (
          <div 
            className="split-slider-layout" 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            role="slider"
            aria-valuenow={sliderPos}
            aria-valuemin="0"
            aria-valuemax="100"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Before-after image splitter"
          >
            {/* Original Image Background */}
            <div className="split-pane original-pane">
              <div className="pane-tag tag-original">Original</div>
              <img src={originalUrl} alt="Original Split" className="compare-img" />
            </div>

            {/* Compressed Image Overlay */}
            <div 
              className="split-pane compressed-pane"
              style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
            >
              <div className="pane-tag tag-compressed">Compressed</div>
              <img src={compressedUrl} alt="Compressed Split" className="compare-img" />
            </div>

            {/* Slider Bar Handle */}
            <div 
              className="split-handle"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="handle-line"></div>
              <div className="handle-button">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
