/**
 * Reusable Circular Countdown Timer Class
 */
import { AudioManager } from './audio.js';

export class Timer {
  /**
   * @param {number} duration - Seconds to count down
   * @param {Object} elements - DOM elements for rendering
   * @param {HTMLElement} elements.text - Element showing text numbers
   * @param {SVGPathElement|SVGCircleElement} elements.circle - SVG element for circular progress border
   * @param {Function} onTick - Callback for each tick (secondsRemaining)
   * @param {Function} onTimeout - Callback when timer finishes
   */
  constructor(duration, elements, onTick = null, onTimeout = null) {
    this.duration = duration;
    this.remaining = duration;
    this.elements = elements;
    this.onTick = onTick;
    this.onTimeout = onTimeout;
    this.timerId = null;
    this.isRunning = false;

    // Set circle circumference
    if (this.elements.circle) {
      const radius = parseFloat(this.elements.circle.getAttribute('r')) || 26;
      this.circumference = 2 * Math.PI * radius;
      this.elements.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      this.elements.circle.style.strokeDashoffset = 0;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.updateUI();

    this.timerId = setInterval(() => {
      this.remaining--;
      
      // Warning sound at 5s or less
      if (this.remaining <= 5 && this.remaining > 0) {
        AudioManager.playTimerTick(true);
      } else if (this.remaining > 5) {
        AudioManager.playTimerTick(false);
      }

      this.updateUI();

      if (this.onTick) {
        this.onTick(this.remaining);
      }

      if (this.remaining <= 0) {
        this.stop();
        if (this.onTimeout) {
          this.onTimeout();
        }
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  resume() {
    if (this.remaining > 0) {
      this.start();
    }
  }

  stop() {
    this.pause();
    this.remaining = 0;
    this.updateUI();
  }

  reset(newDuration = null) {
    this.stop();
    if (newDuration !== null) {
      this.duration = newDuration;
    }
    this.remaining = this.duration;
    this.updateUI();
  }

  updateUI() {
    // Update numerical text
    if (this.elements.text) {
      this.elements.text.textContent = Math.max(0, this.remaining);
    }

    // Update circular progress bar
    if (this.elements.circle) {
      const offset = this.circumference - (this.remaining / this.duration) * this.circumference;
      this.elements.circle.style.strokeDashoffset = offset;

      // Add critical pulsing animation if near the end
      if (this.remaining <= 5) {
        this.elements.circle.classList.add('critical');
      } else {
        this.elements.circle.classList.remove('critical');
      }
    }
  }
}
