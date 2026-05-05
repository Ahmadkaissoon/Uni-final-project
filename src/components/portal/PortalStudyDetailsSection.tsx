import {
    ArrowRight,
    BookOpenText,
    Building2,
    CalendarDays,
    Clock3,
    Globe,
    Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import type { PortalStudyRecord } from "./portalStudiesData"
import PortalStudyCard from "./PortalStudyCard"

interface PortalStudyDetailsSectionProps {
    title?: string
    description?: string
    study: PortalStudyRecord
    relatedStudies?: PortalStudyRecord[]
}

const sidebarMetaClassName =
    "flex items-center justify-between gap-4 rounded-[14px] border border-[#e8edf4] bg-[#f8fbff] px-4 py-3"

export default function PortalStudyDetailsSection({
    title = "الدراسات",
    description = "اطلع على كامل الدراسة والتفاصيل التي نشرتها الشركة ضمن منصة وظيفتي.",
    study,
    relatedStudies = [],
}: PortalStudyDetailsSectionProps) {
    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="border-r-[3px] border-warning-color pr-4 text-right sm:pr-6">
                            <h1 className="m-0 py-2 text-[32px] font-bold leading-[1.3] text-black sm:text-[42px]">
                                {title}
                            </h1>
                            <p className="mt-4 mb-0 max-w-[36ch] text-size20 font-medium leading-[1.95] text-black sm:text-size24">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_top_right,#6c93ef_0%,#2853b5_35%,#14316e_100%)] shadow-[0_24px_60px_rgba(14,35,59,0.18)]">
                        <div className="grid gap-8 px-6 py-8 text-white sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end lg:px-10">
                            <div className="text-right">
                                <div className="mb-4 flex flex-wrap justify-end gap-2">
                                    {study.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-size12 font-bold text-white/92"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="m-0 text-size16 font-semibold text-white/80">
                                    {study.companyName}
                                </p>

                                <h2 className="mt-3 mb-0 max-w-[18ch] text-[28px] font-bold leading-[1.45] sm:text-[34px] lg:text-[40px]">
                                    {study.studyTitle}
                                </h2>

                                <p className="mt-5 mb-0 max-w-[58ch] text-size18 font-medium leading-[1.9] text-white/90 sm:text-size20">
                                    {study.intro}
                                </p>

                                <div className="mt-6 flex flex-wrap justify-end gap-3 text-size14 font-semibold text-white/88">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                        <CalendarDays className="size-4" />
                                        {study.publishedAt}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                        <Clock3 className="size-4" />
                                        {study.readTime}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                        <Globe className="size-4" />
                                        {study.region}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden lg:flex lg:justify-start">
                                <div className="flex h-[188px] w-full max-w-[188px] items-center justify-center rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-sm">
                                    <div className="flex size-[126px] items-center justify-center rounded-full bg-white/14 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                                        <Building2 className="size-12 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
                        <article className="portal-category-card-shadow rounded-[26px] bg-white px-6 py-7 text-right sm:px-8 sm:py-9 lg:px-10">
                            <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#edf1f6] pb-6">
                                <div className="text-right">
                                    <p className="m-0 text-size14 font-bold text-warning-color">
                                        {study.companyName}
                                    </p>
                                    <h3 className="mt-2 mb-0 text-[24px] font-bold leading-[1.45] text-[#222935] sm:text-[30px]">
                                        {study.studyTitle}
                                    </h3>
                                </div>

                                <BookOpenText className="hidden size-10 shrink-0 text-[#2f60c5] sm:block" />
                            </div>

                            <div className="space-y-8">
                                {study.sections.map((section) => (
                                    <section
                                        key={section.id}
                                        className="border-b border-[#f1f3f7] pb-8 last:border-b-0 last:pb-0"
                                    >
                                        <h4 className="m-0 text-[22px] font-bold leading-[1.4] text-[#243043] sm:text-[26px]">
                                            {section.heading}
                                        </h4>

                                        <div className="mt-5 space-y-5 text-size18 font-medium leading-[2] text-[#3c4654]">
                                            {section.paragraphs.map(
                                                (paragraph, paragraphIndex) => (
                                                    <p
                                                        key={`${section.id}-paragraph-${paragraphIndex + 1}`}
                                                        className="m-0"
                                                    >
                                                        {paragraph}
                                                    </p>
                                                ),
                                            )}

                                            {section.quote ? (
                                                <blockquote className="m-0 rounded-[18px] border-r-[4px] border-warning-color bg-[#f8fbff] px-5 py-4 text-size18 font-bold leading-[1.9] text-[#24407b]">
                                                    {section.quote}
                                                </blockquote>
                                            ) : null}

                                            {section.bullets?.length ? (
                                                <ul className="m-0 grid gap-3 pr-5 text-size18 font-medium text-[#3c4654] marker:text-warning-color">
                                                    {section.bullets.map(
                                                        (bullet) => (
                                                            <li key={bullet}>
                                                                {bullet}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </article>

                        <aside className="grid content-start gap-6">
                            <div className="portal-category-card-shadow rounded-[24px] bg-white p-6 text-right sm:p-7">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <Sparkles className="size-8 text-warning-color" />
                                    <h3 className="m-0 text-[22px] font-bold text-[#253044]">
                                        بطاقة المقال
                                    </h3>
                                </div>

                                <div className="grid gap-3">
                                    <div className={sidebarMetaClassName}>
                                        <span className="font-bold text-[#273246]">
                                            {study.companyName}
                                        </span>
                                        <span className="text-size14 font-medium text-[#6c7786]">
                                            الجهة الناشرة
                                        </span>
                                    </div>

                                    <div className={sidebarMetaClassName}>
                                        <span className="font-bold text-[#273246]">
                                            {study.publishedAt}
                                        </span>
                                        <span className="text-size14 font-medium text-[#6c7786]">
                                            تاريخ النشر
                                        </span>
                                    </div>

                                    <div className={sidebarMetaClassName}>
                                        <span className="font-bold text-[#273246]">
                                            {study.readTime}
                                        </span>
                                        <span className="text-size14 font-medium text-[#6c7786]">
                                            مدة القراءة
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to="/company/studies"
                                    className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center rounded-[10px] border border-warning-color bg-warning-color px-5 py-3 text-size16 font-bold text-white transition duration-200 hover:brightness-105"
                                >
                                    <ArrowRight className="ml-3 size-5" />
                                    العودة إلى المقالات
                                </Link>
                            </div>

                            <div className="portal-category-card-shadow rounded-[24px] bg-white p-6 text-right sm:p-7">
                                <h3 className="m-0 text-[22px] font-bold text-[#253044]">
                                    مؤشرات سريعة
                                </h3>

                                <div className="mt-5 grid gap-3">
                                    {study.keyStats.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-[16px] border border-[#e7edf5] bg-[#fbfcff] px-4 py-4"
                                        >
                                            <p className="m-0 text-size14 font-medium text-[#778394]">
                                                {item.label}
                                            </p>
                                            <p className="mt-2 mb-0 text-[24px] font-bold text-[#23479c]">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {relatedStudies.length ? (
                        <section className="mt-12 sm:mt-16">
                            <div className="mb-8 flex justify-start">
                                <div className="inline-flex flex-col items-start">
                                    <h3 className="m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[34px]">
                                        اقرأ أيضًا
                                    </h3>
                                    <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
                                </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                {relatedStudies.map((relatedStudy) => (
                                    <PortalStudyCard
                                        key={relatedStudy.id}
                                        companyName={relatedStudy.companyName}
                                        studyTitle={relatedStudy.studyTitle}
                                        excerpt={relatedStudy.excerpt}
                                        to={`/company/studies?article=${relatedStudy.id}`}
                                    />
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
