import type { PortalSavedOpportunityItem } from "../components/portal/PortalSavedJobsSection"
import { getPortalInternshipPath } from "../components/portal/portalInternshipsData"
import { getPortalJobPath } from "../components/portal/portalJobsData"
import { queryClient } from "./queryClient"
import { useDeleteData, useGetData, usePostData } from "./useQueries"

interface ApiSavedOpportunityCompany {
    _id?: string
    name?: string
    logoUrl?: string | null
}

interface ApiSavedJob {
    _id?: string
    title?: string
    company?: ApiSavedOpportunityCompany | null
}

interface ApiSavedTraining {
    _id?: string
    title?: string
    company?: ApiSavedOpportunityCompany | null
}

interface ApiSavedJobEntry {
    _id: string
    job?: ApiSavedJob | null
    notes?: string
}

interface ApiSavedTrainingEntry {
    _id: string
    training?: ApiSavedTraining | null
    notes?: string
}

interface ApiSavedJobsResponse {
    data?: ApiSavedJobEntry[]
    total?: number
}

interface ApiSavedTrainingsResponse {
    data?: ApiSavedTrainingEntry[]
    total?: number
}

interface SavePortalJobPayload {
    jobId: string
    notes?: string
}

interface SavePortalTrainingPayload {
    trainingId: string
    notes?: string
}

export interface PortalSavedJobItem extends PortalSavedOpportunityItem {
    savedId: string
    jobId: string
    notes?: string
}

export interface PortalSavedTrainingItem extends PortalSavedOpportunityItem {
    savedId: string
    trainingId: string
    notes?: string
}

const portalSavedJobsQueryKey = ["portal-saved-jobs"] as const
const portalSavedTrainingsQueryKey = ["portal-saved-trainings"] as const

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

function formatValue(value: unknown, fallback: string) {
    if (value === null || value === undefined) {
        return fallback
    }

    const text = String(value).trim()
    return text || fallback
}

function mapApiSavedJobToPortalSavedJobItem(
    savedJob: ApiSavedJobEntry,
): PortalSavedJobItem {
    const jobId = savedJob.job?._id ?? savedJob._id
    const companyName = formatValue(
        savedJob.job?.company?.name,
        "شركة غير محددة",
    )

    return {
        id: savedJob._id,
        savedId: savedJob._id,
        jobId,
        companyName,
        title: formatValue(savedJob.job?.title, "فرصة عمل"),
        logoSrc: getApiAssetUrl(savedJob.job?.company?.logoUrl),
        logoAlt: companyName,
        logoLabel: undefined,
        to: savedJob.job?._id ? getPortalJobPath(savedJob.job._id) : undefined,
        href: undefined,
        target: undefined,
        rel: undefined,
        notes: savedJob.notes,
    }
}

function mapApiSavedTrainingToPortalSavedTrainingItem(
    savedTraining: ApiSavedTrainingEntry,
): PortalSavedTrainingItem {
    const trainingId = savedTraining.training?._id ?? savedTraining._id
    const companyName = formatValue(
        savedTraining.training?.company?.name,
        "شركة غير محددة",
    )

    return {
        id: savedTraining._id,
        savedId: savedTraining._id,
        trainingId,
        companyName,
        title: formatValue(savedTraining.training?.title, "فرصة تدريب"),
        logoSrc: getApiAssetUrl(savedTraining.training?.company?.logoUrl),
        logoAlt: companyName,
        logoLabel: undefined,
        to: savedTraining.training?._id
            ? getPortalInternshipPath(savedTraining.training._id)
            : undefined,
        href: undefined,
        target: undefined,
        rel: undefined,
        notes: savedTraining.notes,
    }
}

function resolveSavedJobs(response: ApiSavedJobsResponse | undefined) {
    return response?.data ?? []
}

function resolveSavedTrainings(response: ApiSavedTrainingsResponse | undefined) {
    return response?.data ?? []
}

export function usePortalSavedJobsQuery() {
    const query = useGetData<ApiSavedJobsResponse>("/saved/jobs", {}, {
        queryKey: portalSavedJobsQueryKey,
    })

    return {
        ...query,
        savedJobs: resolveSavedJobs(query.data).map(
            mapApiSavedJobToPortalSavedJobItem,
        ),
    }
}

export function usePortalSavedTrainingsQuery() {
    const query = useGetData<ApiSavedTrainingsResponse>("/saved/trainings", {}, {
        queryKey: portalSavedTrainingsQueryKey,
    })

    return {
        ...query,
        savedTrainings: resolveSavedTrainings(query.data).map(
            mapApiSavedTrainingToPortalSavedTrainingItem,
        ),
    }
}

export function useSavePortalJob() {
    return usePostData<unknown, SavePortalJobPayload>("/saved/jobs", {}, {
        toastMessages: {
            loading: "جاري حفظ الوظيفة...",
            success: "تمت إضافة الوظيفة إلى المحفوظات",
            error: "فشل حفظ الوظيفة",
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: portalSavedJobsQueryKey,
            })
        },
    })
}

export function useRemovePortalSavedJob() {
    return useDeleteData({}, {
        toastMessages: {
            loading: "جاري إزالة الوظيفة...",
            success: "تمت إزالة الوظيفة من المحفوظات",
            error: "فشل إزالة الوظيفة",
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: portalSavedJobsQueryKey,
            })
        },
    })
}

export function useSavePortalTraining() {
    return usePostData<unknown, SavePortalTrainingPayload>(
        "/saved/trainings",
        {},
        {
            toastMessages: {
                loading: "جاري حفظ التدريب...",
                success: "تمت إضافة التدريب إلى المحفوظات",
                error: "فشل حفظ التدريب",
            },
            onSuccess: () => {
                void queryClient.invalidateQueries({
                    queryKey: portalSavedTrainingsQueryKey,
                })
            },
        },
    )
}

export function useRemovePortalSavedTraining() {
    return useDeleteData({}, {
        toastMessages: {
            loading: "جاري إزالة التدريب...",
            success: "تمت إزالة التدريب من المحفوظات",
            error: "فشل إزالة التدريب",
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: portalSavedTrainingsQueryKey,
            })
        },
    })
}
