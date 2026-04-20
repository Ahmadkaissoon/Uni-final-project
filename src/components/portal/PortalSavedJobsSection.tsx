import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "../global/ui/button"
import PortalOpportunityTabs, {
    type PortalOpportunityTab,
} from "./PortalOpportunityTabs"
import PortalSavedOpportunityCard from "./PortalSavedOpportunityCard"

export interface PortalSavedOpportunityItem {
    id: string
    companyName: string
    title: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

interface PortalSavedJobsSectionProps {
    title?: string
    description?: string
    savedJobs?: PortalSavedOpportunityItem[]
    savedTrainings?: PortalSavedOpportunityItem[]
    itemsPerPage?: number
}

export default function PortalSavedJobsSection({
    title = "كافة الوظائف المحفوظة",
    description = "هنا ستجد جميع الوظائف، وفرص التدريب التي قمت بالإعجاب بها لتقدم عليها.",
    savedJobs = [],
    savedTrainings = [],
    itemsPerPage = 4,
}: PortalSavedJobsSectionProps) {
    const [activeTab, setActiveTab] = useState<PortalOpportunityTab>("jobs")
    const [visiblePages, setVisiblePages] = useState(1)

    const activeItems = useMemo(
        () => (activeTab === "jobs" ? savedJobs : savedTrainings),
        [activeTab, savedJobs, savedTrainings],
    )

    const visibleCount = Math.min(activeItems.length, visiblePages * itemsPerPage)
    const visibleItems = activeItems.slice(0, visibleCount)
    const canShowMore = visibleCount < activeItems.length

    function handleTabChange(nextTab: PortalOpportunityTab) {
        setActiveTab(nextTab)
        setVisiblePages(1)
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-[36rem] text-size16 font-medium leading-[1.9] text-black sm:text-size20">
                                {description}
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab={activeTab}
                            onChange={handleTabChange}
                            className="lg:pt-10"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {visibleItems.length > 0 ? (
                            visibleItems.map((item) => (
                                <PortalSavedOpportunityCard
                                    key={item.id}
                                    companyName={item.companyName}
                                    title={item.title}
                                    logoSrc={item.logoSrc}
                                    logoAlt={item.logoAlt}
                                    logoLabel={item.logoLabel}
                                    to={item.to}
                                    href={item.href}
                                    target={item.target}
                                    rel={item.rel}
                                />
                            ))
                        ) : (
                            <div className="portal-category-card-shadow rounded-[16px] bg-white px-6 py-10 text-center sm:px-10 sm:py-12">
                                <h2 className="m-0 text-size22 font-bold text-header-fg sm:text-size28">
                                    {activeTab === "jobs"
                                        ? "لا توجد وظائف محفوظة بعد"
                                        : "لا توجد تدريبات محفوظة بعد"}
                                </h2>
                                <p className="mx-auto mt-3 mb-0 max-w-[34rem] text-size16 leading-8 text-foreground-secondary">
                                    {activeTab === "jobs"
                                        ? "عند حفظ أي وظيفة من صفحة التفاصيل ستظهر هنا بنفس التنسيق الجديد."
                                        : "عند حفظ أي تدريب من صفحة التفاصيل سيظهر هنا مباشرة ضمن تبويب التدريبات."}
                                </p>
                            </div>
                        )}
                    </div>

                    {canShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setVisiblePages((currentPage) => currentPage + 1)
                                }
                                className="inline-flex items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size18 !font-bold !text-white hover:!brightness-105"
                                dir="rtl"
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                    <Plus className="size-5" />
                                </span>
                                <span className="inline-flex items-center">
                                    عرض المزيد
                                </span>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

