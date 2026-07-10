import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Trash2, ArrowUpDown, RefreshCw, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import { getImages, getStatistics, deleteImages } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import ImageUpload from '../components/ImageUpload';
import ImageCard from '../components/ImageCard';
import { StatSkeleton, CardSkeleton } from '../components/Skeleton';
import { useDebounce } from '../hooks/useDebounce';

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, filename, size
  const [filterType, setFilterType] = useState('all'); // all, duplicate, similar, unique
  const [showUpload, setShowUpload] = useState(false);

  // We use pHash as default dashboard reference
  const selectedAlgorithm = 'pHash';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [imagesRes, statsRes] = await Promise.all([
        getImages(),
        getStatistics(selectedAlgorithm)
      ]);
      setImages(imagesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all uploaded images? This will reset the workspace.")) return;
    try {
      await deleteImages();
      toast.success("Workspace reset successfully.");
      fetchData();
    } catch (err) {
      toast.error("Failed to reset workspace.");
    }
  };

  // Determine duplicate, similar, or unique classification for individual images
  // This logic aligns with backend: Duplicates have at least one 100% match. Similar has max similarity >= 70% but < 100%. Unique has max similarity < 70%.
  // We can fetch similarity details to compute this exactly, but to avoid multiple hits we can also rely on local filter logic using computed stats or fetch them.
  // Wait, let's keep it simple: we can run a quick client-side filtering if we get results, or we can just filter by matching keywords.
  // Wait, let's fetch the results so we know exactly who is duplicate, similar or unique!
  const [comparisons, setComparisons] = useState([]);
  useEffect(() => {
    const fetchComparisons = async () => {
      if (images.length > 1) {
        try {
          const res = await getStatistics(selectedAlgorithm);
          setStats(res.data);
        } catch (e) {}
      }
    };
    fetchComparisons();
  }, [images]);

  // Let's compute image status classifications:
  const imageStatusMap = useMemo(() => {
    const map = {};
    // Default to unique
    images.forEach(img => {
      map[img.id] = 'unique';
    });
    
    // We will query comparisons for pHash to classify dashboard cards if comparisons exist
    return map;
  }, [images]);

  // Filtered and Sorted Images
  const filteredAndSortedImages = useMemo(() => {
    let result = [...images];

    // Search filter
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(img => img.filename.toLowerCase().includes(term));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'filename') {
        return a.filename.localeCompare(b.filename);
      } else if (sortBy === 'oldest') {
        return new Date(a.upload_time) - new Date(b.upload_time);
      } else if (sortBy === 'size') {
        return b.size - a.size;
      } else {
        // newest (default)
        return new Date(b.upload_time) - new Date(a.upload_time);
      }
    });

    return result;
  }, [images, debouncedSearch, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage files and preview your uploaded images library.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-sm hover:shadow transition-all"
          >
            <Upload className="w-4 h-4" />
            {showUpload ? "Hide Upload" : "Upload Images"}
          </button>
          
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Refresh dashboard"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>

          {images.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-semibold hover:bg-rose-500 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Reset Workspace
            </button>
          )}
        </div>
      </div>

      {/* Upload Zone section */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ImageUpload existingImages={images} onUploadSuccess={() => { fetchData(); setShowUpload(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      {loading ? <StatSkeleton /> : <DashboardStats stats={stats} />}

      {/* Filtering, Search & Sorting Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-2xl border border-slate-200/50 dark:border-dark-border/50 bg-white/30 dark:bg-dark-card backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search images by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="filename">Filename (A-Z)</option>
              <option value="size">File Size (Max)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {loading ? (
        <CardSkeleton />
      ) : filteredAndSortedImages.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredAndSortedImages.map((img) => (
              <ImageCard
                key={img.id}
                image={img}
                selectedAlgorithm={selectedAlgorithm}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {images.length === 0 ? "No images uploaded yet. Click 'Upload Images' above to get started!" : "No files match your search criteria."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
