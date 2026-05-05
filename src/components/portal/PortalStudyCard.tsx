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
        "portal-category-card-shadow flex min-h-[212px] flex-col items-center justify-center rounded-[22px] bg-white px-6 py-8 text-center sm:px-10 sm:py-10",
        className,
    )

    const actionButtonClassName =
        "inline-flex h-[40px] min-w-[116px] cursor-pointer items-center justify-center rounded-[8px] border border-[#3b63c6] bg-[#5f86dd] !px-4 !py-2 !text-size16 !font-bold !text-white hover:brightness-105"

    const actionButton = (() => {
        if (to) {
            return (
                <Link to={to} className={actionButtonClassName}>
                    {actionLabel}
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
                    {actionLabel}
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
                {actionLabel}
            </Button>
        )
    })()

    return (
        <article className={cardClassName} dir="rtl">
            <div className="flex w-full max-w-[260px] flex-col items-center text-center">
                <h3 className="m-0 text-size30 font-bold leading-[1.25] text-[#30333a]">
                    {companyName}
                </h3>

                <p className="mt-7 text-size20 font-bold leading-[1.35] text-[#d44b2e]">
                    {studyTitle}
                </p>

                <p className="mt-6 line-clamp-2 text-size18 font-semibold leading-[1.8] text-[#3d4148]">
                    {excerpt}
                </p>

                <div className="mt-5">{actionButton}</div>
            </div>
        </article>
    )
}
