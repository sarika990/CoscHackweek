import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Base route for connectivity test
app.get('/', (req, res) => {
  res.json({ message: 'Local Ollama Chat backend is running.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Configured Ollama URL: ${process.env.OLLAMA_URL || 'http://localhost:11434'}`);
  console.log(`Configured Ollama Model: ${process.env.OLLAMA_MODEL || 'llama3.2'}`);
});
