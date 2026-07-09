import { fetchAllStorage, deleteStorageItem, clearAll, importStorage } from './storage.js';
import { searchItems, sortItems } from './search.js';
import { updateStats, setViewState, renderTable } from './ui.js';
import { copyToClipboard, showToast, showConfirm, downloadJSON } from './utils.js';

// State Management
let activeTab = null;
let allItems = [];
let filteredItems = [];

// DOM Element References
const currentUrlEl = document.getElementById('current-url');
const refreshBtn = document.getElementById('refresh-btn');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const sortSelect = document.getElementById('sort-select');

const clearLocalBtn = document.getElementById('clear-local-btn');
const clearSessionBtn = document.getElementById('clear-session-btn');
const clearCookiesBtn = document.getElementById('clear-cookies-btn');

const exportBtn = document.getElementById('export-btn');
const importTriggerBtn = document.getElementById('import-trigger-btn');
const importFileInput = document.getElementById('import-file-input');

/**
 * Initialize components and fetch active tab details.
 */
async function init() {
  setViewState('loading');
  setupEventListeners();

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) {
      setViewState('error', 'No active browser tab found.');
      return;
    }
    
    activeTab = tabs[0];
    
    // Display URL or restricted warning
    if (activeTab.url) {
      const urlObj = new URL(activeTab.url);
      currentUrlEl.textContent = urlObj.hostname || urlObj.protocol + urlObj.pathname;
    } else {
      currentUrlEl.textContent = 'Restricted Page';
    }

    await loadStorageData();
  } catch (err) {
    console.error('Initialization error:', err);
    setViewState('error', err.message || 'Initialization failed.');
  }
}

/**
 * Fetch and process active tab storage data.
 */
async function loadStorageData() {
  if (!activeTab) return;
  
  try {
    allItems = await fetchAllStorage(activeTab);
    applyFiltersAndRender();
  } catch (err) {
    console.error('Fetch storage failed:', err);
    if (err.message === 'Restricted Page') {
      setViewState('error', 'Cannot access storage on restricted browser/internal pages.');
    } else {
      setViewState('error', err.message || 'Failed to read client-side storage.');
    }
  }
}

/**
 * Apply current search/sort rules, update statistics, and render table.
 */
function applyFiltersAndRender() {
  const searchQuery = searchInput.value.trim();
  const sortCriteria = sortSelect.value;

  // Filter items matching search
  let processed = searchItems(allItems, searchQuery);
  
  // Sort items
  processed = sortItems(processed, sortCriteria);
  
  filteredItems = processed;

  // Toggle clear search button cross icon
  if (searchQuery.length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }

  // Update statistics dashboard
  updateStats(allItems);

  // Render Table
  renderTable(filteredItems, {
    onCopyKey: handleCopyKey,
    onCopyValue: handleCopyValue,
    onDelete: handleDeleteItem
  });
}

/* --- Row Action Handlers --- */

async function handleCopyKey(item) {
  const success = await copyToClipboard(item.key);
  if (success) {
    showToast('Key copied to clipboard!', 'success');
  } else {
    showToast('Failed to copy key.', 'error');
  }
}

async function handleCopyValue(item) {
  const success = await copyToClipboard(item.value);
  if (success) {
    showToast('Value copied to clipboard!', 'success');
  } else {
    showToast('Failed to copy value.', 'error');
  }
}

function handleDeleteItem(item) {
  showConfirm(
    'Delete Item',
    `Are you sure you want to delete the key "${item.key}" from ${item.type}?`,
    async () => {
      try {
        await deleteStorageItem(activeTab, item);
        showToast('Item deleted successfully.', 'success');
        await loadStorageData();
      } catch (err) {
        showToast(`Failed to delete: ${err.message}`, 'error');
      }
    }
  );
}

/* --- Action Bar Handlers --- */

function setupEventListeners() {
  // Manual Refresh
  refreshBtn.addEventListener('click', async () => {
    setViewState('loading');
    await loadStorageData();
    showToast('Storage data refreshed.', 'info');
  });

  // Search & Filter Input
  searchInput.addEventListener('input', () => {
    applyFiltersAndRender();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    applyFiltersAndRender();
    searchInput.focus();
  });

  // Sort Selection
  sortSelect.addEventListener('change', () => {
    applyFiltersAndRender();
  });

  // Clear Storage Buttons
  clearLocalBtn.addEventListener('click', () => {
    showConfirm(
      'Clear Local Storage',
      'This will permanently delete ALL localStorage keys for this site. Proceed?',
      async () => {
        try {
          await clearAll(activeTab, 'local');
          showToast('Local Storage cleared.', 'success');
          await loadStorageData();
        } catch (err) {
          showToast(`Clear failed: ${err.message}`, 'error');
        }
      }
    );
  });

  clearSessionBtn.addEventListener('click', () => {
    showConfirm(
      'Clear Session Storage',
      'This will permanently delete ALL sessionStorage keys for this site. Proceed?',
      async () => {
        try {
          await clearAll(activeTab, 'session');
          showToast('Session Storage cleared.', 'success');
          await loadStorageData();
        } catch (err) {
          showToast(`Clear failed: ${err.message}`, 'error');
        }
      }
    );
  });

  clearCookiesBtn.addEventListener('click', () => {
    showConfirm(
      'Clear Cookies',
      'This will permanently delete ALL cookies for this site. Proceed?',
      async () => {
        try {
          await clearAll(activeTab, 'cookies');
          showToast('Cookies cleared.', 'success');
          await loadStorageData();
        } catch (err) {
          showToast(`Clear failed: ${err.message}`, 'error');
        }
      }
    );
  });

  // JSON Export
  exportBtn.addEventListener('click', () => {
    if (allItems.length === 0) {
      showToast('No storage data to export.', 'warning');
      return;
    }
    try {
      const hostname = activeTab && activeTab.url ? new URL(activeTab.url).hostname : 'storage';
      const filename = `${hostname}_storage_backup.json`;
      downloadJSON(filename, allItems);
      showToast('Storage backup JSON exported.', 'success');
    } catch (err) {
      showToast('Failed to export storage.', 'error');
    }
  });

  // JSON Import
  importTriggerBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const result = await importStorage(activeTab, parsed);
        
        // Formulate feedback toasts
        if (result.localCount > 0 || result.sessionCount > 0) {
          showToast(`Successfully imported ${result.localCount} Local and ${result.sessionCount} Session storage items.`, 'success');
        }
        if (result.skippedCookies > 0) {
          showToast(`Skipped ${result.skippedCookies} Cookie(s). Cookie restoration is unsupported by browser security policies.`, 'warning');
        }
        
        await loadStorageData();
      } catch (err) {
        showToast('Invalid backup JSON file.', 'error');
      }
      // Reset file input to allow uploading the same file again
      importFileInput.value = '';
    };
    reader.readAsText(file);
  });
}

// Start Popup logic
document.addEventListener('DOMContentLoaded', init);
