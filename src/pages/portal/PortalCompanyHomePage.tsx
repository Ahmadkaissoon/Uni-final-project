import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import PortalCompanyChartsSection from "../../components/portal/PortalCompanyChartsSection"
import PortalHero from "../../components/portal/PortalHero"
import PortalNearbyJobsSection, {
    type PortalNearbyJobItem,
} from "../../components/portal/PortalNearbyJobsSection"
import heroImage from "../../assets/hero.jpg"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyHomePageProps {
    page: PortalPageDefinition
}

const companyHomeJobs: PortalNearbyJobItem[] = [
    {
        id: "company-home-senior-frontend",
        companyName: "شركة المتين",
        jobTitle: "مطور واجهات أمامية",
        to: "/company/jobs/all",
    },
    {
        id: "company-home-ui-designer",
        companyName: "شركة المتين",
        jobTitle: "مصمم واجهات رقمية",
        to: "/company/jobs/all",
    },
]

export default function PortalCompanyHomePage({
    page: _page,
}: PortalCompanyHomePageProps) {
    const navigate = useNavigate()

    return (
        <section className="bg-white">
            <PortalHero
                title="أهلاً بك في وظيفتي"
                description="اكتشف أشخاصًا متخصصين مناسبين لشركتك، وابدأ رحلة البحث معنا"
                actionLabel="البحث عن موظف"
                actionIcon={<Search />}
                onAction={() => navigate("/company/applications")}
                backgroundImageSrc={heroImage}
            />

            <PortalCompanyChartsSection />

            <PortalNearbyJobsSection
                title="وظائفي"
                jobs={companyHomeJobs}
                showMoreTo="/company/jobs/all"
                onShowMore={() => navigate("/company/jobs/all")}
            />
        </section>
    )
}
