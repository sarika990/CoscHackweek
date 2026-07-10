import React, { useRef, useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function ChatBox({ messages, loading, onSendMessage, files }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      
      {/* Scrollable chat body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <EmptyState hasFiles={files.length > 0} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {loading && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-650 dark:text-brand-400 flex items-center justify-center shrink-0">
                  AI
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                  <Loader />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 focus-within:ring-1 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all duration-200">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={files.length === 0 ? "Upload documents first to start asking questions..." : "Ask a question about the uploaded documents..."}
            rows={1}
            disabled={files.length === 0}
            className="flex-1 max-h-32 min-h-[36px] bg-transparent resize-none border-none outline-none text-sm px-2 py-2 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none"
          />
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-1 select-none">
              {inputValue.length}/1000
            </span>
            <button
              type="submit"
              disabled={!inputValue.trim() || loading || files.length === 0}
              className="p-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 shadow-sm transition-all shrink-0"
            >
              <FiSend size={16} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 select-none">
          Enter to send, Shift + Enter for new line. Answers only based on indexed document chunks.
        </p>
      </div>

    </div>
  );
}
