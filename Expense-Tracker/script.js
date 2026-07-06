let expenses = [];
try {
    const parsedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (Array.isArray(parsedExpenses)) {
        expenses = parsedExpenses;
    }
} catch (e) {
    console.error("Error parsing expenses from localStorage", e);
}

let budgets = {};
try {
    const parsedBudgets = JSON.parse(localStorage.getItem('budgets'));
    if (parsedBudgets && typeof parsedBudgets === 'object' && !Array.isArray(parsedBudgets)) {
        budgets = parsedBudgets;
    }
} catch (e) {
    console.error("Error parsing budgets from localStorage", e);
}

let currentTheme = localStorage.getItem('theme') || 'light';
let expenseToDelete = null;

// Chart Instances
let categoryPieChart = null;
let monthlyBarChart = null;

// DOM Elements - Setup
const documentElement = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('pageTitle');
const toastContainer = document.getElementById('toastContainer');

// DOM Elements - Dashboard
const totalExpensesAmount = document.getElementById('totalExpensesAmount');
const transactionCount = document.getElementById('transactionCount');
const highestCategoryName = document.getElementById('highestCategoryName');
const highestCategoryAmount = document.getElementById('highestCategoryAmount');
const recentExpensesTableBody = document.getElementById('recentExpensesTableBody');
const budgetWarningsContainer = document.getElementById('budgetWarningsContainer');
const viewAllExpensesBtn = document.getElementById('viewAllExpensesBtn');

// DOM Elements - Expenses
const allExpensesTableBody = document.getElementById('allExpensesTableBody');
const expensesEmptyState = document.getElementById('expensesEmptyState');
const expensesTableContainer = document.getElementById('expensesTableContainer');
const filterMonth = document.getElementById('filterMonth');
const filterCategory = document.getElementById('filterCategory');
const sortBy = document.getElementById('sortBy');
const globalSearch = document.getElementById('globalSearch');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const importCsvBtn = document.getElementById('importCsvBtn');
const csvFileInput = document.getElementById('csvFileInput');

// DOM Elements - Modals
const expenseModal = document.getElementById('expenseModal');
const expenseForm = document.getElementById('expenseForm');
const expenseModalTitle = document.getElementById('expenseModalTitle');
const expenseId = document.getElementById('expenseId');
const expenseDescription = document.getElementById('expenseDescription');
const expenseAmount = document.getElementById('expenseAmount');
const expenseDate = document.getElementById('expenseDate');
const expenseCategory = document.getElementById('expenseCategory');

const budgetModal = document.getElementById('budgetModal');
const budgetForm = document.getElementById('budgetForm');
const budgetCategoryInput = document.getElementById('budgetCategory');
const budgetCategoryLabel = document.getElementById('budgetCategoryLabel');
const budgetLimit = document.getElementById('budgetLimit');
const removeBudgetBtn = document.getElementById('removeBudgetBtn');

const confirmDeleteModal = document.getElementById('confirmDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialization
function init() {
    applyTheme(currentTheme);
    setupEventListeners();
    populateMonthFilter();
    updateDashboard();
    renderExpensesList();
    renderBudgetGrid();
}

// Utility: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility: Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Utility: Generate ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Utility: Show Toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'circle-exclamation';
    if (type === 'warning') icon = 'triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid fa-${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Theme Handling
function applyTheme(theme) {
    documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
    updateChartsTheme();
}

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
});

// Navigation & Sidebar
openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

function navigateTo(targetView) {
    // Update nav links
    navItems.forEach(item => {
        if (item.dataset.target === targetView) {
            item.classList.add('active');
            pageTitle.textContent = item.querySelector('span').textContent;
        } else {
            item.classList.remove('active');
        }
    });

    // Update views
    viewSections.forEach(section => {
        if (section.id === `${targetView}View`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Re-render chart if switching to dashboard to fix resizing issues
    if (targetView === 'dashboard') {
        updateCharts();
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
    }
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.dataset.target);
    });
});

viewAllExpensesBtn.addEventListener('click', () => navigateTo('expenses'));

// Modal Handling
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
    // Reset forms when closing
    if (modal.id === 'expenseModal') expenseForm.reset();
    if (modal.id === 'budgetModal') budgetForm.reset();
}

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        closeModal(document.getElementById(modalId));
    });
});

// Close modal on outside click or Escape key
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            closeModal(modal);
        });
    }
});

document.getElementById('addExpenseBtn').addEventListener('click', () => {
    expenseModalTitle.textContent = 'Add Expense';
    expenseId.value = '';
    expenseDate.valueAsDate = new Date(); // default to today
    openModal(expenseModal);
});

document.getElementById('addExpenseSidebarBtn').addEventListener('click', () => {
    expenseModalTitle.textContent = 'Add Expense';
    expenseId.value = '';
    expenseDate.valueAsDate = new Date();
    openModal(expenseModal);
    if (window.innerWidth <= 768) sidebar.classList.remove('open');
});

// Expense CRUD Operations
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newExpense = {
        id: expenseId.value || generateId(),
        description: expenseDescription.value,
        amount: parseFloat(expenseAmount.value),
        date: expenseDate.value,
        category: expenseCategory.value
    };

    if (expenseId.value) {
        // Edit existing
        const index = expenses.findIndex(exp => exp.id === expenseId.value);
        if (index !== -1) {
            expenses[index] = newExpense;
            showToast('Expense updated successfully');
        }
    } else {
        // Add new
        expenses.push(newExpense);
        showToast('Expense added successfully');
    }

    saveExpenses();
    closeModal(expenseModal);
    updateDashboard();
    renderExpensesList();
});

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    expenseModalTitle.textContent = 'Edit Expense';
    expenseId.value = expense.id;
    expenseDescription.value = expense.description;
    expenseAmount.value = expense.amount;
    expenseDate.value = expense.date;
    expenseCategory.value = expense.category;

    openModal(expenseModal);
}

function promptDeleteExpense(id) {
    expenseToDelete = id;
    openModal(confirmDeleteModal);
}

confirmDeleteBtn.addEventListener('click', () => {
    if (expenseToDelete) {
        expenses = expenses.filter(exp => exp.id !== expenseToDelete);
        saveExpenses();
        showToast('Expense deleted');
        closeModal(confirmDeleteModal);
        updateDashboard();
        renderExpensesList();
        expenseToDelete = null;
    }
});

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    populateMonthFilter(); // Update filters in case new month was added
}

// Budgets Handling
function openBudgetModal(category) {
    budgetCategoryInput.value = category;
    budgetCategoryLabel.textContent = `Budget for ${category}`;
    
    if (budgets[category]) {
        budgetLimit.value = budgets[category];
        removeBudgetBtn.style.display = 'block';
    } else {
        budgetLimit.value = '';
        removeBudgetBtn.style.display = 'none';
    }
    
    openModal(budgetModal);
}

budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = budgetCategoryInput.value;
    const limit = parseFloat(budgetLimit.value);
    
    budgets[category] = limit;
    saveBudgets();
    
    showToast(`Budget set for ${category}`);
    closeModal(budgetModal);
    renderBudgetGrid();
    checkBudgets();
});

removeBudgetBtn.addEventListener('click', () => {
    const category = budgetCategoryInput.value;
    delete budgets[category];
    saveBudgets();
    
    showToast(`Budget removed for ${category}`);
    closeModal(budgetModal);
    renderBudgetGrid();
    checkBudgets();
});

function saveBudgets() {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Calculate logic
function getExpensesForCurrentMonth() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
}

function getCategoryTotals(expensesList) {
    return expensesList.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
}

// UI Updates
function updateDashboard() {
    const currentMonthExpenses = getExpensesForCurrentMonth();
    
    // Total Expenses
    const total = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalExpensesAmount.textContent = formatCurrency(total);
    
    // Transaction Count
    transactionCount.textContent = currentMonthExpenses.length;
    
    // Highest Category
    const categoryTotals = getCategoryTotals(currentMonthExpenses);
    let maxCategory = '-';
    let maxAmount = 0;
    
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > maxAmount) {
            maxAmount = amount;
            maxCategory = category;
        }
    }
    
    highestCategoryName.textContent = maxCategory;
    highestCategoryAmount.textContent = maxAmount > 0 ? formatCurrency(maxAmount) : '$0.00';
    
    // Recent Transactions (limit to 5)
    recentExpensesTableBody.innerHTML = '';
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedExpenses.length === 0) {
        recentExpensesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No recent transactions</td></tr>`;
    } else {
        sortedExpenses.slice(0, 5).forEach(exp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(exp.date)}</td>
                <td>${exp.description}</td>
                <td><span class="badge badge-${exp.category}">${exp.category}</span></td>
                <td class="text-right amount">${formatCurrency(exp.amount)}</td>
            `;
            recentExpensesTableBody.appendChild(tr);
        });
    }

    updateCharts(categoryTotals);
    checkBudgets(categoryTotals);
}

function checkBudgets(categoryTotals = null) {
    if (!categoryTotals) {
        const currentMonthExpenses = getExpensesForCurrentMonth();
        categoryTotals = getCategoryTotals(currentMonthExpenses);
    }
    
    budgetWarningsContainer.innerHTML = '';
    
    for (const [category, limit] of Object.entries(budgets)) {
        const spent = categoryTotals[category] || 0;
        if (spent > limit) {
            const warning = document.createElement('div');
            warning.className = 'alert';
            warning.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                    <strong>Budget Exceeded!</strong> You've spent ${formatCurrency(spent)} on ${category}, which is ${formatCurrency(spent - limit)} over your monthly limit of ${formatCurrency(limit)}.
                </div>
            `;
            budgetWarningsContainer.appendChild(warning);
        }
    }
}

function renderBudgetGrid() {
    const budgetGrid = document.getElementById('budgetGrid');
    budgetGrid.innerHTML = '';
    
    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];
    const currentMonthExpenses = getExpensesForCurrentMonth();
    const categoryTotals = getCategoryTotals(currentMonthExpenses);
    
  categories.forEach(category => {
        const limit = budgets[category];
        const spent = categoryTotals[category] || 0;
        const isExceeded = limit && spent > limit;
        
        let progressHtml = '';
        if (limit) {
            const percent = Math.min((spent / limit) * 100, 100);
            const progressColor = isExceeded ? 'var(--danger)' : (percent > 85 ? 'var(--warning)' : 'var(--primary)');
            progressHtml = `
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percent}%; background-color: ${progressColor}"></div>
                </div>
                <div class="budget-stats">
                    <span>Spent: ${formatCurrency(spent)}</span>
                    <span>Limit: ${formatCurrency(limit)}</span>
                </div>
            `;
        } else {
            progressHtml = `
                <p class="subtitle" style="margin-top: 1rem">No limit set</p>
            `;
        }

        const card = document.createElement('div');
        card.className = `budget-card ${isExceeded ? 'exceeded' : ''}`;
        card.innerHTML = `
            <div class="budget-header">
                <div class="budget-title">
                    <span class="badge badge-${category}"> </span>
                    ${category}
                </div>
                <button class="btn-icon" onclick="openBudgetModal('${category}')" title="Set Budget">
                    <i class="fa-solid fa-${limit ? 'pen' : 'plus'}"></i>
                </button>
            </div>
            ${progressHtml}
        `;
        budgetGrid.appendChild(card);
    });
}

// Filtering and Sorting
function populateMonthFilter() {
    const months = new Set();
    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthYear);
    });
    
    // Keep the "All Months" option
    filterMonth.innerHTML = '<option value="all">All Months</option>';
    
    [...months].sort().reverse().forEach(monthStr => {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const option = document.createElement('option');
        option.value = monthStr;
        option.textContent = label;
        filterMonth.appendChild(option);
    });
}

function renderExpensesList() {
    let filtered = [...expenses];
    
    // Apply Global Search
    const searchTerm = globalSearch.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(exp => 
            exp.description.toLowerCase().includes(searchTerm) || 
            exp.category.toLowerCase().includes(searchTerm) ||
            exp.amount.toString().includes(searchTerm) ||
            formatDate(exp.date).toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply Category Filter
    const catFilter = filterCategory.value;
    if (catFilter !== 'all') {
        filtered = filtered.filter(exp => exp.category === catFilter);
    }
    
    // Apply Month Filter
    const monthFilter = filterMonth.value;
    if (monthFilter !== 'all') {
        filtered = filtered.filter(exp => {
            const expDate = new Date(exp.date);
            const expMonthYear = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
            return expMonthYear === monthFilter;
        });
    }
    
    // Apply Sorting
    const sortVal = sortBy.value;
    filtered.sort((a, b) => {
        if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortVal === 'amount-desc') return b.amount - a.amount;
        if (sortVal === 'amount-asc') return a.amount - b.amount;
    });
    
    // Render
    allExpensesTableBody.innerHTML = '';
    
    if (filtered.length === 0) {
        expensesTableContainer.querySelector('table').style.display = 'none';
        expensesEmptyState.style.display = 'block';
    } else {
        expensesTableContainer.querySelector('table').style.display = 'table';
        expensesEmptyState.style.display = 'none';
        
        filtered.forEach(exp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(exp.date)}</td>
                <td>${exp.description}</td>
                <td><span class="badge badge-${exp.category}">${exp.category}</span></td>
                <td class="text-right amount">${formatCurrency(exp.amount)}</td>
                <td class="text-center">
                    <button class="btn-icon" onclick="editExpense('${exp.id}')" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon delete" onclick="promptDeleteExpense('${exp.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            allExpensesTableBody.appendChild(tr);
        });
    }
}

// Setup Event Listeners for Filters and CSV
function setupEventListeners() {
    globalSearch.addEventListener('input', renderExpensesList);
    filterCategory.addEventListener('change', renderExpensesList);
    filterMonth.addEventListener('change', renderExpensesList);
    sortBy.addEventListener('change', renderExpensesList);

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCSV);
    }
    if (importCsvBtn && csvFileInput) {
        importCsvBtn.addEventListener('click', () => csvFileInput.click());
        csvFileInput.addEventListener('change', importFromCSV);
    }
}

// CSV Export/Import
function exportToCSV() {
    if (expenses.length === 0) {
        showToast('No expenses to export', 'warning');
        return;
    }
    
    let csvContent = "ID,Date,Description,Category,Amount\n";
    expenses.forEach(exp => {
        const row = [
            exp.id,
            exp.date,
            `"${exp.description.replace(/"/g, '""')}"`,
            exp.category,
            exp.amount
        ].join(",");
        csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Expenses exported to CSV');
}

function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\\n');
        
        if (lines.length < 2) {
            showToast('Invalid CSV file', 'error');
            return;
        }

        let importedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Basic CSV parsing
            let insideQuotes = false;
            let currentStr = '';
            const values = [];
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentStr);
                    currentStr = '';
                } else {
                    currentStr += char;
                }
            }
            values.push(currentStr);
            
            if (values.length >= 5) {
                const newExpense = {
                    id: values[0] || generateId(),
                    date: values[1],
                    description: values[2].replace(/^"|"$/g, ''),
                    category: values[3],
                    amount: parseFloat(values[4])
                };
                
                // Avoid duplicates by checking ID
                const existingIndex = expenses.findIndex(exp => exp.id === newExpense.id);
                if (existingIndex === -1 && !isNaN(newExpense.amount)) {
                    expenses.push(newExpense);
                    importedCount++;
                }
            }
        }
        
        if (importedCount > 0) {
            saveExpenses();
            updateDashboard();
            renderExpensesList();
            showToast(`Successfully imported ${importedCount} expenses`);
        } else {
            showToast('No new expenses found to import', 'warning');
        }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
}

// Chart.js Integration
function getChartColors() {
    const isDark = documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#d1d5db' : '#4b5563';
    const gridColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)';
    
    const categoryColors = {
        'Food': '#f59e0b',
        'Travel': '#3b82f6',
        'Shopping': '#ec4899',
        'Bills': '#ef4444',
        'Entertainment': '#8b5cf6',
        'Education': '#10b981',
        'Health': '#14b8a6',
        'Other': '#6b7280'
    };
    
    return { textColor, gridColor, categoryColors };
}

function updateChartsTheme() {
    if (categoryPieChart) {
        const { textColor } = getChartColors();
        categoryPieChart.options.plugins.legend.labels.color = textColor;
        categoryPieChart.update();
    }
    if (monthlyBarChart) {
        const { textColor, gridColor } = getChartColors();
        monthlyBarChart.options.scales.x.ticks.color = textColor;
        monthlyBarChart.options.scales.y.ticks.color = textColor;
        monthlyBarChart.options.scales.x.grid.color = gridColor;
        monthlyBarChart.options.scales.y.grid.color = gridColor;
        monthlyBarChart.options.plugins.legend.labels.color = textColor;
        monthlyBarChart.update();
    }
}

function updateCharts(currentMonthTotals = null) {
    if (!currentMonthTotals) {
        currentMonthTotals = getCategoryTotals(getExpensesForCurrentMonth());
    }
    
    const { textColor, gridColor, categoryColors } = getChartColors();
    
    // Common chart options
    Chart.defaults.font.family = "'Outfit', sans-serif";
    
    // --- Category Pie Chart ---
    const pieCtx = document.getElementById('categoryPieChart').getContext('2d');
    
    const pieLabels = Object.keys(currentMonthTotals);
    const pieData = Object.values(currentMonthTotals);
    const pieBgColors = pieLabels.map(label => categoryColors[label] || categoryColors['Other']);
    
    if (categoryPieChart) {
        categoryPieChart.destroy();
    }
    
    categoryPieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: pieLabels.length ? pieLabels : ['No Data'],
            datasets: [{
                data: pieData.length ? pieData : [1],
                backgroundColor: pieData.length ? pieBgColors : [gridColor],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: textColor, padding: 20, usePointStyle: true, pointStyle: 'circle' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (!pieData.length) return 'No data';
                            let label = context.label || '';
                            if (label) label += ': ';
                            label += formatCurrency(context.raw);
                            return label;
                        }
                    }
                }
            }
        }
    });

    // --- Monthly Bar Chart ---
    // Group expenses by last 6 months
    const barCtx = document.getElementById('monthlyBarChart').getContext('2d');
    
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[key] = { label, total: 0 };
    }
    
    expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        const key = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key]) {
            monthlyData[key].total += exp.amount;
        }
    });
    
    const barLabels = Object.values(monthlyData).map(d => d.label);
    const barValues = Object.values(monthlyData).map(d => d.total);
    
    if (monthlyBarChart) {
        monthlyBarChart.destroy();
    }
    
    monthlyBarChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [{
                label: 'Total Expenses',
                data: barValues,
                backgroundColor: '#4f46e5',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                },
                y: {
                    border: { display: false },
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
