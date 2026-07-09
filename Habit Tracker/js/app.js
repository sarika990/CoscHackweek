/**
 * Habit Tracker - Core Orchestrator
 * Binds page lifecycles, global state, forms submission, search/sort filters, modals, and achievements.
 */

import { $ } from './utils.js';
import { 
    getHabits, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    resetHabitProgress, 
    toggleHabitDate 
} from './storage.js';
import { renderCalendar } from './calendar.js';
import { calculateGlobalStats, renderCharts } from './statistics.js';
import { createHabitCardHTML, bindHabitCardActions } from './habits.js';
import { initTheme } from './theme.js';
import { showToast } from './notification.js';
import { exportData, importData } from './export.js';

// Global state variables
let activeFilter = 'all';
let searchQuery = '';
let currentSort = 'newest';

// Modals target state tracking
let pendingActionHabitId = null;

// Initialize Page
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEmojiPickers();
    bindFormSubmissions();
    bindGlobalControls();
    bindModals();
    renderApp();
});

/**
 * Main render orchestrator
 * Re-reads local storage, computes statistics, updates badges, filters & sorts, and draws cards.
 */
function renderApp() {
    const habits = getHabits();
    
    // 1. Calculate and update dashboard stats
    const stats = calculateGlobalStats(habits);
    updateDashboardUI(stats);

    // 2. Process list: Search, Filter, and Sort
    let processedHabits = [...habits];

    // Search query matching
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        processedHabits = processedHabits.filter(h => 
            h.name.toLowerCase().includes(query) || 
            h.category.toLowerCase().includes(query) ||
            (h.notes && h.notes.toLowerCase().includes(query))
        );
    }

    // Filters matching
    if (activeFilter === 'completed') {
        const todayStr = new Date().toISOString().slice(0, 10);
        processedHabits = processedHabits.filter(h => h.history && h.history[todayStr] === true);
    } else if (activeFilter === 'pending') {
        const todayStr = new Date().toISOString().slice(0, 10);
        processedHabits = processedHabits.filter(h => !h.history || !h.history[todayStr]);
    } else if (activeFilter === 'priority-high') {
        processedHabits = processedHabits.filter(h => h.priority === 'High');
    } else if (activeFilter.startsWith('cat-')) {
        const categoryMatch = activeFilter.replace('cat-', '').toLowerCase();
        processedHabits = processedHabits.filter(h => h.category.toLowerCase() === categoryMatch);
    }

    // Sorting matching
    if (currentSort === 'newest') {
        processedHabits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentSort === 'oldest') {
        processedHabits.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (currentSort === 'alphabetical') {
        processedHabits.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'highest-streak') {
        processedHabits.sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0));
    } else if (currentSort === 'highest-completion') {
        processedHabits.sort((a, b) => {
            const countA = Object.keys(a.history || {}).filter(k => a.history[k] === true).length;
            const countB = Object.keys(b.history || {}).filter(k => b.history[k] === true).length;
            return countB - countA;
        });
    }

    // 3. Render grid of cards
    const gridContainer = $('#habits-grid-container');
    gridContainer.innerHTML = '';

    if (processedHabits.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-habits-state">
                <span class="empty-state-icon">✨</span>
                <h3 class="empty-state-title">No habits found</h3>
                <p class="empty-state-desc">Try clearing your filters or create a new habit on the left menu!</p>
            </div>
        `;
    } else {
        processedHabits.forEach(habit => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = createHabitCardHTML(habit).trim();
            const cardEl = wrapper.firstChild;
            
            // Render the inner calendar
            const calendarContainer = cardEl.querySelector('.habit-calendar-wrapper');
            renderCalendar(habit, calendarContainer, () => {
                // Toggling completion in cell triggers re-render of stats & graphs
                showToast('Progress Saved', 'success');
                renderApp();
            });

            gridContainer.appendChild(cardEl);
        });
    }

    // 4. Update achievements panel
    updateAchievements(stats);

    // 5. Draw dynamic graphs
    const chartsContainer = $('#analytics-charts-wrapper');
    renderCharts(habits, chartsContainer);
}

/**
 * Set statistics values on the Hero Dashboard elements
 * @param {Object} stats 
 */
function updateDashboardUI(stats) {
    $('#stat-total-habits').innerText = stats.totalHabits;
    $('#stat-completed-today').innerText = stats.completedToday;
    $('#stat-completion-rate').innerText = `${stats.completionRate || 0}%`;
    $('#stat-current-streak').innerText = `${stats.currentStreak}d`;
}

/**
 * Handle achievement badge locks and unlocks
 * @param {Object} stats 
 */
function updateAchievements(stats) {
    const badgeFirst = $('#badge-first');
    const badgeStreak3 = $('#badge-streak-3');
    const badgeStreak7 = $('#badge-streak-7');
    const badgeStreak15 = $('#badge-streak-15');
    const badgeCompletions100 = $('#badge-completions-100');

    // First completion
    if (stats.totalCompletedDays >= 1) {
        badgeFirst.classList.add('unlocked');
    } else {
        badgeFirst.classList.remove('unlocked');
    }

    // Streaks
    if (stats.bestStreak >= 3) {
        badgeStreak3.classList.add('unlocked');
    } else {
        badgeStreak3.classList.remove('unlocked');
    }

    if (stats.bestStreak >= 7) {
        badgeStreak7.classList.add('unlocked');
    } else {
        badgeStreak7.classList.remove('unlocked');
    }

    if (stats.bestStreak >= 15) {
        badgeStreak15.classList.add('unlocked');
    } else {
        badgeStreak15.classList.remove('unlocked');
    }

    // Logs threshold
    if (stats.totalCompletedDays >= 100) {
        badgeCompletions100.classList.add('unlocked');
    } else {
        badgeCompletions100.classList.remove('unlocked');
    }
}

/**
 * Emoji picker click and state bindings
 */
function setupEmojiPickers() {
    const trigger = $('#form-emoji-trigger');
    const popover = $('#form-emoji-popover');
    const hiddenVal = $('#habit-emoji-val');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.style.display = popover.style.display === 'none' ? 'grid' : 'none';
    });

    popover.addEventListener('click', (e) => {
        const item = e.target.closest('.emoji-popover-item');
        if (item) {
            const emoji = item.innerText;
            trigger.innerText = emoji;
            hiddenVal.value = emoji;
            popover.style.display = 'none';
        }
    });

    // Close on click outside
    document.addEventListener('click', () => {
        popover.style.display = 'none';
        $('#edit-emoji-popover').style.display = 'none';
    });

    // Setup Edit emoji picker as well
    const editTrigger = $('#edit-emoji-trigger');
    const editPopover = $('#edit-emoji-popover');
    const editHiddenVal = $('#edit-emoji-val');

    editTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        editPopover.style.display = editPopover.style.display === 'none' ? 'grid' : 'none';
    });

    editPopover.addEventListener('click', (e) => {
        const item = e.target.closest('.emoji-popover-item');
        if (item) {
            const emoji = item.innerText;
            editTrigger.innerText = emoji;
            editHiddenVal.value = emoji;
            editPopover.style.display = 'none';
        }
    });
}

/**
 * Attach form submit logic for creation and edits
 */
function bindFormSubmissions() {
    // 1. Create Habit Submit
    const createForm = $('#create-habit-form');
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = $('#habit-name').value.trim();
        const category = $('#habit-category').value;
        const priority = $('#habit-priority').value;
        const emoji = $('#habit-emoji-val').value;
        const color = $('#habit-color').value;
        const reminderTime = $('#habit-reminder').value;
        const notes = $('#habit-notes').value.trim();

        // Validate
        if (!name) {
            showToast('Habit name cannot be empty', 'error');
            return;
        }

        // Duplicate name checking
        const existing = getHabits();
        if (existing.some(h => h.name.toLowerCase() === name.toLowerCase())) {
            showToast('A habit with this name already exists', 'error');
            return;
        }

        addHabit({
            name,
            category,
            priority,
            emoji,
            color,
            reminderTime,
            notes
        });

        showToast('Habit Added Successfully', 'success');
        createForm.reset();
        $('#form-emoji-trigger').innerText = '💻';
        $('#habit-emoji-val').value = '💻';
        
        renderApp();
    });

    // 2. Edit Habit Submit
    const editForm = $('#edit-habit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = $('#edit-habit-id').value;
        const name = $('#edit-habit-name').value.trim();
        const category = $('#edit-habit-category').value;
        const priority = $('#edit-habit-priority').value;
        const emoji = $('#edit-emoji-val').value;
        const color = $('#edit-habit-color').value;
        const reminderTime = $('#edit-habit-reminder').value;
        const notes = $('#edit-habit-notes').value.trim();

        if (!name) {
            showToast('Habit name cannot be empty', 'error');
            return;
        }

        // Duplicate checking (excluding current habit)
        const existing = getHabits();
        if (existing.some(h => h.name.toLowerCase() === name.toLowerCase() && h.id !== id)) {
            showToast('A habit with this name already exists', 'error');
            return;
        }

        updateHabit(id, {
            name,
            category,
            priority,
            emoji,
            color,
            reminderTime,
            notes
        });

        showToast('Habit Updated Successfully', 'success');
        closeModal($('#edit-modal'));
        renderApp();
    });
}

/**
 * Handle Sorting, Filtering, Searching, and Backup buttons
 */
function bindGlobalControls() {
    // 1. Search Bar typing
    const searchBar = $('#search-bar');
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderApp();
    });

    // 2. Filters click listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderApp();
        });
    });

    // 3. Sort selection dropdown change
    const sortSelect = $('#sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderApp();
    });

    // 4. Backup actions
    $('#export-btn').addEventListener('click', () => exportData());
    
    const importTriggerBtn = $('#import-trigger-btn');
    const importFileInput = $('#import-file-input');
    
    importTriggerBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importData(file, () => {
                // Clear input
                importFileInput.value = '';
                renderApp();
            });
        }
    });

    // Delegated click actions for habit cards (Delete, Edit, Reset, Duplicate)
    const cardsGrid = $('#habits-grid-container');
    bindHabitCardActions(cardsGrid, {
        onRefresh: () => renderApp(),
        onConfirmDelete: (id) => {
            const habits = getHabits();
            const habit = habits.find(h => h.id === id);
            if (habit) {
                pendingActionHabitId = id;
                $('#delete-habit-display-name').innerText = habit.name;
                openModal($('#delete-modal'));
            }
        },
        onConfirmReset: (id) => {
            const habits = getHabits();
            const habit = habits.find(h => h.id === id);
            if (habit) {
                pendingActionHabitId = id;
                $('#reset-habit-display-name').innerText = habit.name;
                openModal($('#reset-modal'));
            }
        },
        onEdit: (id) => {
            const habits = getHabits();
            const habit = habits.find(h => h.id === id);
            if (habit) {
                // Populate Edit fields
                $('#edit-habit-id').value = habit.id;
                $('#edit-habit-name').value = habit.name;
                $('#edit-habit-category').value = habit.category;
                $('#edit-habit-priority').value = habit.priority;
                $('#edit-emoji-trigger').innerText = habit.emoji;
                $('#edit-emoji-val').value = habit.emoji;
                $('#edit-habit-color').value = habit.color;
                $('#edit-habit-reminder').value = habit.reminderTime || '';
                $('#edit-habit-notes').value = habit.notes || '';
                
                openModal($('#edit-modal'));
            }
        }
    });
}

/**
 * Connect the confirmation and close triggers on dialog modals
 */
function bindModals() {
    // Edit Modal close trigger
    $('#close-edit-modal').addEventListener('click', () => closeModal($('#edit-modal')));
    $('#cancel-edit-btn').addEventListener('click', () => closeModal($('#edit-modal')));

    // Delete Modal close/confirm trigger
    $('#close-delete-modal').addEventListener('click', () => closeModal($('#delete-modal')));
    $('#cancel-delete-btn').addEventListener('click', () => closeModal($('#delete-modal')));
    $('#confirm-delete-btn').addEventListener('click', () => {
        if (pendingActionHabitId) {
            deleteHabit(pendingActionHabitId);
            showToast('Habit Deleted Successfully', 'warning');
            closeModal($('#delete-modal'));
            pendingActionHabitId = null;
            renderApp();
        }
    });

    // Reset Modal close/confirm trigger
    $('#close-reset-modal').addEventListener('click', () => closeModal($('#reset-modal')));
    $('#cancel-reset-btn').addEventListener('click', () => closeModal($('#reset-modal')));
    $('#confirm-reset-btn').addEventListener('click', () => {
        if (pendingActionHabitId) {
            resetHabitProgress(pendingActionHabitId);
            showToast('Progress Reset Successfully', 'info');
            closeModal($('#reset-modal'));
            pendingActionHabitId = null;
            renderApp();
        }
    });

    // Escape key closes active modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay.active');
            openModals.forEach(m => closeModal(m));
        }
    });
}

function openModal(modalEl) {
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    
    // Focus first input or cancel button for accessibility
    const firstInput = modalEl.querySelector('input, select, textarea, button:not(.modal-close)');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal(modalEl) {
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
}
