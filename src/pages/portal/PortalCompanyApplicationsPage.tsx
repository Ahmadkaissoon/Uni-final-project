import type { ReactNode } from "react"
import { Eye, FileText } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import axiosClient from "../../api/axiosClient"
import {
    type PortalApplicationAcceptancePayload,
    type PortalCompanyApplicationSummaryItem,
    useAcceptPortalCompanyJobApplication,
    useAcceptPortalCompanyTrainingApplication,
    usePortalCompanyJobApplication,
    usePortalCompanyJobApplications,
    usePortalCompanyTrainingApplication,
    usePortalCompanyTrainingApplications,
    useRejectPortalCompanyJobApplication,
    useRejectPortalCompanyTrainingApplication,
} from "../../api/portalApplications"
import ReusableTable from "../../components/global/table/ReusableTable"
import PortalInterviewScheduleModal, {
    type PortalInterviewScheduleValues,
} from "../../components/portal/PortalInterviewScheduleModal"
import PortalOpportunityTabs, {
    type PortalOpportunityTab,
} from "../../components/portal/PortalOpportunityTabs"
import PortalProfileEditor from "../../components/portal/PortalProfileEditor"
import type { PortalPageDefinition } from "../../router/portalPages"
import { personProfileEditorConfig } from "../../utils/portalProfileSchemas"

interface PortalCompanyApplicationsPageProps {
    page: PortalPageDefinition
}

type ApplicationStatusTone = "success" | "warning" | "error"

const applicationRowBackgrounds = ["#63adc3", "#425a7a"]

export default function PortalCompanyApplicationsPage({
    page,
}: PortalCompanyApplicationsPageProps) {
    const navigate = useNavigate()
    const activeTab = resolveTabFromPageId(page.id)
    const [selectedApplicationId, setSelectedApplicationId] = useState<
        string | null
    >(null)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const profilePanelRef = useRef<HTMLDivElement | null>(null)

    const jobApplicationsQuery = usePortalCompanyJobApplications(
        activeTab === "jobs",
    )
    const trainingApplicationsQuery = usePortalCompanyTrainingApplications(
        activeTab === "trainings",
    )

    const currentApplications =
        activeTab === "jobs"
            ? jobApplicationsQuery.applications
            : trainingApplicationsQuery.applications

    const resolvedSelectedApplicationId = useMemo(
        () =>
            selectedApplicationId &&
            currentApplications.some(
                (application) => application.id === selectedApplicationId,
            )
                ? selectedApplicationId
                : null,
        [currentApplications, selectedApplicationId],
    )

    const selectedApplicationSummary = useMemo(
        () =>
            resolvedSelectedApplicationId
                ? currentApplications.find(
                      (application) =>
                          application.id === resolvedSelectedApplicationId,
                  ) ?? null
                : null,
        [currentApplications, resolvedSelectedApplicationId],
    )

    const selectedJobApplicationQuery = usePortalCompanyJobApplication(
        activeTab === "jobs" ? resolvedSelectedApplicationId : null,
        activeTab === "jobs",
    )
    const selectedTrainingApplicationQuery = usePortalCompanyTrainingApplication(
        activeTab === "trainings" ? resolvedSelectedApplicationId : null,
        activeTab === "trainings",
    )

    const selectedApplicationDetail =
        activeTab === "jobs"
            ? selectedJobApplicationQuery.application
            : selectedTrainingApplicationQuery.application
    const isSelectedApplicationLoading =
        activeTab === "jobs"
            ? selectedJobApplicationQuery.isLoading
            : selectedTrainingApplicationQuery.isLoading
    const isSelectedApplicationError =
        activeTab === "jobs"
            ? selectedJobApplicationQuery.isError
            : selectedTrainingApplicationQuery.isError

    const acceptJobMutation = useAcceptPortalCompanyJobApplication(
        activeTab === "jobs" ? resolvedSelectedApplicationId : null,
    )
    const rejectJobMutation = useRejectPortalCompanyJobApplication(
        activeTab === "jobs" ? resolvedSelectedApplicationId : null,
    )
    const acceptTrainingMutation = useAcceptPortalCompanyTrainingApplication(
        activeTab === "trainings" ? resolvedSelectedApplicationId : null,
    )
    const rejectTrainingMutation = useRejectPortalCompanyTrainingApplication(
        activeTab === "trainings" ? resolvedSelectedApplicationId : null,
    )

    const isDecisionPending =
        activeTab === "jobs"
            ? acceptJobMutation.isPending || rejectJobMutation.isPending
            : acceptTrainingMutation.isPending ||
              rejectTrainingMutation.isPending

    useEffect(() => {
        if (resolvedSelectedApplicationId) {
            profilePanelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [resolvedSelectedApplicationId])

    const columns = buildApplicationColumns(
        handleOpenCvPreview,
        (row) => setSelectedApplicationId(row.id),
    )

    const currentListQuery =
        activeTab === "jobs" ? jobApplicationsQuery : trainingApplicationsQuery

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
                                يمكنك مشاهدة جميع الطلبات التي أُرسلت إلى شركتك،
                                سواء على الوظائف أو فرص التدريب، مع مراجعة الملف
                                الشخصي للمتقدم، وفتح السيرة الذاتية، ثم قبول
                                الطلب أو رفضه مباشرة.
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab={activeTab}
                            jobsLabel="طلبات توظيف"
                            trainingsLabel="طلبات تدريب"
                            onChange={handleTabChange}
                            className="lg:pt-10"
                        />
                    </div>

                    <ReusableTable
                        data={currentApplications}
                        columns={columns}
                        showRowNumbers
                        isLoading={currentListQuery.isLoading}
                        loadingText={
                            activeTab === "jobs"
                                ? "جاري تحميل طلبات التوظيف..."
                                : "جاري تحميل طلبات التدريب..."
                        }
                        primaryColor="#425a7a"
                        secondaryColor="#f2fbff"
                        rowBackgrounds={applicationRowBackgrounds}
                        textColor="#ffffff"
                        bodyTextColor="#ffffff"
                        emptyText={
                            currentListQuery.isError
                                ? activeTab === "jobs"
                                    ? "تعذر تحميل طلبات التوظيف حاليًا. حاول تحديث الصفحة ثم أعد المحاولة."
                                    : "تعذر تحميل طلبات التدريب حاليًا. حاول تحديث الصفحة ثم أعد المحاولة."
                                : activeTab === "jobs"
                                  ? "لا توجد طلبات توظيف حاليًا."
                                  : "لا توجد طلبات تدريب حاليًا."
                        }
                    />

                    {resolvedSelectedApplicationId ? (
                        <div ref={profilePanelRef} className="mt-10 sm:mt-12">
                            {isSelectedApplicationLoading ? (
                                <InfoPanelCard>
                                    جاري تحميل بيانات المتقدم...
                                </InfoPanelCard>
                            ) : null}

                            {isSelectedApplicationError ? (
                                <InfoPanelCard>
                                    تعذر تحميل تفاصيل الطلب حاليًا. حاول مرة أخرى
                                    بعد قليل.
                                </InfoPanelCard>
                            ) : null}

                            {!isSelectedApplicationLoading &&
                            !isSelectedApplicationError &&
                            selectedApplicationDetail ? (
                                <PortalProfileEditor
                                    key={selectedApplicationDetail.id}
                                    config={personProfileEditorConfig}
                                    mode="readonly"
                                    useContainer={false}
                                    showPageTitleBadge={false}
                                    initialValues={
                                        selectedApplicationDetail.profileData
                                    }
                                    initialAvatarSrc={
                                        selectedApplicationDetail.avatarSrc
                                    }
                                    entityLabelOverride={
                                        activeTab === "jobs"
                                            ? "باحث عن عمل"
                                            : "متقدّم على تدريب"
                                    }
                                    pageDescriptionOverride="هذا هو الملف الشخصي للمتقدم داخل المنصة"
                                    topActions={
                                        <>
                                            <button
                                                type="button"
                                                disabled={
                                                    isDecisionPending ||
                                                    !selectedApplicationDetail
                                                }
                                                onClick={() =>
                                                    setIsScheduleModalOpen(true)
                                                }
                                                className={[
                                                    "inline-flex min-h-[48px] min-w-[128px] items-center justify-center rounded-full px-6 py-3 text-size16 font-bold text-white shadow-[0_12px_26px_rgba(17,45,96,0.12)] transition duration-200",
                                                    isDecisionPending
                                                        ? "cursor-not-allowed bg-[#8fc2a0] opacity-80"
                                                        : "cursor-pointer bg-[#56a76b] hover:-translate-y-0.5",
                                                ].join(" ")}
                                            >
                                                {activeTab === "jobs" &&
                                                acceptJobMutation.isPending
                                                    ? "جارٍ القبول..."
                                                    : activeTab === "trainings" &&
                                                        acceptTrainingMutation.isPending
                                                      ? "جارٍ القبول..."
                                                      : "قبول"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    isDecisionPending ||
                                                    !selectedApplicationDetail
                                                }
                                                onClick={() => {
                                                    void handleRejectCurrentApplication()
                                                }}
                                                className={[
                                                    "inline-flex min-h-[48px] min-w-[128px] items-center justify-center rounded-full border px-6 py-3 text-size16 font-bold transition duration-200",
                                                    isDecisionPending
                                                        ? "cursor-not-allowed border-[#ecb7b4] bg-white text-[#d99995] opacity-80"
                                                        : "cursor-pointer border-[#d9534f] bg-white text-[#d9534f] hover:bg-[#fff4f3]",
                                                ].join(" ")}
                                            >
                                                {activeTab === "jobs" &&
                                                rejectJobMutation.isPending
                                                    ? "جارٍ الرفض..."
                                                    : activeTab === "trainings" &&
                                                        rejectTrainingMutation.isPending
                                                      ? "جارٍ الرفض..."
                                                      : "رفض"}
                                            </button>
                                        </>
                                    }
                                />
                            ) : null}
                        </div>
                    ) : null}

                    <PortalInterviewScheduleModal
                        key={selectedApplicationDetail?.id ?? activeTab}
                        open={isScheduleModalOpen}
                        onOpenChange={setIsScheduleModalOpen}
                        onSubmit={handleScheduleSubmit}
                        applicantName={
                            selectedApplicationDetail?.applicantName ??
                            selectedApplicationSummary?.applicantName
                        }
                    />
                </div>
            </div>
        </section>
    )

    function handleTabChange(nextTab: PortalOpportunityTab) {
        if (nextTab === activeTab) {
            return
        }

        setSelectedApplicationId(null)
        setIsScheduleModalOpen(false)
        navigate(
            nextTab === "jobs"
                ? "/company/applications"
                : "/company/trainings/applications",
        )
    }

    async function handleOpenCvPreview(row: PortalCompanyApplicationSummaryItem) {
        const resolvedCvUrl =
            row.cvUrl ??
            (row.id === selectedApplicationDetail?.id
                ? selectedApplicationDetail.cvUrl
                : null)

        if (!resolvedCvUrl) {
            toast.error("لم يتم رفع سيرة ذاتية لهذا الطلب بعد.")
            return
        }

        try {
            const response = await axiosClient.get<Blob>(resolvedCvUrl, {
                responseType: "blob",
            })
            const fileUrl = window.URL.createObjectURL(response.data)

            window.open(fileUrl, "_blank", "noopener,noreferrer")
            window.setTimeout(() => {
                window.URL.revokeObjectURL(fileUrl)
            }, 60_000)
        } catch {
            toast.error("تعذر فتح السيرة الذاتية حالياً.")
        }
    }

    async function handleRejectCurrentApplication() {
        if (!resolvedSelectedApplicationId) {
            return
        }

        try {
            if (activeTab === "jobs") {
                await rejectJobMutation.mutateAsync({})
            } else {
                await rejectTrainingMutation.mutateAsync({})
            }
        } catch {
            return
        }
    }

    async function handleScheduleSubmit(
        values: PortalInterviewScheduleValues,
    ) {
        if (!resolvedSelectedApplicationId) {
            return
        }

        const payload = mapScheduleValuesToAcceptancePayload(values)

        try {
            if (activeTab === "jobs") {
                await acceptJobMutation.mutateAsync(payload)
            } else {
                await acceptTrainingMutation.mutateAsync(payload)
            }

            setIsScheduleModalOpen(false)
        } catch {
            return
        }
    }
}

function buildApplicationColumns(
    onOpenCv: (row: PortalCompanyApplicationSummaryItem) => void,
    onOpenProfile: (row: PortalCompanyApplicationSummaryItem) => void,
) {
    return [
        {
            id: "applicantName",
            header: "الاسم",
            sortable: true,
            value: "applicantName",
            cell: (row: PortalCompanyApplicationSummaryItem) => (
                <span className="font-bold text-white">{row.applicantName}</span>
            ),
            sortFn: (
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
                direction: string,
            ) => compareStrings(a.applicantName, b.applicantName, direction),
        },
        {
            id: "submittedAt",
            header: "التاريخ",
            sortable: true,
            value: "submittedAt",
            cell: (row: PortalCompanyApplicationSummaryItem) => row.submittedAt,
            sortFn: (
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
                direction: string,
            ) => compareDates(a.submittedAtRaw, b.submittedAtRaw, direction),
        },
        {
            id: "opportunityTitle",
            header: "الفرصة",
            sortable: true,
            value: "opportunityTitle",
            cell: (row: PortalCompanyApplicationSummaryItem) => (
                <span className="font-semibold text-white">
                    {row.opportunityTitle}
                </span>
            ),
            sortFn: (
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
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
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
                direction: string,
            ) => compareStrings(a.city, b.city, direction),
        },
        {
            id: "matchRate",
            header: "نسبة تحقق الشروط",
            sortable: true,
            value: "matchRate",
            cell: (row: PortalCompanyApplicationSummaryItem) => (
                <span className="text-size18 font-extrabold text-[#ff9f1a]">
                    {row.matchRate !== null ? `${row.matchRate}%` : "—"}
                </span>
            ),
            sortFn: (
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
                direction: string,
            ) => compareNumbers(a.matchRate, b.matchRate, direction),
        },
        {
            id: "status",
            header: "الحالة",
            sortable: true,
            value: "statusLabel",
            cell: (row: PortalCompanyApplicationSummaryItem) =>
                renderStatusBadge(
                    row.statusLabel,
                    resolveStatusTone(row.statusLabel),
                ),
            sortFn: (
                a: PortalCompanyApplicationSummaryItem,
                b: PortalCompanyApplicationSummaryItem,
                direction: string,
            ) => compareStrings(a.statusLabel, b.statusLabel, direction),
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: (row: PortalCompanyApplicationSummaryItem) => (
                <div className="flex items-center justify-center gap-2.5">
                    <IconActionButton
                        label="عرض السيرة الذاتية"
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

function mapScheduleValuesToAcceptancePayload(
    values: PortalInterviewScheduleValues,
): PortalApplicationAcceptancePayload {
    const isRemoteMeeting = values.meetingMode === "remote"

    return {
        meetingType: isRemoteMeeting ? "online" : "offline",
        date: values.scheduledDate,
        time: values.scheduledTime,
        meetingLink: isRemoteMeeting ? values.meetingLink.trim() : undefined,
    }
}

function compareStrings(leftValue: string, rightValue: string, direction: string) {
    const comparison = `${leftValue ?? ""}`.localeCompare(
        `${rightValue ?? ""}`,
        "ar",
    )

    return direction === "desc" ? comparison * -1 : comparison
}

function compareDates(leftValue: string, rightValue: string, direction: string) {
    const leftDate = leftValue ? new Date(leftValue).getTime() : 0
    const rightDate = rightValue ? new Date(rightValue).getTime() : 0
    const comparison = leftDate - rightDate

    return direction === "desc" ? comparison * -1 : comparison
}

function compareNumbers(
    leftValue: number | null,
    rightValue: number | null,
    direction: string,
) {
    const leftNumber = leftValue ?? -1
    const rightNumber = rightValue ?? -1
    const comparison = leftNumber - rightNumber

    return direction === "desc" ? comparison * -1 : comparison
}

function resolveStatusTone(status: string): ApplicationStatusTone {
    const normalizedStatus = status.trim().toLowerCase()

    if (
        normalizedStatus.includes("مقبول") ||
        normalizedStatus.includes("accepted")
    ) {
        return "success"
    }

    if (
        normalizedStatus.includes("مراج") ||
        normalizedStatus.includes("انتظار") ||
        normalizedStatus.includes("pending") ||
        normalizedStatus.includes("review")
    ) {
        return "warning"
    }

    return "error"
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

function InfoPanelCard({ children }: { children: ReactNode }) {
    return (
        <div className="portal-category-card-shadow rounded-[22px] border border-[#deebf8] bg-white p-6 text-right text-size16 font-medium leading-8 text-[#4d5a6c]">
            {children}
        </div>
    )
}
