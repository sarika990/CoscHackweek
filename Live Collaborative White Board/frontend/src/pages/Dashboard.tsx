import { useEffect, useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { Navbar } from '../components/Navbar';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CanvasArea } from '../components/CanvasArea';
import { JoinRoomModal } from '../components/JoinRoomModal';
import { io } from 'socket.io-client';

export const Dashboard = () => {
  const { 
    theme, 
    currentUser, 
    userId, 
    setCurrentUser, 
    setUserId, 
    setSocket, 
    setOnlineUsers, 
    setCollabPartner, 
    setCollabRoomId, 
    setCollabStatus,
    setConnectionStatus,
    setIncomingRequests,
    clearSentRequests
  } = useBoardStore();

  const [toast, setToast] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load user session from localStorage if present
  useEffect(() => {
    const savedName = localStorage.getItem('collab_username');
    const savedColor = localStorage.getItem('collab_color') || '#FF3B30';
    let savedUserId = localStorage.getItem('collab_userid');

    if (savedName) {
      if (!savedUserId) {
        const cleanPrefix = savedName.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const finalPrefix = cleanPrefix ? cleanPrefix : 'USER';
        savedUserId = `${finalPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem('collab_userid', savedUserId);
      }
      setCurrentUser({ name: savedName, color: savedColor });
      setUserId(savedUserId);
    }
  }, []);

  const handleJoin = (name: string, color: string, generatedUserId: string) => {
    localStorage.setItem('collab_username', name);
    localStorage.setItem('collab_color', color);
    localStorage.setItem('collab_userid', generatedUserId);
    setCurrentUser({ name, color });
    setUserId(generatedUserId);
  };

  const currentUserName = currentUser?.name;

  // Socket Connection management once User is setup
  useEffect(() => {
    if (!currentUserName || !userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    console.log('Initializing socket connection to:', socketUrl);
    setConnectionStatus('connecting');
    
    const newSocket = io(socketUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Socket connected successfully! Emitting user-online event:', { userId, username: currentUserName });
      newSocket.emit('user-online', {
        userId,
        username: currentUserName
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('disconnected');
      showToast('Connection to server failed', 'error');
    });

    newSocket.on('online_users_update', (activeUsers: Record<string, any>) => {
      console.log('Received online_users_update:', activeUsers);
      const usersArray = Object.entries(activeUsers).map(([socketId, user]) => ({
        socketId,
        userId: user.userId,
        username: user.username || user.name || 'Anonymous',
        status: (user.status || 'online') as 'online' | 'busy',
        partnerId: user.partnerId,
        roomId: user.roomId
      }));
      setOnlineUsers(usersArray);
    });

    // incoming_request
    newSocket.on('incoming_request', (data: { fromId: string; fromName: string }) => {
      const current = useBoardStore.getState().incomingRequests;
      if (!current.some(r => r.fromId === data.fromId)) {
        setIncomingRequests([...current, data]);
      }
    });

    // collab_started
    newSocket.on('collab_started', (data: { roomId: string; partnerName: string }) => {
      const partnerSocketId = data.roomId.split('-').find(id => id !== newSocket.id) || '';
      const usersList = useBoardStore.getState().onlineUsers;
      const foundPartner = usersList.find(u => u.username === data.partnerName || u.socketId === partnerSocketId);
      
      const partnerObj = {
        userId: foundPartner?.userId || data.partnerName,
        username: data.partnerName,
        socketId: foundPartner?.socketId || partnerSocketId
      };

      useBoardStore.setState({ acceptedUserSocketId: partnerSocketId });

      setTimeout(() => {
        setCollabPartner(partnerObj);
        setCollabRoomId(data.roomId);
        setCollabStatus('connected');
        
        // Clear pending requests
        setIncomingRequests([]);
        clearSentRequests();
        useBoardStore.setState({ acceptedUserSocketId: null });
        
        showToast(`Connected successfully with ${data.partnerName}!`, 'success');
      }, 1000);
    });

    // request_rejected
    newSocket.on('request_rejected', () => {
      showToast('Request Declined', 'error');
      clearSentRequests();
      setCollabStatus('idle');
    });

    // partner_disconnected / partner-disconnected
    newSocket.on('partner_disconnected', () => {
      showToast('Partner disconnected', 'info');
      setCollabPartner(null);
      setCollabRoomId(null);
      setCollabStatus('idle');
      clearSentRequests();
      setIncomingRequests([]);
    });

    newSocket.on('partner-disconnected', () => {
      showToast('Partner disconnected', 'info');
      setCollabPartner(null);
      setCollabRoomId(null);
      setCollabStatus('idle');
      clearSentRequests();
      setIncomingRequests([]);
    });

    return () => {
      console.log('Cleaning up socket. Disconnecting socket ID:', newSocket.id);
      newSocket.disconnect();
      setSocket(null);
    };
  }, [currentUserName, userId]);

  const isSetup = currentUser && userId;

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden transition-colors duration-300 relative ${
      theme === 'dark' ? 'dark bg-gray-950 text-gray-100' : 'bg-white text-gray-800'
    }`}>
      {!isSetup ? (
        <JoinRoomModal onJoin={handleJoin} />
      ) : (
        <>
          <Navbar />
          <div className="flex flex-1 overflow-hidden relative">
            <Toolbar />
            <CanvasArea />
            <PropertiesPanel />
          </div>
        </>
      )}

      {/* Floating System Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <div className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white transition-all duration-300 ${
            toast.type === 'error' 
              ? 'bg-red-500 shadow-red-500/10' 
              : toast.type === 'success' 
                ? 'bg-green-500 shadow-green-500/10' 
                : 'bg-gray-850 dark:bg-gray-750/90 backdrop-blur shadow-black/10'
          }`}>
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;