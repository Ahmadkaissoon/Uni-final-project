import { Save, SendHorizontal, Undo2 } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"

import { Button } from "../global/ui/button"
import {
    CompanyFieldLabel,
    CompanyFormHeading,
    companyFormInputClassName,
    companyFormTextareaClassName,
} from "./companyForms/companyFormPrimitives"
import type { CompanyJobFormData } from "./companyForms/companyJobFormModel"
import { emptyCompanyJobFormData } from "./companyForms/companyJobFormModel"

interface PortalCompanyJobFormProps {
    title?: string
    description?: string
    initialValues?: CompanyJobFormData
    resetValues?: CompanyJobFormData
    submitLabel?: string
    resetLabel?: string
    submitAction?: "send" | "save"
    onSubmit: (formData: CompanyJobFormData) => void
}

export default function PortalCompanyJobForm({
    title = "إضافة وظيفة",
    description = "يمكنك إضافة وظيفة تحتاجها في الشركة ليتواصل معك الراغبون بالعمل",
    initialValues = emptyCompanyJobFormData,
    resetValues = emptyCompanyJobFormData,
    submitLabel = "إرسال الطلب",
    resetLabel = "إعادة تعيين",
    submitAction = "send",
    onSubmit,
}: PortalCompanyJobFormProps) {
    const [formData, setFormData] = useState<CompanyJobFormData>(initialValues)

    useEffect(() => {
        setFormData(initialValues)
    }, [initialValues])

    const updateField = <K extends keyof CompanyJobFormData>(
        field: K,
        value: CompanyJobFormData[K],
    ) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const handleReset = () => {
        setFormData(resetValues)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit(formData)
    }

    const submitIcon =
        submitAction === "save" ? (
            <Save className="ml-3 size-5" />
        ) : (
            <SendHorizontal className="ml-3 size-5" />
        )

    return (
        <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
            <div className="portal-design-shell">
                <div className="portal-design-inset">
                    <CompanyFormHeading
                        title={title}
                        description={description}
                    />

                    <form onSubmit={handleSubmit} className="grid gap-10">
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            <CompanyFieldLabel label="التصنيف الوظيفي :">
                                <input
                                    value={formData.jobCategory}
                                    onChange={(event) =>
                                        updateField("jobCategory", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المسمى الوظيفي :">
                                <input
                                    value={formData.jobTitle}
                                    onChange={(event) =>
                                        updateField("jobTitle", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="التخصص :">
                                <input
                                    value={formData.specialization}
                                    onChange={(event) =>
                                        updateField(
                                            "specialization",
                                            event.target.value,
                                        )
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="نوع العمل :">
                                <input
                                    value={formData.workMode}
                                    onChange={(event) =>
                                        updateField("workMode", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="ساعات العمل :">
                                <input
                                    value={formData.workingHours}
                                    onChange={(event) =>
                                        updateField(
                                            "workingHours",
                                            event.target.value,
                                        )
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="سنوات الخبرة :">
                                <input
                                    value={formData.yearsExperience}
                                    onChange={(event) =>
                                        updateField(
                                            "yearsExperience",
                                            event.target.value,
                                        )
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="نوع الوظيفة :">
                                <input
                                    value={formData.jobType}
                                    onChange={(event) =>
                                        updateField("jobType", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="مستوى اللغة الإنكليزية :">
                                <input
                                    value={formData.englishLevel}
                                    onChange={(event) =>
                                        updateField(
                                            "englishLevel",
                                            event.target.value,
                                        )
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المستوى الوظيفي :">
                                <input
                                    value={formData.seniority}
                                    onChange={(event) =>
                                        updateField("seniority", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المستوى التعليمي المطلوب :">
                                <input
                                    value={formData.educationLevel}
                                    onChange={(event) =>
                                        updateField(
                                            "educationLevel",
                                            event.target.value,
                                        )
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="أيام العمل :">
                                <input
                                    value={formData.workingDays}
                                    onChange={(event) =>
                                        updateField("workingDays", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المكان :">
                                <input
                                    value={formData.location}
                                    onChange={(event) =>
                                        updateField("location", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="الحد الأدنى للراتب :">
                                <input
                                    value={formData.minSalary}
                                    onChange={(event) =>
                                        updateField("minSalary", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="الحد الأعلى للراتب :">
                                <input
                                    value={formData.maxSalary}
                                    onChange={(event) =>
                                        updateField("maxSalary", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="لغة السيرة الذاتية :">
                                <input
                                    value={formData.cvLanguage}
                                    onChange={(event) =>
                                        updateField("cvLanguage", event.target.value)
                                    }
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <CompanyFieldLabel label="ملخص الوظيفة والغرض منها :">
                                <textarea
                                    value={formData.jobSummary}
                                    onChange={(event) =>
                                        updateField("jobSummary", event.target.value)
                                    }
                                    placeholder="النص هنا"
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المسؤوليات والواجبات :">
                                <textarea
                                    value={formData.responsibilities}
                                    onChange={(event) =>
                                        updateField(
                                            "responsibilities",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="النص هنا"
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المؤهلات والمهارات :">
                                <textarea
                                    value={formData.qualifications}
                                    onChange={(event) =>
                                        updateField(
                                            "qualifications",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="النص هنا"
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="شروط ومتطلبات الوظيفة :">
                                <textarea
                                    value={formData.requirements}
                                    onChange={(event) =>
                                        updateField(
                                            "requirements",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="النص هنا"
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={handleReset}
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#b43531] bg-[#c63a35] !px-5 !py-3 !text-size16 !font-bold !text-white hover:!brightness-105"
                            >
                                <Undo2 className="ml-3 size-5" />
                                {resetLabel}
                            </Button>

                            <Button
                                type="submit"
                                variant="panel"
                                size="normal"
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#4ea56e] bg-[#5ab37b] !px-5 !py-3 !text-size16 !font-bold !text-white hover:!brightness-105"
                            >
                                {submitIcon}
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
