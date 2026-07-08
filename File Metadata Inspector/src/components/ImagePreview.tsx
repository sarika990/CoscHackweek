import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Download,
  Move,
  RotateCcw,
} from "lucide-react";
import type { UploadedFile } from "../types/metadata";
import { cn } from "../lib/utils";

interface ImagePreviewProps {
  file: UploadedFile;
}

export function ImagePreview({ file }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  const metadata = file.metadata?.type === "image" ? file.metadata : null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 300));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 25));
  const handleReset = () => { setZoom(100); setPosition({ x: 0, y: 0 }); };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 100) return;
    setIsDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: position.x, py: position.y };
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setPosition({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = file.fileInfo.objectUrl;
    a.download = file.fileInfo.name;
    a.click();
  };

  return (
    <>
      <motion.div
        className="rounded-2xl bg-surface-800/50 border border-surface-700/50 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Preview</span>
            {metadata && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-xs font-mono text-brand-300">
                {metadata.width} × {metadata.height}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={handleZoomOut} disabled={zoom <= 25} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 disabled:opacity-30 transition-colors" title="Zoom out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-mono text-surface-400 w-10 text-center">{zoom}%</span>

            <button onClick={handleZoomIn} disabled={zoom >= 300} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 disabled:opacity-30 transition-colors" title="Zoom in">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-surface-700 mx-1" />

            <button onClick={handleReset} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors" title="Reset view">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleDownload} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors" title="Download">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setFullscreen(true)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors" title="Fullscreen">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Image container */}
        <div
          className={cn(
            "relative overflow-hidden bg-surface-900/50 h-64 lg:h-80",
            zoom > 100 && !isDragging ? "cursor-grab" : "",
            isDragging ? "cursor-grabbing" : ""
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={file.fileInfo.objectUrl}
            alt={file.fileInfo.name}
            className="absolute inset-0 w-full h-full object-contain select-none transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />

          {zoom > 100 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white">
              <Move className="w-3 h-3" />
              Drag to pan
            </div>
          )}
        </div>
      </motion.div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.img
              src={file.fileInfo.objectUrl}
              alt={file.fileInfo.name}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {metadata && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-sm text-white font-mono">
                {metadata.width} × {metadata.height} · {metadata.aspectRatio}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
