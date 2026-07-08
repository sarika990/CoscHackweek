import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import type {
  UploadedFile,
  DashboardStats,
  FilterState,
  SortState,
} from "../types/metadata";
import { validateFile, generateFileId, getFileType, getFileKey, revokeObjectUrl } from "../utils/fileHelpers";
import { extractMetadata } from "../utils/metadata";

const DEFAULT_FILTER: FilterState = {
  fileType: "all",
  search: "",
  favoritesOnly: false,
};

const DEFAULT_SORT: SortState = {
  field: "uploadedAt",
  direction: "desc",
};

export function useMetadata() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT);

  // Track file keys to detect duplicates
  const fileKeysRef = useRef<Set<string>>(new Set());

  /**
   * Add one or more files, validate, extract metadata
   */
  const addFiles = useCallback(async (rawFiles: File[]) => {
    const newUploads: UploadedFile[] = [];

    for (const file of rawFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.reason}`);
        continue;
      }

      const key = getFileKey(file);
      if (fileKeysRef.current.has(key)) {
        toast.warning(`${file.name} is already uploaded`);
        continue;
      }

      fileKeysRef.current.add(key);

      const objectUrl = URL.createObjectURL(file);
      const id = generateFileId(file);
      const now = new Date();

      const uploadedFile: UploadedFile = {
        fileInfo: {
          id,
          name: file.name,
          size: file.size,
          mimeType: file.type,
          extension: file.name.split(".").pop()?.toLowerCase() ?? "",
          lastModified: new Date(file.lastModified),
          createdAt: now,
          objectUrl,
        },
        metadata: null,
        status: "loading",
        isFavorite: false,
        uploadedAt: now,
      };

      newUploads.push(uploadedFile);
    }

    if (newUploads.length === 0) return;

    setFiles((prev) => [...newUploads, ...prev]);

    // Auto-select first new file
    if (newUploads.length > 0) {
      setSelectedFileId(newUploads[0].fileInfo.id);
    }

    // Extract metadata asynchronously for each file
    for (const uploaded of newUploads) {
      const { id, objectUrl } = uploaded.fileInfo;
      const rawFile = rawFiles.find(
        (f) => generateFileId(f) === id || (f.name === uploaded.fileInfo.name && f.size === uploaded.fileInfo.size)
      )!;

      extractMetadata(rawFile, objectUrl)
        .then((metadata) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.fileInfo.id === id ? { ...f, metadata, status: "success" } : f
            )
          );
        })
        .catch((err) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.fileInfo.id === id
                ? { ...f, status: "error", error: err.message ?? "Failed to extract metadata" }
                : f
            )
          );
          toast.error(`Failed to read metadata for ${uploaded.fileInfo.name}`);
        });
    }

    const label = newUploads.length === 1 ? newUploads[0].fileInfo.name : `${newUploads.length} files`;
    toast.success(`Uploaded ${label}`);
  }, []);

  /**
   * Remove a file by ID and revoke its object URL
   */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.fileInfo.id === id);
      if (target) {
        revokeObjectUrl(target.fileInfo.objectUrl);
        const key = `${target.fileInfo.name}-${target.fileInfo.size}-${target.fileInfo.lastModified.getTime()}`;
        fileKeysRef.current.delete(key);
      }
      return prev.filter((f) => f.fileInfo.id !== id);
    });

    setSelectedFileId((prev) => (prev === id ? null : prev));
    toast.success("File removed");
  }, []);

  /**
   * Clear all uploaded files
   */
  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => revokeObjectUrl(f.fileInfo.objectUrl));
      return [];
    });
    fileKeysRef.current.clear();
    setSelectedFileId(null);
    toast.success("All files cleared");
  }, []);

  /**
   * Toggle favorite status for a file
   */
  const toggleFavorite = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.fileInfo.id === id ? { ...f, isFavorite: !f.isFavorite } : f
      )
    );
  }, []);

  /**
   * Get the currently selected file
   */
  const selectedFile = files.find((f) => f.fileInfo.id === selectedFileId) ?? null;

  /**
   * Compute dashboard statistics
   */
  const stats: DashboardStats = {
    totalFiles: files.length,
    imageCount: files.filter((f) => getFileType({ type: f.fileInfo.mimeType } as File) === "image").length,
    pdfCount: files.filter((f) => f.fileInfo.mimeType === "application/pdf").length,
    totalStorage: files.reduce((acc, f) => acc + f.fileInfo.size, 0),
  };

  /**
   * Filtered and sorted files based on current filter/sort state
   */
  const filteredFiles = files
    .filter((f) => {
      if (filterState.favoritesOnly && !f.isFavorite) return false;
      if (filterState.fileType !== "all") {
        const fType = getFileType({ type: f.fileInfo.mimeType } as File);
        if (fType !== filterState.fileType) return false;
      }
      if (filterState.search) {
        const q = filterState.search.toLowerCase();
        if (!f.fileInfo.name.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const { field, direction } = sortState;
      let comparison = 0;

      switch (field) {
        case "name":
          comparison = a.fileInfo.name.localeCompare(b.fileInfo.name);
          break;
        case "size":
          comparison = a.fileInfo.size - b.fileInfo.size;
          break;
        case "type":
          comparison = a.fileInfo.mimeType.localeCompare(b.fileInfo.mimeType);
          break;
        case "uploadedAt":
          comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
          break;
        case "lastModified":
          comparison = a.fileInfo.lastModified.getTime() - b.fileInfo.lastModified.getTime();
          break;
      }

      return direction === "asc" ? comparison : -comparison;
    });

  return {
    files,
    filteredFiles,
    selectedFile,
    selectedFileId,
    stats,
    filterState,
    sortState,
    addFiles,
    removeFile,
    clearAll,
    toggleFavorite,
    setSelectedFileId,
    setFilterState,
    setSortState,
  };
}
