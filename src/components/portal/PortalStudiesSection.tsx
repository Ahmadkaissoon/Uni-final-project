import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "../global/ui/button"
import PortalStudyCard from "./PortalStudyCard"

export interface PortalStudyItem {
    id: string
    companyName: string
    studyTitle: string
    excerpt: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

interface PortalStudiesSectionProps {
    title: string
    description: string
    studies: PortalStudyItem[]
    initialVisibleCount?: number
    showMoreLabel?: string
}

export default function PortalStudiesSection({
    title,
    description,
    studies,
    initialVisibleCount = 2,
    showMoreLabel = "عرض المزيد",
}: PortalStudiesSectionProps) {
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount)

    const visibleStudies = useMemo(
        () => studies.slice(0, visibleCount),
        [studies, visibleCount],
    )

    const canShowMore = visibleCount < studies.length

    return (
        <section className="py-12 sm:py-16 lg:py-20" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-6 text-right">
                            <h1 className="m-0 py-1 text-[32px] font-bold leading-[1.3] text-black sm:text-[42px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-[48rem] text-size18 font-medium leading-[1.95] text-black sm:text-size22">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                        {visibleStudies.map((study) => (
                            <PortalStudyCard
                                key={study.id}
                                companyName={study.companyName}
                                studyTitle={study.studyTitle}
                                excerpt={study.excerpt}
                                to={study.to}
                                href={study.href}
                                target={study.target}
                                rel={study.rel}
                            />
                        ))}
                    </div>

                    {canShowMore ? (
                        <div className="mt-10 flex justify-center sm:mt-12">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setVisibleCount((currentCount) =>
                                        Math.min(
                                            currentCount + 2,
                                            studies.length,
                                        ),
                                    )
                                }
                                className="inline-flex min-h-[46px] cursor-pointer items-center rounded-[8px] border border-warning-color bg-warning-color !px-5 !py-3 !text-size18 !font-bold !text-white hover:!brightness-105"
                                dir="rtl"
                            >
                                <Plus className="ml-3 size-5" />
                                {showMoreLabel}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
