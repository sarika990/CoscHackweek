/**
 * Statistics Manager
 * Updates global statistics and renders visual charts using Chart.js.
 */
import { StorageManager } from './storage.js';

export class StatisticsManager {
  /**
   * Updates global stats after a game is finished.
   * @param {Object} sessionStats - Stats from the completed session
   * @param {number} sessionStats.score - Final game score
   * @param {number} sessionStats.accuracy - Final accuracy percent (0-100)
   * @param {string} sessionStats.difficulty - 'Easy' | 'Medium' | 'Hard' | 'Expert'
   * @param {number} sessionStats.hintsUsed - Total hints clicked in game
   * @param {number} sessionStats.longestStreak - Highest streak in this game
   * @param {number} sessionStats.fastestAnswer - Shortest correct response time (seconds)
   * @param {Object} sessionStats.categories - Detailed stats per category: { image: { played, correct }, ... }
   */
  static recordGame(sessionStats) {
    const stats = StorageManager.getStats();

    stats.gamesPlayed++;
    
    // Define a "Win" as getting 60% or higher accuracy
    if (sessionStats.accuracy >= 60) {
      stats.wins++;
    } else {
      stats.losses++;
    }

    stats.totalScore += sessionStats.score;
    stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
    stats.hintsUsed += sessionStats.hintsUsed;

    // Track records
    if (sessionStats.longestStreak > stats.longestStreak) {
      stats.longestStreak = sessionStats.longestStreak;
    }
    if (sessionStats.fastestAnswer < stats.fastestAnswer) {
      stats.fastestAnswer = sessionStats.fastestAnswer;
    }

    // Merge category stats
    for (const cat in sessionStats.categories) {
      if (stats.categoryStats[cat]) {
        stats.categoryStats[cat].played += sessionStats.categories[cat].played;
        stats.categoryStats[cat].correct += sessionStats.categories[cat].correct;
      }
    }

    // Merge difficulty stats
    if (stats.difficultyStats[sessionStats.difficulty] !== undefined) {
      stats.difficultyStats[sessionStats.difficulty]++;
    } else {
      stats.difficultyStats[sessionStats.difficulty] = 1;
    }

    StorageManager.saveStats(stats);
    return stats;
  }

  static reset() {
    const defaults = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      totalScore: 0,
      averageScore: 0,
      longestStreak: 0,
      fastestAnswer: 999,
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
    StorageManager.saveStats(defaults);
    return defaults;
  }

  /**
   * Renders visual charts using Chart.js.
   * @param {Object} canvases - Canvas element references
   * @param {HTMLCanvasElement} canvases.categoryRadar - Radar canvas element
   * @param {HTMLCanvasElement} canvases.difficultyBar - Bar canvas element
   * @param {HTMLCanvasElement} canvases.performancePie - Pie/Doughnut canvas element
   */
  static renderCharts(canvases) {
    const stats = StorageManager.getStats();

    // Setup global fonts for Chart.js
    if (window.Chart) {
      Chart.defaults.color = '#fff';
      Chart.defaults.font.family = "'Rajdhani', sans-serif";
      Chart.defaults.font.size = 13;
    } else {
      console.warn("Chart.js library is not loaded.");
      return;
    }

    // 1. Category Performance Radar Chart
    if (canvases.categoryRadar) {
      const labels = ['Image', 'Text', 'Code', 'Voice', 'Artwork'];
      const correctData = [
        stats.categoryStats.image.correct,
        stats.categoryStats.text.correct,
        stats.categoryStats.code.correct,
        stats.categoryStats.voice.correct,
        stats.categoryStats.artwork.correct
      ];
      const playedData = [
        stats.categoryStats.image.played,
        stats.categoryStats.text.played,
        stats.categoryStats.code.played,
        stats.categoryStats.voice.played,
        stats.categoryStats.artwork.played
      ];

      // Prevent division by zero
      const accuracyPercentages = labels.map((_, idx) => {
        if (playedData[idx] === 0) return 0;
        return Math.round((correctData[idx] / playedData[idx]) * 100);
      });

      if (canvases.categoryRadar._chartInstance) {
        canvases.categoryRadar._chartInstance.destroy();
      }

      canvases.categoryRadar._chartInstance = new Chart(canvases.categoryRadar, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Accuracy %',
              data: accuracyPercentages,
              backgroundColor: 'rgba(0, 242, 254, 0.2)',
              borderColor: '#00f2fe',
              pointBackgroundColor: '#00f2fe',
              pointBorderColor: '#fff',
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              pointLabels: { font: { size: 14, weight: 'bold' } },
              suggestedMin: 0,
              suggestedMax: 100
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // 2. Difficulty Distribution Bar Chart
    if (canvases.difficultyBar) {
      const difficultyLabels = ['Easy', 'Medium', 'Hard', 'Expert'];
      const difficultyValues = [
        stats.difficultyStats.Easy || 0,
        stats.difficultyStats.Medium || 0,
        stats.difficultyStats.Hard || 0,
        stats.difficultyStats.Expert || 0
      ];

      if (canvases.difficultyBar._chartInstance) {
        canvases.difficultyBar._chartInstance.destroy();
      }

      canvases.difficultyBar._chartInstance = new Chart(canvases.difficultyBar, {
        type: 'bar',
        data: {
          labels: difficultyLabels,
          datasets: [{
            data: difficultyValues,
            backgroundColor: [
              'rgba(0, 255, 204, 0.5)',
              'rgba(0, 242, 254, 0.5)',
              'rgba(182, 33, 254, 0.5)',
              'rgba(254, 1, 154, 0.5)'
            ],
            borderColor: [
              '#00ffcc',
              '#00f2fe',
              '#b621fe',
              '#fe019a'
            ],
            borderWidth: 1.5
          }]
        },
        options: {
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              beginAtZero: true,
              ticks: { precision: 0 }
            },
            x: {
              grid: { display: false }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // 3. Category Play Proportions Doughnut/Pie Chart
    if (canvases.performancePie) {
      const labels = ['Image', 'Text', 'Code', 'Voice', 'Artwork'];
      const playedValues = [
        stats.categoryStats.image.played,
        stats.categoryStats.text.played,
        stats.categoryStats.code.played,
        stats.categoryStats.voice.played,
        stats.categoryStats.artwork.played
      ];

      const hasData = playedValues.some(v => v > 0);
      const datasetData = hasData ? playedValues : [1, 1, 1, 1, 1]; // fallback visual

      if (canvases.performancePie._chartInstance) {
        canvases.performancePie._chartInstance.destroy();
      }

      canvases.performancePie._chartInstance = new Chart(canvases.performancePie, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: datasetData,
            backgroundColor: [
              'rgba(0, 242, 254, 0.6)',
              'rgba(182, 33, 254, 0.6)',
              'rgba(254, 1, 154, 0.6)',
              'rgba(0, 255, 204, 0.6)',
              'rgba(255, 170, 0, 0.6)'
            ],
            borderColor: '#0b0b1e',
            borderWidth: 2
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            }
          },
          cutout: '65%'
        }
      });
    }
  }
}
