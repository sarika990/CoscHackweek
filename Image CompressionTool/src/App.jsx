import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import UploadArea from './components/UploadArea/UploadArea';
import ImagePreview from './components/ImagePreview/ImagePreview';
import CompressionSlider from './components/CompressionSlider/CompressionSlider';
import ComparisonCard from './components/ComparisonCard/ComparisonCard';
import MetricsPanel from './components/MetricsPanel/MetricsPanel';
import DownloadButton from './components/DownloadButton/DownloadButton';
import HistoryPanel from './components/HistoryPanel/HistoryPanel';
import Toast from './components/Toast/Toast';
import Loader from './components/Loader/Loader';
import Footer from './components/Footer/Footer';

import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { compressImage } from './utils/compressor';

import './App.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  
  // Image states
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  
  // Compression parameters
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState('image/jpeg');
  
  // Output details
  const [compressedData, setCompressedData] = useState(null);
  
  // Session History (stored in local storage or session storage)
  const [history, setHistory] = useLocalStorage('optipress-history', []);
  
  // Loader & Notification
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  // Cleanup Object URLs to prevent memory leaks
  const cleanUpUrls = () => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
    if (compressedData?.previewUrl) {
      URL.revokeObjectURL(compressedData.previewUrl);
    }
    setCompressedData(null);
  };

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Perform Image Compression on Quality / Format / File Changes
  useEffect(() => {
    if (!file) return;

    let active = true;
    setIsLoading(true);

    const performCompression = async () => {
      try {
        const result = await compressImage({ file, quality, format });
        
        if (!active) {
          // If execution changed while processing, revoke this unused previewUrl
          URL.revokeObjectURL(result.previewUrl);
          return;
        }

        // Revoke the *previous* compressed preview URL before saving new one
        if (compressedData?.previewUrl) {
          URL.revokeObjectURL(compressedData.previewUrl);
        }

        setCompressedData(result);
        setIsLoading(false);
      } catch (err) {
        if (active) {
          showToast(err.message || 'Compression engine encountered an error.', 'error');
          setIsLoading(false);
        }
      }
    };

    // Debounce compression for slider drag speed
    const delayTimer = setTimeout(() => {
      performCompression();
    }, 250);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [file, quality, format]);

  // Handle New Image Selection
  const handleImageSelected = (selectedFile) => {
    cleanUpUrls();
    setFile(selectedFile);
    
    // Create new original URL
    const originalPreviewUrl = URL.createObjectURL(selectedFile);
    setOriginalUrl(originalPreviewUrl);
  };

  // Handle Reset / Clear
  const handleReset = () => {
    cleanUpUrls();
    setFile(null);
  };

  // Add Item to History on successful Download
  const handleDownloadStart = (finalName) => {
    if (!compressedData) return;

    const historyItem = {
      id: Date.now(),
      file: { name: finalName },
      format: compressedData.format,
      reductionPercent: compressedData.reductionPercent,
      compressedSize: compressedData.compressedSize,
      previewUrl: compressedData.previewUrl, // Keep in session history
    };

    setHistory((prev) => {
      // Limit history to last 6 items
      const updated = [historyItem, ...prev];
      return updated.slice(0, 6);
    });
    showToast('Download started successfully!', 'success');
  };

  const handleSelectHistory = (item) => {
    // History items contain the preview. Since it's local URL in current session, it will load instantly.
    showToast('Loading history snapshot...', 'success');
    // Load historical compression preview (simulated by setting stats directly)
    setCompressedData({
      ...item,
      originalSize: item.compressedSize / (1 - item.reductionPercent / 100),
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Session history cleared.', 'success');
  };

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && file) {
        handleReset();
        showToast('Workspace reset.', 'success');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file]);

  return (
    <div className="app-layout">
      <div className="background-decor">
        <div className="glow-circle gc-1"></div>
        <div className="glow-circle gc-2"></div>
      </div>

      <div className="container">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="main-content">
          {!file ? (
            <div className="upload-view-wrapper animate-fade-in-up">
              <UploadArea 
                onImageSelected={handleImageSelected} 
                onError={(msg) => showToast(msg, 'error')} 
              />
              <div className="empty-state-sidebar">
                <HistoryPanel 
                  history={history} 
                  onSelectHistory={handleSelectHistory} 
                  onClearHistory={handleClearHistory} 
                />
              </div>
            </div>
          ) : (
            <div className="workspace-layout animate-fade-in">
              {/* Top Row: Original vs Compressed side-by-side */}
              <div className="previews-section">
                <ImagePreview 
                  title="Original Image" 
                  imageUrl={originalUrl} 
                  file={file}
                  onReset={handleReset}
                />
                
                <ImagePreview 
                  title="Optimized Preview" 
                  imageUrl={compressedData?.previewUrl} 
                  file={file}
                  compressedData={compressedData}
                  isCompressed={true}
                  onDownload={() => {
                    const downloadBtn = document.querySelector('.main-download-btn');
                    if (downloadBtn) downloadBtn.click();
                  }}
                />
              </div>

              {/* Split comparison slider view */}
              {originalUrl && compressedData?.previewUrl && (
                <div className="interactive-section">
                  <ComparisonCard 
                    originalUrl={originalUrl} 
                    compressedUrl={compressedData.previewUrl} 
                  />
                </div>
              )}

              {/* Sidebar controls and performance statistics */}
              <div className="dashboard-grid">
                <div className="sidebar-column">
                  <CompressionSlider 
                    quality={quality} 
                    onQualityChange={setQuality}
                    format={format}
                    onFormatChange={setFormat}
                    isProcessing={isLoading}
                  />

                  <DownloadButton 
                    originalFileName={file.name}
                    compressedBlob={compressedData?.blob}
                    compressedFormat={format}
                    compressedQuality={quality}
                    onDownloadStart={handleDownloadStart}
                  />
                </div>

                <div className="metrics-column">
                  <MetricsPanel 
                    compressedData={compressedData} 
                    onCopy={(msg) => showToast(msg, 'success')} 
                  />

                  <HistoryPanel 
                    history={history} 
                    onSelectHistory={handleSelectHistory} 
                    onClearHistory={handleClearHistory} 
                  />
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Loading Overlay */}
      {isLoading && <Loader />}

      {/* Notification Toast */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'error' })} 
      />
    </div>
  );
}
