import PortalAllInternshipsSection from "../../components/portal/PortalAllInternshipsSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalInternshipsPageProps {
    page: PortalPageDefinition
}

export default function PortalInternshipsPage({
    page: _page,
}: PortalInternshipsPageProps) {
    return <PortalAllInternshipsSection />
}
