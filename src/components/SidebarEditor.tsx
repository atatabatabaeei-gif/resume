import React, { useState, useRef } from 'react';
import { 
  User, 
  ArrowUpDown, 
  FileText, 
  Palette, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  Globe, 
  BookOpen, 
  Award, 
  Edit2, 
  Check, 
  HelpCircle,
  Wand2,
  Copy,
  Building2
} from 'lucide-react';
import { 
  ResumeData, 
  ResumeSection, 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  LanguageItem, 
  ProjectItem, 
  CertificateItem, 
  CustomItem,
  LayoutTemplate,
  HeaderStyle,
  FontFamilyOption,
  FontSizeOption,
  SpacingOption
} from '../types';
import { COLOR_PRESETS, DEFAULT_AVATAR, MALE_AVATAR } from '../data/initialData';

interface SidebarEditorProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarEditor: React.FC<SidebarEditorProps> = ({
  resume,
  setResume,
  activeTab,
  setActiveTab,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [newCustomSectionTitle, setNewCustomSectionTitle] = useState('');
  const [showAddCustomSection, setShowAddCustomSection] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('experience');
  const [aiJobField, setAiJobField] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Update Personal Info
  const handlePersonalInfoChange = (field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('حجم عکس انتخابی نباید بیش از ۲.۵ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handlePersonalInfoChange('photoUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  // Reorder Sections (Move Up / Move Down)
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...resume.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setResume(prev => ({
      ...prev,
      sections: newSections,
    }));
  };

  // Toggle Section Enabled
  const toggleSectionEnabled = (sectionId: string) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  // Change Section Column Position ('main' | 'sidebar')
  const toggleSectionColumn = (sectionId: string) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, columnPosition: s.columnPosition === 'main' ? 'sidebar' : 'main' } 
          : s
      ),
    }));
  };

  // Rename Section Title
  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, title: newTitle } : s
      ),
    }));
  };

  // Add Custom Section
  const handleAddCustomSection = () => {
    if (!newCustomSectionTitle.trim()) return;
    const newId = `custom-${Date.now()}`;
    const newSection: ResumeSection = {
      id: newId,
      type: 'custom',
      title: newCustomSectionTitle.trim(),
      enabled: true,
      columnPosition: 'main',
      items: [
        {
          id: `custom-item-${Date.now()}`,
          title: 'عنوان مورد اول',
          subtitle: 'توضیحات کوتاه یا تاریخ',
          description: 'متن توضیحات این بخش را در اینجا وارد کنید.',
        },
      ],
    };

    setResume(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));

    setNewCustomSectionTitle('');
    setShowAddCustomSection(false);
    setActiveAccordion(newId);
  };

  // Delete Section
  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('آیا از حذف این بخش مطمئن هستید؟')) {
      setResume(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId),
      }));
    }
  };

  // Generic Item Operations for Sections
  const addItemToSection = (sectionId: string, itemType: string) => {
    const newItemId = `${itemType}-${Date.now()}`;
    let newItem: any;

    switch (itemType) {
      case 'experience':
        newItem = {
          id: newItemId,
          company: 'نام شرکت / سازمان',
          position: 'عنوان موقعیت شغلی',
          startDate: '۱۴۰۱',
          endDate: '۱۴۰۳',
          isCurrent: false,
          description: 'شرح مسئولیت‌ها، وظایف و دستاوردهای کلیدی در این نقش.',
          highlights: ['دستاورد یا نتیجه مشخص شماره یک'],
        } as ExperienceItem;
        break;
      case 'education':
        newItem = {
          id: newItemId,
          institution: 'نام دانشگاه یا مرکز آموزشی',
          degree: 'مقطع تحصیلی',
          field: 'رشته تحصیلی',
          startDate: '۱۳۹۷',
          endDate: '۱۴۰۱',
          isCurrent: false,
        } as EducationItem;
        break;
      case 'skills':
        newItem = {
          id: newItemId,
          name: 'مهارت جدید',
          level: 4,
          category: 'تخصصی',
        } as SkillItem;
        break;
      case 'languages':
        newItem = {
          id: newItemId,
          name: 'نام زبان',
          proficiency: 'پیشرفته',
          level: 4,
        } as LanguageItem;
        break;
      case 'projects':
        newItem = {
          id: newItemId,
          title: 'عنوان پروژه',
          role: 'نقش شما',
          techStack: 'ابزارها / تکنولوژی‌ها',
          description: 'توضیحات مختصر در مورد اهداف و خروجی پروژه.',
        } as ProjectItem;
        break;
      case 'certificates':
        newItem = {
          id: newItemId,
          title: 'عنوان گواهینامه یا دوره',
          issuer: 'صادرکننده / آکادمی',
          issueDate: '۱۴۰۲',
        } as CertificateItem;
        break;
      case 'custom':
        newItem = {
          id: newItemId,
          title: 'مورد جدید',
          description: 'توضیحات...',
        } as CustomItem;
        break;
    }

    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: [...(sec.items || []), newItem],
          };
        }
        return sec;
      }),
    }));
  };

  const removeItemFromSection = (sectionId: string, itemId: string) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: (sec.items || []).filter(item => item.id !== itemId),
          };
        }
        return sec;
      }),
    }));
  };

  const updateItemField = (sectionId: string, itemId: string, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: (sec.items || []).map(item => {
              if (item.id === itemId) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return sec;
      }),
    }));
  };

  // AI Summary & Bullet Generators
  const generateAiSuggestions = () => {
    const job = aiJobField || resume.personalInfo.jobTitle || 'برنامه‌نویس و طراح';
    const suggestions = [
      `متخصص پرتلاش در حوزه ${job} با بیش از ۵ سال سابقه طراحی و هدایت پروژه‌های نوآورانه. متعهد به ارائه کارهای باکیفیت و ارتقای شاخص‌های کلیدی عملکرد تیم.`,
      `فردی نتیجه‌گرا و یادگیرنده در زمینه ${job} با تسلط بر متدولوژی‌های چابک، حل مسائل پیچیده و بهبود فرآیندهای کسب‌وکار.`,
      `تجربه عمیق در پیاده‌سازی راهکارهای مدرن در نقش ${job}، با تمرکز بر بهره‌وری، تعامل موثر با ذینفعان و پیاده‌سازی بهینه‌ترین استانداردها.`,
    ];
    setAiSuggestions(suggestions);
  };

  return (
    <div className="editor-panel w-full lg:w-[480px] shrink-0 bg-slate-900 border-e border-slate-800 flex flex-col h-[calc(100vh-61px)] text-slate-200">
      
      {/* Top Editor Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'personal'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>مشخصات و عکس</span>
        </button>

        <button
          onClick={() => setActiveTab('reorder')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'reorder'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>اولویت بخش‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'content'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>محتوا</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'design'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>طراحی و فونت</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>دستیار هوشمند</span>
        </button>
      </div>

      {/* Scrollable Editor Body */}
      <div className="grow overflow-y-auto p-4 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: PERSONAL INFO & PHOTO */}
        {/* ========================================================================= */}
        {activeTab === 'personal' && (
          <div className="space-y-5">
            
            {/* Photo Section */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs text-white">عکس پرسنلی رزومه</span>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <span>نمایش عکس</span>
                  <input
                    type="checkbox"
                    checked={resume.personalInfo.showPhoto}
                    onChange={(e) => handlePersonalInfoChange('showPhoto', e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {resume.personalInfo.showPhoto && (
                <div className="space-y-3 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-4">
                    {/* Current Photo Preview */}
                    <div className="relative group">
                      <img
                        src={resume.personalInfo.photoUrl || DEFAULT_AVATAR}
                        alt="Profile"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500/50 shadow-md"
                      />
                      <button
                        onClick={() => handlePersonalInfoChange('photoUrl', '')}
                        className="absolute -top-1.5 -start-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center shadow hover:bg-red-700"
                        title="حذف عکس"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grow space-y-2">
                      {/* Upload Button */}
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>آپلود عکس از کامپیوتر</span>
                      </button>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />

                      {/* Quick Preset Avatars */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>آواتارهای پیش‌فرض:</span>
                        <button
                          onClick={() => handlePersonalInfoChange('photoUrl', MALE_AVATAR)}
                          className="hover:underline text-indigo-400"
                        >
                          مرد
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handlePersonalInfoChange('photoUrl', DEFAULT_AVATAR)}
                          className="hover:underline text-indigo-400"
                        >
                          زن
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Shape & Size & Border Options */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                    <div>
                      <label className="text-slate-400 block mb-1">شکل کادر:</label>
                      <select
                        value={resume.personalInfo.photoShape}
                        onChange={(e) => handlePersonalInfoChange('photoShape', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                      >
                        <option value="circle">دایره‌ای (Circle)</option>
                        <option value="rounded">گوشه‌گرد (Rounded)</option>
                        <option value="square">مربعی (Square)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">اندازه عکس:</label>
                      <select
                        value={resume.personalInfo.photoSize}
                        onChange={(e) => handlePersonalInfoChange('photoSize', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                      >
                        <option value="sm">کوچک</option>
                        <option value="md">متوسط</option>
                        <option value="lg">بزرگ</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">حاشیه رنگی:</label>
                      <button
                        onClick={() => handlePersonalInfoChange('photoBorder', !resume.personalInfo.photoBorder)}
                        className={`w-full py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                          resume.personalInfo.photoBorder
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {resume.personalInfo.photoBorder ? 'فعال' : 'غیرفعال'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Info Inputs */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white mb-2">اطلاعات هویتی و تخصص</h3>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  placeholder="مثال: سامان صادقی"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">عنوان شغلی / حرفه</label>
                <input
                  type="text"
                  value={resume.personalInfo.jobTitle}
                  onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                  placeholder="مثال: توسعه‌دهنده ارشد فرانت‌اند یا استادیار دانشگاه"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Academic & Institutional Info (Special for Faculty / Official CV) */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs text-white">اطلاعات سازمانی و دانشگاهی (ویژه قالب هیئت علمی)</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                این فیلدها در قالب «شناسنامه رسمی و هیئت علمی» در سربرگ و کادر مشخصات سند نمایش داده می‌شوند.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">نام دانشگاه / موسسه</label>
                  <input
                    type="text"
                    value={resume.personalInfo.institution || ''}
                    onChange={(e) => handlePersonalInfoChange('institution', e.target.value)}
                    placeholder="مثال: دانشگاه صنعتی شریف"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">دانشکده / دپارتمان</label>
                  <input
                    type="text"
                    value={resume.personalInfo.faculty || ''}
                    onChange={(e) => handlePersonalInfoChange('faculty', e.target.value)}
                    placeholder="مثال: دانشکده مهندسی مکانیک"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">عنوان سند / رزومه</label>
                  <input
                    type="text"
                    value={resume.personalInfo.documentTitle || ''}
                    onChange={(e) => handlePersonalInfoChange('documentTitle', e.target.value)}
                    placeholder="مثال: شناسنامه رسمی و رزومه علمی هیئت علمی"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">عنوان سامانه / زیرتیتر سربرگ</label>
                  <input
                    type="text"
                    value={resume.personalInfo.systemTitle || ''}
                    onChange={(e) => handlePersonalInfoChange('systemTitle', e.target.value)}
                    placeholder="مثال: سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">کادر تخصص / مرتبه علمی</label>
                  <input
                    type="text"
                    value={resume.personalInfo.academicRank || ''}
                    onChange={(e) => handlePersonalInfoChange('academicRank', e.target.value)}
                    placeholder="مثال: استادیار — طراحی کاربردی — پایش وضعیت"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">تاریخ صدور سند</label>
                  <input
                    type="text"
                    value={resume.personalInfo.issueDate || ''}
                    onChange={(e) => handlePersonalInfoChange('issueDate', e.target.value)}
                    placeholder="مثال: ۱۴۰۵/۵/۲۶"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white mb-2">راه‌های ارتباطی و شبکه‌های حرفه‌ای</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">ایمیل (Email)</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={resume.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-left focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">شماره تماس</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={resume.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-left focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">موقعیت مکانی (شهر، کشور)</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder="تهران، ایران"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">وب‌سایت / پورتفولیو</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={resume.personalInfo.website}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    placeholder="https://mysite.dev"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-left focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">لینکدین (LinkedIn)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-left focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">گیت‌هاب (GitHub)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={resume.personalInfo.github}
                    onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                    placeholder="github.com/username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-left focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Summary / About Me */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-white">درباره من / خلاصه حرفه‌ای</h3>
                <span className="text-[11px] text-slate-400">{resume.personalInfo.summary.length} کاراکتر</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">عنوان این بخش در رزومه</label>
                <input
                  type="text"
                  value={resume.personalInfo.summaryTitle || 'درباره من'}
                  onChange={(e) => handlePersonalInfoChange('summaryTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white mb-2 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <textarea
                rows={4}
                value={resume.personalInfo.summary}
                onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                placeholder="چند خط درباره تجربیات، اهداف شغلی و دستاوردهای برجسته خود بنویسید..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REORDER & MANAGE SECTIONS */}
        {/* ========================================================================= */}
        {activeTab === 'reorder' && (
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-300 leading-relaxed">
              💡 <strong>قابلیت سفارشی‌سازی کامل:</strong> با دکمه‌های بالا و پایین می‌توانید ترتیب بخش‌ها را تغییر دهید، عنوان آن‌ها را ویرایش کنید، یا بخش‌هایی که نیاز ندارید را غیرفعال کنید.
            </div>

            {/* Sections List */}
            <div className="space-y-2.5">
              {resume.sections.map((section, index) => {
                const isEditing = editingSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    className={`p-3 rounded-xl border transition-all ${
                      section.enabled
                        ? 'bg-slate-800/80 border-slate-700 shadow-xs'
                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      
                      {/* Left: Reorder Arrows & Title */}
                      <div className="flex items-center gap-2 grow min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="انتقال به بالا"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === resume.sections.length - 1}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="انتقال به پایین"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title Display or Edit Field */}
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 grow">
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                              className="w-full bg-slate-950 border border-indigo-500 rounded-lg p-1.5 text-xs text-white focus:outline-hidden"
                              autoFocus
                            />
                            <button
                              onClick={() => setEditingSectionId(null)}
                              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                              <span>{section.title}</span>
                              <button
                                onClick={() => setEditingSectionId(section.id)}
                                className="text-slate-500 hover:text-indigo-400 p-0.5"
                                title="ویرایش عنوان"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>نوع: {section.type}</span>
                              <span>•</span>
                              <span>ستون: {section.columnPosition === 'main' ? 'اصلی' : 'کناری'}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Column Position Switcher */}
                        <button
                          onClick={() => toggleSectionColumn(section.id)}
                          className={`px-2 py-1 text-[10px] rounded-lg font-medium border ${
                            section.columnPosition === 'main'
                              ? 'bg-slate-900 border-slate-700 text-slate-300'
                              : 'bg-indigo-950 border-indigo-800 text-indigo-300'
                          }`}
                          title="تغییر مکان بین ستون اصلی و ستون کناری (در قالب‌های دو ستونه)"
                        >
                          {section.columnPosition === 'main' ? 'ستون اصلی' : 'ستون کناری'}
                        </button>

                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => toggleSectionEnabled(section.id)}
                          className={`p-1.5 rounded-lg border ${
                            section.enabled
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
                          }`}
                          title={section.enabled ? 'غیرفعال کردن بخش' : 'فعال کردن بخش'}
                        >
                          {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Custom Sections */}
                        {section.type === 'custom' && (
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            title="حذف بخش سفارشی"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Section Button */}
            {!showAddCustomSection ? (
              <button
                onClick={() => setShowAddCustomSection(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/40 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-indigo-400 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن بخش سفارشی جدید (Custom Section)</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3">
                <h4 className="font-bold text-xs text-white">نام بخش سفارشی را وارد کنید:</h4>
                <input
                  type="text"
                  value={newCustomSectionTitle}
                  onChange={(e) => setNewCustomSectionTitle(e.target.value)}
                  placeholder="مثال: مقالات و نشریات، افتخارات، فعالیت‌های داوطلبانه..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-hidden"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowAddCustomSection(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 text-xs text-slate-300 hover:bg-slate-600"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleAddCustomSection}
                    disabled={!newCustomSectionTitle.trim()}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-xs text-white font-semibold hover:bg-indigo-500 disabled:opacity-50"
                  >
                    ایجاد بخش
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CONTENT EDITORS */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            
            {/* Section Accordions */}
            {resume.sections.map((section) => {
              const isOpen = activeAccordion === section.id;
              
              if (section.type === 'summary') {
                return (
                  <div key={section.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>{section.title}</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('personal')}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        ویرایش در تب مشخصات
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={section.id} 
                  className="rounded-2xl bg-slate-800/80 border border-slate-700 overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setActiveAccordion(isOpen ? '' : section.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {section.type === 'experience' && <Briefcase className="w-4 h-4 text-blue-400" />}
                      {section.type === 'education' && <GraduationCap className="w-4 h-4 text-emerald-400" />}
                      {section.type === 'skills' && <Layers className="w-4 h-4 text-amber-400" />}
                      {section.type === 'languages' && <Globe className="w-4 h-4 text-cyan-400" />}
                      {section.type === 'projects' && <BookOpen className="w-4 h-4 text-purple-400" />}
                      {section.type === 'certificates' && <Award className="w-4 h-4 text-rose-400" />}
                      {section.type === 'custom' && <Sparkles className="w-4 h-4 text-indigo-400" />}
                      <span className="font-bold text-xs text-white">{section.title}</span>
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full">
                        {section.items?.length || 0} مورد
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-3.5 border-t border-slate-700/80 space-y-4 bg-slate-900/40">
                      
                      {/* Experience Items */}
                      {section.type === 'experience' && (
                        <div className="space-y-4">
                          {(section.items as ExperienceItem[] || []).map((exp, idx) => (
                            <div key={exp.id} className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-3 relative">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-indigo-300">موقعیت کاری شماره {idx + 1}</span>
                                <button
                                  onClick={() => removeItemFromSection(section.id, exp.id)}
                                  className="text-red-400 hover:text-red-300 text-xs p-1"
                                  title="حذف این مورد"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">عنوان سمت / موقعیت</label>
                                  <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => updateItemField(section.id, exp.id, 'position', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">نام شرکت / سازمان</label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => updateItemField(section.id, exp.id, 'company', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">تاریخ شروع</label>
                                  <input
                                    type="text"
                                    value={exp.startDate}
                                    onChange={(e) => updateItemField(section.id, exp.id, 'startDate', e.target.value)}
                                    placeholder="۱۴۰۱/۰۲"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">تاریخ پایان</label>
                                  <input
                                    type="text"
                                    value={exp.endDate}
                                    disabled={exp.isCurrent}
                                    onChange={(e) => updateItemField(section.id, exp.id, 'endDate', e.target.value)}
                                    placeholder={exp.isCurrent ? 'اکنون' : '۱۴۰۳/۰۵'}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white disabled:opacity-40"
                                  />
                                </div>
                                <div className="flex items-end pb-1.5">
                                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={exp.isCurrent}
                                      onChange={(e) => updateItemField(section.id, exp.id, 'isCurrent', e.target.checked)}
                                      className="w-3.5 h-3.5 accent-indigo-600 rounded"
                                    />
                                    <span>مشغول به کار</span>
                                  </label>
                                </div>
                              </div>

                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">توضیح وظایف و پروژه‌ها</label>
                                <textarea
                                  rows={2}
                                  value={exp.description}
                                  onChange={(e) => updateItemField(section.id, exp.id, 'description', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'experience')}
                            className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن سابقه شغلی جدید</span>
                          </button>
                        </div>
                      )}

                      {/* Education Items */}
                      {section.type === 'education' && (
                        <div className="space-y-4">
                          {(section.items as EducationItem[] || []).map((edu, idx) => (
                            <div key={edu.id} className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-emerald-300">مدرک تحصیلی شماره {idx + 1}</span>
                                <button
                                  onClick={() => removeItemFromSection(section.id, edu.id)}
                                  className="text-red-400 hover:text-red-300 text-xs p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">مقطع (کارشناسی، ارشد...)</label>
                                  <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => updateItemField(section.id, edu.id, 'degree', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">رشته تحصیلی</label>
                                  <input
                                    type="text"
                                    value={edu.field}
                                    onChange={(e) => updateItemField(section.id, edu.id, 'field', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">دانشگاه / موسسه</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => updateItemField(section.id, edu.id, 'institution', e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">بازه زمانی</label>
                                  <input
                                    type="text"
                                    value={edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.startDate || ''}
                                    onChange={(e) => updateItemField(section.id, edu.id, 'startDate', e.target.value)}
                                    placeholder="۱۳۹۶ - ۱۴۰۰"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] text-slate-400 block mb-1">معدل یا رتبه (اختیاری)</label>
                                  <input
                                    type="text"
                                    value={edu.grade || ''}
                                    onChange={(e) => updateItemField(section.id, edu.id, 'grade', e.target.value)}
                                    placeholder="معدل ۱۸.۵"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'education')}
                            className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن مدرک تحصیلی</span>
                          </button>
                        </div>
                      )}

                      {/* Skills Items */}
                      {section.type === 'skills' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(section.items as SkillItem[] || []).map((skill) => (
                              <div key={skill.id} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                                <div className="flex items-center justify-between">
                                  <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => updateItemField(section.id, skill.id, 'name', e.target.value)}
                                    placeholder="نام مهارت"
                                    className="bg-transparent border-0 font-bold text-xs text-white focus:outline-hidden w-full"
                                  />
                                  <button
                                    onClick={() => removeItemFromSection(section.id, skill.id)}
                                    className="text-red-400 hover:text-red-300 text-xs ps-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400">سطح: {skill.level}/۵</span>
                                  <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={skill.level}
                                    onChange={(e) => updateItemField(section.id, skill.id, 'level', parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-indigo-500 cursor-pointer"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addItemToSection(section.id, 'skills')}
                            className="w-full py-2 rounded-xl border border-dashed border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن مهارت جدید</span>
                          </button>
                        </div>
                      )}

                      {/* Languages Items */}
                      {section.type === 'languages' && (
                        <div className="space-y-3">
                          {(section.items as LanguageItem[] || []).map((lang) => (
                            <div key={lang.id} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                              <input
                                type="text"
                                value={lang.name}
                                onChange={(e) => updateItemField(section.id, lang.id, 'name', e.target.value)}
                                placeholder="نام زبان (مثلا انگلیسی)"
                                className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white grow"
                              />
                              <input
                                type="text"
                                value={lang.proficiency}
                                onChange={(e) => updateItemField(section.id, lang.id, 'proficiency', e.target.value)}
                                placeholder="سطح (پیشرفته / مادری)"
                                className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white w-32"
                              />
                              <button
                                onClick={() => removeItemFromSection(section.id, lang.id)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'languages')}
                            className="w-full py-2 rounded-xl border border-dashed border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن زبان جدید</span>
                          </button>
                        </div>
                      )}

                      {/* Projects Items */}
                      {section.type === 'projects' && (
                        <div className="space-y-3">
                          {(section.items as ProjectItem[] || []).map((proj, idx) => (
                            <div key={proj.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-purple-300">پروژه {idx + 1}</span>
                                <button
                                  onClick={() => removeItemFromSection(section.id, proj.id)}
                                  className="text-red-400 text-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => updateItemField(section.id, proj.id, 'title', e.target.value)}
                                placeholder="عنوان پروژه"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={proj.role || ''}
                                  onChange={(e) => updateItemField(section.id, proj.id, 'role', e.target.value)}
                                  placeholder="نقش شما (مثلا طراح ارشد)"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={proj.link || ''}
                                  onChange={(e) => updateItemField(section.id, proj.id, 'link', e.target.value)}
                                  placeholder="لینک آنلاین / گیت‌هاب"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white text-left"
                                />
                              </div>
                              <textarea
                                rows={2}
                                value={proj.description}
                                onChange={(e) => updateItemField(section.id, proj.id, 'description', e.target.value)}
                                placeholder="توضیحات دستاوردها و عملکرد پروژه..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                              />
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'projects')}
                            className="w-full py-2 rounded-xl border border-dashed border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن پروژه جدید</span>
                          </button>
                        </div>
                      )}

                      {/* Certificates Items */}
                      {section.type === 'certificates' && (
                        <div className="space-y-3">
                          {(section.items as CertificateItem[] || []).map((cert) => (
                            <div key={cert.id} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={cert.title}
                                  onChange={(e) => updateItemField(section.id, cert.id, 'title', e.target.value)}
                                  placeholder="نام گواهینامه"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white grow"
                                />
                                <button
                                  onClick={() => removeItemFromSection(section.id, cert.id)}
                                  className="text-red-400 p-1 ms-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => updateItemField(section.id, cert.id, 'issuer', e.target.value)}
                                  placeholder="صادرکننده"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  value={cert.issueDate}
                                  onChange={(e) => updateItemField(section.id, cert.id, 'issueDate', e.target.value)}
                                  placeholder="تاریخ صدور"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'certificates')}
                            className="w-full py-2 rounded-xl border border-dashed border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن دوره / گواهینامه</span>
                          </button>
                        </div>
                      )}

                      {/* Custom Section Items */}
                      {section.type === 'custom' && (
                        <div className="space-y-3">
                          {(section.items as CustomItem[] || []).map((c) => (
                            <div key={c.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  value={c.title}
                                  onChange={(e) => updateItemField(section.id, c.id, 'title', e.target.value)}
                                  placeholder="عنوان مورد"
                                  className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white grow"
                                />
                                <button
                                  onClick={() => removeItemFromSection(section.id, c.id)}
                                  className="text-red-400 p-1 ms-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={c.description}
                                onChange={(e) => updateItemField(section.id, c.id, 'description', e.target.value)}
                                placeholder="توضیحات..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                              />
                            </div>
                          ))}

                          <button
                            onClick={() => addItemToSection(section.id, 'custom')}
                            className="w-full py-2 rounded-xl border border-dashed border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 text-xs font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن مورد به این بخش</span>
                          </button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DESIGN & STYLING (Fonts, Colors, Layouts) */}
        {/* ========================================================================= */}
        {activeTab === 'design' && (
          <div className="space-y-5">
            
            {/* Layout Templates */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white">انتخاب قالب ساختاری (Layout)</h3>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'academic-faculty', label: '🎓 شناسنامه علمی هیئت علمی', desc: 'سربرگ دانشگاهی، کادر مشخصات، حوزه‌های تخصصی و پاورقی' },
                  { id: 'sidebar-right', label: 'ستون راست (ایده‌آل فارسی)', desc: 'ستون کناری عکس و مهارت در راست' },
                  { id: 'sidebar-left', label: 'ستون چپ (استاندارد انگلیسی)', desc: 'ستون کناری در سمت چپ' },
                  { id: 'modern-header', label: 'هدر رنگی مدرن', desc: 'نوار بالایی تمام‌عرض با عکس و مشخصات' },
                  { id: 'minimal-classic', label: 'تک ستونه مینیمال', desc: 'طراحی کلاسیک و شیک اداری' },
                  { id: 'executive-banner', label: 'مدیریتی لوکس (Executive)', desc: 'هدر تیره و کادربندی‌های دقیق' },
                  { id: 'cards-split', label: 'کارت‌های تفکیک‌شده', desc: 'طراحی ماژولار و باکس‌بندی‌شده' },
                ].map((tpl) => {
                  const isSelected = resume.layoutTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setResume(prev => ({ ...prev, layoutTemplate: tpl.id as LayoutTemplate }))}
                      className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500 text-white'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{tpl.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-snug">{tpl.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persian & English Typography */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white">فونت و تایپوگرافی</h3>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block">نوع قلم (فونت):</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Vazirmatn', label: 'وزیرمتن (استاندارد فارسی)', sample: 'نمونه قلم وزیر' },
                    { id: 'Lalezar', label: 'لاله‌زار (تیتر جذاب)', sample: 'فونت لاله‌زار' },
                    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta (مدرن)', sample: 'Modern Latin' },
                    { id: 'Outfit', label: 'Outfit (هندسی)', sample: 'Outfit Sans' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setResume(prev => ({ ...prev, fontFamily: font.id as FontFamilyOption }))}
                      className={`p-2.5 rounded-xl border text-right transition-all ${
                        resume.fontFamily === font.id
                          ? 'border-indigo-500 bg-indigo-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{font.label}</div>
                      <div className="text-[11px] text-indigo-400 mt-0.5" style={{ fontFamily: font.id }}>
                        {font.sample}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size & Spacing Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اندازه متن (چگالی)</label>
                  <select
                    value={resume.fontSize}
                    onChange={(e) => setResume(prev => ({ ...prev, fontSize: e.target.value as FontSizeOption }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="sm">کوچک (محتوای زیاد در ۱ صفحه)</option>
                    <option value="base">استاندارد</option>
                    <option value="lg">بزرگ و خوانا</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">فاصله خطوط و بخش‌ها</label>
                  <select
                    value={resume.spacing}
                    onChange={(e) => setResume(prev => ({ ...prev, spacing: e.target.value as SpacingOption }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="compact">فشرده (Compact)</option>
                    <option value="normal">معمولی (Normal)</option>
                    <option value="relaxed">باز و جادار (Relaxed)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Header Styling */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white">طراحی عناوین بخش‌ها (Header Style)</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'underline', label: 'خط زیرین' },
                  { id: 'badge', label: 'نشان / بج' },
                  { id: 'accent-border', label: 'کادر حاشیه' },
                  { id: 'filled', label: 'باکس رنگی' },
                  { id: 'minimal', label: 'مینیمال' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setResume(prev => ({ ...prev, headerStyle: st.id as HeaderStyle }))}
                    className={`py-2 px-2 text-center text-xs rounded-xl border transition-all font-medium ${
                      resume.headerStyle === st.id
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills Display Mode */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white">نحوه نمایش مهارت‌ها</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bars', label: 'نوارهای درصد' },
                  { id: 'chips', label: 'برچسب‌های چیپ' },
                  { id: 'dots', label: 'نقطه‌های ستاره‌ای' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setResume(prev => ({ ...prev, skillsDisplayType: m.id as any }))}
                    className={`py-2 px-2 text-center text-xs rounded-xl border transition-all font-medium ${
                      resume.skillsDisplayType === m.id
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Presets */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-xs text-white">تم و رنگ اصلی</h3>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setResume(prev => ({ ...prev, theme: p.theme }))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:border-indigo-500"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.theme.primaryColor }} />
                    <span>{p.nameFa.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AI WRITING ASSISTANT */}
        {/* ========================================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">تولید هوشمند خلاصه و متون رزومه</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                با وارد کردن عنوان تخصصی خود، نمونه متن‌های حرفه‌ای برای بخش «درباره من» و دستاوردها پیشنهاد می‌شود.
              </p>

              <div>
                <label className="text-xs text-slate-300 block mb-1">عنوان شغلی شما</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiJobField}
                    onChange={(e) => setAiJobField(e.target.value)}
                    placeholder={resume.personalInfo.jobTitle || 'مثلا: طراح UI/UX'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                  <button
                    onClick={generateAiSuggestions}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-md"
                  >
                    پیشنهاد متن
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions List */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">متن‌های پیشنهادی آماده استفاده:</h4>
                {aiSuggestions.map((sug, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                    <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
                    <div className="flex justify-end gap-2 pt-1 border-t border-slate-700/60">
                      <button
                        onClick={() => {
                          handlePersonalInfoChange('summary', sug);
                          alert('متن پیشنهادی در بخش «درباره من» قرار گرفت!');
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 text-[11px] font-medium transition-colors"
                      >
                        قرار دادن در درباره من
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Action Verbs / Checklist */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white mb-1">نکات کلیدی برای رزومه استاندارد:</h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                <li>استفاده از اعداد و درصدها در شرح دستاوردهای شغلی (مثال: ۳۰٪ افزایش سرعت)</li>
                <li>ترتیب زمانی معکوس (آخرین شغل و مدرک در بالاترین اولویت)</li>
                <li>انتخاب فونت خوانا مثل «وزیرمتن» برای افزایش رسمیت رزومه</li>
                <li>محدود کردن رزومه به ۱ یا نهایتاً ۲ صفحه استاندارد A4</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
