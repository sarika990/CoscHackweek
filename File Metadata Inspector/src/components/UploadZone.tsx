import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, FolderOpen, Info } from "lucide-react";
import { cn } from "../lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  compact?: boolean;
}

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export function UploadZone({ onFilesSelected, compact = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFilesSelected(accepted);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true,
    maxSize: 50 * 1024 * 1024,
    noClick: true,
  });

  const handleBrowseClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = "";
  };

  if (compact) {
    return (
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer p-4",
          isDragActive && !isDragReject
            ? "border-brand-500 bg-brand-500/10"
            : isDragReject
            ? "border-red-500 bg-red-500/10"
            : "border-surface-600 hover:border-brand-500/60 hover:bg-surface-800/40"
        )}
        onClick={handleBrowseClick}
      >
        <input {...getInputProps()} />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
          onChange={handleInputChange}
        />
        <div className="flex items-center gap-3">
          <CloudUpload className={cn("w-5 h-5", isDragActive ? "text-brand-400" : "text-surface-500")} />
          <div>
            <p className="text-sm font-medium text-surface-300">
              {isDragActive ? "Drop to upload" : "Drop files or click to browse"}
            </p>
            <p className="text-xs text-surface-500 mt-0.5">JPG, PNG, GIF, WEBP, PDF · Max 50 MB</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer group",
          isDragActive && !isDragReject
            ? "border-brand-500 bg-brand-500/10 scale-[1.01]"
            : isDragReject
            ? "border-red-500 bg-red-500/10"
            : "border-surface-600/60 hover:border-brand-500/60 bg-surface-800/30 hover:bg-surface-800/50"
        )}
      >
        <input {...getInputProps()} />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
          onChange={handleInputChange}
        />

        <div className="relative flex flex-col items-center justify-center px-8 py-12 text-center">
          {/* Animated gradient background */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-brand-400/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* Upload icon */}
          <motion.div
            className={cn(
              "relative flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-colors duration-300",
              isDragActive ? "bg-brand-500/20 border border-brand-500/40" : "bg-surface-800 border border-surface-700 group-hover:border-brand-500/40 group-hover:bg-surface-700/60"
            )}
            animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, repeat: isDragActive ? Infinity : 0 }}
          >
            <CloudUpload
              className={cn(
                "w-9 h-9 transition-colors duration-300",
                isDragActive ? "text-brand-400" : "text-surface-500 group-hover:text-brand-400"
              )}
            />
          </motion.div>

          <h3 className="text-xl font-bold text-surface-100 mb-2">
            {isDragActive && !isDragReject
              ? "Release to upload"
              : isDragReject
              ? "File type not supported"
              : "Drag & Drop your files here"}
          </h3>

          <p className="text-surface-400 text-sm mb-6 max-w-xs leading-relaxed">
            {isDragReject
              ? "Only JPG, PNG, GIF, WEBP and PDF files are supported"
              : "Inspect EXIF data, camera settings, GPS coordinates, PDF metadata and more"}
          </p>

          <motion.button
            type="button"
            onClick={handleBrowseClick}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-900/40 relative z-10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FolderOpen className="w-4 h-4" />
            Browse Files
          </motion.button>

          <div className="flex items-center gap-2 mt-5 text-xs text-surface-500">
            <Info className="w-3.5 h-3.5" />
            <span>Supported: JPG · PNG · GIF · WEBP · PDF · Max 50 MB per file</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
