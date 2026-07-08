import axios from 'axios';

export const ollamaService = {
  /**
   * Sends the chat conversation to local Ollama instance
   * @param {Array} messages - Message history in format [{ role: 'user'|'assistant', content: string }]
   * @returns {Promise<string>} - The model's response reply text
   */
  async generateChatResponse(messages) {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
    const targetUrl = `${ollamaUrl}/api/chat`;
    const payload = {
      model: ollamaModel,
      messages: messages,
      stream: false
    };

    try {
      const response = await axios.post(targetUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout for Ollama response
      });

      if (response.data && response.data.message && response.data.message.content) {
        return response.data.message.content;
      }
      throw new Error('Unexpected response format from Ollama');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama is not running. Please start Ollama using "ollama serve".');
      }
      if (error.response && error.response.status === 404) {
        throw new Error(`Model "${ollamaModel}" not found. Please pull it first using "ollama pull ${ollamaModel}".`);
      }
      throw new Error(error.response?.data?.error || error.message || 'Error communicating with Ollama API');
    }
  },

  /**
   * Health check to check connection to local Ollama instance
   */
  async checkHealth() {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    try {
      await axios.get(ollamaUrl, { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }
};
