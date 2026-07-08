import { ollamaService } from '../services/ollamaService.js';

export const chatController = {
  async handleChat(req, res, next) {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ 
          error: true, 
          message: 'Message field is required and cannot be empty' 
        });
      }

      // Compile message list for Ollama.
      // If history is provided, we format it. Otherwise, we start a new array.
      let ollamaMessages = [];

      if (Array.isArray(history)) {
        ollamaMessages = history.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content || ''
        }));
      }

      // Append the current message
      ollamaMessages.push({
        role: 'user',
        content: message.trim()
      });

      const reply = await ollamaService.generateChatResponse(ollamaMessages);
      
      return res.status(200).json({
        reply: reply
      });
    } catch (error) {
      next(error);
    }
  },

  async handleHealthCheck(req, res, next) {
    try {
      const isOllamaUp = await ollamaService.checkHealth();
      return res.status(200).json({
        status: 'ok',
        ollamaConnected: isOllamaUp
      });
    } catch (error) {
      next(error);
    }
  }
};
