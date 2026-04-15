import { type FormEvent, type ReactNode, useState } from "react"
import { Send } from "lucide-react"

import { cn } from "../../utils/cn"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../global/ui/dialog"

export type PortalInterviewMeetingMode = "remote" | "onsite"

export interface PortalInterviewScheduleValues {
    meetingMode: PortalInterviewMeetingMode
    scheduledDate: string
    scheduledTime: string
    meetingLink: string
}

interface PortalInterviewScheduleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: PortalInterviewScheduleValues) => void
    initialValues?: Partial<PortalInterviewScheduleValues> | null
    applicantName?: string
}

const defaultScheduleValues: PortalInterviewScheduleValues = {
    meetingMode: "remote",
    scheduledDate: "",
    scheduledTime: "",
    meetingLink: "",
}

export default function PortalInterviewScheduleModal({
    open,
    onOpenChange,
    onSubmit,
    initialValues,
    applicantName,
}: PortalInterviewScheduleModalProps) {
    const [formValues, setFormValues] = useState<PortalInterviewScheduleValues>(
        () => resolveInitialValues(initialValues),
    )
    const [errorMessage, setErrorMessage] = useState("")

    const isRemoteMeeting = formValues.meetingMode === "remote"

    function updateField<Key extends keyof PortalInterviewScheduleValues>(
        field: Key,
        value: PortalInterviewScheduleValues[Key],
    ) {
        setFormValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }))

        if (errorMessage) {
            setErrorMessage("")
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!formValues.scheduledDate || !formValues.scheduledTime) {
            setErrorMessage("يرجى تحديد التاريخ والوقت قبل إرسال الموعد.")
            return
        }

        if (isRemoteMeeting && !formValues.meetingLink.trim()) {
            setErrorMessage("يرجى إدخال رابط الميتينغ قبل إرسال الموعد.")
            return
        }

        onSubmit({
            ...formValues,
            meetingLink: isRemoteMeeting ? formValues.meetingLink.trim() : "",
        })
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            setFormValues(resolveInitialValues(initialValues))
            setErrorMessage("")
        }

        onOpenChange(nextOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="!min-w-0 w-[min(92vw,690px)] max-w-[690px] rounded-[72px] border-none bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgb(15_23_42_/_0.18)] sm:px-18 sm:py-16"
                dir="rtl"
            >
                <form className="grid gap-8" onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <DialogTitle className="m-0 text-center text-[clamp(2rem,2.8vw,3rem)] font-bold leading-[1.2] text-[#2b5b9e]">
                            قم بإرسال الموعد!
                        </DialogTitle>

                        <DialogDescription className="m-0 text-center text-size16 font-medium leading-[1.8] text-black/65 sm:text-size18">
                            يمكنك تحديد اليوم والوقت وتفاصيله ليسجل للمتقدم هذا
                            الموعد
                            {applicantName ? `، ${applicantName}` : ""}.
                        </DialogDescription>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <MeetingModeButton
                            isActive={isRemoteMeeting}
                            onClick={() => updateField("meetingMode", "remote")}
                        >
                            ميتينغ
                        </MeetingModeButton>

                        <MeetingModeButton
                            isActive={!isRemoteMeeting}
                            onClick={() => updateField("meetingMode", "onsite")}
                        >
                            داخلي
                        </MeetingModeButton>
                    </div>

                    <div className="grid gap-4">
                        <ScheduleInputRow label="اختر التاريخ">
                            <input
                                type="date"
                                dir="ltr"
                                value={formValues.scheduledDate}
                                onChange={(event) =>
                                    updateField(
                                        "scheduledDate",
                                        event.target.value,
                                    )
                                }
                                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-left text-size16 font-medium text-[#2f3a54] outline-none [color-scheme:light]"
                            />
                        </ScheduleInputRow>

                        <ScheduleInputRow label="اختر الوقت">
                            <input
                                type="time"
                                dir="ltr"
                                value={formValues.scheduledTime}
                                onChange={(event) =>
                                    updateField(
                                        "scheduledTime",
                                        event.target.value,
                                    )
                                }
                                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-left text-size16 font-medium text-[#2f3a54] outline-none [color-scheme:light]"
                            />
                        </ScheduleInputRow>

                        {isRemoteMeeting ? (
                            <ScheduleInputRow label="رابط الميتينغ">
                                <input
                                    type="url"
                                    dir="ltr"
                                    value={formValues.meetingLink}
                                    placeholder="أدخل الرابط"
                                    onChange={(event) =>
                                        updateField(
                                            "meetingLink",
                                            event.target.value,
                                        )
                                    }
                                    className="min-w-0 flex-1 bg-transparent px-5 py-4 text-left text-size16 font-medium text-[#2f3a54] outline-none placeholder:text-black/25"
                                />
                            </ScheduleInputRow>
                        ) : null}
                    </div>

                    {errorMessage ? (
                        <p className="m-0 rounded-[18px] border border-[#f3c2bf] bg-[#fff3f2] px-4 py-3 text-right text-size14 font-semibold text-[#b83b34]">
                            {errorMessage}
                        </p>
                    ) : null}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="inline-flex min-h-[48px] min-w-[148px] cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#56a76b] px-6 py-3 text-size16 font-bold text-white shadow-[0_12px_26px_rgba(17,45,96,0.14)] transition duration-200 hover:-translate-y-0.5"
                        >
                            <Send className="size-[18px]" />
                            ارسال الطلب
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function MeetingModeButton({
    isActive,
    onClick,
    children,
}: {
    isActive: boolean
    onClick: () => void
    children: ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex min-h-[52px] min-w-[108px] cursor-pointer items-center justify-center rounded-full border px-6 py-3 text-size16 font-bold transition duration-200",
                isActive
                    ? "border-[#2f5cb9] bg-[#2f5cb9] text-white shadow-[0_10px_24px_rgb(47_92_185_/_0.18)]"
                    : "border-[#2f5cb9] bg-white text-[#2f5cb9] hover:bg-[#f5f8ff]",
            )}
        >
            {children}
        </button>
    )
}

function ScheduleInputRow({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) {
    return (
        <div className="overflow-hidden rounded-full bg-[#f4f4f4] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.8)]">
            <div className="flex items-center">
                <span className="inline-flex min-h-[54px] shrink-0 items-center justify-center rounded-full bg-[#4f72b6] px-7 text-size16 font-bold text-white">
                    {label}
                </span>

                {children}
            </div>
        </div>
    )
}

function resolveInitialValues(
    initialValues?: Partial<PortalInterviewScheduleValues> | null,
) {
    return {
        ...defaultScheduleValues,
        ...initialValues,
    }
}
