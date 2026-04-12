import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "../global/ui/button"
import PortalJobListingCard from "./PortalJobListingCard"

export interface PortalJobListingItem {
    id: string
    companyName: string
    jobTitle: string
    location: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

const defaultJobs: PortalJobListingItem[] = [
    {
        id: "al-mateen-graphic-designer",
        companyName: "شركة المتين",
        jobTitle: "مصمم غرافيك",
        location: "دمشق",
        to: "/jobs/all?job=al-mateen-graphic-designer",
    },
    {
        id: "al-najah-ui-designer",
        companyName: "شركة النجاح",
        jobTitle: "مصمم واجهات",
        location: "حلب",
        to: "/jobs/all?job=al-najah-ui-designer",
    },
    {
        id: "al-bayan-frontend",
        companyName: "شركة البيان",
        jobTitle: "مطور واجهات",
        location: "حمص",
        to: "/jobs/all?job=al-bayan-frontend",
    },
    {
        id: "al-riyada-marketing",
        companyName: "شركة الريادة",
        jobTitle: "تسويق رقمي",
        location: "اللاذقية",
        to: "/jobs/all?job=al-riyada-marketing",
    },
    {
        id: "al-afaq-content",
        companyName: "شركة الآفاق",
        jobTitle: "كاتب محتوى",
        location: "دمشق",
        to: "/jobs/all?job=al-afaq-content",
    },
    {
        id: "al-qimma-support",
        companyName: "شركة القمة",
        jobTitle: "خدمة عملاء",
        location: "طرطوس",
        to: "/jobs/all?job=al-qimma-support",
    },
    {
        id: "al-noor-accountant",
        companyName: "شركة النور",
        jobTitle: "محاسب",
        location: "حماة",
        to: "/jobs/all?job=al-noor-accountant",
    },
    {
        id: "al-ibdaa-photographer",
        companyName: "شركة الإبداع",
        jobTitle: "مصور",
        location: "دمشق",
        to: "/jobs/all?job=al-ibdaa-photographer",
    },
    {
        id: "al-bunyan-analyst",
        companyName: "شركة البنيان",
        jobTitle: "محلل بيانات",
        location: "حمص",
        to: "/jobs/all?job=al-bunyan-analyst",
    },
    {
        id: "al-mateen-graphic-designer-2",
        companyName: "شركة المتين",
        jobTitle: "مصمم غرافيك",
        location: "دمشق",
        to: "/jobs/all?job=al-mateen-graphic-designer",
    },
]

interface PortalAllJobsSectionProps {
    title?: string
    description?: string
    jobs?: PortalJobListingItem[]
    itemsPerPage?: number
}

export default function PortalAllJobsSection({
    title = "كافة الوظائف",
    description = "اكتشف أفضل الفرص المناسبة لك وابدأ بعرض خدماتك على الشركات",
    jobs = defaultJobs,
    itemsPerPage = 6,
}: PortalAllJobsSectionProps) {
    const [visiblePages, setVisiblePages] = useState(1)

    const visibleCount = Math.min(jobs.length, visiblePages * itemsPerPage)
    const visibleJobs = jobs.slice(0, visibleCount)
    const canShowMore = visibleCount < jobs.length

    return (
        <section className="pb-12 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="px-22">
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

                    <div className="grid gap-y-6 gap-x-36 md:grid-cols-2">
                        {visibleJobs.map((job) => (
                            <PortalJobListingCard
                                key={job.id}
                                companyName={job.companyName}
                                jobTitle={job.jobTitle}
                                location={job.location}
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

                    {canShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-18">
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
