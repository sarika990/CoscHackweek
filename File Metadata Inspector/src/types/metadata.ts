// Core types for File Metadata Inspector

export type SupportedFileType = "image" | "pdf";

export type ImageExtension = "jpg" | "jpeg" | "png" | "gif" | "webp";
export type PdfExtension = "pdf";
export type FileExtension = ImageExtension | PdfExtension;

export interface ExifData {
  make?: string;
  model?: string;
  lens?: string;
  iso?: number;
  aperture?: number;
  exposureTime?: string;
  focalLength?: number;
  gpsLatitude?: number;
  gpsLongitude?: number;
  dateTaken?: Date;
  flash?: boolean;
  orientation?: number;
  colorSpace?: string;
  whiteBalance?: string;
  software?: string;
}

export interface ImageMetadata {
  type: "image";
  width: number;
  height: number;
  aspectRatio: string;
  resolution?: string;
  exif: ExifData;
}

export interface PdfMetadata {
  type: "pdf";
  pageCount: number;
  pdfVersion?: string;
  author?: string;
  creator?: string;
  producer?: string;
  title?: string;
  subject?: string;
  keywords?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface BaseFileInfo {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
  lastModified: Date;
  createdAt: Date;
  objectUrl: string;
}

export interface UploadedFile {
  fileInfo: BaseFileInfo;
  metadata: ImageMetadata | PdfMetadata | null;
  status: "loading" | "success" | "error";
  error?: string;
  isFavorite: boolean;
  uploadedAt: Date;
}

export interface DashboardStats {
  totalFiles: number;
  imageCount: number;
  pdfCount: number;
  totalStorage: number;
}

export type SortField = "name" | "size" | "type" | "uploadedAt" | "lastModified";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  fileType: "all" | "image" | "pdf";
  search: string;
  favoritesOnly: boolean;
}

export interface MetadataRow {
  key: string;
  label: string;
  value: string;
  copyable: boolean;
}
