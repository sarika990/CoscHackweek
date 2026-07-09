import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Birthday', 'Goals', 'Family', 'Travel', 'Education', 'Career', 'Personal'];
const statuses = ['All', 'Locked', 'Unlocked'];
const visibilities = ['All', 'Private', 'Public'];
const sortOptions = ['Newest', 'Oldest', 'Unlock Date', 'Title A-Z'];

const FilterBar = ({
  category,
  setCategory,
  status,
  setStatus,
  visibility,
  setVisibility,
  sort,
  setSort,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm w-full space-y-5">
      <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-base pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <SlidersHorizontal className="w-5 h-5 text-primary-500" />
        <span>Filters & Sorting</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lock Status Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lock Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>
                {stat}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility Filter */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {visibilities.map((vis) => (
              <option key={vis} value={vis}>
                {vis}
              </option>
            ))}
          </select>
        </div>

        {/* Sort option */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
