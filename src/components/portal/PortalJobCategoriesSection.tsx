import { Plus } from "lucide-react"
import { useMemo, type ReactNode } from "react"

import { usePortalJobCategories } from "../../api/portalJobs"
import { Button } from "../global/ui/button"
import PortalCategoryCard from "./PortalCategoryCard"
import PortalCategoryCardSkeleton from "./PortalCategoryCardSkeleton"

export interface PortalCategoryItem {
    id: string
    title: string
    icon: string | ReactNode
    to?: string
    href?: string
    target?: string
    rel?: string
}

interface ApiPortalCategory {
    _id: string
    name: string
    icon: string
}

interface PortalJobCategoriesSectionProps {
    title?: string
    categories?: PortalCategoryItem[]
    onCategoryClick?: (categoryId: string) => void
    onShowMore?: () => void
    itemsLimit?: number
    emptyText?: string
}

function mapApiCategoryToPortalCategoryItem(
    category: ApiPortalCategory,
): PortalCategoryItem {
    return {
        id: category._id,
        title: category.name,
        icon: category.icon,
        to: `/jobs/categories/${category._id}`,
    }
}

export default function PortalJobCategoriesSection({
    title = "وظائف حسب الفئة",
    categories,
    onCategoryClick,
    onShowMore,
    itemsLimit = 6,
    emptyText = "لا توجد تصنيفات متاحة حالياً.",
}: PortalJobCategoriesSectionProps) {
    const categoriesQuery = usePortalJobCategories()
    const usesExternalCategories = categories !== undefined

    const resolvedCategories = useMemo(() => {
        if (usesExternalCategories) {
            return categories ?? []
        }

        const apiCategories = (categoriesQuery.data?.data ?? []) as ApiPortalCategory[]

        return apiCategories.map(mapApiCategoryToPortalCategoryItem)
    }, [categories, categoriesQuery.data?.data, usesExternalCategories])

    const visibleCategories = resolvedCategories.slice(0, itemsLimit)
    const isLoading = !usesExternalCategories && categoriesQuery.isLoading
    const isError = !usesExternalCategories && categoriesQuery.isError

    return (
        <section className="my-12 sm:pm-16" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="inline-flex flex-col items-start">
                            <h2 className="mx-[10px] m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[32px]">
                                {title}
                            </h2>
                            <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
                        </div>
                    </div>

                    <div className="grid gap-5 xl:px-[89px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        {isLoading
                            ? Array.from({ length: itemsLimit }).map((_, index) => (
                                  <PortalCategoryCardSkeleton
                                      key={`home-category-skeleton-${index + 1}`}
                                  />
                              ))
                            : visibleCategories.length > 0
                              ? visibleCategories.map((category) => (
                                    <PortalCategoryCard
                                        key={category.id}
                                        title={category.title}
                                        icon={category.icon}
                                        to={category.to}
                                        href={category.href}
                                        target={category.target}
                                        rel={category.rel}
                                        onClick={
                                            onCategoryClick
                                                ? () => onCategoryClick(category.id)
                                                : undefined
                                        }
                                    />
                                ))
                              : (
                                  <div className="portal-category-card-shadow col-span-full rounded-[20px] bg-white px-6 py-12 text-center">
                                      <p className="m-0 text-size18 font-bold text-black">
                                          {isError
                                              ? "تعذر تحميل التصنيفات حالياً، يرجى المحاولة لاحقاً."
                                              : emptyText}
                                      </p>
                                  </div>
                              )}
                    </div>

                    {onShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={onShowMore}
                                className="inline-flex items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size18 !font-bold !text-white hover:!brightness-105"
                                dir="rtl"
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white p-1">
                                    <Plus className="size-5" />
                                </span>
                                <span className="inline-flex items-center">
                                    عرض المزيد
                                </span>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
