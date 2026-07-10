import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Download, SlidersHorizontal, ArrowUpDown, Info, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getImages,
  getResults,
  getCsvReportUrl,
  getJsonReportUrl,
  getPdfReportUrl
} from '../services/api';
import ComparisonCard from '../components/ComparisonCard';
import CompareModal from '../components/CompareModal';
import { CardSkeleton } from '../components/Skeleton';

const Comparisons = () => {
  const [images, setImages] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState('pHash');
  const [sortBy, setSortBy] = useState('highest'); // highest, lowest, filename
  const [filterType, setFilterType] = useState('all'); // all, duplicate, similar, unique

  const [selectedComparison, setSelectedComparison] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [imagesRes, resultsRes] = await Promise.all([
        getImages(),
        getResults(algorithm)
      ]);
      setImages(imagesRes.data);
      setComparisons(resultsRes.data);
    } catch (err) {
      toast.error("Failed to load comparison results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [algorithm]);

  // Apply sorting and filtering
  const processedComparisons = useMemo(() => {
    let result = [...comparisons];

    // Filter
    if (filterType === 'duplicate') {
      result = result.filter(c => c.status === 'Duplicate');
    } else if (filterType === 'similar') {
      result = result.filter(c => c.status === 'Similar');
    } else if (filterType === 'unique') {
      result = result.filter(c => c.status === 'Unique');
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'lowest') {
        return a.similarity - b.similarity;
      } else if (sortBy === 'filename') {
        return a.image_a_name.localeCompare(b.image_a_name);
      } else {
        // highest (default)
        return b.similarity - a.similarity;
      }
    });

    return result;
  }, [comparisons, filterType, sortBy]);

  const handleOpenModal = (comp) => {
    setSelectedComparison(comp);
    setIsModalOpen(true);
  };

  const handleExport = (type) => {
    if (comparisons.length === 0) {
      toast.error("No comparisons available to export.");
      return;
    }
    let url = '';
    if (type === 'csv') url = getCsvReportUrl(algorithm);
    else if (type === 'json') url = getJsonReportUrl(algorithm);
    else if (type === 'pdf') url = getPdfReportUrl(algorithm);

    if (url) {
      window.open(url, '_blank');
      toast.success(`Exporting ${type.toUpperCase()} report...`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and algorithm selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Batch Comparison
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare every uploaded image against every other image automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Algorithm selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Algorithm:</span>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 shadow-sm"
            >
              <option value="pHash">Perceptual Hash (pHash) ⭐</option>
              <option value="aHash">Average Hash (aHash)</option>
              <option value="dHash">Difference Hash (dHash)</option>
              <option value="wHash">Wavelet Hash (wHash)</option>
            </select>
          </div>

          {/* Export options */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-slate-200/50 dark:border-dark-border/50 bg-white/30 dark:bg-dark-card backdrop-blur-md justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            Filter Level:
          </span>
          <div className="flex gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
            {['all', 'duplicate', 'similar', 'unique'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          >
            <option value="highest">Highest Similarity</option>
            <option value="lowest">Lowest Similarity</option>
            <option value="filename">Filename</option>
          </select>
        </div>
      </div>

      {/* Comparisons results view */}
      {loading ? (
        <CardSkeleton />
      ) : processedComparisons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedComparisons.map((comp) => (
            <ComparisonCard
              key={comp.id}
              comparison={comp}
              images={images}
              onClick={() => handleOpenModal(comp)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {images.length < 2
              ? "Upload at least 2 images on the Dashboard to see comparisons."
              : "No matches found under this filter."}
          </p>
        </div>
      )}

      {/* Compare Modal */}
      <CompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        comparison={selectedComparison}
        images={images}
      />
    </div>
  );
};

export default Comparisons;
