import companyImage from "../assets/common/company_img.png";
import axiosClient from "./axiosClient";
import type { PortalJobRecord } from "../components/portal/portalJobsData";

export interface AdminJobRecord extends PortalJobRecord {
  publishedAt: string;
  applicationsCount: number;
}

interface RawJob {
  _id: string;
  companyId?: string | null;
  categoryName?: string | null;
  title?: string | null;
  specialization?: string | null;
  jobLevel?: string | null;
  requiredEducation?: string | null;
  jobType?: string | null;
  workDays?: string | null;
  workHours?: string | null;
  experienceYears?: number | null;
  location?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  resumeLanguage?: string | null;
  description?: string | null;
  responsibilities?: string | null;
  skills?: string | null;
  requirements?: string | null;
  applicationsCount?: number | null;
  createdAt?: string | null;
}

interface RawCompanySummary {
  _id: string;
  companyProfile?: {
    companyName?: string | null;
    website?: string | null;
  } | null;
}

interface RawJobsSummaryResponse {
  jobs: RawJob[];
}

interface RawCompaniesSummaryResponse {
  companies: RawCompanySummary[];
}

function toText(value: unknown, fallback = "غير محدد") {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function createDetailColumns(job: RawJob) {
  return [
    [
      {
        id: "specialization",
        label: "التخصص",
        value: toText(job.specialization),
      },
      {
        id: "job-level",
        label: "المستوى الوظيفي",
        value: toText(job.jobLevel),
      },
      {
        id: "job-type",
        label: "نوع العمل",
        value: toText(job.jobType),
      },
      {
        id: "experience",
        label: "سنوات الخبرة",
        value:
          job.experienceYears !== undefined && job.experienceYears !== null
            ? String(job.experienceYears)
            : "غير محدد",
      },
      {
        id: "education",
        label: "المؤهل المطلوب",
        value: toText(job.requiredEducation),
      },
      {
        id: "resume-language",
        label: "لغة السيرة الذاتية",
        value: toText(job.resumeLanguage),
      },
    ],
    [
      {
        id: "location",
        label: "الموقع",
        value: toText(job.location),
      },
      {
        id: "working-days",
        label: "أيام العمل",
        value: toText(job.workDays),
      },
      {
        id: "working-hours",
        label: "ساعات العمل",
        value: toText(job.workHours),
      },
      {
        id: "min-salary",
        label: "الحد الأدنى للراتب",
        value:
          job.minSalary !== undefined && job.minSalary !== null
            ? String(job.minSalary)
            : "غير محدد",
      },
      {
        id: "max-salary",
        label: "الحد الأعلى للراتب",
        value:
          job.maxSalary !== undefined && job.maxSalary !== null
            ? String(job.maxSalary)
            : "غير محدد",
      },
    ],
    [
      {
        id: "description",
        label: "الوصف",
        value: toText(job.description),
      },
      {
        id: "responsibilities",
        label: "المسؤوليات",
        value: toText(job.responsibilities),
      },
      {
        id: "skills",
        label: "المهارات",
        value: toText(job.skills),
      },
      {
        id: "requirements",
        label: "المتطلبات",
        value: toText(job.requirements),
      },
    ],
  ];
}

function mapJob(job: RawJob, companiesMap: Map<string, RawCompanySummary>) {
  const company = job.companyId ? companiesMap.get(job.companyId) : undefined;
  const companyName =
    company?.companyProfile?.companyName ??
    `شركة ${job.companyId ?? "غير معروفة"}`;
  const companyWebsite = company?.companyProfile?.website ?? "غير متاح";

  return {
    id: job._id,
    companyName,
    jobTitle: toText(job.title),
    location: toText(job.location),
    category: toText(job.categoryName),
    companyLegalName: companyName,
    companyWebsite,
    imageSrc: companyImage,
    imageAlt: companyName,
    detailColumns: createDetailColumns(job),
    applicationsCount: job.applicationsCount ?? 0,
    publishedAt: job.createdAt ?? new Date(0).toISOString(),
  } satisfies AdminJobRecord;
}

export async function getAdminJobs(): Promise<AdminJobRecord[]> {
  const [jobsResponse, companiesResponse] = await Promise.all([
    axiosClient.get<RawJobsSummaryResponse>("/dashboard/job/summary"),
    axiosClient.get<RawCompaniesSummaryResponse>("/dashboard/company/summary"),
  ]);

  const companiesMap = new Map(
    companiesResponse.data.companies.map((company) => [company._id, company]),
  );

  return jobsResponse.data.jobs.map((job) => mapJob(job, companiesMap));
}
