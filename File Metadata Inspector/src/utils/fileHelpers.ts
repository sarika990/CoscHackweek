import type { FileExtension, SupportedFileType } from "../types/metadata";

const ALLOWED_IMAGE_TYPES: Record<string, FileExtension> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

const ALLOWED_PDF_TYPES: Record<string, FileExtension> = {
  "application/pdf": "pdf",
};

const ALL_ALLOWED_TYPES = { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES };
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate a file for type and size constraints
 */
export function validateFile(file: File): ValidationResult {
  if (!ALL_ALLOWED_TYPES[file.type]) {
    const ext = getFileExtension(file.name).toLowerCase();
    const validExtensions = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
    if (!validExtensions.includes(ext)) {
      return {
        valid: false,
        reason: `Unsupported file type: ${file.type || ext}. Supported: JPG, PNG, GIF, WEBP, PDF`,
      };
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      reason: `File size exceeds the 50 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
    };
  }

  if (file.size === 0) {
    return { valid: false, reason: "File appears to be empty" };
  }

  return { valid: true };
}

/**
 * Get the file extension from a filename (without dot)
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Determine the file type category from MIME type or extension
 */
export function getFileType(file: File): SupportedFileType {
  if (ALLOWED_IMAGE_TYPES[file.type]) return "image";

  const ext = getFileExtension(file.name);
  if (ext === "pdf") return "pdf";

  return "image"; // fallback
}

/**
 * Generate a stable unique ID for a file
 */
export function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Check if a file has already been uploaded by checking name + size + lastModified
 */
export function isDuplicate(file: File, existingNames: Set<string>): boolean {
  const key = `${file.name}-${file.size}-${file.lastModified}`;
  return existingNames.has(key);
}

/**
 * Get the deduplication key for a file
 */
export function getFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Revoke an object URL safely
 */
export function revokeObjectUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Get a human-readable MIME type label
 */
export function getMimeLabel(mimeType: string): string {
  const labels: Record<string, string> = {
    "image/jpeg": "JPEG Image",
    "image/jpg": "JPEG Image",
    "image/png": "PNG Image",
    "image/gif": "GIF Animation",
    "image/webp": "WebP Image",
    "application/pdf": "PDF Document",
  };
  return labels[mimeType] ?? mimeType;
}
