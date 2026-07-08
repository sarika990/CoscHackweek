import axios from 'axios';

const API_BASE = '/api';

export const api = {
  createTask: async (taskText) => {
    const res = await axios.post(`${API_BASE}/tasks`, { task: taskText });
    return res.data;
  },

  stopTask: async (taskId) => {
    const res = await axios.post(`${API_BASE}/tasks/${taskId}/stop`);
    return res.data;
  },

  getTaskHistory: async () => {
    const res = await axios.get(`${API_BASE}/tasks/history`);
    return res.data;
  },

  getStats: async () => {
    const res = await axios.get(`${API_BASE}/tasks/stats`);
    return res.data;
  },

  clearHistory: async () => {
    const res = await axios.delete(`${API_BASE}/tasks/clear`);
    return res.data;
  },

  getTaskDetails: async (taskId) => {
    const res = await axios.get(`${API_BASE}/tasks/${taskId}`);
    return res.data;
  },

  getWebSocketUrl: (taskId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // During local dev Vite server runs on port 3000 proxying to 8000, 
    // but WebSockets need direct port mappings or proper proxies.
    // If dev mode is running on port 3000, connect to port 8000.
    let wsHost = host;
    if (host.includes('localhost:3000') || host.includes('127.0.0.1:3000')) {
      wsHost = host.replace('3000', '8000');
    }
    return `${protocol}//${wsHost}/api/tasks/${taskId}/ws`;
  }
};
