import { Link } from "react-router-dom"

import { Button } from "../global/ui/button"
import { cn } from "../../utils/cn"

interface PortalSavedOpportunityCardProps {
    companyName: string
    title: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    actionLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
    onAction?: () => void
    className?: string
}

function getCompanyInitials(companyName: string) {
    return companyName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
}

export default function PortalSavedOpportunityCard({
    companyName,
    title,
    logoSrc,
    logoAlt,
    logoLabel,
    actionLabel = "عرض الفرصة",
    to,
    href,
    target,
    rel,
    onAction,
    className,
}: PortalSavedOpportunityCardProps) {
    const cardClassName = cn(
        "portal-category-card-shadow rounded-[14px] bg-white px-4 py-4 sm:px-8 sm:py-5",
        className,
    )

    const actionButtonClassName =
        "inline-flex h-[36px] min-w-[88px] items-center justify-center rounded-[6px] border border-[#3b975f] bg-[#57b57d] !px-3.5 !py-2 !text-size12 !font-bold !text-white hover:brightness-105"

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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-end gap-4 text-right">
                    <span className="inline-flex size-[48px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] text-size16 font-bold text-[#818181] sm:size-[52px]">
                        {logoSrc ? (
                            <img
                                src={logoSrc}
                                alt={logoAlt ?? companyName}
                                className="h-full w-full object-cover"
                            />
                        ) : logoLabel ? (
                            logoLabel
                        ) : (
                            getCompanyInitials(companyName)
                        )}
                    </span>

                    <div className="flex flex-col items-end gap-1 text-right sm:flex-row sm:items-center sm:gap-4">
                        <h3 className="m-0 text-size20 font-bold leading-[1.35] text-black sm:text-size24">
                            {companyName}
                        </h3>

                        <p className="m-0 text-size12 font-medium leading-[1.35] text-warning-color sm:text-size14">
                            {title}
                        </p>
                    </div>
                </div>

                <div className="flex sm:justify-end">{actionButton}</div>
            </div>
        </article>
    )
}

