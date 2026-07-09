import React from "react";
import { useDownload } from "../hooks/useDownload";
import { useCard } from "../context/CardContext";
import { FaFileImage, FaFilePdf, FaSpinner } from "react-icons/fa";

export const DownloadButtons = ({ exportId }) => {
  const { cardData } = useCard();
  const { downloadPNG, downloadPDF, isDownloading, error } = useDownload(exportId, cardData.name ? `${cardData.name.toLowerCase().replace(/\s+/g, "-")}-card` : "business-card");

  return (
    <div className="space-y-2.5 w-full">
      <div className="grid grid-cols-2 gap-3">
        {/* PNG Button */}
        <button
          onClick={downloadPNG}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isDownloading ? (
            <FaSpinner className="animate-spin text-sm" />
          ) : (
            <FaFileImage className="text-sm" />
          )}
          <span>Download PNG</span>
        </button>

        {/* PDF Button */}
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isDownloading ? (
            <FaSpinner className="animate-spin text-sm" />
          ) : (
            <FaFilePdf className="text-sm" />
          )}
          <span>Download PDF</span>
        </button>
      </div>

      {error && (
        <p className="text-[11px] font-medium text-rose-500 text-center">{error}</p>
      )}
    </div>
  );
};
