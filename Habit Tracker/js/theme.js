/**
 * Habit Tracker - Theme Manager
 * Manages Dark and Light theme states and persists selection.
 */

import { getTheme, saveTheme } from './storage.js';
import { showToast } from './notification.js';

/**
 * Initializes and binds the theme toggle functionality.
 */
export function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = getTheme();
    
    // Apply theme on load
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            saveTheme(nextTheme);
            showToast(`${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)} Mode Enabled`, 'info');
        });
    }
}

/**
 * Apply selected theme to document element
 * @param {string} theme 'dark' | 'light'
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}
