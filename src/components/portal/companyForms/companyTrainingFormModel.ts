import companyImage from "../../../assets/common/company_img.png"
import type {
    PortalTrainingDetailEntry,
    PortalTrainingRecord,
} from "../portalTrainingsData"

export interface CompanyTrainingFormData {
    trainingCategory: string
    trainingTitle: string
    traineeLevel: string
    trainingDuration: string
    trainingSchedule: string
    trainingReward: string
    trainingLocation: string
    aboutTraining: string
    responsibilities: string
    skills: string
    conditions: string
}

export interface CompanyTrainingRecordOptions {
    id?: string
    companyName?: string
    companyLegalName?: string
    companyWebsite?: string
    imageSrc?: string
    imageAlt?: string
}

export const emptyCompanyTrainingFormData: CompanyTrainingFormData = {
    trainingCategory: "",
    trainingTitle: "",
    traineeLevel: "",
    trainingDuration: "",
    trainingSchedule: "",
    trainingReward: "",
    trainingLocation: "",
    aboutTraining: "",
    responsibilities: "",
    skills: "",
    conditions: "",
}

function getDetailValue(
    detailColumns: PortalTrainingDetailEntry[][],
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

export function buildCompanyTrainingDetailColumns(
    formData: CompanyTrainingFormData,
): PortalTrainingDetailEntry[][] {
    return [
        [
            {
                id: "trainee-level",
                label: "مستوى المتدربين",
                value: formData.traineeLevel.trim() || "مبتدئ إلى متوسط",
            },
            {
                id: "training-schedule",
                label: "الدوام التدريبي",
                value: formData.trainingSchedule.trim() || "دوام جزئي",
            },
            {
                id: "training-duration",
                label: "المدة التدريبية",
                value: formData.trainingDuration.trim() || "3 أشهر",
            },
            {
                id: "training-reward",
                label: "المكافأة التدريبية",
                value: formData.trainingReward.trim() || "250 دولار شهريًا",
            },
        ],
        [
            {
                id: "training-location",
                label: "مكان التدريب",
                value: formData.trainingLocation.trim() || "دمشق - سوريا",
            },
            {
                id: "training-language",
                label: "لغة التدريب",
                value: "عربي | إنكليزي",
            },
            {
                id: "training-capacity",
                label: "عدد المتدربين المتوقع",
                value: "12 متدربًا",
            },
            {
                id: "completion-certificate",
                label: "شهادة الإتمام",
                value: "متاحة بعد إنهاء البرنامج",
            },
        ],
        [
            {
                id: "about-training",
                label: "عن التدريبات",
                value:
                    formData.aboutTraining.trim() ||
                    "برنامج تدريبي عملي يهدف إلى تطوير مهارات المتدربين وتأهيلهم للاندماج ضمن بيئة عمل احترافية في الشركة.",
            },
            {
                id: "responsibilities",
                label: "المهام والمسؤوليات",
                value:
                    formData.responsibilities.trim() ||
                    "تنفيذ المهام التدريبية اليومية، التعاون مع المشرفين، الالتزام بالخطة المحددة، والمشاركة في الأنشطة التطبيقية.",
            },
            {
                id: "skills",
                label: "المهارات",
                value:
                    formData.skills.trim() ||
                    "أساسيات جيدة في المجال، رغبة قوية بالتعلم، مهارات تواصل، والقدرة على العمل الجماعي.",
            },
            {
                id: "conditions",
                label: "الشروط",
                value:
                    formData.conditions.trim() ||
                    "الالتزام بالمواعيد، الجدية في التدريب، توفر حاسوب شخصي عند الحاجة، والاستعداد لاجتياز المهام التطبيقية.",
            },
        ],
    ]
}

export function buildCompanyTrainingRecord(
    formData: CompanyTrainingFormData,
    options: CompanyTrainingRecordOptions = {},
): PortalTrainingRecord {
    const resolvedCompanyName = options.companyName ?? "Google"

    return {
        id: options.id ?? `company-created-training-${Date.now()}`,
        companyName: resolvedCompanyName,
        trainingTitle:
            formData.trainingTitle.trim() || "تدريب تصميم واجهات",
        trainingCategory: formData.trainingCategory.trim() || "التصميم",
        companyLegalName: options.companyLegalName ?? "Google LLC",
        companyWebsite: options.companyWebsite ?? "GOOGLE.COM",
        imageSrc: options.imageSrc ?? companyImage,
        imageAlt: options.imageAlt ?? resolvedCompanyName,
        detailColumns: buildCompanyTrainingDetailColumns(formData),
    }
}

export function trainingRecordToCompanyTrainingFormData(
    record: PortalTrainingRecord,
): CompanyTrainingFormData {
    return {
        trainingCategory: record.trainingCategory,
        trainingTitle: record.trainingTitle,
        traineeLevel: getDetailValue(record.detailColumns, "trainee-level"),
        trainingDuration: getDetailValue(record.detailColumns, "training-duration"),
        trainingSchedule: getDetailValue(record.detailColumns, "training-schedule"),
        trainingReward: getDetailValue(record.detailColumns, "training-reward"),
        trainingLocation: getDetailValue(record.detailColumns, "training-location"),
        aboutTraining: getDetailValue(record.detailColumns, "about-training"),
        responsibilities: getDetailValue(record.detailColumns, "responsibilities"),
        skills: getDetailValue(record.detailColumns, "skills"),
        conditions: getDetailValue(record.detailColumns, "conditions"),
    }
}
