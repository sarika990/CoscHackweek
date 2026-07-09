import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Calendar, Edit3, Trash2, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

const categoryColors = {
  Birthday: 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30',
  Goals: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  Family: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
  Travel: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  Education: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
  Career: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
  Personal: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/30 dark:text-slate-400 dark:border-slate-800/50',
};

const CapsuleCard = ({ capsule, onUpdateStatus, onDelete, onFavoriteToggle }) => {
  const isLocked = new Date(capsule.unlockDate) > new Date();

  const formattedDate = new Date(capsule.unlockDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between min-h-[350px]"
    >
      <div>
        {/* Header Tags / Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[capsule.category] || categoryColors.Personal}`}>
            {capsule.category}
          </span>
          <div className="flex items-center space-x-2">
            {/* Visibility Badge */}
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {capsule.visibility}
            </span>
            {/* Favorite Button */}
            <button
              onClick={() => onFavoriteToggle(capsule._id)}
              className={`p-1.5 rounded-lg border transition-colors ${capsule.isFavorite ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 text-amber-500' : 'border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 text-slate-400'}`}
            >
              <Star className={`w-4 h-4 ${capsule.isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
          {capsule.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
          {capsule.description || 'No description provided.'}
        </p>
      </div>

      {/* Lock Details / Countdown */}
      <div className="my-4">
        {isLocked ? (
          <div className="space-y-3">
            <div className="flex items-center text-rose-500 text-sm font-semibold gap-1.5">
              <Lock className="w-4 h-4 animate-bounce" />
              <span>Unlocks in:</span>
            </div>
            <Countdown unlockDate={capsule.unlockDate} onUnlock={() => onUpdateStatus(capsule._id)} />
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <Unlock className="w-4 h-4" />
            <span>Memory Unlocked!</span>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-slate-400 gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isLocked ? 'Unlocks:' : 'Unlocked:'} {formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Edit Option - Only show before unlock */}
            {isLocked && (
              <Link
                to={`/edit/${capsule._id}`}
                className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Edit Capsule"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
            )}

            {/* Delete Option */}
            <button
              onClick={() => onDelete(capsule._id)}
              className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Delete Capsule"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* View Details Option */}
            <Link
              to={`/capsule/${capsule._id}`}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CapsuleCard;
