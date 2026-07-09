/**
 * Habit Tracker - Toast Notifications
 * Dynamically handles animated toast notification banners.
 */

/**
 * Show an animated toast notification
 * @param {string} message - Toast message text
 * @param {'success'|'info'|'warning'|'error'} type - Style modifier
 * @param {number} duration - Milliseconds before removal
 */
export function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    
    // Create container if not exists
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} slide-in`;
    
    // Icon selection
    let iconClass = 'fa-check-circle';
    if (type === 'info') iconClass = 'fa-info-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    if (type === 'error') iconClass = 'fa-times-circle';

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Close Notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Bind close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto dismiss
    setTimeout(() => {
        if (toast.parentNode) {
            removeToast(toast);
        }
    }, duration);
}

function removeToast(toast) {
    toast.classList.remove('slide-in');
    toast.classList.add('slide-out');
    toast.addEventListener('animationend', () => {
        toast.remove();
    });
}
