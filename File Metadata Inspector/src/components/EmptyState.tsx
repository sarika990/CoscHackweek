import { motion } from "framer-motion";
import { Upload, FileImage, FileText, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onUploadClick?: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8 py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background orb */}
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 rounded-full bg-brand-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-surface-800 border border-surface-700 shadow-2xl">
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Upload className="w-10 h-10 text-brand-400" />
          </motion.div>
        </div>

        {/* Floating icons */}
        <motion.div
          className="absolute -top-3 -right-3 flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileImage className="w-4 h-4 text-emerald-400" />
        </motion.div>

        <motion.div
          className="absolute -bottom-3 -left-3 flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <FileText className="w-4 h-4 text-amber-400" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">
            File Metadata Inspector
          </span>
          <Sparkles className="w-4 h-4 text-brand-400" />
        </div>

        <h2 className="text-2xl font-bold text-surface-100 mb-3">
          No files uploaded yet
        </h2>

        <p className="text-surface-400 text-sm max-w-xs leading-relaxed mb-8">
          Upload images or PDF files to instantly inspect EXIF data, GPS
          coordinates, camera settings, document metadata, and more.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["JPG", "PNG", "GIF", "WEBP", "PDF"].map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-800 border border-surface-700 text-surface-300"
            >
              {ext}
            </span>
          ))}
        </div>

        {onUploadClick && (
          <motion.button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-900/50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
