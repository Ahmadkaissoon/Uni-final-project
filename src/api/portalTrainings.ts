import companyImage from "../assets/common/company_img.png"
import {
    buildCompanyTrainingRecord,
    type CompanyTrainingFormData,
} from "../components/portal/companyForms/companyTrainingFormModel"
import type {
    PortalInternshipListingItem,
    PortalInternshipQuickFact,
    PortalInternshipRecord,
} from "../components/portal/portalInternshipsData"
import { getPortalInternshipPath } from "../components/portal/portalInternshipsData"
import type { PortalTrainingRecord } from "../components/portal/portalTrainingsData"
import { queryClient } from "./queryClient"
import { useDeleteData, useGetData, usePostData, useUpdateData } from "./useQueries"

interface ApiTrainingCompany {
    _id?: string
    name?: string
    logoUrl?: string | null
    website?: string | null
}

interface ApiTraining {
    _id: string
    companyId?: string
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
    status?: string
    applicationsCount?: number
    createdAt?: string
    updatedAt?: string
    company?: ApiTrainingCompany | null
}

interface ApiTrainingListResponse {
    data?: ApiTraining[]
    total?: number
}

type ApiTrainingDetailResponse = ApiTraining | { data?: ApiTraining }

export interface CreatePortalTrainingPayload {
    title: string
    trainerLevel?: string
    categoryName: string
    trainingbonus: string
    trainingLocation: string
    trainingdays: string
    trainingDuration: string
    trainingDescription: string
    goalsAndResponsibilities: string
    requirements: string
    skills: string
}

export interface PortalCompanyTrainingSummaryItem {
    id: string
    date: string
    trainingName: string
    location: string
    status: string
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

function resolveTrainerLevel(level?: string) {
    switch (`${level ?? ""}`.trim().toLowerCase()) {
        case "beginner":
            return "مبتدئ"
        case "intermediate":
            return "متوسط"
        case "advanced":
            return "متقدم"
        default:
            return formatSentenceValue(level)
    }
}

function formatFieldOfTraining(value?: string) {
    switch (`${value ?? ""}`.trim().toLowerCase()) {
        case "front-end development":
            return "تطوير الواجهات الأمامية"
        case "back-end development":
            return "تطوير الواجهات الخلفية"
        case "full-stack development":
            return "تطوير التطبيقات المتكامل"
        case "ui/ux design":
            return "تصميم UI/UX"
        case "human resources":
            return "الموارد البشرية"
        case "digital marketing":
            return "التسويق الرقمي"
        default:
            return formatSentenceValue(value)
    }
}

function normalizeSpaces(value: string) {
    return value.trim().replace(/\s+/g, " ")
}

function normalizeTrainerLevelForApi(value: string) {
    const normalizedValue = normalizeSpaces(value).toLowerCase().replace(/_/g, " ")

    if (!normalizedValue) {
        return undefined
    }

    switch (normalizedValue) {
        case "beginner":
        case "مبتدئ":
            return "beginner"
        case "intermediate":
        case "متوسط":
            return "intermediate"
        case "advanced":
        case "متقدم":
            return "advanced"
        default:
            return undefined
    }
}

function formatTrainingDays(value?: string) {
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

function formatTrainingLocation(value?: string) {
    return formatSentenceValue(value)
        .replace(/,\s*SA$/i, "، السعودية")
        .replace(/,\s*AE$/i, "، الإمارات")
        .replace(/,\s*SY$/i, "، سوريا")
        .replace(/,\s*EG$/i, "، مصر")
}

function parseTextList(value?: string) {
    const source = `${value ?? ""}`
        .split(/\r?\n|•|،|,/)
        .map((item) => item.trim())
        .filter(Boolean)

    return source.length > 0 ? source : ["غير محدد"]
}

function formatCompanyListDate(value?: string) {
    const text = `${value ?? ""}`.trim()

    if (!text) {
        return "غير محدد"
    }

    return text.slice(0, 10)
}

function resolveApiTrainingList(
    response: ApiTrainingListResponse | ApiTraining[] | undefined,
) {
    if (Array.isArray(response)) {
        return response
    }

    return response?.data ?? []
}

function resolveApiTrainingTotal(
    response: ApiTrainingListResponse | ApiTraining[] | undefined,
) {
    if (Array.isArray(response)) {
        return response.length
    }

    return response?.total ?? response?.data?.length ?? 0
}

function resolveApiTrainingDetail(response: ApiTrainingDetailResponse | undefined) {
    if (!response) {
        return undefined
    }

    if ("_id" in response) {
        return response
    }

    return response.data
}

function isInternshipRecord(
    value?: PortalInternshipListingItem | PortalInternshipRecord | null,
): value is PortalInternshipRecord {
    return Boolean(value && "companyWebsite" in value && "overview" in value)
}

function resolveCompanyReference(
    training: ApiTraining,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
) {
    const fullFallback = isInternshipRecord(fallback) ? fallback : null

    return formatValue(
        training.company?.website ??
            fullFallback?.companyWebsite ??
            training.company?.name ??
            training.company?._id ??
            training.companyId,
    )
}

function resolveCompanyPagePath(
    training: ApiTraining,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
) {
    const fullFallback = isInternshipRecord(fallback) ? fallback : null
    const companyId = training.company?._id ?? training.companyId

    return companyId
        ? `/companies/all?company=${encodeURIComponent(companyId)}`
        : fullFallback?.companyPageTo ?? "/companies/all"
}

function createQuickFacts(
    training: ApiTraining,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
): PortalInternshipQuickFact[] {
    const fullFallback = isInternshipRecord(fallback) ? fallback : null

    return [
        {
            id: "type",
            label: "النوع",
            value: formatValue(
                formatFieldOfTraining(training.fieldOfTraining) !== "غير محدد"
                    ? formatFieldOfTraining(training.fieldOfTraining)
                    : formatFieldOfTraining(training.categoryName) !== "غير محدد"
                      ? formatFieldOfTraining(training.categoryName)
                    : formatFieldOfTraining(training.category) !== "غير محدد"
                      ? formatFieldOfTraining(training.category)
                    : resolveTrainerLevel(training.trainerLevel),
            ),
            iconName: "briefcase",
        },
        {
            id: "duration",
            label: "المدة",
            value: formatValue(
                formatSentenceValue(
                    training.trainingDuration ??
                        fullFallback?.quickFacts.find(
                            (fact) => fact.id === "duration",
                        )?.value,
                ),
            ),
            iconName: "clock",
        },
        {
            id: "schedule",
            label: "الدوام",
            value: formatValue(
                formatTrainingDays(
                    training.trainingdays ??
                        fullFallback?.quickFacts.find(
                            (fact) => fact.id === "schedule",
                        )?.value,
                ),
            ),
            iconName: "calendar",
        },
        {
            id: "reward",
            label: "المكافأة",
            value: formatValue(
                training.trainingbonus ??
                    fullFallback?.quickFacts.find((fact) => fact.id === "reward")
                        ?.value,
            ),
            iconName: "badge",
        },
    ]
}

export function mapApiTrainingToPortalInternshipListingItem(
    training: ApiTraining,
): PortalInternshipListingItem {
    const companyName = formatValue(training.company?.name, "شركة غير محددة")
    const logoSrc = getApiAssetUrl(training.company?.logoUrl)

    return {
        id: training._id,
        companyName,
        trainingType: formatValue(training.title, "فرصة تدريب"),
        logoSrc,
        logoAlt: companyName,
        logoLabel: undefined,
        to: getPortalInternshipPath(training._id),
        href: undefined,
        target: undefined,
        rel: undefined,
    }
}

export function mapApiTrainingToPortalInternshipRecord(
    training: ApiTraining,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
): PortalInternshipRecord {
    const companyName = formatValue(
        training.company?.name ?? fallback?.companyName,
        "شركة غير محددة",
    )
    const logoSrc = getApiAssetUrl(training.company?.logoUrl) ?? fallback?.logoSrc
    const fullFallback = isInternshipRecord(fallback) ? fallback : null

    return {
        id: training._id,
        companyName,
        trainingType: formatValue(
            training.title ?? fallback?.trainingType,
            "فرصة تدريب",
        ),
        logoSrc,
        logoAlt: fallback?.logoAlt ?? companyName,
        logoLabel: fallback?.logoLabel,
        to: fallback?.to ?? getPortalInternshipPath(training._id),
        href: fallback?.href,
        target: fallback?.target,
        rel: fallback?.rel,
        companyLegalName: companyName,
        companyWebsite: resolveCompanyReference(training, fallback),
        location: formatValue(
            formatTrainingLocation(
                training.trainingLocation ?? fullFallback?.location,
            ),
        ),
        companyPageTo: resolveCompanyPagePath(training, fallback),
        imageSrc: logoSrc ?? fullFallback?.imageSrc ?? companyImage,
        imageAlt: fullFallback?.imageAlt ?? companyName,
        overview: formatValue(
            formatSentenceValue(
                training.trainingDescription ?? fullFallback?.overview,
            ),
        ),
        quickFacts: createQuickFacts(training, fallback),
        responsibilities: parseTextList(
            training.goalsAndResponsibilities ??
                fullFallback?.responsibilities?.join("\n"),
        ),
        skills: parseTextList(training.skills ?? fullFallback?.skills?.join("\n")),
        requirements: parseTextList(
            training.requirements ?? fullFallback?.requirements?.join("\n"),
        ),
        relatedInternshipIds: fullFallback?.relatedInternshipIds ?? [],
    }
}

function mapApiTrainingToCompanyTrainingFormData(
    training: ApiTraining,
): CompanyTrainingFormData {
    return {
        trainingCategory: formatValue(
            formatFieldOfTraining(
                training.categoryName ?? training.fieldOfTraining ?? training.category,
            ),
        ),
        trainingTitle: formatValue(training.title, "فرصة تدريب"),
        traineeLevel: formatValue(resolveTrainerLevel(training.trainerLevel)),
        trainingDuration: formatValue(
            formatSentenceValue(training.trainingDuration),
        ),
        trainingSchedule: formatValue(formatTrainingDays(training.trainingdays)),
        trainingReward: formatValue(training.trainingbonus),
        trainingLocation: formatValue(
            formatTrainingLocation(training.trainingLocation),
        ),
        aboutTraining: formatValue(
            formatSentenceValue(training.trainingDescription),
        ),
        responsibilities: formatValue(
            formatSentenceValue(training.goalsAndResponsibilities),
        ),
        skills: formatValue(formatSentenceValue(training.skills)),
        conditions: formatValue(formatSentenceValue(training.requirements)),
    }
}

export function mapApiTrainingToPortalCompanyTrainingRecord(
    training: ApiTraining,
    fallback?: PortalTrainingRecord | null,
): PortalTrainingRecord {
    const companyName = formatValue(
        training.company?.name ?? fallback?.companyName,
        "شركتك",
    )
    const imageSrc =
        getApiAssetUrl(training.company?.logoUrl) ??
        fallback?.imageSrc ??
        companyImage

    return buildCompanyTrainingRecord(
        mapApiTrainingToCompanyTrainingFormData(training),
        {
            id: training._id,
            companyName,
            companyLegalName: formatValue(
                training.company?.name ?? fallback?.companyLegalName,
                companyName,
            ),
            companyWebsite: formatValue(
                training.company?.website ?? fallback?.companyWebsite,
                "الملف الحالي",
            ),
            imageSrc,
            imageAlt: fallback?.imageAlt ?? companyName,
        },
    )
}

function mapApiTrainingToPortalCompanyTrainingSummaryItem(
    training: ApiTraining,
): PortalCompanyTrainingSummaryItem {
    return {
        id: training._id,
        date: formatCompanyListDate(training.createdAt),
        trainingName: formatValue(training.title, "فرصة تدريب"),
        location: formatValue(
            formatTrainingLocation(training.trainingLocation),
        ),
        status: formatValue(training.status, "غير محدد"),
    }
}

export function mapCompanyTrainingFormDataToCreatePortalTrainingPayload(
    formData: CompanyTrainingFormData,
): CreatePortalTrainingPayload {
    return {
        title: normalizeSpaces(formData.trainingTitle),
        trainerLevel: normalizeTrainerLevelForApi(formData.traineeLevel),
        categoryName: normalizeSpaces(formData.trainingCategory),
        trainingbonus: normalizeSpaces(formData.trainingReward),
        trainingLocation: normalizeSpaces(formData.trainingLocation),
        trainingdays: normalizeSpaces(formData.trainingSchedule),
        trainingDuration: normalizeSpaces(formData.trainingDuration),
        trainingDescription: formData.aboutTraining.trim(),
        goalsAndResponsibilities: formData.responsibilities.trim(),
        requirements: formData.conditions.trim(),
        skills: formData.skills.trim(),
    }
}

export function usePortalTrainings() {
    const query = useGetData<ApiTrainingListResponse | ApiTraining[]>(
        "/trainings",
        {},
        {
            queryKey: ["portal-trainings"],
        },
    )

    return {
        ...query,
        trainings: resolveApiTrainingList(query.data).map(
            mapApiTrainingToPortalInternshipListingItem,
        ),
    }
}

export function useCreatePortalTraining() {
    return usePostData<ApiTraining, CreatePortalTrainingPayload>("/trainings", {}, {
        toastMessages: {
            loading: "جارٍ إنشاء التدريب...",
            success: "تم إنشاء التدريب بنجاح",
            error: "فشل إنشاء التدريب",
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["portal-company-trainings"],
            })
            void queryClient.invalidateQueries({
                queryKey: ["portal-trainings"],
            })
            void queryClient.invalidateQueries({
                queryKey: ["portal-similar-trainings"],
            })
        },
    })
}

export function useUpdatePortalTraining(trainingId: string | null) {
    const resolvedPath = trainingId
        ? `/trainings/${encodeURIComponent(trainingId)}`
        : "/trainings"

    return useUpdateData<ApiTraining, CreatePortalTrainingPayload>(
        resolvedPath,
        {},
        false,
        "put",
        {
            toastMessages: {
                loading: "جاري تحديث التدريب...",
                success: "تم تحديث التدريب بنجاح",
                error: "فشل تحديث التدريب",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: ["portal-company-trainings"],
                })
                void queryClient.invalidateQueries({
                    queryKey: ["portal-trainings"],
                })

                if (trainingId) {
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-company-training", trainingId],
                    })
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-training", trainingId],
                    })
                    void queryClient.invalidateQueries({
                        queryKey: ["portal-similar-trainings", trainingId],
                    })
                }
            },
        },
    )
}

export function useDeletePortalTraining() {
    return useDeleteData<{ message?: string }>({}, {
        toastMessages: {
            loading: "جاري حذف التدريب...",
            success: "تم حذف التدريب بنجاح",
            error: "فشل حذف التدريب",
        },
        onSuccess: (_response, link) => {
            void queryClient.invalidateQueries({
                queryKey: ["portal-company-trainings"],
            })
            void queryClient.invalidateQueries({
                queryKey: ["portal-trainings"],
            })

            const trainingId = link.split("/").filter(Boolean).at(-1)

            if (trainingId) {
                void queryClient.removeQueries({
                    queryKey: ["portal-company-training", trainingId],
                })
                void queryClient.removeQueries({
                    queryKey: ["portal-training", trainingId],
                })
                void queryClient.removeQueries({
                    queryKey: ["portal-similar-trainings", trainingId],
                })
            }
        },
    })
}

export function usePortalCompanyTrainings() {
    const query = useGetData<ApiTrainingListResponse | ApiTraining[]>(
        "/trainings/company",
        {},
        {
            queryKey: ["portal-company-trainings"],
        },
    )

    return {
        ...query,
        trainings: resolveApiTrainingList(query.data).map(
            mapApiTrainingToPortalCompanyTrainingSummaryItem,
        ),
        total: resolveApiTrainingTotal(query.data),
    }
}

export function usePortalCompanyTraining(
    trainingId: string | null,
    fallback?: PortalTrainingRecord | null,
) {
    const query = useGetData<ApiTrainingDetailResponse>(
        trainingId ? `/trainings/company/${encodeURIComponent(trainingId)}` : null,
        {},
        {
            enabled: Boolean(trainingId),
            queryKey: ["portal-company-training", trainingId],
        },
    )

    const apiTraining = resolveApiTrainingDetail(query.data)

    return {
        ...query,
        training: apiTraining
            ? mapApiTrainingToPortalCompanyTrainingRecord(apiTraining, fallback)
            : fallback ?? null,
    }
}

export function usePortalTraining(
    trainingId: string | null,
    fallback?: PortalInternshipListingItem | PortalInternshipRecord | null,
) {
    const query = useGetData<ApiTrainingDetailResponse>(
        trainingId ? `/trainings/${encodeURIComponent(trainingId)}` : null,
        {},
        {
            enabled: Boolean(trainingId),
            queryKey: ["portal-training", trainingId],
        },
    )

    const apiTraining = resolveApiTrainingDetail(query.data)

    return {
        ...query,
        training: apiTraining
            ? mapApiTrainingToPortalInternshipRecord(apiTraining, fallback)
            : (isInternshipRecord(fallback) ? fallback : null),
    }
}

export function usePortalSimilarTrainings(
    trainingId: string | null,
    fallbackTrainings: Array<PortalInternshipListingItem | PortalInternshipRecord> = [],
) {
    const query = useGetData<ApiTrainingListResponse | ApiTraining[]>(
        trainingId ? `/trainings/${encodeURIComponent(trainingId)}/similar` : null,
        {},
        {
            enabled: Boolean(trainingId),
            queryKey: ["portal-similar-trainings", trainingId],
        },
    )

    const fallbackById = new Map(
        fallbackTrainings.map((training) => [training.id, training]),
    )

    return {
        ...query,
        trainings: resolveApiTrainingList(query.data).map((training) =>
            mapApiTrainingToPortalInternshipRecord(
                training,
                fallbackById.get(training._id) ?? null,
            ),
        ),
    }
}
