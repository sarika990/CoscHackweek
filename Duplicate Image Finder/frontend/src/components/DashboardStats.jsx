import React from 'react';
import { motion } from 'framer-motion';
import { Image, Layers, Disc, Percent, AlertCircle, Compass } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const statItems = [
    {
      title: "Total Images",
      value: stats.total_images || 0,
      icon: <Image className="w-5 h-5 text-indigo-500" />,
      desc: "Uploaded files"
    },
    {
      title: "Duplicate Images",
      value: stats.duplicate_images || 0,
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      desc: "100% exact matches"
    },
    {
      title: "Similar Images",
      value: stats.similar_images || 0,
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      desc: ">= 70% similar match"
    },
    {
      title: "Unique Images",
      value: stats.unique_images || 0,
      icon: <Disc className="w-5 h-5 text-sky-500" />,
      desc: "No major similarity"
    },
    {
      title: "Avg Similarity",
      value: stats.avg_similarity !== undefined ? `${stats.avg_similarity}%` : "0%",
      icon: <Percent className="w-5 h-5 text-indigo-500" />,
      desc: "All pairs compared"
    },
    {
      title: "Highest Similarity",
      value: stats.highest_similarity !== undefined ? `${stats.highest_similarity}%` : "0%",
      icon: <Compass className="w-5 h-5 text-emerald-500" />,
      desc: "Max matching value"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {statItems.map((item, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="relative overflow-hidden backdrop-blur-md bg-white/40 dark:bg-dark-card border border-slate-200/50 dark:border-dark-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-300"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {item.icon}
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{item.value}</p>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{item.title}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStats;
