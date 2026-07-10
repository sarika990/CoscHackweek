/**
 * Leaderboard Manager
 * Handles saving, retrieving, sorting, searching, and clearing leaderboard entries.
 */
import { StorageManager } from './storage.js';

export class LeaderboardManager {
  static saveEntry(playerName, score, accuracy, difficulty) {
    const entries = StorageManager.getLeaderboard();
    const newEntry = {
      id: Date.now(),
      name: playerName.trim() || 'Anonymous Player',
      score: parseInt(score) || 0,
      accuracy: parseInt(accuracy) || 0,
      difficulty: difficulty || 'Easy',
      date: new Date().toISOString()
    };

    entries.push(newEntry);
    StorageManager.saveLeaderboard(entries);
    return newEntry;
  }

  /**
   * Retrieves leaderboard entries based on search, filter, and sorting.
   * @param {Object} options - Search and sort configs
   * @param {string} options.query - Name filter search query
   * @param {string} options.sortBy - 'score' | 'newest' | 'accuracy'
   * @returns {Array} Filtered and sorted entries (capped at top 20)
   */
  static getEntries(options = {}) {
    const query = options.query ? options.query.toLowerCase().trim() : '';
    const sortBy = options.sortBy || 'score'; // default sort by highest score

    let entries = StorageManager.getLeaderboard();

    // 1. Search Query filter
    if (query) {
      entries = entries.filter(e => e.name.toLowerCase().includes(query));
    }

    // 2. Sorting
    entries.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'accuracy') {
        if (b.accuracy === a.accuracy) {
          return b.score - a.score; // tie-breaker: higher score
        }
        return b.accuracy - a.accuracy;
      } else {
        // default: sort by score
        if (b.score === a.score) {
          return b.accuracy - a.accuracy; // tie-breaker: higher accuracy
        }
        return b.score - a.score;
      }
    });

    // Capped at top 20 entries
    return entries.slice(0, 20);
  }

  static clear() {
    StorageManager.saveLeaderboard([]);
  }
}
