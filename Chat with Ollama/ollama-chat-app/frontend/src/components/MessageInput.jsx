import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({ onSendMessage, isLoading, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize the textarea to fit content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading && !disabled) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    // If user presses Enter without Shift, or Ctrl+Enter
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Let standard new line insert
        return;
      }
      e.preventDefault(); // Prevent default new line insertion
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-glass-border glass-panel shrink-0">
      <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-emerald-950/20 rounded-2xl border border-glass-border p-2 focus-within:border-emerald-500/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Connect to Ollama to start chatting..." : "Type a message... (Enter to send, Shift+Enter for new line)"}
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 max-h-[180px] bg-transparent resize-none py-2 px-3 text-slate-100 text-sm focus:outline-none placeholder-slate-500"
        />

        <div className="flex flex-col items-end gap-1.5 pr-1">
          {/* Character Counter */}
          <span className="text-[10px] text-slate-500 font-mono select-none px-1">
            {text.length} chars
          </span>

          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading || disabled}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
              text.trim() && !isLoading && !disabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 hover:bg-emerald-500 active:scale-95 cursor-pointer'
                : 'bg-emerald-950/30 text-emerald-950/60 border border-emerald-950/20 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-[10px] text-center text-slate-500 mt-2 select-none">
        Ollama Liquid Glass Interface. Powered by Local LLMs.
      </div>
    </div>
  );
};

export default MessageInput;
