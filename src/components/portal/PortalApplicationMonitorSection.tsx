import { useMemo, useState } from "react"
import { CircleAlert, Eye } from "lucide-react"
import { Link } from "react-router-dom"

import type { PortalSeekerApplicationMonitorItem } from "../../api/portalApplications"
import { cn } from "../../utils/cn"
import Loader from "../global/loader/Loader"
import ReusableTable from "../global/table/ReusableTable"
import PortalOpportunityTabs, {
    type PortalOpportunityTab,
} from "./PortalOpportunityTabs"

type ApplicationKind = PortalOpportunityTab
type ApplicationStatus = "rejected" | "accepted" | "under_review"

interface PortalApplicationMonitorSectionProps {
    jobApplications?: PortalSeekerApplicationMonitorItem[]
    trainingApplications?: PortalSeekerApplicationMonitorItem[]
    isLoadingJobs?: boolean
    isLoadingTrainings?: boolean
    isErrorJobs?: boolean
    isErrorTrainings?: boolean
}

const statusConfig: Record<
    ApplicationStatus,
    { label: string; className: string; actionClassName: string }
> = {
    rejected: {
        label: "مرفوضة",
        className:
            "border border-[#f4c8cf] bg-[#fff3f5] text-[#c54b5f] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.3)]",
        actionClassName: "border-[#d5a10f] text-[#d5a10f]",
    },
    accepted: {
        label: "مقبول",
        className:
            "border border-[#c6ead4] bg-[#eefcf3] text-[#3d8e58] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.4)]",
        actionClassName: "border-[#c9c91a] text-[#c9c91a]",
    },
    under_review: {
        label: "قيد العرض",
        className:
            "border border-[#f0d3a0] bg-[#fff4dd] text-[#d28717] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.4)]",
        actionClassName: "border-[#d1aa2b] text-[#d1aa2b]",
    },
}

function StatusBadge({
    status,
    label,
}: {
    status: ApplicationStatus
    label: string
}) {
    const currentStatus = statusConfig[status]

    return (
        <span
            className={cn(
                "inline-flex min-w-22 items-center justify-center rounded-full px-3 py-1 text-[12px] font-bold",
                currentStatus.className,
            )}
        >
            {label || currentStatus.label}
        </span>
    )
}

function DetailsAction({ record }: { record: PortalSeekerApplicationMonitorItem }) {
    const currentStatus = statusConfig[record.statusKey]

    return (
        <Link
            to={record.to}
            className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border bg-white/95 transition duration-200 hover:scale-105",
                currentStatus.actionClassName,
            )}
            aria-label={`عرض تفاصيل الطلب ${record.id}`}
        >
            {record.statusKey === "under_review" ? (
                <Eye className="size-4" />
            ) : (
                <CircleAlert className="size-4" />
            )}
        </Link>
    )
}

export default function PortalApplicationMonitorSection({
    jobApplications = [],
    trainingApplications = [],
    isLoadingJobs = false,
    isLoadingTrainings = false,
    isErrorJobs = false,
    isErrorTrainings = false,
}: PortalApplicationMonitorSectionProps) {
    const [activeKind, setActiveKind] = useState<ApplicationKind>("jobs")

    const records =
        activeKind === "jobs" ? jobApplications : trainingApplications
    const isLoading = activeKind === "jobs" ? isLoadingJobs : isLoadingTrainings
    const isError = activeKind === "jobs" ? isErrorJobs : isErrorTrainings

    const columns = useMemo(
        () => [
            {
                id: "date",
                header: "التاريخ",
                value: "date",
                className: "whitespace-nowrap",
            },
            {
                id: "roleTitle",
                header: "العمل/التدريب",
                value: "roleTitle",
                className: "whitespace-nowrap",
            },
            {
                id: "companyName",
                header: "الشركة",
                value: "companyName",
                className: "whitespace-nowrap",
            },
            {
                id: "location",
                header: "المكان",
                value: "location",
                className: "whitespace-nowrap",
            },
            {
                id: "status",
                header: "الحالة",
                className: "whitespace-nowrap",
                cell: (record: PortalSeekerApplicationMonitorItem) => (
                    <StatusBadge
                        status={record.statusKey}
                        label={record.statusLabel}
                    />
                ),
            },
            {
                id: "actions",
                header: "الإجراءات",
                className: "whitespace-nowrap",
                cell: (record: PortalSeekerApplicationMonitorItem) => (
                    <DetailsAction record={record} />
                ),
            },
        ],
        [],
    )

    const rowBackgrounds = useMemo(
        () =>
            records.map((record) =>
                record.statusKey === "accepted" ? "#324c6f" : "#63b9d0",
            ),
        [records],
    )

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-start lg:justify-between">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-[28px] font-bold leading-[1.3] text-black max-[400px]:text-[24px] sm:text-[32px]">
                                مراقبة الطلب
                            </h1>
                            <p className="mt-4 mb-0 max-w-[36rem] text-size16 font-medium leading-[1.9] text-black sm:text-size20">
                                يمكنك مراقبة طلب توظيفك أو تدريباتك التي
                                أرسلتها للشركات
                            </p>
                        </div>

                        <PortalOpportunityTabs
                            activeTab={activeKind}
                            onChange={setActiveKind}
                            className="lg:pt-10"
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex min-h-[260px] items-center justify-center rounded-[16px] bg-white/80">
                            <Loader size={8} />
                        </div>
                    ) : (
                        <ReusableTable
                            data={records}
                            columns={columns}
                            showRowNumbers
                            primaryColor="#324c6f"
                            rowBackgrounds={rowBackgrounds}
                            textColor="#ffffff"
                            bodyTextColor="#ffffff"
                            alternateRowColors={false}
                            emptyText={
                                isError
                                    ? "تعذر تحميل الطلبات حالياً."
                                    : "لا توجد طلبات لعرضها حالياً."
                            }
                        />
                    )}
                </div>
            </div>
        </section>
    )
}
