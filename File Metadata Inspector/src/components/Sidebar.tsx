import { motion, AnimatePresence } from "framer-motion";
import {
  FileImage,
  FileText,
  Trash2,
  Heart,
  Clock,
  Filter,
  Search,
  X,
  Star,
  ChevronRight,
} from "lucide-react";
import type { UploadedFile, FilterState } from "../types/metadata";
import { formatBytes, formatRelativeTime } from "../utils/formatters";
import { cn } from "../lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface SidebarProps {
  files: UploadedFile[];
  selectedFileId: string | null;
  filterState: FilterState;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onFilterChange: (filter: Partial<FilterState>) => void;
  onClearAll: () => void;
}

const FILE_TYPE_TABS = [
  { value: "all" as const, label: "All" },
  { value: "image" as const, label: "Images" },
  { value: "pdf" as const, label: "PDFs" },
];

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === "application/pdf") {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25">
        <FileText className="w-5 h-5 text-amber-400" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25">
      <FileImage className="w-5 h-5 text-brand-400" />
    </div>
  );
}

function StatusDot({ status }: { status: UploadedFile["status"] }) {
  if (status === "loading") return <LoadingSpinner size="sm" className="!w-3 !h-3" />;
  if (status === "error") return <span className="w-2 h-2 rounded-full bg-red-400" />;
  return <span className="w-2 h-2 rounded-full bg-emerald-400" />;
}

export function Sidebar({
  files,
  selectedFileId,
  filterState,
  onSelectFile,
  onDeleteFile,
  onToggleFavorite,
  onFilterChange,
  onClearAll,
}: SidebarProps) {
  const filteredFiles = files.filter((f) => {
    if (filterState.favoritesOnly && !f.isFavorite) return false;
    if (filterState.fileType !== "all") {
      const isPdf = f.fileInfo.mimeType === "application/pdf";
      if (filterState.fileType === "pdf" && !isPdf) return false;
      if (filterState.fileType === "image" && isPdf) return false;
    }
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      if (!f.fileInfo.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <aside className="flex flex-col h-full bg-surface-900/60 border-r border-surface-700/40">
      {/* Header */}
      <div className="px-4 py-4 border-b border-surface-700/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-surface-500" />
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Upload History
            </span>
          </div>
          {files.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-surface-500 hover:text-red-400 transition-colors font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={filterState.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-surface-800 border border-surface-700 text-surface-200 placeholder:text-surface-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          {filterState.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 py-3 border-b border-surface-700/40">
        <div className="flex gap-1 p-1 rounded-xl bg-surface-800/60">
          {FILE_TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ fileType: tab.value })}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                filterState.fileType === tab.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-surface-400 hover:text-surface-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onFilterChange({ favoritesOnly: !filterState.favoritesOnly })}
          className={cn(
            "flex items-center gap-2 w-full mt-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
            filterState.favoritesOnly
              ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
              : "text-surface-500 hover:text-surface-300 hover:bg-surface-800"
          )}
        >
          <Star className={cn("w-3.5 h-3.5", filterState.favoritesOnly && "fill-current")} />
          Favorites only
          {filterState.favoritesOnly && (
            <Filter className="w-3 h-3 ml-auto" />
          )}
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <FileImage className="w-8 h-8 text-surface-700 mb-2" />
              <p className="text-sm text-surface-500">
                {files.length === 0 ? "No files uploaded yet" : "No files match the filter"}
              </p>
            </div>
          ) : (
            filteredFiles.map((file, index) => (
              <motion.div
                key={file.fileInfo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.04 }}
              >
                <div
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group border-b border-surface-700/20",
                    selectedFileId === file.fileInfo.id
                      ? "bg-brand-600/15 border-l-2 border-l-brand-500"
                      : "hover:bg-surface-800/40 border-l-2 border-l-transparent"
                  )}
                  onClick={() => onSelectFile(file.fileInfo.id)}
                >
                  <FileIcon mimeType={file.fileInfo.mimeType} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <StatusDot status={file.status} />
                      <p className="text-sm font-medium text-surface-200 truncate leading-tight">
                        {file.fileInfo.name}
                      </p>
                    </div>
                    <p className="text-xs text-surface-500">
                      {formatBytes(file.fileInfo.size)} · {formatRelativeTime(file.uploadedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(file.fileInfo.id); }}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        file.isFavorite
                          ? "text-amber-400 bg-amber-500/20"
                          : "text-surface-500 hover:text-amber-400 hover:bg-surface-700"
                      )}
                      title="Toggle favorite"
                    >
                      <Heart className={cn("w-3.5 h-3.5", file.isFavorite && "fill-current")} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(file.fileInfo.id); }}
                      className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-surface-700 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectedFileId === file.fileInfo.id && (
                    <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer count */}
      {files.length > 0 && (
        <div className="px-4 py-3 border-t border-surface-700/40">
          <p className="text-xs text-surface-500 text-center">
            {filteredFiles.length} of {files.length} file{files.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </aside>
  );
}
