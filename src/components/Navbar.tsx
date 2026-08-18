import React, { useState, useRef } from 'react';
import { 
  FileDown, 
  Printer, 
  Palette, 
  Layout, 
  RotateCcw, 
  Upload, 
  Download, 
  Sparkles, 
  Eye, 
  Check, 
  Languages,
  Plus
} from 'lucide-react';
import { ResumeData, LayoutTemplate } from '../types';
import { COLOR_PRESETS, SAMPLE_RESUME_FA, SAMPLE_RESUME_DESIGNER_FA, SAMPLE_RESUME_ACADEMIC_FA, SAMPLE_RESUME_EN, BLANK_RESUME } from '../data/initialData';
import { triggerBrowserPrint, exportToHighDpiPdf, downloadResumeJson } from '../utils/pdfExport';

interface NavbarProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isGeneratingPdf: boolean;
  setIsGeneratingPdf: (loading: boolean) => void;
  pdfProgress: string;
  setPdfProgress: (text: string) => void;
  toggleFullscreenPreview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resume,
  setResume,
  activeTab,
  setActiveTab,
  isGeneratingPdf,
  setIsGeneratingPdf,
  pdfProgress,
  setPdfProgress,
  toggleFullscreenPreview,
}) => {
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfProgress('در حال تحلیل و تولید سند PDF...');
    const fileName = `${resume.personalInfo.fullName || 'Resume'}_CV.pdf`;
    try {
      await exportToHighDpiPdf('resume-print-area', fileName, (text) => setPdfProgress(text));
    } catch (e) {
      console.error('Error generating PDF:', e);
      triggerBrowserPrint();
    } finally {
      setIsGeneratingPdf(false);
      setShowExportDropdown(false);
    }
  };

  const handlePrint = () => {
    setShowExportDropdown(false);
    triggerBrowserPrint();
  };

  const handleJsonExport = () => {
    downloadResumeJson(resume);
    setShowExportDropdown(false);
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.personalInfo && data.sections) {
          setResume(data);
          alert('رزومه با موفقیت بارگذاری شد!');
        } else {
          alert('فایل انتخاب شده ساختار استاندارد رزومه را ندارد.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل JSON.');
      }
    };
    reader.readAsText(file);
  };

  const loadTemplate = (templateData: ResumeData) => {
    if (window.confirm('آیا مطمئنید؟ اطلاعات فعلی با اطلاعات قالب جایگزین خواهد شد.')) {
      setResume(JSON.parse(JSON.stringify(templateData)));
      setShowTemplatesModal(false);
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left/Start: App Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            CV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg text-white">رزومه‌ساز سفارشی</h1>
              <span className="text-[11px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                نسخه پیشرفته
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {resume.language === 'fa' ? 'فارسی (RTL)' : 'English (LTR)'} • قالب {resume.layoutTemplate}
            </p>
          </div>
        </div>

        {/* Center: Quick Action Buttons & Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Templates Selector Button */}
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors"
            title="نمونه رزومه‌های آماده"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">قالب‌های آماده</span>
          </button>

          {/* Color Palette Button */}
          <button
            onClick={() => setShowColorModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors"
            title="انتخاب و تغییر رنگ‌بندی"
          >
            <div 
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" 
              style={{ backgroundColor: resume.theme.primaryColor }}
            />
            <span className="hidden md:inline">رنگ‌بندی</span>
          </button>

          {/* Language Direction Toggle */}
          <button
            onClick={() => {
              const newLang = resume.language === 'fa' ? 'en' : 'fa';
              setResume(prev => ({
                ...prev,
                language: newLang,
                fontFamily: newLang === 'fa' ? 'Vazirmatn' : 'Plus Jakarta Sans',
              }));
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors"
            title="تغییر زبان و جهت سند"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{resume.language === 'fa' ? 'FA (فا)' : 'EN'}</span>
          </button>

          {/* Fullscreen Preview Toggle for Small Devices */}
          <button
            onClick={toggleFullscreenPreview}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>مشاهده</span>
          </button>
        </div>

        {/* Right/End: Primary Export Actions */}
        <div className="flex items-center gap-2 relative">
          
          {/* Main Direct PDF Export Button */}
          <button
            id="export-pdf-main-btn"
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'در حال صدور...' : 'دانلود فایل PDF'}</span>
          </button>

          {/* More Export & Print Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="سایر گزینه‌های چاپ و خروجی"
            >
              <Printer className="w-4 h-4 text-slate-300" />
            </button>

            {showExportDropdown && (
              <div 
                className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 text-xs text-slate-200"
                onClick={() => setShowExportDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                  گزینه‌های چاپ و ذخیره‌سازی
                </div>
                
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-right rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">چاپ مستقیم وکتور (Vector Print)</div>
                    <div className="text-[10px] text-slate-400">کیفیت صددرصد شفاف با فونت‌های وکتوری مرورگر</div>
                  </div>
                </button>

                <button
                  onClick={handleJsonExport}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-right rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-medium">دانلود فایل پشتیبان (JSON)</div>
                    <div className="text-[10px] text-slate-400">ذخیره داده‌های رزومه برای استفاده مجدد</div>
                  </div>
                </button>

                <label className="w-full flex items-center gap-2.5 px-3 py-2 text-right rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-medium">بارگذاری فایل JSON</div>
                    <div className="text-[10px] text-slate-400">بازیابی رزومه از فایل قبلی</div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleJsonImport}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">انتخاب نمونه رزومه آماده</h3>
                <p className="text-xs text-slate-400 mt-0.5">می‌توانید از یکی از قالب‌های حرفه‌ای زیر شروع کنید یا یک رزومه خالی بسازید</p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Persian Academic / Faculty Member */}
              <div 
                onClick={() => loadTemplate(SAMPLE_RESUME_ACADEMIC_FA)}
                className="p-4 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-amber-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white group-hover:text-amber-400">شناسنامه علمی و هیئت علمی (دانشگاهی)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">سربرگ رسمی سازمانی</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  فرمت استاندارد دانشگاهی با سربرگ موسسه/دانشکده، کادر مشخصات، حوزه‌های تخصصی، دستاوردها و شیوه‌های همکاری.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <span>بارگذاری این نمونه دانشگاهی</span>
                  <span>←</span>
                </div>
              </div>

              {/* Persian Developer */}
              <div 
                onClick={() => loadTemplate(SAMPLE_RESUME_FA)}
                className="p-4 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-indigo-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white group-hover:text-indigo-400">مهندس ارشد نرم‌افزار (فارسی)</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md">ستون کناری راست</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  مناسب برای توسعه‌دهندگان، مهندسان IT، برنامه‌نویسان با عکس پرسنلی، مهارت‌ها و پروژه‌ها.
                </p>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                  <span>بارگذاری این نمونه</span>
                  <span>←</span>
                </div>
              </div>

              {/* Persian UI/UX Designer */}
              <div 
                onClick={() => loadTemplate(SAMPLE_RESUME_DESIGNER_FA)}
                className="p-4 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">طراح محصول و UI/UX (فارسی)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">هدر مدرن زمردی</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  طراحی جذاب با تاکید بر نمونه‌کارها، مهارت‌های بصری، چیپ‌های تخصصی و تحصیلات هنری.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <span>بارگذاری این نمونه</span>
                  <span>←</span>
                </div>
              </div>

              {/* English Engineer */}
              <div 
                onClick={() => loadTemplate(SAMPLE_RESUME_EN)}
                className="p-4 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-blue-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white group-hover:text-blue-400">Senior Engineer (English)</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md">Left Sidebar</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Clean international English standard format with metric-focused bullet points and skills bars.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                  <span>Load English Template</span>
                  <span>←</span>
                </div>
              </div>

              {/* Blank Resume */}
              <div 
                onClick={() => loadTemplate(BLANK_RESUME)}
                className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-500 cursor-pointer transition-all group flex flex-col justify-center items-center text-center py-6"
              >
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-white mb-2" />
                <span className="font-semibold text-sm text-white">شروع با رزومه خام (Blank)</span>
                <p className="text-xs text-slate-400 mt-1">ساخت تمام بخش‌ها از ابتدا با اطلاعات شخصی شما</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Preset & Theme Modal */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">پالت‌ها و تم‌های رنگی</h3>
                <p className="text-xs text-slate-400 mt-0.5">یک رنگ‌بندی حرفه‌ای متناسب با تخصص خود انتخاب کنید</p>
              </div>
              <button
                onClick={() => setShowColorModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = resume.theme.primaryColor === preset.theme.primaryColor;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setResume(prev => ({ ...prev, theme: preset.theme }));
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-right transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex -space-x-1 rtl:space-x-reverse shrink-0">
                      <div 
                        className="w-6 h-6 rounded-full border border-white/20 shadow-xs" 
                        style={{ backgroundColor: preset.theme.primaryColor }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border border-white/20 shadow-xs" 
                        style={{ backgroundColor: preset.theme.secondaryColor }}
                      />
                    </div>
                    <div className="grow min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{preset.nameFa}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.nameEn}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Pickers */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-xs font-bold text-slate-300 mb-3">تنظیم دستی رنگ‌های اختصاصی</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5">رنگ اصلی (Primary)</label>
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                    <input
                      type="color"
                      value={resume.theme.primaryColor}
                      onChange={(e) => setResume(prev => ({
                        ...prev,
                        theme: { ...prev.theme, primaryColor: e.target.value }
                      }))}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-300">{resume.theme.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5">رنگ فرعی / هایلایت</label>
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                    <input
                      type="color"
                      value={resume.theme.secondaryColor}
                      onChange={(e) => setResume(prev => ({
                        ...prev,
                        theme: { ...prev.theme, secondaryColor: e.target.value }
                      }))}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-300">{resume.theme.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowColorModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                تایید و بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Progress Banner */}
      {isGeneratingPdf && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800/95 border border-indigo-500/50 shadow-2xl p-4 rounded-2xl flex items-center gap-3 backdrop-blur max-w-sm text-slate-100 animate-pulse">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-white">در حال آماده‌سازی PDF باکیفیت</div>
            <div className="text-slate-400 mt-0.5">{pdfProgress}</div>
          </div>
        </div>
      )}
    </header>
  );
};
