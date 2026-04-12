import { useRef, useState } from "react"

import { Button } from "../global/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../global/ui/dialog"

interface PortalJobApplicationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function PortalJobApplicationModal({
    open,
    onOpenChange,
}: PortalJobApplicationModalProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [selectedFileName, setSelectedFileName] = useState("")

    function handlePickFile() {
        inputRef.current?.click()
    }

    function handleOpenChange(nextOpen: boolean) {
        if (!nextOpen) {
            setSelectedFileName("")

            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }

        onOpenChange(nextOpen)
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        setSelectedFileName(file?.name ?? "")
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="!min-w-0 w-[min(92vw,673px)] max-w-[673px] rounded-[72px] border-none bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgb(15_23_42_/_0.18)] sm:px-18 sm:py-20"
                dir="rtl"
            >
                <div className="grid gap-19">
                    <div className="grid gap-4">
                        <DialogTitle className="m-0 text-center text-[clamp(2rem,2.8vw,3rem)] font-bold leading-[1.2] text-[#2b5b9e]">
                            قم بإرسال السيرة الذاتية!
                        </DialogTitle>

                        <DialogDescription className="m-0 text-center text-size16 font-medium leading-[1.8] text-black/65 sm:text-size18">
                            انتظرنا عنك أكثر، لطفًا أرسل إلينا السيرة الذاتية
                        </DialogDescription>
                    </div>

                    <div className="overflow-hidden rounded-full bg-[#f4f4f4] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.8)]">
                        <div className="flex items-center" dir="ltr">
                            <div className="min-w-0 flex-1 px-5 py-4.5 text-right text-size16 font-medium text-black/45">
                                <span className="block truncate">
                                    {selectedFileName || "اسم الملف"}
                                </span>
                            </div>

                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={handlePickFile}
                                className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-e-full bg-[#4f72b6] !px-8 !py-4.5 !text-size18 !font-bold !text-white hover:!brightness-105"
                            >
                                اختر ملف
                            </Button>
                        </div>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
