import type { ReactNode } from "react"
import { Eye, PencilLine, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { usePortalAuthProfile } from "../../api/portalAuthProfile"
import { usePortalJobCategories } from "../../api/portalJobs"
import {
    mapCompanyTrainingFormDataToCreatePortalTrainingPayload,
    useDeletePortalTraining,
    usePortalCompanyTraining,
    usePortalCompanyTrainings,
    useUpdatePortalTraining,
} from "../../api/portalTrainings"
import companyImage from "../../assets/common/company_img.png"
import ReusableTable from "../../components/global/table/ReusableTable"
import { Button } from "../../components/global/ui/button"
import PortalCompanyTrainingForm from "../../components/portal/PortalCompanyTrainingForm"
import PortalDeleteConfirmDialog from "../../components/portal/PortalDeleteConfirmDialog"
import PortalOpportunityTabs from "../../components/portal/PortalOpportunityTabs"
import PortalTrainingDetailsSection from "../../components/portal/PortalTrainingDetailsSection"
import {
    buildCompanyTrainingRecord,
    trainingRecordToCompanyTrainingFormData,
    type CompanyTrainingFormData,
} from "../../components/portal/companyForms/companyTrainingFormModel"
import type { PortalTrainingRecord } from "../../components/portal/portalTrainingsData"
import type { PortalPageDefinition } from "../../router/portalPages"

interface PortalCompanyTrainingsPageProps {
    page: PortalPageDefinition
}

type OpportunityStatusTone = "success" | "warning" | "neutral"
type ManagementPanelMode = "details" | "edit"

interface ActivePanelState {
    mode: ManagementPanelMode
    itemId: string
}

interface CompanyTrainingTableRow {
    id: string
    date: string
    trainingName: string
    location: string
    status: string
}

const opportunityTableRowBackgrounds = ["#63adc3", "#425a7a"]

export default function PortalCompanyTrainingsPage({
    page: _page,
}: PortalCompanyTrainingsPageProps) {
    const navigate = useNavigate()
    const panelRef = useRef<HTMLDivElement | null>(null)
    const [activePanel, setActivePanel] = useState<ActivePanelState | null>(null)
    const [pendingDeleteTrainingId, setPendingDeleteTrainingId] = useState<
        string | null
    >(null)

    const companyTrainingsQuery = usePortalCompanyTrainings()
    const companyProfileQuery = usePortalAuthProfile("company")
    const jobCategoriesQuery = usePortalJobCategories()
    const deleteTrainingMutation = useDeletePortalTraining()

    const rows = companyTrainingsQuery.trainings
    const resolvedActivePanel = useMemo(
        () =>
            activePanel && rows.some((training) => training.id === activePanel.itemId)
                ? activePanel
                : null,
        [activePanel, rows],
    )
    const updateTrainingMutation = useUpdatePortalTraining(
        resolvedActivePanel?.itemId ?? null,
    )

    const selectedTrainingSummary = useMemo(
        () =>
            resolvedActivePanel
                ? rows.find((training) => training.id === resolvedActivePanel.itemId) ??
                  null
                : null,
        [resolvedActivePanel, rows],
    )

    const selectedTrainingFallback = useMemo<PortalTrainingRecord | null>(() => {
        if (!selectedTrainingSummary) {
            return null
        }

        const companyName =
            companyProfileQuery.profile?.name?.trim() || "شركتك"
        const companyLogoSrc = companyProfileQuery.profile?.avatarSrc || companyImage

        return buildCompanyTrainingRecord(
            {
                trainingCategory: "",
                trainingTitle: selectedTrainingSummary.trainingName,
                traineeLevel: "",
                trainingDuration: "",
                trainingSchedule: "",
                trainingReward: "",
                trainingLocation: selectedTrainingSummary.location,
                aboutTraining: "",
                responsibilities: "",
                skills: "",
                conditions: "",
            },
            {
                id: selectedTrainingSummary.id,
                companyName,
                companyLegalName: companyName,
                companyWebsite: "الملف الحالي",
                imageSrc: companyLogoSrc,
                imageAlt: companyName,
            },
        )
    }, [companyProfileQuery.profile, selectedTrainingSummary])

    const selectedTrainingQuery = usePortalCompanyTraining(
        selectedTrainingSummary?.id ?? null,
        selectedTrainingFallback,
    )

    const selectedTrainingRecord = selectedTrainingQuery.training

    const trainingCategoryOptions = useMemo(
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
            cell: (row: CompanyTrainingTableRow) => row.date,
            sortFn: (
                a: CompanyTrainingTableRow,
                b: CompanyTrainingTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.date, b.date, direction),
        },
        {
            id: "title",
            header: "التدريب",
            sortable: true,
            cell: (row: CompanyTrainingTableRow) => (
                <span className="font-semibold text-white">
                    {row.trainingName}
                </span>
            ),
            sortFn: (
                a: CompanyTrainingTableRow,
                b: CompanyTrainingTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.trainingName, b.trainingName, direction),
        },
        {
            id: "city",
            header: "المكان",
            sortable: true,
            cell: (row: CompanyTrainingTableRow) => row.location,
            sortFn: (
                a: CompanyTrainingTableRow,
                b: CompanyTrainingTableRow,
                direction: "asc" | "desc",
            ) => compareStrings(a.location, b.location, direction),
        },
        {
            id: "status",
            header: "الحالة",
            cell: (row: CompanyTrainingTableRow) =>
                renderStatusBadge(row.status, resolveStatusTone(row.status)),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: (row: CompanyTrainingTableRow) => (
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
                        label="تعديل التدريب"
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
                        label="حذف التدريب"
                        colorClassName="text-[#ff6a61] hover:bg-white/12"
                        onClick={() => setPendingDeleteTrainingId(row.id)}
                    >
                        <Trash2 className="size-[18px]" />
                    </IconActionButton>
                </div>
            ),
        },
    ]

    async function handleDeleteTraining(trainingId: string) {
        await deleteTrainingMutation.mutateAsync(
            `/trainings/${encodeURIComponent(trainingId)}`,
        )

        setActivePanel((currentPanel) =>
            currentPanel?.itemId === trainingId ? null : currentPanel,
        )
        setPendingDeleteTrainingId(null)
    }

    async function handleTrainingUpdate(formData: CompanyTrainingFormData) {
        if (!resolvedActivePanel?.itemId) {
            return
        }

        await updateTrainingMutation.mutateAsync(
            mapCompanyTrainingFormDataToCreatePortalTrainingPayload(formData),
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
                                تدريباتي
                            </h1>
                            <p className="mt-4 mb-0 max-w-[40rem] text-size16 font-medium leading-[1.9] text-black sm:text-size20">
                                يمكنك هنا متابعة التدريبات التي نشرتها شركتك،
                                واستعراض تفاصيلها، ثم تعديلها أو حذفها بسهولة.
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab="trainings"
                            onChange={(nextTab) => {
                                if (nextTab === "jobs") {
                                    navigate("/company/jobs")
                                    return
                                }

                                navigate("/company/trainings")
                            }}
                            className="lg:pt-10"
                        />
                    </div>

                    <ReusableTable
                        data={rows}
                        columns={columns}
                        showRowNumbers
                        isLoading={companyTrainingsQuery.isLoading}
                        loadingText="جاري تحميل تدريبات الشركة..."
                        primaryColor="#425a7a"
                        secondaryColor="#f2fbff"
                        rowBackgrounds={opportunityTableRowBackgrounds}
                        textColor="#ffffff"
                        bodyTextColor="#ffffff"
                        emptyText={
                            companyTrainingsQuery.isError
                                ? "تعذر تحميل تدريبات الشركة حالياً. حاول تحديث الصفحة ثم أعد المحاولة."
                                : "لا توجد تدريبات منشورة لشركتك حالياً."
                        }
                    />

                    {resolvedActivePanel ? (
                        <div ref={panelRef} className="mt-10 sm:mt-12">
                            <div className="portal-category-card-shadow rounded-[22px] border border-[#deebf8] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 sm:p-6">
                                <div className="flex flex-col gap-4 text-right sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="m-0 text-size22 font-bold text-[#233047] sm:text-size28">
                                            {resolvedActivePanel.mode === "details"
                                                ? "تفاصيل التدريب"
                                                : "تعديل التدريب"}
                                        </h2>
                                        <p className="mt-2 mb-0 text-size15 leading-8 text-[#5d6979] sm:text-size16">
                                            {resolvedActivePanel.mode === "details"
                                                ? "يمكنك مراجعة تفاصيل التدريب الحالي كما يظهر ضمن حساب الشركة."
                                                : "الفورم معبأ ببيانات التدريب الحالي، ويمكنك تعديل ما تريد ثم حفظ التغييرات."}
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

                            {selectedTrainingQuery.isLoading ? (
                                <InfoPanelCard>
                                    جاري تحميل تفاصيل التدريب...
                                </InfoPanelCard>
                            ) : null}

                            {selectedTrainingQuery.isError ? (
                                <InfoPanelCard>
                                    تعذر تحميل تفاصيل التدريب حالياً. حاول مرة
                                    أخرى بعد قليل.
                                </InfoPanelCard>
                            ) : null}

                            {!selectedTrainingQuery.isLoading &&
                            !selectedTrainingQuery.isError &&
                            resolvedActivePanel.mode === "details" &&
                            selectedTrainingRecord ? (
                                <PortalTrainingDetailsSection
                                    title="تفاصيل التدريب"
                                    description="هذه هي النسخة الحالية من التدريب كما تظهر ضمن عروض الشركة داخل المنصة."
                                    training={selectedTrainingRecord}
                                />
                            ) : null}

                            {!selectedTrainingQuery.isLoading &&
                            !selectedTrainingQuery.isError &&
                            resolvedActivePanel.mode === "edit" &&
                            selectedTrainingRecord ? (
                                <PortalCompanyTrainingForm
                                    title="تعديل التدريب"
                                    description="يمكنك تحديث بيانات التدريب الحالي، ثم حفظ النسخة المعدلة لتظهر فوراً ضمن قائمة عروضك."
                                    initialValues={trainingRecordToCompanyTrainingFormData(
                                        selectedTrainingRecord,
                                    )}
                                    resetValues={trainingRecordToCompanyTrainingFormData(
                                        selectedTrainingRecord,
                                    )}
                                    submitLabel="حفظ التعديلات"
                                    resetLabel="استعادة البيانات الأصلية"
                                    submitAction="save"
                                    isSubmitting={updateTrainingMutation.isPending}
                                    mode="backend-constrained"
                                    categoryOptions={trainingCategoryOptions}
                                    isCategoryOptionsLoading={jobCategoriesQuery.isLoading}
                                    categoryOptionsErrorMessage={
                                        jobCategoriesQuery.isError
                                            ? "تعذر تحميل التصنيفات من الخادم. حاول تحديث الصفحة ثم أعد المحاولة."
                                            : undefined
                                    }
                                    onSubmit={handleTrainingUpdate}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <PortalDeleteConfirmDialog
                open={Boolean(pendingDeleteTrainingId)}
                title="حذف التدريب؟"
                description="سيتم حذف هذا التدريب من القائمة. لا يمكن التراجع عن هذه العملية بعد التأكيد."
                confirmLabel="حذف التدريب"
                isDeleting={deleteTrainingMutation.isPending}
                onOpenChange={(open) => {
                    if (!open && !deleteTrainingMutation.isPending) {
                        setPendingDeleteTrainingId(null)
                    }
                }}
                onConfirm={() => {
                    if (pendingDeleteTrainingId) {
                        return handleDeleteTraining(pendingDeleteTrainingId)
                    }
                }}
            />
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
