import companyImage from "../../assets/common/company_img.png"

export interface PortalInternshipListingItem {
    id: string
    companyName: string
    trainingType: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to?: string
    href?: string
    target?: string
    rel?: string
}

export interface PortalInternshipQuickFact {
    id: string
    label: string
    value: string
    iconName?: "briefcase" | "clock" | "calendar" | "badge"
}

export interface PortalInternshipRecord extends PortalInternshipListingItem {
    companyLegalName: string
    companyWebsite: string
    location: string
    companyPageTo?: string
    imageSrc: string
    imageAlt: string
    overview: string
    quickFacts: PortalInternshipQuickFact[]
    responsibilities: string[]
    skills: string[]
    requirements: string[]
    relatedInternshipIds: string[]
}

export function getPortalInternshipPath(trainingId: string) {
    return `/jobs/internships/details?training=${trainingId}`
}

function createQuickFacts(
    typeValue: string,
    durationValue: string,
    scheduleValue: string,
    rewardValue: string,
): PortalInternshipQuickFact[] {
    return [
        {
            id: "type",
            label: "النوع",
            value: typeValue,
            iconName: "briefcase",
        },
        {
            id: "duration",
            label: "المدة",
            value: durationValue,
            iconName: "clock",
        },
        {
            id: "schedule",
            label: "الدوام",
            value: scheduleValue,
            iconName: "calendar",
        },
        {
            id: "reward",
            label: "المكافأة",
            value: rewardValue,
            iconName: "badge",
        },
    ]
}

const sharedResponsibilities = [
    "دعم عمليات التوظيف من خلال مراحل التدريب اليومية",
    "إعداد تقارير أسبوعية مبسطة حول تقدم القسم",
    "المشاركة في اجتماعات الفريق وتوثيق الملاحظات",
    "تحديث قواعد بيانات الموارد البشرية",
]

const sharedSkills = [
    "دعم عمليات التوجيه من خلال مراحل التدريب اليومية",
    "إعداد تقارير أسبوعية مبسطة حول تقدم القسم",
    "المشاركة في اجتماعات الفريق وتوثيق الملاحظات",
    "تحسين قواعد بيانات الموارد البشرية",
]

const sharedRequirements = [
    "دعم عمليات التوجيه من خلال مراحل التدريب اليومية",
    "إعداد تقارير أسبوعية مبسطة حول تقدم القسم",
    "المشاركة في اجتماعات الفريق وتوثيق الملاحظات",
    "تحسين قواعد بيانات الموارد البشرية",
]

export const portalInternshipRecords: PortalInternshipRecord[] = [
    {
        id: "al-mateen-hr-trainee",
        companyName: "شركة المتين",
        trainingType: "متدرب موارد بشرية - HR",
        to: getPortalInternshipPath("al-mateen-hr-trainee"),
        companyLegalName: "شركة المتين التجارية",
        companyWebsite: "AL-MATEN.CO",
        location: "حمص - سوريا",
        companyPageTo: "/companies/all",
        imageSrc: companyImage,
        imageAlt: "شركة المتين",
        overview:
            "يهدف هذا البرنامج التدريبي إلى منح المتدرب تجربة عملية في مجال الموارد البشرية من خلال المشاركة في المهام اليومية وتطوير المهارات الأساسية لإدارة الموظفين وتنظيم العمليات الإدارية. سيتعرّف المتدرب على بيئة العمل الاحترافية ويتفاعل مع فريق الشركة بشكل مباشر.",
        quickFacts: createQuickFacts(
            "لا يوجد مستوى مطلوب",
            "موظف | مدير فريق",
            "من الأحد إلى الخميس",
            "عربي | إنكليزي",
        ),
        responsibilities: sharedResponsibilities,
        skills: sharedSkills,
        requirements: sharedRequirements,
        relatedInternshipIds: [
            "al-noor-ui-trainee",
            "al-madaar-frontend-trainee",
            "al-afaq-content-trainee",
        ],
    },
    {
        id: "al-noor-ui-trainee",
        companyName: "شركة النور",
        trainingType: "متدرب UI/UX",
        to: getPortalInternshipPath("al-noor-ui-trainee"),
        companyLegalName: "شركة النور التقنية",
        companyWebsite: "ALNOOR.UI",
        location: "دمشق - سوريا",
        companyPageTo: "/companies/all",
        imageSrc: companyImage,
        imageAlt: "شركة النور",
        overview:
            "فرصة تدريب عملية ضمن فريق التصميم لتعلم أساسيات تجربة المستخدم وبناء الواجهات، مع متابعة مباشرة من فريق الشركة والعمل على مهام يومية واقعية.",
        quickFacts: createQuickFacts(
            "مستوى مبتدئ",
            "3 أشهر",
            "دوام جزئي",
            "شهادة + مكافأة رمزية",
        ),
        responsibilities: sharedResponsibilities,
        skills: sharedSkills,
        requirements: sharedRequirements,
        relatedInternshipIds: [
            "al-mateen-hr-trainee",
            "al-madaar-frontend-trainee",
            "al-afaq-content-trainee",
        ],
    },
    {
        id: "al-madaar-frontend-trainee",
        companyName: "شركة المدار",
        trainingType: "متدرب تطوير واجهات",
        to: getPortalInternshipPath("al-madaar-frontend-trainee"),
        companyLegalName: "شركة المدار الرقمية",
        companyWebsite: "ALMADAAR.DEV",
        location: "حلب - سوريا",
        companyPageTo: "/companies/all",
        imageSrc: companyImage,
        imageAlt: "شركة المدار",
        overview:
            "برنامج تدريبي مخصص للراغبين في تعلّم بناء واجهات الويب الحديثة، مع مهام تطبيقية ومراجعات أسبوعية من الفريق التقني.",
        quickFacts: createQuickFacts(
            "مبتدئ إلى متوسط",
            "4 أشهر",
            "هجين",
            "مكافأة شهرية",
        ),
        responsibilities: sharedResponsibilities,
        skills: sharedSkills,
        requirements: sharedRequirements,
        relatedInternshipIds: [
            "al-noor-ui-trainee",
            "al-afaq-content-trainee",
            "al-ibdaa-marketing-trainee",
        ],
    },
    {
        id: "al-afaq-content-trainee",
        companyName: "شركة الآفاق",
        trainingType: "متدرب كتابة محتوى",
        to: getPortalInternshipPath("al-afaq-content-trainee"),
        companyLegalName: "شركة الآفاق الإعلامية",
        companyWebsite: "AFAQ.MEDIA",
        location: "دمشق - سوريا",
        companyPageTo: "/companies/all",
        imageSrc: companyImage,
        imageAlt: "شركة الآفاق",
        overview:
            "تدريب عملي لتعلّم كتابة المحتوى التسويقي والتحريري وصياغة النصوص الرقمية ضمن بيئة عمل فعلية ومتابعة من المحررين.",
        quickFacts: createQuickFacts(
            "لا يشترط خبرة",
            "شهران",
            "ريموت",
            "شهادة إتمام",
        ),
        responsibilities: sharedResponsibilities,
        skills: sharedSkills,
        requirements: sharedRequirements,
        relatedInternshipIds: [
            "al-mateen-hr-trainee",
            "al-noor-ui-trainee",
            "al-ibdaa-marketing-trainee",
        ],
    },
    {
        id: "al-ibdaa-marketing-trainee",
        companyName: "شركة الإبداع",
        trainingType: "متدرب تسويق رقمي",
        to: getPortalInternshipPath("al-ibdaa-marketing-trainee"),
        companyLegalName: "شركة الإبداع للتسويق",
        companyWebsite: "IBDAA.ADS",
        location: "اللاذقية - سوريا",
        companyPageTo: "/companies/all",
        imageSrc: companyImage,
        imageAlt: "شركة الإبداع",
        overview:
            "برنامج تدريبي لتعلّم أساسيات التسويق الرقمي، إدارة الحملات، وقياس الأداء بالتعاون مع فريق التسويق داخل الشركة.",
        quickFacts: createQuickFacts(
            "مبتدئ",
            "3 أشهر",
            "دوام جزئي",
            "مكافأة رمزية",
        ),
        responsibilities: sharedResponsibilities,
        skills: sharedSkills,
        requirements: sharedRequirements,
        relatedInternshipIds: [
            "al-afaq-content-trainee",
            "al-noor-ui-trainee",
            "al-madaar-frontend-trainee",
        ],
    },
]
