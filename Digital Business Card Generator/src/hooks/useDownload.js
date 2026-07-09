import { useState } from "react";
import { exportAsImage } from "../utils/exportImage";
import { exportAsPDF } from "../utils/exportPDF";

export const useDownload = (elementId, cardName = "digital-business-card") => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPNG = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await exportAsImage(elementId, cardName);
    } catch (err) {
      setError(err.message || "Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await exportAsPDF(elementId, cardName);
    } catch (err) {
      setError(err.message || "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPNG, downloadPDF, isDownloading, error };
};
