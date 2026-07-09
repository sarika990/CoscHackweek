import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon = HelpCircle,
  title = 'No capsules found',
  description = 'Start by creating your very first time capsule to secure your future memories.',
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/30 dark:bg-slate-900/10 backdrop-blur-sm max-w-lg mx-auto"
    >
      <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-500/20 hover:shadow-lg transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
