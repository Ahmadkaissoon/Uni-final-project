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
            description={
                page.role === "company"
                    ? "استخدم الإرشاد الوظيفي لتحسين إعلاناتك، فرز المتقدمين، وتجربة المرشحين داخل شركتك."
                    : "استخدم الإرشاد الوظيفي لتحسين سيرتك الذاتية، التحضير للمقابلات، واختيار الفرص الأنسب لك."
            }
        />
    )
}
