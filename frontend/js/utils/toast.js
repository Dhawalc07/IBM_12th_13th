/**
 * Healthcare Resource Management System - Toast Notifications
 */

class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(title, message, type = 'info', duration = 4500) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="modal-close-btn" style="font-size: 14px; align-self: flex-start;">✕</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.onclick = () => this.dismiss(toast);

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    return toast;
  }

  dismiss(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  success(title, message, duration) {
    return this.show(title, message, 'success', duration);
  }

  error(title, message, duration = 6000) {
    return this.show(title, message, 'error', duration);
  }

  warning(title, message, duration) {
    return this.show(title, message, 'warning', duration);
  }

  info(title, message, duration) {
    return this.show(title, message, 'info', duration);
  }
}

export const toast = new ToastManager();
