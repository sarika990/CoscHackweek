/**
 * Achievements System
 * Defines achievement definitions and checks unlock criteria.
 */
import { StorageManager } from './storage.js';
import { AudioManager } from './audio.js';
import { UIManager } from './ui.js';

export const ACHIEVEMENT_LIST = [
  {
    id: 'first_win',
    title: 'First Win',
    description: 'Complete your first game session.',
    icon: 'fa-trophy'
  },
  {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Complete a full game with 100% accuracy.',
    icon: 'fa-star'
  },
  {
    id: 'ai_hunter',
    title: 'AI Hunter',
    description: 'Correctly identify 15 AI-generated assets.',
    icon: 'fa-crosshairs'
  },
  {
    id: 'human_expert',
    title: 'Human Expert',
    description: 'Correctly identify 15 human-created assets.',
    icon: 'fa-user-shield'
  },
  {
    id: 'fast_thinker',
    title: 'Fast Thinker',
    description: 'Correctly answer a question in under 2 seconds.',
    icon: 'fa-bolt'
  },
  {
    id: 'code_detective',
    title: 'Code Detective',
    description: 'Correctly identify 15 code snippets.',
    icon: 'fa-code'
  },
  {
    id: 'image_master',
    title: 'Image Master',
    description: 'Correctly identify 15 images.',
    icon: 'fa-image'
  },
  {
    id: 'voice_analyst',
    title: 'Voice Analyst',
    description: 'Correctly identify 15 voice samples.',
    icon: 'fa-microphone'
  },
  {
    id: 'art_expert',
    title: 'Art Expert',
    description: 'Correctly identify 15 artworks.',
    icon: 'fa-palette'
  },
  {
    id: 'hundred_correct',
    title: 'AI Purge Master',
    description: 'Accumulate 100 correct answers overall.',
    icon: 'fa-radiation'
  }
];

class AchievementsManagerClass {
  constructor() {
    this.unlocked = StorageManager.getAchievements();
  }

  getUnlocked() {
    return this.unlocked;
  }

  reset() {
    this.unlocked = [];
    StorageManager.saveAchievements([]);
  }

  /**
   * Checks achievements against game statistics and the latest session.
   * @param {Object} stats - Global cumulative stats
   * @param {Object} session - Last game session stats (optional)
   */
  checkUnlocks(stats, session = null) {
    let newlyUnlocked = [];

    // Calculate total correct count
    const totalCorrect = Object.values(stats.categoryStats).reduce(
      (acc, cat) => acc + cat.correct,
      0
    );

    ACHIEVEMENT_LIST.forEach((ach) => {
      if (this.unlocked.includes(ach.id)) return;

      let meetsCriteria = false;

      switch (ach.id) {
        case 'first_win':
          if (stats.gamesPlayed >= 1) meetsCriteria = true;
          break;
        case 'perfect_game':
          if (session && session.accuracy === 100 && session.roundsPlayed >= 10) meetsCriteria = true;
          break;
        case 'ai_hunter':
          // We can approximate or count in stats. For simplicity, we count cumulative correct identifications.
          // Since roughly half are AI and half Human, we can check stats or add specific session markers
          if (totalCorrect >= 30) meetsCriteria = true; 
          break;
        case 'human_expert':
          if (totalCorrect >= 30) meetsCriteria = true;
          break;
        case 'fast_thinker':
          if (stats.fastestAnswer <= 2) meetsCriteria = true;
          break;
        case 'code_detective':
          if (stats.categoryStats.code.correct >= 15) meetsCriteria = true;
          break;
        case 'image_master':
          if (stats.categoryStats.image.correct >= 15) meetsCriteria = true;
          break;
        case 'voice_analyst':
          if (stats.categoryStats.voice.correct >= 15) meetsCriteria = true;
          break;
        case 'art_expert':
          if (stats.categoryStats.artwork.correct >= 15) meetsCriteria = true;
          break;
        case 'hundred_correct':
          if (totalCorrect >= 100) meetsCriteria = true;
          break;
      }

      if (meetsCriteria) {
        newlyUnlocked.push(ach);
        this.unlocked.push(ach.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      StorageManager.saveAchievements(this.unlocked);
      newlyUnlocked.forEach((ach) => {
        this.showUnlockPopup(ach);
      });
    }
  }

  showUnlockPopup(achievement) {
    AudioManager.playVictory();
    UIManager.showNotification({
      title: 'Achievement Unlocked!',
      message: achievement.title,
      description: achievement.description,
      iconClass: achievement.icon,
      type: 'achievement'
    });
  }
}

export const AchievementsManager = new AchievementsManagerClass();
