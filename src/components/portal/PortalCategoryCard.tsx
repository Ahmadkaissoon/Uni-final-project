import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { cn } from "../../utils/cn"

interface PortalCategoryCardProps {
    title: string
    icon: ReactNode
    to?: string
    href?: string
    target?: string
    rel?: string
    onClick?: () => void
    className?: string
}

export default function PortalCategoryCard({
    title,
    icon,
    to,
    href,
    target,
    rel,
    onClick,
    className,
}: PortalCategoryCardProps) {
    const sharedClassName = cn(
        "portal-category-card-shadow group flex min-h-[214px] w-full flex-col items-center justify-center rounded-[20px] bg-white px-6 py-10 text-center transition duration-300",
        (onClick || to || href) &&
            "cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_32px_rgb(0_0_0_/_0.14)]",
        className,
    )

    const content = (
        <>
            <span className="mb-8 inline-flex items-center justify-center text-black [&_svg]:size-[56px]">
                {icon}
            </span>

            <h3 className="m-0 text-size24 font-bold leading-[1.35] text-black">
                {title}
            </h3>
        </>
    )

    if (to) {
        return (
            <Link to={to} onClick={onClick} className={sharedClassName}>
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
            >
                {content}
            </a>
        )
    }

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={sharedClassName}>
                {content}
            </button>
        )
    }

    return <div className={sharedClassName}>{content}</div>
}
