import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Activity, Percent } from 'lucide-react';
import { getMatchBadgeColor } from '../utils/helpers';
import { getImageUrl } from '../services/api';

const ComparisonCard = ({ comparison, images, onClick }) => {
  const imageA = images.find(img => img.id === comparison.image_a_id);
  const imageB = images.find(img => img.id === comparison.image_b_id);

  if (!imageA || !imageB) return null;

  const isDuplicate = comparison.similarity >= 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`cursor-pointer overflow-hidden backdrop-blur-md bg-white/40 dark:bg-dark-card border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-1 ${
        isDuplicate 
          ? 'border-emerald-500/50 dark:border-emerald-500/30' 
          : 'border-slate-200/50 dark:border-dark-border/50'
      }`}
    >
      <div className="flex items-center justify-between p-3 bg-slate-100/50 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-dark-border/50">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getMatchBadgeColor(comparison.match_level)}`}>
          {comparison.match_level}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          Method: {comparison.algorithm}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-0.5 aspect-[21/9] bg-slate-200 dark:bg-slate-900 overflow-hidden relative">
        <div className="relative h-full w-full">
          <img
            src={getImageUrl(imageA.filepath)}
            alt={imageA.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 left-1 max-w-[90%] bg-slate-900/70 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded truncate">
            {imageA.filename}
          </div>
        </div>
        <div className="relative h-full w-full border-l border-white/20 dark:border-slate-900/50">
          <img
            src={getImageUrl(imageB.filepath)}
            alt={imageB.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 right-1 max-w-[90%] bg-slate-900/70 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded truncate">
            {imageB.filename}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-950">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-indigo-500" />
              Similarity
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {comparison.similarity}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isDuplicate 
                  ? 'bg-emerald-500' 
                  : comparison.similarity >= 85 
                  ? 'bg-teal-500' 
                  : comparison.similarity >= 60 
                  ? 'bg-amber-500' 
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${comparison.similarity}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            Hamming Distance: <b>{comparison.hamming_distance}</b>
          </span>
          <span className="text-indigo-500 font-semibold group-hover:underline flex items-center gap-0.5">
            Compare
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonCard;
