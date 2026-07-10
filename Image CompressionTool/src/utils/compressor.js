/**
 * High-Performance Image Compression Engine using Canvas API
 */

export const compressImage = ({ file, quality, format, targetWidth, targetHeight }) => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate scale and aspect ratio
          let width = img.naturalWidth;
          let height = img.naturalHeight;

          if (targetWidth && targetHeight) {
            width = targetWidth;
            height = targetHeight;
          } else {
            // Cap max dimensions to prevent browser freeze/memory crash (e.g. max 4096px)
            const MAX_DIM = 4096;
            if (width > MAX_DIM || height > MAX_DIM) {
              const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
          }

          // Handle PNG transparency if converting to JPEG
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to requested format and quality
          const mimeType = format;
          const compressionQuality = format === 'image/png' ? undefined : quality / 100;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas compression failed'));
                return;
              }

              const endTime = performance.now();
              const processingTime = Math.round(endTime - startTime);
              const compressedSize = blob.size;

              // Calculate metrics
              const originalSize = file.size;
              const spaceSaved = Math.max(0, originalSize - compressedSize);
              const reductionPercent = originalSize > 0 
                ? Math.round((spaceSaved / originalSize) * 100) 
                : 0;
              const ratio = compressedSize > 0 
                ? (originalSize / compressedSize).toFixed(2) 
                : '1.00';

              // Quality Assessment
              let qualityLoss = 0;
              let visualScore = 100;
              let qualityLabel = 'Excellent';

              if (format !== 'image/png') {
                qualityLoss = 100 - quality;
                // Visual score drops faster below quality 50
                visualScore = Math.max(
                  15,
                  Math.round(quality >= 70 ? quality : quality * 1.1 - (70 - quality) * 0.5)
                );
              } else {
                qualityLoss = 0;
                visualScore = 100;
              }

              if (visualScore >= 90) {
                qualityLabel = 'Excellent';
              } else if (visualScore >= 75) {
                qualityLabel = 'Very Good';
              } else if (visualScore >= 60) {
                qualityLabel = 'Good';
              } else if (visualScore >= 40) {
                qualityLabel = 'Acceptable';
              } else {
                qualityLabel = 'Poor';
              }

              const previewUrl = URL.createObjectURL(blob);

              resolve({
                blob,
                previewUrl,
                width,
                height,
                originalSize,
                compressedSize,
                spaceSaved,
                reductionPercent,
                compressionRatio: ratio,
                processingTime,
                qualityLoss,
                visualScore,
                qualityLabel,
                format,
              });
            },
            mimeType,
            compressionQuality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image resource'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Format bytes to readable strings
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
