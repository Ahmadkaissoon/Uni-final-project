import { Search } from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { usePortalAuthProfile } from "../../api/portalAuthProfile"
import { usePortalCompanyJobs } from "../../api/portalJobs"
import heroImage from "../../assets/hero.jpg"
import PortalCompanyChartsSection from "../../components/portal/PortalCompanyChartsSection"
import PortalHero from "../../components/portal/PortalHero"
import PortalNearbyJobsSection, {
    type PortalNearbyJobItem,
} from "../../components/portal/PortalNearbyJobsSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyHomePageProps {
    page: PortalPageDefinition
}

export default function PortalCompanyHomePage({
    page: _page,
}: PortalCompanyHomePageProps) {
    const navigate = useNavigate()
    const companyJobsQuery = usePortalCompanyJobs()
    const companyProfileQuery = usePortalAuthProfile("company")

    const companyHomeJobs = useMemo<PortalNearbyJobItem[]>(() => {
        const companyName = companyProfileQuery.profile?.name?.trim() || "شركتك"
        const companyLogoSrc = companyProfileQuery.profile?.avatarSrc

        return companyJobsQuery.jobs.slice(0, 2).map((job) => ({
            id: job.id,
            companyName,
            jobTitle: job.jobName,
            logoSrc: companyLogoSrc,
            logoAlt: companyName,
            to: "/company/jobs/all",
        }))
    }, [companyJobsQuery.jobs, companyProfileQuery.profile])

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
                isLoading={companyJobsQuery.isLoading}
                isError={companyJobsQuery.isError}
                hideWhenEmpty={false}
                emptyText="لا توجد وظائف منشورة لشركتك حالياً."
                showMoreTo="/company/jobs/all"
                onShowMore={() => navigate("/company/jobs/all")}
            />
        </section>
    )
}
