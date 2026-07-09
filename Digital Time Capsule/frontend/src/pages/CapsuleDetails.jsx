import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Countdown from '../components/Countdown';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  Calendar,
  Image as ImageIcon,
  Film,
  FileText,
  Share2,
  Star,
  Printer,
  ChevronLeft,
  User,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const CapsuleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/capsules/${id}`);
      setCapsule(data);

      // Trigger confetti if it is just unlocked
      if (data && !data.locked) {
        triggerConfetti();
      }
    } catch (error) {
      toast.error('Failed to load capsule details. It may be private.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#6366f1', '#ec4899', '#f59e0b'],
    });
  };

  const handleUnlockTrigger = () => {
    // Re-fetch details when countdown reaches zero
    fetchDetails();
  };

  const handleFavoriteToggle = async () => {
    try {
      const { data } = await API.put(`/capsules/${id}/favorite`);
      toast.success(data.message);
      setCapsule((prev) => ({
        ...prev,
        isFavorite: data.isFavorite,
      }));
    } catch (error) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/capsule/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard! Share it with friends.');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!capsule) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const isLocked = capsule.locked;

  const formattedUnlockDate = new Date(capsule.unlockDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:p-0 print:max-w-full">
        {/* Back Button */}
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <div className="flex items-center space-x-2">
            {/* Share link (unlocked or public only) */}
            {(!isLocked || capsule.visibility === 'public') && (
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-all"
                title="Share Capsule Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {/* Favorite (authenticated owner only) */}
            {capsule.createdBy && (
              <button
                onClick={handleFavoriteToggle}
                className={`p-2.5 rounded-xl border transition-all ${
                  capsule.isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 text-amber-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-400'
                }`}
                title="Favorite Capsule"
              >
                <Star className={`w-4 h-4 ${capsule.isFavorite ? 'fill-amber-500' : ''}`} />
              </button>
            )}

            {/* Print / Save PDF (unlocked only) */}
            {!isLocked && (
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1.5 font-semibold text-xs"
                title="Download PDF / Print"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Print-Only Header Logo */}
        <div className="hidden print:flex items-center justify-between pb-4 border-b mb-6 border-slate-300">
          <span className="text-xl font-bold">ChronosCapsule Memory Preservation</span>
          <span className="text-sm text-slate-500">Unsealed on: {new Date().toLocaleDateString()}</span>
        </div>

        {isLocked ? (
          /* LOCKED STATE VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/35 rounded-full flex items-center justify-center text-rose-500 mx-auto animate-pulse">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Memory Capsule Encrypted
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                This memory is safely sealed and will unlock on the specified date. All sensitive contents and downloads are disabled.
              </p>
            </div>

            {/* Countdown widget */}
            <div className="max-w-sm mx-auto p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                Remaining Time
              </span>
              <Countdown unlockDate={capsule.unlockDate} onUnlock={handleUnlockTrigger} />
            </div>

            <div className="text-slate-400 dark:text-slate-500 text-sm font-semibold flex items-center justify-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Unlocks: {formattedUnlockDate}</span>
            </div>

            {/* Blurred Mock Content Card to represent sealed state */}
            <div className="relative border border-slate-150 dark:border-slate-800 rounded-3xl p-6 text-left pointer-events-none select-none overflow-hidden bg-slate-50/50 dark:bg-slate-950/30">
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Locked Content</span>
              </div>
              <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2.5" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-2.5" />
              <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </motion.div>
        ) : (
          /* UNLOCKED STATE VIEW */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 print:space-y-4"
          >
            {/* Header info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold flex items-center gap-1 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked Memory</span>
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200/50 dark:border-slate-700/50 rounded-full text-xs font-semibold">
                    {capsule.category}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white print:text-2xl">
                  {capsule.title}
                </h1>
                <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Unlocked on {formattedUnlockDate}</span>
                </p>
              </div>

              {capsule.createdBy && (
                <div className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                    {capsule.createdBy.profileImage ? (
                      <img
                        src={`${backendUrl}/${capsule.createdBy.profileImage}`}
                        alt={capsule.createdBy.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'; }}
                      />
                    ) : (
                      capsule.createdBy.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left pr-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Created By</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{capsule.createdBy.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Tags */}
            {capsule.description && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{capsule.description}</p>
                
                {/* Tags */}
                {capsule.tags && capsule.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    {capsule.tags.map((t, idx) => (
                      <span key={idx} className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-lg border border-slate-150 dark:border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message Body */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span>The Sealed Message</span>
              </h3>
              <p className="text-slate-700 dark:text-slate-250 text-base leading-relaxed whitespace-pre-line font-serif italic">
                "{capsule.message}"
              </p>
            </div>

            {/* Attachments Section */}
            {(capsule.images?.length > 0 || capsule.video || capsule.pdf) && (
              <div className="space-y-6 print:hidden">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Attachments & Media</h3>

                {/* Images Grid */}
                {capsule.images && capsule.images.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>Photos ({capsule.images.length})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {capsule.images.map((img, i) => (
                        <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm aspect-video">
                          <img
                            src={`${backendUrl}/${img}`}
                            alt="attachment"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          />
                          <a
                            href={`${backendUrl}/${img}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 px-3 py-1.5 bg-slate-950/80 text-white text-xs font-semibold rounded-lg hover:bg-slate-950 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Attachment */}
                {capsule.video && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Film className="w-4 h-4" />
                      <span>Video Recording</span>
                    </h4>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-950 max-w-2xl mx-auto">
                      <video controls className="w-full object-contain max-h-[400px]">
                        <source src={`${backendUrl}/${capsule.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* PDF Document Attachment */}
                {capsule.pdf && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100 dark:border-rose-900/30">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">PDF Document Attached</h4>
                        <p className="text-xs text-slate-400">Locked document is ready to download.</p>
                      </div>
                    </div>
                    <a
                      href={`${backendUrl}/${capsule.pdf}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CapsuleDetails;
