import { type ReactNode, useEffect, useMemo, useState } from "react"
import { Bell, ChevronDown, Menu, X } from "lucide-react"

import blueLogo from "../../assets/icons/blue_logo.png"
// import whiteLogo from "../../assets/icons/white_logo.png";
import { cn } from "../../utils/cn"

export type PortalRole = "user" | "company"

interface PortalNavChild {
    id: string
    label: string
}

interface PortalNavItem {
    id: string
    label: string
    children?: PortalNavChild[]
}

interface PortalFooterLink {
    id: string
    label: string
}

interface PortalFooterSection {
    title: string
    links: PortalFooterLink[]
}

interface PortalRoleConfig {
    navItems: PortalNavItem[]
    footerSections: PortalFooterSection[]
}

interface PortalProfile {
    name: string
    tagline?: string
    avatarSrc?: string
    avatarLabel?: string
}

interface PortalLayoutProps {
    role: PortalRole
    activePageId: string
    children: ReactNode
    onPageChange?: (pageId: string) => void
    profile?: PortalProfile
    className?: string
    contentClassName?: string
}

export const defaultActivePageByRole: Record<PortalRole, string> = {
    user: "jobs-all",
    company: "company-create-job",
}

export const homePageIdByRole: Record<PortalRole, string> = {
    user: "home",
    company: "company-home",
}

export const portalLayoutConfig: Record<PortalRole, PortalRoleConfig> = {
    user: {
        navItems: [
            { id: "home", label: "الرئيسية" },
            {
                id: "jobs",
                label: "الوظائف",
                children: [
                    { id: "jobs-all", label: "كافة الوظائف" },
                    { id: "jobs-categories", label: "كافة تصنيفات الوظائف" },
                    { id: "internships", label: "فرص التدريب" },
                    { id: "watchlist", label: "مراقبة" },
                ],
            },
            { id: "saved-jobs", label: "الوظائف المحفوظة" },
            { id: "companies", label: "الشركات" },
            { id: "career-guidance", label: "الإرشاد الوظيفي" },
        ],
        footerSections: [
            {
                title: "الوظائف",
                links: [
                    { id: "jobs-all", label: "عرض كافة الوظائف" },
                    { id: "jobs-categories", label: "عرض كافة التصنيفات" },
                    { id: "jobs", label: "الوظائف" },
                    { id: "internships", label: "عرض التدريبات" },
                ],
            },
            {
                title: "الشركات",
                links: [
                    { id: "companies-all", label: "عرض كافة الشركات" },
                    { id: "companies", label: "الشركات" },
                ],
            },
            {
                title: "الملف الشخصي",
                links: [
                    { id: "profile", label: "عرض الملف الشخصي" },
                    { id: "profile-edit", label: "تعديل الملف الشخصي" },
                    { id: "profile-settings", label: "الإعدادات الشخصية" },
                ],
            },
        ],
    },
    company: {
        navItems: [
            { id: "company-home", label: "الرئيسية" },
            {
                id: "company-create",
                label: "إنشاء",
                children: [
                    { id: "company-create-job", label: "وظيفة" },
                    { id: "company-create-training", label: "تدريب" },
                ],
            },
            { id: "company-jobs", label: "وظائفي" },
            { id: "company-applications", label: "الطلبات" },
            { id: "company-studies", label: "دراسات" },
            { id: "company-guidance", label: "إرشاد وظيفي" },
        ],
        footerSections: [
            {
                title: "الوظائف",
                links: [
                    { id: "company-all-jobs", label: "عرض كافة الوظائف" },
                    { id: "company-create-job", label: "إنشاء وظيفة" },
                    { id: "company-applications", label: "عرض طلبات التوظيف" },
                ],
            },
            {
                title: "التدريبات",
                links: [
                    {
                        id: "company-training-list",
                        label: "عرض كافة التدريبات",
                    },
                    { id: "company-create-training", label: "إنشاء التدريب" },
                    {
                        id: "company-training-applications",
                        label: "عرض طلبات التدريب",
                    },
                ],
            },
            {
                title: "الملف الشخصي",
                links: [
                    { id: "company-profile", label: "عرض الملف الشخصي" },
                    { id: "company-profile-edit", label: "تعديل الملف الشخصي" },
                    { id: "company-account", label: "إعدادات الحساب" },
                ],
            },
        ],
    },
}

const defaultProfileByRole: Record<PortalRole, PortalProfile> = {
    user: {
        name: "أحمد الرسول",
        tagline: "باحث عن فرصة مناسبة",
        avatarLabel: "أر",
    },
    company: {
        name: "Google",
        tagline: "لوحة إدارة الشركة",
        avatarLabel: "GO",
    },
}

const shellWidthClass = "container"

function getProfileInitials(name: string) {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")

    return initials || "و"
}

function findActiveParentItem(config: PortalRoleConfig, pageId: string) {
    return (
        config.navItems.find(
            (item) =>
                item.id === pageId ||
                item.children?.some((child) => child.id === pageId) === true,
        ) ?? null
    )
}

export function getPortalPageLabel(role: PortalRole, pageId: string) {
    const config = portalLayoutConfig[role]

    for (const item of config.navItems) {
        if (item.id === pageId) {
            return item.label
        }

        const activeChild = item.children?.find((child) => child.id === pageId)

        if (activeChild) {
            return activeChild.label
        }
    }

    for (const section of config.footerSections) {
        const activeLink = section.links.find((link) => link.id === pageId)

        if (activeLink) {
            return activeLink.label
        }
    }

    return undefined
}

export function PortalLayout({
    role,
    activePageId,
    children,
    onPageChange,
    profile,
    className,
    contentClassName,
}: PortalLayoutProps) {
    const config = portalLayoutConfig[role]
    const resolvedProfile = profile ?? defaultProfileByRole[role]
    const activeParentItem = useMemo(
        () => findActiveParentItem(config, activePageId),
        [activePageId, config],
    )
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(
        activeParentItem?.children ? activeParentItem.id : null,
    )

    useEffect(() => {
        setOpenDropdownId(
            activeParentItem?.children ? activeParentItem.id : null,
        )
    }, [activeParentItem, role])

    const closeMobileMenu = () => setMobileMenuOpen(false)

    const handleItemClick = (item: PortalNavItem) => {
        if (item.children?.length) {
            setOpenDropdownId((current) =>
                current === item.id ? null : item.id,
            )
            return
        }

        closeMobileMenu()
        setOpenDropdownId(null)
        onPageChange?.(item.id)
    }

    const handleChildClick = (parentId: string, childId: string) => {
        closeMobileMenu()
        setOpenDropdownId(parentId)
        onPageChange?.(childId)
    }

    const handleFooterLinkClick = (pageId: string) => {
        closeMobileMenu()
        onPageChange?.(pageId)
    }

    const avatarLabel =
        resolvedProfile.avatarLabel ?? getProfileInitials(resolvedProfile.name)

    return (
        <div
            className={cn(
                "min-h-svh bg-[radial-gradient(circle_at_top,rgb(0_172_193_/_9%),transparent_32%),linear-gradient(180deg,var(--background)_0%,#f7fafc_100%)] text-foreground",
                className,
            )}
            dir="rtl"
        >
            <div className="flex min-h-svh flex-col">
                <header className="sticky top-0 z-30 bg-[linear-gradient(90deg,#5679cf_0%,#426cc6_46%,var(--primary)_78%,var(--primary)_100%)] shadow-navbar-shadow">
                    <div
                        className={cn(
                            shellWidthClass,
                            "flex min-h-20 flex-wrap items-center gap-3 py-3 min-[1101px]:h-20 min-[1101px]:flex-nowrap min-[1101px]:py-0 max-[1100px]:gap-3 max-[1100px]:py-4",
                        )}
                    >
                        <button
                            type="button"
                            className="inline-flex h-[46px] w-[clamp(92px,8.5vw,118px)] shrink-0 cursor-pointer items-center justify-center rounded-[16px] bg-second-white-color px-[12px] py-[9px] shadow-[0_12px_24px_rgb(8_24_61_/_0.18)] hover:shadow-[0_14px_28px_rgb(8_24_61_/_0.22)] max-[1100px]:order-1  max-[1100px]:w-[102px] max-[1100px]:px-[10px] max-[1100px]:py-2 max-[640px]:w-[88px] max-[640px]:rounded-[14px] max-[640px]:px-[9px] max-[640px]:py-[7px]"
                            onClick={() =>
                                onPageChange?.(homePageIdByRole[role])
                            }
                            aria-label="وظيفتي"
                        >
                            <img
                                className="block h-[46px] w-full object-contain"
                                src={blueLogo}
                                alt="وظيفتي"
                            />
                        </button>

                        <button
                            type="button"
                            className="hidden size-[42px] cursor-pointer items-center justify-center rounded-xl border border-white/25 bg-white/10 text-inverse-fg  hover:bg-white/15 max-[1100px]:order-2 max-[1100px]:ms-auto max-[1100px]:inline-flex"
                            onClick={() =>
                                setMobileMenuOpen((current) => !current)
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-label={
                                mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"
                            }
                        >
                            {mobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                        <nav
                            className={cn(
                                "flex-1 items-center justify-center gap-2 max-[1100px]:order-4 max-[1100px]:w-full max-[1100px]:justify-stretch",
                                mobileMenuOpen
                                    ? "max-[1100px]:grid"
                                    : "max-[1100px]:hidden",
                                "min-[1101px]:flex min-[1101px]:h-full min-[1101px]:flex-nowrap",
                            )}
                            aria-label="التنقل الرئيسي"
                        >
                            {config.navItems.map((item) => {
                                const isActive =
                                    item.id === activeParentItem?.id ||
                                    item.children?.some(
                                        (child) => child.id === activePageId,
                                    ) === true
                                const isOpen = openDropdownId === item.id

                                return (
                                    <div
                                        key={item.id}
                                        className="relative max-[1100px]:w-full"
                                    >
                                        <button
                                            type="button"
                                            className={cn(
                                                "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent bg-transparent px-3.5 text-size14 font-semibold text-inverse-fg transition duration-200 hover:bg-white/15 max-[1100px]:w-full max-[1100px]:justify-between",
                                                isActive &&
                                                    "bg-white text-primary shadow-[0_8px_20px_rgb(10_27_62_/_0.18)]",
                                            )}
                                            onClick={() =>
                                                handleItemClick(item)
                                            }
                                            aria-expanded={
                                                item.children
                                                    ? isOpen
                                                    : undefined
                                            }
                                        >
                                            <span>{item.label}</span>
                                            {item.children ? (
                                                <ChevronDown
                                                    size={16}
                                                    className={cn(
                                                        "transition-transform duration-200",
                                                        isOpen && "rotate-180",
                                                    )}
                                                />
                                            ) : null}
                                        </button>

                                        {item.children?.length && isOpen ? (
                                            <div
                                                className="absolute top-full right-0 mt-2.5 grid min-w-[185px] gap-1.5 rounded-[14px] bg-[linear-gradient(180deg,#5a81d8_0%,var(--primary)_100%)] p-2 shadow-[0_14px_30px_rgb(8_25_57_/_0.28)] max-[1100px]:static max-[1100px]:mt-2.5 max-[1100px]:min-w-0"
                                                role="menu"
                                            >
                                                {item.children.map((child) => {
                                                    const childIsActive =
                                                        child.id ===
                                                        activePageId

                                                    return (
                                                        <button
                                                            key={child.id}
                                                            type="button"
                                                            className={cn(
                                                                "cursor-pointer rounded-[10px] bg-transparent px-[14px] py-[11px] text-center text-size14 text-inverse-fg transition duration-200 hover:bg-white/15",
                                                                childIsActive &&
                                                                    "bg-white/15",
                                                            )}
                                                            onClick={() =>
                                                                handleChildClick(
                                                                    item.id,
                                                                    child.id,
                                                                )
                                                            }
                                                        >
                                                            {child.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </nav>

                        <div className="flex shrink-0 items-center justify-start gap-3 max-[1100px]:order-3 max-[1100px]:w-full max-[1100px]:justify-between max-[640px]:flex-wrap">
                            <button
                                type="button"
                                className="inline-flex size-[38px] cursor-pointer items-center justify-center rounded-[10px] bg-transparent text-inverse-fg transition duration-200 hover:bg-white/15"
                                aria-label="الإشعارات"
                            >
                                <Bell size={17} />
                            </button>

                            <span
                                className="h-[26px] w-px bg-white/30 max-[640px]:hidden"
                                aria-hidden="true"
                            />

                            <div className="inline-flex items-center gap-[10px] max-[640px]:w-full max-[640px]:justify-start">
                                <div className="grid text-start leading-tight">
                                    <span className="text-size14 font-bold text-inverse-fg">
                                        {resolvedProfile.name}
                                    </span>
                                    {resolvedProfile.tagline ? (
                                        <span className="text-size10 text-white/70">
                                            {resolvedProfile.tagline}
                                        </span>
                                    ) : null}
                                </div>

                                {resolvedProfile.avatarSrc ? (
                                    <img
                                        className="size-9 rounded-full border-2 border-white/25 object-cover"
                                        src={resolvedProfile.avatarSrc}
                                        alt={resolvedProfile.name}
                                    />
                                ) : (
                                    <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-white/25 bg-[radial-gradient(circle_at_top,rgb(255_255_255_/_0.30),transparent_45%),rgb(255_255_255_/_0.16)] text-size12 font-bold text-inverse-fg">
                                        {avatarLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className={cn("flex-1", contentClassName)}>
                    <div className="min-h-[clamp(420px,60vh,760px)]">
                        {children}
                    </div>
                </main>

                <footer className="relative bg-[linear-gradient(180deg,#4b6fc7_0%,var(--primary)_100%)] py-8 pb-14 text-inverse-fg max-[960px]:pt-[84px]">
                    <div className={cn(shellWidthClass, "relative")}>
                        <div className="ml-auto mb-4 flex h-[77px] w-[clamp(92px,8.5vw,118px)] shrink-0 cursor-pointer items-center justify-center rounded-[16px] bg-second-white-color px-[12px] py-[9px] shadow-[0_12px_24px_rgb(8_24_61_/_0.18)] hover:shadow-[0_14px_28px_rgb(8_24_61_/_0.22)] max-[1100px]:w-[102px] max-[1100px]:px-[10px] max-[1100px]:py-2 max-[960px]:mx-auto max-[640px]:w-[88px] max-[640px]:rounded-[14px] max-[640px]:px-[9px] max-[640px]:py-[7px]">
                            <img
                                className="block h-[77px] w-full object-contain"
                                src={blueLogo}
                                alt="وظيفتي"
                            />
                        </div>

                        <div className="mb-4 border-t border-white/35" />

                        <div className="grid grid-cols-3 items-start gap-8 max-[960px]:grid-cols-1 max-[960px]:text-center">
                            {config.footerSections.map((section) => (
                                <section
                                    key={section.title}
                                    className="grid content-start self-start gap-[18px]"
                                >
                                    <h2 className="m-0 text-[clamp(1.35rem,1rem+0.8vw,1.9rem)] font-bold">
                                        {section.title}
                                    </h2>

                                    <div className="grid gap-3">
                                        {section.links.map((link) => (
                                            <button
                                                key={link.id}
                                                type="button"
                                                className={cn(
                                                    "justify-self-start cursor-pointer bg-transparent p-0 text-size15 text-white/80 transition duration-200 hover:-translate-x-1 hover:text-inverse-fg max-[960px]:justify-self-center max-[960px]:hover:translate-x-0",
                                                    link.id === activePageId &&
                                                        "-translate-x-1 text-inverse-fg max-[960px]:translate-x-0",
                                                )}
                                                onClick={() =>
                                                    handleFooterLinkClick(
                                                        link.id,
                                                    )
                                                }
                                            >
                                                {link.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
