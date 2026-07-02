import { Skeleton } from "../global/ui/skeleton"

export default function PortalSavedOpportunityCardSkeleton() {
    return (
        <div className="portal-category-card-shadow rounded-[14px] bg-white px-4 py-4 sm:px-8 sm:py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-end gap-4">
                    <Skeleton className="size-[48px] shrink-0 rounded-full sm:size-[52px]" />

                    <div className="flex flex-col items-end gap-2 sm:gap-3">
                        <Skeleton className="h-8 w-[180px] rounded-[10px]" />
                        <Skeleton className="h-5 w-[120px] rounded-[8px]" />
                    </div>
                </div>

                <Skeleton className="h-[36px] w-[110px] rounded-[6px]" />
            </div>
        </div>
    )
}
