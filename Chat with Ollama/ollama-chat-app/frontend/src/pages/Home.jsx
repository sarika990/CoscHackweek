import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import MessageInput from '../components/MessageInput.jsx';
import { useChat } from '../hooks/useChat.js';

const Home = () => {
  const {
    chats,
    activeChatId,
    messages,
    isLoading,
    error,
    backendStatus,
    sendMessage,
    clearChat,
    startNewChat,
    deleteChat,
    selectChat,
    retryLastRequest,
    checkHealth
  } = useChat();

  const isInputDisabled = !backendStatus.online || !backendStatus.ollama;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070d0a]">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex h-full">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onStartNewChat={startNewChat}
          backendStatus={backendStatus}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Navbar backendStatus={backendStatus} onRefresh={checkHealth} />
        
        {/* Mobile Sidebar overlay warning if offline */}
        {!backendStatus.online && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2 text-xs text-rose-400 font-medium flex items-center justify-between">
            <span>Backend server is offline. Run 'npm run dev' inside the backend folder.</span>
            <button onClick={checkHealth} className="underline hover:text-rose-300">Reconnect</button>
          </div>
        )}
        
        {backendStatus.online && !backendStatus.ollama && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-xs text-amber-400 font-medium flex items-center justify-between">
            <span>Ollama API is unreachable. Make sure Ollama is running and model llama3.2 is pulled.</span>
            <button onClick={checkHealth} className="underline hover:text-amber-300">Check Ollama</button>
          </div>
        )}

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={sendMessage}
          onClearChat={clearChat}
          onRetry={retryLastRequest}
          disabled={isInputDisabled}
        />

        <MessageInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={isInputDisabled}
        />
      </div>
    </div>
  );
};

export default Home;
