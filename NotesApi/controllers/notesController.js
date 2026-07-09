const { v4: uuidv4 } = require('uuid');
const { readNotes, writeNotes } = require('../utils/fileHelper');

/**
 * @desc    Get all notes
 * @route   GET /api/notes
 * @access  Public
 */
async function getNotes(req, res, next) {
  try {
    const notes = await readNotes();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
async function getNoteById(req, res, next) {
  try {
    const notes = await readNotes();
    const note = notes.find((n) => n.id === req.params.id);
    
    if (!note) {
      res.status(404);
      throw new Error(`Note with ID ${req.params.id} not found`);
    }
    
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Public
 */
async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400);
      throw new Error('Title cannot be empty');
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      res.status(400);
      throw new Error('Content cannot be empty');
    }
    
    const notes = await readNotes();
    const timestamp = new Date().toISOString();
    
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    notes.push(newNote);
    await writeNotes(notes);
    
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update an existing note
 * @route   PUT /api/notes/:id
 * @access  Public
 */
async function updateNote(req, res, next) {
  try {
    const { title, content } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400);
      throw new Error('Title cannot be empty');
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      res.status(400);
      throw new Error('Content cannot be empty');
    }
    
    const notes = await readNotes();
    const noteIndex = notes.findIndex((n) => n.id === req.params.id);
    
    if (noteIndex === -1) {
      res.status(404);
      throw new Error(`Note with ID ${req.params.id} not found`);
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    await writeNotes(notes);
    
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Public
 */
async function deleteNote(req, res, next) {
  try {
    const notes = await readNotes();
    const noteExists = notes.some((n) => n.id === req.params.id);
    
    if (!noteExists) {
      res.status(404);
      throw new Error(`Note with ID ${req.params.id} not found`);
    }
    
    const updatedNotes = notes.filter((n) => n.id !== req.params.id);
    await writeNotes(updatedNotes);
    
    res.status(200).json({
      status: 'success',
      message: `Note with ID ${req.params.id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
