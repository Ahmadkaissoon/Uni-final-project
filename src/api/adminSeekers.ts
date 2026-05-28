import type { PersonProfileData } from "../utils/portalProfileSchemas";

export type AdminSeekerStatus = "active" | "blocked";

export interface AdminSeeker {
  id: string;
  email: string;
  joinedAt: string;
  applicationsCount: number;
  savedJobsCount: number;
  status: AdminSeekerStatus;
  profile: PersonProfileData;
}

const mockAdminSeekers: AdminSeeker[] = [
  {
    id: "seeker-001",
    email: "ahmad.khatib@example.com",
    joinedAt: "2026-04-12",
    applicationsCount: 8,
    savedJobsCount: 14,
    status: "active",
    profile: {
      fullName: "أحمد الخطيب",
      gender: "male",
      birthDate: "1999-08-14",
      phone: "+963 944 123 456",
      country: "سوريا",
      city: "دمشق",
      address: "المزة، دمشق",
      jobLevel: "متوسط",
      yearsExperience: "3",
      lastCompany: "Tech Bridge",
      workType: "full-time",
      latestDegree: "بكالوريوس",
      specialization: "هندسة برمجيات",
      university: "جامعة دمشق",
      graduationYear: "2022",
      languages: "العربية: ممتاز، الإنجليزية: جيد جداً",
      topAchievement: "بناء لوحة تحكم توظيف لشركة محلية",
      portfolioLink: "https://ahmad-khatib.example.com",
      professionalProfile: "https://github.com/ahmad-khatib",
      projectSummary:
        "عمل على تطبيقات React وواجهات إدارية مع اهتمام بتحسين تجربة المستخدم والأداء.",
    },
  },
  {
    id: "seeker-002",
    email: "sara.mansour@example.com",
    joinedAt: "2026-03-27",
    applicationsCount: 5,
    savedJobsCount: 9,
    status: "active",
    profile: {
      fullName: "سارة منصور",
      gender: "female",
      birthDate: "2001-11-02",
      phone: "+963 933 765 210",
      country: "سوريا",
      city: "حلب",
      address: "الجميلية، حلب",
      jobLevel: "مبتدئ",
      yearsExperience: "1",
      lastCompany: "Data Lens",
      workType: "hybrid",
      latestDegree: "بكالوريوس",
      specialization: "إحصاء تطبيقي",
      university: "جامعة حلب",
      graduationYear: "2024",
      languages: "العربية: ممتاز، الإنجليزية: متوسط",
      topAchievement: "إعداد تقرير مبيعات تفاعلي لفريق تجاري",
      portfolioLink: "https://sara-data.example.com",
      professionalProfile: "https://linkedin.com/in/sara-mansour",
      projectSummary:
        "تركز على تنظيف البيانات وبناء dashboards عملية باستخدام SQL وPower BI.",
    },
  },
  {
    id: "seeker-003",
    email: "laith.ali@example.com",
    joinedAt: "2026-02-18",
    applicationsCount: 11,
    savedJobsCount: 6,
    status: "blocked",
    profile: {
      fullName: "ليث العلي",
      gender: "male",
      birthDate: "1996-05-21",
      phone: "+963 955 440 018",
      country: "سوريا",
      city: "حمص",
      address: "الوعر، حمص",
      jobLevel: "خبير",
      yearsExperience: "6",
      lastCompany: "Pixel Works",
      workType: "freelance",
      latestDegree: "ماجستير",
      specialization: "تصميم بصري",
      university: "جامعة البعث",
      graduationYear: "2020",
      languages: "العربية: ممتاز، الإنجليزية: جيد",
      topAchievement: "تصميم نظام واجهات موحد لتطبيق خدمات",
      portfolioLink: "https://laith-design.example.com",
      professionalProfile: "https://dribbble.com/laith-ali",
      projectSummary:
        "مصمم منتجات رقمية بخبرة في أبحاث المستخدم، النمذجة، وبناء أنظمة التصميم.",
    },
  },
  {
    id: "seeker-004",
    email: "rana.yousef@example.com",
    joinedAt: "2026-05-03",
    applicationsCount: 3,
    savedJobsCount: 12,
    status: "active",
    profile: {
      fullName: "رنا يوسف",
      gender: "female",
      birthDate: "1998-12-09",
      phone: "+963 988 222 641",
      country: "سوريا",
      city: "اللاذقية",
      address: "المشروع السابع، اللاذقية",
      jobLevel: "متوسط",
      yearsExperience: "4",
      lastCompany: "Blue Sprint",
      workType: "full-time",
      latestDegree: "بكالوريوس",
      specialization: "إدارة أعمال",
      university: "جامعة تشرين",
      graduationYear: "2021",
      languages: "العربية: ممتاز، الإنجليزية: جيد جداً",
      topAchievement: "تنظيم دورة تسليم منتج خلال 8 أسابيع",
      portfolioLink: "",
      professionalProfile: "https://linkedin.com/in/rana-yousef",
      projectSummary:
        "تبحث عن فرص في تنسيق الفرق التقنية، متابعة المهام، وتحسين عمليات التسليم.",
    },
  },
  {
    id: "seeker-005",
    email: "majd.nasser@example.com",
    joinedAt: "2026-01-22",
    applicationsCount: 6,
    savedJobsCount: 4,
    status: "active",
    profile: {
      fullName: "مجد ناصر",
      gender: "male",
      birthDate: "2000-03-17",
      phone: "+963 991 803 112",
      country: "سوريا",
      city: "طرطوس",
      address: "الكورنيش، طرطوس",
      jobLevel: "مبتدئ",
      yearsExperience: "2",
      lastCompany: "API House",
      workType: "part-time",
      latestDegree: "دبلوم تقاني",
      specialization: "تقنيات حاسوب",
      university: "المعهد التقاني للحاسوب",
      graduationYear: "2023",
      languages: "العربية: ممتاز، الإنجليزية: متوسط",
      topAchievement: "بناء API لإدارة حجوزات داخلية",
      portfolioLink: "https://majd-api.example.com",
      professionalProfile: "https://github.com/majd-nasser",
      projectSummary:
        "مهتم ببناء REST APIs وقواعد البيانات العلائقية وتحسين تنظيم الكود الخلفي.",
    },
  },
];

export async function getAdminSeekers() {
  return mockAdminSeekers;
}
