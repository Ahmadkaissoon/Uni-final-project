import type { ReactNode } from "react"

import { cn } from "../../../utils/cn"

export const companyFormInputClassName =
    "h-[44px] w-full rounded-[8px] border border-[#565d67] bg-white px-4 text-right text-size15 text-[#2f333a] outline-none transition duration-200 placeholder:text-[#b9bec6] focus:border-[var(--main-color)]"

export const companyFormTextareaClassName =
    "min-h-[156px] w-full resize-none rounded-[14px] border border-[#565d67] bg-white px-4 py-3 text-right text-size15 text-[#2f333a] outline-none transition duration-200 placeholder:text-[#b9bec6] focus:border-[var(--main-color)]"

interface CompanyFieldLabelProps {
    label: string
    children: ReactNode
    className?: string
}

export function CompanyFieldLabel({
    label,
    children,
    className,
}: CompanyFieldLabelProps) {
    return (
        <label className={cn("grid gap-2.5 text-right", className)}>
            <span className="text-size18 font-semibold text-[#34363d]">
                {label}
            </span>
            {children}
        </label>
    )
}

interface CompanyFormHeadingProps {
    title: string
    description: string
}

export function CompanyFormHeading({
    title,
    description,
}: CompanyFormHeadingProps) {
    return (
        <div className="mb-10 flex justify-start sm:mb-12">
            <div className="border-r-[3px] border-warning-color pr-4 text-right sm:pr-6">
                <h1 className="m-0 py-2 text-[32px] font-bold leading-[1.3] text-black sm:text-[42px]">
                    {title}
                </h1>
                <p className="mt-4 mb-0 max-w-[34ch] text-size20 font-medium leading-[1.95] text-black sm:text-size24">
                    {description}
                </p>
            </div>
        </div>
    )
}
