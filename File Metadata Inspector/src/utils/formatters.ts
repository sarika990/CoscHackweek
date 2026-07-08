import { format, formatDistanceToNow } from "date-fns";

/**
 * Format bytes into a human-readable string (e.g., "1.2 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format a date as "Jan 8, 2026" with relative time
 */
export function formatDate(date: Date | undefined | null): string {
  if (!date || isNaN(date.getTime())) return "Not Available";
  return format(date, "MMM d, yyyy · h:mm a");
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format GPS coordinates into a readable DMS string
 */
export function formatGPS(lat?: number, lon?: number): string {
  if (lat === undefined || lon === undefined) return "Not Available";

  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";

  const absLat = Math.abs(lat);
  const absLon = Math.abs(lon);

  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = ((absLat - latDeg) * 60 - latMin) * 60;

  const lonDeg = Math.floor(absLon);
  const lonMin = Math.floor((absLon - lonDeg) * 60);
  const lonSec = ((absLon - lonDeg) * 60 - lonMin) * 60;

  return `${latDeg}°${latMin}'${latSec.toFixed(1)}"${latDir}, ${lonDeg}°${lonMin}'${lonSec.toFixed(1)}"${lonDir}`;
}

/**
 * Calculate and format aspect ratio from width and height
 */
export function formatAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Format exposure time (e.g., 0.004 -> "1/250s")
 */
export function formatExposureTime(value?: string | number): string {
  if (!value) return "Not Available";

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  if (num >= 1) return `${num}s`;
  const denominator = Math.round(1 / num);
  return `1/${denominator}s`;
}

/**
 * Format f-number aperture (e.g., 1.8 -> "f/1.8")
 */
export function formatAperture(value?: number): string {
  if (!value) return "Not Available";
  return `f/${value.toFixed(1)}`;
}

/**
 * Format focal length with unit
 */
export function formatFocalLength(value?: number): string {
  if (!value) return "Not Available";
  return `${value} mm`;
}

/**
 * Format ISO value
 */
export function formatISO(value?: number): string {
  if (!value) return "Not Available";
  return `ISO ${value}`;
}

/**
 * Format flash state
 */
export function formatFlash(value?: boolean): string {
  if (value === undefined) return "Not Available";
  return value ? "Flash Fired" : "Flash Did Not Fire";
}

/**
 * Format orientation code to readable label
 */
export function formatOrientation(value?: number): string {
  const orientations: Record<number, string> = {
    1: "Normal (0°)",
    2: "Mirrored Horizontal",
    3: "Rotated 180°",
    4: "Mirrored Vertical",
    5: "Mirrored + Rotated 90° CCW",
    6: "Rotated 90° CW",
    7: "Mirrored + Rotated 90° CW",
    8: "Rotated 90° CCW",
  };
  return value !== undefined ? (orientations[value] ?? `Code ${value}`) : "Not Available";
}

/**
 * Truncate a string to a max length
 */
export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 3) + "…" : str;
}
