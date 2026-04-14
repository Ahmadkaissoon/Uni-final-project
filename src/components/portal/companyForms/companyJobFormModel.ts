import companyImage from "../../../assets/common/company_img.png"
import type {
    PortalJobDetailEntry,
    PortalJobRecord,
} from "../portalJobsData"

export interface CompanyJobFormData {
    jobCategory: string
    jobTitle: string
    specialization: string
    workMode: string
    englishLevel: string
    jobType: string
    yearsExperience: string
    workingHours: string
    location: string
    workingDays: string
    educationLevel: string
    seniority: string
    cvLanguage: string
    minSalary: string
    maxSalary: string
    jobSummary: string
    responsibilities: string
    qualifications: string
    requirements: string
}

export interface CompanyJobRecordOptions {
    id?: string
    companyName?: string
    companyLegalName?: string
    companyWebsite?: string
    imageSrc?: string
    imageAlt?: string
}

export const emptyCompanyJobFormData: CompanyJobFormData = {
    jobCategory: "",
    jobTitle: "",
    specialization: "",
    workMode: "",
    englishLevel: "",
    jobType: "",
    yearsExperience: "",
    workingHours: "",
    location: "",
    workingDays: "",
    educationLevel: "",
    seniority: "",
    cvLanguage: "",
    minSalary: "",
    maxSalary: "",
    jobSummary: "",
    responsibilities: "",
    qualifications: "",
    requirements: "",
}

function normalizeSalaryValue(value: string, fallback: string) {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
        return fallback
    }

    if (/^\d+$/.test(trimmedValue)) {
        return `${trimmedValue} دولار شهريًا`
    }

    return trimmedValue
}

function getDetailValue(
    detailColumns: PortalJobDetailEntry[][],
    detailId: string,
    fallback = "",
) {
    return (
        detailColumns
            .flat()
            .find((detail) => detail.id === detailId)
            ?.value?.trim() ?? fallback
    )
}

export function buildCompanyJobDetailColumns(
    formData: CompanyJobFormData,
): PortalJobDetailEntry[][] {
    const resolvedLocation = formData.location.trim() || "دمشق"

    return [
        [
            {
                id: "specialization",
                label: "التخصص",
                value:
                    formData.specialization.trim() ||
                    `تصميم ${formData.jobTitle.trim() || "فوتوشوب"} | هويات بصرية`,
            },
            {
                id: "english-level",
                label: "مستوى اللغة الإنكليزية",
                value: formData.englishLevel.trim() || "متقدم",
            },
            {
                id: "work-type",
                label: "نوع العمل",
                value: formData.workMode.trim() || "دوام كامل",
            },
            {
                id: "working-hours",
                label: "ساعات العمل",
                value: formData.workingHours.trim() || "من 10:00 إلى 6:00",
            },
            {
                id: "experience",
                label: "سنوات الخبرة",
                value: formData.yearsExperience.trim() || "3 سنوات",
            },
            {
                id: "job-mode",
                label: "نوع الوظيفة",
                value: formData.jobType.trim() || "ريموتلي",
            },
        ],
        [
            {
                id: "education-level",
                label: "المستوى التعليمي المطلوب",
                value:
                    formData.educationLevel.trim() || "لا يوجد مستوى مطلوب",
            },
            {
                id: "seniority",
                label: "المستوى الوظيفي",
                value: formData.seniority.trim() || "موظف | مدير فريق",
            },
            {
                id: "working-days",
                label: "أيام العمل",
                value: formData.workingDays.trim() || "من الأحد إلى الخميس",
            },
            {
                id: "cv-language",
                label: "لغة السيرة الذاتية",
                value: formData.cvLanguage.trim() || "عربي | إنكليزي",
            },
            {
                id: "location",
                label: "المكان",
                value: `الجمهورية العربية السورية - ${resolvedLocation}`,
            },
            {
                id: "min-salary",
                label: "الحد الأدنى للراتب",
                value: normalizeSalaryValue(
                    formData.minSalary,
                    "500 دولار شهريًا",
                ),
            },
            {
                id: "max-salary",
                label: "الحد الأعلى للراتب",
                value: normalizeSalaryValue(
                    formData.maxSalary,
                    "1000 دولار شهريًا",
                ),
            },
        ],
        [
            {
                id: "job-summary",
                label: "ملخص الوظيفة والغرض منها",
                value:
                    formData.jobSummary.trim() ||
                    "نبحث عن شخص قادر على قيادة المهام اليومية بكفاءة، والتعاون مع الفريق لتحقيق أهداف القسم بأعلى جودة ممكنة.",
            },
            {
                id: "responsibilities",
                label: "المسؤوليات والواجبات",
                value:
                    formData.responsibilities.trim() ||
                    "إدارة المهام اليومية، التنسيق مع الفريق، متابعة التسليمات، وتحسين جودة المخرجات بشكل مستمر.",
            },
            {
                id: "qualifications",
                label: "المؤهلات والمهارات",
                value:
                    formData.qualifications.trim() ||
                    "مهارات تواصل قوية، خبرة عملية مناسبة، قدرة على حل المشكلات، وإتقان الأدوات الأساسية المرتبطة بالمجال.",
            },
            {
                id: "requirements",
                label: "شروط ومتطلبات الوظيفة",
                value:
                    formData.requirements.trim() ||
                    "الالتزام بالمواعيد، القدرة على العمل ضمن فريق، توفر إنترنت مستقر، والجاهزية للتعلم والتطور المستمر.",
            },
        ],
    ]
}

export function buildCompanyJobRecord(
    formData: CompanyJobFormData,
    options: CompanyJobRecordOptions = {},
): PortalJobRecord {
    const resolvedCompanyName = options.companyName ?? "Google"
    const resolvedJobTitle = formData.jobTitle.trim() || "مصمم غرافيك"
    const resolvedLocation = formData.location.trim() || "دمشق"

    return {
        id: options.id ?? `company-created-job-${Date.now()}`,
        companyName: resolvedCompanyName,
        jobTitle: resolvedJobTitle,
        location: resolvedLocation,
        category: formData.jobCategory.trim() || "التصميم",
        companyLegalName: options.companyLegalName ?? "Google LLC",
        companyWebsite: options.companyWebsite ?? "GOOGLE.COM",
        imageSrc: options.imageSrc ?? companyImage,
        imageAlt: options.imageAlt ?? resolvedCompanyName,
        detailColumns: buildCompanyJobDetailColumns(formData),
    }
}

export function jobRecordToCompanyJobFormData(
    record: PortalJobRecord,
): CompanyJobFormData {
    return {
        jobCategory: record.category,
        jobTitle: record.jobTitle,
        specialization: getDetailValue(record.detailColumns, "specialization"),
        workMode: getDetailValue(record.detailColumns, "work-type"),
        englishLevel: getDetailValue(record.detailColumns, "english-level"),
        jobType: getDetailValue(record.detailColumns, "job-mode"),
        yearsExperience: getDetailValue(record.detailColumns, "experience"),
        workingHours: getDetailValue(record.detailColumns, "working-hours"),
        location: record.location,
        workingDays: getDetailValue(record.detailColumns, "working-days"),
        educationLevel: getDetailValue(
            record.detailColumns,
            "education-level",
        ),
        seniority: getDetailValue(record.detailColumns, "seniority"),
        cvLanguage: getDetailValue(record.detailColumns, "cv-language"),
        minSalary: getDetailValue(record.detailColumns, "min-salary"),
        maxSalary: getDetailValue(record.detailColumns, "max-salary"),
        jobSummary: getDetailValue(record.detailColumns, "job-summary"),
        responsibilities: getDetailValue(record.detailColumns, "responsibilities"),
        qualifications: getDetailValue(record.detailColumns, "qualifications"),
        requirements: getDetailValue(record.detailColumns, "requirements"),
    }
}
