import companyImage from "../assets/common/company_img.png"
import type {
    PortalJobDetailEntry,
    PortalJobRecord,
} from "../components/portal/portalJobsData"
import type { CompanyJobFormData } from "../components/portal/companyForms/companyJobFormModel"
import { getPortalJobPath } from "../components/portal/portalJobsData"
import { queryClient } from "./queryClient"
import { useDeleteData, useGetData, usePostData, useUpdateData } from "./useQueries"

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

interface ApiCompanyJobSummary {
    id?: string
    date?: string
    jobName?: string
    location?: string
    status?: string
}

interface ApiCompanyJobSummaryResponse {
    data?: ApiCompanyJobSummary[]
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

export interface PortalCompanyJobSummaryItem {
    id: string
    date: string
    jobName: string
    location: string
    status: string
}

export interface CreatePortalJobPayload {
    categoryName: string
    title: string
    specialization: string
    jobLevel: string
    requiredEducation: string
    jobType: string
    workDays: string
    workHours: string
    experienceYears?: number
    location: string
    minSalary?: number
    maxSalary?: number
    resumeLanguage: string
    description: string
    responsibilities: string
    skills: string
    requirements: string
    workType: string
    languagelevel: string
}

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
        case "entry":
            return "مبتدئ"
        case "junior":
            return "جونيور"
        case "mid":
        case "mid-level":
        case "middle":
            return "متوسط"
        case "senior":
            return "سينيور"
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

function mapApiCompanyJobSummary(
    job: ApiCompanyJobSummary,
): PortalCompanyJobSummaryItem {
    const jobName = formatValue(job.jobName, "وظيفة غير محددة")
    const location = formatValue(job.location)

    return {
        id: formatValue(job.id, jobName),
        date: formatValue(job.date),
        jobName,
        location,
        status: formatValue(job.status),
    }
}

function normalizeSpaces(value: string) {
    return value.trim().replace(/\s+/g, " ")
}

function normalizeEnumValue(
    value: string,
    dictionary: Record<string, string>,
    fallback = "",
    preserveUnknown = true,
) {
    const normalizedValue = normalizeSpaces(value).toLowerCase().replace(/_/g, " ")

    if (!normalizedValue) {
        return fallback
    }

    const mappedValue = dictionary[normalizedValue]

    if (mappedValue) {
        return mappedValue
    }

    return preserveUnknown ? value.trim() : fallback
}

function extractNumber(value: string) {
    const match = value.match(/-?\d+(\.\d+)?/)

    if (!match) {
        return undefined
    }

    const parsedValue = Number(match[0])
    return Number.isFinite(parsedValue) ? parsedValue : undefined
}

function normalizeJobLevelForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            entry: "entry",
            "entry level": "entry",
            "entry-level": "entry",
            junior: "junior",
            mid: "mid-level",
            middle: "mid-level",
            "mid level": "mid-level",
            "mid-level": "mid-level",
            senior: "senior",
            lead: "lead",
            manager: "manager",
            fresh: "entry",
            "fresh graduate": "entry",
            "حديث تخرج": "entry",
            مبتدئ: "junior",
            متوسط: "mid-level",
            متقدم: "senior",
            كبير: "senior",
            "قائد فريق": "lead",
            مدير: "manager",
        },
        "entry",
        false,
    )
}

function normalizeEducationForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            bachelor: "Bachelor",
            بكالوريوس: "Bachelor",
            master: "Master",
            ماجستير: "Master",
            phd: "PhD",
            دكتوراه: "PhD",
            diploma: "Diploma",
            دبلوم: "Diploma",
            "high school": "High School",
            "high-school": "High School",
            ثانوية: "High School",
        },
        "Bachelor",
    )
}

function normalizeJobTypeForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            full_time: "full_time",
            "full time": "full_time",
            "full-time": "full_time",
            fulltime: "full_time",
            "دوام كامل": "full_time",
            part_time: "part_time",
            "part time": "part_time",
            "part-time": "part_time",
            parttime: "part_time",
            "دوام جزئي": "part_time",
            contract: "contract",
            عقد: "contract",
            freelance: "contract",
            "عمل حر": "contract",
            temporary: "temporary",
            مؤقت: "temporary",
            internship: "internship",
            تدريب: "internship",
        },
        "full_time",
        false,
    )
}

function normalizeWorkTypeForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            remote: "remotely",
            remotely: "remotely",
            "عن بعد": "remotely",
            hybrid: "hybrid",
            هجين: "hybrid",
            onsite: "onsite",
            "on site": "onsite",
            "on-site": "onsite",
            "ضمن الشركة": "onsite",
            مكتبي: "onsite",
        },
        "onsite",
        false,
    )
}

function normalizeResumeLanguageForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            arabic: "Arabic",
            عربي: "Arabic",
            العربية: "Arabic",
            english: "English",
            انجليزي: "English",
            انكليزي: "English",
            الإنجليزية: "English",
            french: "French",
            فرنسي: "French",
            الفرنسية: "French",
        },
        "English",
        false,
    )
}

function normalizeLanguageLevelForApi(value: string) {
    return normalizeEnumValue(
        value,
        {
            a1: "A1",
            a2: "A2",
            b1: "B1",
            b2: "B2",
            c1: "C1",
            c2: "C2",
            basic: "A2",
            beginner: "A2",
            مبتدئ: "A2",
            متوسط: "B1",
            intermediate: "B1",
            متقدم: "B2",
            advanced: "B2",
            fluent: "C1",
            طليق: "C1",
            احترافي: "C2",
        },
        "B1",
        false,
    )
}

export function mapCompanyJobFormDataToCreatePortalJobPayload(
    formData: CompanyJobFormData,
): CreatePortalJobPayload {
    return {
        categoryName: normalizeSpaces(formData.jobCategory),
        title: normalizeSpaces(formData.jobTitle),
        specialization: normalizeSpaces(formData.specialization),
        jobLevel: normalizeJobLevelForApi(formData.seniority),
        requiredEducation: normalizeEducationForApi(formData.educationLevel),
        jobType: normalizeJobTypeForApi(formData.workMode),
        workDays: normalizeSpaces(formData.workingDays),
        workHours: normalizeSpaces(formData.workingHours),
        experienceYears: extractNumber(formData.yearsExperience),
        location: normalizeSpaces(formData.location),
        minSalary: extractNumber(formData.minSalary),
        maxSalary: extractNumber(formData.maxSalary),
        resumeLanguage: normalizeResumeLanguageForApi(formData.cvLanguage),
        description: formData.jobSummary.trim(),
        responsibilities: formData.responsibilities.trim(),
        skills: formData.qualifications.trim(),
        requirements: formData.requirements.trim(),
        workType: normalizeWorkTypeForApi(formData.jobType),
        languagelevel: normalizeLanguageLevelForApi(formData.englishLevel),
    }
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

export function useCreatePortalJob() {
    return usePostData<ApiJob, CreatePortalJobPayload>("/jobs", {}, {
        toastMessages: {
            loading: "جارٍ إنشاء الوظيفة...",
            success: "تم إنشاء الوظيفة بنجاح",
            error: "فشل إنشاء الوظيفة",
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["portal-company-jobs"],
            })
            void queryClient.invalidateQueries({
                queryKey: ["portal-jobs"],
            })
        },
    })
}

export function useUpdatePortalJob(jobId: string | null) {
    const resolvedPath = jobId
        ? `/jobs/${encodeURIComponent(jobId)}`
        : "/jobs"

    return useUpdateData<ApiJob, CreatePortalJobPayload>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري تحديث الوظيفة...",
                success: "تم تحديث الوظيفة بنجاح",
                error: "فشل تحديث الوظيفة",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-jobs"],
                })
                void queryClient.invalidateQueries({
                    queryKey: ["portal-jobs"],
                })

                if (jobId) {
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-company-job", jobId],
                    })
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-job", jobId],
                    })
                }
            },
        },
    )
}

export function useDeletePortalJob() {
    return useDeleteData<{ message?: string }>({}, {
        toastMessages: {
            loading: "جاري حذف الوظيفة...",
            success: "تم حذف الوظيفة بنجاح",
            error: "فشل حذف الوظيفة",
        },
        onSuccess: (_response, link) => {
            void queryClient.invalidateQueries({
                queryKey: ["portal-company-jobs"],
            })
            void queryClient.invalidateQueries({
                queryKey: ["portal-jobs"],
            })

            const jobId = link.split("/").filter(Boolean).at(-1)

            if (jobId) {
                void queryClient.removeQueries({
                    queryKey: ["portal-company-job", jobId],
                })
                void queryClient.removeQueries({
                    queryKey: ["portal-job", jobId],
                })
            }
        },
    })
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

export function usePortalCompanyJobs() {
    const query = useGetData<ApiCompanyJobSummaryResponse>("/jobs/company", {}, {
        queryKey: ["portal-company-jobs"],
    })

    return {
        ...query,
        jobs: (query.data?.data ?? []).map(mapApiCompanyJobSummary),
        total: query.data?.total ?? 0,
    }
}

export function usePortalCompanyJob(
    jobId: string | null,
    fallback?: PortalJobRecord | null,
) {
    const query = useGetData<ApiJobDetailResponse>(
        jobId ? `/jobs/company/${encodeURIComponent(jobId)}` : null,
        {},
        {
            enabled: Boolean(jobId),
            queryKey: ["portal-company-job", jobId],
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
