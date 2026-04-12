import { useSearchParams } from "react-router-dom"

import PortalStudyDetailsSection from "../../components/portal/PortalStudyDetailsSection"
import PortalStudiesSection from "../../components/portal/PortalStudiesSection"
import { companyStudyRecords } from "../../components/portal/portalStudiesData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyStudiesPageProps {
    page: PortalPageDefinition
}

export default function PortalCompanyStudiesPage({
    page,
}: PortalCompanyStudiesPageProps) {
    const [searchParams] = useSearchParams()
    const selectedArticleId = searchParams.get("article")
    const selectedStudy = selectedArticleId
        ? companyStudyRecords.find((study) => study.id === selectedArticleId)
        : null

    if (selectedStudy) {
        return (
            <PortalStudyDetailsSection
                title={page.title}
                description="يمكنك الاطلاع على المقال الكامل ومراجعة كامل المحاور التي نشرتها الشركة ضمن منصة وظيفتي."
                study={selectedStudy}
                relatedStudies={companyStudyRecords
                    .filter((study) => study.id !== selectedStudy.id)
                    .slice(0, 2)}
            />
        )
    }

    return (
        <PortalStudiesSection
            title={page.title}
            description="يمكنك مشاهدة جميع الدراسات والمقالات التي تنشرها كبرى الشركات الدولية والإقليمية"
            studies={companyStudyRecords.map((study) => ({
                id: study.id,
                companyName: study.companyName,
                studyTitle: study.studyTitle,
                excerpt: study.excerpt,
                to: `/company/studies?article=${study.id}`,
            }))}
        />
    )
}
