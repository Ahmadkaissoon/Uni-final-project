import companyImage from "../assets/common/company_img.png";
import type {
  PortalJobDetailEntry,
  PortalJobRecord,
} from "../components/portal/portalJobsData";
import { getPortalJobPath } from "../components/portal/portalJobsData";
import { useGetData } from "./useQueries";

interface ApiJobCompany {
  _id?: string;
  name?: string;
  logoUrl?: string | null;
  website?: string | null;
}

interface ApiJob {
  _id: string;
  category?: string;
  categoryName?: string;
  title?: string;
  specialization?: string;
  jobLevel?: string;
  requiredEducation?: string;
  jobType?: string;
  workDays?: string;
  workHours?: string;
  experienceYears?: number;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  resumeLanguage?: string;
  description?: string;
  responsibilities?: string;
  skills?: string;
  requirements?: string;
  company?: ApiJobCompany | null;
  companyId?: string;
}

interface ApiJobListResponse {
  data?: ApiJob[];
  total?: number;
}

type ApiJobDetailResponse = ApiJob | { data?: ApiJob };

function getApiAssetUrl(path?: string | null) {
  if (!path?.trim()) {
    return undefined;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const apiUrl = import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz";
  return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function formatValue(value: unknown, fallback = "غير محدد") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  return text || fallback;
}

function formatSalary(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "غير محدد";
  }

  return `${value} شهرياً`;
}

function createDetailEntry(
  id: string,
  label: string,
  value: unknown,
): PortalJobDetailEntry {
  return {
    id,
    label,
    value: formatValue(value),
  };
}

function createApiJobDetailColumns(job: ApiJob): PortalJobDetailEntry[][] {
  return [
    [
      createDetailEntry("specialization", "التخصص", job.specialization),
      createDetailEntry("work-type", "نوع العمل", job.jobType),
      createDetailEntry("working-hours", "ساعات العمل", job.workHours),
      createDetailEntry("experience", "سنوات الخبرة", job.experienceYears),
      createDetailEntry("job-mode", "نوع الوظيفة", job.jobType),
    ],
    [
      createDetailEntry(
        "education-level",
        "المستوى التعليمي المطلوب",
        job.requiredEducation,
      ),
      createDetailEntry("seniority", "المستوى الوظيفي", job.jobLevel),
      createDetailEntry("working-days", "أيام العمل", job.workDays),
      createDetailEntry("cv-language", "لغة السيرة الذاتية", job.resumeLanguage),
      createDetailEntry("location", "المكان", job.location),
      {
        id: "min-salary",
        label: "الحد الأدنى للراتب",
        value: formatSalary(job.minSalary),
      },
      {
        id: "max-salary",
        label: "الحد الأعلى للراتب",
        value: formatSalary(job.maxSalary),
      },
    ],
    [
      createDetailEntry(
        "job-summary",
        "ملخص الوظيفة والغرض منها",
        job.description,
      ),
      createDetailEntry(
        "responsibilities",
        "المسؤوليات والواجبات",
        job.responsibilities,
      ),
      createDetailEntry("qualifications", "المؤهلات والمهارات", job.skills),
      createDetailEntry(
        "requirements",
        "شروط ومتطلبات الوظيفة",
        job.requirements,
      ),
    ],
  ];
}

function getCompanyName(job: ApiJob) {
  return formatValue(job.company?.name, "شركة غير محددة");
}

export function mapApiJobToPortalJobRecord(job: ApiJob): PortalJobRecord {
  const companyName = getCompanyName(job);
  const category = formatValue(job.category ?? job.categoryName, "وظيفة");
  const jobTitle = formatValue(job.title, category);
  const logoUrl = getApiAssetUrl(job.company?.logoUrl);

  return {
    id: job._id,
    companyName,
    jobTitle,
    location: formatValue(job.location),
    logoSrc: logoUrl,
    logoAlt: companyName,
    to: getPortalJobPath(job._id),
    category,
    companyLegalName: companyName,
    companyWebsite: formatValue(job.company?.website ?? job.companyId),
    imageSrc: logoUrl ?? companyImage,
    imageAlt: companyName,
    detailColumns: createApiJobDetailColumns(job),
  };
}

function resolveApiJobList(response: ApiJobListResponse | ApiJob[] | undefined) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
}

function resolveApiJobDetail(response: ApiJobDetailResponse | undefined) {
  if (!response) {
    return undefined;
  }

  if ("_id" in response) {
    return response;
  }

  return response.data;
}

export function usePortalJobs() {
  const query = useGetData<ApiJobListResponse | ApiJob[]>("/jobs", {}, {
    queryKey: ["portal-jobs"],
  });

  return {
    ...query,
    jobs: resolveApiJobList(query.data).map(mapApiJobToPortalJobRecord),
  };
}

export function usePortalJob(jobId: string | null) {
  const query = useGetData<ApiJobDetailResponse>(
    jobId ? `/jobs/${encodeURIComponent(jobId)}` : null,
    {},
    {
      enabled: Boolean(jobId),
      queryKey: ["portal-job", jobId],
    },
  );

  const apiJob = resolveApiJobDetail(query.data);

  return {
    ...query,
    job: apiJob ? mapApiJobToPortalJobRecord(apiJob) : null,
  };
}
