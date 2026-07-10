import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

export default function Loader({ message = 'Optimizing image data...' }) {
  return (
    <div className="loader-overlay animate-fade-in">
      <div className="loader-card glass-card">
        <Loader2 className="loader-spinner" size={32} />
        <span className="loader-text">{message}</span>
        <div className="loader-bar-track">
          <div className="loader-bar-fill"></div>
        </div>
      </div>
    </div>
  );
}
