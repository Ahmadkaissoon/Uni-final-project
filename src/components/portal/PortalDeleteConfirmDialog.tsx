import { AlertTriangle } from "lucide-react"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../global/ui/dialog"
import { Button } from "../global/ui/button"

interface PortalDeleteConfirmDialogProps {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    isDeleting?: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
}

export default function PortalDeleteConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "حذف",
    cancelLabel = "إلغاء",
    isDeleting = false,
    onOpenChange,
    onConfirm,
}: PortalDeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[min(92vw,390px)] max-w-[390px] rounded-[18px] border border-[#e7d8d8] bg-white p-5 text-right shadow-[0_22px_70px_rgb(30_41_59_/_0.2)] sm:p-6"
                dir="rtl"
            >
                <DialogHeader className="items-center space-y-3 text-center">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#fff1f0] text-[#c43833]">
                        <AlertTriangle className="size-5" />
                    </span>

                    <DialogTitle className="m-0 text-size20 font-bold leading-8 text-[#233047]">
                        {title}
                    </DialogTitle>

                    <DialogDescription className="m-0 text-size15 font-medium leading-7 text-[#5d6979]">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-2 grid grid-cols-2 gap-3 sm:flex-row sm:space-x-0">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="panel"
                            size="normal"
                            disabled={isDeleting}
                            className="min-h-[42px] rounded-[10px] border border-[#d7e3f5] bg-[#f8fbff] !px-4 !py-2 !text-size15 !font-bold !text-[#233047] hover:!bg-[#eef5ff]"
                        >
                            {cancelLabel}
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        variant="panel"
                        size="normal"
                        loading={isDeleting}
                        onClick={() => {
                            void Promise.resolve(onConfirm()).catch(() => undefined)
                        }}
                        className="min-h-[42px] rounded-[10px] border border-[#b52f2f] bg-[#c43833] !px-4 !py-2 !text-size15 !font-bold !text-white hover:!brightness-105"
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
