import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { ResumeData } from '../types';

/**
 * Triggers native browser print dialog styled for A4 page export (Crystal-clear vector PDF)
 */
export const triggerBrowserPrint = () => {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#6366f1'],
    });
  } catch {
    // Ignore confetti errors
  }

  // Small timeout to allow render stabilization
  setTimeout(() => {
    window.print();
  }, 100);
};

/**
 * Converts image url to base64 to avoid canvas tainting
 */
const convertImgToBase64 = (img: HTMLImageElement): Promise<void> => {
  return new Promise((resolve) => {
    if (!img.src || img.src.startsWith('data:')) {
      resolve();
      return;
    }

    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempImg.naturalWidth || tempImg.width || 300;
        canvas.height = tempImg.naturalHeight || tempImg.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tempImg, 0, 0);
          img.src = canvas.toDataURL('image/png');
        }
      } catch {
        // If tainted, keep original
      }
      resolve();
    };
    tempImg.onerror = () => resolve();
    tempImg.src = img.src;
  });
};

/**
 * Exports the resume element as a High-DPI PDF document using jsPDF and html2canvas
 */
export const exportToHighDpiPdf = async (
  elementId: string,
  fileName: string = 'My_Resume.pdf',
  onProgress?: (progressText: string) => void
): Promise<boolean> => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element #${elementId} not found for PDF export.`);
    triggerBrowserPrint();
    return false;
  }

  // Create an unscaled off-screen clone to prevent transform/zoom distortion
  let offscreenContainer: HTMLDivElement | null = null;

  try {
    if (onProgress) onProgress('در حال آماده‌سازی و پردازش لایه‌های گرافیکی...');

    // Wait for fonts to load
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Ignore font ready errors
      }
    }

    offscreenContainer = document.createElement('div');
    offscreenContainer.style.position = 'fixed';
    offscreenContainer.style.left = '-9999px';
    offscreenContainer.style.top = '0';
    offscreenContainer.style.width = '794px'; // 210mm in 96 DPI
    offscreenContainer.style.background = '#ffffff';
    offscreenContainer.style.zIndex = '-9999';
    offscreenContainer.style.overflow = 'visible';

    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    clonedElement.style.transform = 'none';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.width = '794px';
    clonedElement.style.minHeight = '1123px'; // 297mm in 96 DPI

    // Convert all images inside cloned element to base64
    const images = Array.from(clonedElement.getElementsByTagName('img'));
    await Promise.all(images.map((img) => convertImgToBase64(img)));

    offscreenContainer.appendChild(clonedElement);
    document.body.appendChild(offscreenContainer);

    if (onProgress) onProgress('در حال رندر سند با رزولوشن بالا...');

    // Capture using html2canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    });

    if (onProgress) onProgress('در حال ساخت صفحات استاندارد A4...');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of image in PDF mm
    const imgPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

    if (imgPdfHeight <= pdfHeight + 4) {
      // Single page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(imgPdfHeight, pdfHeight));
    } else {
      // Multi-page
      let heightLeft = imgPdfHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgPdfHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;

        if (heightLeft > 3) {
          pdf.addPage();
        }
      }
    }

    if (onProgress) onProgress('در حال ذخیره‌سازی فایل...');
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    // Download PDF via Blob to ensure compatibility across all browsers and sandboxes
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = cleanFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    setTimeout(() => {
      downloadLink.remove();
      URL.revokeObjectURL(blobUrl);
    }, 2000);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignore
    }

    return true;
  } catch (err) {
    console.warn('Direct PDF export encountered an issue, falling back to browser print:', err);
    if (onProgress) onProgress('در حال انتقال به پنجره چاپ مستقیم وکتور...');
    triggerBrowserPrint();
    return false;
  } finally {
    if (offscreenContainer && document.body.contains(offscreenContainer)) {
      offscreenContainer.remove();
    }
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
