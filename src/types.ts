export type Language = 'fa' | 'en';

export type PhotoShape = 'circle' | 'rounded' | 'square';
export type PhotoSize = 'sm' | 'md' | 'lg';

export type LayoutTemplate = 
  | 'academic-faculty'  // شناسنامه رسمی و رزومه علمی هیئت علمی / دانشگاهی
  | 'sidebar-right'     // 2-column with right sidebar (ideal for Persian RTL)
  | 'sidebar-left'      // Classic 2-column with left sidebar
  | 'modern-header'     // Top modern gradient/colored bar, clean 1-column or 2-column body
  | 'minimal-classic'   // Elegant timeless black & accent 1-column layout
  | 'executive-banner'  // Premium banner with dark header block and structured cards
  | 'cards-split';      // Modern split cards style

export type HeaderStyle = 'underline' | 'badge' | 'accent-border' | 'minimal' | 'filled';
export type FontSizeOption = 'sm' | 'base' | 'lg';
export type SpacingOption = 'compact' | 'normal' | 'relaxed';
export type FontFamilyOption = 'Vazirmatn' | 'Outfit' | 'Plus Jakarta Sans' | 'Lalezar' | 'system-ui';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  photoUrl: string;
  showPhoto: boolean;
  photoShape: PhotoShape;
  photoSize: PhotoSize;
  photoBorder: boolean;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  telegram: string;
  summary: string;
  summaryTitle: string;
  // Academic & Institutional Specific Fields
  institution?: string;      // e.g. "دانشگاه صنعتی شریف"
  faculty?: string;          // e.g. "دانشکده مهندسی مکانیک"
  systemTitle?: string;      // e.g. "سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی — شریف"
  documentTitle?: string;    // e.g. "شناسنامه رسمی و رزومه علمی هیئت علمی"
  academicRank?: string;     // e.g. "استادیار — طراحی کاربردی — پایش وضعیت"
  issueDate?: string;        // e.g. "۱۴۰۵/۵/۲۶"
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1 to 5
  category?: string; // e.g. "تخصصی", "ابزارها", "نرم‌افزاری"
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string; // e.g. "زبان مادری (Native)", "پیشرفته (C1/C2)", "متوسط (B2)"
  level: number; // 1 to 5
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  link?: string;
  techStack?: string;
  date?: string;
  description: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  link?: string;
  credentialId?: string;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export type SectionType = 
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certificates'
  | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  columnPosition: 'main' | 'sidebar';
  items?: (ExperienceItem | EducationItem | SkillItem | LanguageItem | ProjectItem | CertificateItem | CustomItem)[];
}

export interface ResumeTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
  backgroundColor: string;
  sidebarBackground: string;
}

export interface ResumeData {
  id: string;
  title: string;
  language: Language;
  fontFamily: FontFamilyOption;
  fontSize: FontSizeOption;
  spacing: SpacingOption;
  layoutTemplate: LayoutTemplate;
  headerStyle: HeaderStyle;
  paperSize: 'A4' | 'Letter';
  theme: ResumeTheme;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  skillsDisplayType: 'chips' | 'bars' | 'dots';
}

export interface ColorPreset {
  id: string;
  nameFa: string;
  nameEn: string;
  theme: ResumeTheme;
}
