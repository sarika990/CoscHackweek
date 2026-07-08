import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Layers, Download, AlertTriangle } from "lucide-react";
import type { UploadedFile } from "../types/metadata";
import { formatBytes } from "../utils/formatters";

interface PdfPreviewProps {
  file: UploadedFile;
}

export function PdfPreview({ file }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metadata = file.metadata?.type === "pdf" ? file.metadata : null;

  useEffect(() => {
    let cancelled = false;

    async function renderFirstPage() {
      if (!canvasRef.current) return;
      setRendered(false);
      setError(null);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const response = await fetch(file.fileInfo.objectUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdfDoc.getPage(1);

        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        if (!cancelled) setRendered(true);
        await pdfDoc.destroy();
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to render PDF preview");
      }
    }

    renderFirstPage();
    return () => { cancelled = true; };
  }, [file.fileInfo.objectUrl]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = file.fileInfo.objectUrl;
    a.download = file.fileInfo.name;
    a.click();
  };

  return (
    <motion.div
      className="rounded-2xl bg-surface-800/50 border border-surface-700/50 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">PDF Preview</span>
          {metadata && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300">
              <Layers className="w-3 h-3" />
              {metadata.pageCount} {metadata.pageCount === 1 ? "page" : "pages"}
            </span>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors"
          title="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Canvas area */}
      <div className="relative bg-surface-900/60 min-h-64 flex items-center justify-center overflow-auto max-h-96">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-surface-300 mb-1">Preview unavailable</p>
              <p className="text-xs text-surface-500">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {!rendered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-amber-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-surface-500">Rendering preview…</p>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="max-w-full object-contain transition-opacity duration-300"
              style={{ opacity: rendered ? 1 : 0 }}
            />
          </>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-surface-700/40 bg-surface-800/30">
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-mono">{file.fileInfo.name}</span>
        </div>
        <span className="text-xs text-surface-500">{formatBytes(file.fileInfo.size)}</span>
      </div>
    </motion.div>
  );
}
