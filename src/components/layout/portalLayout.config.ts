import type { PortalRole } from "./PortalLayout"

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
                    {
                        id: "jobs-categories",
                        label: "كافة تصنيفات الوظائف",
                    },
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
                    {
                        id: "profile-settings",
                        label: "الإعدادات الشخصية",
                    },
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
                    {
                        id: "company-applications",
                        label: "عرض طلبات التوظيف",
                    },
                ],
            },
            {
                title: "التدريبات",
                links: [
                    {
                        id: "company-training-list",
                        label: "عرض كافة التدريبات",
                    },
                    {
                        id: "company-create-training",
                        label: "إنشاء التدريب",
                    },
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
                    {
                        id: "company-profile-edit",
                        label: "تعديل الملف الشخصي",
                    },
                    { id: "company-account", label: "إعدادات الحساب" },
                ],
            },
        ],
    },
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
