/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement Promise.
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Avoid CORS tainted canvas issues
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load image. The file may be corrupt or inaccessible.'));
    img.src = src;
  });
}
