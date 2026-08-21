import { ArrowLeft, BookOpenText } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../global/ui/button"
import { cn } from "../../utils/cn"

interface PortalStudyCardProps {
    companyName: string
    studyTitle: string
    excerpt: string
    actionLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
    onAction?: () => void
    className?: string
}

export default function PortalStudyCard({
    companyName,
    studyTitle,
    excerpt,
    actionLabel = "عرض المقال",
    to,
    href,
    target,
    rel,
    onAction,
    className,
}: PortalStudyCardProps) {
    const cardClassName = cn(
        "portal-category-card-shadow flex min-h-[260px] flex-col rounded-[18px] border border-[#e2ebf6] bg-white px-6 py-7 text-right transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgb(35_61_103_/_0.14)] sm:px-7",
        className,
    )

    const actionButtonClassName =
        "inline-flex min-h-[42px] items-center justify-center rounded-[8px] border border-[#3b63c6] bg-[#5f86dd] px-4 py-2 text-size16 font-bold text-white transition duration-200 hover:brightness-105"

    const actionButton = (() => {
        const content = (
            <>
                {actionLabel}
                <ArrowLeft className="mr-2 size-4" />
            </>
        )

        if (to) {
            return (
                <Link to={to} className={actionButtonClassName}>
                    {content}
                </Link>
            )
        }

        if (href) {
            return (
                <a
                    href={href}
                    target={target}
                    rel={rel}
                    className={actionButtonClassName}
                >
                    {content}
                </a>
            )
        }

        return (
            <Button
                type="button"
                variant="panel"
                size="normal"
                onClick={onAction}
                className={actionButtonClassName}
            >
                {content}
            </Button>
        )
    })()

    return (
        <article className={cardClassName} dir="rtl">
            <div className="flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-warning-color/10 text-warning-color">
                        <BookOpenText className="size-5" />
                    </span>
                    <span className="rounded-full bg-[#f5f8fc] px-3 py-1 text-size13 font-bold text-[#5e6a7c]">
                        {companyName}
                    </span>
                </div>

                <h3 className="m-0 text-size24 font-bold leading-[1.45] text-[#233047] sm:text-size28">
                    {studyTitle}
                </h3>

                <p className="mt-4 line-clamp-3 text-size16 font-medium leading-[1.9] text-[#5a6678] sm:text-size18">
                    {excerpt}
                </p>

                <div className="mt-auto pt-5">{actionButton}</div>
            </div>
        </article>
    )
}
