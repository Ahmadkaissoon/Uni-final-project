import { BriefcaseBusiness } from "lucide-react"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import {
    usePortalSeekerJobApplications,
    usePortalSeekerTrainingApplications,
} from "../../api/portalApplications"
import { usePortalJob } from "../../api/portalJobs"
import {
    usePortalSimilarTrainings,
    usePortalTraining,
    usePortalTrainings,
} from "../../api/portalTrainings"
import Loader from "../../components/global/loader/Loader"
import PortalApplicationMonitorSection from "../../components/portal/PortalApplicationMonitorSection"
import PortalInternshipDetailsSection from "../../components/portal/PortalInternshipDetailsSection"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import {
    portalInternshipRecords,
    type PortalInternshipListingItem,
    type PortalInternshipRecord,
} from "../../components/portal/portalInternshipsData"
import { portalJobRecords } from "../../components/portal/portalJobsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalWatchlistPageProps {
    page: PortalPageDefinition
}

function PortalWatchlistState({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <section className="pb-12 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-12 flex justify-start">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 text-lg font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </section>
    )
}

function PortalWatchlistLoadingState({
    title = "تفاصيل الوظيفة",
    description = "جارٍ تحميل تفاصيل الوظيفة المختارة...",
}: {
    title?: string
    description?: string
}) {
    return (
        <PortalWatchlistState title={title} description={description}>
            <div className="flex min-h-[260px] items-center justify-center rounded-[16px] bg-white/80">
                <Loader size={8} />
            </div>
        </PortalWatchlistState>
    )
}

function PortalWatchlistEmptyState({
    title = "تعذر تحميل تفاصيل الوظيفة",
    description = "لم نتمكن من جلب تفاصيل هذه الوظيفة حالياً، يرجى المحاولة لاحقاً.",
    message = "لا توجد بيانات لهذه الوظيفة.",
}: {
    title?: string
    description?: string
    message?: string
}) {
    return (
        <PortalWatchlistState title={title} description={description}>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-warning-color/45 bg-white px-5 py-10 text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-warning-color/10 text-warning-color">
                    <BriefcaseBusiness className="size-8" />
                </span>
                <p className="m-0 text-size20 font-bold text-black">{message}</p>
            </div>
        </PortalWatchlistState>
    )
}

function isPortalInternshipRecord(
    value?: PortalInternshipListingItem | PortalInternshipRecord | null,
): value is PortalInternshipRecord {
    return Boolean(value && "relatedInternshipIds" in value && "overview" in value)
}

export default function PortalWatchlistPage({
    page: _page,
}: PortalWatchlistPageProps) {
    const [searchParams] = useSearchParams()
    const selectedJobId = searchParams.get("job")
    const selectedTrainingId = searchParams.get("training")
    const jobApplicationsQuery = usePortalSeekerJobApplications(!selectedTrainingId)
    const trainingApplicationsQuery = usePortalSeekerTrainingApplications(
        !selectedJobId,
    )

    const trainingsQuery = usePortalTrainings()
    const selectedJobFallback = useMemo(
        () =>
            selectedJobId
                ? portalJobRecords.find((job) => job.id === selectedJobId) ?? null
                : null,
        [selectedJobId],
    )
    const jobQuery = usePortalJob(selectedJobId, selectedJobFallback)
    const selectedJob = jobQuery.job
    const trainingFallbacks = useMemo(
        () => [...trainingsQuery.trainings, ...portalInternshipRecords],
        [trainingsQuery.trainings],
    )
    const selectedTrainingFallback = useMemo(
        () =>
            selectedTrainingId
                ? trainingsQuery.trainings.find(
                      (training) => training.id === selectedTrainingId,
                  ) ??
                  portalInternshipRecords.find(
                      (training) => training.id === selectedTrainingId,
                  ) ??
                  null
                : null,
        [selectedTrainingId, trainingsQuery.trainings],
    )
    const trainingQuery = usePortalTraining(
        selectedTrainingId,
        selectedTrainingFallback,
    )
    const selectedTraining = trainingQuery.training
    const similarTrainingsQuery = usePortalSimilarTrainings(
        selectedTrainingId,
        trainingFallbacks,
    )

    if (selectedJobId) {
        if (jobQuery.isLoading && !selectedJob) {
            return <PortalWatchlistLoadingState />
        }

        if (!selectedJob) {
            return <PortalWatchlistEmptyState />
        }

        return <PortalJobDetailsSection job={selectedJob} showActions={false} />
    }

    if (selectedTrainingId) {
        if (trainingQuery.isLoading && !selectedTraining) {
            return (
                <PortalWatchlistLoadingState
                    title="تفاصيل التدريب"
                    description="جارٍ تحميل تفاصيل فرصة التدريب المختارة..."
                />
            )
        }

        if (!selectedTraining) {
            return (
                <PortalWatchlistEmptyState
                    title="تعذر تحميل تفاصيل التدريب"
                    description="لم نتمكن من جلب تفاصيل هذه الفرصة حالياً، يرجى المحاولة لاحقاً."
                    message="لا توجد بيانات متاحة لهذه الفرصة."
                />
            )
        }

        const fallbackRelatedInternships = isPortalInternshipRecord(
            selectedTrainingFallback,
        )
            ? selectedTrainingFallback.relatedInternshipIds
                  .map((relatedInternshipId) =>
                      portalInternshipRecords.find(
                          (internship) => internship.id === relatedInternshipId,
                      ),
                  )
                  .filter(
                      (
                          internship,
                      ): internship is PortalInternshipRecord =>
                          Boolean(internship),
                  )
            : []
        const relatedInternships =
            similarTrainingsQuery.trainings.length > 0
                ? similarTrainingsQuery.trainings.filter(
                      (training) => training.id !== selectedTraining.id,
                  )
                : fallbackRelatedInternships.filter(
                      (training) => training.id !== selectedTraining.id,
                  )

        return (
            <PortalInternshipDetailsSection
                internship={selectedTraining}
                relatedInternships={relatedInternships}
                showActions={false}
            />
        )
    }

    return (
        <PortalApplicationMonitorSection
            jobApplications={jobApplicationsQuery.applications}
            trainingApplications={trainingApplicationsQuery.applications}
            isLoadingJobs={jobApplicationsQuery.isLoading}
            isLoadingTrainings={trainingApplicationsQuery.isLoading}
            isErrorJobs={jobApplicationsQuery.isError}
            isErrorTrainings={trainingApplicationsQuery.isError}
        />
    )
}
