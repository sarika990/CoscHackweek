import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import './Toast.css';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification glass-card toast-${type} animate-fade-in-up`}>
      <div className="toast-content">
        {type === 'success' ? (
          <CheckCircle2 className="toast-icon icon-success" size={18} />
        ) : (
          <AlertCircle className="toast-icon icon-error" size={18} />
        )}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}
