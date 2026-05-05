import PortalAllCompaniesSection from "../../components/portal/PortalAllCompaniesSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllCompaniesPageProps {
    page: PortalPageDefinition
}

export default function PortalAllCompaniesPage({
    page: _page,
}: PortalAllCompaniesPageProps) {
    return <PortalAllCompaniesSection />
}
