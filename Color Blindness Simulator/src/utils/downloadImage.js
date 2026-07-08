/**
 * Downloads a canvas element as an image file.
 * @param {HTMLCanvasElement} canvas 
 * @param {string} mode 
 * @param {string} originalName 
 * @param {string} format 'image/png' or 'image/jpeg'
 */
export function downloadImage(canvas, mode, originalName, format = 'image/png') {
  // Extract base filename without extension
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : 'image';
  const ext = format === 'image/jpeg' ? 'jpg' : 'png';
  const fileName = `${baseName}-${mode}.${ext}`;

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to generate image blob');
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, format, format === 'image/jpeg' ? 0.95 : undefined);
}
