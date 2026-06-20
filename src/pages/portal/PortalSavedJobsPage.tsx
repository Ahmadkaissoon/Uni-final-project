import { useMemo } from "react"

import { usePortalJobs } from "../../api/portalJobs"
import { usePortalTrainings } from "../../api/portalTrainings"
import {
    portalInternshipRecords,
    type PortalInternshipListingItem,
} from "../../components/portal/portalInternshipsData"
import {
    portalJobRecords,
    type PortalJobRecord,
} from "../../components/portal/portalJobsData"
import PortalSavedJobsSection from "../../components/portal/PortalSavedJobsSection"
import { usePortalSavedJobs } from "../../components/portal/usePortalSavedJobs"
import { usePortalSavedTrainings } from "../../components/portal/usePortalSavedTrainings"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalSavedJobsPageProps {
    page: PortalPageDefinition
}

export default function PortalSavedJobsPage({
    page,
}: PortalSavedJobsPageProps) {
    const { savedJobIds } = usePortalSavedJobs()
    const { savedTrainingIds } = usePortalSavedTrainings()
    const jobsQuery = usePortalJobs()
    const trainingsQuery = usePortalTrainings()

    const availableJobs = useMemo(() => {
        const jobsMap = new Map<string, PortalJobRecord>(
            portalJobRecords.map((job) => [job.id, job]),
        )

        jobsQuery.jobs.forEach((job) => {
            jobsMap.set(job.id, job)
        })

        return jobsMap
    }, [jobsQuery.jobs])

    const savedJobs = savedJobIds
        .map((savedJobId) => availableJobs.get(savedJobId))
        .filter((job): job is PortalJobRecord => Boolean(job))

    const availableTrainings = useMemo(() => {
        const trainingsMap = new Map<string, PortalInternshipListingItem>(
            portalInternshipRecords.map((training) => [training.id, training]),
        )

        trainingsQuery.trainings.forEach((training) => {
            trainingsMap.set(training.id, training)
        })

        return trainingsMap
    }, [trainingsQuery.trainings])

    const savedTrainings = savedTrainingIds
        .map((savedTrainingId) => availableTrainings.get(savedTrainingId))
        .filter(
            (training): training is NonNullable<typeof training> =>
                Boolean(training),
        )

    return (
        <PortalSavedJobsSection
            title={page.title}
            description="هنا ستجد جميع الوظائف، وفرص التدريب التي قمت بالإعجاب بها لتقدم عليها."
            savedJobs={savedJobs.map((job) => ({
                id: job.id,
                companyName: job.companyName,
                title: job.jobTitle,
                logoSrc: job.logoSrc,
                logoAlt: job.logoAlt,
                logoLabel: job.logoLabel,
                to: job.to,
                href: job.href,
                target: job.target,
                rel: job.rel,
            }))}
            savedTrainings={savedTrainings.map((training) => ({
                id: training.id,
                companyName: training.companyName,
                title: training.trainingType,
                logoSrc: training.logoSrc,
                logoAlt: training.logoAlt,
                logoLabel: training.logoLabel,
                to: training.to,
                href: training.href,
                target: training.target,
                rel: training.rel,
            }))}
        />
    )
}
