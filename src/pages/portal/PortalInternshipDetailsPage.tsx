import { Navigate, useSearchParams } from "react-router-dom"

import PortalInternshipDetailsSection from "../../components/portal/PortalInternshipDetailsSection"
import { portalInternshipRecords } from "../../components/portal/portalInternshipsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalInternshipDetailsPageProps {
    page: PortalPageDefinition
}

export default function PortalInternshipDetailsPage({
    page,
}: PortalInternshipDetailsPageProps) {
    const [searchParams] = useSearchParams()
    const selectedTrainingId = searchParams.get("training")
    const selectedInternship = selectedTrainingId
        ? portalInternshipRecords.find(
              (internship) => internship.id === selectedTrainingId,
          )
        : null

    if (!selectedInternship) {
        return <Navigate to="/jobs/internships" replace />
    }

    const relatedInternships = selectedInternship.relatedInternshipIds
        .map((relatedInternshipId) =>
            portalInternshipRecords.find(
                (internship) => internship.id === relatedInternshipId,
            ),
        )
        .filter(
            (internship): internship is (typeof portalInternshipRecords)[number] =>
                Boolean(internship),
        )

    return (
        <PortalInternshipDetailsSection
            title={page.title}
            description={page.description}
            internship={selectedInternship}
            relatedInternships={relatedInternships}
        />
    )
}
