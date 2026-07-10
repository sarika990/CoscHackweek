import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('doc_qa_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [recentQuestions, setRecentQuestions] = useState(() => {
    const saved = localStorage.getItem('doc_qa_recent_questions');
    return saved ? JSON.parse(saved) : [];
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('doc_qa_messages', JSON.stringify(messages));
  }, [messages]);

  // Sync recent questions
  useEffect(() => {
    localStorage.setItem('doc_qa_recent_questions', JSON.stringify(recentQuestions));
  }, [recentQuestions]);

  // Dark Mode side effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch uploaded files from backend
  const fetchFiles = useCallback(async () => {
    try {
      const data = await api.listFiles();
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files:", err);
    }
  }, []);

  // Check backend health on start
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Upload PDF/TXT files
  const uploadDocuments = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      const result = await api.uploadFiles(fileList, (progress) => {
        setUploadProgress(progress);
      });
      // Refresh file list
      await fetchFiles();
      return result;
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to upload files. Ensure size < 20MB and file is a PDF/TXT.";
      setErrorMessage(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  // Ask question in chat
  const askQuestion = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setErrorMessage('');
    
    // Add to recent questions (max 5)
    setRecentQuestions(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== text.toLowerCase());
      return [text, ...filtered].slice(0, 5);
    });

    try {
      const data = await api.askQuestion(text);
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer,
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not retrieve answer. Check network and API Key.";
      setErrorMessage(msg);
      
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Error: ${msg}`,
        sources: [],
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Summarize whole knowledge base
  const summarizeKnowledgeBase = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const data = await api.summarizeDocuments();
      
      const aiMsg = {
        id: Date.now().toString(),
        sender: 'ai',
        text: data.summary,
        sources: [{ source: 'All uploaded documents', chunk_index: 0 }],
        isSummary: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not generate summary.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Clear Chat history (locally)
  const clearChat = () => {
    setMessages([]);
  };

  // Reset Knowledge Base (completely wipe server files & index)
  const resetKnowledgeBase = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await api.resetKnowledgeBase();
      setFiles([]);
      setMessages([]);
      setRecentQuestions([]);
    } catch (err) {
      setErrorMessage("Failed to reset knowledge base.");
    } finally {
      setLoading(false);
    }
  };

  // Download Chat history as markdown file
  const downloadChat = () => {
    if (messages.length === 0) return;
    const text = messages.map(m => {
      const role = m.sender === 'user' ? '### User' : '### AI';
      const sourcesText = m.sources && m.sources.length > 0 
        ? `\n\n*Sources: ${m.sources.map(s => `${s.source} (Chunk ${s.chunk_index})`).join(', ')}*`
        : '';
      return `${role} (${m.timestamp})\n\n${m.text}${sourcesText}\n\n---\n`;
    }).join('\n');
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_history_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
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
  };
}
