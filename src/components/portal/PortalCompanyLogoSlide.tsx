import { Link } from "react-router-dom"

import { cn } from "../../utils/cn"

interface PortalCompanyLogoSlideProps {
    companyName: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
    onClick?: () => void
    className?: string
    showCompanyName?: boolean
}

function getCompanyInitials(companyName: string) {
    const initials = companyName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()

    return initials || "CO"
}

export default function PortalCompanyLogoSlide({
    companyName,
    logoSrc,
    logoAlt,
    logoLabel,
    to,
    href,
    target,
    rel,
    onClick,
    className,
    showCompanyName = false,
}: PortalCompanyLogoSlideProps) {
    const sharedClassName = cn(
        "portal-company-logo-card flex aspect-[1.18/1] w-full items-center justify-center rounded-[8px] border border-black/5 bg-white px-6 py-6 text-center transition duration-300",
        (to || href || onClick) &&
            "cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_38px_rgb(15_23_42_/_0.10)]",
        className,
    )

    const content = showCompanyName ? (
        <div className="flex flex-col items-center justify-center gap-3">
            <span className="inline-flex size-[88px] items-center justify-center overflow-hidden rounded-full bg-[#eef2f6] p-3">
                {logoSrc ? (
                    <img
                        src={logoSrc}
                        alt={logoAlt ?? companyName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="px-2 text-[28px] font-extrabold tracking-[0.08em] text-[#213b63]">
                        {logoLabel ?? getCompanyInitials(companyName)}
                    </span>
                )}
            </span>
            <span className="text-size20 font-bold text-black">
                {companyName}
            </span>
        </div>
    ) : logoSrc ? (
        <img
            src={logoSrc}
            alt={logoAlt ?? companyName}
            className="max-h-[96px] w-full object-contain"
        />
    ) : (
        <div className="flex flex-col items-center justify-center gap-3">
            <span className="inline-flex min-h-[88px] min-w-[88px] items-center justify-center rounded-[18px] bg-[#eef2f6] px-5 text-[28px] font-extrabold tracking-[0.08em] text-[#213b63]">
                {logoLabel ?? getCompanyInitials(companyName)}
            </span>
            <span className="text-size16 font-bold text-[#213b63]">
                {companyName}
            </span>
        </div>
    )

    if (to) {
        return (
            <Link
                to={to}
                onClick={onClick}
                className={sharedClassName}
                aria-label={`عرض فرص شركة ${companyName}`}
            >
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
                onClick={onClick}
                className={sharedClassName}
                aria-label={`عرض فرص شركة ${companyName}`}
            >
                {content}
            </a>
        )
    }

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={sharedClassName}
                aria-label={`عرض فرص شركة ${companyName}`}
            >
                {content}
            </button>
        )
    }

    return <div className={sharedClassName}>{content}</div>
}
