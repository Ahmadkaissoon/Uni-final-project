import { BriefcaseBusiness } from "lucide-react"
import { Navigate, useSearchParams } from "react-router-dom"
import { useMemo, type ReactNode } from "react"

import { usePortalSimilarTrainings, usePortalTraining, usePortalTrainings } from "../../api/portalTrainings"
import Loader from "../../components/global/loader/Loader"
import PortalInternshipDetailsSection from "../../components/portal/PortalInternshipDetailsSection"
import {
    portalInternshipRecords,
    type PortalInternshipListingItem,
    type PortalInternshipRecord,
} from "../../components/portal/portalInternshipsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalInternshipDetailsPageProps {
    page: PortalPageDefinition
}

function PortalTrainingPageState({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <section className="pb-12 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-all-jobs-content px-22">
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

function PortalTrainingLoadingState() {
    return (
        <PortalTrainingPageState
            title="تفاصيل التدريب"
            description="جارٍ تحميل تفاصيل فرصة التدريب المختارة..."
        >
            <div className="flex min-h-[260px] items-center justify-center rounded-[16px] bg-white/80">
                <Loader size={8} />
            </div>
        </PortalTrainingPageState>
    )
}

function PortalTrainingEmptyState() {
    return (
        <PortalTrainingPageState
            title="تعذر تحميل تفاصيل التدريب"
            description="لم نتمكن من جلب بيانات هذه الفرصة حالياً، يرجى المحاولة لاحقاً."
        >
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-warning-color/45 bg-white px-5 py-10 text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-warning-color/10 text-warning-color">
                    <BriefcaseBusiness className="size-8" />
                </span>
                <p className="m-0 text-size20 font-bold text-black">
                    لا توجد بيانات متاحة لهذه الفرصة.
                </p>
            </div>
        </PortalTrainingPageState>
    )
}

function isPortalInternshipRecord(
    value?: PortalInternshipListingItem | PortalInternshipRecord | null,
): value is PortalInternshipRecord {
    return Boolean(value && "relatedInternshipIds" in value && "overview" in value)
}

export default function PortalInternshipDetailsPage({
    page,
}: PortalInternshipDetailsPageProps) {
    const [searchParams] = useSearchParams()
    const selectedTrainingId = searchParams.get("training")
    const trainingsQuery = usePortalTrainings()
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
    const similarTrainingsQuery = usePortalSimilarTrainings(
        selectedTrainingId,
        trainingFallbacks,
    )

    if (!selectedTrainingId) {
        return <Navigate to="/jobs/internships" replace />
    }

    if (trainingQuery.isLoading && !trainingQuery.training) {
        return <PortalTrainingLoadingState />
    }

    if (!trainingQuery.training) {
        return <PortalTrainingEmptyState />
    }

    const selectedTraining = trainingQuery.training
    const fallbackRelatedInternships = isPortalInternshipRecord(
        selectedTrainingFallback,
    )
        ? selectedTrainingFallback.relatedInternshipIds
              .map((relatedTrainingId) =>
                  portalInternshipRecords.find(
                      (training) => training.id === relatedTrainingId,
                  ),
              )
              .filter(
                  (
                      training,
                  ): training is PortalInternshipRecord => Boolean(training),
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
            title={page.title}
            description={page.description}
            internship={selectedTraining}
            relatedInternships={relatedInternships}
        />
    )
}
