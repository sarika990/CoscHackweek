import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { Bold, Italic, Underline, Copy, Check, LogOut, Loader2, Bell } from 'lucide-react';
import clsx from 'clsx';

export const PropertiesPanel = () => {
  const { 
    properties, 
    updateProperties, 
    currentTool, 
    theme, 
    userId, 
    currentUser,
    onlineUsers, 
    collabPartner,
    collabRoomId,
    collabStatus,
    setCollabStatus,
    setCollabPartner,
    setCollabRoomId,
    socket,
    incomingRequests,
    setIncomingRequests,
    sentRequests,
    setSentRequestStatus,
    acceptedUserSocketId
  } = useBoardStore();

  const [copiedId, setCopiedId] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = [
    '#000000', '#FFFFFF', '#FF3B30', '#FF9500', 
    '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', 
    '#5856D6', '#FF2D55'
  ];

  const presetSizes = [1, 2, 5, 10, 20, 30];

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProperties({ strokeColor: e.target.value });
  };

  const handleCustomFillColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProperties({ fillColor: e.target.value });
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Connect request click
  const handleConnectRequest = (targetSocketId: string) => {
    if (!socket) return;
    setSentRequestStatus(targetSocketId, true);
    // send_request
    socket.emit('send_request', { fromId: socket.id, toId: targetSocketId });
    setCollabStatus('requested');
  };

  // Accept incoming request
  const handleAcceptIncoming = (fromId: string) => {
    if (!socket) return;
    socket.emit('respond_request', { fromId, toId: socket.id, accepted: true });
    setIncomingRequests(incomingRequests.filter(r => r.fromId !== fromId));
  };

  // Reject incoming request
  const handleRejectIncoming = (fromId: string) => {
    if (!socket) return;
    socket.emit('respond_request', { fromId, toId: socket.id, accepted: false });
    setIncomingRequests(incomingRequests.filter(r => r.fromId !== fromId));
  };

  // Disconnect collaboration
  const handleDisconnectCollab = () => {
    if (!socket || !collabRoomId) return;
    socket.emit('leave-room', { roomId: collabRoomId });
    setCollabPartner(null);
    setCollabRoomId(null);
    setCollabStatus('idle');
  };

  // Exclude self from online list
  const otherUsers = onlineUsers.filter(u => u.userId !== userId);
  const filteredUsers = otherUsers.filter(u => 
    u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={clsx(
      'w-64 border-l p-4 flex flex-col gap-6 z-10 overflow-y-auto transition-colors duration-300',
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800 text-gray-200 shadow-black/40' 
        : 'bg-white border-pink-100 text-gray-850'
    )}>
      {/* Collaboration Section */}
      <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-850 pb-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Collaboration</h3>
        
        {/* User Card */}
        <div className="flex flex-col gap-1.5 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-150 dark:border-gray-750">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">My Name: {currentUser?.name}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-gray-550 dark:text-gray-400">ID: {userId}</span>
            <button 
              onClick={handleCopyUserId}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-500"
              title="Copy ID"
            >
              {copiedId ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Collaborator Connection Status */}
        {collabStatus === 'connected' && collabPartner && (
          <div className="flex flex-col gap-2 p-2.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase">Collaborator Status</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Connected with: {collabPartner.username}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">ID: {collabPartner.userId}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              🟢 Connected
            </div>
            <button
              onClick={handleDisconnectCollab}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500 hover:bg-red-600 active:bg-red-750 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer mt-1"
            >
              <LogOut size={12} />
              Disconnect
            </button>
          </div>
        )}

        {/* Connect list or status loader */}
        {collabStatus !== 'connected' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online Users ({otherUsers.length})
            </span>
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-pink-500 mb-1"
            />
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto bg-gray-50 dark:bg-gray-800/40 p-2 rounded-xl border border-gray-150 dark:border-gray-750">
              {filteredUsers.length === 0 ? (
                <span className="text-[10px] text-gray-400 italic p-1 font-sans">
                  {otherUsers.length === 0 ? 'No other users online' : 'No matching users'}
                </span>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.socketId} className="flex flex-col p-1.5 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-750 gap-1.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{user.username}</span>
                      <span className="text-[9px] font-mono text-gray-550 dark:text-gray-400">ID: {user.userId}</span>
                    </div>
                    {user.status === 'busy' ? (
                      <span className="text-[9px] text-gray-400 italic">Busy collaborating</span>
                    ) : acceptedUserSocketId === user.socketId ? (
                      <button 
                        disabled
                        className="w-full py-1 bg-green-500 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1"
                      >
                        Accepted
                      </button>
                    ) : sentRequests[user.socketId] ? (
                      <button 
                        disabled
                        className="w-full py-1 bg-gray-150 dark:bg-gray-750 text-gray-450 text-[10px] font-bold rounded flex items-center justify-center gap-1"
                      >
                        <Loader2 size={10} className="animate-spin text-pink-500" />
                        Pending...
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectRequest(user.socketId)}
                        disabled={collabStatus === 'requested'}
                        className="w-full py-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white text-[10px] font-bold rounded transition-colors cursor-pointer"
                      >
                        Request
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Requests Section */}
      <div className="flex flex-col gap-3 border-b border-gray-150 dark:border-gray-850 pb-4">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Bell size={12} className={clsx("text-pink-500", incomingRequests.length > 0 && "animate-bounce")} />
            <span>Requests</span>
          </div>
          {incomingRequests.length > 0 && (
            <span className="bg-pink-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </h3>

        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
          {incomingRequests.length === 0 ? (
            <span className="text-[10px] text-gray-400 italic">No pending requests</span>
          ) : (
            incomingRequests.map((req) => (
              <div key={req.fromId} className="flex flex-col p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-150 dark:border-gray-750 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{req.fromName}</span>
                  <span className="text-[9px] text-gray-550 dark:text-gray-400">wants to collaborate with you</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRejectIncoming(req.fromId)}
                    className="flex-1 py-1 text-[10px] font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer text-gray-650 dark:text-gray-300"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAcceptIncoming(req.fromId)}
                    className="flex-1 py-1 text-[10px] font-bold bg-pink-500 hover:bg-pink-600 text-white rounded transition-colors cursor-pointer"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stroke Color Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Stroke Color</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => updateProperties({ strokeColor: c })}
              className={`w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                properties.strokeColor === c ? 'ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={properties.strokeColor} 
            onChange={handleCustomColor}
            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-transparent"
          />
          <span className="text-xs font-semibold">{properties.strokeColor}</span>
        </div>
      </div>

      {/* Fill Color Section (shapes only) */}
      {['rectangle', 'circle', 'triangle', 'ellipse', 'select'].includes(currentTool) && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Fill Color</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => updateProperties({ fillColor: 'transparent' })}
              className={`w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${
                properties.fillColor === 'transparent' ? 'ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
            >
              <div className="w-full h-px bg-red-500 rotate-45"></div>
            </button>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => updateProperties({ fillColor: c })}
                className={`w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                  properties.fillColor === c ? 'ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={properties.fillColor === 'transparent' ? '#FFFFFF' : properties.fillColor} 
              onChange={handleCustomFillColor}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5 bg-transparent"
            />
            <span className="text-xs font-semibold">
              {properties.fillColor === 'transparent' ? 'Transparent' : properties.fillColor}
            </span>
          </div>
        </div>
      )}

      {/* Brush & Stroke Size Slider */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Size Options</h3>
        <div className="flex justify-between gap-1.5 mb-3">
          {presetSizes.map(size => (
            <button
              key={size}
              onClick={() => {
                updateProperties({ brushSize: size, strokeWidth: size });
              }}
              className={clsx(
                'text-[10px] font-bold px-2 py-1 border rounded-lg transition-all cursor-pointer',
                (properties.brushSize === size || properties.strokeWidth === size)
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 border-pink-400 font-extrabold'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-800'
              )}
            >
              {size}px
            </button>
          ))}
        </div>
        <input 
          type="range" 
          min="1" max="50" 
          value={properties.brushSize}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            updateProperties({ brushSize: val, strokeWidth: val });
          }}
          className="w-full accent-pink-500"
        />
      </div>

      {/* Opacity Slider */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Opacity ({properties.opacity}%)
        </h3>
        <input 
          type="range" 
          min="10" max="100" 
          value={properties.opacity}
          onChange={(e) => updateProperties({ opacity: parseInt(e.target.value) })}
          className="w-full accent-pink-500"
        />
      </div>

      {/* Text Properties Section */}
      {(currentTool === 'text' || currentTool === 'select') && (
        <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-gray-850 pt-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Text Style</h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => updateProperties({ isBold: !properties.isBold })}
              className={clsx(
                'p-2 border rounded-lg cursor-pointer transition-colors',
                properties.isBold 
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 border-pink-400 font-bold'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-800'
              )}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => updateProperties({ isItalic: !properties.isItalic })}
              className={clsx(
                'p-2 border rounded-lg cursor-pointer transition-colors',
                properties.isItalic 
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 border-pink-400 font-bold'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-800'
              )}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => updateProperties({ isUnderline: !properties.isUnderline })}
              className={clsx(
                'p-2 border rounded-lg cursor-pointer transition-colors',
                properties.isUnderline 
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 border-pink-400 font-bold'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-800'
              )}
              title="Underline"
            >
              <Underline size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 dark:text-gray-500 font-semibold mb-2">Font Family</label>
            <select
              value={properties.fontFamily}
              onChange={(e) => updateProperties({ fontFamily: e.target.value })}
              className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none"
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Comic Sans MS">Comic Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 dark:text-gray-500 font-semibold mb-2">Font Size ({properties.fontSize}px)</label>
            <input 
              type="range" 
              min="12" max="72" 
              value={properties.fontSize}
              onChange={(e) => updateProperties({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-pink-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};