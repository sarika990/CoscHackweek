/**
 * Habit Tracker - Calendar Component
 * Renders the interactive 30-day calendar grid for each habit card.
 */

import { formatDate, parseDateString } from './utils.js';
import { toggleHabitDate } from './storage.js';

/**
 * Render the current month calendar for a specific habit
 * @param {Object} habit 
 * @param {HTMLElement} container 
 * @param {Function} onCalendarClickCallback - Called after cell is toggled
 */
export function renderCalendar(habit, container, onCalendarClickCallback) {
    container.innerHTML = '';

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Label header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <span class="calendar-month-label">${monthNames[currentMonth]} ${currentYear}</span>
        <span class="calendar-today-label">Today: ${today.getDate()}</span>
    `;
    container.appendChild(header);

    // Grid container
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Days in current month
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const cellDate = new Date(currentYear, currentMonth, day);
        const cellDateStr = formatDate(cellDate);
        
        const cell = document.createElement('button');
        cell.className = 'calendar-cell';
        cell.setAttribute('type', 'button');
        cell.setAttribute('data-date', cellDateStr);

        const isCellToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        const isFuture = cellDate > today;
        const isCompleted = habit.history && habit.history[cellDateStr] === true;
        const isMissed = !isCompleted && cellDate < today && formatDate(cellDate) !== formatDate(today);
        const isPending = !isCompleted && isCellToday;

        // Apply classes
        if (isCompleted) {
            cell.classList.add('completed');
            cell.setAttribute('aria-label', `Day ${day}: Completed`);
        } else if (isMissed) {
            cell.classList.add('missed');
            cell.setAttribute('aria-label', `Day ${day}: Missed`);
        } else if (isPending) {
            cell.classList.add('pending');
            cell.setAttribute('aria-label', `Day ${day}: Today (Pending)`);
        } else if (isFuture) {
            cell.classList.add('future');
            cell.setAttribute('disabled', 'true');
            cell.setAttribute('aria-label', `Day ${day}: Future (Disabled)`);
        } else {
            cell.classList.add('inactive');
            cell.setAttribute('aria-label', `Day ${day}`);
        }

        if (isCellToday) {
            cell.classList.add('today');
        }

        // Add visual content
        cell.innerHTML = `<span class="day-num">${day}</span>`;

        // Tooltip setup
        const statusText = isCompleted ? 'Completed' : (isMissed ? 'Missed' : (isPending ? 'Today (Click to Log)' : 'Future'));
        cell.setAttribute('title', `${monthNames[currentMonth]} ${day}, ${currentYear} - ${statusText}`);

        // Click Handler (only if not future)
        if (!isFuture) {
            cell.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleHabitDate(habit.id, cellDateStr);
                
                // Animate complete
                if (!isCompleted) {
                    cell.classList.add('pop-animation');
                }

                if (onCalendarClickCallback) {
                    onCalendarClickCallback();
                }
            });
        }

        grid.appendChild(cell);
    }

    container.appendChild(grid);
}
