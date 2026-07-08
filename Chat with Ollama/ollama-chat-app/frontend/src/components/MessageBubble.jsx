import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiCheck, FiUser, FiCpu } from 'react-icons/fi';
import { copyToClipboard, formatTimestamp } from '../utils/helpers.js';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Custom components for ReactMarkdown to render elegant code blocks
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      if (!inline && match) {
        return (
          <div className="relative my-4 rounded-xl border border-glass-border overflow-hidden bg-slate-950/70 font-mono text-sm">
            <div className="flex items-center justify-between px-4 py-2 border-b border-glass-border/40 bg-slate-900/60 text-slate-400 text-xs">
              <span>{match[1]}</span>
              <button
                onClick={() => copyToClipboard(codeString)}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                <FiCopy className="w-3 h-3" />
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300 font-mono">
              <code>{codeString}</code>
            </pre>
          </div>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 font-mono text-xs border border-emerald-500/10" {...props}>
          {children}
        </code>
      );
    },
    // Customize paragraph margin
    p({ children }) {
      return <p className="mb-2 last:mb-0 leading-relaxed text-sm sm:text-[14.5px]">{children}</p>;
    },
    // Customize lists
    ul({ children }) {
      return <ul className="list-disc pl-5 mb-2 space-y-1 text-sm">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 mb-2 space-y-1 text-sm">{children}</ol>;
    },
  };

  return (
    <div className={`flex gap-4 w-full group animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
          <FiCpu className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble card */}
        <div
          className={`px-4 py-3 rounded-2xl border transition-all duration-300 ${
            isUser
              ? 'bg-emerald-600/10 border-emerald-500/25 text-emerald-50 shadow-inner'
              : 'glass-card text-slate-100'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-[14.5px]">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none text-slate-200">
              <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Bubble Meta (Timestamp, Copy Button) */}
        <div className="flex items-center gap-2 mt-1.5 px-1.5 text-[10px] text-slate-500">
          <span>{formatTimestamp(message.timestamp)}</span>
          <span>•</span>
          <button
            onClick={handleCopy}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            title="Copy entire message"
          >
            {copied ? (
              <>
                <FiCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-emerald-600 border border-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/35 shrink-0">
          <FiUser className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
