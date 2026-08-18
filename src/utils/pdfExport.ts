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

  try {
    if (onProgress) onProgress('در حال آماده‌سازی و پردازش لایه‌های رزومه...');

    // Wait for document fonts to be ready
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Ignore font errors
      }
    }

    // Wait for all images in resume to load
    const images = Array.from(originalElement.getElementsByTagName('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 1000);
        });
      })
    );

    if (onProgress) onProgress('در حال رندر صفحات با رزولوشن بالا...');

    // Small delay to ensure any layout calculations are settle
    await new Promise((r) => setTimeout(r, 100));

    // Capture using html2canvas directly on the element
    const canvas = await html2canvas(originalElement, {
      scale: 2, // 2x DPI for crisp text & images
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const clonedTarget = clonedDoc.getElementById(elementId);
        if (clonedTarget) {
          // Reset zoom/transform on parent containers in cloned DOM
          let parent = clonedTarget.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.transform = 'none';
            parent.style.margin = '0';
            parent = parent.parentElement;
          }
          clonedTarget.style.transform = 'none';
          clonedTarget.style.boxShadow = 'none';
          clonedTarget.style.margin = '0 auto';
        }

        // Remove any confetti canvases or extraneous overlays in cloned document
        const extraneous = clonedDoc.querySelectorAll('canvas:not([data-chart]), .no-print, [class*="no-print"]');
        extraneous.forEach((node) => {
          if (!clonedTarget?.contains(node)) {
            (node as HTMLElement).style.display = 'none';
          }
        });
      },
    });

    if (onProgress) onProgress('در حال تنظیم ابعاد A4 و ایجاد صفحات سند...');

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
      // Single page fit
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(imgPdfHeight, pdfHeight));
    } else {
      // Multi-page slicing
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

    // Trigger celebration confetti only after successful download
    try {
      confetti({
        particleCount: 50,
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
