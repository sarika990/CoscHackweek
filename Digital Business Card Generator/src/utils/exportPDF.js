import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportAsPDF = async (elementId, filename = "digital-business-card") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Target element not found: " + elementId);
  }

  try {
    // Generate high-DPI canvas representation of the HTML card
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    const imgData = canvas.toDataURL("image/png");
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    // Create PDF with dimensions exactly matching the business card's screen dimension in px
    const orientation = width > height ? "landscape" : "portrait";
    const pdf = new jsPDF({
      orientation: orientation,
      unit: "px",
      format: [width, height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Export PDF Error:", error);
    throw error;
  }
};
