import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { Globe, Calendar, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = ['All', 'Birthday', 'Goals', 'Family', 'Travel', 'Education', 'Career', 'Personal'];

const PublicCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPublicCapsules = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const { data } = await API.get('/capsules/public', { params });
      setCapsules(data.capsules);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching public capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page on filter changes
  }, [search, category]);

  useEffect(() => {
    fetchPublicCapsules();
  }, [search, category, page]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-150 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <Globe className="w-3.5 h-3.5" />
            <span>Shared Stories & Legacies</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Public Memory Feed
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Browse through memories, warnings, letters, and wisdom shared publicly by users after they unlocked.
          </p>
        </div>

        {/* Filters and Search Console */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search public feed..." />

          {/* Category Chips scrollable */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  category === cat
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/10'
                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/55 dark:border-slate-700/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 h-[280px] animate-pulse space-y-4">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-16 w-full bg-slate-100 dark:bg-slate-850 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : capsules.length === 0 ? (
          <EmptyState
            title="Feed is empty"
            description="No public unlocked capsules match your search parameters. Be the first to share one!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map((capsule) => {
              const unlockDateStr = new Date(capsule.unlockDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  key={capsule._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[280px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {capsule.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Unsealed: {unlockDateStr}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">
                      {capsule.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3">
                      {capsule.description || capsule.message}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-6 flex items-center justify-between">
                    {/* User profile */}
                    {capsule.createdBy && (
                      <div className="flex items-center gap-2">
                        {capsule.createdBy.profileImage ? (
                          <img
                            src={`${backendUrl}/${capsule.createdBy.profileImage}`}
                            alt={capsule.createdBy.name}
                            className="w-7 h-7 rounded-full object-cover border border-primary-500"
                            onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'; }}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 font-bold text-xs">
                            {capsule.createdBy.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{capsule.createdBy.name}</span>
                      </div>
                    )}

                    <Link
                      to={`/capsule/${capsule._id}`}
                      className="px-4.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Memory</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-center space-x-3 pt-6">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, pages))}
              disabled={page === pages}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-40 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicCapsules;
