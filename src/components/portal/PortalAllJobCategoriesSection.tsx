import {
    BarChart3,
    BriefcaseBusiness,
    Calculator,
    Camera,
    ChartNoAxesColumn,
    CodeXml,
    Headset,
    Languages,
    Lightbulb,
    NotebookText,
    Palette,
    Scissors,
} from "lucide-react"
import { useState } from "react"

import { Button } from "../global/ui/button"
import type { PortalCategoryItem } from "./PortalJobCategoriesSection"
import PortalCategoryCard from "./PortalCategoryCard"

const allCategories: PortalCategoryItem[] = [
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
        title: "إدارة صفحات",
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
    {
        id: "project-management",
        title: "إدارة مشاريع",
        icon: <BriefcaseBusiness strokeWidth={2.25} />,
        to: "/jobs/categories?category=project-management",
    },
    {
        id: "translation",
        title: "ترجمة",
        icon: <Languages strokeWidth={2.25} />,
        to: "/jobs/categories?category=translation",
    },
    {
        id: "data-analysis",
        title: "تحليل بيانات",
        icon: <BarChart3 strokeWidth={2.25} />,
        to: "/jobs/categories?category=data-analysis",
    },
    {
        id: "customer-support",
        title: "خدمة عملاء",
        icon: <Headset strokeWidth={2.25} />,
        to: "/jobs/categories?category=customer-support",
    },
    {
        id: "accounting",
        title: "محاسبة",
        icon: <Calculator strokeWidth={2.25} />,
        to: "/jobs/categories?category=accounting",
    },
    {
        id: "photography",
        title: "تصوير",
        icon: <Camera strokeWidth={2.25} />,
        to: "/jobs/categories?category=photography",
    },
]

interface PortalAllJobCategoriesSectionProps {
    title?: string
    description?: string
    categories?: PortalCategoryItem[]
    itemsPerPage?: number
}

export default function PortalAllJobCategoriesSection({
    title = "كافة تصنيفات الوظائف",
    description = "اكتشف أفضل الفرص المناسبة لك وابدأ بعرض خدماتك على الشركات",
    categories = allCategories,
    itemsPerPage = 6,
}: PortalAllJobCategoriesSectionProps) {
    const [visiblePages, setVisiblePages] = useState(1)

    const visibleCount = Math.min(
        categories.length,
        visiblePages * itemsPerPage,
    )
    const visibleCategories = categories.slice(0, visibleCount)
    const canShowMore = visibleCount < categories.length

    return (
        <section className="py-12 sm:py-16 lg:py-20" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-12 flex justify-start">
                        <div className="border-r-[3px] border-warning-color pr-6 text-right">
                            <h1 className="m-0 text-2xl font-bold leading-[1.3] text-black sm:text-[32px] py-2.5">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 min-[500px]:max-w-4/5 sm:text-size24 text-lg font-medium leading-[1.9] text-black">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:px-[89px]">
                        {visibleCategories.map((category) => (
                            <PortalCategoryCard
                                key={category.id}
                                title={category.title}
                                icon={category.icon}
                                to={category.to}
                                href={category.href}
                                target={category.target}
                                rel={category.rel}
                            />
                        ))}
                    </div>

                    {canShowMore ? (
                        <div className="mt-8 flex justify-center sm:mt-10">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={() =>
                                    setVisiblePages(
                                        (currentPage) => currentPage + 1,
                                    )
                                }
                                className="inline-flex items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-2 !text-size18 !font-bold !text-white hover:!brightness-105"
                                dir="rtl"
                            >
                                <span className="ml-3 inline-flex items-center justify-center rounded-full border-2 border-white px-1.5 py-0.5 text-size18 leading-none">
                                    +
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
