/**
 * Main Application Bootstrapper
 * Initializes systems, handles user audio interaction gestures, and mounts the SPA router.
 */
import { AudioManager } from './audio.js';
import { AnimationsManager } from './animations.js';
import { AccessibilityManager } from './accessibility.js';
import { UIManager } from './ui.js';
import { Router } from './router.js';

const initApp = () => {
  // 1. Initialize UI components container
  UIManager.init();

  // 2. Initialize Accessibility features
  AccessibilityManager.init();

  // 3. Mount dynamic particles background
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    AnimationsManager.initBackground(bgCanvas);
  }

  // 4. Initialize Router
  const viewport = document.getElementById('app-viewport');
  Router.init(viewport);

  // 5. Initialize Web Audio API on first user interaction (browser security rule)
  const initializeAudioOnGesture = () => {
    AudioManager.ensureContext();
    // Remove listeners once audio is booted
    document.removeEventListener('click', initializeAudioOnGesture);
    document.removeEventListener('keydown', initializeAudioOnGesture);
  };
  document.addEventListener('click', initializeAudioOnGesture);
  document.addEventListener('keydown', initializeAudioOnGesture);

  // 6. Generic click sounds on menu triggers and links
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, [onclick], input[type="checkbox"]');
    if (target && !target.classList.contains('play-btn') && !target.classList.contains('modal-close-icon')) {
      AudioManager.playClick();
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
