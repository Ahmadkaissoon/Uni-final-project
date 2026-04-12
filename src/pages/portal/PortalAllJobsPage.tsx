import PortalAllJobsSection from "../../components/portal/PortalAllJobsSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllJobsPageProps {
    page: PortalPageDefinition
}

export default function PortalAllJobsPage({ page }: PortalAllJobsPageProps) {
    return <PortalAllJobsSection title={page.title} />
}
