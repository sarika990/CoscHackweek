import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiBookOpen, FiFileText } from 'react-icons/fi';

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 select-none ${
          message.isSummary 
            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' 
            : 'bg-brand-50 dark:bg-brand-900/40 text-brand-650 dark:text-brand-400'
        }`}>
          AI
        </div>
      )}

      <div className={`max-w-2xl flex flex-col group ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble core */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm border ${
          isUser 
            ? 'bg-brand-600 border-brand-600 text-white rounded-tr-none' 
            : message.isError 
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/45 text-rose-700 dark:text-rose-400 rounded-tl-none'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
        }`}>
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed break-words">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            )}
          </div>
        </div>

        {/* Footer info: sources, copy, timestamp */}
        <div className="flex flex-wrap items-center gap-3 mt-1.5 px-1 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{message.timestamp}</span>
          
          {!isUser && !message.isError && (
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1 hover:text-brand-500 transition-colors"
            >
              {copied ? (
                <>
                  <FiCheck className="text-green-500" size={10} />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <FiCopy size={10} />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {/* Sources badges */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center mt-1">
              <span className="flex items-center gap-0.5 text-slate-400"><FiBookOpen size={10} /> Sources:</span>
              {message.sources.map((src, idx) => (
                <span 
                  key={idx}
                  title={`Chunk index: ${src.chunk_index} ${src.score ? `| Sim Score: ${src.score.toFixed(2)}` : ''}`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] text-slate-650 dark:text-slate-450 select-none font-medium"
                >
                  <FiFileText size={8} />
                  <span className="max-w-[120px] truncate">{src.source}</span>
                  <span className="opacity-60">#{src.chunk_index}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 flex items-center justify-center font-bold text-xs shrink-0 select-none">
          U
        </div>
      )}
    </motion.div>
  );
}
