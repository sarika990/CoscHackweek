import type { ExifData, ImageMetadata, PdfMetadata } from "../types/metadata";
import { getFileType } from "./fileHelpers";

/**
 * Extract metadata from an image file using exifr
 * Falls back gracefully if no EXIF data is present
 */
export async function extractImageMetadata(file: File, objectUrl: string): Promise<ImageMetadata> {
  const dimensions = await getImageDimensions(objectUrl);

  let exif: ExifData = {};

  try {
    // Dynamically import exifr to avoid SSR issues
    const exifr = await import("exifr");
    const raw = await exifr.parse(file, {
      tiff: true,
      xmp: false,
      icc: false,
      iptc: false,
      gps: true,
      reviveValues: true,
      sanitize: true,
    });

    if (raw) {
      exif = {
        make: raw.Make,
        model: raw.Model,
        lens: raw.LensModel ?? raw.Lens,
        iso: raw.ISO,
        aperture: raw.FNumber,
        exposureTime: raw.ExposureTime !== undefined ? String(raw.ExposureTime) : undefined,
        focalLength: raw.FocalLength,
        gpsLatitude: raw.latitude,
        gpsLongitude: raw.longitude,
        dateTaken: raw.DateTimeOriginal ?? raw.CreateDate,
        flash: typeof raw.Flash === "boolean" ? raw.Flash : raw.Flash !== undefined ? raw.Flash !== 0 : undefined,
        orientation: raw.Orientation,
        colorSpace: raw.ColorSpace !== undefined ? String(raw.ColorSpace) : undefined,
        whiteBalance: raw.WhiteBalance !== undefined ? String(raw.WhiteBalance) : undefined,
        software: raw.Software,
      };
    }
  } catch {
    // EXIF extraction failure is non-fatal — just leave exif empty
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(dimensions.width, dimensions.height);
  const aspectRatio = `${dimensions.width / divisor}:${dimensions.height / divisor}`;

  return {
    type: "image",
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio,
    resolution: dimensions.width > 0 ? `${dimensions.width} × ${dimensions.height} px` : undefined,
    exif,
  };
}

/**
 * Extract metadata from a PDF file using pdfjs-dist
 */
export async function extractPdfMetadata(file: File): Promise<PdfMetadata> {
  const arrayBuffer = await file.arrayBuffer();

  const pdfjsLib = await import("pdfjs-dist");

  // Set up worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const meta = await pdfDoc.getMetadata();
  const info = meta.info as Record<string, unknown>;

  const parseDate = (val: unknown): Date | undefined => {
    if (!val) return undefined;
    const str = String(val);
    // PDF dates are like "D:20240101120000+05'30'"
    const match = str.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (match) {
      const [, y, mo, d, h, mi, s] = match;
      return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}`);
    }
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  await pdfDoc.destroy();

  return {
    type: "pdf",
    pageCount: pdfDoc.numPages,
    pdfVersion: pdfDoc.isPureXfa ? "XFA" : String(info?.PDFFormatVersion ?? "Unknown"),
    author: info?.Author ? String(info.Author) : undefined,
    creator: info?.Creator ? String(info.Creator) : undefined,
    producer: info?.Producer ? String(info.Producer) : undefined,
    title: info?.Title ? String(info.Title) : undefined,
    subject: info?.Subject ? String(info.Subject) : undefined,
    keywords: info?.Keywords ? String(info.Keywords) : undefined,
    creationDate: parseDate(info?.CreationDate),
    modificationDate: parseDate(info?.ModDate),
  };
}

/**
 * Dispatch metadata extraction based on file type
 */
export async function extractMetadata(
  file: File,
  objectUrl: string
): Promise<ImageMetadata | PdfMetadata> {
  const fileType = getFileType(file);

  if (fileType === "pdf") {
    return extractPdfMetadata(file);
  }

  return extractImageMetadata(file, objectUrl);
}

/**
 * Get image dimensions from an object URL
 */
function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}
