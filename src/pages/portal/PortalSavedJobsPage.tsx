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
    const { savedJobs, isLoadingSavedJobs } = usePortalSavedJobs()
    const { savedTrainings, isLoadingSavedTrainings } =
        usePortalSavedTrainings()

    return (
        <PortalSavedJobsSection
            title={page.title}
            description="هنا ستجد جميع الوظائف، وفرص التدريب التي قمت بالإعجاب بها لتقدم عليها."
            savedJobs={savedJobs.map(({ savedId, jobId, notes, ...savedJob }) => ({
                ...savedJob,
            }))}
            savedTrainings={savedTrainings.map(
                ({ savedId, trainingId, notes, ...savedTraining }) => ({
                    ...savedTraining,
                }),
            )}
            isLoadingJobs={isLoadingSavedJobs}
            isLoadingTrainings={isLoadingSavedTrainings}
        />
    )
}
