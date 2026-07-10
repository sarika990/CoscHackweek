/**
 * UIManager
 * Manages reusable, interactive DOM elements such as Modals, Toast Notifications, and Volume controllers.
 */
import { AnimationsManager } from './animations.js';
import { AudioManager } from './audio.js';

class UIManagerClass {
  constructor() {
    this.modalContainer = null;
    this.notificationContainer = null;
  }

  init() {
    this.createNotificationContainer();
  }

  createNotificationContainer() {
    this.notificationContainer = document.getElementById('notification-overlay');
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'notification-overlay';
      this.notificationContainer.className = 'notification-overlay';
      document.body.appendChild(this.notificationContainer);
    }
  }

  /**
   * Displays a glassmorphic toast notification.
   * @param {Object} options - Notification options
   * @param {string} options.title - Header text
   * @param {string} options.message - Secondary bold text
   * @param {string} options.description - Detailed text description
   * @param {string} options.iconClass - FontAwesome icon class (e.g. 'fa-trophy')
   * @param {string} options.type - 'achievement' | 'success' | 'info' | 'error'
   * @param {number} options.duration - Expiry in milliseconds (default 4000)
   */
  showNotification(options = {}) {
    this.createNotificationContainer();

    const title = options.title || 'Notification';
    const message = options.message || '';
    const description = options.description || '';
    const iconClass = options.iconClass || 'fa-bell';
    const type = options.type || 'info';
    const duration = options.duration || 4000;

    const card = document.createElement('div');
    card.className = `notification-card glass-panel slide-in-right ${type}`;
    card.setAttribute('role', 'alert');

    card.innerHTML = `
      <div class="notification-icon-wrapper">
        <i class="fa ${iconClass}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        ${message ? `<div class="notification-msg">${message}</div>` : ''}
        ${description ? `<div class="notification-desc">${description}</div>` : ''}
      </div>
      <button class="notification-close-btn" aria-label="Close Notification">&times;</button>
    `;

    // Hook up dismiss button
    const closeBtn = card.querySelector('.notification-close-btn');
    closeBtn.addEventListener('click', () => {
      card.classList.replace('slide-in-right', 'slide-out-right');
      setTimeout(() => card.remove(), 400);
    });

    this.notificationContainer.appendChild(card);

    // Auto remove
    setTimeout(() => {
      if (card.parentNode) {
        card.classList.replace('slide-in-right', 'slide-out-right');
        setTimeout(() => card.remove(), 400);
      }
    }, duration);
  }

  /**
   * Displays a modal pop-up block.
   * @param {Object} options - Modal settings
   * @param {string} options.title - Header text
   * @param {string} options.body - HTML/text content
   * @param {Array} options.buttons - Array of button definitions
   * @param {string} options.buttons[].text - Label of button
   * @param {string} options.buttons[].type - 'primary' | 'secondary' | 'danger'
   * @param {Function} options.buttons[].onClick - Callback resolving on click
   */
  showModal(options = {}) {
    return new Promise((resolve) => {
      // Remove any existing modal first
      const existing = document.getElementById('modal-overlay');
      if (existing) existing.remove();

      const modalOverlay = document.createElement('div');
      modalOverlay.id = 'modal-overlay';
      modalOverlay.className = 'modal-overlay fade-in';
      modalOverlay.setAttribute('role', 'dialog');
      modalOverlay.setAttribute('aria-modal', 'true');

      const title = options.title || 'Alert';
      const body = options.body || '';
      const buttons = options.buttons || [{ text: 'OK', type: 'primary', onClick: () => {} }];

      const modalBox = document.createElement('div');
      modalBox.className = 'modal-box glass-panel scale-up';
      
      let buttonsHtml = '';
      buttons.forEach((btn, idx) => {
        buttonsHtml += `<button class="btn btn-${btn.type || 'primary'}" data-index="${idx}">${btn.text}</button>`;
      });

      modalBox.innerHTML = `
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close-icon" aria-label="Close Dialog">&times;</button>
        </div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">${buttonsHtml}</div>
      `;

      modalOverlay.appendChild(modalBox);
      document.body.appendChild(modalOverlay);

      // Event listener helpers
      const closeModal = () => {
        modalOverlay.classList.replace('fade-in', 'fade-out');
        modalBox.classList.replace('scale-up', 'scale-down');
        setTimeout(() => {
          modalOverlay.remove();
          resolve(null);
        }, 300);
      };

      // Close icon
      modalOverlay.querySelector('.modal-close-icon').addEventListener('click', () => {
        AudioManager.playClick();
        closeModal();
      });

      // Overlay click to close
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });

      // Buttons click
      modalBox.querySelectorAll('.modal-footer button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          AudioManager.playClick();
          if (StorageManager.getSettings().animationsEnabled) {
            AnimationsManager.applyRipple(e, btn);
          }
          const idx = parseInt(btn.getAttribute('data-index'));
          const btnConfig = buttons[idx];
          
          modalOverlay.classList.replace('fade-in', 'fade-out');
          modalBox.classList.replace('scale-up', 'scale-down');
          setTimeout(() => {
            modalOverlay.remove();
            if (btnConfig.onClick) btnConfig.onClick();
            resolve(btnConfig.text);
          }, 300);
        });
      });
    });
  }
}

export const UIManager = new UIManagerClass();
