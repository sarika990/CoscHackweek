import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Clipboard, AlertCircle } from 'lucide-react';
import './UploadArea.css';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function UploadArea({ onImageSelected, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  // Handle clipboard paste anywhere on page when App is in focus or when this box is focused
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file) => {
    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      onError('Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError('File is too large. Max supported size is 50MB.');
      return;
    }

    onImageSelected(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`upload-container glass-card ${isDragActive ? 'drag-active' : ''} ${isFocused ? 'focused' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="button"
      aria-label="Upload an image. Click, drag and drop, or paste from clipboard"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden-file-input"
        onChange={handleChange}
        accept=".jpg,.jpeg,.png,.webp"
      />
      <div className="upload-content">
        <div className="upload-icon-wrapper">
          <UploadCloud className="upload-icon" size={40} />
        </div>
        <h3 className="upload-title">Drag & Drop Image Here</h3>
        <p className="upload-subtitle">
          or <span className="upload-link">browse files</span> on your computer
        </p>
        
        <div className="paste-hint">
          <Clipboard size={14} />
          <span>Press <kbd>Ctrl + V</kbd> to paste from clipboard</span>
        </div>

        <div className="upload-formats">
          <span className="format-badge">JPEG</span>
          <span className="format-badge">PNG</span>
          <span className="format-badge">WEBP</span>
          <span className="size-badge">Max 50MB</span>
        </div>
      </div>
    </div>
  );
}
