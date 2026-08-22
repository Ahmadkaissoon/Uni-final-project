import type { PersonProfileData } from "../utils/portalProfileSchemas"
import type { PortalJobRecord } from "../components/portal/portalJobsData"
import type {
    PortalInternshipListingItem,
    PortalInternshipRecord,
} from "../components/portal/portalInternshipsData"
import { mapApiJobToPortalJobRecord } from "./portalJobs"
import { mapApiTrainingToPortalInternshipRecord } from "./portalTrainings"
import { queryClient } from "./queryClient"
import { useGetData, usePostData, useUpdateData } from "./useQueries"

interface ApiApplicationSeekerSummary {
    _id?: string
    name?: string | null
    city?: string | null
}

interface ApiJobApplicationSummaryItem {
    _id: string
    date?: string
    seeker?: ApiApplicationSeekerSummary | null
    job?: {
        _id?: string
        title?: string | null
        location?: string | null
    } | null
    requirementsMatchPercentage?: string | number | null
    status?: string | null
    cvFileId?: string
    cvFilename?: string
    cvUrl?: string | null
}

interface ApiTrainingApplicationSummaryItem {
    _id: string
    date?: string
    seeker?: ApiApplicationSeekerSummary | null
    training?: {
        _id?: string
        title?: string | null
        location?: string | null
    } | null
    requirementsMatchPercentage?: string | number | null
    status?: string | null
    cvFileId?: string
    cvFilename?: string
    cvUrl?: string | null
}

interface ApiApplicationListResponse<TItem> {
    data?: TItem[]
    total?: number
}

interface ApiSeekerApplicationCompany {
    _id?: string
    name?: string | null
    logoUrl?: string | null
    website?: string | null
}

interface ApiSeekerJobApplicationDetail {
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
    applicationsCount?: number
    company?: ApiSeekerApplicationCompany | null
    companyId?: string
}

interface ApiSeekerTrainingApplicationDetail {
    _id: string
    title?: string
    trainerLevel?: string
    category?: string
    categoryName?: string
    fieldOfTraining?: string
    trainingbonus?: string
    trainingLocation?: string
    trainingdays?: string
    trainingDuration?: string
    trainingDescription?: string
    goalsAndResponsibilities?: string
    requirements?: string
    skills?: string
    applicationsCount?: number
    createdAt?: string
    updatedAt?: string
    company?: ApiSeekerApplicationCompany | null
    companyId?: string
}

interface ApiSeekerJobApplicationItem {
    id?: string
    _id?: string
    jobId?: string | null
    date?: string
    jobName?: string | null
    company?: ApiSeekerApplicationCompany | null
    location?: string | null
    status?: string | null
}

interface ApiSeekerTrainingApplicationItem {
    id?: string
    _id?: string
    date?: string
    createdAt?: string
    trainingName?: string | null
    trainingTitle?: string | null
    trainingId?: string | null
    internshipId?: string | null
    company?: ApiSeekerApplicationCompany | null
    companyName?: string | null
    location?: string | null
    city?: string | null
    status?: string | null
}

interface ApiApplicantProfileLanguage {
    language?: string | null
    level?: string | null
}

interface ApiApplicantProfile {
    _id?: string
    email?: string | null
    fullName?: string | null
    profilePictureUrl?: string | null
    personalInfo?: {
        gender?: string | null
        birthDate?: string | null
        phone?: string | null
        country?: string | null
        city?: string | null
        address?: string | null
    } | null
    experience?: {
        jobLevel?: string | null
        yearsOfExperience?: number | string | null
        lastCompanyName?: string | null
        workType?: string | null
    } | null
    education?: {
        lastDegree?: string | null
        specialization?: string | null
        university?: string | null
        graduationYear?: number | string | null
    } | null
    languages?: ApiApplicantProfileLanguage[] | null
    links?: {
        personalWebsite?: string | null
        linkedin?: string | null
        github?: string | null
        behance?: string | null
    } | null
}

interface ApiJobApplicationDetailResponse {
    id?: string
    date?: string
    status?: string | null
    cvFileId?: string
    cvFilename?: string
    cvUrl?: string | null
    job?: {
        _id?: string
        title?: string | null
        location?: string | null
    } | null
    applicantProfile?: ApiApplicantProfile | null
}

interface ApiTrainingApplicationDetailResponse {
    id?: string
    date?: string
    status?: string | null
    cvFileId?: string
    cvFilename?: string
    cvUrl?: string | null
    training?: {
        _id?: string
        title?: string | null
        location?: string | null
    } | null
    applicantProfile?: ApiApplicantProfile | null
}

export interface PortalCompanyApplicationSummaryItem {
    id: string
    applicantName: string
    submittedAt: string
    submittedAtRaw: string
    opportunityTitle: string
    city: string
    matchRate: number | null
    statusLabel: string
    cvFileId: string
    cvFilename: string
    cvUrl: string | null
}

export interface PortalCompanyApplicationDetailRecord {
    id: string
    applicantName: string
    submittedAt: string
    submittedAtRaw: string
    statusLabel: string
    cvFileId: string
    cvFilename: string
    cvUrl: string | null
    avatarSrc: string | null
    profileData: PersonProfileData
}

export interface PortalSeekerApplicationMonitorItem {
    id: string
    date: string
    roleTitle: string
    companyName: string
    location: string
    statusLabel: string
    statusKey: "rejected" | "accepted" | "under_review"
    to: string
}

export interface PortalApplicationAcceptancePayload {
    meetingType: "online" | "offline"
    date: string
    time: string
    meetingLink?: string
}

export interface PortalJobApplicationPayload {
    jobId: string
    cv: File
}

function getApiAssetUrl(path?: string | null) {
    if (!path?.trim()) {
        return null
    }

    if (/^https?:\/\//i.test(path)) {
        return path
    }

    const apiUrl =
        import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz"

    return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function formatValue(value: unknown, fallback = "") {
    if (value === null || value === undefined) {
        return fallback
    }

    const text = String(value).trim()
    return text || fallback
}

function formatDateForInput(value?: string | null) {
    const resolvedValue = formatValue(value)
    return resolvedValue ? resolvedValue.slice(0, 10) : ""
}

function formatDisplayDate(value?: string | null) {
    const resolvedValue = formatDateForInput(value)

    if (!resolvedValue) {
        return "غير محدد"
    }

    const [year = "", month = "", day = ""] = resolvedValue.split("-")

    if (!year || !month || !day) {
        return resolvedValue
    }

    return `${day}/${month}/${year}`
}

function resolveMatchRate(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value
    }

    const normalizedValue = formatValue(value)

    if (!normalizedValue) {
        return null
    }

    const parsedValue = Number(normalizedValue)
    return Number.isFinite(parsedValue) ? parsedValue : null
}

function formatLanguages(
    languages?: ApiApplicantProfileLanguage[] | null,
) {
    const formattedLanguages =
        languages
            ?.map((languageItem) => {
                const languageName = formatValue(languageItem.language)
                const languageLevel = formatValue(languageItem.level)

                if (!languageName && !languageLevel) {
                    return ""
                }

                if (languageName && languageLevel) {
                    return `${languageName} (${languageLevel})`
                }

                return languageName || languageLevel
            })
            .filter(Boolean) ?? []

    return formattedLanguages.join(" - ")
}

function mapApplicantProfileToPersonProfileData(
    applicantProfile?: ApiApplicantProfile | null,
): PersonProfileData {
    return {
        fullName: formatValue(applicantProfile?.fullName),
        gender: formatValue(applicantProfile?.personalInfo?.gender),
        birthDate: formatDateForInput(applicantProfile?.personalInfo?.birthDate),
        phone: formatValue(applicantProfile?.personalInfo?.phone),
        country: formatValue(applicantProfile?.personalInfo?.country),
        city: formatValue(applicantProfile?.personalInfo?.city),
        address: formatValue(applicantProfile?.personalInfo?.address),
        jobLevel: formatValue(applicantProfile?.experience?.jobLevel),
        yearsExperience: formatValue(
            applicantProfile?.experience?.yearsOfExperience,
        ),
        lastCompany: formatValue(applicantProfile?.experience?.lastCompanyName),
        workType: formatValue(applicantProfile?.experience?.workType),
        latestDegree: formatValue(applicantProfile?.education?.lastDegree),
        specialization: formatValue(
            applicantProfile?.education?.specialization,
        ),
        university: formatValue(applicantProfile?.education?.university),
        graduationYear: formatValue(
            applicantProfile?.education?.graduationYear,
        ),
        languages: formatLanguages(applicantProfile?.languages),
        topAchievement: "",
        portfolioLink: formatValue(
            applicantProfile?.links?.personalWebsite ??
                applicantProfile?.links?.behance,
        ),
        professionalProfile: formatValue(
            applicantProfile?.links?.linkedin ??
                applicantProfile?.links?.github ??
                applicantProfile?.links?.behance,
        ),
        projectSummary: "",
    }
}

function mapJobApplicationSummary(
    application: ApiJobApplicationSummaryItem,
): PortalCompanyApplicationSummaryItem {
    const rawDate = formatDateForInput(application.date)

    return {
        id: application._id,
        applicantName: formatValue(application.seeker?.name, "متقدم جديد"),
        submittedAt: formatDisplayDate(application.date),
        submittedAtRaw: rawDate,
        opportunityTitle: formatValue(application.job?.title, "وظيفة"),
        city: formatValue(
            application.seeker?.city ?? application.job?.location,
            "غير محدد",
        ),
        matchRate: resolveMatchRate(application.requirementsMatchPercentage),
        statusLabel: formatValue(application.status, "غير محدد"),
        cvFileId: formatValue(application.cvFileId),
        cvFilename: formatValue(application.cvFilename),
        cvUrl: getApiAssetUrl(application.cvUrl),
    }
}

function mapTrainingApplicationSummary(
    application: ApiTrainingApplicationSummaryItem,
): PortalCompanyApplicationSummaryItem {
    const rawDate = formatDateForInput(application.date)

    return {
        id: application._id,
        applicantName: formatValue(application.seeker?.name, "متقدم جديد"),
        submittedAt: formatDisplayDate(application.date),
        submittedAtRaw: rawDate,
        opportunityTitle: formatValue(application.training?.title, "تدريب"),
        city: formatValue(
            application.seeker?.city ?? application.training?.location,
            "غير محدد",
        ),
        matchRate: resolveMatchRate(application.requirementsMatchPercentage),
        statusLabel: formatValue(application.status, "غير محدد"),
        cvFileId: formatValue(application.cvFileId),
        cvFilename: formatValue(application.cvFilename),
        cvUrl: getApiAssetUrl(application.cvUrl),
    }
}

function mapJobApplicationDetail(
    application: ApiJobApplicationDetailResponse,
): PortalCompanyApplicationDetailRecord {
    return {
        id: formatValue(application.id),
        applicantName: formatValue(
            application.applicantProfile?.fullName,
            "متقدم جديد",
        ),
        submittedAt: formatDisplayDate(application.date),
        submittedAtRaw: formatDateForInput(application.date),
        statusLabel: formatValue(application.status, "غير محدد"),
        cvFileId: formatValue(application.cvFileId),
        cvFilename: formatValue(application.cvFilename),
        cvUrl: getApiAssetUrl(application.cvUrl),
        avatarSrc: getApiAssetUrl(
            application.applicantProfile?.profilePictureUrl,
        ),
        profileData: mapApplicantProfileToPersonProfileData(
            application.applicantProfile,
        ),
    }
}

function mapTrainingApplicationDetail(
    application: ApiTrainingApplicationDetailResponse,
): PortalCompanyApplicationDetailRecord {
    const applicantProfile =
        application.applicantProfile ?? (application as ApiApplicantProfile)

    return {
        id: formatValue(application.id ?? applicantProfile._id),
        applicantName: formatValue(
            applicantProfile.fullName,
            "متقدم جديد",
        ),
        submittedAt: formatDisplayDate(application.date),
        submittedAtRaw: formatDateForInput(application.date),
        statusLabel: formatValue(application.status, "غير محدد"),
        cvFileId: formatValue(application.cvFileId),
        cvFilename: formatValue(application.cvFilename),
        cvUrl: getApiAssetUrl(application.cvUrl),
        avatarSrc: getApiAssetUrl(applicantProfile.profilePictureUrl),
        profileData: mapApplicantProfileToPersonProfileData(applicantProfile),
    }
}

function resolveApplicationStatusKey(status?: string | null) {
    const normalizedStatus = formatValue(status).toLowerCase()

    if (
        normalizedStatus.includes("accepted") ||
        normalizedStatus.includes("approved") ||
        normalizedStatus.includes("مقبول")
    ) {
        return "accepted" as const
    }

    if (
        normalizedStatus.includes("rejected") ||
        normalizedStatus.includes("refused") ||
        normalizedStatus.includes("مرفوض")
    ) {
        return "rejected" as const
    }

    return "under_review" as const
}

function mapSeekerJobApplication(
    application: ApiSeekerJobApplicationItem,
): PortalSeekerApplicationMonitorItem {
    const applicationId = formatValue(application.id ?? application._id)

    return {
        id: applicationId,
        date: formatDisplayDate(application.date),
        roleTitle: formatValue(application.jobName, "وظيفة"),
        companyName: formatValue(application.company?.name, "شركة غير محددة"),
        location: formatValue(application.location, "غير محدد"),
        statusLabel: formatValue(application.status, "قيد المراجعة"),
        statusKey: resolveApplicationStatusKey(application.status),
        to: `/jobs/watchlist?job=${encodeURIComponent(applicationId)}`,
    }
}

function mapSeekerTrainingApplication(
    application: ApiSeekerTrainingApplicationItem,
): PortalSeekerApplicationMonitorItem {
    const applicationId = formatValue(application.id ?? application._id)

    return {
        id: applicationId,
        date: formatDisplayDate(application.date ?? application.createdAt),
        roleTitle: formatValue(
            application.trainingName ?? application.trainingTitle,
            "تدريب",
        ),
        companyName: formatValue(
            application.company?.name ?? application.companyName,
            "شركة غير محددة",
        ),
        location: formatValue(
            application.location ?? application.city,
            "غير محدد",
        ),
        statusLabel: formatValue(application.status, "قيد المراجعة"),
        statusKey: resolveApplicationStatusKey(application.status),
        to: `/jobs/watchlist?training=${encodeURIComponent(applicationId)}`,
    }
}

function isPortalInternshipRecord(
    value?: PortalInternshipListingItem | PortalInternshipRecord | null,
): value is PortalInternshipRecord {
    return Boolean(value && "overview" in value && "companyWebsite" in value)
}

export function usePortalCompanyJobApplications(enabled = true) {
    const query = useGetData<ApiApplicationListResponse<ApiJobApplicationSummaryItem>>(
        "/applications/company/jobs",
        {},
        {
            enabled,
            queryKey: ["portal-company-job-applications"],
        },
    )

    return {
        ...query,
        applications: (query.data?.data ?? []).map(mapJobApplicationSummary),
        total: query.data?.total ?? 0,
    }
}

export function usePortalSeekerJobApplications(enabled = true) {
    const query = useGetData<
        ApiApplicationListResponse<ApiSeekerJobApplicationItem>
    >("/applications", {}, {
        enabled,
        queryKey: ["portal-seeker-job-applications"],
    })

    return {
        ...query,
        applications: (query.data?.data ?? []).map(mapSeekerJobApplication),
        total: query.data?.total ?? 0,
    }
}

export function usePortalSeekerTrainingApplications(enabled = true) {
    const query = useGetData<
        ApiApplicationListResponse<ApiSeekerTrainingApplicationItem>
    >("/applications/trainings", {}, {
        enabled,
        queryKey: ["portal-seeker-training-applications"],
    })

    return {
        ...query,
        applications: (query.data?.data ?? []).map(mapSeekerTrainingApplication),
        total: query.data?.total ?? 0,
    }
}

export function usePortalSeekerJobApplicationDetails(
    applicationId: string | null,
    fallback?: PortalJobRecord | null,
) {
    const query = useGetData<ApiSeekerJobApplicationDetail>(
        applicationId ? `/applications/${encodeURIComponent(applicationId)}` : null,
        {},
        {
            enabled: Boolean(applicationId),
            queryKey: ["portal-seeker-job-application-details", applicationId],
        },
    )

    return {
        ...query,
        job: query.data
            ? mapApiJobToPortalJobRecord(query.data, fallback)
            : fallback ?? null,
    }
}

export function usePortalSeekerTrainingApplicationDetails(
    applicationId: string | null,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
) {
    const query = useGetData<ApiSeekerTrainingApplicationDetail>(
        applicationId
            ? `/applications/trainings/${encodeURIComponent(applicationId)}`
            : null,
        {},
        {
            enabled: Boolean(applicationId),
            queryKey: [
                "portal-seeker-training-application-details",
                applicationId,
            ],
        },
    )

    return {
        ...query,
        training: query.data
            ? mapApiTrainingToPortalInternshipRecord(query.data, fallback)
            : isPortalInternshipRecord(fallback)
              ? fallback
              : null,
    }
}

export function usePortalCompanyTrainingApplications(enabled = true) {
    const query = useGetData<
        ApiApplicationListResponse<ApiTrainingApplicationSummaryItem>
    >("/applications/company/trainings", {}, {
        enabled,
        queryKey: ["portal-company-training-applications"],
    })

    return {
        ...query,
        applications: (query.data?.data ?? []).map(
            mapTrainingApplicationSummary,
        ),
        total: query.data?.total ?? 0,
    }
}

export function useApplyToPortalJob(jobId: string | null) {
    return usePostData<unknown, FormData>(
        "/applications",
        {},
        {
            toastMessages: {
                loading: "جاري إرسال طلب التوظيف...",
                success: "تم إرسال طلب التوظيف بنجاح",
                error: "فشل إرسال طلب التوظيف",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-seeker-job-applications"],
                })
            },
        },
    )
}

export function buildPortalJobApplicationFormData(
    payload: PortalJobApplicationPayload,
) {
    const formData = new FormData()
    formData.append("jobId", payload.jobId)
    formData.append("cv", payload.cv)
    return formData
}

export function usePortalCompanyJobApplication(
    applicationId: string | null,
    enabled = true,
) {
    const query = useGetData<ApiJobApplicationDetailResponse>(
        applicationId
            ? `/applications/company/jobs/${encodeURIComponent(applicationId)}`
            : null,
        {},
        {
            enabled: enabled && Boolean(applicationId),
            queryKey: ["portal-company-job-application", applicationId],
        },
    )

    return {
        ...query,
        application: query.data ? mapJobApplicationDetail(query.data) : null,
    }
}

export function usePortalCompanyTrainingApplication(
    applicationId: string | null,
    enabled = true,
) {
    const query = useGetData<ApiTrainingApplicationDetailResponse>(
        applicationId
            ? `/applications/company/trainings/${encodeURIComponent(applicationId)}`
            : null,
        {},
        {
            enabled: enabled && Boolean(applicationId),
            queryKey: ["portal-company-training-application", applicationId],
        },
    )

    return {
        ...query,
        application: query.data
            ? mapTrainingApplicationDetail(query.data)
            : null,
    }
}

export function useAcceptPortalCompanyJobApplication(
    applicationId: string | null,
) {
    const resolvedPath = applicationId
        ? `/applications/company/jobs/${encodeURIComponent(applicationId)}/accept`
        : "/applications/company/jobs"

    return useUpdateData<{ message?: string }, PortalApplicationAcceptancePayload>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري إرسال موعد المقابلة...",
                success: "تم قبول طلب التوظيف بنجاح",
                error: "فشل قبول طلب التوظيف",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-job-applications"],
                })

                if (applicationId) {
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-company-job-application", applicationId],
                    })
                }
            },
        },
    )
}

export function useRejectPortalCompanyJobApplication(
    applicationId: string | null,
) {
    const resolvedPath = applicationId
        ? `/applications/company/jobs/${encodeURIComponent(applicationId)}/reject`
        : "/applications/company/jobs"

    return useUpdateData<{ message?: string }, Record<string, never>>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري رفض طلب التوظيف...",
                success: "تم رفض طلب التوظيف بنجاح",
                error: "فشل رفض طلب التوظيف",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-job-applications"],
                })

                if (applicationId) {
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-company-job-application", applicationId],
                    })
                }
            },
        },
    )
}

export function useAcceptPortalCompanyTrainingApplication(
    applicationId: string | null,
) {
    const resolvedPath = applicationId
        ? `/applications/company/trainings/${encodeURIComponent(applicationId)}/accept`
        : "/applications/company/trainings"

    return useUpdateData<{ message?: string }, PortalApplicationAcceptancePayload>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري إرسال موعد مقابلة التدريب...",
                success: "تم قبول طلب التدريب بنجاح",
                error: "فشل قبول طلب التدريب",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-training-applications"],
                })

                if (applicationId) {
                    void queryClient.invalidateQueries({
                        queryKey: [
                            "portal-company-training-application",
                            applicationId,
                        ],
                    })
                }
            },
        },
    )
}

export function useRejectPortalCompanyTrainingApplication(
    applicationId: string | null,
) {
    const resolvedPath = applicationId
        ? `/applications/company/trainings/${encodeURIComponent(applicationId)}/reject`
        : "/applications/company/trainings"

    return useUpdateData<{ message?: string }, Record<string, never>>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري رفض طلب التدريب...",
                success: "تم رفض طلب التدريب بنجاح",
                error: "فشل رفض طلب التدريب",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-training-applications"],
                })

                if (applicationId) {
                    void queryClient.invalidateQueries({
                        queryKey: [
                            "portal-company-training-application",
                            applicationId,
                        ],
                    })
                }
            },
        },
    )
}
