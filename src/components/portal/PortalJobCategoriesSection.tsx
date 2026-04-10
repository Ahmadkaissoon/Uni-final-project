import {
    ChartNoAxesColumn,
    CodeXml,
    Lightbulb,
    NotebookText,
    Palette,
    Plus,
    Scissors,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"

import { Button } from "../global/ui/button"
import PortalCategoryCard from "./PortalCategoryCard"

export interface PortalCategoryItem {
    id: string
    title: string
    icon: ReactNode
    to?: string
    href?: string
    target?: string
    rel?: string
}

const defaultCategories: PortalCategoryItem[] = [
    {
        id: "design",
        title: "تصميم",
        icon: <Palette strokeWidth={2.25} />,
        to: "/jobs/categories?category=design",
    },
    {
        id: "development",
        title: "برمجة",
        icon: <CodeXml strokeWidth={2.25} />,
        to: "/jobs/categories?category=development",
    },
    {
        id: "editing",
        title: "مونتاج",
        icon: <Scissors strokeWidth={2.25} />,
        to: "/jobs/categories?category=editing",
    },
    {
        id: "social-media",
        title: "ادارة صفحات",
        icon: <Lightbulb strokeWidth={2.25} />,
        to: "/jobs/categories?category=social-media",
    },
    {
        id: "content-writing",
        title: "كتابة محتوى",
        icon: <NotebookText strokeWidth={2.25} />,
        to: "/jobs/categories?category=content-writing",
    },
    {
        id: "marketing",
        title: "تسويق",
        icon: <ChartNoAxesColumn strokeWidth={2.25} />,
        to: "/jobs/categories?category=marketing",
    },
]

interface PortalJobCategoriesSectionProps {
    title?: string
    categories?: PortalCategoryItem[]
    onCategoryClick?: (categoryId: string) => void
    onShowMore?: () => void
    itemsPerPage?: number
}

export default function PortalJobCategoriesSection({
    title = "وظائف حسب الفئة",
    categories = defaultCategories,
    onCategoryClick,
    onShowMore,
    itemsPerPage = 6,
}: PortalJobCategoriesSectionProps) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage))
    const safeCurrentPage = Math.min(currentPage, totalPages)

    const paginatedCategories = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * itemsPerPage
        return categories.slice(startIndex, startIndex + itemsPerPage)
    }, [categories, safeCurrentPage, itemsPerPage])

    return (
        <section className="my-12 sm:pm-16" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="inline-flex flex-col items-start">
                            <h2 className="m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[32px] mx-[10px]">
                                {title}
                            </h2>
                            <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
                        </div>
                    </div>

                    <div className="grid gap-5 px-[89px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                        {paginatedCategories.map((category) => (
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
                        ))}
                    </div>

                    {totalPages > 1 ? (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.max(1, safeCurrentPage - 1),
                                    )
                                }
                                disabled={safeCurrentPage === 1}
                                className="rounded-[10px] border border-warning-color bg-white !px-4 !py-2 !text-size16 !font-bold !text-warning-color hover:!bg-warning-color hover:!text-white disabled:opacity-50"
                            >
                                السابق
                            </Button>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => {
                                        const pageNumber = index + 1
                                        const isActive =
                                            pageNumber === safeCurrentPage

                                        return (
                                            <Button
                                                key={pageNumber}
                                                type="button"
                                                variant="panel"
                                                size="normal"
                                                onClick={() =>
                                                    setCurrentPage(pageNumber)
                                                }
                                                className={
                                                    isActive
                                                        ? "rounded-[10px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size16 !font-bold !text-white"
                                                        : "rounded-[10px] border border-warning-color bg-white !px-4 !py-2 !text-size16 !font-bold !text-warning-color hover:!bg-warning-color hover:!text-white"
                                                }
                                            >
                                                {pageNumber}
                                            </Button>
                                        )
                                    },
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(
                                            totalPages,
                                            safeCurrentPage + 1,
                                        ),
                                    )
                                }
                                disabled={safeCurrentPage === totalPages}
                                className="rounded-[10px] border border-warning-color bg-white !px-4 !py-2 !text-size16 !font-bold !text-warning-color hover:!bg-warning-color hover:!text-white disabled:opacity-50"
                            >
                                التالي
                            </Button>
                        </div>
                    ) : null}

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
                </div>
            </div>
        </section>
    )
}
