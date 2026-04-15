import type { ReactNode } from "react"
import { Eye, FileText } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import seekerImage from "../../assets/common/seeker_img.png"
import ReusableTable from "../../components/global/table/ReusableTable"
import PortalInterviewScheduleModal, {
    type PortalInterviewScheduleValues,
} from "../../components/portal/PortalInterviewScheduleModal"
import PortalOpportunityTabs, {
    type PortalOpportunityTab,
} from "../../components/portal/PortalOpportunityTabs"
import PortalProfileEditor from "../../components/portal/PortalProfileEditor"
import type { PortalPageDefinition } from "../../router/portalPages"
import {
    personProfileEditorConfig,
    type PersonProfileData,
} from "../../utils/portalProfileSchemas"

interface PortalCompanyApplicationsPageProps {
    page: PortalPageDefinition
}

type ApplicationStatusTone = "success" | "warning" | "error"

interface CompanyApplicationItem {
    id: string
    applicantName: string
    submittedAt: string
    opportunityTitle: string
    city: string
    matchRate: number
    statusLabel: string
    statusTone: ApplicationStatusTone
    profileData: PersonProfileData
    avatarSrc?: string | null
    entityLabel?: string
    interviewSchedule?: PortalInterviewScheduleValues | null
    profilePath: string
}

interface SelectedApplicationState {
    tab: PortalOpportunityTab
    itemId: string
}

const initialJobApplications: CompanyApplicationItem[] = [
    {
        id: "job-application-1",
        applicantName: "أحمد قسيسون",
        submittedAt: "02/02/2025",
        opportunityTitle: "Front-End Developer",
        city: "حمص",
        matchRate: 78,
        statusLabel: "تم التوظيف",
        statusTone: "success",
        profileData: createCandidateProfileData({
            fullName: "أحمد قسيسون",
            gender: "male",
            birthDate: "1999-02-14",
            phone: "0991234567",
            country: "سوريا",
            city: "حمص",
            address: "حي الوعر",
            jobLevel: "Front-End Developer",
            yearsExperience: "2",
            lastCompany: "شركة المدار الرقمي",
            workType: "full-time",
            latestDegree: "إجازة في هندسة المعلوماتية",
            specialization: "هندسة البرمجيات",
            university: "جامعة البعث",
            graduationYear: "2022",
            languages: "العربية (ممتاز) - الإنجليزية (جيد جدًا)",
            topAchievement: "بناء لوحة تحكم توظيف متكاملة لفريق ناشئ",
            portfolioLink: "https://ahmad-kassison.dev",
            professionalProfile: "https://linkedin.com/in/ahmad-kassison",
            projectSummary:
                "طورت عدة واجهات React وربطتها مع APIs داخل مشاريع حقيقية تركز على تجربة المستخدم وسرعة الأداء.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "باحث عن عمل",
        profilePath: "/profile?candidate=job-application-1",
    },
    {
        id: "job-application-2",
        applicantName: "ريم العلي",
        submittedAt: "11/02/2025",
        opportunityTitle: "UI/UX Designer",
        city: "دمشق",
        matchRate: 84,
        statusLabel: "قيد المتابعة",
        statusTone: "warning",
        profileData: createCandidateProfileData({
            fullName: "ريم العلي",
            gender: "female",
            birthDate: "2000-08-11",
            phone: "0944567890",
            country: "سوريا",
            city: "دمشق",
            address: "المالكي",
            jobLevel: "UI/UX Designer",
            yearsExperience: "3",
            lastCompany: "استوديو بصري",
            workType: "hybrid",
            latestDegree: "إجازة في التصميم الغرافيكي",
            specialization: "تصميم واجهات وتجربة المستخدم",
            university: "الجامعة السورية الخاصة",
            graduationYear: "2021",
            languages: "العربية (ممتاز) - الإنجليزية (جيد)",
            topAchievement: "إعادة تصميم رحلة التسجيل ورفع معدل الإكمال بنسبة 32%",
            portfolioLink: "https://reem-ui.me",
            professionalProfile: "https://behance.net/reemali",
            projectSummary:
                "أركز على تصميم واجهات واضحة وقابلة للتنفيذ مع خبرة عملية في Figma وبناء design systems صغيرة.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "باحثة عن عمل",
        profilePath: "/profile?candidate=job-application-2",
    },
    {
        id: "job-application-3",
        applicantName: "محمد الصالح",
        submittedAt: "19/02/2025",
        opportunityTitle: "Digital Marketing Specialist",
        city: "حلب",
        matchRate: 69,
        statusLabel: "مرفوض",
        statusTone: "error",
        profileData: createCandidateProfileData({
            fullName: "محمد الصالح",
            gender: "male",
            birthDate: "1998-11-03",
            phone: "0939876543",
            country: "سوريا",
            city: "حلب",
            address: "الحمدانية",
            jobLevel: "Digital Marketing Specialist",
            yearsExperience: "4",
            lastCompany: "وكالة نمو",
            workType: "part-time",
            latestDegree: "إجازة في إدارة الأعمال",
            specialization: "التسويق الرقمي",
            university: "جامعة حلب",
            graduationYear: "2020",
            languages: "العربية (ممتاز) - الإنجليزية (جيد جدًا)",
            topAchievement: "إدارة حملات رفعت عدد العملاء المحتملين بنسبة 45%",
            portfolioLink: "https://mohammad-marketing.pro",
            professionalProfile: "https://linkedin.com/in/mohammad-saleh",
            projectSummary:
                "أعمل على إدارة الحملات الإعلانية وتحليل الأداء وتحسين المحتوى التسويقي وفقًا لنتائج البيانات.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "باحث عن عمل",
        profilePath: "/profile?candidate=job-application-3",
    },
]

const initialTrainingApplications: CompanyApplicationItem[] = [
    {
        id: "training-application-1",
        applicantName: "لانا إبراهيم",
        submittedAt: "05/03/2025",
        opportunityTitle: "تدريب React للمبتدئين",
        city: "حمص",
        matchRate: 81,
        statusLabel: "تم التوظيف",
        statusTone: "success",
        profileData: createCandidateProfileData({
            fullName: "لانا إبراهيم",
            gender: "female",
            birthDate: "2002-04-19",
            phone: "0952223344",
            country: "سوريا",
            city: "حمص",
            address: "عكرمة",
            jobLevel: "متدربة React",
            yearsExperience: "0",
            lastCompany: "",
            workType: "full-time",
            latestDegree: "طالبة هندسة معلوماتية",
            specialization: "هندسة البرمجيات",
            university: "جامعة البعث",
            graduationYear: "2026",
            languages: "العربية (ممتاز) - الإنجليزية (جيد)",
            topAchievement: "بناء مشروع تخرج أولي لإدارة متجر إلكتروني",
            portfolioLink: "https://lana-react.vercel.app",
            professionalProfile: "https://github.com/lana-ibrahim",
            projectSummary:
                "أبحث عن فرصة تدريب قوية لتطوير مهاراتي في React وTypeScript والعمل ضمن فريق منتج حقيقي.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "متدربة",
        profilePath: "/profile?candidate=training-application-1",
    },
    {
        id: "training-application-2",
        applicantName: "نور الحسن",
        submittedAt: "13/03/2025",
        opportunityTitle: "تدريب تصميم واجهات",
        city: "دمشق",
        matchRate: 76,
        statusLabel: "قيد المتابعة",
        statusTone: "warning",
        profileData: createCandidateProfileData({
            fullName: "نور الحسن",
            gender: "female",
            birthDate: "2001-12-07",
            phone: "0967788990",
            country: "سوريا",
            city: "دمشق",
            address: "المزة",
            jobLevel: "متدربة تصميم واجهات",
            yearsExperience: "1",
            lastCompany: "فريلانسر",
            workType: "hybrid",
            latestDegree: "إجازة في التصميم",
            specialization: "التصميم الرقمي",
            university: "جامعة دمشق",
            graduationYear: "2024",
            languages: "العربية (ممتاز) - الإنجليزية (جيد)",
            topAchievement: "تصميم نظام ألوان ومكونات لمشروع تخرج جامعي",
            portfolioLink: "https://noor-design.webflow.io",
            professionalProfile: "https://behance.net/noorhassan",
            projectSummary:
                "أهتم ببناء تجارب مستخدم بسيطة وأنيقة، وأرغب بالعمل على منتجات حقيقية ضمن بيئة تدريبية عملية.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "متدربة",
        profilePath: "/profile?candidate=training-application-2",
    },
    {
        id: "training-application-3",
        applicantName: "عبد الرحمن ديوب",
        submittedAt: "21/03/2025",
        opportunityTitle: "تدريب محتوى وتسويق رقمي",
        city: "حلب",
        matchRate: 72,
        statusLabel: "مرفوض",
        statusTone: "error",
        profileData: createCandidateProfileData({
            fullName: "عبد الرحمن ديوب",
            gender: "male",
            birthDate: "2000-09-26",
            phone: "0984455667",
            country: "سوريا",
            city: "حلب",
            address: "الفرقان",
            jobLevel: "متدرب تسويق ومحتوى",
            yearsExperience: "1",
            lastCompany: "منصة تعليمية",
            workType: "part-time",
            latestDegree: "إجازة في الإعلام",
            specialization: "التسويق بالمحتوى",
            university: "جامعة حلب",
            graduationYear: "2023",
            languages: "العربية (ممتاز) - الإنجليزية (جيد)",
            topAchievement: "إعداد خطة محتوى شهرية رفعت الوصول العضوي 28%",
            portfolioLink: "https://abdelrahman-content.me",
            professionalProfile: "https://linkedin.com/in/abdelrahman-diab",
            projectSummary:
                "أهتم بكتابة المحتوى وتحليل الحملات وأبحث عن تدريب يطور خبرتي العملية في التسويق الرقمي.",
        }),
        avatarSrc: seekerImage,
        entityLabel: "متدرب",
        profilePath: "/profile?candidate=training-application-3",
    },
]

const applicationRowBackgrounds = ["#63adc3", "#425a7a"]

export default function PortalCompanyApplicationsPage({
    page,
}: PortalCompanyApplicationsPageProps) {
    const [activeTab, setActiveTab] = useState<PortalOpportunityTab>(
        resolveTabFromPageId(page.id),
    )
    const [jobApplications, setJobApplications] =
        useState<CompanyApplicationItem[]>(initialJobApplications)
    const [trainingApplications, setTrainingApplications] =
        useState<CompanyApplicationItem[]>(initialTrainingApplications)
    const [selectedApplication, setSelectedApplication] =
        useState<SelectedApplicationState | null>(null)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const profilePanelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (selectedApplication) {
            profilePanelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [selectedApplication])

    const openedApplication = useMemo(
        () =>
            selectedApplication?.tab === "jobs"
                ? jobApplications.find(
                      (application) =>
                          application.id === selectedApplication.itemId,
                  ) ?? null
                : selectedApplication?.tab === "trainings"
                  ? trainingApplications.find(
                        (application) =>
                            application.id === selectedApplication.itemId,
                    ) ?? null
                  : null,
        [jobApplications, selectedApplication, trainingApplications],
    )

    const jobColumns = buildApplicationColumns(
        handleOpenCvPreview,
        (row) =>
            setSelectedApplication({
                tab: "jobs",
                itemId: row.id,
            }),
    )

    const trainingColumns = buildApplicationColumns(
        handleOpenCvPreview,
        (row) =>
            setSelectedApplication({
                tab: "trainings",
                itemId: row.id,
            }),
    )

    const handleTabChange = (nextTab: PortalOpportunityTab) => {
        setActiveTab(nextTab)
        setSelectedApplication(null)
        setIsScheduleModalOpen(false)
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                الطلبات
                            </h1>
                            <p className="mt-4 mb-0 max-w-[44rem] text-size16 font-medium leading-[1.9] text-black sm:text-size20">
                                يمكنك مشاهدة جميع الطلبات التي أُرسلت إليك سواء على
                                وظائفك المنشورة أو فرص التدريب التي أضفتها، مع نسبة
                                تحقق الشروط وإمكانية فتح الـ CV أو الانتقال إلى بروفايل
                                المتقدم.
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab={activeTab}
                            onChange={handleTabChange}
                            className="lg:pt-10"
                        />
                    </div>

                    <ReusableTable
                        data={
                            activeTab === "jobs"
                                ? jobApplications
                                : trainingApplications
                        }
                        columns={
                            activeTab === "jobs" ? jobColumns : trainingColumns
                        }
                        showRowNumbers
                        primaryColor="#425a7a"
                        secondaryColor="#f2fbff"
                        rowBackgrounds={applicationRowBackgrounds}
                        textColor="#ffffff"
                        bodyTextColor="#ffffff"
                        emptyText={
                            activeTab === "jobs"
                                ? "لا توجد طلبات توظيف حاليًا."
                                : "لا توجد طلبات تدريب حاليًا."
                        }
                    />

                    {openedApplication ? (
                        <div ref={profilePanelRef} className="mt-10 sm:mt-12">
                            <PortalProfileEditor<PersonProfileData>
                                key={openedApplication.id}
                                config={personProfileEditorConfig}
                                mode="readonly"
                                useContainer={false}
                                showPageTitleBadge={false}
                                initialValues={openedApplication.profileData}
                                initialAvatarSrc={openedApplication.avatarSrc ?? null}
                                entityLabelOverride={
                                    openedApplication.entityLabel ?? "باحث عن عمل"
                                }
                                pageDescriptionOverride="هذا هو الملف الشخصي للمتقدم داخل المنصة"
                                topActions={
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleApproveCurrentApplication}
                                            className="inline-flex min-h-[48px] min-w-[128px] cursor-pointer items-center justify-center rounded-full bg-[#56a76b] px-6 py-3 text-size16 font-bold text-white shadow-[0_12px_26px_rgba(17,45,96,0.12)] transition duration-200 hover:-translate-y-0.5"
                                        >
                                            قبول
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleRejectCurrentApplication}
                                            className="inline-flex min-h-[48px] min-w-[128px] cursor-pointer items-center justify-center rounded-full border border-[#d9534f] bg-white px-6 py-3 text-size16 font-bold text-[#d9534f] transition duration-200 hover:bg-[#fff4f3]"
                                        >
                                            رفض
                                        </button>
                                    </>
                                }
                            />
                        </div>
                    ) : null}

                    <PortalInterviewScheduleModal
                        key={openedApplication?.id ?? activeTab}
                        open={isScheduleModalOpen}
                        onOpenChange={setIsScheduleModalOpen}
                        onSubmit={handleScheduleSubmit}
                        initialValues={openedApplication?.interviewSchedule}
                        applicantName={openedApplication?.applicantName}
                    />
                </div>
            </div>
        </section>
    )

    function handleApproveCurrentApplication() {
        if (!selectedApplication) {
            return
        }

        setIsScheduleModalOpen(true)
    }

    function handleRejectCurrentApplication() {
        if (!selectedApplication) {
            return
        }

        setIsScheduleModalOpen(false)
        updateApplication(selectedApplication, (application) => ({
            ...application,
            statusLabel: "مرفوض",
            statusTone: "error",
        }))
    }

    function handleScheduleSubmit(values: PortalInterviewScheduleValues) {
        if (!selectedApplication) {
            return
        }

        updateApplication(selectedApplication, (application) => ({
            ...application,
            statusLabel: "قيد المتابعة",
            statusTone: "warning",
            interviewSchedule: values,
        }))
        setIsScheduleModalOpen(false)
    }

    function updateApplication(
        target: SelectedApplicationState,
        updateItem: (application: CompanyApplicationItem) => CompanyApplicationItem,
    ) {
        if (target.tab === "jobs") {
            setJobApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application.id === target.itemId
                        ? updateItem(application)
                        : application,
                ),
            )
            return
        }

        setTrainingApplications((currentApplications) =>
            currentApplications.map((application) =>
                application.id === target.itemId
                    ? updateItem(application)
                    : application,
            ),
        )
    }
}

function buildApplicationColumns(
    onOpenCv: (row: CompanyApplicationItem) => void,
    onOpenProfile: (row: CompanyApplicationItem) => void,
) {
    return [
        {
            id: "applicantName",
            header: "الاسم",
            sortable: true,
            value: "applicantName",
            cell: (row: CompanyApplicationItem) => (
                <span className="font-bold text-white">{row.applicantName}</span>
            ),
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) => compareStrings(a.applicantName, b.applicantName, direction),
        },
        {
            id: "submittedAt",
            header: "التاريخ",
            sortable: true,
            value: "submittedAt",
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) => compareDates(a.submittedAt, b.submittedAt, direction),
        },
        {
            id: "opportunityTitle",
            header: "الفرصة",
            sortable: true,
            value: "opportunityTitle",
            cell: (row: CompanyApplicationItem) => (
                <span className="font-semibold text-white">
                    {row.opportunityTitle}
                </span>
            ),
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) =>
                compareStrings(
                    a.opportunityTitle,
                    b.opportunityTitle,
                    direction,
                ),
        },
        {
            id: "city",
            header: "المدينة",
            sortable: true,
            value: "city",
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) => compareStrings(a.city, b.city, direction),
        },
        {
            id: "matchRate",
            header: "نسبة تحقق الشروط",
            sortable: true,
            value: "matchRate",
            cell: (row: CompanyApplicationItem) => (
                <span className="text-size18 font-extrabold text-[#ff9f1a]">
                    {row.matchRate}%
                </span>
            ),
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) =>
                direction === "desc"
                    ? b.matchRate - a.matchRate
                    : a.matchRate - b.matchRate,
        },
        {
            id: "status",
            header: "الحالة",
            sortable: true,
            value: "statusLabel",
            cell: (row: CompanyApplicationItem) =>
                renderStatusBadge(row.statusLabel, row.statusTone),
            sortFn: (
                a: CompanyApplicationItem,
                b: CompanyApplicationItem,
                direction: string,
            ) => compareStrings(a.statusLabel, b.statusLabel, direction),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: (row: CompanyApplicationItem) => (
                <div className="flex items-center justify-center gap-2.5">
                    <IconActionButton
                        label="عرض الـ CV كملف PDF"
                        colorClassName="text-[#d93b2f] hover:bg-white/12"
                        onClick={() => onOpenCv(row)}
                    >
                        <FileText className="size-[18px]" />
                    </IconActionButton>

                    <IconActionButton
                        label="رؤية بروفايل المتقدم"
                        colorClassName="text-[#ffad32] hover:bg-white/12"
                        onClick={() => onOpenProfile(row)}
                    >
                        <Eye className="size-[18px]" />
                    </IconActionButton>
                </div>
            ),
        },
    ]
}

function resolveTabFromPageId(pageId: string): PortalOpportunityTab {
    return pageId === "company-training-applications" ? "trainings" : "jobs"
}

function compareStrings(leftValue: string, rightValue: string, direction: string) {
    const comparison = `${leftValue ?? ""}`.localeCompare(
        `${rightValue ?? ""}`,
        "ar",
    )

    return direction === "desc" ? comparison * -1 : comparison
}

function compareDates(leftValue: string, rightValue: string, direction: string) {
    const leftDate = parseDisplayDate(leftValue)
    const rightDate = parseDisplayDate(rightValue)
    const comparison = leftDate - rightDate

    return direction === "desc" ? comparison * -1 : comparison
}

function parseDisplayDate(value: string) {
    const [day = "1", month = "1", year = "1970"] = `${value}`.split("/")
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function handleOpenCvPreview(row: CompanyApplicationItem) {
    const pdfBlob = new Blob([buildMockPdfDocument(row)], {
        type: "application/pdf",
    })
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, "_blank", "noopener,noreferrer")

    window.setTimeout(() => {
        URL.revokeObjectURL(pdfUrl)
    }, 10_000)
}

function buildMockPdfDocument(row: CompanyApplicationItem) {
    const pdfContent = [
        "BT",
        "/F1 20 Tf",
        "50 780 Td",
        "(Applicant CV Preview) Tj",
        "0 -34 Td",
        "(Generated mock PDF for table action preview.) Tj",
        "0 -34 Td",
        `(Candidate ID: ${escapePdfText(row.id)}) Tj`,
        "0 -34 Td",
        `(Match Rate: ${row.matchRate} percent) Tj`,
        "0 -34 Td",
        "(Portal profile button will be wired to real candidate data later.) Tj",
        "ET",
    ].join("\n")

    const objects = [
        "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
        "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
        `5 0 obj\n<< /Length ${pdfContent.length} >>\nstream\n${pdfContent}\nendstream\nendobj\n`,
    ]

    let pdfDocument = "%PDF-1.4\n"
    const offsets = [0]

    for (const object of objects) {
        offsets.push(pdfDocument.length)
        pdfDocument += object
    }

    const xrefOffset = pdfDocument.length

    pdfDocument += "xref\n0 6\n0000000000 65535 f \n"
    for (let index = 1; index <= objects.length; index += 1) {
        pdfDocument += `${`${offsets[index]}`.padStart(10, "0")} 00000 n \n`
    }

    pdfDocument += [
        "trailer",
        "<< /Size 6 /Root 1 0 R >>",
        "startxref",
        `${xrefOffset}`,
        "%%EOF",
    ].join("\n")

    return pdfDocument
}

function escapePdfText(value: string) {
    return `${value}`.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)")
}

function renderStatusBadge(label: string, tone: ApplicationStatusTone) {
    const toneClassName =
        tone === "success"
            ? "bg-[#edf8ef] text-[#2f8753]"
            : tone === "warning"
              ? "bg-[#fff6ea] text-[#c48019]"
              : "bg-[#fff1f0] text-[#c63a35]"

    return (
        <span
            className={[
                "inline-flex min-w-[118px] items-center justify-center rounded-full px-4 py-2 text-size14 font-bold",
                toneClassName,
            ].join(" ")}
        >
            {label}
        </span>
    )
}

function IconActionButton({
    label,
    colorClassName,
    onClick,
    children,
}: {
    label: string
    colorClassName: string
    onClick: () => void
    children: ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            className={[
                "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-transparent transition duration-200",
                colorClassName,
            ].join(" ")}
        >
            {children}
        </button>
    )
}

function createCandidateProfileData(
    overrides: Partial<PersonProfileData>,
): PersonProfileData {
    return {
        fullName: "",
        gender: "",
        birthDate: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        jobLevel: "",
        yearsExperience: "",
        lastCompany: "",
        workType: "",
        latestDegree: "",
        specialization: "",
        university: "",
        graduationYear: "",
        languages: "",
        topAchievement: "",
        portfolioLink: "",
        professionalProfile: "",
        projectSummary: "",
        ...overrides,
    }
}
