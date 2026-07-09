/**
 * Habit Tracker - Export / Import Manager
 * Handles serialization/deserialization and validation of backup JSON files.
 */

import { getHabits, saveHabits } from './storage.js';
import { showToast } from './notification.js';

/**
 * Trigger download of habits backup file
 */
export function exportData() {
    try {
        const habits = getHabits();
        const dataStr = JSON.stringify(habits, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `habit-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Export Successful', 'success');
    } catch (e) {
        console.error(e);
        showToast('Failed to export data', 'error');
    }
}

/**
 * Validate imported habits array
 * @param {Array} parsedData 
 * @returns {boolean}
 */
function validateImportData(parsedData) {
    if (!Array.isArray(parsedData)) return false;

    for (const item of parsedData) {
        if (typeof item !== 'object' || item === null) return false;
        if (typeof item.id !== 'string') return false;
        if (typeof item.name !== 'string' || !item.name.trim()) return false;
        if (typeof item.category !== 'string') return false;
        if (typeof item.priority !== 'string') return false;
        if (typeof item.emoji !== 'string') return false;
        
        // Color is expected
        if (typeof item.color !== 'string') return false;
        
        // History should be an object containing boolean values
        if (typeof item.history !== 'object' || item.history === null) return false;
        for (const date in item.history) {
            if (typeof item.history[date] !== 'boolean') return false;
        }
    }
    return true;
}

/**
 * Handle files selected for import
 * @param {File} file 
 * @param {Function} onSuccessCallback - Trigger re-render
 */
export function importData(file, onSuccessCallback) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (validateImportData(data)) {
                saveHabits(data);
                showToast('Import Successful', 'success');
                if (onSuccessCallback) onSuccessCallback();
            } else {
                showToast('Invalid backup file structure', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Invalid JSON file format', 'error');
        }
    };
    reader.readAsText(file);
}
