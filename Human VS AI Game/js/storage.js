/**
 * StorageManager
 * A robust wrapper for LocalStorage to manage app states safely.
 */
export class StorageManager {
  static get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading key "${key}" from LocalStorage:`, e);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing key "${key}" to LocalStorage:`, e);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing key "${key}" from LocalStorage:`, e);
      return false;
    }
  }

  static clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("Error clearing LocalStorage:", e);
      return false;
    }
  }

  // --- Specific Helpers ---

  static getSettings() {
    const defaults = {
      musicEnabled: true,
      soundEnabled: true,
      volume: 0.5,
      theme: 'dark',
      animationsEnabled: true
    };
    return this.get('human_vs_ai_settings', defaults);
  }

  static saveSettings(settings) {
    this.set('human_vs_ai_settings', settings);
  }

  static getLeaderboard() {
    return this.get('human_vs_ai_leaderboard', []);
  }

  static saveLeaderboard(leaderboard) {
    this.set('human_vs_ai_leaderboard', leaderboard);
  }

  static getAchievements() {
    return this.get('human_vs_ai_achievements', []);
  }

  static saveAchievements(achievements) {
    this.set('human_vs_ai_achievements', achievements);
  }

  static getStats() {
    const defaults = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      totalScore: 0,
      averageScore: 0,
      longestStreak: 0,
      fastestAnswer: 999, // in seconds
      hintsUsed: 0,
      categoryStats: {
        image: { played: 0, correct: 0 },
        text: { played: 0, correct: 0 },
        code: { played: 0, correct: 0 },
        voice: { played: 0, correct: 0 },
        artwork: { played: 0, correct: 0 }
      },
      difficultyStats: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Expert: 0
      }
    };
    return this.get('human_vs_ai_stats', defaults);
  }

  static saveStats(stats) {
    this.set('human_vs_ai_stats', stats);
  }
}
