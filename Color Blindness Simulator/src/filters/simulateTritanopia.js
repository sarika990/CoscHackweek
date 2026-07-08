import { COLOR_MATRICES } from './colorMatrices';

/**
 * Simulates Tritanopia (blue cone deficiency) on canvas ImageData.
 * Modifies the pixel array in-place for performance.
 * @param {ImageData} imageData 
 */
export function simulateTritanopia(imageData) {
  const data = imageData.data;
  const len = data.length;
  const m = COLOR_MATRICES.tritanopia;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i]     = m[0] * r + m[1] * g + m[2] * b;     // R'
    data[i + 1] = m[3] * r + m[4] * g + m[5] * b;     // G'
    data[i + 2] = m[6] * r + m[7] * g + m[8] * b;     // B'
  }
}
