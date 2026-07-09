const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'notes.json');

/**
 * Ensures the data directory and notes.json file exist.
 */
async function ensureFileExists() {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([]), 'utf8');
    }
  } catch (error) {
    console.error('Failed to ensure data file exists:', error);
    throw error;
  }
}

/**
 * Reads notes from the JSON file.
 * @returns {Promise<Array>} Array of notes.
 */
async function readNotes() {
  await ensureFileExists();
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading notes file:', error);
    return [];
  }
}

/**
 * Writes notes to the JSON file.
 * @param {Array} notes - Array of notes to write.
 */
async function writeNotes(notes) {
  await ensureFileExists();
  try {
    await fs.writeFile(filePath, JSON.stringify(notes, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing notes file:', error);
    throw error;
  }
}

module.exports = {
  readNotes,
  writeNotes
};
