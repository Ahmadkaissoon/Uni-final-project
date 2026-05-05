import { useState, type ReactNode } from "react"
import { CircleAlert, Eye } from "lucide-react"
import { Link } from "react-router-dom"

import { cn } from "../../utils/cn"
import { Button } from "../global/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../global/ui/table"
import { portalInternshipRecords } from "./portalInternshipsData"
import { portalJobRecords } from "./portalJobsData"

type ApplicationKind = "jobs" | "trainings"
type ApplicationStatus = "rejected" | "accepted" | "under_review"

interface ApplicationRecord {
    id: number
    date: string
    roleTitle: string
    companyName: string
    city: string
    status: ApplicationStatus
    tone: "cyan" | "navy"
    to: string
}

const headers = [
    "#",
    "التاريخ",
    "العمل/التدريب",
    "الشركة",
    "المدينة",
    "الحالة",
    "الإجراءات",
]

const jobApplications: ApplicationRecord[] = [
    {
        id: 1,
        date: "2/2/2025",
        roleTitle: portalJobRecords[0]?.jobTitle ?? "مصمم غرافيك",
        companyName: portalJobRecords[0]?.companyWebsite ?? "AL-MATEN.CO",
        city: portalJobRecords[0]?.location ?? "دمشق",
        status: "rejected",
        tone: "cyan",
        to: `/jobs/watchlist?job=${portalJobRecords[0]?.id ?? ""}`,
    },
    {
        id: 1,
        date: "2/2/2025",
        roleTitle: portalJobRecords[2]?.jobTitle ?? "مطور واجهات",
        companyName: portalJobRecords[2]?.companyWebsite ?? "ALBAYAN.DEV",
        city: portalJobRecords[2]?.location ?? "حمص",
        status: "accepted",
        tone: "navy",
        to: `/jobs/watchlist?job=${portalJobRecords[2]?.id ?? ""}`,
    },
    {
        id: 1,
        date: "2/2/2025",
        roleTitle: portalJobRecords[3]?.jobTitle ?? "تسويق رقمي",
        companyName: portalJobRecords[3]?.companyWebsite ?? "ALRIYADA.ADS",
        city: portalJobRecords[3]?.location ?? "اللاذقية",
        status: "under_review",
        tone: "cyan",
        to: `/jobs/watchlist?job=${portalJobRecords[3]?.id ?? ""}`,
    },
]

const trainingApplications: ApplicationRecord[] = [
    {
        id: 1,
        date: "8/3/2025",
        roleTitle: portalInternshipRecords[0]?.trainingType ?? "متدرب HR",
        companyName: portalInternshipRecords[0]?.companyWebsite ?? "AL-MATEN.CO",
        city: portalInternshipRecords[0]?.location ?? "حمص - سوريا",
        status: "under_review",
        tone: "cyan",
        to: `/jobs/watchlist?training=${portalInternshipRecords[0]?.id ?? ""}`,
    },
    {
        id: 2,
        date: "1/3/2025",
        roleTitle: portalInternshipRecords[2]?.trainingType ?? "متدرب تطوير واجهات",
        companyName: portalInternshipRecords[2]?.companyWebsite ?? "ALMADAAR.DEV",
        city: portalInternshipRecords[2]?.location ?? "حلب - سوريا",
        status: "accepted",
        tone: "navy",
        to: `/jobs/watchlist?training=${portalInternshipRecords[2]?.id ?? ""}`,
    },
    {
        id: 3,
        date: "25/2/2025",
        roleTitle: portalInternshipRecords[4]?.trainingType ?? "متدرب تسويق رقمي",
        companyName: portalInternshipRecords[4]?.companyWebsite ?? "IBDAA.ADS",
        city: portalInternshipRecords[4]?.location ?? "اللاذقية - سوريا",
        status: "rejected",
        tone: "cyan",
        to: `/jobs/watchlist?training=${portalInternshipRecords[4]?.id ?? ""}`,
    },
]

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

export default function PortalApplicationMonitorSection() {
    const [activeKind, setActiveKind] = useState<ApplicationKind>("jobs")

    const records =
        activeKind === "jobs" ? jobApplications : trainingApplications

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-2 text-right">
                            <h1 className="m-0 py-2.5 text-[28px] font-bold leading-[1.3] text-black max-[400px]:text-[24px] sm:text-[32px]">
                                مراقبة الطلب
                            </h1>
                            <p className="mt-4 mb-0 text-base font-medium leading-[1.9] text-black min-[500px]:max-w-4/5 min-[500px]:text-lg sm:text-size24">
                                يمكنك مراقبة طلب توظيفك أو تدريباتك التي
                                أرسلتها للشركات
                            </p>
                        </div>
                    </div>

                    <div className="mb-7 flex flex-wrap justify-end gap-4">
                        <TogglePill
                            label="فرص عمل"
                            active={activeKind === "jobs"}
                            onClick={() => setActiveKind("jobs")}
                        />
                        <TogglePill
                            label="تدريبات"
                            active={activeKind === "trainings"}
                            onClick={() => setActiveKind("trainings")}
                        />
                    </div>

                    <div className="overflow-x-auto pb-2">
                        <Table className="min-w-[820px] border-separate border-spacing-y-2.5">
                            <TableHeader>
                                <TableRow className="border-0">
                                    {headers.map((header, index) => (
                                        <TableHead
                                            key={header}
                                            className={cn(
                                                "bg-[#324c6f] px-4! py-4! text-center text-sm font-bold text-white hover:bg-[#324c6f]",
                                                index === 0 && "rounded-r-lg",
                                                index === headers.length - 1 &&
                                                    "rounded-l-lg",
                                            )}
                                        >
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {records.map((record) => {
                                    const toneClass =
                                        record.tone === "cyan"
                                            ? "bg-[#63b9d0] hover:bg-[#63b9d0]"
                                            : "bg-[#324c6f] hover:bg-[#324c6f]"
                                    const currentStatus =
                                        statusConfig[record.status]

                                    return (
                                        <TableRow
                                            key={`${activeKind}-${record.id}-${record.date}-${record.status}`}
                                            className="border-0"
                                        >
                                            <BodyCell
                                                toneClass={toneClass}
                                                rounded="right"
                                            >
                                                {record.id}
                                            </BodyCell>
                                            <BodyCell toneClass={toneClass}>
                                                {record.date}
                                            </BodyCell>
                                            <BodyCell toneClass={toneClass}>
                                                {record.roleTitle}
                                            </BodyCell>
                                            <BodyCell toneClass={toneClass}>
                                                {record.companyName}
                                            </BodyCell>
                                            <BodyCell toneClass={toneClass}>
                                                {record.city}
                                            </BodyCell>
                                            <BodyCell toneClass={toneClass}>
                                                <span
                                                    className={cn(
                                                        "inline-flex min-w-22 items-center justify-center rounded-full px-3 py-1 text-[12px] font-bold",
                                                        currentStatus.className,
                                                    )}
                                                >
                                                    {currentStatus.label}
                                                </span>
                                            </BodyCell>
                                            <BodyCell
                                                toneClass={toneClass}
                                                rounded="left"
                                            >
                                                <Link
                                                    to={record.to}
                                                    className={cn(
                                                        "inline-flex size-8 items-center justify-center rounded-full border bg-white/95 transition duration-200 hover:scale-105",
                                                        currentStatus.actionClassName,
                                                    )}
                                                    aria-label={`عرض تفاصيل الطلب ${record.id}`}
                                                >
                                                    {record.status ===
                                                    "under_review" ? (
                                                        <Eye className="size-4" />
                                                    ) : (
                                                        <CircleAlert className="size-4" />
                                                    )}
                                                </Link>
                                            </BodyCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </section>
    )
}

interface TogglePillProps {
    label: string
    active: boolean
    onClick: () => void
}

function TogglePill({ label, active, onClick }: TogglePillProps) {
    return (
        <Button
            type="button"
            variant="panel"
            size="normal"
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center rounded-full border px-11! py-6! w-auto font-bold transition duration-200",
                active
                    ? "border-[#3158c7] bg-[#3158c7] text-white shadow-[0_10px_22px_rgb(49_88_199_/_0.20)]"
                    : "border-[#3158c7] bg-white text-[#3158c7] hover:bg-[#f3f7ff]",
            )}
        >
            {label}
        </Button>
    )
}

interface BodyCellProps {
    children: ReactNode
    toneClass: string
    rounded?: "right" | "left"
}

function BodyCell({ children, toneClass, rounded }: BodyCellProps) {
    return (
        <TableCell
            className={cn(
                toneClass,
                "px-4! py-4! text-center text-sm font-medium text-white sm:text-base",
                rounded === "right" && "rounded-r-lg",
                rounded === "left" && "rounded-l-lg",
            )}
        >
            {children}
        </TableCell>
    )
}
