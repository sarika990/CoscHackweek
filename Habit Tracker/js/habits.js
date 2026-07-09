/**
 * Habit Tracker - Habits Component
 * Generates card templates and handles form creation and card-level event mappings.
 */

import { escapeHTML } from './utils.js';
import { renderCalendar } from './calendar.js';
import { deleteHabit, duplicateHabit, resetHabitProgress } from './storage.js';
import { showToast } from './notification.js';

/**
 * Creates the HTML block for a habit card
 * @param {Object} habit 
 * @returns {string} HTML string
 */
export function createHabitCardHTML(habit) {
    const totalCompletions = Object.keys(habit.history || {}).filter(k => habit.history[k] === true).length;
    const progressPct = habit.completionRate || 0;
    
    // Circumference calculation for r=24 is 2 * PI * 24 = 150.8
    const circumference = 150.8;
    const strokeDashoffset = circumference - (progressPct / 100) * circumference;

    const priorityClass = `priority-${habit.priority.toLowerCase()}`;
    const categoryClass = `category-${habit.category.toLowerCase().replace(/\s+/g, '-')}`;

    return `
        <div class="habit-card" data-id="${habit.id}" style="--accent-color: ${habit.color}">
            <div class="habit-card-glow"></div>
            <div class="habit-card-header">
                <div class="habit-info-main">
                    <span class="habit-emoji">${escapeHTML(habit.emoji)}</span>
                    <div class="habit-title-block">
                        <h3 class="habit-name">${escapeHTML(habit.name)}</h3>
                        <div class="habit-badges">
                            <span class="badge category-badge ${categoryClass}">${escapeHTML(habit.category)}</span>
                            <span class="badge priority-badge ${priorityClass}">${escapeHTML(habit.priority)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="habit-progress-container">
                    <svg class="progress-ring" width="60" height="60" aria-label="Completion: ${progressPct}%">
                        <circle class="progress-ring__background" stroke-width="4" fill="transparent" r="24" cx="30" cy="30" />
                        <circle class="progress-ring__circle" stroke="${habit.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-width="4" stroke-linecap="round" fill="transparent" r="24" cx="30" cy="30" />
                    </svg>
                    <span class="progress-pct-label">${progressPct}%</span>
                </div>
            </div>

            <div class="habit-card-stats">
                <div class="card-stat-item">
                    <span class="stat-lbl">Completed</span>
                    <span class="stat-val count-up">${totalCompletions} days</span>
                </div>
                <div class="card-stat-item">
                    <span class="stat-lbl">Streak</span>
                    <span class="stat-val count-up"><i class="fas fa-fire streak-icon"></i> ${habit.currentStreak}d</span>
                </div>
                <div class="card-stat-item">
                    <span class="stat-lbl">Best</span>
                    <span class="stat-val count-up"><i class="fas fa-crown crown-icon"></i> ${habit.bestStreak}d</span>
                </div>
            </div>

            <div class="habit-notes-preview">
                ${habit.notes ? `<p class="notes-text"><i class="far fa-sticky-note"></i> ${escapeHTML(habit.notes)}</p>` : ''}
                ${habit.reminderTime ? `<p class="reminder-text"><i class="far fa-bell"></i> Reminder: ${escapeHTML(habit.reminderTime)}</p>` : ''}
            </div>

            <div class="habit-calendar-wrapper" id="calendar-${habit.id}">
                <!-- Rendered dynamically by calendar.js -->
            </div>

            <div class="habit-card-actions">
                <button class="action-btn btn-duplicate" data-action="duplicate" title="Duplicate Habit" aria-label="Duplicate Habit">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn btn-reset" data-action="reset" title="Reset Progress" aria-label="Reset Progress">
                    <i class="fas fa-redo-alt"></i>
                </button>
                <button class="action-btn btn-edit" data-action="edit" title="Edit Habit" aria-label="Edit Habit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" data-action="delete" title="Delete Habit" aria-label="Delete Habit">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Bind event actions inside the habit cards container (delegated)
 * @param {HTMLElement} container 
 * @param {Object} callbacks - functions: { onRefresh, onEdit }
 */
export function bindHabitCardActions(container, callbacks) {
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const card = btn.closest('.habit-card');
        const habitId = card.getAttribute('data-id');
        const action = btn.getAttribute('data-action');

        if (action === 'delete') {
            callbacks.onConfirmDelete(habitId);
        } else if (action === 'reset') {
            callbacks.onConfirmReset(habitId);
        } else if (action === 'duplicate') {
            const clone = duplicateHabit(habitId);
            if (clone) {
                showToast(`Habit Duplicated as ${clone.name}`, 'success');
                callbacks.onRefresh();
            }
        } else if (action === 'edit') {
            callbacks.onEdit(habitId);
        }
    });
}
