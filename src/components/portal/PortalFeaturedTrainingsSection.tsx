import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { usePortalTrainings } from "../../api/portalTrainings"
import PortalTrainingOpportunityCard from "./PortalTrainingOpportunityCard"
import PortalTrainingOpportunityCardSkeleton from "./PortalTrainingOpportunityCardSkeleton"

interface PortalFeaturedTrainingsSectionProps {
    title?: string
    showMoreLabel?: string
    showMoreTo?: string
    maxItems?: number
}

export default function PortalFeaturedTrainingsSection({
    title = "فرص تدريب مميزة",
    showMoreLabel = "عرض المزيد",
    showMoreTo = "/jobs/internships",
    maxItems = 3,
}: PortalFeaturedTrainingsSectionProps) {
    const trainingsQuery = usePortalTrainings()
    const featuredTrainings = trainingsQuery.trainings.slice(0, maxItems)

    if (!trainingsQuery.isLoading && featuredTrainings.length === 0) {
        return null
    }

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
                        {trainingsQuery.isLoading
                            ? Array.from({ length: maxItems }).map((_, index) => (
                                  <PortalTrainingOpportunityCardSkeleton
                                      key={`featured-training-skeleton-${index + 1}`}
                                  />
                              ))
                            : featuredTrainings.map((training) => (
                                  <PortalTrainingOpportunityCard
                                      key={training.id}
                                      companyName={training.companyName}
                                      trainingType={training.trainingType}
                                      logoSrc={training.logoSrc}
                                      logoAlt={training.logoAlt}
                                      logoLabel={training.logoLabel}
                                      to={training.to}
                                      href={training.href}
                                      target={training.target}
                                      rel={training.rel}
                                  />
                              ))}
                    </div>

                    <div className="mt-8 flex justify-center sm:mt-10">
                        <Link to={showMoreTo} className={showMoreButtonClassName}>
                            <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                <Plus className="size-5" />
                            </span>
                            <span className="inline-flex items-center">
                                {showMoreLabel}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
