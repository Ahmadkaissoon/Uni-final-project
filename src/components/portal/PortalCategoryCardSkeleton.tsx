import { Skeleton } from "../global/ui/skeleton"

export default function PortalCategoryCardSkeleton() {
    return (
        <article className="portal-category-card-shadow flex min-h-[214px] w-full flex-col items-center justify-center rounded-[20px] bg-white px-6 py-10 text-center">
            <Skeleton className="mb-8 size-[56px] rounded-[14px]" />
            <Skeleton className="h-8 w-[140px] rounded-[10px]" />
        </article>
    )
}
