import { simulateProtanopia } from '../filters/simulateProtanopia';
import { simulateDeuteranopia } from '../filters/simulateDeuteranopia';
import { simulateTritanopia } from '../filters/simulateTritanopia';
import { simulateAchromatopsia } from '../filters/simulateAchromatopsia';

/**
 * Applies color deficiency filter to a canvas context's pixel data.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} width 
 * @param {number} height 
 * @param {string} mode 
 */
export function applyFilter(ctx, width, height, mode) {
  if (mode === 'original') return;

  const imageData = ctx.getImageData(0, 0, width, height);

  switch (mode) {
    case 'protanopia':
      simulateProtanopia(imageData);
      break;
    case 'deuteranopia':
      simulateDeuteranopia(imageData);
      break;
    case 'tritanopia':
      simulateTritanopia(imageData);
      break;
    case 'achromatopsia':
      simulateAchromatopsia(imageData);
      break;
    default:
      console.warn(`Unknown simulation mode: ${mode}`);
      return;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Creates a processed canvas at full image resolution.
 * @param {HTMLImageElement} img 
 * @param {string} mode 
 * @returns {HTMLCanvasElement}
 */
export function getProcessedCanvas(img, mode) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.drawImage(img, 0, 0);
    applyFilter(ctx, img.naturalWidth, img.naturalHeight, mode);
  }
  
  return canvas;
}
