import React, { useState, useEffect } from 'react';
import { HardDrive, CheckCircle, Percent, Zap, Maximize, FileSpreadsheet, Copy, Check } from 'lucide-react';
import { formatBytes } from '../../utils/compressor';
import './MetricsPanel.css';

// Simple animated counter component
function AnimatedCounter({ value, duration = 800, suffix = '', formatter = (v) => v }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const totalMiliseconds = duration;
    const incrementTime = 30;
    const steps = totalMiliseconds / incrementTime;
    const increment = (end - start) / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      if (currentStep >= steps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  // Handle floats or ints
  const displayVal = Number.isInteger(value) ? Math.round(count) : count.toFixed(2);
  return <span>{formatter(displayVal)}{suffix}</span>;
}

export default function MetricsPanel({ compressedData, onCopy }) {
  const [copied, setCopied] = useState(false);

  if (!compressedData) return null;

  const {
    originalSize,
    compressedSize,
    spaceSaved,
    reductionPercent,
    compressionRatio,
    width,
    height,
    processingTime,
    qualityLoss,
    visualScore,
    qualityLabel,
    format,
  } = compressedData;

  const handleCopy = () => {
    const statsText = `
--- OPTIPRESS COMPRESSION REPORT ---
- Format: ${format.toUpperCase()}
- Original Size: ${formatBytes(originalSize)}
- Compressed Size: ${formatBytes(compressedSize)}
- Saved Storage: ${formatBytes(spaceSaved)} (${reductionPercent}% Reduction)
- Compression Ratio: ${compressionRatio}:1
- Dimensions: ${width}x${height}
- Processing Time: ${processingTime}ms
- Quality Level: ${qualityLabel} (Visual Score: ${visualScore}/100)
------------------------------------
    `.trim();

    navigator.clipboard.writeText(statsText).then(() => {
      setCopied(true);
      if (onCopy) onCopy('Statistics copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--secondary)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="metrics-card glass-card">
      <div className="metrics-header">
        <div className="metrics-title-section">
          <FileSpreadsheet className="metrics-icon" size={18} />
          <h4 className="metrics-title">Compression Performance</h4>
        </div>
        <button className="btn-secondary copy-stats-btn" onClick={handleCopy} title="Copy Stats to Clipboard">
          {copied ? <Check size={16} className="copy-success" /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Copy Stats'}</span>
        </button>
      </div>

      <div className="metrics-grid">
        {/* Metric Card */}
        <div className="metric-box">
          <HardDrive className="metric-box-icon" size={16} />
          <div className="metric-details">
            <span className="metric-box-label">Original Size</span>
            <h5 className="metric-box-value">{formatBytes(originalSize)}</h5>
          </div>
        </div>

        {/* Metric Card */}
        <div className="metric-box">
          <CheckCircle className="metric-box-icon" size={16} />
          <div className="metric-details">
            <span className="metric-box-label">Optimized Size</span>
            <h5 className="metric-box-value">{formatBytes(compressedSize)}</h5>
          </div>
        </div>

        {/* Metric Card */}
        <div className="metric-box space-saved-box">
          <Percent className="metric-box-icon text-success" size={16} />
          <div className="metric-details">
            <span className="metric-box-label">Space Saved</span>
            <h5 className="metric-box-value text-success">
              <AnimatedCounter value={reductionPercent} suffix="%" />
              <span className="saved-bytes"> ({formatBytes(spaceSaved)})</span>
            </h5>
          </div>
        </div>

        {/* Metric Card */}
        <div className="metric-box">
          <Zap className="metric-box-icon" size={16} />
          <div className="metric-details">
            <span className="metric-box-label">Ratio / Speed</span>
            <h5 className="metric-box-value">
              <AnimatedCounter value={compressionRatio} suffix=":1" />
              <span className="speed-ms"> | {processingTime}ms</span>
            </h5>
          </div>
        </div>
      </div>

      {/* Visual Quality Analysis and ring display */}
      <div className="quality-analysis-section">
        <div className="quality-donut-wrapper">
          <svg className="score-ring" viewBox="0 0 36 36">
            <path
              className="ring-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="ring-fill"
              strokeDasharray={`${visualScore}, 100`}
              stroke={getScoreColor(visualScore)}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="ring-content">
            <span className="ring-score">{visualScore}</span>
            <span className="ring-max">/100</span>
          </div>
        </div>

        <div className="quality-text-analysis">
          <h5 className="analysis-title">Visual Score & Quality Status</h5>
          <div className="analysis-badges">
            <span className="badge badge-info">{format.split('/')[1].toUpperCase()}</span>
            <span 
              className="badge" 
              style={{
                background: `rgba(from ${getScoreColor(visualScore)} r g b / 0.15)`,
                color: getScoreColor(visualScore)
              }}
            >
              {qualityLabel}
            </span>
          </div>
          <p className="analysis-desc">
            Estimated quality loss is <strong>{qualityLoss}%</strong>. 
            The visual difference is virtually imperceptible under standard display densities.
          </p>
        </div>
      </div>
    </div>
  );
}
