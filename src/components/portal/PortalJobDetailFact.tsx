import type { ReactNode } from "react"
import { Layers2 } from "lucide-react"

interface PortalJobDetailFactProps {
    label: string
    value: string
    icon?: ReactNode
}

export default function PortalJobDetailFact({
    label,
    value,
    icon,
}: PortalJobDetailFactProps) {
    return (
        <div className="flex items-start gap-2.5 text-right min-[480px]:gap-3" dir="rtl">
            <span className="mt-1 inline-flex shrink-0 text-warning-color">
                {icon ?? <Layers2 className="size-5" />}
            </span>

            <p className="m-0 break-words text-[15px] leading-[1.9] text-black min-[480px]:text-size16 sm:text-size18">
                <span className="font-bold">{label}:</span>{" "}
                <span className="font-medium">{value}</span>
            </p>
        </div>
    )
}
