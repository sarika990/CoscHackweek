import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadImage = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const getImages = () => api.get('/images');
export const getResults = (algorithm) => api.get('/results', { params: { algorithm } });
export const getStatistics = (algorithm) => api.get('/statistics', { params: { algorithm } });
export const deleteImages = () => api.delete('/images');
export const deleteResults = () => api.delete('/results');

export const getCsvReportUrl = (algorithm) => `${API_BASE_URL}/report/csv?algorithm=${algorithm}`;
export const getJsonReportUrl = (algorithm) => `${API_BASE_URL}/report/json?algorithm=${algorithm}`;
export const getPdfReportUrl = (algorithm) => `${API_BASE_URL}/report/pdf?algorithm=${algorithm}`;

export const getImageUrl = (filepath) => {
  if (!filepath) return '';
  const filename = filepath.split(/[\\/]/).pop();
  return `${API_BASE_URL}/uploads/${filename}`;
};

export default api;
