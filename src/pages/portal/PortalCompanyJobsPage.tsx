import type { ReactNode } from "react"
import { Eye, PencilLine, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    mapCompanyJobFormDataToCreatePortalJobPayload,
    useDeletePortalJob,
    usePortalCompanyJob,
    usePortalCompanyJobs,
    usePortalJobCategories,
    useUpdatePortalJob,
} from "../../api/portalJobs"
import { usePortalAuthProfile } from "../../api/portalAuthProfile"
import companyImage from "../../assets/common/company_img.png"
import ReusableTable from "../../components/global/table/ReusableTable"
import { Button } from "../../components/global/ui/button"
import PortalCompanyJobForm from "../../components/portal/PortalCompanyJobForm"
import PortalJobDetailsSection from "../../components/portal/PortalJobDetailsSection"
import PortalOpportunityTabs from "../../components/portal/PortalOpportunityTabs"
import {
    jobRecordToCompanyJobFormData,
    type CompanyJobFormData,
} from "../../components/portal/companyForms/companyJobFormModel"
import type { PortalJobRecord } from "../../components/portal/portalJobsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyJobsPageProps {
    page: PortalPageDefinition
}

type OpportunityStatusTone = "success" | "warning" | "neutral"
type ManagementPanelMode = "details" | "edit"

interface ActivePanelState {
    mode: ManagementPanelMode
    itemId: string
}

interface CompanyJobTableRow {
    id: string
    date: string
    jobName: string
    location: string
    status: string
}

const opportunityTableRowBackgrounds = ["#63adc3", "#425a7a"]

export default function PortalCompanyJobsPage({
    page: _page,
}: PortalCompanyJobsPageProps) {
    const navigate = useNavigate()
    const panelRef = useRef<HTMLDivElement | null>(null)
    const [activePanel, setActivePanel] = useState<ActivePanelState | null>(null)

    const companyJobsQuery = usePortalCompanyJobs()
    const companyProfileQuery = usePortalAuthProfile("company")
    const jobCategoriesQuery = usePortalJobCategories()
    const deleteJobMutation = useDeletePortalJob()

    const rows = companyJobsQuery.jobs
    const resolvedActivePanel = useMemo(
        () =>
            activePanel && rows.some((job) => job.id === activePanel.itemId)
                ? activePanel
                : null,
        [activePanel, rows],
    )
    const updateJobMutation = useUpdatePortalJob(
        resolvedActivePanel?.itemId ?? null,
    )

    const selectedJobSummary = useMemo(
        () =>
            resolvedActivePanel
                ? rows.find((job) => job.id === resolvedActivePanel.itemId) ?? null
                : null,
        [resolvedActivePanel, rows],
    )

    const selectedJobFallback = useMemo<PortalJobRecord | null>(() => {
        if (!selectedJobSummary) {
            return null
        }

        const companyName =
            companyProfileQuery.profile?.name?.trim() || "شركتك"
        const companyLogoSrc = companyProfileQuery.profile?.avatarSrc || companyImage

        return {
            id: selectedJobSummary.id,
            companyName,
            jobTitle: selectedJobSummary.jobName,
            location: selectedJobSummary.location,
            category: "وظيفة",
            companyLegalName: companyName,
            companyWebsite: "الملف الحالي",
            imageSrc: companyLogoSrc,
            imageAlt: companyName,
            detailColumns: [[], [], []],
        }
    }, [companyProfileQuery.profile, selectedJobSummary])

    const selectedJobQuery = usePortalCompanyJob(
        selectedJobSummary?.id ?? null,
        selectedJobFallback,
    )

    const selectedJobRecord = selectedJobQuery.job

    const jobCategoryOptions = useMemo(
        () =>
            (jobCategoriesQuery.data?.data ?? [])
                .map((category) => category.name?.trim())
                .filter((categoryName): categoryName is string => Boolean(categoryName)),
        [jobCategoriesQuery.data],
    )

    useEffect(() => {
        if (resolvedActivePanel) {
            panelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [resolvedActivePanel])

    const columns = [
        {
            id: "date",
            header: "التاريخ",
            sortable: true,
            cell: (row: CompanyJobTableRow) => row.date,
            sortFn: (
                a: CompanyJobTableRow,
                b: CompanyJobTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.date, b.date, direction),
        },
        {
            id: "title",
            header: "الوظيفة",
            sortable: true,
            cell: (row: CompanyJobTableRow) => (
                <span className="font-semibold text-white">{row.jobName}</span>
            ),
            sortFn: (
                a: CompanyJobTableRow,
                b: CompanyJobTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.jobName, b.jobName, direction),
        },
        {
            id: "city",
            header: "المدينة",
            sortable: true,
            cell: (row: CompanyJobTableRow) => row.location,
            sortFn: (
                a: CompanyJobTableRow,
                b: CompanyJobTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.location, b.location, direction),
        },
        {
            id: "status",
            header: "الحالة",
            cell: (row: CompanyJobTableRow) =>
                renderStatusBadge(row.status, resolveStatusTone(row.status)),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: (row: CompanyJobTableRow) => (
                <div className="flex items-center justify-center gap-2.5">
                    <IconActionButton
                        label="عرض التفاصيل"
                        colorClassName="text-[#ffad32] hover:bg-white/12"
                        onClick={() =>
                            setActivePanel({
                                mode: "details",
                                itemId: row.id,
                            })
                        }
                    >
                        <Eye className="size-[18px]" />
                    </IconActionButton>

                    <IconActionButton
                        label="تعديل الوظيفة"
                        colorClassName="text-[#56c176] hover:bg-white/12"
                        onClick={() =>
                            setActivePanel({
                                mode: "edit",
                                itemId: row.id,
                            })
                        }
                    >
                        <PencilLine className="size-[18px]" />
                    </IconActionButton>

                    <IconActionButton
                        label="حذف الوظيفة"
                        colorClassName="text-[#ff6a61] hover:bg-white/12"
                        onClick={() => {
                            void handleDeleteJob(row.id)
                        }}
                    >
                        <Trash2 className="size-[18px]" />
                    </IconActionButton>
                </div>
            ),
        },
    ]

    async function handleDeleteJob(jobId: string) {
        const shouldDelete = window.confirm("هل تريد حذف هذه الوظيفة من القائمة؟")

        if (!shouldDelete) {
            return
        }

        await deleteJobMutation.mutateAsync(`/jobs/${encodeURIComponent(jobId)}`)

        setActivePanel((currentPanel) =>
            currentPanel?.itemId === jobId ? null : currentPanel,
        )
    }

    async function handleJobUpdate(formData: CompanyJobFormData) {
        if (!resolvedActivePanel?.itemId) {
            return
        }

        await updateJobMutation.mutateAsync(
            mapCompanyJobFormDataToCreatePortalJobPayload(formData),
        )

        setActivePanel({
            mode: "details",
            itemId: resolvedActivePanel.itemId,
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
                                يمكنك هنا متابعة الوظائف التي نشرتها، واستعراض
                                تفاصيلها، ثم تعديلها أو حذفها عند الحاجة.
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab="jobs"
                            onChange={(nextTab) => {
                                if (nextTab === "trainings") {
                                    navigate("/company/trainings")
                                    return
                                }

                                navigate("/company/jobs")
                            }}
                            className="lg:pt-10"
                        />
                    </div>

                    <ReusableTable
                        data={rows}
                        columns={columns}
                        showRowNumbers
                        isLoading={companyJobsQuery.isLoading}
                        loadingText="جاري تحميل وظائف الشركة..."
                        primaryColor="#425a7a"
                        secondaryColor="#f2fbff"
                        rowBackgrounds={opportunityTableRowBackgrounds}
                        textColor="#ffffff"
                        bodyTextColor="#ffffff"
                        emptyText={
                            companyJobsQuery.isError
                                ? "تعذر تحميل وظائف الشركة حالياً. حاول تحديث الصفحة ثم أعد المحاولة."
                                : "لا توجد وظائف منشورة لشركتك حالياً."
                        }
                    />

                    {resolvedActivePanel ? (
                        <div ref={panelRef} className="mt-10 sm:mt-12">
                            <div className="portal-category-card-shadow rounded-[22px] border border-[#deebf8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 sm:p-6">
                                <div className="flex flex-col gap-4 text-right sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="m-0 text-size22 font-bold text-[#233047] sm:text-size28">
                                            {resolvedActivePanel.mode === "details"
                                                ? "تفاصيل الوظيفة"
                                                : "تعديل الوظيفة"}
                                        </h2>
                                        <p className="mt-2 mb-0 text-size15 leading-8 text-[#5d6979] sm:text-size16">
                                            {resolvedActivePanel.mode === "details"
                                                ? "يمكنك مراجعة تفاصيل الوظيفة الحالية كما تظهر ضمن حساب الشركة."
                                                : "الفورم معبأ ببيانات الوظيفة الحالية، ويمكنك تعديل ما تريد ثم حفظ التغييرات."}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        {resolvedActivePanel.mode === "details" ? (
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

                            {selectedJobQuery.isLoading ? (
                                <InfoPanelCard>
                                    جاري تحميل تفاصيل الوظيفة...
                                </InfoPanelCard>
                            ) : null}

                            {selectedJobQuery.isError ? (
                                <InfoPanelCard>
                                    تعذر تحميل تفاصيل الوظيفة حالياً. حاول مرة
                                    أخرى بعد قليل.
                                </InfoPanelCard>
                            ) : null}

                            {!selectedJobQuery.isLoading &&
                            !selectedJobQuery.isError &&
                            resolvedActivePanel.mode === "details" &&
                            selectedJobRecord ? (
                                <PortalJobDetailsSection
                                    title="تفاصيل الوظيفة"
                                    description="هذه هي النسخة الحالية من الوظيفة كما تظهر ضمن عروض الشركة داخل المنصة."
                                    job={selectedJobRecord}
                                    showActions={false}
                                />
                            ) : null}

                            {!selectedJobQuery.isLoading &&
                            !selectedJobQuery.isError &&
                            resolvedActivePanel.mode === "edit" &&
                            selectedJobRecord ? (
                                <PortalCompanyJobForm
                                    title="تعديل الوظيفة"
                                    description="يمكنك تحديث بيانات الوظيفة الحالية، ثم حفظ النسخة المعدلة لتظهر فوراً ضمن قائمة عروضك."
                                    initialValues={jobRecordToCompanyJobFormData(
                                        selectedJobRecord,
                                    )}
                                    resetValues={jobRecordToCompanyJobFormData(
                                        selectedJobRecord,
                                    )}
                                    submitLabel="حفظ التعديلات"
                                    resetLabel="استعادة البيانات الأصلية"
                                    submitAction="save"
                                    isSubmitting={updateJobMutation.isPending}
                                    mode="backend-constrained"
                                    categoryOptions={jobCategoryOptions}
                                    isCategoryOptionsLoading={jobCategoriesQuery.isLoading}
                                    categoryOptionsErrorMessage={
                                        jobCategoriesQuery.isError
                                            ? "تعذر تحميل التصنيفات من الخادم. حاول تحديث الصفحة ثم أعد المحاولة."
                                            : undefined
                                    }
                                    onSubmit={handleJobUpdate}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}

function compareStrings(
    leftValue: string,
    rightValue: string,
    direction: "asc" | "desc",
) {
    const comparison = `${leftValue ?? ""}`.localeCompare(
        `${rightValue ?? ""}`,
        "ar",
    )

    return direction === "desc" ? comparison * -1 : comparison
}

function resolveStatusTone(status: string): OpportunityStatusTone {
    const normalizedStatus = status.trim().toLowerCase()

    if (
        normalizedStatus.includes("تم") ||
        normalizedStatus.includes("مقبول") ||
        normalizedStatus.includes("نشط") ||
        normalizedStatus.includes("active")
    ) {
        return "success"
    }

    if (
        normalizedStatus.includes("مراج") ||
        normalizedStatus.includes("انتظار") ||
        normalizedStatus.includes("pending")
    ) {
        return "warning"
    }

    return "neutral"
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

function InfoPanelCard({ children }: { children: ReactNode }) {
    return (
        <div className="portal-category-card-shadow mt-6 rounded-[22px] border border-[#deebf8] bg-white p-6 text-right text-size16 font-medium leading-8 text-[#4d5a6c]">
            {children}
        </div>
    )
}
