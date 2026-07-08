import axios from 'axios';

// Create central Axios instance with a timeout suitable for local model invocation
const api = axios.create({
  baseURL: '/api', // Proxied by Vite to http://localhost:5000/api in development
  timeout: 35000,   // 35 seconds
});

export const chatApi = {
  /**
   * Send a chat message with current history
   * @param {string} message - Message text
   * @param {Array} history - Preceding messages array [{ role: 'user'|'assistant', content: string }]
   */
  async sendMessage(message, history) {
    try {
      const response = await api.post('/chat', { message, history });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Ollama took too long to respond.');
      }
      throw new Error('Network error. Unable to connect to the backend server.');
    }
  },

  /**
   * Check connection health of backend and Ollama
   */
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'error', ollamaConnected: false };
    }
  }
};
