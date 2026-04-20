import { Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "../global/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../global/ui/select"
import PortalTrainingOpportunityCard from "./PortalTrainingOpportunityCard"
import PortalTrainingOpportunityCardSkeleton from "./PortalTrainingOpportunityCardSkeleton"
import {
    portalInternshipRecords,
    type PortalInternshipListingItem,
} from "./portalInternshipsData"

type LoadingMode = "initial" | "filter" | "more" | null

const LOAD_DELAY_MS = 1500

interface PortalAllInternshipsSectionProps {
    title?: string
    description?: string
    internships?: PortalInternshipListingItem[]
    itemsPerPage?: number
}

export default function PortalAllInternshipsSection({
    title = "كافة التدريبات",
    description = "اكتشف أفضل فرص التدريب وقم ببناء تجربة عملية داخل إحدى الشركات الكبرى",
    internships = portalInternshipRecords,
    itemsPerPage = 4,
}: PortalAllInternshipsSectionProps) {
    const [selectedTrainingType, setSelectedTrainingType] = useState("all")
    const [visiblePages, setVisiblePages] = useState(1)
    const [loadingMode, setLoadingMode] = useState<LoadingMode>("initial")

    const timeoutRef = useRef<number | null>(null)

    const trainingTypes = useMemo(
        () => Array.from(new Set(internships.map((item) => item.trainingType))),
        [internships],
    )

    const safeSelectedTrainingType =
        selectedTrainingType === "all" ||
        trainingTypes.includes(selectedTrainingType)
            ? selectedTrainingType
            : "all"

    const filteredInternships = useMemo(() => {
        if (safeSelectedTrainingType === "all") {
            return internships
        }

        return internships.filter(
            (item) => item.trainingType === safeSelectedTrainingType,
        )
    }, [internships, safeSelectedTrainingType])

    const visibleCount = Math.min(
        filteredInternships.length,
        visiblePages * itemsPerPage,
    )
    const visibleInternships = filteredInternships.slice(0, visibleCount)
    const canShowMore = visibleCount < filteredInternships.length

    const loadingSkeletonCount =
        loadingMode === "more"
            ? Math.min(itemsPerPage, filteredInternships.length - visibleCount)
            : itemsPerPage

    useEffect(() => {
        timeoutRef.current = window.setTimeout(() => {
            setLoadingMode(null)
            timeoutRef.current = null
        }, LOAD_DELAY_MS)

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    function clearLoadingTimeout() {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    function scheduleLoading(
        nextMode: Exclude<LoadingMode, null>,
        onComplete?: () => void,
    ) {
        clearLoadingTimeout()
        setLoadingMode(nextMode)

        timeoutRef.current = window.setTimeout(() => {
            onComplete?.()
            setLoadingMode(null)
            timeoutRef.current = null
        }, LOAD_DELAY_MS)
    }

    function handleTrainingTypeChange(value: string) {
        setSelectedTrainingType(value)
        setVisiblePages(1)
        scheduleLoading("filter")
    }

    function handleShowMore() {
        if (!canShowMore || loadingMode !== null) {
            return
        }

        scheduleLoading("more", () => {
            setVisiblePages((currentPage) => currentPage + 1)
        })
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex flex-col sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-6 text-right">
                            <h1 className="m-0 text-[30px] font-bold leading-[1.3] text-black sm:text-[40px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-[32ch] text-size20 leading-[1.9] text-black">
                                {description}
                            </p>
                        </div>

                        <div className="mt-8 w-full max-w-[420px] text-right">
                            <label className="mb-3 block text-size16 font-bold text-black">
                                نوع التدريب:
                            </label>

                            <Select
                                value={safeSelectedTrainingType}
                                onValueChange={handleTrainingTypeChange}
                                disabled={loadingMode !== null}
                            >
                                <SelectTrigger
                                    currentValue={safeSelectedTrainingType}
                                    variant="white"
                                    className="h-[46px] w-full rounded-[8px] border border-black/30 bg-white !px-4 !text-size16 text-black"
                                >
                                    <SelectValue placeholder="كل التدريبات" />
                                </SelectTrigger>

                                <SelectContent className="rounded-[8px] border border-black/10 bg-white">
                                    <SelectItem value="all">
                                        كل التدريبات
                                    </SelectItem>

                                    {trainingTypes.map((trainingType) => (
                                        <SelectItem
                                            key={trainingType}
                                            value={trainingType}
                                        >
                                            {trainingType}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-6">
                        {loadingMode === "initial" || loadingMode === "filter"
                            ? Array.from({ length: loadingSkeletonCount }).map(
                                  (_, index) => (
                                      <PortalTrainingOpportunityCardSkeleton
                                          key={`training-skeleton-${index + 1}`}
                                      />
                                  ),
                              )
                            : visibleInternships.map((internship) => (
                                  <PortalTrainingOpportunityCard
                                      key={internship.id}
                                      companyName={internship.companyName}
                                      trainingType={internship.trainingType}
                                      logoSrc={internship.logoSrc}
                                      logoAlt={internship.logoAlt}
                                      logoLabel={internship.logoLabel}
                                      to={internship.to}
                                      href={internship.href}
                                      target={internship.target}
                                      rel={internship.rel}
                                  />
                              ))}

                        {loadingMode === "more"
                            ? Array.from({ length: loadingSkeletonCount }).map(
                                  (_, index) => (
                                      <PortalTrainingOpportunityCardSkeleton
                                          key={`training-more-skeleton-${index + 1}`}
                                      />
                                  ),
                              )
                            : null}
                    </div>

                    {loadingMode === "more" ||
                    (loadingMode === null && canShowMore) ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={handleShowMore}
                                disabled={loadingMode !== null}
                                className="inline-flex items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size18 !font-bold !text-white hover:!brightness-105 disabled:opacity-80"
                                dir="rtl"
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                    <Plus className="size-5" />
                                </span>
                                <span className="inline-flex items-center">
                                    {loadingMode === "more"
                                        ? "جاري التحميل"
                                        : "عرض المزيد"}
                                </span>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
