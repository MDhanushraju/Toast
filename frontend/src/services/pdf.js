import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportBookletToPDF(containerId, fileName = 'district_228_booklet') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Target container #${containerId} not found.`);
    return;
  }

  // Find all child sections/pages marked as printable pages
  const pages = container.querySelectorAll('.booklet-page');
  if (pages.length === 0) {
    console.error("No pages found with class '.booklet-page'");
    return;
  }

  // Create jsPDF instance (A4 size: 210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  // Process pages one by one to ensure proper sequence
  for (let i = 0; i < pages.length; i++) {
    const pageElement = pages[i];
    
    // Convert DOM section to high-resolution canvas
    const canvas = await html2canvas(pageElement, {
      scale: 2, // High resolution scale
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // If not the first page, add a new blank page to jsPDF
    if (i > 0) {
      pdf.addPage();
    }

    // Add canvas image to fill the A4 page boundaries (leaving no margins as booklet pages have internal margins)
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  // Download PDF file
  pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
}
