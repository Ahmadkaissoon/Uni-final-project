import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../global/ui/button"
import PortalNearbyJobCard from "./PortalNearbyJobCard"

export interface PortalNearbyJobItem {
    id: string
    companyName: string
    jobTitle: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

const defaultNearbyJobs: PortalNearbyJobItem[] = [
    {
        id: "al-mateen-graphic-designer",
        companyName: "شركة المتين",
        jobTitle: "مصمم غرافيك",
        to: "/jobs/all",
    },
    {
        id: "al-mateen-ui-designer",
        companyName: "شركة المتين",
        jobTitle: "مصمم واجهات",
        to: "/jobs/all",
    },
]

interface PortalNearbyJobsSectionProps {
    title?: string
    jobs?: PortalNearbyJobItem[]
    showMoreLabel?: string
    showMoreTo?: string
    onShowMore?: () => void
}

export default function PortalNearbyJobsSection({
    title = "وظائف قريبة منك",
    jobs = defaultNearbyJobs,
    showMoreLabel = "عرض المزيد",
    showMoreTo = "/jobs/all",
    onShowMore,
}: PortalNearbyJobsSectionProps) {
    const showMoreButtonClassName =
        "inline-flex items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size18 !font-bold !text-white hover:brightness-105"

    return (
        <section className="my-12 sm:my-16" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="inline-flex flex-col items-start">
                            <h2 className="m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[36px]">
                                {title}
                            </h2>
                            <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
                        </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-6">
                        {jobs.map((job) => (
                            <PortalNearbyJobCard
                                key={job.id}
                                companyName={job.companyName}
                                jobTitle={job.jobTitle}
                                logoSrc={job.logoSrc}
                                logoAlt={job.logoAlt}
                                logoLabel={job.logoLabel}
                                to={job.to}
                                href={job.href}
                                target={job.target}
                                rel={job.rel}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center sm:mt-10">
                        {onShowMore ? (
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={onShowMore}
                                className={showMoreButtonClassName}
                                dir="rtl"
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                    <Plus className="size-5" />
                                </span>
                                <span className="inline-flex items-center">
                                    {showMoreLabel}
                                </span>
                            </Button>
                        ) : (
                            <Link
                                to={showMoreTo}
                                className={showMoreButtonClassName}
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                    <Plus className="size-5" />
                                </span>
                                <span className="inline-flex items-center">
                                    {showMoreLabel}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
