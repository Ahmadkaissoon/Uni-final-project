import { BriefcaseBusiness, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import type { PortalPageDefinition } from "../../router/portalPages"
import PortalCompaniesCarouselSection from "../../components/portal/PortalCompaniesCarouselSection"
import PortalHero from "../../components/portal/PortalHero"
import PortalJobCategoriesSection from "../../components/portal/PortalJobCategoriesSection"
import PortalNearbyJobsSection from "../../components/portal/PortalNearbyJobsSection"
import heroImage from "../../assets/hero.jpg"

interface PortalHomePageProps {
    page: PortalPageDefinition
}

const homeHeroContent = {
    user: {
        title: "أهلاً بك في وظيفتي",
        description: "اكتشف أفضل الفرص المناسبة لك، وابدأ رحلة البحث معنا",
        actionLabel: "البحث عن وظيفة",
        eyebrow: undefined,
        nextPath: "/jobs/all",
        actionIcon: <Search />,
    },
    company: {
        title: "أهلاً بك في بوابة الشركات",
        description:
            "أنشئ فرصًا جديدة وتابع الطلبات، ووصل إلى المرشحين المناسبين بسرعة",
        actionLabel: "إنشاء وظيفة",
        eyebrow: undefined,
        nextPath: "/company/jobs/create",
        actionIcon: <BriefcaseBusiness />,
    },
} as const

export default function PortalHomePage({ page }: PortalHomePageProps) {
    const navigate = useNavigate()
    const heroContent = homeHeroContent[page.role]

    return (
        <section>
            <PortalHero
                title={heroContent.title}
                description={heroContent.description}
                actionLabel={heroContent.actionLabel}
                actionIcon={heroContent.actionIcon}
                eyebrow={heroContent.eyebrow}
                onAction={() => navigate(heroContent.nextPath)}
                backgroundImageSrc={heroImage}
            />

            <PortalJobCategoriesSection
                onShowMore={
                    page.role === "user"
                        ? () => navigate("/jobs/categories")
                        : undefined
                }
            />

            {page.role === "user" ? <PortalCompaniesCarouselSection /> : null}

            {page.role === "user" ? <PortalNearbyJobsSection /> : null}
        </section>
    )
}
