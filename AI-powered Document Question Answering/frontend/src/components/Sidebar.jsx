import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFileText, FiBookOpen, FiHelpCircle, FiChevronRight } from 'react-icons/fi';
import UploadSection from './UploadSection';

export default function Sidebar({ 
  files, 
  uploading, 
  uploadProgress, 
  onUpload, 
  onSummarize, 
  isSummarizing,
  onQuickQuestion 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(f => 
    f.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const suggestedQuestions = [
    "What are the main topics discussed?",
    "Provide a detailed summary of the document.",
    "List the key dates and deadlines mentioned.",
    "Are there any actions required?"
  ];

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col h-full transition-colors duration-200">
      {/* Upload Box Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <UploadSection 
          onUpload={onUpload} 
          uploading={uploading} 
          uploadProgress={uploadProgress} 
        />
      </div>

      {/* Uploaded Files Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Knowledge Source ({files.length})
            </h2>
            {files.length > 0 && (
              <button
                onClick={onSummarize}
                disabled={isSummarizing || uploading}
                className="text-xs flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-350 disabled:opacity-50"
              >
                <FiBookOpen size={12} />
                {isSummarizing ? 'Summarizing...' : 'Summarize All'}
              </button>
            )}
          </div>

          {files.length > 0 && (
            <div className="relative mb-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search uploaded files..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          )}
        </div>

        {/* Files list container */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {files.length === 0 ? (
            <div className="h-32 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
              <FiFileText size={20} className="mb-1 text-slate-300 dark:text-slate-650" />
              <span>No documents indexed. Upload files to populate the knowledge base.</span>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.filename}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-2.5 shadow-sm hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shrink-0">
                      <FiFileText size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={file.filename}>
                        {file.filename}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredFiles.length === 0 && (
                <p className="text-center text-xs text-slate-450 dark:text-slate-500 py-4">No matching files found.</p>
              )}
            </div>
          )}

          {/* Quick Questions list */}
          {files.length > 0 && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiHelpCircle size={14} /> Suggested Questions
              </h3>
              <div className="space-y-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onQuickQuestion(q)}
                    disabled={uploading}
                    className="w-full text-left p-2 text-xs rounded-lg border border-slate-100 dark:border-slate-850 hover:border-brand-200 dark:hover:border-brand-900 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center justify-between group transition-all"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <FiChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-brand-500 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
