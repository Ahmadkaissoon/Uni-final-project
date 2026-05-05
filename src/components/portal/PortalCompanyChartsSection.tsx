interface PortalCompanyChartPoint {
    label: string
    value: number
    color: string
}

interface PortalCompanyChartCard {
    id: string
    title: string
    summaryLabel?: string
    points: PortalCompanyChartPoint[]
}

interface PortalCompanyChartsSectionProps {
    title?: string
    cards?: PortalCompanyChartCard[]
}

const defaultChartCards: PortalCompanyChartCard[] = [
    {
        id: "job-offers",
        title: "عروضات التوظيف",
        summaryLabel: "إجمالي العروض",
        points: [
            { label: "تطوير برمجيات", value: 12, color: "#68c3b8" },
            { label: "تصميم", value: 9, color: "#5e86ff" },
            { label: "تحليل بيانات", value: 7, color: "#7868dc" },
            { label: "تسويق رقمي", value: 6, color: "#d75b94" },
            { label: "مبيعات", value: 4, color: "#f0a137" },
            { label: "دعم وتشغيل", value: 4, color: "#efc73d" },
        ],
    },
    {
        id: "training-offers",
        title: "عروضات التدريب",
        summaryLabel: "إجمالي الفرص",
        points: [
            { label: "تطوير واجهات", value: 8, color: "#68c3b8" },
            { label: "تحليل بيانات", value: 6, color: "#5e86ff" },
            { label: "تصميم UI/UX", value: 4, color: "#7868dc" },
            { label: "تسويق", value: 4, color: "#d75b94" },
            { label: "دعم فني", value: 3, color: "#f0a137" },
            { label: "كتابة محتوى", value: 3, color: "#efc73d" },
        ],
    },
]

function getChartTotal(points: PortalCompanyChartPoint[]) {
    return points.reduce((total, point) => total + point.value, 0)
}

function formatPercent(value: number, total: number) {
    if (total === 0) {
        return "0.0%"
    }

    return `${((value / total) * 100).toFixed(1)}%`
}

function buildDonutGradient(points: PortalCompanyChartPoint[]) {
    const total = getChartTotal(points)

    if (total === 0) {
        return "conic-gradient(#d9e1ea 0 100%)"
    }

    let progress = 0

    return `conic-gradient(from -90deg, ${points
        .map((point) => {
            const start = progress
            const end = progress + (point.value / total) * 100
            progress = end

            return `${point.color} ${start}% ${end}%`
        })
        .join(", ")})`
}

function PortalCompanyDonutChartCard({
    title,
    summaryLabel = "الإجمالي",
    points,
}: PortalCompanyChartCard) {
    const total = getChartTotal(points)
    const donutBackground = buildDonutGradient(points)

    return (
        <article className="portal-category-card-shadow rounded-[24px] border border-[#edf1f6] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-5 sm:p-7 lg:p-8">
            <div className="mb-6 inline-flex flex-col items-start sm:mb-8">
                <h3 className="m-0 text-[24px] font-bold leading-[1.3] text-black sm:text-[30px]">
                    {title}
                </h3>
                <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-center lg:gap-8">
                <div className="mx-auto flex items-center justify-center">
                    <div
                        className="relative size-[156px] rounded-full shadow-[0_18px_44px_rgba(0,71,171,0.14)]"
                        style={{ backgroundImage: donutBackground }}
                        role="img"
                        aria-label={`${title} بإجمالي ${total}`}
                    >
                        <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(228,234,241,0.96)]">
                            <span className="text-size12 font-semibold text-[#8a919c]">
                                {summaryLabel}
                            </span>
                            <strong className="mt-1 text-[34px] font-bold leading-none text-[#1e2735]">
                                {total}
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[18px] border border-[#edf1f6] bg-white">
                    <div className="grid grid-cols-[minmax(0,1fr)_72px_66px] border-b border-[#edf1f6] bg-[#f8fbff] px-4 py-3 text-size12 font-semibold text-[#7d8794] sm:px-5">
                        <span className="text-right">التصنيف</span>
                        <span className="text-center">العدد</span>
                        <span className="text-center">%</span>
                    </div>

                    <div className="divide-y divide-[#edf1f6]">
                        {points.map((point) => (
                            <div
                                key={point.label}
                                className="grid grid-cols-[minmax(0,1fr)_72px_66px] items-center px-4 py-3 text-size13 text-[#394150] sm:px-5"
                            >
                                <div className="flex items-center justify-start gap-3 text-right">
                                    <span
                                        className="size-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: point.color }}
                                        aria-hidden="true"
                                    />
                                    <span className="truncate font-medium">
                                        {point.label}
                                    </span>
                                </div>

                                <span className="text-center font-semibold text-[#1f2734]">
                                    {point.value}
                                </span>

                                <span className="text-center font-semibold text-[#1f2734]">
                                    {formatPercent(point.value, total)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function PortalCompanyChartsSection({
    title = "إحصائيات وتقارير",
    cards = defaultChartCards,
}: PortalCompanyChartsSectionProps) {
    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="inline-flex flex-col items-start">
                            <h2 className="m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[36px]">
                                {title}
                            </h2>
                            <span className="mt-4 block h-[3px] w-full rounded-full bg-warning-color" />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2 xl:gap-8">
                        {cards.map((card) => (
                            <PortalCompanyDonutChartCard
                                key={card.id}
                                {...card}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
