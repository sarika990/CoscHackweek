import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Upload documents
  uploadFiles: async (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Ask question
  askQuestion: async (question) => {
    const response = await client.post('/ask', { question });
    return response.data;
  },

  // List all uploaded files
  listFiles: async () => {
    const response = await client.get('/files');
    return response.data;
  },

  // Reset vectors, files, and state
  resetKnowledgeBase: async () => {
    const response = await client.delete('/reset');
    return response.data;
  },

  // Generate document summary
  summarizeDocuments: async () => {
    const response = await client.post('/summarize');
    return response.data;
  },

  // Get system health
  checkHealth: async () => {
    const response = await client.get('/health');
    return response.data;
  },
};

export default api;
