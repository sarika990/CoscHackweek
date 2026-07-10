import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function UploadSection({ onUpload, uploading, uploadProgress }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndUpload = async (files) => {
    setLocalError('');
    const validFiles = [];
    const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'txt') {
        setLocalError('Invalid file type. Only PDF and TXT documents are allowed.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setLocalError(`File "${file.name}" exceeds the 20MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      try {
        await onUpload(validFiles);
      } catch (err) {
        // Parent component will manage the error, or show standard error
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    if (!uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />
      
      <motion.div
        whileHover={!uploading ? { scale: 1.01 } : {}}
        whileTap={!uploading ? { scale: 0.99 } : {}}
        onClick={triggerFileInput}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center text-center justify-center transition-all ${
          isDragActive 
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20' 
            : 'border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-900 bg-slate-50 dark:bg-slate-900/50'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <div className={`p-3 rounded-xl mb-3 ${
          isDragActive 
            ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' 
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          <FiUploadCloud size={24} />
        </div>
        
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {uploading ? 'Processing Knowledge Base...' : 'Upload Sources'}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
          Drag & Drop or Click to browse
        </p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
          PDF or TXT up to 20MB
        </p>
      </motion.div>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-3">
          <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
            <span>Reading files...</span>
            <span className="font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-brand-600 h-full rounded-full" 
            />
          </div>
        </div>
      )}

      {/* Error messages */}
      {localError && (
        <div className="mt-2.5 p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/45 rounded-lg flex items-center gap-2 text-[10px]">
          <FiAlertCircle className="shrink-0" size={14} />
          <span className="leading-snug">{localError}</span>
        </div>
      )}
    </div>
  );
}
