import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Download, Calendar, Clock, RefreshCw } from 'lucide-react';
import { formatBytes } from '../../utils/compressor';
import './ImagePreview.css';

export default function ImagePreview({ 
  title, 
  imageUrl, 
  file, 
  compressedData, 
  onReset, 
  onDownload, 
  isCompressed = false 
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset zoom and pan when image changes
  useEffect(() => {
    handleResetTransform();
  }, [imageUrl]);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    let newZoom = zoom + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    newZoom = Math.max(0.5, Math.min(newZoom, 5));
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetTransform = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Compute values
  const fileName = file ? file.name : 'Unknown';
  const format = isCompressed 
    ? (compressedData?.format?.split('/')[1] || 'webp').toUpperCase() 
    : (file?.type?.split('/')[1] || 'unknown').toUpperCase();
  
  const dimensions = isCompressed
    ? `${compressedData?.width || 0} x ${compressedData?.height || 0}`
    : file 
      ? 'Loading...' // will be updated when preview loads or pass as prop
      : '0 x 0';

  const [realDimensions, setRealDimensions] = useState('');

  useEffect(() => {
    if (!isCompressed && imageUrl) {
      const img = new Image();
      img.onload = () => {
        setRealDimensions(`${img.naturalWidth} x ${img.naturalHeight}`);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, isCompressed]);

  const displayDimensions = isCompressed ? dimensions : (realDimensions || dimensions);
  const fileSize = isCompressed ? compressedData?.compressedSize : file?.size;
  const displaySize = fileSize ? formatBytes(fileSize) : '0 Bytes';

  const creationDate = file?.lastModified 
    ? new Date(file.lastModified).toLocaleDateString() 
    : 'N/A';

  return (
    <div className={`preview-card glass-card ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <div className="preview-header">
        <h4 className="preview-title">{title}</h4>
        <div className="preview-actions">
          <button onClick={() => setZoom(z => Math.min(z + 0.25, 5))} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleResetTransform} title="Reset View">
            <RotateCcw size={16} />
          </button>
          <button onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {onReset && (
            <button onClick={onReset} className="reset-img-btn" title="Replace / Clear Image">
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      <div 
        className="preview-viewport"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {imageUrl ? (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title}
            className="preview-image"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            draggable={false}
          />
        ) : (
          <div className="empty-viewport">No Image Available</div>
        )}
      </div>

      <div className="preview-meta">
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">File:</span>
            <span className="meta-value" title={fileName}>{fileName}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Format:</span>
            <span className="meta-value">{format}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Size:</span>
            <span className="meta-value">{displaySize}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Resolution:</span>
            <span className="meta-value">{displayDimensions}</span>
          </div>
          {isCompressed ? (
            <div className="meta-item">
              <span className="meta-label"><Clock size={12} /> Time:</span>
              <span className="meta-value">{compressedData?.processingTime || 0} ms</span>
            </div>
          ) : (
            <div className="meta-item">
              <span className="meta-label"><Calendar size={12} /> Date:</span>
              <span className="meta-value">{creationDate}</span>
            </div>
          )}
        </div>
      </div>

      {isCompressed && onDownload && imageUrl && (
        <button className="btn-primary preview-download-btn" onClick={onDownload}>
          <Download size={16} /> Download Optimized
        </button>
      )}
    </div>
  );
}
