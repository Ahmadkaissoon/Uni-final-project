import type { ReactNode } from "react"
import { Search } from "lucide-react"

import heroImage from "../../assets/hero.png"
import { cn } from "../../utils/cn"
import { Button } from "../global/ui/button"

interface PortalHeroProps {
    eyebrow?: string
    title: string
    description: string
    actionLabel: string
    actionIcon?: ReactNode
    onAction?: () => void
    backgroundImageSrc?: string
    minHeightClassName?: string
    className?: string
    children?: ReactNode
}

export default function PortalHero({
    eyebrow,
    title,
    description,
    actionLabel,
    actionIcon,
    onAction,
    backgroundImageSrc = heroImage,
    minHeightClassName,
    className,
    children,
}: PortalHeroProps) {
    return (
        <section
            className={cn(
                "relative isolate w-full overflow-hidden bg-[#111] min-h-[360px] sm:min-h-[430px] lg:min-h-[525px]",
                className,
            )}
            dir="rtl"
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageSrc})` }}
                aria-hidden="true"
            />

            <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgb(7_10_15_/_0.12)_0%,rgb(7_10_15_/_0.28)_45%,rgb(7_10_15_/_0.66)_70%,rgb(7_10_15_/_0.82)_100%)]"
                aria-hidden="true"
            />

            <div
                className="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_0_0_/_0.24),rgb(0_0_0_/_0.24))]"
                aria-hidden="true"
            />

            <div className="portal-design-shell relative z-10">
                <div className="portal-design-inset">
                    <div
                        className={cn(
                            "flex min-h-[360px] items-center justify-start py-10 sm:min-h-[430px] sm:py-14 lg:min-h-[525px] lg:py-20",
                            minHeightClassName,
                        )}
                    >
                        <div className="w-full max-w-[34rem] text-right text-white max-[640px]:max-w-full">
                            {eyebrow ? (
                                <p className="mb-3 text-size13 font-medium text-white/72 sm:text-size14">
                                    {eyebrow}
                                </p>
                            ) : null}

                            <div className="mb-7 inline-flex max-w-full flex-col items-end sm:mb-10 lg:mb-12">
                                <h1 className="m-0 text-[28px] font-bold leading-[1.35] sm:text-[34px] lg:text-[40px]">
                                    {title}
                                </h1>
                                <span className="mt-4 block h-[3px] w-full max-w-full rounded-full bg-warning-color  " />
                            </div>

                            <p className="m-0 max-w-[28ch] text-size16 font-medium leading-[1.9] text-white/90 sm:text-size18 lg:text-size24">
                                {description}
                            </p>

                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={onAction}
                                className="mt-6 inline-flex !h-auto max-w-full cursor-pointer items-center rounded-[8px] border border-warning-color bg-warning-color !px-4 !py-3 !font-bold !text-white hover:!brightness-105 sm:mt-7 sm:!px-5 sm:!py-4"
                            >
                                <span className="mr-3 inline-flex items-center justify-center scale-x-[-1] [&_svg]:size-[30px]">
                                    {actionIcon ?? <Search size={30} />}
                                </span>
                                <span className="inline-flex items-center pr-3 text-size14 sm:text-size15">
                                    {actionLabel}
                                </span>
                            </Button>

                            {children ? (
                                <div className="mt-6">{children}</div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
