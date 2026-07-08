import React from 'react';
import { X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-brand-dark/95 border border-glass-border rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-glow relative z-10 text-white overflow-hidden max-h-[85vh] overflow-y-auto"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              About Color Blindness
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 text-sm text-gray-300 leading-relaxed">
            <p>
              Color Vision Deficiency (CVD), commonly known as color blindness, is the inability to distinguish certain colors or perceive color differences under normal lighting conditions. It is typically inherited and affects approximately 1 in 12 men (8%) and 1 in 200 women (0.5%) globally.
            </p>

            <h3 className="font-bold text-white text-base mt-4">Understanding the Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                <h4 className="font-bold text-accent mb-1 text-xs">Red-Green Blindness (Most Common)</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Protanopia:</strong> Complete lack of red cone photoreceptors. Red colors appear dark, gray, or olive green.</li>
                  <li><strong>Deuteranopia:</strong> Complete lack of green cone photoreceptors. Green colors appear brownish-yellow or red.</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                <h4 className="font-bold text-accent mb-1 text-xs">Blue-Yellow & Total Blindness</h4>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Tritanopia:</strong> Complete lack of blue cone photoreceptors. Blue and yellow spectrums are confused.</li>
                  <li><strong>Achromatopsia:</strong> Extremely rare condition (1 in 30,000) where no cones function, seeing only in grayscale.</li>
                </ul>
              </div>
            </div>

            <h3 className="font-bold text-white text-base mt-4">How This Simulator Works</h3>
            <p>
              This simulator reads the pixels of your image and applies standard color transformation matrices. By multiplying each pixel's Red, Green, and Blue values by the respective matrix, it accurately recreates the deficiency models in real-time. All processing runs completely inside your browser. No files are uploaded to any servers.
            </p>

            <div className="flex items-start gap-2.5 bg-primary/10 border border-primary/20 p-4 rounded-xl mt-6">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300">
                Note: Color blindness simulations are approximations. Actual individual perception can vary depending on severity (anomaly vs. anopia) and environmental lighting.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
