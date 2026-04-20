interface PortalDetailBulletSectionProps {
    title: string
    items: string[]
}

export default function PortalDetailBulletSection({
    title,
    items,
}: PortalDetailBulletSectionProps) {
    return (
        <section className="text-right" dir="rtl">
            <div className="mb-4 inline-flex items-center border-r-[3px] border-warning-color p-2.5 min-[480px]:mb-5">
                <h3 className="m-0 text-[22px] font-bold text-black max-[400px]:text-[20px] sm:text-size30">
                    {title}
                </h3>
            </div>

            <ul className="m-0 grid gap-2.5 pr-4 text-sm leading-[1.9] text-black min-[480px]:gap-3 min-[480px]:pr-5 min-[480px]:text-size15 sm:text-size16">
                {items.map((item, index) => (
                    <li key={`${title}-${index + 1}`}>{item}</li>
                ))}
            </ul>
        </section>
    )
}
