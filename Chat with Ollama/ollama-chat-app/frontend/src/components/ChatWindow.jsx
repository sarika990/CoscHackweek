import React, { useRef, useEffect } from 'react';
import { FiTrash2, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import EmptyState from './EmptyState.jsx';

const ChatWindow = ({ messages, isLoading, error, onSendMessage, onClearChat, onRetry, disabled }) => {
  const bottomRef = useRef(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070d0a] relative overflow-hidden">
      {/* Chat Window Header */}
      <div className="h-14 border-b border-glass-border/60 bg-slate-950/40 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></span>
          <span className="text-sm font-semibold text-slate-200">Active Session</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs border border-transparent hover:border-rose-500/20 transition-all duration-200 active:scale-95"
            title="Clear Chat"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            Clear Conversation
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <EmptyState onSelectSuggestion={onSendMessage} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && <TypingIndicator />}

            {/* Error Message Block */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in max-w-2xl">
                <div className="flex items-start gap-2.5">
                  <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Request Failed</h4>
                    <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
                  </div>
                </div>
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium border border-rose-500/30 transition-all active:scale-95 self-end sm:self-center shrink-0"
                >
                  <FiRefreshCw className="w-3 h-3" />
                  Retry request
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
