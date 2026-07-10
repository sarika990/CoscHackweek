/**
 * ScoreManager
 * Calculates scores, streaks, bonuses, and applies difficulty multipliers.
 */
export class ScoreManager {
  constructor(difficulty = 'Easy') {
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.roundsPlayed = 0;
    this.difficulty = difficulty;

    this.multipliers = {
      Easy: 1.0,
      Medium: 1.5,
      Hard: 2.0,
      Expert: 3.0
    };
  }

  getMultiplier() {
    return this.multipliers[this.difficulty] || 1.0;
  }

  /**
   * Processes a round answer and calculates the score increase.
   * @param {boolean} isCorrect - If the answer was correct
   * @param {number} timeRemaining - In seconds
   * @param {number} totalDuration - Total round time
   * @param {boolean} hintUsed - If a hint was clicked
   * @returns {Object} Breakdown of points earned
   */
  processAnswer(isCorrect, timeRemaining, totalDuration, hintUsed) {
    this.roundsPlayed++;
    
    const breakdown = {
      base: 0,
      speedBonus: 0,
      hintBonus: 0,
      streakBonus: 0,
      multiplier: this.getMultiplier(),
      total: 0
    };

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      
      // Base score
      breakdown.base = 10;

      // Speed bonus: if answered within the first 25% of the total time duration
      const timeSpent = totalDuration - timeRemaining;
      if (timeSpent <= totalDuration * 0.25) {
        breakdown.speedBonus = 5;
      }

      // No Hint bonus
      if (!hintUsed) {
        breakdown.hintBonus = 5;
      }

      // Streak bonus: +20 for every 5 consecutive correct answers
      if (this.streak > 0 && this.streak % 5 === 0) {
        breakdown.streakBonus = 20;
      }

      // Calculate total with multiplier
      const sumPoints = breakdown.base + breakdown.speedBonus + breakdown.hintBonus + breakdown.streakBonus;
      breakdown.total = Math.round(sumPoints * breakdown.multiplier);
      
      this.score += breakdown.total;
    } else {
      this.streak = 0; // Reset streak on wrong answer
    }

    return breakdown;
  }

  getAccuracy() {
    if (this.roundsPlayed === 0) return 0;
    return Math.round((this.correctCount / this.roundsPlayed) * 100);
  }

  reset() {
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.roundsPlayed = 0;
  }
}
