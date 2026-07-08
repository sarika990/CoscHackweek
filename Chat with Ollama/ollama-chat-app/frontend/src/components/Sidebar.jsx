import React from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiSettings, FiVolumeX, FiInfo } from 'react-icons/fi';

const Sidebar = ({ chats, activeChatId, onSelectChat, onDeleteChat, onStartNewChat, backendStatus }) => {
  return (
    <aside className="w-64 border-r border-glass-border glass-panel flex flex-col h-full z-30 shrink-0">
      {/* New Chat Button */}
      <div className="p-4 border-b border-glass-border">
        <button
          onClick={onStartNewChat}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/10 active:scale-98 transition-all duration-200"
        >
          <FiPlus className="w-4 h-4 stroke-[2.5]" />
          New Conversation
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
          History
        </div>
        {chats.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-8 italic">
            No history yet
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    : 'text-slate-300 hover:bg-emerald-950/20 hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <FiMessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate pr-1">{chat.title || 'New Conversation'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-all duration-200"
                  title="Delete Chat"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-glass-border space-y-3 bg-emerald-950/10">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Active Model:</span>
          <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/15">
            llama3.2
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiInfo className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Ollama server: localhost:11434</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
