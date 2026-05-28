import type { CompanyProfileData } from "../utils/portalProfileSchemas";

export type AdminCompanyStatus = "active" | "blocked";

export interface AdminCompany {
  id: string;
  accountEmail: string;
  joinedAt: string;
  publishedJobsCount: number;
  publishedTrainingsCount: number;
  applicationsCount: number;
  status: AdminCompanyStatus;
  profile: CompanyProfileData;
}

const mockAdminCompanies: AdminCompany[] = [
  {
    id: "company-001",
    accountEmail: "hr@techbridge.example.com",
    joinedAt: "2026-02-10",
    publishedJobsCount: 7,
    publishedTrainingsCount: 2,
    applicationsCount: 48,
    status: "active",
    profile: {
      companyName: "Tech Bridge",
      sector: "technology",
      employeeCount: "85",
      country: "سوريا",
      city: "دمشق",
      address: "المالكي، دمشق",
      companyPhone: "+963 11 224 7000",
      website: "https://techbridge.example.com",
      hiringManagerName: "نور الحسن",
      companyEmail: "careers@techbridge.example.com",
      hiringJobTypes: "مطورو واجهات، مطورو خلفيات، محللو جودة",
      monthlyOpenings: "4",
      companyRecommendations:
        "نفضل المرشحين الذين لديهم مشاريع عملية وتجربة واضحة في العمل الجماعي.",
    },
  },
  {
    id: "company-002",
    accountEmail: "jobs@datalens.example.com",
    joinedAt: "2026-03-05",
    publishedJobsCount: 4,
    publishedTrainingsCount: 3,
    applicationsCount: 31,
    status: "active",
    profile: {
      companyName: "Data Lens",
      sector: "technology",
      employeeCount: "32",
      country: "سوريا",
      city: "حلب",
      address: "الجميلية، حلب",
      companyPhone: "+963 21 552 4100",
      website: "https://datalens.example.com",
      hiringManagerName: "مها منصور",
      companyEmail: "jobs@datalens.example.com",
      hiringJobTypes: "تحليل بيانات، ذكاء أعمال، إدخال بيانات",
      monthlyOpenings: "2",
      companyRecommendations:
        "الاهتمام بالتفاصيل والقدرة على شرح النتائج أهم من كثرة الأدوات.",
    },
  },
  {
    id: "company-003",
    accountEmail: "people@pixelworks.example.com",
    joinedAt: "2026-01-19",
    publishedJobsCount: 3,
    publishedTrainingsCount: 1,
    applicationsCount: 22,
    status: "blocked",
    profile: {
      companyName: "Pixel Works",
      sector: "design",
      employeeCount: "18",
      country: "سوريا",
      city: "حمص",
      address: "الوعر، حمص",
      companyPhone: "+963 31 880 1290",
      website: "https://pixelworks.example.com",
      hiringManagerName: "سامر الخوري",
      companyEmail: "people@pixelworks.example.com",
      hiringJobTypes: "مصممو UI/UX، مصممو هوية بصرية",
      monthlyOpenings: "1",
      companyRecommendations:
        "نراجع معرض الأعمال أولاً ثم ننتقل للمقابلة العملية.",
    },
  },
  {
    id: "company-004",
    accountEmail: "hr@bluesprint.example.com",
    joinedAt: "2026-04-08",
    publishedJobsCount: 5,
    publishedTrainingsCount: 0,
    applicationsCount: 37,
    status: "active",
    profile: {
      companyName: "Blue Sprint",
      sector: "marketing",
      employeeCount: "44",
      country: "سوريا",
      city: "اللاذقية",
      address: "المشروع السابع، اللاذقية",
      companyPhone: "+963 41 770 2100",
      website: "https://bluesprint.example.com",
      hiringManagerName: "لين يوسف",
      companyEmail: "hr@bluesprint.example.com",
      hiringJobTypes: "إدارة مشاريع، تسويق رقمي، كتابة محتوى",
      monthlyOpenings: "3",
      companyRecommendations:
        "نبحث عن أشخاص منظمين وقادرين على متابعة عدة حملات في الوقت نفسه.",
    },
  },
  {
    id: "company-005",
    accountEmail: "talent@apihouse.example.com",
    joinedAt: "2026-05-01",
    publishedJobsCount: 2,
    publishedTrainingsCount: 2,
    applicationsCount: 19,
    status: "active",
    profile: {
      companyName: "API House",
      sector: "technology",
      employeeCount: "26",
      country: "سوريا",
      city: "طرطوس",
      address: "الكورنيش، طرطوس",
      companyPhone: "+963 43 991 2200",
      website: "https://apihouse.example.com",
      hiringManagerName: "كريم ناصر",
      companyEmail: "talent@apihouse.example.com",
      hiringJobTypes: "Backend، DevOps، قواعد بيانات",
      monthlyOpenings: "2",
      companyRecommendations:
        "وجود خبرة في بناء APIs موثقة يعطي المرشح أولوية واضحة.",
    },
  },
];

export async function getAdminCompanies() {
  return mockAdminCompanies;
}
