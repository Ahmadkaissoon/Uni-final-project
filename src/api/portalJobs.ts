import companyImage from "../assets/common/company_img.png"
import type {
    PortalJobDetailEntry,
    PortalJobRecord,
} from "../components/portal/portalJobsData"
import { getPortalJobPath } from "../components/portal/portalJobsData"
import { useGetData } from "./useQueries"

interface ApiJobCompany {
    _id?: string
    name?: string
    logoUrl?: string | null
    website?: string | null
}

interface ApiJob {
    _id: string
    category?: string
    categoryName?: string
    title?: string
    specialization?: string
    jobLevel?: string
    requiredEducation?: string
    jobType?: string
    workType?: string
    workDays?: string
    workHours?: string
    experienceYears?: number
    location?: string
    minSalary?: number
    maxSalary?: number
    resumeLanguage?: string
    languagelevel?: string
    description?: string
    responsibilities?: string
    skills?: string
    requirements?: string
    status?: string
    applicationsCount?: number
    company?: ApiJobCompany | null
    companyId?: string
}

interface ApiJobListResponse {
    data?: ApiJob[]
    total?: number
}

interface ApiJobCategoryListResponse {
    data?: ApiJobCategory[]
    total?: number
}

interface ApiJobCategory {
    _id: string
    name: string
    icon: string
    jobsCount: number
    __v: number
    createdAt: string
    updatedAt: string
}

type ApiJobDetailResponse = ApiJob | { data?: ApiJob }

function getApiAssetUrl(path?: string | null) {
    if (!path?.trim()) {
        return undefined
    }

    if (/^https?:\/\//i.test(path)) {
        return path
    }

    const apiUrl =
        import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz"
    return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function formatValue(value: unknown, fallback = "غير محدد") {
    if (value === null || value === undefined) {
        return fallback
    }

    const text = String(value).trim()
    return text || fallback
}

function formatSentenceValue(value: unknown, fallback = "غير محدد") {
    const text = formatValue(value, fallback)

    if (text === fallback) {
        return fallback
    }

    return text.replace(/_/g, " ")
}

function formatSalary(value: unknown) {
    if (value === null || value === undefined || value === "") {
        return "غير محدد"
    }

    return `${value} شهرياً`
}

function formatJobLevel(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "junior":
            return "مبتدئ"
        case "mid":
        case "mid-level":
        case "middle":
            return "متوسط"
        case "senior":
            return "كبير"
        case "lead":
            return "قائد فريق"
        case "manager":
            return "مدير"
        default:
            return formatSentenceValue(value)
    }
}

function formatEducationLevel(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "bachelor":
            return "بكالوريوس"
        case "master":
            return "ماجستير"
        case "phd":
            return "دكتوراه"
        case "diploma":
            return "دبلوم"
        case "high_school":
        case "high-school":
            return "ثانوية"
        default:
            return formatSentenceValue(value)
    }
}

function formatJobType(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "full_time":
        case "full-time":
            return "دوام كامل"
        case "part_time":
        case "part-time":
            return "دوام جزئي"
        case "contract":
            return "عقد"
        case "freelance":
            return "عمل حر"
        case "temporary":
            return "مؤقت"
        case "internship":
            return "تدريب"
        default:
            return formatSentenceValue(value)
    }
}

function formatWorkType(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "remote":
        case "remotely":
            return "عن بعد"
        case "hybrid":
        case "hybridly":
            return "هجين"
        case "onsite":
        case "on_site":
        case "on-site":
            return "ضمن الشركة"
        default:
            return formatSentenceValue(value)
    }
}

function formatLanguageLevel(value?: string) {
    switch (`${value ?? ""}`.trim().toUpperCase()) {
        case "A1":
            return "A1 - مبتدئ"
        case "A2":
            return "A2 - أساسي"
        case "B1":
            return "B1 - متوسط"
        case "B2":
            return "B2 - فوق المتوسط"
        case "C1":
            return "C1 - متقدم"
        case "C2":
            return "C2 - احترافي"
        default:
            return formatSentenceValue(value)
    }
}

function formatResumeLanguage(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "arabic":
            return "العربية"
        case "english":
            return "الإنجليزية"
        case "french":
            return "الفرنسية"
        default:
            return formatSentenceValue(value)
    }
}

function formatWorkDays(value?: string) {
    const normalizedValue = `${value ?? ""}`.trim()

    if (!normalizedValue) {
        return "غير محدد"
    }

    return normalizedValue
        .replace(/Saturday/gi, "السبت")
        .replace(/Sunday/gi, "الأحد")
        .replace(/Monday/gi, "الاثنين")
        .replace(/Tuesday/gi, "الثلاثاء")
        .replace(/Wednesday/gi, "الأربعاء")
        .replace(/Thursday/gi, "الخميس")
        .replace(/Friday/gi, "الجمعة")
        .replace(/\s+to\s+/gi, " إلى ")
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
    }
}

function createApiJobDetailColumns(job: ApiJob): PortalJobDetailEntry[][] {
    return [
        [
            createDetailEntry(
                "specialization",
                "التخصص",
                job.specialization ?? job.categoryName ?? job.category,
            ),
            createDetailEntry(
                "english-level",
                "مستوى اللغة الإنجليزية",
                formatLanguageLevel(job.languagelevel),
            ),
            createDetailEntry("work-type", "نوع العمل", formatJobType(job.jobType)),
            createDetailEntry(
                "working-hours",
                "ساعات العمل",
                formatSentenceValue(job.workHours),
            ),
            createDetailEntry(
                "experience",
                "سنوات الخبرة",
                job.experienceYears,
            ),
            createDetailEntry(
                "job-mode",
                "نوع الوظيفة",
                formatWorkType(job.workType),
            ),
        ],
        [
            createDetailEntry(
                "education-level",
                "المستوى التعليمي المطلوب",
                formatEducationLevel(job.requiredEducation),
            ),
            createDetailEntry(
                "seniority",
                "المستوى الوظيفي",
                formatJobLevel(job.jobLevel),
            ),
            createDetailEntry(
                "working-days",
                "أيام العمل",
                formatWorkDays(job.workDays),
            ),
            createDetailEntry(
                "cv-language",
                "لغة السيرة الذاتية",
                formatResumeLanguage(job.resumeLanguage),
            ),
            createDetailEntry("location", "المكان", formatSentenceValue(job.location)),
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
                formatSentenceValue(job.description),
            ),
            createDetailEntry(
                "responsibilities",
                "المسؤوليات والواجبات",
                formatSentenceValue(job.responsibilities),
            ),
            createDetailEntry(
                "qualifications",
                "المؤهلات والمهارات",
                formatSentenceValue(job.skills),
            ),
            createDetailEntry(
                "requirements",
                "شروط ومتطلبات الوظيفة",
                formatSentenceValue(job.requirements),
            ),
        ],
    ]
}

function getCompanyName(job: ApiJob) {
    return formatValue(job.company?.name, "شركة غير محددة")
}

function resolveApiJobList(
    response: ApiJobListResponse | ApiJob[] | undefined,
) {
    if (Array.isArray(response)) {
        return response
    }

    return response?.data ?? []
}

function resolveApiJobDetail(response: ApiJobDetailResponse | undefined) {
    if (!response) {
        return undefined
    }

    if ("_id" in response) {
        return response
    }

    return response.data
}

export function mapApiJobToPortalJobRecord(
    job: ApiJob,
    fallback?: PortalJobRecord | null,
): PortalJobRecord {
    const companyName = formatValue(
        job.company?.name ?? fallback?.companyName,
        "شركة غير محددة",
    )
    const category = formatValue(
        job.categoryName ?? job.category ?? fallback?.category,
        "وظيفة",
    )
    const jobTitle = formatValue(job.title ?? fallback?.jobTitle, category)
    const logoUrl = getApiAssetUrl(job.company?.logoUrl) ?? fallback?.logoSrc

    return {
        id: job._id,
        companyName,
        jobTitle,
        location: formatValue(job.location ?? fallback?.location),
        logoSrc: logoUrl,
        logoAlt: fallback?.logoAlt ?? companyName,
        logoLabel: fallback?.logoLabel,
        to: fallback?.to ?? getPortalJobPath(job._id),
        href: fallback?.href,
        target: fallback?.target,
        rel: fallback?.rel,
        category,
        companyLegalName: fallback?.companyLegalName ?? companyName,
        companyWebsite: formatValue(
            job.company?.website ?? fallback?.companyWebsite ?? job.companyId,
        ),
        imageSrc: logoUrl ?? fallback?.imageSrc ?? companyImage,
        imageAlt: fallback?.imageAlt ?? companyName,
        detailColumns: createApiJobDetailColumns(job),
    }
}

function mapApiNearbyJobToPortalNearbyJobItem(job: ApiJob) {
    const companyName = getCompanyName(job)
    const jobTitle = formatValue(
        job.title ?? job.categoryName ?? job.category,
        "فرصة عمل",
    )
    const logoUrl = getApiAssetUrl(job.company?.logoUrl)

    return {
        id: job._id,
        companyName,
        jobTitle,
        logoSrc: logoUrl,
        logoAlt: companyName,
        logoLabel: undefined,
        to: getPortalJobPath(job._id),
        href: undefined,
        target: undefined,
        rel: undefined,
    }
}

export function usePortalJobs() {
    const query = useGetData<ApiJobListResponse | ApiJob[]>(
        "/jobs",
        {},
        {
            queryKey: ["portal-jobs"],
        },
    )

    return {
        ...query,
        jobs: resolveApiJobList(query.data).map((job) =>
            mapApiJobToPortalJobRecord(job),
        ),
    }
}

export function usePortalNearbyJobs() {
    const query = useGetData<ApiJobListResponse | ApiJob[]>(
        "/jobs/nearby",
        {},
        {
            queryKey: ["portal-nearby-jobs"],
        },
    )

    return {
        ...query,
        jobs: resolveApiJobList(query.data).map(mapApiNearbyJobToPortalNearbyJobItem),
    }
}

export function usePortalJobCategories() {
    const query = useGetData<ApiJobCategoryListResponse>(
        "/job-categories",
        {},
        {
            queryKey: ["portal-job-categories"],
        },
    )

    return query
}

export function usePortalJob(
    jobId: string | null,
    fallback?: PortalJobRecord | null,
) {
    const query = useGetData<ApiJobDetailResponse>(
        jobId ? `/jobs/${encodeURIComponent(jobId)}` : null,
        {},
        {
            enabled: Boolean(jobId),
            queryKey: ["portal-job", jobId],
        },
    )

    const apiJob = resolveApiJobDetail(query.data)

    return {
        ...query,
        job: apiJob
            ? mapApiJobToPortalJobRecord(apiJob, fallback)
            : fallback ?? null,
    }
}

export function usePortalJobCategoryJobs(categoryId: string) {
    const query = useGetData<ApiJobListResponse | ApiJob[]>(
        `/job-categories/${categoryId}/jobs`,
        {},
        {
            enabled: Boolean(categoryId),
            queryKey: ["portal-job-category-jobs", categoryId],
        },
    )

    return {
        ...query,
        jobs: resolveApiJobList(query.data).map((job) =>
            mapApiJobToPortalJobRecord(job),
        ),
    }
}
