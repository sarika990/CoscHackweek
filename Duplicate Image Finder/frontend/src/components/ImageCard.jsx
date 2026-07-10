import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, Crop, Calendar, Hash } from 'lucide-react';
import { getImageUrl } from '../services/api';

const ImageCard = ({ image, selectedAlgorithm }) => {
  const currentHash = image.hashes[selectedAlgorithm] || 'N/A';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="overflow-hidden backdrop-blur-md bg-white/40 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-dark-border/50">
        <img
          src={getImageUrl(image.filepath)}
          alt={image.filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mb-2"
            title={image.filename}
          >
            {image.filename}
          </h3>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>{image.formatted_size}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-slate-400" />
              <span>{image.resolution}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{image.upload_time}</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-bold tracking-wider uppercase">{selectedAlgorithm} Hash</span>
          </div>
          <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all">
            {currentHash}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
