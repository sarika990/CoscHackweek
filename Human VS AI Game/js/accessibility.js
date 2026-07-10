/**
 * Accessibility Manager
 * Manages keyboard navigation outlines, high contrast modes, reduced motion media queries, and ARIA announcements.
 */
import { StorageManager } from './storage.js';

class AccessibilityManagerClass {
  constructor() {
    this.highContrast = false;
    this.reducedMotion = false;
    this.announcer = null;
  }

  init() {
    this.createAnnouncer();
    this.setupKeyboardTracking();
    this.setupMediaQueries();
    
    // Load initial settings
    const settings = StorageManager.getSettings();
    if (settings.theme === 'high-contrast') {
      this.toggleHighContrast(true);
    }
  }

  createAnnouncer() {
    this.announcer = document.createElement('div');
    this.announcer.id = 'sr-announcer';
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.style.position = 'absolute';
    this.announcer.style.width = '1px';
    this.announcer.style.height = '1px';
    this.announcer.style.padding = '0';
    this.announcer.style.margin = '-1px';
    this.announcer.style.overflow = 'hidden';
    this.announcer.style.clip = 'rect(0, 0, 0, 0)';
    this.announcer.style.border = '0';
    document.body.appendChild(this.announcer);
  }

  /**
   * Announces a message to screen readers.
   * @param {string} message - Text announcement
   */
  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = '';
      setTimeout(() => {
        this.announcer.textContent = message;
      }, 50);
    }
  }

  setupKeyboardTracking() {
    // Only display outline focus rings when the user navigates with Tab
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    });

    window.addEventListener('mousedown', () => {
      document.body.classList.remove('user-is-tabbing');
    });
  }

  setupMediaQueries() {
    // Check system preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;
    this.applyMotionSettings();

    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.applyMotionSettings();
    });
  }

  applyMotionSettings() {
    if (this.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  toggleHighContrast(enabled) {
    this.highContrast = enabled;
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }
}

export const AccessibilityManager = new AccessibilityManagerClass();
