/**
 * Habit Tracker - Storage Utility
 * Manages saving, loading, and initial seeding of habits to LocalStorage.
 */

import { formatDate, generateUUID } from './utils.js';
import { calculateStreaks } from './streak.js';

const HABITS_KEY = 'habit_tracker_habits';
const THEME_KEY = 'habit_tracker_theme';

// Seed some beautiful realistic demo data on first load
function getDemoHabits() {
    const today = new Date();
    
    // Create dates going back 10 days
    const getPastDateStr = (daysAgo) => {
        const d = new Date();
        d.setDate(today.getDate() - daysAgo);
        return formatDate(d);
    };

    const codingHistory = {};
    const fitnessHistory = {};
    const meditationHistory = {};

    // Code every day except 3 days ago
    for (let i = 0; i < 15; i++) {
        if (i !== 3) {
            codingHistory[getPastDateStr(i)] = true;
        }
    }
    // Workout history (completed 4, 3, 2, 1, 0 days ago)
    for (let i = 0; i <= 4; i++) {
        fitnessHistory[getPastDateStr(i)] = true;
    }
    // Meditation history (completed 8, 7, 6, 5, 2, 1 days ago)
    [1, 2, 5, 6, 7, 8].forEach(i => {
        meditationHistory[getPastDateStr(i)] = true;
    });

    const codingHabitId = generateUUID();
    const fitnessHabitId = generateUUID();
    const meditationHabitId = generateUUID();

    const habits = [
        {
            id: codingHabitId,
            name: 'Write Clean Code',
            category: 'Coding',
            priority: 'High',
            emoji: '💻',
            color: '#00f2fe', // Neon Cyan
            reminderTime: '09:00',
            notes: 'Code everyday. Avoid runtime errors!',
            createdAt: getPastDateStr(14),
            history: codingHistory
        },
        {
            id: fitnessHabitId,
            name: 'Gym Workout Routine',
            category: 'Fitness',
            priority: 'Medium',
            emoji: '🏋️‍♂️',
            color: '#f35588', // Magenta Pink
            reminderTime: '07:00',
            notes: 'Progressive overload focus.',
            createdAt: getPastDateStr(14),
            history: fitnessHistory
        },
        {
            id: meditationHabitId,
            name: 'Mindful Meditation',
            category: 'Meditation',
            priority: 'Low',
            emoji: '🧘‍♀️',
            color: '#b19ffb', // Light Purple/Lavender
            reminderTime: '21:30',
            notes: 'Calm breathing exercises.',
            createdAt: getPastDateStr(14),
            history: meditationHistory
        }
    ];

    // Compute initial streak and statistics properties
    return habits.map(habit => {
        const stats = calculateStreaks(habit.history, habit.createdAt);
        return { ...habit, ...stats };
    });
}

/**
 * Load all habits from LocalStorage
 * @returns {Array}
 */
export function getHabits() {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) {
        const demo = getDemoHabits();
        saveHabits(demo);
        return demo;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Error parsing habits from local storage', e);
        return [];
    }
}

/**
 * Save habits array to LocalStorage
 * @param {Array} habits 
 */
export function saveHabits(habits) {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

/**
 * Add a new habit
 * @param {Object} habitData 
 * @returns {Object} Newly created habit
 */
export function addHabit(habitData) {
    const habits = getHabits();
    const newHabit = {
        id: generateUUID(),
        history: {},
        createdAt: formatDate(new Date()),
        currentStreak: 0,
        bestStreak: 0,
        missedDays: 0,
        completionRate: 0,
        ...habitData
    };
    habits.push(newHabit);
    saveHabits(habits);
    return newHabit;
}

/**
 * Update existing habit details
 * @param {string} id 
 * @param {Object} updatedData 
 * @returns {Object} Updated habit
 */
export function updateHabit(id, updatedData) {
    const habits = getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
        // Maintain history and UUID
        const existing = habits[index];
        const merged = { ...existing, ...updatedData };
        
        // Re-calculate stats in case date / history changed
        const stats = calculateStreaks(merged.history, merged.createdAt);
        habits[index] = { ...merged, ...stats };
        
        saveHabits(habits);
        return habits[index];
    }
    return null;
}

/**
 * Delete a habit
 * @param {string} id 
 * @returns {boolean} True if successfully deleted
 */
export function deleteHabit(id) {
    const habits = getHabits();
    const filtered = habits.filter(h => h.id !== id);
    if (filtered.length !== habits.length) {
        saveHabits(filtered);
        return true;
    }
    return false;
}

/**
 * Duplicate an existing habit (clones metadata but resets progress)
 * @param {string} id 
 * @returns {Object} Cloned habit
 */
export function duplicateHabit(id) {
    const habits = getHabits();
    const target = habits.find(h => h.id === id);
    if (target) {
        // Find a unique name
        let newName = `${target.name} (Copy)`;
        let counter = 1;
        while (habits.some(h => h.name.toLowerCase() === newName.toLowerCase())) {
            newName = `${target.name} (Copy ${counter++})`;
        }

        const clone = {
            ...target,
            id: generateUUID(),
            name: newName,
            createdAt: formatDate(new Date()),
            history: {},
            currentStreak: 0,
            bestStreak: 0,
            missedDays: 0,
            completionRate: 0
        };
        habits.push(clone);
        saveHabits(habits);
        return clone;
    }
    return null;
}

/**
 * Toggle habit completion status for a specific date
 * @param {string} id 
 * @param {string} dateStr YYYY-MM-DD
 * @returns {Object} Updated habit
 */
export function toggleHabitDate(id, dateStr) {
    const habits = getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
        const habit = habits[index];
        if (!habit.history) habit.history = {};
        
        habit.history[dateStr] = !habit.history[dateStr];
        
        // Remove entry if false to keep storage clean
        if (!habit.history[dateStr]) {
            delete habit.history[dateStr];
        }

        // Re-calculate streaks
        const stats = calculateStreaks(habit.history, habit.createdAt);
        const updated = { ...habit, ...stats };
        habits[index] = updated;

        saveHabits(habits);
        return updated;
    }
    return null;
}

/**
 * Reset all progress/history for a habit
 * @param {string} id 
 * @returns {Object} Reset habit
 */
export function resetHabitProgress(id) {
    const habits = getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
        const habit = habits[index];
        habit.history = {};
        habit.currentStreak = 0;
        habit.bestStreak = 0;
        habit.missedDays = 0;
        habit.completionRate = 0;
        
        saveHabits(habits);
        return habit;
    }
    return null;
}

/**
 * Save theme preference
 * @param {string} theme 'dark' | 'light'
 */
export function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Get theme preference
 * @returns {string} 'dark' | 'light'
 */
export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
}
