import { MapPin, Plus, SendHorizontal, Tag } from "lucide-react"
import { useState } from "react"

import { Button } from "../global/ui/button"
import PortalCompanyLogoSlide from "./PortalCompanyLogoSlide"
import {
    normalizePortalCompanyValue,
    portalCompanyDirectoryItems,
    type PortalCompanyDirectoryItem,
} from "./portalCompaniesData"
import {
    portalInternshipRecords,
    type PortalInternshipRecord,
} from "./portalInternshipsData"
import { portalJobRecords, type PortalJobRecord } from "./portalJobsData"

interface PortalAllCompaniesSectionProps {
    title?: string
    description?: string
    companies?: PortalCompanyDirectoryItem[]
    itemsPerPage?: number
}

export default function PortalAllCompaniesSection({
    title = "كافة الشركات",
    description = "يمكنك هنا إيجاد جميع الشركات المسجلة في منصتنا.",
    companies = portalCompanyDirectoryItems,
    itemsPerPage = 6,
}: PortalAllCompaniesSectionProps) {
    const [visiblePages, setVisiblePages] = useState(1)
    const [selectedCompany, setSelectedCompany] =
        useState<PortalCompanyDirectoryItem | null>(null)

    function handleSelectCompany(company: PortalCompanyDirectoryItem) {
        setSelectedCompany(company)
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    }

    const visibleCount = Math.min(companies.length, visiblePages * itemsPerPage)
    const visibleCompanies = companies.slice(0, visibleCount)
    const canShowMore = visibleCount < companies.length

    if (selectedCompany) {
        return (
            <PortalCompanyDetailsView
                company={selectedCompany}
                companies={companies}
                title={title}
                description={description}
                onSelectCompany={handleSelectCompany}
            />
        )
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
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

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:px-[89px]">
                        {visibleCompanies.map((company) => (
                            <PortalCompanyLogoSlide
                                key={company.id}
                                companyName={company.companyName}
                                logoSrc={company.logoSrc}
                                logoAlt={company.logoAlt}
                                logoLabel={company.logoLabel}
                                onClick={() => handleSelectCompany(company)}
                                showCompanyName
                                className="portal-category-card-shadow min-h-[214px] !rounded-[20px] !border-black/0 !bg-white !px-6 !py-10"
                            />
                        ))}
                    </div>

                    {canShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
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

export interface PortalCompanyDetailsViewProps {
    company: PortalCompanyDirectoryItem
    companies: PortalCompanyDirectoryItem[]
    title: string
    description: string
    onSelectCompany: (company: PortalCompanyDirectoryItem) => void
}

export function PortalCompanyDetailsView({
    company,
    companies,
    title,
    description,
    onSelectCompany,
}: PortalCompanyDetailsViewProps) {
    const companyJobs = getCompanyJobs(company)
    const companyInternships = getCompanyInternships(company)
    const primaryJob = companyJobs[0]
    const primaryInternship = companyInternships[0]
    const primaryImage = primaryJob ?? primaryInternship
    const similarCompanies = companies
        .filter((currentCompany) => currentCompany.id !== company.id)
        .slice(0, 3)

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 sm:mb-12">
                        <div className="flex justify-start">
                            <div className="border-r-[3px] border-warning-color pr-2 text-right">
                                <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                    {title}
                                </h1>
                                <p className="mt-4 mb-0 text-lg font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 sm:text-size24">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 grid items-center gap-8 lg:grid-cols-[minmax(360px,1.35fr)_minmax(280px,0.9fr)] lg:gap-14">
                        <div className="order-1 overflow-hidden rounded-[14px] bg-[#eef2f6]">
                            {primaryImage?.imageSrc ? (
                                <img
                                    src={primaryImage.imageSrc}
                                    alt={primaryImage.imageAlt}
                                    className="h-[250px] w-full object-cover sm:h-[300px]"
                                />
                            ) : (
                                <div className="flex h-[250px] items-center justify-center sm:h-[300px]">
                                    <span className="inline-flex size-28 items-center justify-center rounded-full bg-white text-[32px] font-extrabold text-[#213b63] shadow-[0_12px_30px_rgb(15_23_42_/_0.12)]">
                                        {company.logoLabel ?? company.companyName.slice(0, 2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="order-2 flex flex-col items-center text-center">
                            <h2 className="mb-6 text-size24 font-bold text-warning-color">
                                {company.companyName}
                            </h2>

                            <CompanyContactLine
                                value={formatCompanyLocation(
                                    primaryJob,
                                    primaryInternship,
                                )}
                            />
                            <CompanyContactLine
                                value={formatCompanyWebsite(company)}
                            />

                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                className="mt-5 inline-flex items-center gap-3 rounded-[8px] border border-accept-color bg-accept-color !px-4 !py-2.5 !text-size16 !font-bold !text-white hover:!brightness-105"
                            >
                                متابعة
                                <SendHorizontal className="size-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="mb-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
                        <CompanyInfoColumn
                            title="المعلومات العامة"
                            items={[
                                [
                                    "العنوان",
                                    getCompanySpecialization(
                                        primaryJob,
                                        primaryInternship,
                                    ),
                                ],
                                [
                                    "القطاع",
                                    primaryJob?.category ??
                                        primaryInternship?.trainingType ??
                                        "غير محدد",
                                ],
                                [
                                    "عدد الموظفين",
                                    `${Math.max(
                                        (companyJobs.length +
                                            companyInternships.length) *
                                            8,
                                        12,
                                    )} موظف تقريبًا`,
                                ],
                                ["رقم هاتف", "غير محدد"],
                            ]}
                        />

                        <CompanyInfoColumn
                            title="معلومات المسؤول"
                            items={[
                                [
                                    "اسم مسؤول التوظيف",
                                    getHiringManagerName(primaryJob),
                                ],
                            ]}
                        />

                        <CompanyInfoColumn
                            title="الأقسام والاحتياجات"
                            items={[
                                [
                                    "نوع الوظائف التي نوظف لها",
                                    getCompanyOpportunityTitles(
                                        companyJobs,
                                        companyInternships,
                                    ),
                                ],
                                [
                                    "عدد الوظائف التي طرحناها",
                                    `${companyJobs.length} وظيفة | ${companyInternships.length} تدريب`,
                                ],
                                [
                                    "وصف الشركة",
                                    primaryJob?.companyLegalName ??
                                        primaryInternship?.companyLegalName ??
                                        company.companyName,
                                ],
                            ]}
                        />
                    </div>

                    <div className="mb-10 flex justify-start">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h2 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                شركات مشابهة
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:px-[89px]">
                        {similarCompanies.map((similarCompany) => (
                            <PortalCompanyLogoSlide
                                key={similarCompany.id}
                                companyName={similarCompany.companyName}
                                logoSrc={similarCompany.logoSrc}
                                logoAlt={similarCompany.logoAlt}
                                logoLabel={similarCompany.logoLabel}
                                onClick={() => onSelectCompany(similarCompany)}
                                showCompanyName
                                className="portal-category-card-shadow min-h-[214px] !rounded-[20px] !border-black/0 !bg-white !px-6 !py-10"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

interface CompanyInfoColumnProps {
    title: string
    items: [string, string][]
}

function CompanyInfoColumn({ title, items }: CompanyInfoColumnProps) {
    return (
        <section className="text-right">
            <div className="mb-8 border-r-[3px] border-warning-color pr-2">
                <h2 className="m-0 text-[26px] font-bold leading-[1.35] text-black sm:text-[32px]">
                    {title}
                </h2>
            </div>

            <div className="space-y-4">
                {items.map(([label, value]) => (
                    <div key={label} className="flex items-start gap-3">
                        <Tag className="mt-1 size-5 shrink-0 text-warning-color" />
                        <p className="m-0 text-size15 leading-8 text-black">
                            <span className="font-bold">{label}: </span>
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

function CompanyContactLine({ value }: { value: string }) {
    return (
        <div className="mb-4 flex items-center justify-center gap-3 text-size16 font-medium text-black">
            <MapPin className="size-6 text-warning-color" />
            <span>{value}</span>
        </div>
    )
}

function getCompanyJobs(company: PortalCompanyDirectoryItem) {
    return portalJobRecords.filter((job) => {
        const normalizedCompanyWebsite = normalizePortalCompanyValue(
            job.companyWebsite,
        )
        const normalizedCompanyName = normalizePortalCompanyValue(job.companyName)

        return (
            normalizedCompanyWebsite === company.id ||
            normalizedCompanyName === company.id
        )
    })
}

function getCompanyInternships(company: PortalCompanyDirectoryItem) {
    return portalInternshipRecords.filter((internship) => {
        const normalizedCompanyWebsite = normalizePortalCompanyValue(
            internship.companyWebsite,
        )
        const normalizedCompanyName = normalizePortalCompanyValue(
            internship.companyName,
        )

        return (
            normalizedCompanyWebsite === company.id ||
            normalizedCompanyName === company.id
        )
    })
}

function getCompanySpecialization(
    job?: PortalJobRecord,
    internship?: PortalInternshipRecord,
) {
    return (
        job?.detailColumns
            .flat()
            .find((entry) => entry.id === "specialization")?.value ??
        job?.category ??
        internship?.trainingType ??
        "غير محدد"
    )
}

function getCompanyOpportunityTitles(
    jobs: PortalJobRecord[],
    internships: PortalInternshipRecord[],
) {
    const jobTitles = Array.from(
        new Set([
            ...jobs.map((job) => job.jobTitle),
            ...internships.map((internship) => internship.trainingType),
        ]),
    )

    return jobTitles.length ? jobTitles.join(" | ") : "غير محدد"
}

function getHiringManagerName(job?: PortalJobRecord) {
    return job ? `مسؤول توظيف ${job.companyName}` : "مسؤول التوظيف"
}

function formatCompanyLocation(
    job?: PortalJobRecord,
    internship?: PortalInternshipRecord,
) {
    return job ? `${job.location} - سوريا` : (internship?.location ?? "سوريا")
}

function formatCompanyWebsite(company: PortalCompanyDirectoryItem) {
    const normalizedWebsite = company.companyWebsite.toLowerCase()

    return normalizedWebsite.startsWith("www.")
        ? normalizedWebsite
        : `www.${normalizedWebsite}`
}
