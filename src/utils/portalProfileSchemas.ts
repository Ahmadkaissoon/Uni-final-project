import type { PortalRole } from "../components/layout/PortalLayout";

export type PortalProfileFormValues = object;

export type PortalProfileFieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "tel"
  | "url";

export interface PortalProfileOption {
  value: string;
  label: string;
}

export interface PortalProfileField<T extends PortalProfileFormValues> {
  name: Extract<keyof T, string>;
  label: string;
  type?: PortalProfileFieldType;
  required?: boolean;
  placeholder?: string;
  options?: PortalProfileOption[];
  min?: number | string;
  max?: number | string;
  className?: string;
}

export interface PortalProfileSection<T extends PortalProfileFormValues> {
  id: string;
  title: string;
  columnsClassName?: string;
  fields: Array<PortalProfileField<T>>;
}

export interface PortalProfileEditorConfig<T extends PortalProfileFormValues> {
  role: PortalRole;
  entityLabel: string;
  pageDescription: string;
  summaryTagline: string;
  storageKey: string;
  avatarStorageKey: string;
  displayNameField: Extract<keyof T, string>;
  fallbackDisplayName: string;
  defaultValues: T;
  sections: Array<PortalProfileSection<T>>;
  saveSuccessMessage: string;
}

export interface CompanyProfileData {
  companyName: string;
  sector: string;
  employeeCount: string;
  country: string;
  city: string;
  address: string;
  companyPhone: string;
  website: string;
  hiringManagerName: string;
  companyEmail: string;
  hiringJobTypes: string;
  monthlyOpenings: string;
  companyRecommendations: string;
}

export interface PersonProfileData {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  jobLevel: string;
  yearsExperience: string;
  lastCompany: string;
  workType: string;
  latestDegree: string;
  specialization: string;
  university: string;
  graduationYear: string;
  languages: string;
  topAchievement: string;
  portfolioLink: string;
  professionalProfile: string;
  projectSummary: string;
}

export const emptyCompanyProfileData: CompanyProfileData = {
  companyName: "",
  sector: "",
  employeeCount: "",
  country: "",
  city: "",
  address: "",
  companyPhone: "",
  website: "",
  hiringManagerName: "",
  companyEmail: "",
  hiringJobTypes: "",
  monthlyOpenings: "",
  companyRecommendations: "",
};

export const emptyPersonProfileData: PersonProfileData = {
  fullName: "",
  gender: "",
  birthDate: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  jobLevel: "",
  yearsExperience: "",
  lastCompany: "",
  workType: "",
  latestDegree: "",
  specialization: "",
  university: "",
  graduationYear: "",
  languages: "",
  topAchievement: "",
  portfolioLink: "",
  professionalProfile: "",
  projectSummary: "",
};

export const companyProfileSections: Array<
  PortalProfileSection<CompanyProfileData>
> = [
  {
    id: "basic",
    title: "المعلومات الأساسية",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      { name: "companyName", label: "اسم الشركة", required: true },
      {
        name: "sector",
        label: "القطاع",
        type: "select",
        required: true,
        placeholder: "اختر القطاع",
        options: [
          { value: "technology", label: "تقنية" },
          { value: "marketing", label: "تسويق" },
          { value: "design", label: "تصميم" },
          { value: "education", label: "تعليم" },
          { value: "other", label: "أخرى" },
        ],
      },
      {
        name: "employeeCount",
        label: "عدد الموظفين",
        type: "number",
        required: true,
        min: 1,
      },
      { name: "country", label: "الدولة", required: true },
      { name: "city", label: "المدينة", required: true },
      { name: "address", label: "العنوان", required: true },
      {
        name: "companyPhone",
        label: "رقم هاتف الشركة",
        type: "tel",
        required: true,
      },
      { name: "website", label: "الموقع الإلكتروني", type: "url" },
    ],
  },
  {
    id: "manager",
    title: "معلومات المسؤول",
    columnsClassName: "md:grid-cols-2",
    fields: [
      {
        name: "hiringManagerName",
        label: "اسم مسؤول التوظيف",
        required: true,
      },
      {
        name: "companyEmail",
        label: "بريد الشركة",
        type: "email",
        required: true,
      },
    ],
  },
  {
    id: "needs",
    title: "احتياجات الشركة",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      {
        name: "hiringJobTypes",
        label: "نوع الوظائف التي توظف لها!",
      },
      {
        name: "monthlyOpenings",
        label: "عدد الوظائف التي تخطط لنشرها شهرياً",
        type: "number",
        min: 0,
      },
      {
        name: "companyRecommendations",
        label: "توصيات الشركة",
      },
    ],
  },
];

export const personProfileSections: Array<
  PortalProfileSection<PersonProfileData>
> = [
  {
    id: "personal",
    title: "المعلومات الشخصية",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      { name: "fullName", label: "الاسم الكامل", required: true },
      {
        name: "gender",
        label: "الجنس",
        type: "select",
        required: true,
        placeholder: "اختر الجنس",
        options: [
          { value: "male", label: "ذكر" },
          { value: "female", label: "أنثى" },
        ],
      },
      {
        name: "birthDate",
        label: "تاريخ الميلاد",
        type: "date",
        required: true,
      },
      {
        name: "phone",
        label: "رقم الهاتف",
        type: "tel",
        required: true,
      },
      { name: "country", label: "الدولة", required: true },
      { name: "city", label: "المدينة", required: true },
      { name: "address", label: "العنوان", required: true },
    ],
  },
  {
    id: "experience",
    title: "الخبرات والمهارات",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      { name: "jobLevel", label: "المستوى الوظيفي", required: true },
      {
        name: "yearsExperience",
        label: "سنوات الخبرة",
        type: "number",
        required: true,
        min: 0,
      },
      {
        name: "lastCompany",
        label: "اسم الشركة الأخيرة",
      },
      {
        name: "workType",
        label: "طبيعة الدوام",
        type: "select",
        required: true,
        placeholder: "اختر نوع الدوام",
        options: [
          { value: "full-time", label: "دوام كامل" },
          { value: "part-time", label: "دوام جزئي" },
          { value: "freelance", label: "عمل حر" },
          { value: "hybrid", label: "هجين" },
        ],
      },
    ],
  },
  {
    id: "education",
    title: "التعليم",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      { name: "latestDegree", label: "آخر شهادة", required: true },
      { name: "specialization", label: "التخصص", required: true },
      { name: "university", label: "الجامعة/المعهد", required: true },
      {
        name: "graduationYear",
        label: "سنة التخرج",
        type: "number",
        required: true,
        min: 1950,
        max: 2100,
      },
      {
        name: "languages",
        label: "اللغات (مع مستوى كل لغة)",
        required: true,
        className: "xl:col-span-2",
      },
    ],
  },
  {
    id: "achievements",
    title: "إنجازات وأعمال",
    columnsClassName: "md:grid-cols-2 xl:grid-cols-3",
    fields: [
      {
        name: "topAchievement",
        label: "أبرز إنجاز حققته",
        required: true,
      },
      {
        name: "portfolioLink",
        label: "رابط معرض الأعمال",
        type: "url",
      },
      {
        name: "professionalProfile",
        label: "رابط LinkedIn أو GitHub",
        type: "url",
      },
      {
        name: "projectSummary",
        label: "نبذة مختصرة عن إنجازاتك وأعمالك",
        type: "textarea",
        required: true,
        className: "md:col-span-2 xl:col-span-3",
      },
    ],
  },
];

export const companyProfileEditorConfig: PortalProfileEditorConfig<CompanyProfileData> =
  {
    role: "company",
    entityLabel: "شركة",
    pageDescription: "هذا هو ملفك الشخصي الخاص بك في المنصة",
    summaryTagline: "لوحة إدارة الشركة",
    storageKey: "portal.company.profile",
    avatarStorageKey: "portal.company.profile.avatar",
    displayNameField: "companyName",
    fallbackDisplayName: "Google",
    defaultValues: emptyCompanyProfileData,
    sections: companyProfileSections,
    saveSuccessMessage: "تم حفظ تعديلات الشركة بنجاح.",
  };

export const personProfileEditorConfig: PortalProfileEditorConfig<PersonProfileData> =
  {
    role: "user",
    entityLabel: "مستخدم",
    pageDescription: "هذا هو ملفك الشخصي الخاص بك في المنصة",
    summaryTagline: "باحث عن فرصة مناسبة",
    storageKey: "portal.user.profile",
    avatarStorageKey: "portal.user.profile.avatar",
    displayNameField: "fullName",
    fallbackDisplayName: "أحمد الرسول",
    defaultValues: emptyPersonProfileData,
    sections: personProfileSections,
    saveSuccessMessage: "تم حفظ تعديلات الملف الشخصي بنجاح.",
  };
