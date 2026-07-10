import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { getImageUrl } from '../services/api';

const CompareModal = ({ isOpen, onClose, comparison, images }) => {
  if (!isOpen || !comparison) return null;

  const imageA = images.find(img => img.id === comparison.image_a_id);
  const imageB = images.find(img => img.id === comparison.image_b_id);

  if (!imageA || !imageB) return null;

  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 1));
  const toggleFullscreen = () => setFullscreen(f => !f);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-6xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/90 dark:bg-dark-card border border-white/20 dark:border-dark-border shadow-2xl flex flex-col z-10 transition-all duration-300 ${
            fullscreen ? 'h-[96vh]' : 'max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-dark-border/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Comparison Detail
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparing hash values via {comparison.algorithm}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-500 disabled:opacity-50 text-slate-700 dark:text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-500 disabled:opacity-50 text-slate-700 dark:text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-500 text-slate-700 dark:text-slate-300 transition-colors"
                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-700 dark:text-slate-300 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Preview */}
          <div className="flex-1 overflow-auto p-6 bg-slate-900/10 dark:bg-slate-950/20 flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Image A */}
            <div className="flex-1 flex flex-col items-center h-full justify-center">
              <div className="overflow-hidden border border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-950/40 relative max-h-[50vh] md:max-h-full">
                <img
                  src={getImageUrl(imageA.filepath)}
                  alt={imageA.filename}
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full h-auto object-contain max-h-[50vh] md:max-h-[60vh] transition-transform duration-200"
                />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate max-w-[280px]">
                A: {imageA.filename}
              </p>
              <span className="text-[10px] text-slate-500">{imageA.resolution} | {imageA.formatted_size}</span>
            </div>

            {/* Similarity Circle Overlay */}
            <div className="flex flex-col items-center justify-center p-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl z-10">
              <span className="text-xl font-black text-indigo-600">{comparison.similarity}%</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Match</span>
            </div>

            {/* Image B */}
            <div className="flex-1 flex flex-col items-center h-full justify-center">
              <div className="overflow-hidden border border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-950/40 relative max-h-[50vh] md:max-h-full">
                <img
                  src={getImageUrl(imageB.filepath)}
                  alt={imageB.filename}
                  style={{ transform: `scale(${zoom})` }}
                  className="w-full h-auto object-contain max-h-[50vh] md:max-h-[60vh] transition-transform duration-200"
                />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate max-w-[280px]">
                B: {imageB.filename}
              </p>
              <span className="text-[10px] text-slate-500">{imageB.resolution} | {imageB.formatted_size}</span>
            </div>
          </div>

          {/* Details Bar */}
          <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-950/30 border-t border-slate-200/50 dark:border-dark-border/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs font-semibold text-slate-500">Match Level</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{comparison.match_level}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Hamming Distance</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{comparison.hamming_distance}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-semibold text-slate-500">Hash Comparison</p>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-0.5 flex flex-col items-center">
                <span>A: {imageA.hashes[comparison.algorithm]}</span>
                <span>B: {imageB.hashes[comparison.algorithm]}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompareModal;
