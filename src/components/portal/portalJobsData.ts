import companyImage from "../../assets/common/company_img.png"

export interface PortalJobListingItem {
    id: string
    companyName: string
    jobTitle: string
    location: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

export interface PortalJobDetailEntry {
    id: string
    label: string
    value: string
}

export interface PortalJobRecord extends PortalJobListingItem {
    category: string
    companyLegalName: string
    companyWebsite: string
    imageSrc: string
    imageAlt: string
    detailColumns: PortalJobDetailEntry[][]
}

export function getPortalJobPath(jobId: string) {
    return `/jobs/all?job=${jobId}`
}

function createDetailColumns(
    jobTitle: string,
    location: string,
    yearsOfExperience: string,
    jobType: string,
    minSalary: string,
    maxSalary: string,
): PortalJobDetailEntry[][] {
    return [
        [
            {
                id: "specialization",
                label: "التخصص",
                value: `تصميم ${jobTitle} | هويات بصرية`,
            },
            {
                id: "english-level",
                label: "مستوى اللغة الإنكليزية",
                value: "متقدم",
            },
            {
                id: "work-type",
                label: "نوع العمل",
                value: "دوام كامل",
            },
            {
                id: "working-hours",
                label: "ساعات العمل",
                value: "من 10:00 إلى 6:00",
            },
            {
                id: "experience",
                label: "سنوات الخبرة",
                value: yearsOfExperience,
            },
            {
                id: "job-mode",
                label: "نوع الوظيفة",
                value: jobType,
            },
        ],
        [
            {
                id: "education-level",
                label: "المستوى التعليمي المطلوب",
                value: "لا يوجد مستوى مطلوب",
            },
            {
                id: "seniority",
                label: "المستوى الوظيفي",
                value: "موظف | مدير فريق",
            },
            {
                id: "working-days",
                label: "أيام العمل",
                value: "من الأحد إلى الخميس",
            },
            {
                id: "cv-language",
                label: "لغة السيرة الذاتية",
                value: "عربي | إنكليزي",
            },
            {
                id: "location",
                label: "المكان",
                value: `الجمهورية العربية السورية - ${location}`,
            },
            {
                id: "min-salary",
                label: "الحد الأدنى للراتب",
                value: minSalary,
            },
            {
                id: "max-salary",
                label: "الحد الأعلى للراتب",
                value: maxSalary,
            },
        ],
        [
            {
                id: "job-summary",
                label: "ملخص الوظيفة والغرض منها",
                value: "لا يوجد مستوى مطلوب",
            },
            {
                id: "responsibilities",
                label: "المسؤوليات والواجبات",
                value: "موظف | مدير فريق",
            },
            {
                id: "qualifications",
                label: "المؤهلات والمهارات",
                value: "من الأحد إلى الخميس",
            },
            {
                id: "requirements",
                label: "شروط ومتطلبات الوظيفة",
                value: "عربي | إنكليزي",
            },
        ],
    ]
}

export const portalJobRecords: PortalJobRecord[] = [
    {
        id: "al-mateen-graphic-designer",
        companyName: "شركة المتين",
        jobTitle: "مصمم غرافيك",
        location: "دمشق",
        to: getPortalJobPath("al-mateen-graphic-designer"),
        category: "التصميم",
        companyLegalName: "شركة المتين التجارية",
        companyWebsite: "AL-MATEN.CO",
        imageSrc: companyImage,
        imageAlt: "شركة المتين",
        detailColumns: createDetailColumns(
            "فوتوشوب",
            "دمشق",
            "3 سنوات",
            "ريموتلي",
            "500 دولار شهريًا",
            "1000 دولار شهريًا",
        ),
    },
    {
        id: "al-najah-ui-designer",
        companyName: "شركة النجاح",
        jobTitle: "مصمم واجهات",
        location: "حلب",
        to: getPortalJobPath("al-najah-ui-designer"),
        category: "التصميم",
        companyLegalName: "شركة النجاح التقنية",
        companyWebsite: "AL-NAJAH.IO",
        imageSrc: companyImage,
        imageAlt: "شركة النجاح",
        detailColumns: createDetailColumns(
            "واجهات المستخدم",
            "حلب",
            "سنتان",
            "هجين",
            "450 دولار شهريًا",
            "900 دولار شهريًا",
        ),
    },
    {
        id: "al-bayan-frontend",
        companyName: "شركة البيان",
        jobTitle: "مطور واجهات",
        location: "حمص",
        to: getPortalJobPath("al-bayan-frontend"),
        category: "البرمجة",
        companyLegalName: "شركة البيان الرقمية",
        companyWebsite: "ALBAYAN.DEV",
        imageSrc: companyImage,
        imageAlt: "شركة البيان",
        detailColumns: createDetailColumns(
            "تطوير الويب",
            "حمص",
            "4 سنوات",
            "دوام مكتبي",
            "700 دولار شهريًا",
            "1300 دولار شهريًا",
        ),
    },
    {
        id: "al-riyada-marketing",
        companyName: "شركة الريادة",
        jobTitle: "تسويق رقمي",
        location: "اللاذقية",
        to: getPortalJobPath("al-riyada-marketing"),
        category: "التسويق",
        companyLegalName: "شركة الريادة للتسويق",
        companyWebsite: "ALRIYADA.ADS",
        imageSrc: companyImage,
        imageAlt: "شركة الريادة",
        detailColumns: createDetailColumns(
            "التسويق الرقمي",
            "اللاذقية",
            "3 سنوات",
            "دوام كامل",
            "550 دولار شهريًا",
            "1100 دولار شهريًا",
        ),
    },
    {
        id: "al-afaq-content",
        companyName: "شركة الآفاق",
        jobTitle: "كاتب محتوى",
        location: "دمشق",
        to: getPortalJobPath("al-afaq-content"),
        category: "كتابة المحتوى",
        companyLegalName: "شركة الآفاق الإعلامية",
        companyWebsite: "AFAQ.MEDIA",
        imageSrc: companyImage,
        imageAlt: "شركة الآفاق",
        detailColumns: createDetailColumns(
            "المحتوى التحريري",
            "دمشق",
            "سنة واحدة",
            "ريموتلي",
            "400 دولار شهريًا",
            "850 دولار شهريًا",
        ),
    },
    {
        id: "al-qimma-support",
        companyName: "شركة القمة",
        jobTitle: "خدمة عملاء",
        location: "طرطوس",
        to: getPortalJobPath("al-qimma-support"),
        category: "خدمة العملاء",
        companyLegalName: "شركة القمة للخدمات",
        companyWebsite: "ALQIMMA.SERVICES",
        imageSrc: companyImage,
        imageAlt: "شركة القمة",
        detailColumns: createDetailColumns(
            "الدعم الفني",
            "طرطوس",
            "سنتان",
            "دوام كامل",
            "420 دولار شهريًا",
            "780 دولار شهريًا",
        ),
    },
    {
        id: "al-noor-accountant",
        companyName: "شركة النور",
        jobTitle: "محاسب",
        location: "حماة",
        to: getPortalJobPath("al-noor-accountant"),
        category: "المحاسبة",
        companyLegalName: "شركة النور المالية",
        companyWebsite: "ALNOOR.FINANCE",
        imageSrc: companyImage,
        imageAlt: "شركة النور",
        detailColumns: createDetailColumns(
            "المحاسبة المالية",
            "حماة",
            "3 سنوات",
            "دوام مكتبي",
            "650 دولار شهريًا",
            "1200 دولار شهريًا",
        ),
    },
    {
        id: "al-ibdaa-photographer",
        companyName: "شركة الإبداع",
        jobTitle: "مصور",
        location: "دمشق",
        to: getPortalJobPath("al-ibdaa-photographer"),
        category: "التصوير",
        companyLegalName: "شركة الإبداع البصري",
        companyWebsite: "IBDAA.STUDIO",
        imageSrc: companyImage,
        imageAlt: "شركة الإبداع",
        detailColumns: createDetailColumns(
            "التصوير التجاري",
            "دمشق",
            "سنتان",
            "هجين",
            "480 دولار شهريًا",
            "900 دولار شهريًا",
        ),
    },
    {
        id: "al-bunyan-analyst",
        companyName: "شركة البنيان",
        jobTitle: "محلل بيانات",
        location: "حمص",
        to: getPortalJobPath("al-bunyan-analyst"),
        category: "تحليل البيانات",
        companyLegalName: "شركة البنيان للتحليلات",
        companyWebsite: "BONYAN.AI",
        imageSrc: companyImage,
        imageAlt: "شركة البنيان",
        detailColumns: createDetailColumns(
            "تحليل البيانات",
            "حمص",
            "4 سنوات",
            "دوام كامل",
            "800 دولار شهريًا",
            "1500 دولار شهريًا",
        ),
    },
    {
        id: "al-mateen-graphic-designer-2",
        companyName: "شركة المتين",
        jobTitle: "مصمم غرافيك",
        location: "دمشق",
        to: getPortalJobPath("al-mateen-graphic-designer"),
        category: "التصميم",
        companyLegalName: "شركة المتين التجارية",
        companyWebsite: "AL-MATEN.CO",
        imageSrc: companyImage,
        imageAlt: "شركة المتين",
        detailColumns: createDetailColumns(
            "الإعلانات البصرية",
            "دمشق",
            "3 سنوات",
            "ريموتلي",
            "500 دولار شهريًا",
            "1000 دولار شهريًا",
        ),
    },
]
