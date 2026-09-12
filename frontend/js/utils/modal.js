/**
 * Healthcare Resource Management System - Modal Dialog Controller
 */

export class ModalManager {
  static open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Focus first input if present
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  static close(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  static closeAll() {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }

  static confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false, onConfirm }) {
    const confirmModal = document.getElementById('modal-confirm');
    if (!confirmModal) return;

    const titleEl = confirmModal.querySelector('.modal-title');
    const msgEl = confirmModal.querySelector('.confirm-message');
    const confirmBtn = confirmModal.querySelector('.btn-confirm-action');

    if (titleEl) titleEl.innerHTML = title;
    if (msgEl) msgEl.innerHTML = message;
    
    if (confirmBtn) {
      confirmBtn.textContent = confirmText;
      confirmBtn.className = isDanger ? 'btn btn-danger btn-confirm-action' : 'btn btn-primary btn-confirm-action';
      
      // Clear previous click handlers
      const newConfirmBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

      newConfirmBtn.addEventListener('click', async () => {
        ModalManager.close(confirmModal);
        if (typeof onConfirm === 'function') {
          await onConfirm();
        }
      });
    }

    ModalManager.open('modal-confirm');
  }
}

// Global modal backdrop close listener
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      ModalManager.close(e.target);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ModalManager.closeAll();
    }
  });
});
