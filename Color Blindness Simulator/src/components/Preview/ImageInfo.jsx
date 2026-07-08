import React from 'react';
import { useSimulator } from '../../context/SimulatorContext';
import { FileText, Maximize, HardDrive } from 'lucide-react';

export default function ImageInfo() {
  const { imageName, imageSize, imageResolution } = useSimulator();

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-wrap gap-4 items-center px-4 py-2 bg-glass-card border border-glass-border rounded-xl text-xs text-gray-400 backdrop-blur-md">
      <div className="flex items-center gap-1.5 min-w-0">
        <FileText className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span className="font-medium text-white truncate max-w-[150px] md:max-w-[250px]" title={imageName}>
          {imageName}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <Maximize className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span>
          {imageResolution ? `${imageResolution.width} × ${imageResolution.height} px` : 'Loading...'}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

      <div className="flex items-center gap-1.5">
        <HardDrive className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span>{formatSize(imageSize)}</span>
      </div>
    </div>
  );
}
