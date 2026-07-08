import React, { useRef, useState, useEffect } from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { Upload, Clipboard, FileImage, AlertCircle } from 'lucide-react';

export default function UploadBox() {
  const { handleImageFile, isLoading } = useSimulator();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleImageFile]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`w-full max-w-2xl h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 backdrop-blur-md ${
        isDragActive
          ? 'border-accent bg-primary/10 shadow-glow'
          : 'border-white/10 hover:border-primary/50 bg-glass-card hover:bg-white/5 hover:shadow-[0_0_20px_rgba(34,197,94,0.05)]'
      }`}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
        <Upload className="w-8 h-8 text-accent" />
      </div>

      <h3 className="text-white font-bold text-lg mb-1">
        Drag & drop your image here
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        or <span className="text-accent underline font-semibold">browse computer</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <FileImage className="w-3.5 h-3.5 text-gray-400" />
          PNG, JPG, WEBP
        </span>
        <span className="flex items-center gap-1.5">
          <Clipboard className="w-3.5 h-3.5 text-gray-400" />
          Paste image (Ctrl + V)
        </span>
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
          Max 10MB
        </span>
      </div>
    </div>
  );
}
