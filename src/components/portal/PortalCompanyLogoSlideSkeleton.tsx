import { cn } from "../../utils/cn"
import { Skeleton } from "../global/ui/skeleton"

interface PortalCompanyLogoSlideSkeletonProps {
    className?: string
    showCompanyName?: boolean
}

export default function PortalCompanyLogoSlideSkeleton({
    className,
    showCompanyName = false,
}: PortalCompanyLogoSlideSkeletonProps) {
    return (
        <article
            className={cn(
                "portal-company-logo-card flex aspect-[1.18/1] w-full items-center justify-center rounded-[8px] border border-black/5 bg-white px-6 py-6 text-center",
                className,
            )}
        >
            {showCompanyName ? (
                <div className="flex flex-col items-center justify-center gap-3">
                    <Skeleton className="size-[88px] rounded-full" />
                    <Skeleton className="h-7 w-[140px] rounded-[10px]" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                    <Skeleton className="h-[88px] w-[120px] rounded-[18px]" />
                    <Skeleton className="h-6 w-[110px] rounded-[10px]" />
                </div>
            )}
        </article>
    )
}
