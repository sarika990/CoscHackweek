import React, { useState, useEffect } from 'react';
import { Download, FileText, Settings, ShieldCheck } from 'lucide-react';
import './DownloadButton.css';

export default function DownloadButton({ 
  originalFileName, 
  compressedBlob, 
  compressedFormat, 
  compressedQuality, 
  onDownloadStart 
}) {
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('image/webp');
  const [quality, setQuality] = useState(85);

  // Initialize from defaults
  useEffect(() => {
    if (originalFileName) {
      const lastDot = originalFileName.lastIndexOf('.');
      const rawName = lastDot !== -1 ? originalFileName.substring(0, lastDot) : originalFileName;
      setFileName(`${rawName}_optimized`);
    }
  }, [originalFileName]);

  useEffect(() => {
    if (compressedFormat) setFormat(compressedFormat);
    if (compressedQuality) setQuality(compressedQuality);
  }, [compressedFormat, compressedQuality]);

  const handleDownload = () => {
    if (!compressedBlob) return;

    const extension = format.split('/')[1] || 'webp';
    const finalName = `${fileName || 'optimized'}.${extension}`;
    
    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onDownloadStart) {
      onDownloadStart(finalName);
    }
  };

  return (
    <div className="download-config-card glass-card">
      <div className="download-config-header">
        <Settings size={18} className="download-config-icon" />
        <h4 className="download-config-title">Download Configuration</h4>
      </div>

      <div className="download-fields">
        {/* File Name Field */}
        <div className="field-group">
          <label className="field-label">
            <FileText size={14} /> Export Filename
          </label>
          <div className="filename-input-wrapper">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="filename-input"
              aria-label="Export Filename"
            />
            <span className="file-ext-badge">.{format.split('/')[1] || 'webp'}</span>
          </div>
        </div>
      </div>

      <div className="security-guarantee">
        <ShieldCheck size={14} className="security-icon" />
        <span>100% Secure. Compression is performed locally in your browser.</span>
      </div>

      <button 
        className="btn-primary main-download-btn" 
        onClick={handleDownload}
        disabled={!compressedBlob}
      >
        <Download size={18} />
        <span>Download Optimized Image</span>
      </button>
    </div>
  );
}
