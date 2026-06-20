import { Skeleton } from "../global/ui/skeleton"

export default function PortalNearbyJobCardSkeleton() {
    return (
        <article
            className="portal-category-card-shadow rounded-[18px] bg-white px-5 py-5 sm:px-9 sm:py-7"
            dir="rtl"
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-right">
                    <Skeleton className="size-[56px] shrink-0 rounded-full" />

                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <Skeleton className="h-8 w-[170px] rounded-[10px]" />
                        <Skeleton className="h-6 w-[130px] rounded-[10px]" />
                    </div>
                </div>

                <div className="flex sm:justify-end">
                    <Skeleton className="h-[42px] w-[120px] rounded-[6px]" />
                </div>
            </div>
        </article>
    )
}
