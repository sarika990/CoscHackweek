import React from 'react';
import { Heart, Code, Globe } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer glass-card">
      <div className="footer-left">
        <span className="app-version">OptiPress v1.2.0</span>
        <span className="footer-separator">•</span>
        <span className="copyright">© {currentYear} All Rights Reserved</span>
      </div>

      <div className="footer-center">
        <span>
          Made with <Heart className="heart-icon animate-pulse" size={12} /> for lightning fast web performance
        </span>
      </div>

      <div className="footer-right">
        <a 
          href="#" 
          className="footer-link"
          title="Code Repository"
        >
          <Code size={16} />
        </a>
        <a 
          href="#" 
          className="footer-link"
          title="Developer Portfolio"
        >
          <Globe size={16} />
        </a>
      </div>
    </footer>
  );
}
