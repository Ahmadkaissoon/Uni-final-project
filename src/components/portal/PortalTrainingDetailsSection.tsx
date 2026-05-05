import { Building } from "lucide-react"

import PortalJobDetailFact from "./PortalJobDetailFact"
import type { PortalTrainingRecord } from "./portalTrainingsData"

interface PortalTrainingDetailsSectionProps {
    title?: string
    description?: string
    training: PortalTrainingRecord
}

export default function PortalTrainingDetailsSection({
    title = "تفاصيل التدريب",
    description = "هنا ستظهر جميع المعلومات التي تم إدخالها حول التدريب قبل نشره على المنصة.",
    training,
}: PortalTrainingDetailsSectionProps) {
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
                                src={training.imageSrc}
                                alt={training.imageAlt}
                                className="aspect-[1.62/1] w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 text-right">
                            <h2 className="m-0 break-words text-xl font-bold leading-[1.35] text-warning-color sm:text-2xl">
                                {training.trainingTitle}
                            </h2>

                            <p className="mt-6 mb-0 font-semibold text-black">
                                {training.trainingCategory}
                            </p>

                            <div className="mt-8 flex max-w-full flex-wrap items-center gap-2.5 font-medium text-black">
                                <Building className="size-6 shrink-0 text-warning-color" />
                                <span className="break-words">
                                    {training.companyLegalName}
                                </span>
                                |
                                <span className="break-all">
                                    {training.companyWebsite}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-10">
                        {training.detailColumns.map((column, columnIndex) => (
                            <div
                                key={`training-detail-column-${columnIndex + 1}`}
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
                </div>
            </div>
        </section>
    )
}
