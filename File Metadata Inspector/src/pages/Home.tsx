import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Files, Image as ImageIcon, FileText, HardDrive, Download, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMetadata } from "../hooks/useMetadata";
import { Sidebar } from "../components/Sidebar";
import { UploadZone } from "../components/UploadZone";
import { MetadataCard } from "../components/MetadataCard";
import { FileInformation } from "../components/FileInformation";
import { ImagePreview } from "../components/ImagePreview";
import { PdfPreview } from "../components/PdfPreview";
import { ImageMetadataPanel, PdfMetadataPanel } from "../components/MetadataTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorCard } from "../components/ErrorCard";
import { LoadingSpinner, MetadataTableSkeleton } from "../components/LoadingSpinner";
import { formatBytes } from "../utils/formatters";

// ─── Export utilities ─────────────────────────────────────────────────────────

function flattenMetadata(file: ReturnType<typeof useMetadata>["files"][number]): Record<string, string> {
  const { fileInfo: fi, metadata: md } = file;
  const base: Record<string, string> = {
    name: fi.name,
    size: formatBytes(fi.size),
    mimeType: fi.mimeType,
    extension: fi.extension,
    lastModified: fi.lastModified.toISOString(),
    uploadedAt: fi.createdAt.toISOString(),
  };

  if (!md) return base;

  if (md.type === "image") {
    return {
      ...base,
      width: String(md.width),
      height: String(md.height),
      aspectRatio: md.aspectRatio,
      resolution: md.resolution ?? "",
      make: md.exif.make ?? "",
      model: md.exif.model ?? "",
      lens: md.exif.lens ?? "",
      iso: md.exif.iso !== undefined ? String(md.exif.iso) : "",
      aperture: md.exif.aperture !== undefined ? String(md.exif.aperture) : "",
      exposureTime: md.exif.exposureTime ?? "",
      focalLength: md.exif.focalLength !== undefined ? String(md.exif.focalLength) : "",
      gpsLatitude: md.exif.gpsLatitude !== undefined ? String(md.exif.gpsLatitude) : "",
      gpsLongitude: md.exif.gpsLongitude !== undefined ? String(md.exif.gpsLongitude) : "",
      dateTaken: md.exif.dateTaken?.toISOString() ?? "",
      flash: md.exif.flash !== undefined ? String(md.exif.flash) : "",
      orientation: md.exif.orientation !== undefined ? String(md.exif.orientation) : "",
    };
  }

  // PDF
  return {
    ...base,
    pageCount: String(md.pageCount),
    pdfVersion: md.pdfVersion ?? "",
    author: md.author ?? "",
    creator: md.creator ?? "",
    producer: md.producer ?? "",
    title: md.title ?? "",
    subject: md.subject ?? "",
    keywords: md.keywords ?? "",
    creationDate: md.creationDate?.toISOString() ?? "",
    modificationDate: md.modificationDate?.toISOString() ?? "",
  };
}

function downloadJSON(files: ReturnType<typeof useMetadata>["files"]) {
  const data = files.map(flattenMetadata);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metadata-export.json";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Metadata downloaded as JSON");
}

function downloadCSV(files: ReturnType<typeof useMetadata>["files"]) {
  if (files.length === 0) return;
  const rows = files.map(flattenMetadata);
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "metadata-export.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Metadata downloaded as CSV");
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export function Home() {
  const {
    files,
    filteredFiles,
    selectedFile,
    selectedFileId,
    stats,
    filterState,
    addFiles,
    removeFile,
    clearAll,
    toggleFavorite,
    setSelectedFileId,
    setFilterState,
  } = useMetadata();

  const uploadZoneRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = useCallback(() => {
    uploadZoneRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA";

      if (!isInput && e.key.toLowerCase() === "u") {
        scrollToUpload();
      }
      if (!isInput && e.key === "Delete" && selectedFileId) {
        removeFile(selectedFileId);
      }
      if (!isInput && e.key.toLowerCase() === "f" && selectedFileId) {
        toggleFavorite(selectedFileId);
      }
      if (e.key === "Escape") {
        // handled by modal components
      }
      // Arrow key navigation
      if (!isInput && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const idx = filteredFiles.findIndex((f) => f.fileInfo.id === selectedFileId);
        const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
        if (filteredFiles[next]) setSelectedFileId(filteredFiles[next].fileInfo.id);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedFileId, filteredFiles, removeFile, toggleFavorite, scrollToUpload, setSelectedFileId]);

  const totalStorageGB = stats.totalStorage / (1024 ** 3);
  const storageDisplay = totalStorageGB >= 0.01
    ? { value: parseFloat(totalStorageGB.toFixed(2)), unit: "GB" }
    : { value: parseFloat((stats.totalStorage / (1024 ** 2)).toFixed(1)), unit: "MB" };

  return (
    <div className="flex flex-col h-full">
      {/* Main 3-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <div className="hidden lg:flex w-72 xl:w-80 flex-col shrink-0 overflow-hidden">
          <Sidebar
            files={files}
            selectedFileId={selectedFileId}
            filterState={filterState}
            onSelectFile={setSelectedFileId}
            onDeleteFile={removeFile}
            onToggleFavorite={toggleFavorite}
            onFilterChange={(partial) => setFilterState((prev) => ({ ...prev, ...partial }))}
            onClearAll={clearAll}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">

            {/* Upload zone */}
            <div ref={uploadZoneRef}>
              <UploadZone onFilesSelected={addFiles} />
            </div>

            {/* Dashboard cards */}
            <section>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetadataCard
                  label="Total Files"
                  value={stats.totalFiles}
                  icon={Files}
                  color="brand"
                  delay={0}
                />
                <MetadataCard
                  label="Images"
                  value={stats.imageCount}
                  icon={ImageIcon}
                  color="emerald"
                  delay={0.05}
                />
                <MetadataCard
                  label="PDFs"
                  value={stats.pdfCount}
                  icon={FileText}
                  color="amber"
                  delay={0.1}
                />
                <MetadataCard
                  label="Storage Used"
                  value={storageDisplay.value}
                  unit={storageDisplay.unit}
                  icon={HardDrive}
                  color="rose"
                  delay={0.15}
                />
              </div>
            </section>

            {/* Export bar */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-surface-800/50 border border-surface-700/50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-surface-400">
                    <span className="font-semibold text-surface-200">{stats.totalFiles}</span>{" "}
                    file{stats.totalFiles !== 1 ? "s" : ""} · {formatBytes(stats.totalStorage)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadJSON(files)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600/80 hover:bg-brand-500 text-white text-xs font-semibold transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      JSON
                    </button>
                    <button
                      onClick={() => downloadCSV(files)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CSV
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-700 hover:bg-red-900/60 hover:text-red-400 text-surface-300 text-xs font-semibold transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected file — metadata detail */}
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key={selectedFile.fileInfo.id}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Status states */}
                  {selectedFile.status === "loading" && (
                    <div className="rounded-2xl bg-surface-800/50 border border-surface-700/50 p-8 flex flex-col items-center gap-4">
                      <LoadingSpinner size="lg" />
                      <p className="text-sm text-surface-400">Extracting metadata…</p>
                      <MetadataTableSkeleton />
                    </div>
                  )}

                  {selectedFile.status === "error" && (
                    <ErrorCard
                      title="Metadata extraction failed"
                      message={selectedFile.error ?? "An unknown error occurred while reading this file."}
                    />
                  )}

                  {selectedFile.status === "success" && (
                    <>
                      {/* Preview */}
                      {selectedFile.fileInfo.mimeType === "application/pdf" ? (
                        <PdfPreview file={selectedFile} />
                      ) : (
                        <ImagePreview file={selectedFile} />
                      )}

                      {/* File info */}
                      <FileInformation file={selectedFile} />

                      {/* Metadata panels */}
                      {selectedFile.metadata?.type === "image" && (
                        <div>
                          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 px-1">EXIF Metadata</h3>
                          <ImageMetadataPanel metadata={selectedFile.metadata} />
                        </div>
                      )}
                      {selectedFile.metadata?.type === "pdf" && (
                        <div>
                          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3 px-1">PDF Metadata</h3>
                          <PdfMetadataPanel metadata={selectedFile.metadata} />
                        </div>
                      )}

                      {/* Copy metadata button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const flat = flattenMetadata(selectedFile);
                            navigator.clipboard.writeText(JSON.stringify(flat, null, 2));
                            toast.success("Metadata copied to clipboard");
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm text-surface-300 font-medium transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Metadata
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState onUploadClick={scrollToUpload} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile sidebar — file list */}
            <div className="lg:hidden">
              {files.length > 0 && (
                <div className="rounded-2xl bg-surface-800/50 border border-surface-700/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-surface-700/40">
                    <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                      Uploaded Files
                    </span>
                  </div>
                  <div className="divide-y divide-surface-700/30">
                    {files.map((f) => (
                      <button
                        key={f.fileInfo.id}
                        onClick={() => setSelectedFileId(f.fileInfo.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedFileId === f.fileInfo.id ? "bg-brand-600/15" : "hover:bg-surface-700/30"}`}
                      >
                        <div className={`w-2 h-2 rounded-full shrink-0 ${f.status === "loading" ? "bg-brand-400 animate-pulse" : f.status === "error" ? "bg-red-400" : "bg-emerald-400"}`} />
                        <span className="text-sm text-surface-300 truncate">{f.fileInfo.name}</span>
                        <span className="ml-auto text-xs text-surface-500 shrink-0">{formatBytes(f.fileInfo.size)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
