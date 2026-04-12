import { useSearchParams } from "react-router-dom"

import PortalAllJobsSection from "../../components/portal/PortalAllJobsSection"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import { portalJobRecords } from "../../components/portal/portalJobsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllJobsPageProps {
    page: PortalPageDefinition
}

export default function PortalAllJobsPage({ page }: PortalAllJobsPageProps) {
    const [searchParams] = useSearchParams()
    const selectedJobId = searchParams.get("job")
    const selectedJob = selectedJobId
        ? portalJobRecords.find((job) => job.id === selectedJobId)
        : null

    if (selectedJob) {
        return (
            <PortalJobDetailsSection
                title={page.title}
                // description={page.description}
                job={selectedJob}
            />
        )
    }

    return (
        <PortalAllJobsSection
            title={page.title}
            description={page.description}
        />
    )
}
