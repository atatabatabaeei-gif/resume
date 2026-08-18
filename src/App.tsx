import React, { useState, useEffect } from 'react';
import { ResumeData } from './types';
import { SAMPLE_RESUME_FA } from './data/initialData';
import { Navbar } from './components/Navbar';
import { SidebarEditor } from './components/SidebarEditor';
import { ResumePreview } from './components/ResumePreview';
import { Eye, Edit3, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'persian_custom_resume_data_v1';

export default function App() {
  // Initialize resume from localStorage if exists, or fallback to sample
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.personalInfo && Array.isArray(parsed.sections)) {
          return {
            ...SAMPLE_RESUME_FA,
            ...parsed,
            personalInfo: { ...SAMPLE_RESUME_FA.personalInfo, ...parsed.personalInfo },
            theme: { ...SAMPLE_RESUME_FA.theme, ...(parsed.theme || {}) },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load resume from localStorage:', e);
    }
    return SAMPLE_RESUME_FA;
  });

  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const [showPageBreakGuide, setShowPageBreakGuide] = useState<boolean>(false);
  
  // Mobile responsive tabs: 'editor' vs 'preview'
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [fullscreenPreview, setFullscreenPreview] = useState<boolean>(false);

  // Responsive zoom
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 0.48;
      if (window.innerWidth < 1024) return 0.7;
      if (window.innerWidth < 1440) return 0.85;
    }
    return 0.95;
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resume));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [resume]);

  // Adjust zoom on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && zoom > 0.6) {
        setZoom(0.48);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoom]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-vazir selection:bg-indigo-600 selection:text-white">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        resume={resume}
        setResume={setResume}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGeneratingPdf={isGeneratingPdf}
        setIsGeneratingPdf={setIsGeneratingPdf}
        pdfProgress={pdfProgress}
        setPdfProgress={setPdfProgress}
        toggleFullscreenPreview={() => setMobileView(mobileView === 'editor' ? 'preview' : 'editor')}
      />

      {/* Mobile Switcher Bar (Only visible on small devices) */}
      <div className="no-print lg:hidden bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-center gap-2">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mobileView === 'editor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>پنل ویرایش</span>
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mobileView === 'preview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>پیش‌نمایش سند رزومه</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex grow overflow-hidden relative">
        
        {/* Left/Sidebar Editor Panel (Visible on lg or when mobileView === 'editor') */}
        <div className={`w-full lg:w-auto shrink-0 ${mobileView === 'editor' ? 'block' : 'hidden lg:block'}`}>
          <SidebarEditor
            resume={resume}
            setResume={setResume}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Right/Main Area: Interactive Resume Canvas (Visible on lg or when mobileView === 'preview') */}
        <div className={`grow overflow-y-auto ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <ResumePreview
            resume={resume}
            zoom={zoom}
            setZoom={setZoom}
            showPageBreakGuide={showPageBreakGuide}
            setShowPageBreakGuide={setShowPageBreakGuide}
          />
        </div>

      </div>

      {/* Fullscreen Preview Modal (Optional) */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex flex-col items-center justify-center overflow-y-auto">
          <div className="w-full max-w-5xl flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-white">پیش‌نمایش تمام‌صفحه رزومه</span>
            <button
              onClick={() => setFullscreenPreview(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grow w-full flex justify-center overflow-y-auto py-4">
            <ResumePreview
              resume={resume}
              zoom={1}
              setZoom={setZoom}
              showPageBreakGuide={showPageBreakGuide}
              setShowPageBreakGuide={setShowPageBreakGuide}
            />
          </div>
        </div>
      )}

    </div>
  );
}
