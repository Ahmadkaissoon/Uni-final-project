import { BriefcaseBusiness } from "lucide-react"
import { useMemo, type ReactNode } from "react"
import { useParams } from "react-router-dom"

import { usePortalJobCategories, usePortalJobCategoryJobs } from "../../api/portalJobs"
import Loader from "../../components/global/loader/Loader"
import PortalAllJobsSection from "../../components/portal/PortalAllJobsSection"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCategoryJobsPageProps {
    page: PortalPageDefinition
}

function PortalJobsPageState({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) {
    return (
        <section className="pb-12 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-all-jobs-content px-22">
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

                    {children}
                </div>
            </div>
        </section>
    )
}

function PortalJobsLoadingState({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <PortalJobsPageState title={title} description={description}>
            <div className="flex min-h-[260px] items-center justify-center rounded-[16px] bg-white/80">
                <Loader size={8} />
            </div>
        </PortalJobsPageState>
    )
}

function PortalJobsEmptyState({
    title,
    description,
    message,
}: {
    title: string
    description: string
    message: string
}) {
    return (
        <PortalJobsPageState title={title} description={description}>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-warning-color/45 bg-white px-5 py-10 text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-warning-color/10 text-warning-color">
                    <BriefcaseBusiness className="size-8" />
                </span>
                <p className="m-0 text-size20 font-bold text-black">{message}</p>
            </div>
        </PortalJobsPageState>
    )
}

export default function PortalCategoryJobsPage({
    page,
}: PortalCategoryJobsPageProps) {
    const { id: categoryId } = useParams<{ id: string }>()
    const categoriesQuery = usePortalJobCategories()
    const jobsQuery = usePortalJobCategoryJobs(categoryId ?? "")

    const selectedCategory = useMemo(
        () =>
            categoriesQuery.data?.data?.find(
                (category) => category._id === categoryId,
            ) ?? null,
        [categoriesQuery.data?.data, categoryId],
    )

    const categoryName =
        selectedCategory?.name ??
        jobsQuery.jobs[0]?.category ??
        page.title

    const pageTitle = `وظائف ${categoryName}`
    const pageDescription = `استكشف الفرص المتاحة ضمن تصنيف ${categoryName}، واختر الوظيفة الأنسب لك من بين الوظائف المرتبطة بهذا المجال.`

    if (!categoryId) {
        return (
            <PortalJobsEmptyState
                title={page.title}
                description={page.description}
                message="لم يتم تحديد التصنيف المطلوب."
            />
        )
    }

    if (jobsQuery.isLoading || (categoriesQuery.isLoading && !selectedCategory)) {
        return (
            <PortalJobsLoadingState
                title={pageTitle}
                description="جارٍ تحميل وظائف هذا التصنيف حالياً..."
            />
        )
    }

    if (jobsQuery.isError) {
        return (
            <PortalJobsEmptyState
                title="تعذر تحميل وظائف التصنيف"
                description="لم نتمكن من جلب الوظائف الخاصة بهذا التصنيف حالياً، يرجى المحاولة لاحقاً."
                message="لا توجد بيانات متاحة لهذا التصنيف الآن."
            />
        )
    }

    if (jobsQuery.jobs.length === 0) {
        return (
            <PortalJobsEmptyState
                title={pageTitle}
                description={pageDescription}
                message="لا توجد وظائف متاحة ضمن هذا التصنيف حالياً."
            />
        )
    }

    return (
        <PortalAllJobsSection
            title={pageTitle}
            description={pageDescription}
            jobs={jobsQuery.jobs}
        />
    )
}
