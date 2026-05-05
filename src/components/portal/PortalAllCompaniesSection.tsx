import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "../global/ui/button"
import PortalCompanyLogoSlide from "./PortalCompanyLogoSlide"
import {
    portalCompanyDirectoryItems,
    type PortalCompanyDirectoryItem,
} from "./portalCompaniesData"

interface PortalAllCompaniesSectionProps {
    title?: string
    description?: string
    companies?: PortalCompanyDirectoryItem[]
    itemsPerPage?: number
}

export default function PortalAllCompaniesSection({
    title = "كافة الشركات",
    description = "يمكنك هنا إيجاد جميع الشركات المسجلة في منصتنا.",
    companies = portalCompanyDirectoryItems,
    itemsPerPage = 6,
}: PortalAllCompaniesSectionProps) {
    const [visiblePages, setVisiblePages] = useState(1)

    const visibleCount = Math.min(companies.length, visiblePages * itemsPerPage)
    const visibleCompanies = companies.slice(0, visibleCount)
    const canShowMore = visibleCount < companies.length

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-12 flex justify-start">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 text-lg font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:px-[89px]">
                        {visibleCompanies.map((company) => (
                            <PortalCompanyLogoSlide
                                key={company.id}
                                companyName={company.companyName}
                                logoSrc={company.logoSrc}
                                logoAlt={company.logoAlt}
                                logoLabel={company.logoLabel}
                                to={company.to}
                                showCompanyName
                                className="portal-category-card-shadow min-h-[214px] !rounded-[20px] !border-black/0 !bg-white !px-6 !py-10"
                            />
                        ))}
                    </div>

                    {canShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setVisiblePages(
                                        (currentPage) => currentPage + 1,
                                    )
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
