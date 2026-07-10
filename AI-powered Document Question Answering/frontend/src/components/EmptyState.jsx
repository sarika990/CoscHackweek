import React from 'react';
import { HiLightningBolt } from 'react-icons/hi';
import { FiUploadCloud, FiBookOpen } from 'react-icons/fi';

export default function EmptyState({ hasFiles }) {
  return (
    <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4 py-12 select-none">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-sm">
        <HiLightningBolt size={32} />
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        AI-Powered Document QA
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
        Upload PDF or TXT documents and ask questions in natural language.
        Answers are retrieved strictly from your uploaded files, ensuring zero hallucinations.
      </p>

      <div className="grid grid-cols-2 gap-4 mt-8 w-full">
        <div className={`p-4 rounded-xl border text-left ${
          !hasFiles 
            ? 'border-brand-200 bg-brand-50/20 dark:border-brand-900/40 dark:bg-brand-950/10' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-350">
            <FiUploadCloud className={!hasFiles ? 'text-brand-500' : 'text-slate-450'} size={18} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Step 1: Upload</h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-snug">
            {!hasFiles ? 'Drag and drop your PDF or TXT files onto the sidebar to index them.' : 'Files uploaded and indexed in FAISS vector store.'}
          </p>
        </div>

        <div className={`p-4 rounded-xl border text-left ${
          hasFiles 
            ? 'border-brand-200 bg-brand-50/20 dark:border-brand-900/40 dark:bg-brand-950/10' 
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-350">
            <FiBookOpen className={hasFiles ? 'text-brand-500' : 'text-slate-450'} size={18} />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Step 2: Ask Questions</h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-snug">
            {hasFiles ? 'Type your question in the input area and send it to the RAG pipeline.' : 'Upload a document first to unlock the question input.'}
          </p>
        </div>
      </div>
    </div>
  );
}
