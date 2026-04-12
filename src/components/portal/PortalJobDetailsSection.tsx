import { useState } from "react"
import { Building, Heart, SendHorizontal } from "lucide-react"

import { cn } from "../../utils/cn"
import { Button } from "../global/ui/button"
import PortalJobApplicationModal from "./PortalJobApplicationModal"
import PortalJobDetailFact from "./PortalJobDetailFact"
import type { PortalJobRecord } from "./portalJobsData"
import { usePortalSavedJobs } from "./usePortalSavedJobs"

interface PortalJobDetailsSectionProps {
    title?: string
    description?: string
    job: PortalJobRecord
}

export default function PortalJobDetailsSection({
    title = "كافة الوظائف",
    description = "اكتشف أفضل الفرص المناسبة لك وابدأ بعرض خدماتك على الشركات",
    job,
}: PortalJobDetailsSectionProps) {
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
    const { isSavedJob, toggleSavedJob } = usePortalSavedJobs()
    const isSaved = isSavedJob(job.id)

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 text-lg font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-center xl:gap-10">
                        <div className="overflow-hidden rounded-2xl bg-[#dbe9f8] shadow-[0_20px_46px_rgb(15_23_42_/_0.14)]">
                            <img
                                src={job.imageSrc}
                                alt={job.imageAlt}
                                className="aspect-[1.62/1] w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 text-right">
                            <h2 className="m-0 break-words text-xl font-bold leading-[1.35] text-warning-color sm:text-2xl">
                                {job.jobTitle}
                            </h2>

                            <p className="mt-6 mb-0 font-semibold text-black">
                                {job.category}
                            </p>

                            <div className="mt-8 flex max-w-full flex-wrap items-center gap-2.5 font-medium text-black">
                                <Building className="size-6 shrink-0 text-warning-color" />
                                <span className="break-words">
                                    {job.companyLegalName}
                                </span>
                                |
                                <span className="break-all">
                                    {job.companyWebsite}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-10">
                        {job.detailColumns.map((column, columnIndex) => (
                            <div
                                key={`job-detail-column-${columnIndex + 1}`}
                                className="grid content-start gap-5"
                            >
                                {column.map((detail) => (
                                    <PortalJobDetailFact
                                        key={detail.id}
                                        label={detail.label}
                                        value={detail.value}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <Button
                            type="button"
                            variant="panel"
                            size="normal"
                            onClick={() => setIsApplicationModalOpen(true)}
                            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] border border-[#4da76f] bg-[#5ab37b] !px-6 !py-3 !text-size18 !font-bold !text-white hover:!brightness-105 sm:w-auto"
                        >
                            <SendHorizontal className="ml-3 size-5" />
                            إرسال الطلب
                        </Button>

                        <Button
                            type="button"
                            variant="panel"
                            size="normal"
                            aria-pressed={isSaved}
                            onClick={() => toggleSavedJob(job.id)}
                            className={cn(
                                "inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] !px-6 !py-3 !text-size18 !font-bold transition duration-200 sm:w-auto",
                                isSaved
                                    ? "border border-[#b52f2f] bg-white !text-[#b52f2f] hover:!bg-[#fff6f5]"
                                    : "border border-[#b52f2f] bg-[#c43833] !text-white hover:!brightness-105",
                            )}
                        >
                            <Heart
                                className={cn(
                                    "ml-3 size-5",
                                    isSaved && "fill-current",
                                )}
                            />
                            {isSaved
                                ? "إزالة من المحفوظات"
                                : "إضافة إلى المحفوظات"}
                        </Button>
                    </div>
                </div>
            </div>

            <PortalJobApplicationModal
                open={isApplicationModalOpen}
                onOpenChange={setIsApplicationModalOpen}
            />
        </section>
    )
}
