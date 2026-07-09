/**
 * Habit Tracker - Streak Calculations
 * Handles robust calculations for current streak, best streak, missed days, and completion rate.
 */

import { formatDate, parseDateString } from './utils.js';

/**
 * Calculates all streak and completion statistics for a habit
 * @param {Object} history - Key-value pair of date (YYYY-MM-DD) and completion status (boolean)
 * @param {string} createdAt - Date string when the habit was created (YYYY-MM-DD)
 * @returns {Object} { currentStreak, bestStreak, missedDays, completionRate }
 */
export function calculateStreaks(history = {}, createdAt) {
    const todayStr = formatDate(new Date());
    const historyDates = Object.keys(history)
        .filter(date => history[date] === true)
        .sort((a, b) => new Date(a) - new Date(b));

    if (historyDates.length === 0) {
        return {
            currentStreak: 0,
            bestStreak: 0,
            missedDays: 0,
            completionRate: 0
        };
    }

    // Calculate Best/Longest Streak and all historic streaks
    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    for (const dateStr of historyDates) {
        if (!prevDate) {
            tempStreak = 1;
        } else {
            const diffTime = Math.abs(parseDateString(dateStr) - parseDateString(prevDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else if (diffDays > 1) {
                if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                }
                tempStreak = 1;
            }
        }
        prevDate = dateStr;
    }
    if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
    }

    // Calculate Current Streak
    // We check from today or yesterday backwards.
    let currentStreak = 0;
    let checkDate = new Date();
    let checkDateStr = formatDate(checkDate);

    // If today is completed, start from today
    if (history[checkDateStr] === true) {
        currentStreak = 1;
        while (true) {
            checkDate.setDate(checkDate.getDate() - 1);
            checkDateStr = formatDate(checkDate);
            if (history[checkDateStr] === true) {
                currentStreak++;
            } else {
                break;
            }
        }
    } else {
        // If today is not completed, check if yesterday was completed.
        // If yes, current streak is whatever was accumulated up to yesterday.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayStr = formatDate(yesterday);
        
        if (history[yesterdayStr] === true) {
            checkDate = yesterday;
            currentStreak = 1;
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                checkDateStr = formatDate(checkDate);
                if (history[checkDateStr] === true) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        } else {
            currentStreak = 0;
        }
    }

    // Calculate Missed Days and Completion Rate since creation
    const creationDate = parseDateString(createdAt || historyDates[0]);
    const today = parseDateString(todayStr);
    const totalDaysTime = Math.abs(today - creationDate);
    const totalDays = Math.ceil(totalDaysTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

    let completedCount = historyDates.length;
    let missedDays = 0;

    // Traverse all days from creation to today to find missed days
    const cursor = new Date(creationDate);
    while (cursor <= today) {
        const cursorStr = formatDate(cursor);
        if (!history[cursorStr]) {
            missedDays++;
        }
        cursor.setDate(cursor.getDate() + 1);
    }

    const completionRate = Math.round((completedCount / Math.max(1, totalDays)) * 100);

    return {
        currentStreak,
        bestStreak: Math.max(bestStreak, currentStreak),
        missedDays,
        completionRate
    };
}
