import { portalInternshipRecords } from "../../components/portal/portalInternshipsData"
import { portalJobRecords } from "../../components/portal/portalJobsData"
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

    const savedJobs = savedJobIds
        .map((savedJobId) =>
            portalJobRecords.find((job) => job.id === savedJobId),
        )
        .filter((job): job is (typeof portalJobRecords)[number] => Boolean(job))

    const savedTrainings = savedTrainingIds
        .map((savedTrainingId) =>
            portalInternshipRecords.find(
                (training) => training.id === savedTrainingId,
            ),
        )
        .filter(
            (
                training,
            ): training is (typeof portalInternshipRecords)[number] =>
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
