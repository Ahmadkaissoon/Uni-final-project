import type { ReactNode } from "react"
import { Eye, PencilLine, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import ReusableTable from "../../components/global/table/ReusableTable"
import { Button } from "../../components/global/ui/button"
import PortalCompanyJobForm from "../../components/portal/PortalCompanyJobForm"
import PortalCompanyTrainingForm from "../../components/portal/PortalCompanyTrainingForm"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import PortalOpportunityTabs, {
    type PortalOpportunityTab,
} from "../../components/portal/PortalOpportunityTabs"
import PortalTrainingDetailsSection from "../../components/portal/PortalTrainingDetailsSection"
import type { CompanyJobFormData } from "../../components/portal/companyForms/companyJobFormModel"
import { buildCompanyJobRecord } from "../../components/portal/companyForms/companyJobFormModel"
import type { CompanyTrainingFormData } from "../../components/portal/companyForms/companyTrainingFormModel"
import { buildCompanyTrainingRecord } from "../../components/portal/companyForms/companyTrainingFormModel"
import type { PortalJobRecord } from "../../components/portal/portalJobsData"
import type { PortalTrainingRecord } from "../../components/portal/portalTrainingsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyOpportunitiesPageProps {
    page: PortalPageDefinition
}

type OpportunityStatusTone = "success" | "warning" | "neutral"
type ManagementPanelMode = "details" | "edit"

interface ManagedJobItem {
    id: string
    createdAt: string
    statusLabel: string
    statusTone: OpportunityStatusTone
    formData: CompanyJobFormData
    record: PortalJobRecord
}

interface ManagedTrainingItem {
    id: string
    createdAt: string
    statusLabel: string
    statusTone: OpportunityStatusTone
    formData: CompanyTrainingFormData
    record: PortalTrainingRecord
}

interface ActivePanelState {
    tab: PortalOpportunityTab
    mode: ManagementPanelMode
    itemId: string
}

const initialManagedJobs: ManagedJobItem[] = [
    createManagedJobItem({
        id: "company-job-1",
        createdAt: "02/02/2025",
        statusLabel: "تم التوظيف",
        statusTone: "success",
        formData: {
            jobCategory: "البرمجة",
            jobTitle: "Front-End Developer",
            specialization: "React.js | TypeScript | Tailwind CSS",
            workMode: "دوام كامل",
            englishLevel: "متوسط إلى متقدم",
            jobType: "هجين",
            yearsExperience: "3 سنوات",
            workingHours: "من 9:00 إلى 5:00",
            location: "حمص",
            workingDays: "من الأحد إلى الخميس",
            educationLevel: "علوم حاسوب أو ما يعادلها",
            seniority: "Mid-Level",
            cvLanguage: "عربي | إنكليزي",
            minSalary: "850 دولار شهريًا",
            maxSalary: "1300 دولار شهريًا",
            jobSummary:
                "نبحث عن مطور واجهات قادر على بناء صفحات تفاعلية سريعة ومتجاوبة ضمن فريق منتج رقمي.",
            responsibilities:
                "تطوير الواجهات، ربطها مع الـ APIs، تحسين الأداء، والمشاركة في مراجعات الكود.",
            qualifications:
                "إتقان React وTypeScript، خبرة في إدارة الحالة، وقدرة جيدة على العمل الجماعي.",
            requirements:
                "الالتزام بالمواعيد، فهم جيد لتجربة المستخدم، والاستعداد للتعلم المستمر.",
        },
    }),
    createManagedJobItem({
        id: "company-job-2",
        createdAt: "11/03/2025",
        statusLabel: "قيد المراجعة",
        statusTone: "warning",
        formData: {
            jobCategory: "التصميم",
            jobTitle: "UI/UX Designer",
            specialization: "تصميم واجهات وتجربة مستخدم",
            workMode: "دوام كامل",
            englishLevel: "متوسط",
            jobType: "مكتبي",
            yearsExperience: "سنتان",
            workingHours: "من 10:00 إلى 6:00",
            location: "دمشق",
            workingDays: "من السبت إلى الأربعاء",
            educationLevel: "تصميم أو ما يعادله",
            seniority: "Junior / Mid",
            cvLanguage: "عربي",
            minSalary: "600 دولار شهريًا",
            maxSalary: "950 دولار شهريًا",
            jobSummary:
                "دور تصميمي يركز على بناء شاشات واضحة وتحسين رحلة المستخدم في منتجات الشركة.",
            responsibilities:
                "بناء wireframes، تصميم prototypes، العمل مع المطورين، وتحسين المكتبة البصرية.",
            qualifications:
                "خبرة في Figma، فهم أساسي للـ design systems، وعين قوية للتفاصيل.",
            requirements:
                "وجود portfolio واضح، والقدرة على استقبال الملاحظات وتحويلها لتحسينات عملية.",
        },
    }),
    createManagedJobItem({
        id: "company-job-3",
        createdAt: "24/04/2025",
        statusLabel: "ما زالت معروضة",
        statusTone: "neutral",
        formData: {
            jobCategory: "التسويق",
            jobTitle: "Digital Marketing Specialist",
            specialization: "إعلانات رقمية وإدارة محتوى",
            workMode: "دوام جزئي",
            englishLevel: "متوسط",
            jobType: "ريموتلي",
            yearsExperience: "سنة ونصف",
            workingHours: "5 ساعات يوميًا",
            location: "حلب",
            workingDays: "من الأحد إلى الخميس",
            educationLevel: "لا يوجد مستوى مطلوب",
            seniority: "Specialist",
            cvLanguage: "عربي | إنكليزي",
            minSalary: "450 دولار شهريًا",
            maxSalary: "800 دولار شهريًا",
            jobSummary:
                "نبحث عن مختص تسويق رقمي لقيادة الحملات وتحسين ظهور عروض الشركة ومنشوراتها.",
            responsibilities:
                "إدارة الحملات، كتابة المحتوى الإعلاني، تحليل النتائج، وتحسين الاستهداف.",
            qualifications:
                "خبرة عملية في Meta Ads وGoogle Ads، ومهارات كتابة وتحليل جيدة.",
            requirements:
                "توفر خبرة سابقة موثقة، والقدرة على إدارة أكثر من حملة بالتوازي.",
        },
    }),
]

const initialManagedTrainings: ManagedTrainingItem[] = [
    createManagedTrainingItem({
        id: "company-training-1",
        createdAt: "16/02/2025",
        statusLabel: "اكتمل الاختيار",
        statusTone: "success",
        formData: {
            trainingCategory: "التصميم",
            trainingTitle: "تدريب تصميم واجهات",
            traineeLevel: "مبتدئ إلى متوسط",
            trainingDuration: "3 أشهر",
            trainingSchedule: "دوام جزئي",
            trainingReward: "200 دولار شهريًا",
            trainingLocation: "دمشق",
            aboutTraining:
                "تدريب عملي على تصميم الواجهات، بناء الـ flows، واستخدام Figma ضمن منتجات حقيقية.",
            responsibilities:
                "المشاركة في تنفيذ المهام اليومية، حضور جلسات الإرشاد، وتسليم ملفات التصميم أسبوعيًا.",
            skills:
                "أساسيات Figma، فهم جيد للتدرج البصري، واستعداد للتعلم العملي.",
            conditions:
                "الالتزام بمواعيد التدريب، وتنفيذ الواجبات العملية ضمن الوقت المطلوب.",
        },
    }),
    createManagedTrainingItem({
        id: "company-training-2",
        createdAt: "01/03/2025",
        statusLabel: "قيد استقبال الطلبات",
        statusTone: "neutral",
        formData: {
            trainingCategory: "البرمجة",
            trainingTitle: "تدريب React للمبتدئين",
            traineeLevel: "مبتدئ",
            trainingDuration: "شهران",
            trainingSchedule: "4 أيام أسبوعيًا",
            trainingReward: "150 دولار شهريًا",
            trainingLocation: "حمص",
            aboutTraining:
                "برنامج تدريبي موجه للمبتدئين لبناء أساس قوي في React ومفاهيم الواجهات الحديثة.",
            responsibilities:
                "إنجاز تطبيقات صغيرة، حضور جلسات شرح، والمشاركة في مراجعات أسبوعية.",
            skills:
                "أساسيات HTML/CSS/JavaScript، والقدرة على استخدام Git بشكل مبدئي.",
            conditions:
                "توفر لابتوب شخصي، والالتزام بإتمام التمارين العملية بشكل منتظم.",
        },
    }),
    createManagedTrainingItem({
        id: "company-training-3",
        createdAt: "18/03/2025",
        statusLabel: "قيد الفرز",
        statusTone: "warning",
        formData: {
            trainingCategory: "التسويق",
            trainingTitle: "تدريب محتوى وتسويق رقمي",
            traineeLevel: "متوسط",
            trainingDuration: "6 أسابيع",
            trainingSchedule: "دوام جزئي",
            trainingReward: "180 دولار شهريًا",
            trainingLocation: "حلب",
            aboutTraining:
                "تدريب يجمع بين كتابة المحتوى وتحليل الحملات التسويقية مع تطبيقات عملية أسبوعية.",
            responsibilities:
                "إعداد محتوى، دعم الحملات، تقديم تقارير مختصرة، والعمل مع فريق الماركتنغ.",
            skills:
                "مهارات كتابة، فضول للتجربة والتحليل، وقدرة على التعلم السريع.",
            conditions:
                "القدرة على الالتزام بالحضور، وتنفيذ المهمات المطلوبة بالتنسيق مع المشرف.",
        },
    }),
]

export default function PortalCompanyOpportunitiesPage({
    page,
}: PortalCompanyOpportunitiesPageProps) {
    const [activeTab, setActiveTab] = useState<PortalOpportunityTab>(
        resolveTabFromPageId(page.id),
    )
    const [jobs, setJobs] = useState<ManagedJobItem[]>(initialManagedJobs)
    const [trainings, setTrainings] =
        useState<ManagedTrainingItem[]>(initialManagedTrainings)
    const [activePanel, setActivePanel] = useState<ActivePanelState | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setActiveTab(resolveTabFromPageId(page.id))
        setActivePanel(null)
    }, [page.id])

    useEffect(() => {
        setActivePanel(null)
    }, [activeTab])

    useEffect(() => {
        if (activePanel) {
            panelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [activePanel])

    const selectedJob = useMemo(
        () =>
            activePanel?.tab === "jobs"
                ? jobs.find((item) => item.id === activePanel.itemId) ?? null
                : null,
        [activePanel, jobs],
    )

    const selectedTraining = useMemo(
        () =>
            activePanel?.tab === "trainings"
                ? trainings.find((item) => item.id === activePanel.itemId) ?? null
                : null,
        [activePanel, trainings],
    )

    const jobColumns = useMemo(
        () => [
            {
                id: "date",
                header: "التاريخ",
                sortable: true,
                cell: (row: ManagedJobItem) => row.createdAt,
                sortFn: (a: ManagedJobItem, b: ManagedJobItem, direction: string) =>
                    compareStrings(a.createdAt, b.createdAt, direction),
            },
            {
                id: "title",
                header: "العمل/التدريب",
                sortable: true,
                cell: (row: ManagedJobItem) => (
                    <span className="font-semibold text-[#1f355d]">
                        {row.record.jobTitle}
                    </span>
                ),
                sortFn: (a: ManagedJobItem, b: ManagedJobItem, direction: string) =>
                    compareStrings(a.record.jobTitle, b.record.jobTitle, direction),
            },
            {
                id: "city",
                header: "المدينة",
                sortable: true,
                cell: (row: ManagedJobItem) => row.record.location,
                sortFn: (a: ManagedJobItem, b: ManagedJobItem, direction: string) =>
                    compareStrings(a.record.location, b.record.location, direction),
            },
            {
                id: "status",
                header: "الحالة",
                cell: (row: ManagedJobItem) =>
                    renderStatusBadge(row.statusLabel, row.statusTone),
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: (row: ManagedJobItem) => (
                    <div className="flex items-center justify-center gap-2.5">
                        <IconActionButton
                            label="عرض التفاصيل"
                            colorClassName="text-[#d48a15] hover:bg-[#fff7ea]"
                            onClick={() =>
                                setActivePanel({
                                    tab: "jobs",
                                    mode: "details",
                                    itemId: row.id,
                                })
                            }
                        >
                            <Eye className="size-[18px]" />
                        </IconActionButton>
                        <IconActionButton
                            label="تعديل الوظيفة"
                            colorClassName="text-[#4ea56e] hover:bg-[#eefaf2]"
                            onClick={() =>
                                setActivePanel({
                                    tab: "jobs",
                                    mode: "edit",
                                    itemId: row.id,
                                })
                            }
                        >
                            <PencilLine className="size-[18px]" />
                        </IconActionButton>
                        <IconActionButton
                            label="حذف الوظيفة"
                            colorClassName="text-[#c63a35] hover:bg-[#fff1f0]"
                            onClick={() => handleDeleteJob(row.id)}
                        >
                            <Trash2 className="size-[18px]" />
                        </IconActionButton>
                    </div>
                ),
            },
        ],
        [],
    )

    const trainingColumns = useMemo(
        () => [
            {
                id: "date",
                header: "التاريخ",
                sortable: true,
                cell: (row: ManagedTrainingItem) => row.createdAt,
                sortFn: (
                    a: ManagedTrainingItem,
                    b: ManagedTrainingItem,
                    direction: string,
                ) => compareStrings(a.createdAt, b.createdAt, direction),
            },
            {
                id: "title",
                header: "العمل/التدريب",
                sortable: true,
                cell: (row: ManagedTrainingItem) => (
                    <span className="font-semibold text-[#1f355d]">
                        {row.record.trainingTitle}
                    </span>
                ),
                sortFn: (
                    a: ManagedTrainingItem,
                    b: ManagedTrainingItem,
                    direction: string,
                ) =>
                    compareStrings(
                        a.record.trainingTitle,
                        b.record.trainingTitle,
                        direction,
                    ),
            },
            {
                id: "city",
                header: "المدينة",
                sortable: true,
                cell: (row: ManagedTrainingItem) =>
                    row.formData.trainingLocation || "غير محدد",
                sortFn: (
                    a: ManagedTrainingItem,
                    b: ManagedTrainingItem,
                    direction: string,
                ) =>
                    compareStrings(
                        a.formData.trainingLocation,
                        b.formData.trainingLocation,
                        direction,
                    ),
            },
            {
                id: "status",
                header: "الحالة",
                cell: (row: ManagedTrainingItem) =>
                    renderStatusBadge(row.statusLabel, row.statusTone),
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: (row: ManagedTrainingItem) => (
                    <div className="flex items-center justify-center gap-2.5">
                        <IconActionButton
                            label="عرض التفاصيل"
                            colorClassName="text-[#d48a15] hover:bg-[#fff7ea]"
                            onClick={() =>
                                setActivePanel({
                                    tab: "trainings",
                                    mode: "details",
                                    itemId: row.id,
                                })
                            }
                        >
                            <Eye className="size-[18px]" />
                        </IconActionButton>
                        <IconActionButton
                            label="تعديل التدريب"
                            colorClassName="text-[#4ea56e] hover:bg-[#eefaf2]"
                            onClick={() =>
                                setActivePanel({
                                    tab: "trainings",
                                    mode: "edit",
                                    itemId: row.id,
                                })
                            }
                        >
                            <PencilLine className="size-[18px]" />
                        </IconActionButton>
                        <IconActionButton
                            label="حذف التدريب"
                            colorClassName="text-[#c63a35] hover:bg-[#fff1f0]"
                            onClick={() => handleDeleteTraining(row.id)}
                        >
                            <Trash2 className="size-[18px]" />
                        </IconActionButton>
                    </div>
                ),
            },
        ],
        [],
    )

    function handleDeleteJob(itemId: string) {
        if (!window.confirm("هل تريد حذف هذه الوظيفة من القائمة؟")) {
            return
        }

        setJobs((currentJobs) => currentJobs.filter((item) => item.id !== itemId))
        setActivePanel((currentPanel) =>
            currentPanel?.tab === "jobs" && currentPanel.itemId === itemId
                ? null
                : currentPanel,
        )
    }

    function handleDeleteTraining(itemId: string) {
        if (!window.confirm("هل تريد حذف هذا التدريب من القائمة؟")) {
            return
        }

        setTrainings((currentTrainings) =>
            currentTrainings.filter((item) => item.id !== itemId),
        )
        setActivePanel((currentPanel) =>
            currentPanel?.tab === "trainings" && currentPanel.itemId === itemId
                ? null
                : currentPanel,
        )
    }

    function handleJobUpdate(updatedFormData: CompanyJobFormData) {
        if (!selectedJob) {
            return
        }

        const updatedItem: ManagedJobItem = {
            ...selectedJob,
            formData: updatedFormData,
            record: buildCompanyJobRecord(updatedFormData, {
                id: selectedJob.record.id,
                companyName: selectedJob.record.companyName,
                companyLegalName: selectedJob.record.companyLegalName,
                companyWebsite: selectedJob.record.companyWebsite,
                imageSrc: selectedJob.record.imageSrc,
                imageAlt: selectedJob.record.imageAlt,
            }),
        }

        setJobs((currentJobs) =>
            currentJobs.map((item) =>
                item.id === selectedJob.id ? updatedItem : item,
            ),
        )
        setActivePanel({
            tab: "jobs",
            mode: "details",
            itemId: selectedJob.id,
        })
    }

    function handleTrainingUpdate(updatedFormData: CompanyTrainingFormData) {
        if (!selectedTraining) {
            return
        }

        const updatedItem: ManagedTrainingItem = {
            ...selectedTraining,
            formData: updatedFormData,
            record: buildCompanyTrainingRecord(updatedFormData, {
                id: selectedTraining.record.id,
                companyName: selectedTraining.record.companyName,
                companyLegalName: selectedTraining.record.companyLegalName,
                companyWebsite: selectedTraining.record.companyWebsite,
                imageSrc: selectedTraining.record.imageSrc,
                imageAlt: selectedTraining.record.imageAlt,
            }),
        }

        setTrainings((currentTrainings) =>
            currentTrainings.map((item) =>
                item.id === selectedTraining.id ? updatedItem : item,
            ),
        )
        setActivePanel({
            tab: "trainings",
            mode: "details",
            itemId: selectedTraining.id,
        })
    }

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-2xl font-bold leading-[1.3] text-black sm:text-[32px]">
                                وظائفي
                            </h1>
                            <p className="mt-4 mb-0 max-w-[40rem] text-size16 font-medium leading-[1.9] text-black sm:text-size20">
                                يمكنك مشاهدة جميع العروضات التي أضفتها سواء تدريب أو
                                توظيف ومتابعة حالتها لمعرفة ما إذا تم قبول أحد فيها
                                أو ما زالت معروضة.
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab={activeTab}
                            onChange={setActiveTab}
                            className="lg:pt-10"
                        />
                    </div>

                    <ReusableTable
                        data={activeTab === "jobs" ? jobs : trainings}
                        columns={activeTab === "jobs" ? jobColumns : trainingColumns}
                        showRowNumbers
                        primaryColor="#425a7a"
                        secondaryColor="#eef9fe"
                        bodyTextColor="#1f355d"
                        emptyText={
                            activeTab === "jobs"
                                ? "لا توجد وظائف منشورة حاليًا."
                                : "لا توجد تدريبات منشورة حاليًا."
                        }
                    />

                    {activePanel ? (
                        <div ref={panelRef} className="mt-10 sm:mt-12">
                            <div className="portal-category-card-shadow rounded-[22px] border border-[#deebf8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 sm:p-6">
                                <div className="flex flex-col gap-4 text-right sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="m-0 text-size22 font-bold text-[#233047] sm:text-size28">
                                            {activePanel.mode === "details"
                                                ? activePanel.tab === "jobs"
                                                    ? "تفاصيل الوظيفة"
                                                    : "تفاصيل التدريب"
                                                : activePanel.tab === "jobs"
                                                  ? "تعديل الوظيفة"
                                                  : "تعديل التدريب"}
                                        </h2>
                                        <p className="mt-2 mb-0 text-size15 leading-8 text-[#5d6979] sm:text-size16">
                                            {activePanel.mode === "details"
                                                ? "يمكنك مراجعة العرض الحالي كما سيظهر داخل المنصة، أو العودة لتعديله عند الحاجة."
                                                : "الفورم معبأ بالبيانات السابقة، ويمكنك تعديل ما تريد ثم حفظ التحديثات مباشرة."}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        {activePanel.mode === "details" ? (
                                            <Button
                                                type="button"
                                                variant="panel"
                                                size="normal"
                                                onClick={() =>
                                                    setActivePanel((currentPanel) =>
                                                        currentPanel
                                                            ? {
                                                                  ...currentPanel,
                                                                  mode: "edit",
                                                              }
                                                            : currentPanel,
                                                    )
                                                }
                                                className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-[var(--main-color)] bg-white !px-5 !py-3 !text-size15 !font-bold !text-[var(--main-color)] hover:!bg-[#f5f9ff]"
                                            >
                                                <PencilLine className="ml-3 size-5" />
                                                تعديل
                                            </Button>
                                        ) : null}

                                        <Button
                                            type="button"
                                            variant="panel"
                                            size="normal"
                                            onClick={() => setActivePanel(null)}
                                            className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-[#d6e1ef] bg-[#f7fbff] !px-5 !py-3 !text-size15 !font-bold !text-[#233047] hover:!bg-[#edf5ff]"
                                        >
                                            <X className="ml-3 size-5" />
                                            إغلاق
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {activePanel.mode === "details" && selectedJob ? (
                                <PortalJobDetailsSection
                                    title="تفاصيل الوظيفة"
                                    description="هذه هي النسخة الحالية من الوظيفة كما تظهر ضمن عروض الشركة داخل المنصة."
                                    job={selectedJob.record}
                                    showActions={false}
                                />
                            ) : null}

                            {activePanel.mode === "details" && selectedTraining ? (
                                <PortalTrainingDetailsSection
                                    title="تفاصيل التدريب"
                                    description="هذه هي النسخة الحالية من التدريب كما تظهر ضمن عروض الشركة داخل المنصة."
                                    training={selectedTraining.record}
                                />
                            ) : null}

                            {activePanel.mode === "edit" && selectedJob ? (
                                <PortalCompanyJobForm
                                    title="تعديل الوظيفة"
                                    description="يمكنك تحديث بيانات الوظيفة الحالية، ثم حفظ النسخة المعدلة لتظهر فورًا ضمن قائمة عروضك."
                                    initialValues={selectedJob.formData}
                                    resetValues={selectedJob.formData}
                                    submitLabel="حفظ التعديلات"
                                    resetLabel="استعادة البيانات الأصلية"
                                    submitAction="save"
                                    onSubmit={handleJobUpdate}
                                />
                            ) : null}

                            {activePanel.mode === "edit" && selectedTraining ? (
                                <PortalCompanyTrainingForm
                                    title="تعديل التدريب"
                                    description="يمكنك تحديث بيانات التدريب الحالي، ثم حفظ النسخة المعدلة لتظهر فورًا ضمن قائمة عروضك."
                                    initialValues={selectedTraining.formData}
                                    resetValues={selectedTraining.formData}
                                    submitLabel="حفظ التعديلات"
                                    resetLabel="استعادة البيانات الأصلية"
                                    submitAction="save"
                                    onSubmit={handleTrainingUpdate}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

function resolveTabFromPageId(pageId: string): PortalOpportunityTab {
    return pageId === "company-training-list" ? "trainings" : "jobs"
}

function createManagedJobItem({
    id,
    createdAt,
    statusLabel,
    statusTone,
    formData,
}: {
    id: string
    createdAt: string
    statusLabel: string
    statusTone: OpportunityStatusTone
    formData: CompanyJobFormData
}): ManagedJobItem {
    return {
        id,
        createdAt,
        statusLabel,
        statusTone,
        formData,
        record: buildCompanyJobRecord(formData, {
            id,
            companyName: "Google",
            companyLegalName: "Google LLC",
            companyWebsite: "GOOGLE.COM",
            imageAlt: "Google",
        }),
    }
}

function createManagedTrainingItem({
    id,
    createdAt,
    statusLabel,
    statusTone,
    formData,
}: {
    id: string
    createdAt: string
    statusLabel: string
    statusTone: OpportunityStatusTone
    formData: CompanyTrainingFormData
}): ManagedTrainingItem {
    return {
        id,
        createdAt,
        statusLabel,
        statusTone,
        formData,
        record: buildCompanyTrainingRecord(formData, {
            id,
            companyName: "Google",
            companyLegalName: "Google LLC",
            companyWebsite: "GOOGLE.COM",
            imageAlt: "Google",
        }),
    }
}

function compareStrings(leftValue: string, rightValue: string, direction: string) {
    const comparison = `${leftValue ?? ""}`.localeCompare(
        `${rightValue ?? ""}`,
        "ar",
    )

    return direction === "desc" ? comparison * -1 : comparison
}

function renderStatusBadge(label: string, tone: OpportunityStatusTone) {
    const toneClassName =
        tone === "success"
            ? "bg-[#edf8ef] text-[#2f8753]"
            : tone === "warning"
              ? "bg-[#fff6ea] text-[#c48019]"
              : "bg-[#eef4ff] text-[#2f5cb9]"

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
