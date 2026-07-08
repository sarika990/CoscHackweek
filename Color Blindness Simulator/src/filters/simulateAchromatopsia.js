import { COLOR_MATRICES } from './colorMatrices';

/**
 * Simulates Achromatopsia (total color deficiency) on canvas ImageData.
 * Modifies the pixel array in-place for performance.
 * @param {ImageData} imageData 
 */
export function simulateAchromatopsia(imageData) {
  const data = imageData.data;
  const len = data.length;
  const m = COLOR_MATRICES.achromatopsia;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = m[0] * r + m[1] * g + m[2] * b;

    data[i]     = gray; // R'
    data[i + 1] = gray; // G'
    data[i + 2] = gray; // B'
  }
}
