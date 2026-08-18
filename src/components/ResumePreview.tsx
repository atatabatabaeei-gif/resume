import React, { useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Send, 
  Calendar, 
  ExternalLink,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { 
  ResumeData, 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  LanguageItem, 
  ProjectItem, 
  CertificateItem, 
  CustomItem,
  ResumeSection,
  HeaderStyle
} from '../types';

interface ResumePreviewProps {
  resume: ResumeData;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  showPageBreakGuide: boolean;
  setShowPageBreakGuide: (show: boolean) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  zoom,
  setZoom,
  showPageBreakGuide,
  setShowPageBreakGuide,
}) => {
  const { personalInfo, sections, theme, language, fontFamily, fontSize, spacing, layoutTemplate, headerStyle, skillsDisplayType } = resume;
  const isRtl = language === 'fa';

  // Font family CSS class or inline
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'Vazirmatn':
        return { fontFamily: "'Vazirmatn', sans-serif" };
      case 'Lalezar':
        return { fontFamily: "'Lalezar', 'Vazirmatn', cursive, sans-serif" };
      case 'Plus Jakarta Sans':
        return { fontFamily: "'Plus Jakarta Sans', sans-serif" };
      case 'Outfit':
        return { fontFamily: "'Outfit', sans-serif" };
      default:
        return { fontFamily: "system-ui, -apple-system, sans-serif" };
    }
  };

  // Font size multiplier
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-[12px] leading-relaxed';
      case 'lg':
        return 'text-[14.5px] leading-relaxed';
      default:
        return 'text-[13px] leading-relaxed';
    }
  };

  // Spacing gap class
  const getSpacingClass = () => {
    switch (spacing) {
      case 'compact':
        return 'space-y-3';
      case 'relaxed':
        return 'space-y-6';
      default:
        return 'space-y-4';
    }
  };

  const getItemSpacingClass = () => {
    switch (spacing) {
      case 'compact':
        return 'space-y-2';
      case 'relaxed':
        return 'space-y-4';
      default:
        return 'space-y-3';
    }
  };

  // Photo shape and sizing
  const getPhotoStyle = () => {
    let shapeClass = 'rounded-full';
    if (personalInfo.photoShape === 'rounded') shapeClass = 'rounded-2xl';
    if (personalInfo.photoShape === 'square') shapeClass = 'rounded-md';

    let sizeClass = 'w-24 h-24';
    if (personalInfo.photoSize === 'sm') sizeClass = 'w-20 h-20';
    if (personalInfo.photoSize === 'lg') sizeClass = 'w-28 h-28';

    return `${shapeClass} ${sizeClass} object-cover`;
  };

  // Render Section Header with selected aesthetic styling
  const renderSectionHeader = (title: string, icon?: React.ReactNode) => {
    switch (headerStyle) {
      case 'badge':
        return (
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {icon}
              {title}
            </span>
            <div className="grow h-[1px] bg-slate-200" />
          </div>
        );
      case 'accent-border':
        return (
          <div 
            className="flex items-center gap-2 mb-3 pb-1 border-b-2"
            style={{ borderColor: theme.primaryColor }}
          >
            {icon && <span style={{ color: theme.primaryColor }}>{icon}</span>}
            <h3 
              className="font-bold text-sm tracking-wide"
              style={{ color: theme.headingColor }}
            >
              {title}
            </h3>
          </div>
        );
      case 'filled':
        return (
          <div 
            className="px-3 py-1.5 rounded-lg font-bold text-xs text-white mb-3 flex items-center gap-2"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {icon}
            <span>{title}</span>
          </div>
        );
      case 'minimal':
        return (
          <div className="flex items-center gap-2 mb-2">
            <h3 
              className="font-bold text-sm tracking-wide uppercase"
              style={{ color: theme.primaryColor }}
            >
              {title}
            </h3>
          </div>
        );
      case 'underline':
      default:
        return (
          <div className="mb-3">
            <div className="flex items-center gap-2">
              {icon && <span style={{ color: theme.primaryColor }}>{icon}</span>}
              <h3 
                className="font-bold text-sm tracking-wide"
                style={{ color: theme.headingColor }}
              >
                {title}
              </h3>
            </div>
            <div className="mt-1 flex items-center">
              <div 
                className="h-0.5 w-12 rounded-full" 
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div className="grow h-[1px] bg-slate-200" />
            </div>
          </div>
        );
    }
  };

  // Render individual section content
  const renderSectionContent = (section: ResumeSection) => {
    switch (section.type) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || personalInfo.summaryTitle || (isRtl ? 'درباره من' : 'Summary'), <Sparkles className="w-3.5 h-3.5" />)}
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-justify">
              {personalInfo.summary}
            </p>
          </div>
        );

      case 'experience': {
        const items = (section.items as ExperienceItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'سوابق کاری' : 'Experience'), <Briefcase className="w-3.5 h-3.5" />)}
            <div className={getItemSpacingClass()}>
              {items.map((exp) => (
                <div key={exp.id} className="resume-item-card border-s-2 ps-3 relative" style={{ borderColor: `${theme.primaryColor}40` }}>
                  {/* Dot on timeline */}
                  <div 
                    className="absolute -start-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h4 className="font-bold text-xs md:text-sm text-slate-900">{exp.position}</h4>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} — {exp.isCurrent ? (isRtl ? 'اکنون' : 'Present') : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold flex items-center gap-2 mb-1" style={{ color: theme.secondaryColor }}>
                    <span>{exp.company}</span>
                    {exp.location && <span className="text-slate-400 font-normal">({exp.location})</span>}
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-[11.5px] leading-relaxed mb-1.5 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: theme.primaryColor }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'education': {
        const items = (section.items as EducationItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'تحصیلات' : 'Education'), <GraduationCap className="w-3.5 h-3.5" />)}
            <div className={getItemSpacingClass()}>
              {items.map((edu) => (
                <div key={edu.id} className="resume-item-card border-s-2 ps-3 relative" style={{ borderColor: `${theme.primaryColor}40` }}>
                  <div 
                    className="absolute -start-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h4 className="font-bold text-xs md:text-sm text-slate-900">
                      {edu.degree} {edu.field && `• ${edu.field}`}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500">
                      {edu.startDate} — {edu.isCurrent ? (isRtl ? 'در حال تحصیل' : 'Ongoing') : edu.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    {edu.institution} {edu.location && <span className="text-slate-400 font-normal">({edu.location})</span>}
                  </div>
                  {edu.grade && (
                    <div className="text-[10.5px] text-slate-500 mt-0.5">
                      {edu.grade}
                    </div>
                  )}
                  {edu.description && (
                    <p className="text-slate-600 text-[11px] mt-1 leading-relaxed whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'skills': {
        const items = (section.items as SkillItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'مهارت‌ها' : 'Skills'), <Layers className="w-3.5 h-3.5" />)}
            
            {/* Display Mode: Bars */}
            {skillsDisplayType === 'bars' && (
              <div className="space-y-2">
                {items.map((skill) => (
                  <div key={skill.id} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-800 text-[11.5px]">{skill.name}</span>
                      {skill.category && <span className="text-[10px] text-slate-400">{skill.category}</span>}
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(skill.level / 5) * 100}%`,
                          backgroundColor: theme.primaryColor 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display Mode: Chips */}
            {skillsDisplayType === 'chips' && (
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span 
                    key={skill.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border"
                    style={{ 
                      backgroundColor: `${theme.primaryColor}0d`, 
                      borderColor: `${theme.primaryColor}30`,
                      color: theme.primaryColor
                    }}
                  >
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Display Mode: Dots */}
            {skillsDisplayType === 'dots' && (
              <div className="space-y-1.5">
                {items.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between text-xs">
                    <span className="text-[11.5px] font-medium text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <div 
                          key={d} 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: d <= skill.level ? theme.primaryColor : '#cbd5e1'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'languages': {
        const items = (section.items as LanguageItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'زبان‌ها' : 'Languages'), <Globe className="w-3.5 h-3.5" />)}
            <div className="space-y-2">
              {items.map((lang) => (
                <div key={lang.id} className="text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 text-[11.5px]">{lang.name}</span>
                    <div className="text-[10px] text-slate-500">{lang.proficiency}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <div 
                        key={l}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: l <= lang.level ? theme.primaryColor : '#cbd5e1'
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'projects': {
        const items = (section.items as ProjectItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'پروژه‌ها' : 'Projects'), <BookOpen className="w-3.5 h-3.5" />)}
            <div className={getItemSpacingClass()}>
              {items.map((proj) => (
                <div key={proj.id} className="resume-item-card bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/80">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{proj.title}</span>
                      {proj.link && (
                        <a 
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h4>
                    {proj.date && <span className="text-[10px] text-slate-500">{proj.date}</span>}
                  </div>
                  {proj.role && (
                    <div className="text-[10.5px] font-medium text-slate-600 mb-1">
                      {proj.role}
                    </div>
                  )}
                  {proj.techStack && (
                    <div className="text-[10px] font-mono text-indigo-700 mb-1 bg-indigo-50/50 px-1.5 py-0.5 rounded inline-block">
                      {proj.techStack}
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'certificates': {
        const items = (section.items as CertificateItem[]) || [];
        if (items.length === 0) return null;
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'گواهینامه‌ها' : 'Certificates'), <Award className="w-3.5 h-3.5" />)}
            <div className="space-y-2">
              {items.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="font-semibold text-slate-900 text-[11.5px]">{cert.title}</div>
                  <div className="text-[10.5px] text-slate-500 flex items-center justify-between">
                    <span>{cert.issuer}</span>
                    {cert.issueDate && <span>{cert.issueDate}</span>}
                  </div>
                  {cert.credentialId && (
                    <div className="text-[9.5px] font-mono text-slate-400">ID: {cert.credentialId}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'custom': {
        const items = (section.items as CustomItem[]) || [];
        return (
          <div className="resume-section-block">
            {renderSectionHeader(section.title || (isRtl ? 'بخش اختصاصی' : 'Custom Section'), <Sparkles className="w-3.5 h-3.5" />)}
            <div className={getItemSpacingClass()}>
              {items.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900 text-[11.5px]">{c.title}</h4>
                    {c.date && <span className="text-[10px] text-slate-500">{c.date}</span>}
                  </div>
                  {c.subtitle && <div className="text-[10.5px] text-slate-600 font-medium">{c.subtitle}</div>}
                  {c.description && (
                    <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line mt-0.5">
                      {c.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Contacts rendering helper
  const renderContactList = (layoutStyle: 'stacked' | 'horizontal' | 'compact' = 'stacked') => {
    const items = [
      personalInfo.email && { icon: <Mail className="w-3.5 h-3.5" />, text: personalInfo.email, link: `mailto:${personalInfo.email}` },
      personalInfo.phone && { icon: <Phone className="w-3.5 h-3.5" />, text: personalInfo.phone, link: `tel:${personalInfo.phone}` },
      personalInfo.location && { icon: <MapPin className="w-3.5 h-3.5" />, text: personalInfo.location },
      personalInfo.website && { icon: <Globe className="w-3.5 h-3.5" />, text: personalInfo.website.replace(/^https?:\/\//, ''), link: personalInfo.website },
      personalInfo.linkedin && { icon: <Linkedin className="w-3.5 h-3.5" />, text: personalInfo.linkedin, link: `https://${personalInfo.linkedin}` },
      personalInfo.github && { icon: <Github className="w-3.5 h-3.5" />, text: personalInfo.github, link: `https://${personalInfo.github}` },
      personalInfo.telegram && { icon: <Send className="w-3.5 h-3.5" />, text: personalInfo.telegram, link: `https://t.me/${personalInfo.telegram.replace('@', '')}` },
    ].filter(Boolean) as { icon: React.ReactNode; text: string; link?: string }[];

    if (layoutStyle === 'horizontal') {
      return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="shrink-0" style={{ color: theme.primaryColor }}>{item.icon}</span>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="hover:underline">
                  {item.text}
                </a>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-1.5 text-[11px] text-slate-600">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="shrink-0 text-slate-400" style={{ color: theme.primaryColor }}>{item.icon}</span>
            <span className="truncate">{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Photo Component
  const renderPhoto = () => {
    if (!personalInfo.showPhoto || !personalInfo.photoUrl) return null;
    return (
      <div className="shrink-0 relative">
        <img
          src={personalInfo.photoUrl}
          alt={personalInfo.fullName || 'Avatar'}
          className={getPhotoStyle()}
          style={{
            borderColor: personalInfo.photoBorder ? theme.primaryColor : 'transparent',
            borderWidth: personalInfo.photoBorder ? '2.5px' : '0px',
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  // Main vs Sidebar sections filter according to enabled status
  const enabledSections = sections.filter(s => s.enabled);
  const mainSections = enabledSections.filter(s => s.columnPosition === 'main');
  const sidebarSections = enabledSections.filter(s => s.columnPosition === 'sidebar');

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen py-6 px-2 sm:px-4 bg-slate-950/80">
      
      {/* Floating Canvas Controls */}
      <div className="no-print sticky top-16 z-30 mb-4 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl text-slate-200 text-xs">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
          title="کوچک‌نمایی"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] px-1 font-semibold w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
          title="بزرگ‌نمایی"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="h-4 w-[1px] bg-slate-700 mx-1" />
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-0.5 rounded-md hover:bg-slate-800 text-[11px]"
        >
          ۱۰۰٪
        </button>
        <button
          onClick={() => setShowPageBreakGuide(!showPageBreakGuide)}
          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
            showPageBreakGuide 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="نمایش خط راهنمای انتهای صفحه اول A4"
        >
          خط صفحه A4
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div 
        className="print-page-container relative transition-transform duration-200 origin-top shadow-2xl"
        style={{
          transform: `scale(${zoom})`,
          marginBottom: `${(zoom - 1) * 320}px`,
        }}
      >
        {/* A4 Sheet Dimensions: Standard 210mm x 297mm (min-height approx 1122px on standard 96dpi, 794px width) */}
        <div
          id="resume-print-area"
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            ...getFontFamilyStyle(),
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
          className={`w-[210mm] min-h-[297mm] mx-auto bg-white text-slate-800 shadow-2xl rounded-xs overflow-hidden relative ${getFontSizeClass()}`}
        >

          {/* Page 1 boundary guide line (shown when toggled in editor) */}
          {showPageBreakGuide && (
            <div className="no-print absolute top-[297mm] left-0 right-0 z-50 pointer-events-none flex items-center">
              <div className="w-full border-b-2 border-dashed border-red-500/70" />
              <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap absolute start-4 -top-3 shadow-md">
                انتهای صفحه اول A4 (Page 1 End)
              </span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 1: SIDEBAR RIGHT (Ideal for Persian RTL 2-column) */}
          {/* ========================================================================= */}
          {layoutTemplate === 'sidebar-right' && (
            <div className="grid grid-cols-12 min-h-[297mm]">
              
              {/* Main Content Area (8 cols) */}
              <div className="col-span-8 p-7 bg-white">
                
                {/* Header in Main */}
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <h1 
                    className="text-2xl font-black tracking-tight"
                    style={{ color: theme.primaryColor }}
                  >
                    {personalInfo.fullName || (isRtl ? 'نام و نام خانوادگی' : 'Full Name')}
                  </h1>
                  <h2 className="text-sm font-semibold text-slate-600 mt-1">
                    {personalInfo.jobTitle || (isRtl ? 'عنوان شغلی / تخصص' : 'Job Title')}
                  </h2>
                </div>

                {/* Main Sections */}
                <div className={getSpacingClass()}>
                  {mainSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Right (4 cols) */}
              <div 
                className="col-span-4 p-5 border-s border-slate-200 flex flex-col justify-start"
                style={{ backgroundColor: theme.sidebarBackground }}
              >
                {/* Photo */}
                {personalInfo.showPhoto && personalInfo.photoUrl && (
                  <div className="flex justify-center mb-5">
                    {renderPhoto()}
                  </div>
                )}

                {/* Contact Info */}
                <div className="mb-5 pb-4 border-b border-slate-200/80">
                  <h3 className="font-bold text-xs text-slate-800 mb-2.5">
                    {isRtl ? 'اطلاعات تماس' : 'Contact Information'}
                  </h3>
                  {renderContactList('stacked')}
                </div>

                {/* Sidebar Sections (Skills, Languages, Certificates, etc.) */}
                <div className={getSpacingClass()}>
                  {sidebarSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 2: SIDEBAR LEFT (Classic International 2-column) */}
          {/* ========================================================================= */}
          {layoutTemplate === 'sidebar-left' && (
            <div className="grid grid-cols-12 min-h-[297mm]">
              
              {/* Sidebar Left (4 cols) */}
              <div 
                className="col-span-4 p-5 border-e border-slate-200 flex flex-col justify-start"
                style={{ backgroundColor: theme.sidebarBackground }}
              >
                {/* Photo */}
                {personalInfo.showPhoto && personalInfo.photoUrl && (
                  <div className="flex justify-center mb-5">
                    {renderPhoto()}
                  </div>
                )}

                {/* Contact Info */}
                <div className="mb-5 pb-4 border-b border-slate-200/80">
                  <h3 className="font-bold text-xs text-slate-800 mb-2.5">
                    {isRtl ? 'اطلاعات تماس' : 'Contact Information'}
                  </h3>
                  {renderContactList('stacked')}
                </div>

                {/* Sidebar Sections */}
                <div className={getSpacingClass()}>
                  {sidebarSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area (8 cols) */}
              <div className="col-span-8 p-7 bg-white">
                <div className="border-b border-slate-200 pb-4 mb-5">
                  <h1 
                    className="text-2xl font-black tracking-tight"
                    style={{ color: theme.primaryColor }}
                  >
                    {personalInfo.fullName || (isRtl ? 'نام و نام خانوادگی' : 'Full Name')}
                  </h1>
                  <h2 className="text-sm font-semibold text-slate-600 mt-1">
                    {personalInfo.jobTitle || (isRtl ? 'عنوان شغلی / تخصص' : 'Job Title')}
                  </h2>
                </div>

                <div className={getSpacingClass()}>
                  {mainSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 3: MODERN TOP HEADER */}
          {/* ========================================================================= */}
          {layoutTemplate === 'modern-header' && (
            <div className="min-h-[297mm]">
              
              {/* Modern Banner Header */}
              <div 
                className="p-7 text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {personalInfo.showPhoto && personalInfo.photoUrl && (
                    <div>{renderPhoto()}</div>
                  )}
                  <div className="grow text-center sm:text-start">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                      {personalInfo.fullName || (isRtl ? 'نام و نام خانوادگی' : 'Full Name')}
                    </h1>
                    <h2 className="text-sm font-medium text-white/90 mt-1">
                      {personalInfo.jobTitle || (isRtl ? 'عنوان شغلی' : 'Job Title')}
                    </h2>
                    
                    {/* Horizontal Contacts on Header */}
                    <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/90">
                      {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-white/70" /> {personalInfo.email}</span>}
                      {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-white/70" /> {personalInfo.phone}</span>}
                      {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/70" /> {personalInfo.location}</span>}
                      {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-white/70" /> {personalInfo.website.replace(/^https?:\/\//, '')}</span>}
                      {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-white/70" /> {personalInfo.linkedin}</span>}
                      {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-white/70" /> {personalInfo.github}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body: 2 Columns or Flow */}
              <div className="p-7 grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-5">
                  {mainSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
                <div className="col-span-4 space-y-5 border-s border-slate-100 ps-4">
                  {sidebarSections.map((section) => (
                    <div key={section.id}>
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 4: MINIMAL CLASSIC (1-column elegant typography) */}
          {/* ========================================================================= */}
          {layoutTemplate === 'minimal-classic' && (
            <div className="p-8 min-h-[297mm]">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
                    {personalInfo.fullName || (isRtl ? 'نام شما' : 'Your Name')}
                  </h1>
                  <h2 className="text-sm font-semibold text-slate-600 mt-1">
                    {personalInfo.jobTitle || (isRtl ? 'عنوان شغلی' : 'Job Title')}
                  </h2>
                </div>
                {personalInfo.showPhoto && personalInfo.photoUrl && (
                  <div>{renderPhoto()}</div>
                )}
              </div>

              {/* Contacts Bar */}
              <div className="mb-6 pb-3 border-b border-slate-200">
                {renderContactList('horizontal')}
              </div>

              {/* All Enabled Sections sequentially */}
              <div className={getSpacingClass()}>
                {enabledSections.map((section) => (
                  <div key={section.id}>
                    {renderSectionContent(section)}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 5: EXECUTIVE BANNER */}
          {/* ========================================================================= */}
          {layoutTemplate === 'executive-banner' && (
            <div className="min-h-[297mm]">
              
              {/* Dark Executive Top Bar */}
              <div 
                className="p-6 text-white"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                      {personalInfo.fullName}
                    </h1>
                    <h2 className="text-xs font-medium text-white/80 mt-1 uppercase tracking-wider">
                      {personalInfo.jobTitle}
                    </h2>
                  </div>
                  {personalInfo.showPhoto && personalInfo.photoUrl && (
                    <div className="ring-2 ring-white/50 rounded-full">{renderPhoto()}</div>
                  )}
                </div>
              </div>

              {/* Accent Contacts Bar */}
              <div 
                className="px-6 py-2.5 text-[11px] text-white flex flex-wrap items-center justify-between gap-2"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.website && <span>{personalInfo.website}</span>}
              </div>

              {/* Body */}
              <div className="p-7 grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-5">
                  {mainSections.map((section) => (
                    <div key={section.id}>{renderSectionContent(section)}</div>
                  ))}
                </div>
                <div className="col-span-4 space-y-5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {sidebarSections.map((section) => (
                    <div key={section.id}>{renderSectionContent(section)}</div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYOUT 6: CARDS SPLIT */}
          {/* ========================================================================= */}
          {layoutTemplate === 'cards-split' && (
            <div className="p-6 min-h-[297mm] bg-slate-50/50">
              
              {/* Profile Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs mb-5 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                    {personalInfo.fullName}
                  </h1>
                  <h2 className="text-xs font-semibold text-slate-600 mt-0.5">
                    {personalInfo.jobTitle}
                  </h2>
                  <div className="mt-3">{renderContactList('horizontal')}</div>
                </div>
                {personalInfo.showPhoto && personalInfo.photoUrl && (
                  <div>{renderPhoto()}</div>
                )}
              </div>

              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 space-y-4">
                  {mainSections.map((section) => (
                    <div key={section.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
                <div className="col-span-4 space-y-4">
                  {sidebarSections.map((section) => (
                    <div key={section.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                      {renderSectionContent(section)}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
