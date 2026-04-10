import type { ComponentType, ReactNode } from "react"
import ReactSlick, { type Settings } from "react-slick"

import PortalCompanyLogoSlide from "./PortalCompanyLogoSlide"

export interface PortalCompanyCarouselItem {
    id: string
    companyName: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

const defaultCompanies: PortalCompanyCarouselItem[] = [
    {
        id: "google",
        companyName: "Google",
        logoLabel: "GO",
        to: "/jobs/all?company=google",
    },
    {
        id: "microsoft",
        companyName: "Microsoft",
        logoLabel: "MS",
        to: "/jobs/all?company=microsoft",
    },
    {
        id: "amazon",
        companyName: "Amazon",
        logoLabel: "AM",
        to: "/jobs/all?company=amazon",
    },
    {
        id: "meta",
        companyName: "Meta",
        logoLabel: "ME",
        to: "/jobs/all?company=meta",
    },
    {
        id: "adobe",
        companyName: "Adobe",
        logoLabel: "AD",
        to: "/jobs/all?company=adobe",
    },
    {
        id: "spotify",
        companyName: "Spotify",
        logoLabel: "SP",
        to: "/jobs/all?company=spotify",
    },
    {
        id: "netflix",
        companyName: "Netflix",
        logoLabel: "NF",
        to: "/jobs/all?company=netflix",
    },
    {
        id: "oracle",
        companyName: "Oracle",
        logoLabel: "OR",
        to: "/jobs/all?company=oracle",
    },
]

interface PortalCompaniesCarouselSectionProps {
    title?: string
    companies?: PortalCompanyCarouselItem[]
}

type SlickSliderProps = Settings & {
    children?: ReactNode
}

type SlickComponent = ComponentType<SlickSliderProps>

type SlickModuleShape = {
    default?: SlickComponent | { default?: SlickComponent }
}

const reactSlickModule = ReactSlick as unknown as SlickModuleShape

const SliderComponent =
    (typeof reactSlickModule.default === "function"
        ? reactSlickModule.default
        : reactSlickModule.default?.default) ??
    (ReactSlick as unknown as SlickComponent)

const sliderSettings: Settings = {
    rtl: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    swipeToSlide: true,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 4,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 520,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
}

export default function PortalCompaniesCarouselSection({
    title = "الشركات",
    companies = defaultCompanies,
}: PortalCompaniesCarouselSectionProps) {
    return (
        <section className="my-12 sm:my-16" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <div className="mb-10 flex justify-start sm:mb-12">
                        <div className="inline-flex flex-col items-start">
                            <h2 className="m-0 text-[28px] font-bold leading-[1.3] text-black sm:text-[36px]">
                                {title}
                            </h2>
                            <span className="mt-4 block h-[3px] w-[110px] rounded-full bg-warning-color sm:w-[140px]" />
                        </div>
                    </div>

                    <div className="portal-companies-slider">
                        <SliderComponent {...sliderSettings}>
                            {companies.map((company) => (
                                <div key={company.id} className="px-3">
                                    <PortalCompanyLogoSlide
                                        companyName={company.companyName}
                                        logoSrc={company.logoSrc}
                                        logoAlt={company.logoAlt}
                                        logoLabel={company.logoLabel}
                                        to={company.to}
                                        href={company.href}
                                        target={company.target}
                                        rel={company.rel}
                                    />
                                </div>
                            ))}
                        </SliderComponent>
                    </div>
                </div>
            </div>
        </section>
    )
}
