import React from 'react';
import { Sun, Moon, Zap } from 'lucide-react';
import './Header.css';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header glass-card">
      <div className="header-logo-section">
        <div className="logo-glow">
          <Zap className="logo-icon" size={24} />
        </div>
        <div className="brand-meta">
          <h1 className="logo-text">OptiPress</h1>
          <span className="logo-desc">Advanced Client-Side Image Optimizer</span>
        </div>
      </div>

      <button 
        className="theme-toggle-btn" 
        onClick={onToggleTheme} 
        aria-label="Toggle Theme"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      >
        {theme === 'light' ? (
          <Moon className="toggle-icon-moon" size={20} />
        ) : (
          <Sun className="toggle-icon-sun" size={20} />
        )}
      </button>
    </header>
  );
}
