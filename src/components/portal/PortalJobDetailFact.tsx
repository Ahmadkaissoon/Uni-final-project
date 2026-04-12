import { Layers2 } from "lucide-react"

interface PortalJobDetailFactProps {
    label: string
    value: string
}

export default function PortalJobDetailFact({
    label,
    value,
}: PortalJobDetailFactProps) {
    return (
        <div className="flex items-start gap-3 text-right" dir="rtl">
            <span className="mt-1 inline-flex shrink-0 text-warning-color">
                <Layers2 className="size-5" />
            </span>

            <p className="m-0 break-words text-size16 leading-[1.9] text-black sm:text-size18">
                <span className="font-bold">{label}:</span>{" "}
                <span className="font-medium">{value}</span>
            </p>
        </div>
    )
}
