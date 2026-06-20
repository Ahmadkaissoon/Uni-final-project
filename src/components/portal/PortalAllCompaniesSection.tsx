import {
    Globe,
    Mail,
    MapPin,
    Phone,
    Plus,
    SendHorizontal,
    Tag,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
    getPortalCompanyMatchKeys,
    getPortalCompanyPrimaryMatchKey,
    usePortalCompanies,
} from "../../api/portalCompanies"
import { usePortalJobs } from "../../api/portalJobs"
import { usePortalTrainings } from "../../api/portalTrainings"
import { Button } from "../global/ui/button"
import PortalCompanyLogoSlide from "./PortalCompanyLogoSlide"
import PortalCompanyLogoSlideSkeleton from "./PortalCompanyLogoSlideSkeleton"
import {
    buildPortalCompanyJobsPath,
    normalizePortalCompanyValue,
    type PortalCompanyDirectoryItem,
} from "./portalCompaniesData"

interface PortalAllCompaniesSectionProps {
    title?: string
    description?: string
    companies?: PortalCompanyDirectoryItem[]
    itemsPerPage?: number
}

export default function PortalAllCompaniesSection({
    title = "كافة الشركات",
    description = "يمكنك هنا إيجاد جميع الشركات المسجلة في منصتنا.",
    companies,
    itemsPerPage = 6,
}: PortalAllCompaniesSectionProps) {
    const [visiblePages, setVisiblePages] = useState(1)
    const [searchParams, setSearchParams] = useSearchParams()
    const companiesQuery = usePortalCompanies()
    const resolvedCompanies = companies ?? companiesQuery.companies
    const isLoading = companies === undefined && companiesQuery.isLoading
    const isError = companies === undefined && companiesQuery.isError
    const selectedCompanyId = searchParams.get("company")

    const selectedCompany = useMemo(
        () =>
            selectedCompanyId
                ? resolvedCompanies.find((company) => company.id === selectedCompanyId) ??
                  null
                : null,
        [resolvedCompanies, selectedCompanyId],
    )

    function scrollToTop() {
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    }

    function handleSelectCompany(company: PortalCompanyDirectoryItem) {
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.set("company", company.id)
        setSearchParams(nextSearchParams)
        scrollToTop()
    }

    function handleClearSelectedCompany() {
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.delete("company")
        setSearchParams(nextSearchParams)
        scrollToTop()
    }

    const visibleCount = Math.min(resolvedCompanies.length, visiblePages * itemsPerPage)
    const visibleCompanies = resolvedCompanies.slice(0, visibleCount)
    const canShowMore = visibleCount < resolvedCompanies.length

    if (selectedCompany) {
        return (
            <PortalCompanyDetailsView
                company={selectedCompany}
                companies={resolvedCompanies}
                title={title}
                description={description}
                onSelectCompany={handleSelectCompany}
                onBack={handleClearSelectedCompany}
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

                    {isError ? (
                        <div className="portal-category-card-shadow rounded-[20px] bg-white px-6 py-12 text-center">
                            <p className="m-0 text-size18 font-bold text-black">
                                تعذر تحميل الشركات حالياً، يرجى المحاولة لاحقاً.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:px-[89px]">
                                {isLoading
                                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                                          <PortalCompanyLogoSlideSkeleton
                                              key={`company-grid-skeleton-${index + 1}`}
                                              showCompanyName
                                              className="portal-category-card-shadow min-h-[214px] !rounded-[20px] !border-black/0 !bg-white !px-6 !py-10"
                                          />
                                      ))
                                    : visibleCompanies.length > 0
                                      ? visibleCompanies.map((company) => (
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
                                        ))
                                      : (
                                          <div className="portal-category-card-shadow col-span-full rounded-[20px] bg-white px-6 py-12 text-center">
                                              <p className="m-0 text-size18 font-bold text-black">
                                                  لا توجد شركات متاحة حالياً.
                                              </p>
                                          </div>
                                      )}
                            </div>

                            {canShowMore ? (
                                <div className="mt-8 flex justify-center sm:mt-10">
                                    <Button
                                        type="button"
                                        variant="panel"
                                        size="normal"
                                        onClick={() =>
                                            setVisiblePages((currentPage) => currentPage + 1)
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
                        </>
                    )}
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
    onBack?: () => void
}

export function PortalCompanyDetailsView({
    company,
    companies,
    title,
    description,
    onSelectCompany,
    onBack,
}: PortalCompanyDetailsViewProps) {
    const navigate = useNavigate()
    const jobsQuery = usePortalJobs()
    const trainingsQuery = usePortalTrainings()
    const companyJobs = useMemo(
        () =>
            jobsQuery.jobs.filter((job) =>
                matchesCompanyIdentity(company, job.companyName, job.companyWebsite),
            ),
        [company, jobsQuery.jobs],
    )
    const companyTrainings = useMemo(
        () =>
            trainingsQuery.trainings.filter((training) =>
                matchesCompanyIdentity(company, training.companyName),
            ),
        [company, trainingsQuery.trainings],
    )
    const primaryMatchKey = getPortalCompanyPrimaryMatchKey(company)
    const opportunitiesAreLoading =
        jobsQuery.isLoading || trainingsQuery.isLoading
    const similarCompanies = useMemo(
        () =>
            companies
                .filter((currentCompany) => currentCompany.id !== company.id)
                .sort((firstCompany, secondCompany) => {
                    const firstScore = getSimilarCompanyScore(company, firstCompany)
                    const secondScore = getSimilarCompanyScore(company, secondCompany)
                    return secondScore - firstScore
                })
                .slice(0, 3),
        [companies, company],
    )

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

                        {onBack ? (
                            <div className="mt-6 flex justify-start">
                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={onBack}
                                    className="rounded-[8px] border border-warning-color bg-white !px-4 !py-2 !text-size16 !font-bold !text-warning-color hover:!bg-warning-color hover:!text-white"
                                >
                                    عرض كافة الشركات
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    <div className="mb-12 grid items-center gap-8 lg:grid-cols-[minmax(360px,1.35fr)_minmax(280px,0.9fr)] lg:gap-14">
                        <div className="order-1 overflow-hidden rounded-[14px] bg-[#eef2f6]">
                            {company.logoSrc ? (
                                <img
                                    src={company.logoSrc}
                                    alt={company.logoAlt ?? company.companyName}
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
                                icon={<MapPin className="size-6 text-warning-color" />}
                                value={formatCompanyLocation(company)}
                            />
                            <CompanyContactLine
                                icon={<Globe className="size-6 text-warning-color" />}
                                value={formatCompanyWebsite(company)}
                            />
                            <CompanyContactLine
                                icon={<Mail className="size-6 text-warning-color" />}
                                value={formatTextValue(company.companyEmail)}
                            />

                            <div className="mt-5 flex flex-col items-center gap-3 min-[520px]:flex-row">
                                <Button
                                    type="button"
                                    variant="panel"
                                    size="normal"
                                    onClick={() =>
                                        navigate(buildPortalCompanyJobsPath(primaryMatchKey))
                                    }
                                    className="inline-flex items-center gap-3 rounded-[8px] border border-accept-color bg-accept-color !px-4 !py-2.5 !text-size16 !font-bold !text-white hover:!brightness-105"
                                >
                                    عرض الوظائف
                                    <SendHorizontal className="size-5" />
                                </Button>

                                {company.companyPhone ? (
                                    <div className="inline-flex items-center gap-2 text-sm font-medium text-black min-[520px]:text-size16">
                                        <Phone className="size-5 shrink-0 text-warning-color" />
                                        <span>{company.companyPhone}</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="mb-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
                        <CompanyInfoColumn
                            title="المعلومات العامة"
                            items={[
                                ["العنوان", formatCompanyAddress(company)],
                                ["القطاع", formatCompanySector(company.sector)],
                                [
                                    "عدد الموظفين",
                                    formatCompanyEmployees(company.numberOfEmployees),
                                ],
                                ["هاتف الشركة", formatTextValue(company.companyPhone)],
                            ]}
                        />

                        <CompanyInfoColumn
                            title="معلومات المسؤول"
                            items={[
                                [
                                    "اسم مسؤول الموارد البشرية",
                                    formatTextValue(company.hrManagerName),
                                ],
                                [
                                    "البريد الإلكتروني",
                                    formatTextValue(company.companyEmail),
                                ],
                                [
                                    "الموقع الإلكتروني",
                                    formatCompanyWebsite(company),
                                ],
                            ]}
                        />

                        <CompanyInfoColumn
                            title="الأقسام والاحتياجات"
                            items={[
                                [
                                    "أنواع الفرص المطلوبة",
                                    formatCompanyJobTypes(company.jobTypes),
                                ],
                                [
                                    "عدد الفرص الحالية",
                                    opportunitiesAreLoading
                                        ? "جاري تحميل الفرص..."
                                        : `${companyJobs.length} وظيفة | ${companyTrainings.length} تدريب`,
                                ],
                                [
                                    "الفرص المخطط نشرها شهرياً",
                                    formatMonthlyPosts(company.monthlyJobPostsPlanned),
                                ],
                                [
                                    "توصيات الشركة",
                                    formatCompanyRecommendations(
                                        company.companyRecommendations,
                                        companyJobs,
                                        companyTrainings,
                                    ),
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

function CompanyContactLine({
    icon,
    value,
}: {
    icon: ReactNode
    value: string
}) {
    return (
        <div className="mb-4 flex items-center justify-center gap-3 text-size16 font-medium text-black">
            {icon}
            <span>{value}</span>
        </div>
    )
}

function matchesCompanyIdentity(
    company: PortalCompanyDirectoryItem,
    companyName?: string,
    companyWebsite?: string,
) {
    const companyMatchKeys = getPortalCompanyMatchKeys(company)
    const comparedValues = [companyName, companyWebsite]
        .map((value) => normalizePortalCompanyValue(value))
        .filter(Boolean)

    return comparedValues.some((value) => companyMatchKeys.includes(value))
}

function getSimilarCompanyScore(
    baseCompany: PortalCompanyDirectoryItem,
    candidateCompany: PortalCompanyDirectoryItem,
) {
    let score = 0

    if (baseCompany.sector && baseCompany.sector === candidateCompany.sector) {
        score += 3
    }

    if (baseCompany.country && baseCompany.country === candidateCompany.country) {
        score += 2
    }

    if (baseCompany.city && baseCompany.city === candidateCompany.city) {
        score += 1
    }

    return score
}

function formatTextValue(value?: string | null, fallback = "غير محدد") {
    const normalizedValue = `${value ?? ""}`.trim()
    return normalizedValue || fallback
}

function formatCompanyWebsite(company: PortalCompanyDirectoryItem) {
    const rawWebsite = formatTextValue(company.companyWebsite, "")

    if (!rawWebsite) {
        return "غير محدد"
    }

    return rawWebsite.replace(/^https?:\/\//i, "").replace(/\/$/, "")
}

function formatCompanyLocation(company: PortalCompanyDirectoryItem) {
    const locationParts = [
        formatTextValue(company.city, ""),
        formatCountryName(company.country),
    ].filter(Boolean)

    return locationParts.length > 0 ? locationParts.join(" - ") : "غير محدد"
}

function formatCompanyAddress(company: PortalCompanyDirectoryItem) {
    const addressParts = [
        formatTextValue(company.address, ""),
        formatTextValue(company.city, ""),
        formatCountryName(company.country),
    ].filter(Boolean)

    return addressParts.length > 0 ? addressParts.join(" - ") : "غير محدد"
}

function formatCountryName(countryCode?: string) {
    const normalizedCode = `${countryCode ?? ""}`.trim().toUpperCase()

    switch (normalizedCode) {
        case "SA":
            return "السعودية"
        case "SY":
            return "سوريا"
        case "AE":
            return "الإمارات"
        case "EG":
            return "مصر"
        case "JO":
            return "الأردن"
        case "QA":
            return "قطر"
        case "KW":
            return "الكويت"
        case "BH":
            return "البحرين"
        case "OM":
            return "عُمان"
        default:
            return formatTextValue(countryCode, "")
    }
}

function formatCompanySector(sector?: string) {
    const normalizedSector = `${sector ?? ""}`.trim().toLowerCase()

    switch (normalizedSector) {
        case "technology":
            return "التكنولوجيا"
        case "marketing":
            return "التسويق"
        case "education":
            return "التعليم"
        case "healthcare":
            return "الرعاية الصحية"
        case "finance":
            return "التمويل"
        default:
            return formatTextValue(sector)
    }
}

function formatCompanyEmployees(numberOfEmployees?: number) {
    return typeof numberOfEmployees === "number"
        ? `${numberOfEmployees} موظف`
        : "غير محدد"
}

function formatCompanyJobTypes(jobTypes?: string[]) {
    if (!jobTypes?.length) {
        return "غير محدد"
    }

    return jobTypes.map(formatJobTypeLabel).join(" | ")
}

function formatJobTypeLabel(jobType: string) {
    switch (`${jobType}`.trim().toLowerCase()) {
        case "full-time":
            return "دوام كامل"
        case "part-time":
            return "دوام جزئي"
        case "remote":
            return "عن بعد"
        case "hybrid":
            return "هجين"
        case "onsite":
            return "ضمن الشركة"
        case "internship":
            return "تدريب"
        default:
            return formatTextValue(jobType)
    }
}

function formatMonthlyPosts(monthlyJobPostsPlanned?: number) {
    return typeof monthlyJobPostsPlanned === "number"
        ? `${monthlyJobPostsPlanned} فرصة شهرياً`
        : "غير محدد"
}

function formatCompanyRecommendations(
    recommendations?: string,
    companyJobs: { jobTitle: string }[] = [],
    companyTrainings: { trainingType: string }[] = [],
) {
    const normalizedRecommendations = `${recommendations ?? ""}`.trim()

    if (normalizedRecommendations) {
        return normalizedRecommendations
    }

    const opportunityTitles = Array.from(
        new Set([
            ...companyJobs.map((job) => job.jobTitle),
            ...companyTrainings.map((training) => training.trainingType),
        ]),
    )

    return opportunityTitles.length > 0
        ? opportunityTitles.join(" | ")
        : "غير محدد"
}
