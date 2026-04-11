import PortalAllJobCategoriesSection from "../../components/portal/PortalAllJobCategoriesSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllJobCategoriesPageProps {
    page: PortalPageDefinition
}

export default function PortalAllJobCategoriesPage({
    page,
}: PortalAllJobCategoriesPageProps) {
    return <PortalAllJobCategoriesSection title={page.title} />
}
