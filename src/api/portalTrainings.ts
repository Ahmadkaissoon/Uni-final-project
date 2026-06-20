import companyImage from "../assets/common/company_img.png"
import type {
    PortalInternshipListingItem,
    PortalInternshipQuickFact,
    PortalInternshipRecord,
} from "../components/portal/portalInternshipsData"
import { getPortalInternshipPath } from "../components/portal/portalInternshipsData"
import { useGetData } from "./useQueries"

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

function resolveApiTrainingList(
    response: ApiTrainingListResponse | ApiTraining[] | undefined,
) {
    if (Array.isArray(response)) {
        return response
    }

    return response?.data ?? []
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
