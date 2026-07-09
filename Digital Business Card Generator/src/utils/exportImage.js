import { toPng } from "html-to-image";

export const exportAsImage = async (elementId, filename = "digital-business-card") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Target element not found: " + elementId);
  }

  try {
    // Temporarily apply style adjustments for high-quality export if needed
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 3, // High DPI scaling for ultra-sharp rendering
      cacheBust: true,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        width: element.offsetWidth + "px",
        height: element.offsetHeight + "px",
      }
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export PNG Error:", error);
    throw error;
  }
};
