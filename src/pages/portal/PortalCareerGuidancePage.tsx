import PortalCareerGuidanceSection from "../../components/portal/PortalCareerGuidanceSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCareerGuidancePageProps {
    page: PortalPageDefinition
}

export default function PortalCareerGuidancePage({
    page,
}: PortalCareerGuidancePageProps) {
    return (
        <PortalCareerGuidanceSection
            key={page.id}
            role={page.role}
            title={page.title}
            description="يمكنك التحدث وسؤال الذكاء الصناعي لمساعدتك خلال هذه الواجهة"
        />
    )
}
