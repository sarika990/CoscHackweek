import React from 'react';
import { History, Trash2, ArrowRight, Save } from 'lucide-react';
import { formatBytes } from '../../utils/compressor';
import './HistoryPanel.css';

export default function HistoryPanel({ history, onSelectHistory, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="history-card glass-card empty-history">
        <History size={20} className="history-empty-icon" />
        <span className="empty-history-text">No compression history in this session.</span>
      </div>
    );
  }

  return (
    <div className="history-card glass-card">
      <div className="history-header">
        <div className="history-title-section">
          <History className="history-icon" size={18} />
          <h4 className="history-title">Session History</h4>
        </div>
        <button 
          className="clear-history-btn" 
          onClick={onClearHistory}
          title="Clear History"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="history-list">
        {history.map((item, index) => {
          const originalName = item.file?.name || 'image';
          const extension = item.format.split('/')[1] || 'webp';
          const reduction = item.reductionPercent;

          return (
            <div 
              key={item.id || index} 
              className="history-item"
              onClick={() => onSelectHistory(item)}
              role="button"
              tabIndex={0}
              title={`Load ${originalName} compression settings`}
            >
              <div className="history-thumb-wrapper">
                <img src={item.previewUrl} alt="Thumbnail" className="history-thumb" />
              </div>
              <div className="history-meta-details">
                <span className="history-filename" title={originalName}>
                  {originalName}
                </span>
                <div className="history-stats">
                  <span className="history-badge-format">{extension.toUpperCase()}</span>
                  <span className="history-reduction-text">-{reduction}%</span>
                  <span className="history-divider">|</span>
                  <span className="history-size">{formatBytes(item.compressedSize)}</span>
                </div>
              </div>
              <ArrowRight className="history-item-arrow" size={14} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
