import {
    Award,
    BriefcaseBusiness,
    Building,
    CalendarDays,
    Clock3,
    Heart,
    MapPin,
    SendHorizontal,
} from "lucide-react"
import { useState, type ReactNode } from "react"

import { cn } from "../../utils/cn"
import { Button } from "../global/ui/button"
import { PortalCompanyDetailsView } from "./PortalAllCompaniesSection"
import PortalDetailBulletSection from "./PortalDetailBulletSection"
import PortalInternshipSimilarCard from "./PortalInternshipSimilarCard"
import PortalJobApplicationModal from "./PortalJobApplicationModal"
import {
    normalizePortalCompanyValue,
    portalCompanyDirectoryItems,
    type PortalCompanyDirectoryItem,
} from "./portalCompaniesData"
import PortalJobDetailFact from "./PortalJobDetailFact"
import type {
    PortalInternshipQuickFact,
    PortalInternshipRecord,
} from "./portalInternshipsData"
import { getPortalInternshipPath } from "./portalInternshipsData"
import { usePortalSavedTrainings } from "./usePortalSavedTrainings"

interface PortalInternshipDetailsSectionProps {
    title?: string
    description?: string
    internship: PortalInternshipRecord
    relatedInternships?: PortalInternshipRecord[]
    showActions?: boolean
}

export default function PortalInternshipDetailsSection({
    title = "كافة التدريبات",
    description = "اكتشف أفضل فرص التدريب وقم ببناء تجربة عملية داخل إحدى الشركات الكبرى",
    internship,
    relatedInternships = [],
    showActions = true,
}: PortalInternshipDetailsSectionProps) {
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] =
        useState<PortalCompanyDirectoryItem | null>(null)
    const { isSavedTraining, toggleSavedTraining } = usePortalSavedTrainings()
    const isSaved = isSavedTraining(internship.id)
    const internshipCompany = createCompanyItemFromInternship(internship)
    const companiesForDetails = getCompaniesForDetails(internshipCompany)

    function handleSelectCompany(company: PortalCompanyDirectoryItem) {
        setSelectedCompany(company)
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        })
    }

    if (selectedCompany) {
        return (
            <PortalCompanyDetailsView
                company={selectedCompany}
                companies={companiesForDetails}
                title="كافة الشركات"
                description="يمكنك هنا إيجاد جميع الشركات المسجلة في منصتنا."
                onSelectCompany={handleSelectCompany}
            />
        )
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="px-4 min-[480px]:px-6 lg:px-10 xl:px-21">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-[28px] font-bold leading-[1.3] text-black max-[400px]:text-[24px] sm:text-[32px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 text-base font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 min-[500px]:text-lg sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start min-[1440px]:gap-10">
                        <div className="w-full overflow-hidden rounded-2xl bg-[#dbe9f8] shadow-[0_20px_46px_rgb(15_23_42_/_0.14)] lg:w-[360px] min-[1440px]:w-[450px]">
                            <img
                                src={internship.imageSrc}
                                alt={internship.imageAlt}
                                className="aspect-[1.62/1] w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1 text-right">
                            <h2 className="m-0 break-words text-lg font-bold leading-[1.35] text-warning-color min-[480px]:text-xl sm:text-2xl">
                                {internship.trainingType}
                            </h2>

                            <div className="mt-5 flex max-w-full flex-wrap items-center gap-2 text-sm font-medium text-black min-[480px]:mt-6 min-[480px]:gap-2.5 min-[480px]:text-base">
                                <Building className="size-5 shrink-0 text-warning-color min-[480px]:size-6" />
                                <span className="break-words">
                                    {internship.companyLegalName}
                                </span>
                                |
                                <span className="break-all">
                                    {internship.companyWebsite}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col items-stretch gap-3 min-[520px]:mt-6 min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSelectCompany(internshipCompany)
                                    }
                                    className="inline-flex min-h-[42px] w-full items-center justify-center rounded-[8px] border border-[#3b63c6] bg-[#5f86dd] px-3 py-1.5 text-sm font-bold text-white transition duration-200 hover:brightness-105 min-[520px]:w-auto min-[520px]:px-4 min-[520px]:py-2 min-[520px]:text-size16 min-[1440px]:!px-5"
                                >
                                    عرض الشركة
                                </button>

                                <div className="inline-flex items-center gap-2 self-start text-sm font-medium text-black min-[520px]:text-size16">
                                    <MapPin className="size-4 shrink-0 text-warning-color min-[520px]:size-5" />
                                    <span>{internship.location}</span>
                                </div>
                            </div>

                            {showActions ? (
                                <div className="mt-7 flex flex-col gap-3 min-[900px]:mt-8 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-4">
                                    <Button
                                        type="button"
                                        variant="panel"
                                        size="normal"
                                        onClick={() =>
                                            setIsApplicationModalOpen(true)
                                        }
                                        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[#4da76f] bg-[#5ab37b] !px-4 !py-2 !text-base !font-bold !text-white hover:!brightness-105 min-[480px]:min-h-[52px] min-[480px]:!text-size18 min-[900px]:w-auto min-[1440px]:!px-6 min-[1440px]:!py-3"
                                    >
                                        <SendHorizontal className="ml-3 size-4 min-[480px]:size-5" />
                                        إرسال الطلب
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="panel"
                                        size="normal"
                                        aria-pressed={isSaved}
                                        onClick={() =>
                                            toggleSavedTraining(internship.id)
                                        }
                                        className={cn(
                                            "inline-flex min-h-[48px] w-full items-center justify-center rounded-xl !px-4 !py-2 !text-base !font-bold transition duration-200 min-[480px]:min-h-[52px] min-[480px]:!text-size18 min-[900px]:w-auto min-[1440px]:!px-6 min-[1440px]:!py-3",
                                            isSaved
                                                ? "border border-[#b52f2f] bg-white !text-[#b52f2f] hover:!bg-[#fff6f5]"
                                                : "border border-[#b52f2f] bg-[#c43833] !text-white hover:!brightness-105",
                                        )}
                                    >
                                        <Heart
                                            className={cn(
                                                "ml-3 size-4 min-[480px]:size-5",
                                                isSaved && "fill-current",
                                            )}
                                        />
                                        {isSaved
                                            ? "إزالة من المحفوظات"
                                            : "إضافة إلى المحفوظات"}
                                    </Button>
                                </div>
                            ) : null}
                        </div>

                        <div className="grid w-full gap-4 min-[520px]:grid-cols-2 min-[520px]:gap-5 lg:w-[280px] lg:grid-cols-1">
                            {internship.quickFacts.map((fact) => (
                                <PortalJobDetailFact
                                    key={fact.id}
                                    label={fact.label}
                                    value={fact.value}
                                    icon={resolveQuickFactIcon(fact)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 text-right">
                        <div className="mb-6 inline-flex items-center border-r-[3px] border-warning-color p-2.5">
                            <h3 className="m-0 text-2xl font-bold text-black max-[400px]:text-[22px] sm:text-size36">
                                عن التدريبات
                            </h3>
                        </div>

                        <p className="m-0 text-[15px] leading-[2] text-black min-[480px]:text-size16 sm:text-size18">
                            {internship.overview}
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 min-[640px]:gap-8 lg:grid-cols-3 lg:gap-x-10">
                        <PortalDetailBulletSection
                            title="المهام والمسؤوليات"
                            items={internship.responsibilities}
                        />
                        <PortalDetailBulletSection
                            title="المهارات"
                            items={internship.skills}
                        />
                        <PortalDetailBulletSection
                            title="الشروط"
                            items={internship.requirements}
                        />
                    </div>

                    {relatedInternships.length > 0 ? (
                        <div className="mt-14">
                            <div className="mb-8 flex justify-start">
                                <div className="inline-flex items-center border-r-[3px] border-warning-color p-2.5">
                                    <h3 className="m-0 text-2xl font-bold text-black max-[400px]:text-[22px] sm:text-size36">
                                        فرص تدريب مشابهة
                                    </h3>
                                </div>
                            </div>

                            <div className="grid gap-4 min-[520px]:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {relatedInternships.map((relatedInternship) => (
                                    <PortalInternshipSimilarCard
                                        key={relatedInternship.id}
                                        title={relatedInternship.trainingType}
                                        companyName={
                                            relatedInternship.companyLegalName
                                        }
                                        to={
                                            relatedInternship.to ??
                                            getPortalInternshipPath(
                                                relatedInternship.id,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {showActions ? (
                <PortalJobApplicationModal
                    open={isApplicationModalOpen}
                    onOpenChange={setIsApplicationModalOpen}
                />
            ) : null}
        </section>
    )
}

function createCompanyItemFromInternship(
    internship: PortalInternshipRecord,
): PortalCompanyDirectoryItem {
    return {
        id: normalizePortalCompanyValue(
            internship.companyWebsite || internship.companyName,
        ),
        companyName: internship.companyName,
        companyWebsite: internship.companyWebsite,
        logoSrc: internship.logoSrc,
        logoAlt: internship.logoAlt ?? internship.companyName,
        logoLabel: internship.logoLabel,
        to: internship.companyPageTo ?? "/companies/all",
    }
}

function getCompaniesForDetails(company: PortalCompanyDirectoryItem) {
    const hasCurrentCompany = portalCompanyDirectoryItems.some(
        (directoryCompany) => directoryCompany.id === company.id,
    )

    return hasCurrentCompany
        ? portalCompanyDirectoryItems
        : [company, ...portalCompanyDirectoryItems]
}

function resolveQuickFactIcon(fact: PortalInternshipQuickFact): ReactNode {
    switch (fact.iconName) {
        case "briefcase":
            return <BriefcaseBusiness className="size-5" />
        case "clock":
            return <Clock3 className="size-5" />
        case "calendar":
            return <CalendarDays className="size-5" />
        case "badge":
            return <Award className="size-5" />
        default:
            return null
    }
}
