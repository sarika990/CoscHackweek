import { formatSize } from './utils.js';

// SVG Assets for Row Buttons
const COPY_KEY_SVG = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const COPY_VALUE_SVG = `<svg viewBox="0 0 24 24"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>`;
const DELETE_SVG = `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

/**
 * Update the Statistics Cards based on the storage items array.
 * @param {Array<object>} items
 */
export function updateStats(items) {
  const totalCountEl = document.getElementById('stat-total-count');
  const localCountEl = document.getElementById('stat-local-count');
  const sessionCountEl = document.getElementById('stat-session-count');
  const cookieCountEl = document.getElementById('stat-cookie-count');
  const totalSizeEl = document.getElementById('stat-total-size');
  const avgSizeEl = document.getElementById('stat-avg-size');
  const largestItemEl = document.getElementById('stat-largest-item');

  if (!totalCountEl) return;

  const total = items.length;
  const local = items.filter(i => i.type === 'Local Storage').length;
  const session = items.filter(i => i.type === 'Session Storage').length;
  const cookie = items.filter(i => i.type === 'Cookie').length;
  
  let totalBytes = 0;
  let largest = { key: 'None', size: 0 };

  items.forEach(item => {
    totalBytes += item.size;
    if (item.size > largest.size) {
      largest = { key: item.key, size: item.size };
    }
  });

  const avgBytes = total > 0 ? Math.round(totalBytes / total) : 0;

  totalCountEl.textContent = total;
  localCountEl.textContent = local;
  sessionCountEl.textContent = session;
  cookieCountEl.textContent = cookie;
  
  totalSizeEl.textContent = formatSize(totalBytes);
  avgSizeEl.textContent = formatSize(avgBytes);
  
  if (largest.size > 0) {
    largestItemEl.textContent = `${largest.key} (${formatSize(largest.size)})`;
    largestItemEl.title = `${largest.key} (${formatSize(largest.size)})`;
  } else {
    largestItemEl.textContent = 'None';
    largestItemEl.title = 'None';
  }
}

/**
 * Toggle loading, empty, error and table visibilities.
 * @param {'loading' | 'empty' | 'error' | 'content'} state
 * @param {string} [errorMessage]
 */
export function setViewState(state, errorMessage = '') {
  const loader = document.getElementById('skeleton-loader');
  const empty = document.getElementById('empty-state');
  const error = document.getElementById('error-state');
  const errorMsg = document.getElementById('error-message');
  const table = document.getElementById('storage-table');

  // Hide everything first
  loader?.classList.add('hidden');
  empty?.classList.add('hidden');
  error?.classList.add('hidden');
  table?.classList.add('hidden');

  switch (state) {
    case 'loading':
      loader?.classList.remove('hidden');
      break;
    case 'empty':
      empty?.classList.remove('hidden');
      break;
    case 'error':
      if (errorMsg) errorMsg.textContent = errorMessage || 'Failed to access storage';
      error?.classList.remove('hidden');
      break;
    case 'content':
      table?.classList.remove('hidden');
      break;
  }
}

/**
 * Populates the storage data table with rows.
 * @param {Array<object>} items
 * @param {object} callbacks - actions callbacks: { onCopyKey, onCopyValue, onDelete, onPreview }
 */
export function renderTable(items, callbacks) {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';

  if (items.length === 0) {
    setViewState('empty');
    return;
  }

  setViewState('content');

  items.forEach(item => {
    const tr = document.createElement('tr');

    // 1. Key cell
    const tdKey = document.createElement('td');
    tdKey.className = 'key-cell';
    tdKey.textContent = item.key;
    tr.appendChild(tdKey);

    // 2. Value cell (clickable preview)
    const tdVal = document.createElement('td');
    tdVal.className = 'val-cell';
    tdVal.textContent = item.value;
    tdVal.title = 'Click to copy full value';
    tdVal.addEventListener('click', () => callbacks.onCopyValue(item));
    tr.appendChild(tdVal);

    // 3. Type badge cell
    const tdType = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge badge-${item.type === 'Local Storage' ? 'local' : item.type === 'Session Storage' ? 'session' : 'cookie'}`;
    badge.textContent = item.type === 'Local Storage' ? 'Local' : item.type === 'Session Storage' ? 'Session' : 'Cookie';
    tdType.appendChild(badge);
    tr.appendChild(tdType);

    // 4. Size cell
    const tdSize = document.createElement('td');
    tdSize.textContent = formatSize(item.size);
    tr.appendChild(tdSize);

    // 5. Actions cell
    const tdActions = document.createElement('td');
    const actionWrapper = document.createElement('div');
    actionWrapper.className = 'row-actions';

    // Copy Key Button
    const btnCopyKey = document.createElement('button');
    btnCopyKey.className = 'btn-row-action';
    btnCopyKey.innerHTML = COPY_KEY_SVG;
    btnCopyKey.title = 'Copy Key';
    btnCopyKey.setAttribute('aria-label', `Copy storage key: ${item.key}`);
    btnCopyKey.addEventListener('click', () => callbacks.onCopyKey(item));
    actionWrapper.appendChild(btnCopyKey);

    // Copy Value Button
    const btnCopyVal = document.createElement('button');
    btnCopyVal.className = 'btn-row-action';
    btnCopyVal.innerHTML = COPY_VALUE_SVG;
    btnCopyVal.title = 'Copy Value';
    btnCopyVal.setAttribute('aria-label', `Copy storage value for key: ${item.key}`);
    btnCopyVal.addEventListener('click', () => callbacks.onCopyValue(item));
    actionWrapper.appendChild(btnCopyVal);

    // Delete Button
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-row-action btn-row-delete';
    btnDelete.innerHTML = DELETE_SVG;
    btnDelete.title = 'Delete Item';
    btnDelete.setAttribute('aria-label', `Delete storage item with key: ${item.key}`);
    btnDelete.addEventListener('click', () => callbacks.onDelete(item));
    actionWrapper.appendChild(btnDelete);

    tdActions.appendChild(actionWrapper);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}
