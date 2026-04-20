import { Building } from "lucide-react"
import { Link } from "react-router-dom"

interface PortalInternshipSimilarCardProps {
    title: string
    companyName: string
    to: string
}

export default function PortalInternshipSimilarCard({
    title,
    companyName,
    to,
}: PortalInternshipSimilarCardProps) {
    return (
        <article
            className="portal-category-card-shadow rounded-[18px] bg-white px-4 py-5 text-right min-[480px]:px-6 min-[480px]:py-8"
            dir="rtl"
        >
            <div className="grid gap-5 min-[480px]:gap-8">
                <div className="grid gap-4 min-[480px]:gap-5">
                    <h3 className="m-0 text-lg font-bold leading-[1.35] text-black min-[480px]:text-size24">
                        {title}
                    </h3>

                    <div className="inline-flex items-center gap-2 text-[11px] font-medium text-black min-[480px]:text-size12">
                        <Building className="size-4 shrink-0 text-warning-color" />
                        <span className="break-words">{companyName}</span>
                    </div>
                </div>

                <Link
                    to={to}
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded-[8px] border border-[#3b63c6] bg-[#5f86dd] px-4 py-2 text-sm font-bold text-white transition duration-200 hover:brightness-105 min-[480px]:min-h-[42px] min-[480px]:text-size16"
                >
                    قدّم الآن
                </Link>
            </div>
        </article>
    )
}
