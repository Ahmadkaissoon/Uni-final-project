import { BriefcaseBusiness } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { usePortalJob, usePortalJobs } from "../../api/portalJobs"
import Loader from "../../components/global/loader/Loader"
import PortalAllJobsSection from "../../components/portal/PortalAllJobsSection"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import { normalizePortalCompanyValue } from "../../components/portal/portalCompaniesData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalAllJobsPageProps {
    page: PortalPageDefinition
}

function PortalJobsPageState({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
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

export default function PortalAllJobsPage({ page }: PortalAllJobsPageProps) {
    const [searchParams] = useSearchParams()
    const selectedJobId = searchParams.get("job")
    const selectedCompanyKey = normalizePortalCompanyValue(
        searchParams.get("company"),
    )
    const jobsQuery = usePortalJobs()
    const filteredJobs = selectedCompanyKey
        ? jobsQuery.jobs.filter((job) => {
              const companyValues = [job.companyName, job.companyWebsite].map(
                  (value) => normalizePortalCompanyValue(value),
              )

              return companyValues.includes(selectedCompanyKey)
          })
        : jobsQuery.jobs
    const selectedJobListing = selectedJobId
        ? jobsQuery.jobs.find((job) => job.id === selectedJobId) ?? null
        : null
    const jobQuery = usePortalJob(selectedJobId, selectedJobListing)
    const selectedJob = jobQuery.job
    const selectedCompanyName = filteredJobs[0]?.companyName
    const listingTitle = selectedCompanyName
        ? `وظائف ${selectedCompanyName}`
        : page.title
    const listingDescription = selectedCompanyName
        ? `استكشف الوظائف المتاحة لدى ${selectedCompanyName} وتعرّف على الفرص المنشورة من قبل هذه الشركة.`
        : page.description

    if (selectedJobId) {
        if (jobQuery.isLoading && !selectedJob) {
            return (
                <PortalJobsLoadingState
                    title="تفاصيل الوظيفة"
                    description="جارٍ تحميل تفاصيل الوظيفة المختارة..."
                />
            )
        }

        if (!selectedJob) {
            return (
                <PortalJobsEmptyState
                    title="تعذر تحميل تفاصيل الوظيفة"
                    description="لم نتمكن من جلب تفاصيل هذه الوظيفة حالياً، يرجى المحاولة لاحقاً."
                    message="لا توجد بيانات لهذه الوظيفة."
                />
            )
        }

        return (
            <PortalJobDetailsSection
                title={`${selectedJob.jobTitle} لدى ${selectedJob.companyName}`}
                description={`تعرّف على تفاصيل وظيفة ${selectedJob.jobTitle} المتاحة لدى ${selectedJob.companyName}، وراجع المتطلبات والمعلومات الأساسية قبل إرسال طلبك.`}
                job={selectedJob}
            />
        )
    }

    if (jobsQuery.isLoading) {
        return (
            <PortalJobsLoadingState
                title={listingTitle}
                description="جارٍ تحميل الوظائف المتاحة حالياً..."
            />
        )
    }

    if (jobsQuery.isError) {
        return (
            <PortalJobsEmptyState
                title="تعذر تحميل الوظائف"
                description="لم نتمكن من جلب الوظائف من الخادم حالياً، يرجى المحاولة لاحقاً."
                message="لا توجد بيانات للعرض."
            />
        )
    }

    if (jobsQuery.jobs.length === 0) {
        return (
            <PortalJobsEmptyState
                title={listingTitle}
                description={listingDescription}
                message="لا توجد وظائف متاحة حالياً."
            />
        )
    }

    if (filteredJobs.length === 0) {
        return (
            <PortalJobsEmptyState
                title={listingTitle}
                description={listingDescription}
                message="لا توجد وظائف منشورة لهذه الشركة حالياً."
            />
        )
    }

    return (
        <PortalAllJobsSection
            title={listingTitle}
            description={listingDescription}
            jobs={filteredJobs}
        />
    )
}
