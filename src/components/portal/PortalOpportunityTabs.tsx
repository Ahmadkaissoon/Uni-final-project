export type PortalOpportunityTab = "jobs" | "trainings"

interface PortalOpportunityTabsProps {
    activeTab: PortalOpportunityTab
    onChange: (nextTab: PortalOpportunityTab) => void
    jobsLabel?: string
    trainingsLabel?: string
    className?: string
}

export default function PortalOpportunityTabs({
    activeTab,
    onChange,
    jobsLabel = "فرص عمل",
    trainingsLabel = "تدريبات",
    className,
}: PortalOpportunityTabsProps) {
    return (
        <div className={["flex flex-wrap items-center gap-3", className].join(" ")}>
            <button
                type="button"
                onClick={() => onChange("jobs")}
                className={cnOpportunityTabButton(activeTab === "jobs")}
            >
                {jobsLabel}
            </button>

            <button
                type="button"
                onClick={() => onChange("trainings")}
                className={cnOpportunityTabButton(activeTab === "trainings")}
            >
                {trainingsLabel}
            </button>
        </div>
    )
}

function cnOpportunityTabButton(isActive: boolean) {
    return [
        "inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full px-6 py-2 text-size13 font-bold transition duration-200",
        isActive
            ? "border border-[#2f5cb9] bg-[#2f5cb9] text-white shadow-[0_10px_24px_rgb(47_92_185_/_0.18)]"
            : "border border-[#2f5cb9] bg-white text-[#2f5cb9] hover:bg-[#f5f8ff]",
    ].join(" ")
}
