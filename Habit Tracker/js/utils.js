/**
 * Habit Tracker - Utilities
 * Provides DOM helpers, date manipulation, and string formatting utilities.
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Escape HTML to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateUUID() {
    return 'habit-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get date string formatted as YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * Get range of past 30 days including today (ordered oldest to newest)
 * @returns {string[]} Date strings in YYYY-MM-DD format
 */
export function getLast30Days() {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(formatDate(d));
    }
    return dates;
}

/**
 * Check if a date string is today
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export function isToday(dateStr) {
    return formatDate(new Date()) === dateStr;
}

/**
 * Check if date string is in the future
 * @param {string} dateStr YYYY-MM-DD
 * @returns {boolean}
 */
export function isFutureDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr + 'T00:00:00');
    return checkDate > today;
}

/**
 * Parse date string securely
 * @param {string} dateStr YYYY-MM-DD
 * @returns {Date}
 */
export function parseDateString(dateStr) {
    return new Date(dateStr + 'T00:00:00');
}
