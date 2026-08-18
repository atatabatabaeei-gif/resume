import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { ResumeData } from '../types';

/**
 * Triggers native browser print dialog styled for A4 page export (Crystal-clear vector PDF)
 */
export const triggerBrowserPrint = () => {
  // Trigger light celebration confetti
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#6366f1'],
    });
  } catch (e) {
    // Ignore confetti errors
  }

  // Small timeout to allow render stabilization
  setTimeout(() => {
    window.print();
  }, 150);
};

/**
 * Exports the resume element as a High-DPI PDF document using jsPDF and html2canvas
 */
export const exportToHighDpiPdf = async (
  elementId: string,
  fileName: string = 'My_Resume.pdf',
  onProgress?: (progressText: string) => void
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  try {
    if (onProgress) onProgress('در حال آماده‌سازی و رندر با کیفیت بالا...');

    // Temporarily ensure element has explicit white background and clean dimensions
    const originalShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';

    // Capture using html2canvas at high resolution (scale 2.5)
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.margin = '0';
          clonedEl.style.transform = 'none';
        }
      },
    });

    // Restore styling
    element.style.boxShadow = originalShadow;

    if (onProgress) onProgress('در حال ساخت سند PDF استاندارد A4...');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of image in PDF mm
    const imgPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

    // If fits in 1 page or requires multiple pages
    if (imgPdfHeight <= pdfHeight + 5) {
      // Single page fit
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(imgPdfHeight, pdfHeight));
    } else {
      // Multi-page slicing
      let heightLeft = imgPdfHeight;
      let position = 0;
      let pageNum = 1;

      while (heightLeft > 0) {
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgPdfHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;

        if (heightLeft > 2) {
          pdf.addPage();
          pageNum++;
        }
      }
    }

    if (onProgress) onProgress('در حال ذخیره فایل...');
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignore
    }

    return true;
  } catch (err) {
    console.error('PDF generation error:', err);
    return false;
  }
};

/**
 * Downloads resume data as a JSON file
 */
export const downloadResumeJson = (resume: ResumeData) => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeName = (resume.personalInfo.fullName || 'resume').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${safeName}_resume_backup.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
