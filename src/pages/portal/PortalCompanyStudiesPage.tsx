import { FileText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import Loader from "../../components/global/loader/Loader"
import PortalStudyDetailsSection from "../../components/portal/PortalStudyDetailsSection"
import PortalStudiesSection from "../../components/portal/PortalStudiesSection"
import {
    companyStudyRecords,
    type PortalStudyRecord,
} from "../../components/portal/portalStudiesData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyStudiesPageProps {
    page: PortalPageDefinition
}

const mockLoadingDelayMs = 650

const studiesPageDescription =
    "يمكنك مشاهدة مجموعة مقالات ودراسات مختصرة تساعد الشركات على تحسين التوظيف والتدريب وإدارة المواهب."

const studyDetailsDescription =
    "اطلع على المقال الكامل مع المحاور الأساسية والمؤشرات التي تساعدك على تطبيق الفكرة داخل شركتك."

export default function PortalCompanyStudiesPage({
    page,
}: PortalCompanyStudiesPageProps) {
    const [searchParams] = useSearchParams()
    const selectedArticleId = searchParams.get("article")
    const [isListLoading, setIsListLoading] = useState(true)
    const [isDetailsLoading, setIsDetailsLoading] = useState(false)

    const selectedStudy = useMemo(
        () =>
            selectedArticleId
                ? companyStudyRecords.find(
                      (study) => study.id === selectedArticleId,
                  ) ?? null
                : null,
        [selectedArticleId],
    )

    const relatedStudies = useMemo(
        () =>
            companyStudyRecords
                .filter((study) => study.id !== selectedStudy?.id)
                .slice(0, 2),
        [selectedStudy?.id],
    )

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsListLoading(false)
        }, mockLoadingDelayMs)

        return () => window.clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!selectedArticleId) {
            setIsDetailsLoading(false)
            return
        }

        setIsDetailsLoading(true)
        const timer = window.setTimeout(() => {
            setIsDetailsLoading(false)
        }, mockLoadingDelayMs)

        return () => window.clearTimeout(timer)
    }, [selectedArticleId])

    if (selectedArticleId) {
        if (isDetailsLoading) {
            return (
                <PortalStudiesStateSection
                    title={page.title}
                    description={studyDetailsDescription}
                    message="جاري تحميل المقال..."
                    showLoader
                />
            )
        }

        if (selectedStudy) {
            return (
                <PortalStudyDetailsSection
                    title={page.title}
                    description={studyDetailsDescription}
                    study={selectedStudy}
                    relatedStudies={relatedStudies}
                />
            )
        }

        return (
            <PortalStudiesStateSection
                title="المقال غير متاح"
                description={studyDetailsDescription}
                message="لم نتمكن من العثور على هذا المقال ضمن البيانات الحالية."
            />
        )
    }

    if (isListLoading) {
        return (
            <PortalStudiesStateSection
                title={page.title}
                description={studiesPageDescription}
                message="جاري تحميل المقالات..."
                showLoader
            />
        )
    }

    return (
        <PortalStudiesSection
            title={page.title}
            description={studiesPageDescription}
            studies={companyStudyRecords.map((study) => ({
                id: study.id,
                companyName: study.companyName,
                studyTitle: study.studyTitle,
                excerpt: study.excerpt,
                to: `/company/studies?article=${study.id}`,
            }))}
        />
    )
}

function PortalStudiesStateSection({
    title,
    description,
    message,
    showLoader = false,
}: {
    title: string
    description: string
    message: string
    showLoader?: boolean
}) {
    return (
        <section className="py-12 sm:py-16 lg:py-20" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-12 flex justify-start sm:mb-14">
                        <div className="border-r-[3px] border-warning-color pr-6 text-right">
                            <h1 className="m-0 py-1 text-[32px] font-bold leading-[1.3] text-black sm:text-[42px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-full text-size20 font-medium leading-[1.95] text-black sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="portal-category-card-shadow flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[22px] border border-[#dbe5f3] bg-white px-6 py-10 text-center text-[#5b6779] sm:px-10 sm:py-14">
                        {showLoader ? (
                            <Loader size={8} />
                        ) : (
                            <span className="inline-flex size-14 items-center justify-center rounded-full bg-warning-color/10 text-warning-color">
                                <FileText className="size-7" />
                            </span>
                        )}

                        <p className="m-0 text-size20 font-semibold leading-[1.9] sm:text-size24">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
