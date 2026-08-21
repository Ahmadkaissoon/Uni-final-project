import type { ComponentType, ReactNode } from "react"
import ReactSlick, { type Settings } from "react-slick"

import {
    getPortalCompanyPrimaryMatchKey,
    usePortalCompanies,
} from "../../api/portalCompanies"
import type { PortalCompanyDirectoryItem } from "./portalCompaniesData"
import { buildPortalCompanyJobsPath } from "./portalCompaniesData"
import PortalCompanyLogoSlide from "./PortalCompanyLogoSlide"
import PortalCompanyLogoSlideSkeleton from "./PortalCompanyLogoSlideSkeleton"

interface PortalCompaniesCarouselSectionProps {
    title?: string
    companies?: PortalCompanyDirectoryItem[]
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
    companies,
}: PortalCompaniesCarouselSectionProps) {
    const companiesQuery = usePortalCompanies()
    const resolvedCompanies = companies ?? companiesQuery.companies
    const isLoading = companies === undefined && companiesQuery.isLoading
    const isError = companies === undefined && companiesQuery.isError

    if (!isLoading && resolvedCompanies.length === 0 && !isError) {
        return null
    }

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

                    {isError ? (
                        <div className="portal-category-card-shadow rounded-[18px] bg-white px-6 py-10 text-center">
                            <p className="m-0 text-size18 font-bold text-black">
                                تعذر تحميل الشركات حالياً، يرجى المحاولة لاحقاً.
                            </p>
                        </div>
                    ) : (
                        <div className="portal-companies-slider">
                            <SliderComponent {...sliderSettings}>
                                {isLoading
                                    ? Array.from({ length: 6 }).map((_, index) => (
                                          <div
                                              key={`company-skeleton-${index + 1}`}
                                              className="px-3"
                                          >
                                              <PortalCompanyLogoSlideSkeleton
                                                  showCompanyName
                                                  className="min-h-[170px] !px-5 !py-5"
                                              />
                                          </div>
                                      ))
                                    : resolvedCompanies.map((company) => (
                                          <div key={company.id} className="px-3">
                                              <PortalCompanyLogoSlide
                                                  companyName={company.companyName}
                                                  logoSrc={company.logoSrc}
                                                  logoAlt={company.logoAlt}
                                                  logoLabel={company.logoLabel}
                                                  showCompanyName
                                                  className="min-h-[170px] !px-5 !py-5"
                                                  to={buildPortalCompanyJobsPath(
                                                      getPortalCompanyPrimaryMatchKey(
                                                          company,
                                                      ),
                                                  )}
                                              />
                                          </div>
                                      ))}
                            </SliderComponent>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
