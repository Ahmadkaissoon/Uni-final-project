import { Link } from "react-router-dom"

import { Button } from "../global/ui/button"
import { cn } from "../../utils/cn"

interface PortalNearbyJobCardProps {
    companyName: string
    jobTitle: string
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

export default function PortalNearbyJobCard({
    companyName,
    jobTitle,
    logoSrc,
    logoAlt,
    logoLabel,
    actionLabel = "عرض الوظيفة",
    to,
    href,
    target,
    rel,
    onAction,
    className,
}: PortalNearbyJobCardProps) {
    const cardClassName = cn(
        "portal-category-card-shadow rounded-[18px] bg-white px-5 py-5 sm:px-9 sm:py-7",
        className,
    )

    const buttonClassName =
        "inline-flex h-[42px] min-w-[120px] items-center justify-center rounded-[6px] border border-[#3b975f] bg-[#57b57d] !px-4 !py-2 !text-size16 !font-bold !text-white hover:brightness-105"

    const actionButton = (() => {
        if (to) {
            return (
                <Link to={to} className={buttonClassName}>
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
                    className={buttonClassName}
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
                className={buttonClassName}
            >
                {actionLabel}
            </Button>
        )
    })()

    return (
        <article className={cardClassName} dir="rtl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center lg:justify-end, gap-4 text-right">
                    <span className="inline-flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] text-size18 font-bold text-[#818181]">
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
                        <h3 className="m-0 text-size28 font-bold leading-[1.3] text-black">
                            {companyName}
                        </h3>

                        <p className="m-0 text-size18 font-medium leading-[1.35] text-warning-color">
                            {jobTitle}
                        </p>
                    </div>
                </div>

                <div className="flex sm:justify-end">{actionButton}</div>
            </div>
        </article>
    )
}
