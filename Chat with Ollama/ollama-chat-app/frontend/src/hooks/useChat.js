import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '../services/api.js';
import { storage } from '../utils/helpers.js';

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, ollama: false });

  // Load chats on mount
  useEffect(() => {
    const savedChats = storage.getChats();
    setChats(savedChats);
    if (savedChats.length > 0) {
      setActiveChatId(savedChats[0].id);
    } else {
      // Create an initial empty chat
      const initialChat = {
        id: 'chat_' + Date.now(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString()
      };
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
      storage.saveChats([initialChat]);
    }
  }, []);

  // Check health on mount and periodically
  const checkHealth = useCallback(async () => {
    const health = await chatApi.checkHealth();
    if (health.status === 'ok') {
      setBackendStatus({ online: true, ollama: health.ollamaConnected });
    } else {
      setBackendStatus({ online: false, ollama: false });
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  // Update active chat's messages and save to storage
  const updateActiveChatMessages = useCallback((updater) => {
    setChats(prevChats => {
      const updated = prevChats.map(c => {
        if (c.id === activeChatId) {
          const nextMessages = typeof updater === 'function' ? updater(c.messages) : updater;
          
          // Generate a title based on the first user message if it's currently 'New Conversation'
          let title = c.title;
          if (c.title === 'New Conversation' && nextMessages.length > 0) {
            const firstUserMsg = nextMessages.find(m => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
            }
          }

          return { ...c, messages: nextMessages, title };
        }
        return c;
      });
      storage.saveChats(updated);
      return updated;
    });
  }, [activeChatId]);

  // Send message
  const sendMessage = useCallback(async (text) => {
    if (!text || text.trim() === '') return;
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Add user message to UI immediately
    let currentHistory = [];
    updateActiveChatMessages(prev => {
      currentHistory = prev; // Keep reference to previous messages for API payload
      return [...prev, userMessage];
    });

    try {
      // Pass the previous history + new user message is handled in controller
      // We send the array of preceding messages for Ollama roleplay context
      const replyData = await chatApi.sendMessage(text, currentHistory);
      
      const assistantMessage = {
        id: 'msg_' + Date.now() + '_reply',
        role: 'assistant',
        content: replyData.reply,
        timestamp: new Date().toISOString()
      };

      updateActiveChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, updateActiveChatMessages]);

  // Clear current chat messages
  const clearChat = useCallback(() => {
    setError(null);
    updateActiveChatMessages([]);
  }, [updateActiveChatMessages]);

  // Create a new blank chat
  const startNewChat = useCallback(() => {
    setError(null);
    const newChatObj = {
      id: 'chat_' + Date.now(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => {
      const next = [newChatObj, ...prev];
      storage.saveChats(next);
      return next;
    });
    setActiveChatId(newChatObj.id);
  }, []);

  // Delete a specific chat
  const deleteChat = useCallback((id) => {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      
      // If we deleted the active chat, select another one or create new
      if (activeChatId === id) {
        if (next.length > 0) {
          setActiveChatId(next[0].id);
        } else {
          const newChatObj = {
            id: 'chat_' + Date.now(),
            title: 'New Conversation',
            messages: [],
            createdAt: new Date().toISOString()
          };
          next.push(newChatObj);
          setActiveChatId(newChatObj.id);
        }
      }
      
      storage.saveChats(next);
      return next;
    });
  }, [activeChatId]);

  // Select another chat
  const selectChat = useCallback((id) => {
    setError(null);
    setActiveChatId(id);
  }, []);

  // Retry last request if it failed
  const retryLastRequest = useCallback(async () => {
    if (messages.length === 0 || isLoading) return;
    
    // Find the last user message
    const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMsgIndex === -1) return;

    const actualIndex = messages.length - 1 - lastUserMsgIndex;
    const lastUserMsg = messages[actualIndex];

    // Remove everything after this user message
    const cleanMessages = messages.slice(0, actualIndex + 1);
    
    setError(null);
    setIsLoading(true);

    // Update state to remove any failed/half-baked messages after last user message
    updateActiveChatMessages(cleanMessages);

    try {
      // Query using cleanMessages minus the last one as history
      const historyPayload = cleanMessages.slice(0, -1);
      const replyData = await chatApi.sendMessage(lastUserMsg.content, historyPayload);

      const assistantMessage = {
        id: 'msg_' + Date.now() + '_reply',
        role: 'assistant',
        content: replyData.reply,
        timestamp: new Date().toISOString()
      };

      updateActiveChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, updateActiveChatMessages]);

  return {
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
  };
};
