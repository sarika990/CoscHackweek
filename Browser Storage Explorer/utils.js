/**
 * Format raw byte size into human readable strings.
 * @param {number} bytes
 * @returns {string}
 */
export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  if (!bytes || isNaN(bytes)) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Copy text to the system clipboard using the modern Clipboard API.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Display toast notification at the bottom of the popup view.
 * @param {string} message
 * @param {'info' | 'success' | 'error' | 'warning'} type
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const textNode = document.createElement('span');
  textNode.textContent = message;
  toast.appendChild(textNode);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  });
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }
  }, 3000);
}

/**
 * Trigger the custom overlay confirm dialog modal.
 * @param {string} title
 * @param {string} message
 * @param {Function} onConfirm
 */
export function showConfirm(title, message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('confirm-title');
  const messageEl = document.getElementById('confirm-message');
  const cancelBtn = document.getElementById('confirm-cancel-btn');
  const okBtn = document.getElementById('confirm-ok-btn');

  if (!modal || !titleEl || !messageEl || !cancelBtn || !okBtn) return;

  titleEl.textContent = title;
  messageEl.textContent = message;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  const cleanup = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    // Remove listeners to prevent memory leaks
    okBtn.removeEventListener('click', handleOk);
    cancelBtn.removeEventListener('click', handleCancel);
  };

  const handleOk = () => {
    cleanup();
    onConfirm();
  };

  const handleCancel = () => {
    cleanup();
  };

  okBtn.addEventListener('click', handleOk);
  cancelBtn.addEventListener('click', handleCancel);
}

/**
 * Download arbitrary data as a JSON file.
 * @param {string} filename
 * @param {object} data
 */
export function downloadJSON(filename, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
