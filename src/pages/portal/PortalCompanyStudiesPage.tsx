import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import {
    usePortalCompanyStudies,
    usePortalCompanyStudy,
} from "../../api/portalStudies"
import PortalStudyDetailsSection from "../../components/portal/PortalStudyDetailsSection"
import PortalStudiesSection from "../../components/portal/PortalStudiesSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyStudiesPageProps {
    page: PortalPageDefinition
}

const studiesPageDescription =
    "يمكنك مشاهدة جميع الدراسات والمقالات التي تنشرها شركتك داخل المنصة"

const studyDetailsDescription =
    "يمكنك الاطلاع على المقال الكامل ومراجعة كامل المحاور التي نشرتها شركتك ضمن منصة وظيفتي."

export default function PortalCompanyStudiesPage({
    page,
}: PortalCompanyStudiesPageProps) {
    const [searchParams] = useSearchParams()
    const selectedArticleId = searchParams.get("article")

    const studiesQuery = usePortalCompanyStudies()
    const selectedStudyQuery = usePortalCompanyStudy(
        selectedArticleId,
        Boolean(selectedArticleId),
    )

    const selectedStudy = useMemo(() => {
        if (!selectedArticleId) {
            return null
        }

        if (selectedStudyQuery.study?.id === selectedArticleId) {
            return selectedStudyQuery.study
        }

        return (
            studiesQuery.studies.find((study) => study.id === selectedArticleId) ??
            null
        )
    }, [selectedArticleId, selectedStudyQuery.study, studiesQuery.studies])

    const relatedStudies = useMemo(
        () =>
            studiesQuery.studies
                .filter((study) => study.id !== selectedStudy?.id)
                .slice(0, 2),
        [selectedStudy?.id, studiesQuery.studies],
    )

    if (selectedArticleId) {
        if (selectedStudyQuery.isLoading && !selectedStudy) {
            return (
                <PortalStudiesStateSection
                    title={page.title}
                    description={studyDetailsDescription}
                    message="جاري تحميل تفاصيل الدراسة..."
                />
            )
        }

        if (selectedStudyQuery.isError && !selectedStudy) {
            return (
                <PortalStudiesStateSection
                    title={page.title}
                    description={studyDetailsDescription}
                    message="تعذر تحميل تفاصيل الدراسة حالياً. حاول مرة أخرى بعد قليل."
                    tone="error"
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
    }

    if (studiesQuery.isLoading) {
        return (
            <PortalStudiesStateSection
                title={page.title}
                description={studiesPageDescription}
                message="جاري تحميل الدراسات..."
            />
        )
    }

    if (studiesQuery.isError) {
        return (
            <PortalStudiesStateSection
                title={page.title}
                description={studiesPageDescription}
                message="تعذر تحميل الدراسات حالياً. حاول تحديث الصفحة ثم أعد المحاولة."
                tone="error"
            />
        )
    }

    if (studiesQuery.studies.length === 0) {
        return (
            <PortalStudiesStateSection
                title={page.title}
                description={studiesPageDescription}
                message="لا توجد دراسات منشورة لشركتك حتى الآن."
            />
        )
    }

    return (
        <PortalStudiesSection
            title={page.title}
            description={studiesPageDescription}
            studies={studiesQuery.studies.map((study) => ({
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
    tone = "neutral",
}: {
    title: string
    description: string
    message: string
    tone?: "neutral" | "error"
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

                    <div
                        className={[
                            "portal-category-card-shadow rounded-[22px] border px-6 py-10 text-center sm:px-10 sm:py-14",
                            tone === "error"
                                ? "border-[#f0c3c0] bg-[#fff7f6] text-[#b7443e]"
                                : "border-[#dbe5f3] bg-white text-[#5b6779]",
                        ].join(" ")}
                    >
                        <p className="m-0 text-size20 font-semibold leading-[1.9] sm:text-size24">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
