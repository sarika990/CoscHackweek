require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const notesRoutes = require('./routes/notesRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/notes', notesRoutes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Notes API',
    endpoints: {
      getNotes: 'GET /api/notes',
      getNoteById: 'GET /api/notes/:id',
      createNote: 'POST /api/notes',
      updateNote: 'PUT /api/notes/:id',
      deleteNote: 'DELETE /api/notes/:id'
    }
  });
});

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections to prevent crashing the process unexpectedly
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running but log error
});
