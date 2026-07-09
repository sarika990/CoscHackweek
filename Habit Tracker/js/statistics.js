/**
 * Habit Tracker - Statistics Calculations & Chart Builders
 * Computes analytics and draws HTML/CSS dynamic dashboard widgets and charts.
 */

import { formatDate, getLast30Days } from './utils.js';

/**
 * Compute global statistics across all habits
 * @param {Array} habits 
 * @returns {Object} Compiled statistics metrics
 */
export function calculateGlobalStats(habits) {
    if (habits.length === 0) {
        return {
            totalHabits: 0,
            activeHabits: 0,
            completedToday: 0,
            completionRate: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalCompletedDays: 0,
            averageCompletion: 0,
            mostConsistent: 'None',
            leastActive: 'None'
        };
    }

    const todayStr = formatDate(new Date());
    const totalHabits = habits.length;
    
    let completedToday = 0;
    let totalCompletedDays = 0;
    let maxBestStreak = 0;
    let maxCurrentStreak = 0;

    let mostConsistentHabit = null;
    let leastActiveHabit = null;
    let maxCompletionRate = -1;
    let minCompletionRate = 101;

    habits.forEach(habit => {
        if (habit.history && habit.history[todayStr] === true) {
            completedToday++;
        }
        
        const completedDays = Object.keys(habit.history || {}).filter(k => habit.history[k] === true).length;
        totalCompletedDays += completedDays;

        if (habit.bestStreak > maxBestStreak) maxBestStreak = habit.bestStreak;
        if (habit.currentStreak > maxCurrentStreak) maxCurrentStreak = habit.currentStreak;

        const rate = habit.completionRate || 0;
        
        if (rate > maxCompletionRate) {
            maxCompletionRate = rate;
            mostConsistentHabit = habit.name;
        }
        if (rate < minCompletionRate) {
            minCompletionRate = rate;
            leastActiveHabit = habit.name;
        }
    });

    const completionRate = Math.round((completedToday / totalHabits) * 100);
    const averageCompletion = Math.round(
        habits.reduce((acc, curr) => acc + (curr.completionRate || 0), 0) / totalHabits
    );

    return {
        totalHabits,
        activeHabits: totalHabits,
        completedToday,
        completionRate,
        currentStreak: maxCurrentStreak,
        bestStreak: maxBestStreak,
        totalCompletedDays,
        averageCompletion,
        mostConsistent: mostConsistentHabit || 'None',
        leastActive: leastActiveHabit || 'None'
    };
}

/**
 * Renders custom CSS/HTML charts
 * @param {Array} habits 
 * @param {HTMLElement} container 
 */
export function renderCharts(habits, container) {
    if (!container) return;
    container.innerHTML = '';

    if (habits.length === 0) {
        container.innerHTML = `<p class="no-data-msg">Add habits to visualize analytics charts.</p>`;
        return;
    }

    // 1. Weekly completion bar chart (last 7 days completion rate)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d);
    }

    const weekDaysData = last7Days.map(date => {
        const dateStr = formatDate(date);
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        const completedCount = habits.filter(h => h.history && h.history[dateStr] === true).length;
        const rate = Math.round((completedCount / habits.length) * 100);
        return { dayLabel, rate, completedCount };
    });

    const chartTitle = document.createElement('h3');
    chartTitle.innerText = 'Weekly Completion Rate';
    chartTitle.className = 'chart-section-title';
    container.appendChild(chartTitle);

    const barChartContainer = document.createElement('div');
    barChartContainer.className = 'custom-bar-chart';

    weekDaysData.forEach(data => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        
        const tooltip = `Completed: ${data.completedCount}/${habits.length} (${data.rate}%)`;
        
        barWrapper.innerHTML = `
            <div class="bar-container" title="${tooltip}">
                <div class="bar-fill" style="height: ${data.rate}%">
                    <span class="bar-percentage">${data.rate}%</span>
                </div>
            </div>
            <span class="bar-label">${data.dayLabel}</span>
        `;
        barChartContainer.appendChild(barWrapper);
    });

    container.appendChild(barChartContainer);

    // 2. Category Share progress bar list
    const categories = {};
    let totalCompletions = 0;

    habits.forEach(habit => {
        const completions = Object.keys(habit.history || {}).filter(k => habit.history[k] === true).length;
        if (completions > 0) {
            categories[habit.category] = (categories[habit.category] || 0) + completions;
            totalCompletions += completions;
        }
    });

    const catTitle = document.createElement('h3');
    catTitle.innerText = 'Completion Share by Category';
    catTitle.className = 'chart-section-title';
    container.appendChild(catTitle);

    const progressListContainer = document.createElement('div');
    progressListContainer.className = 'custom-progress-list';

    if (totalCompletions === 0) {
        progressListContainer.innerHTML = `<p class="no-data-msg">No logs recorded yet. Start checkmarking days on your calendar!</p>`;
    } else {
        Object.keys(categories).forEach(cat => {
            const count = categories[cat];
            const pct = Math.round((count / totalCompletions) * 100);
            const row = document.createElement('div');
            row.className = 'progress-list-row';
            row.innerHTML = `
                <div class="progress-list-info">
                    <span class="progress-list-label">${cat}</span>
                    <span class="progress-list-value">${count} logs (${pct}%)</span>
                </div>
                <div class="progress-list-bar-bg">
                    <div class="progress-list-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            progressListContainer.appendChild(row);
        });
    }

    container.appendChild(progressListContainer);
}
