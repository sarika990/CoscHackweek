import React, { useState } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { downloadImage } from '../../utils/downloadImage';
import { getProcessedCanvas } from '../../utils/canvasUtils';
import { Download, ChevronDown, Check, Loader2 } from 'lucide-react';

export default function DownloadButton() {
  const { image, activeMode, imageName, showNotification } = useSimulator();
  const [format, setFormat] = useState('image/png'); // image/png or 'image/jpeg'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!image) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    // Timeout gives canvas a brief moment to cycle loop if image is huge
    setTimeout(() => {
      try {
        const canvas = getProcessedCanvas(image, activeMode);
        downloadImage(canvas, activeMode, imageName, format);
        showNotification('success', `Export completed! Check your downloads.`);
      } catch (err) {
        showNotification('error', `Download failed: ${err.message}`);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="relative inline-flex items-center rounded-xl bg-primary border border-primary/50 text-white shadow-glow hover:shadow-glow-accent transition-all">
      {/* Main Download Button */}
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="flex items-center gap-2 px-5 py-3 text-sm font-bold border-r border-white/20 hover:bg-white/10 rounded-l-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <Download className="w-4 h-4 text-white" />
        )}
        {isExporting ? 'Generating...' : `Export in ${format === 'image/png' ? 'PNG' : 'JPEG'}`}
      </button>

      {/* Format Switch Trigger */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        disabled={isExporting}
        className="px-3 py-3 hover:bg-white/10 rounded-r-xl transition-colors cursor-pointer disabled:opacity-50"
        aria-label="Select export format"
      >
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {/* Format Options Dropdown */}
      {dropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 w-36 bg-brand-dark/95 border border-glass-border p-1.5 rounded-xl shadow-xl z-20 backdrop-blur-xl flex flex-col gap-0.5">
            <button
              onClick={() => {
                setFormat('image/png');
                setDropdownOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>PNG (Lossless)</span>
              {format === 'image/png' && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
            <button
              onClick={() => {
                setFormat('image/jpeg');
                setDropdownOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span>JPEG (Compact)</span>
              {format === 'image/jpeg' && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
