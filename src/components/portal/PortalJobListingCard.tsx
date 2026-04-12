import { MapPin } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "../global/ui/button"
import { cn } from "../../utils/cn"

interface PortalJobListingCardProps {
    companyName: string
    jobTitle: string
    location: string
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

export default function PortalJobListingCard({
    companyName,
    jobTitle,
    location,
    logoSrc,
    logoAlt,
    logoLabel,
    actionLabel = "طلب الوظيفة",
    to,
    href,
    target,
    rel,
    onAction,
    className,
}: PortalJobListingCardProps) {
    const cardClassName = cn(
        "portal-category-card-shadow rounded-[20px] bg-white px-6 py-6 sm:pe-19 sm:ps-12.5 sm:py-12",
        className,
    )

    const actionButtonClassName =
        "inline-flex h-[40px] min-w-[120px] items-center justify-center rounded-[8px] border border-[#3b63c6] bg-[#5f86dd] !px-4 !py-2 !text-size16 !font-bold !text-white hover:brightness-105"

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
            <div className="flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
                <div className="">
                    <div className="flex items-start justify-end gap-4 text-right mb-6">
                        <span className="inline-flex size-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(180deg,#7db8f6_0%,#3366a6_100%)] text-size16 font-bold text-white">
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
                        <h3 className="m-0 text-size24 font-bold leading-[1.3] text-black">
                            {companyName}
                        </h3>
                    </div>
                    <p className="mb-6 text-size18 font-bold leading-[1.35] text-[#d44b2e]">
                        {jobTitle}
                    </p>

                    <div className="inline-flex items-center gap-2.5 text-size16 font-medium text-warning-color">
                        <MapPin className="size-6" />
                        <span>{location}</span>
                    </div>
                </div>

                <div className="flex sm:justify-end">{actionButton}</div>
            </div>
        </article>
    )
}
