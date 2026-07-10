import React, { useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import api from '../services/api';

export default function Home() {
  const {
    messages,
    files,
    loading,
    uploading,
    uploadProgress,
    darkMode,
    recentQuestions,
    errorMessage,
    setErrorMessage,
    toggleDarkMode,
    uploadDocuments,
    askQuestion,
    summarizeKnowledgeBase,
    clearChat,
    resetKnowledgeBase,
    downloadChat,
  } = useChat();

  const [apiHealthy, setApiHealthy] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Poll server health status occasionally
  useEffect(() => {
    const checkHealthStatus = async () => {
      try {
        const res = await api.checkHealth();
        setApiHealthy(res.api_key_configured);
      } catch (err) {
        setApiHealthy(false);
      }
    };
    checkHealthStatus();
    const interval = setInterval(checkHealthStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (fileList) => {
    try {
      await uploadDocuments(fileList);
    } catch (err) {
      // Handled in hook
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      await summarizeKnowledgeBase();
    } catch (err) {
      // Handled in hook
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        onClearChat={clearChat} 
        onResetKB={resetKnowledgeBase} 
        onDownloadChat={downloadChat} 
        hasMessages={messages.length > 0}
        apiHealthy={apiHealthy}
      />
      
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar 
          files={files} 
          uploading={uploading} 
          uploadProgress={uploadProgress} 
          onUpload={handleUpload} 
          onSummarize={handleSummarize} 
          isSummarizing={isSummarizing}
          onQuickQuestion={askQuestion}
        />
        
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          {/* Error Banner */}
          {errorMessage && (
            <div className="absolute top-0 inset-x-0 bg-rose-600 text-white text-xs px-4 py-2 flex items-center justify-between z-10 shadow-md">
              <span className="truncate pr-4">{errorMessage}</span>
              <button 
                onClick={() => setErrorMessage('')}
                className="font-bold hover:opacity-85 text-sm"
              >
                ×
              </button>
            </div>
          )}
          
          <ChatBox 
            messages={messages} 
            loading={loading} 
            onSendMessage={askQuestion} 
            files={files}
          />
        </main>
      </div>
    </div>
  );
}
