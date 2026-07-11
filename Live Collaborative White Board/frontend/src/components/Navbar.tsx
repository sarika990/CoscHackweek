import { useBoardStore } from '../store/useBoardStore';
import { 
  Moon, Sun, Share2, Download, Undo2, Redo2, 
  Trash2, Wifi, WifiOff 
} from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { 
    theme, 
    toggleTheme, 
    connectionStatus,
    collabStatus,
    collabRoomId,
    collabPartner,
    onlineUsers
  } = useBoardStore();

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!collabRoomId) return;
    try {
      await navigator.clipboard.writeText(collabRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Room ID', err);
    }
  };

  const triggerAction = (action: string, detail?: any) => {
    window.dispatchEvent(new CustomEvent(action, { detail }));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire whiteboard? This action cannot be undone.')) {
      triggerAction('whiteboard-clear');
    }
  };

  return (
    <nav className={`h-14 border-b flex items-center justify-between px-4 transition-colors duration-300 z-30 select-none ${
      theme === 'dark' 
        ? 'bg-gray-900/90 border-gray-800 text-white' 
        : 'bg-white/90 border-pink-100 text-gray-800'
    } backdrop-blur-md`}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          CollabBoard
        </h1>
        <div className={`h-5 w-px ${theme === 'dark' ? 'bg-gray-800' : 'bg-pink-100'}`}></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {collabStatus === 'connected' && collabPartner 
              ? `Collaborative Workspace (Collaborating with: ${collabPartner.username})` 
              : 'Solo Workspace'}
          </span>
          {collabRoomId && (
            <span className="text-xs px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded font-mono font-bold">
              {collabRoomId}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            {connectionStatus === 'connected' ? (
              <span title="Server Connected"><Wifi size={14} className="text-green-500" /></span>
            ) : connectionStatus === 'connecting' ? (
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" title="Connecting to server..." />
            ) : (
              <span title="Disconnected"><WifiOff size={14} className="text-red-500" /></span>
            )}
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md font-bold font-sans">
              {onlineUsers.length} Online
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Undo/Redo & Clear controls */}
        <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800/80 p-0.5 rounded-lg">
          <button 
            onClick={() => triggerAction('whiteboard-undo')}
            className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button 
            onClick={() => triggerAction('whiteboard-redo')}
            className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button 
            onClick={handleClear}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Clear Board"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className={`h-5 w-px ${theme === 'dark' ? 'bg-gray-800' : 'bg-pink-100'} mx-1`}></div>

        {/* Share Room ID */}
        {collabRoomId && (
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-pink-500/10 cursor-pointer"
          >
            <Share2 size={16} />
            <span>{copied ? 'Copied Room ID!' : 'Share Room'}</span>
          </button>
        )}

        {/* Export / Download options */}
        <div className="relative group">
          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border cursor-pointer ${
            theme === 'dark'
              ? 'border-gray-800 hover:bg-gray-800 text-gray-300'
              : 'border-pink-100 hover:bg-pink-50 text-gray-600'
          }`}>
            <Download size={16} />
            <span>Export</span>
          </button>
          <div className={`absolute right-0 mt-1 w-32 hidden group-hover:block rounded-lg shadow-xl border overflow-hidden z-50 ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-pink-100'
          }`}>
            <button 
              onClick={() => triggerAction('whiteboard-export', { format: 'png' })}
              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-pink-50 dark:hover:bg-gray-850 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
            >
              As PNG
            </button>
            <button 
              onClick={() => triggerAction('whiteboard-export', { format: 'jpeg' })}
              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-pink-50 dark:hover:bg-gray-850 transition-colors cursor-pointer text-gray-700 dark:text-gray-200"
            >
              As JPEG
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-lg transition-colors border cursor-pointer ${
            theme === 'dark'
              ? 'border-gray-800 hover:bg-gray-800 text-yellow-400'
              : 'border-pink-100 hover:bg-pink-50 text-gray-500'
          }`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </nav>
  );
};