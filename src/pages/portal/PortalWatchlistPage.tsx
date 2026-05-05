import { useSearchParams } from "react-router-dom"

import PortalApplicationMonitorSection from "../../components/portal/PortalApplicationMonitorSection"
import PortalInternshipDetailsSection from "../../components/portal/PortalInternshipDetailsSection"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import { portalInternshipRecords } from "../../components/portal/portalInternshipsData"
import { portalJobRecords } from "../../components/portal/portalJobsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalWatchlistPageProps {
    page: PortalPageDefinition
}

export default function PortalWatchlistPage({
    page: _page,
}: PortalWatchlistPageProps) {
    const [searchParams] = useSearchParams()
    const selectedJobId = searchParams.get("job")
    const selectedTrainingId = searchParams.get("training")

    const selectedJob = selectedJobId
        ? portalJobRecords.find((job) => job.id === selectedJobId)
        : null
    const selectedInternship = selectedTrainingId
        ? portalInternshipRecords.find(
              (internship) => internship.id === selectedTrainingId,
          )
        : null

    if (selectedJob) {
        return <PortalJobDetailsSection job={selectedJob} showActions={false} />
    }

    if (selectedInternship) {
        const relatedInternships = selectedInternship.relatedInternshipIds
            .map((relatedInternshipId) =>
                portalInternshipRecords.find(
                    (internship) => internship.id === relatedInternshipId,
                ),
            )
            .filter(
                (
                    internship,
                ): internship is (typeof portalInternshipRecords)[number] =>
                    Boolean(internship),
            )

        return (
            <PortalInternshipDetailsSection
                internship={selectedInternship}
                relatedInternships={relatedInternships}
                showActions={false}
            />
        )
    }

    return <PortalApplicationMonitorSection />
}
