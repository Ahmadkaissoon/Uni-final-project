import { Save, SendHorizontal, Undo2 } from "lucide-react"
import { useEffect, useMemo, useState, type FormEvent } from "react"

import { Button } from "../global/ui/button"
import {
    CompanyFieldLabel,
    CompanyFormHeading,
    companyFormInputClassName,
    companyFormTextareaClassName,
} from "./companyForms/companyFormPrimitives"
import type { CompanyTrainingFormData } from "./companyForms/companyTrainingFormModel"
import { emptyCompanyTrainingFormData } from "./companyForms/companyTrainingFormModel"

interface SelectOption {
    value: string
    label: string
}

export type PortalCompanyTrainingFormMode = "free" | "backend-constrained"

interface PortalCompanyTrainingFormProps {
    title?: string
    description?: string
    initialValues?: CompanyTrainingFormData
    resetValues?: CompanyTrainingFormData
    submitLabel?: string
    resetLabel?: string
    submitAction?: "send" | "save"
    isSubmitting?: boolean
    mode?: PortalCompanyTrainingFormMode
    categoryOptions?: string[]
    isCategoryOptionsLoading?: boolean
    categoryOptionsErrorMessage?: string
    onSubmit: (formData: CompanyTrainingFormData) => void | Promise<void>
}

const constrainedTraineeLevelOptions: SelectOption[] = [
    { value: "beginner", label: "مبتدئ" },
    { value: "intermediate", label: "متوسط" },
    { value: "advanced", label: "متقدم" },
]

interface SelectFieldProps<K extends keyof CompanyTrainingFormData> {
    field: K
    label: string
    value: CompanyTrainingFormData[K]
    options: SelectOption[]
    isDisabled?: boolean
    helperText?: string
    onChange: (field: K, value: CompanyTrainingFormData[K]) => void
}

function CompanySelectField<K extends keyof CompanyTrainingFormData>({
    field,
    label,
    value,
    options,
    isDisabled = false,
    helperText,
    onChange,
}: SelectFieldProps<K>) {
    return (
        <CompanyFieldLabel label={label}>
            <select
                value={value}
                onChange={(event) =>
                    onChange(field, event.target.value as CompanyTrainingFormData[K])
                }
                disabled={isDisabled}
                required
                className={companyFormInputClassName}
            >
                <option value="">اختر من القائمة</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {helperText ? (
                <span className="text-size13 font-medium text-[#5f6d82]">
                    {helperText}
                </span>
            ) : null}
        </CompanyFieldLabel>
    )
}

export default function PortalCompanyTrainingForm({
    title = "إضافة تدريب",
    description = "يمكنك إضافة تدريب تحتاجه في الشركة ليتواصل معك الراغبون بالتدريب",
    initialValues = emptyCompanyTrainingFormData,
    resetValues = emptyCompanyTrainingFormData,
    submitLabel = "إرسال الطلب",
    resetLabel = "إعادة تعيين",
    submitAction = "send",
    isSubmitting = false,
    mode = "free",
    categoryOptions = [],
    isCategoryOptionsLoading = false,
    categoryOptionsErrorMessage,
    onSubmit,
}: PortalCompanyTrainingFormProps) {
    const [formData, setFormData] = useState<CompanyTrainingFormData>(
        initialValues,
    )

    useEffect(() => {
        setFormData(initialValues)
    }, [initialValues])

    const isConstrainedMode = mode === "backend-constrained"

    const normalizedCategoryOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    categoryOptions
                        .map((option) => option.trim())
                        .filter(Boolean),
                ),
            ).map((option) => ({
                value: option,
                label: option,
            })),
        [categoryOptions],
    )

    const isCategorySelectionUnavailable =
        isConstrainedMode && normalizedCategoryOptions.length === 0

    const categoryHelperText = isConstrainedMode
        ? isCategoryOptionsLoading && normalizedCategoryOptions.length === 0
            ? "جاري تحميل تصنيفات التدريب من الخادم..."
            : categoryOptionsErrorMessage && normalizedCategoryOptions.length === 0
              ? categoryOptionsErrorMessage
              : "سيتم إرسال اسم التصنيف كما هو موجود في الباك."
        : undefined

    const updateField = <K extends keyof CompanyTrainingFormData>(
        field: K,
        value: CompanyTrainingFormData[K],
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
        void onSubmit(formData)
    }

    const submitIcon =
        submitAction === "save" ? (
            <Save className="ml-3 size-5" />
        ) : (
            <SendHorizontal className="ml-3 size-5" />
        )

    const isSubmitDisabled = isSubmitting || isCategorySelectionUnavailable

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
                            {isConstrainedMode ? (
                                <CompanySelectField
                                    field="trainingCategory"
                                    label="التصنيف التدريبي :"
                                    value={formData.trainingCategory}
                                    options={normalizedCategoryOptions}
                                    isDisabled={isSubmitDisabled}
                                    helperText={categoryHelperText}
                                    onChange={updateField}
                                />
                            ) : (
                                <CompanyFieldLabel label="التصنيف التدريبي :">
                                    <input
                                        value={formData.trainingCategory}
                                        onChange={(event) =>
                                            updateField(
                                                "trainingCategory",
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className={companyFormInputClassName}
                                    />
                                </CompanyFieldLabel>
                            )}

                            <CompanyFieldLabel label="المسمى التدريبي :">
                                <input
                                    value={formData.trainingTitle}
                                    onChange={(event) =>
                                        updateField(
                                            "trainingTitle",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            {isConstrainedMode ? (
                                <CompanySelectField
                                    field="traineeLevel"
                                    label="مستوى المتدربين :"
                                    value={formData.traineeLevel}
                                    options={constrainedTraineeLevelOptions}
                                    onChange={updateField}
                                />
                            ) : (
                                <CompanyFieldLabel label="مستوى المتدربين :">
                                    <input
                                        value={formData.traineeLevel}
                                        onChange={(event) =>
                                            updateField(
                                                "traineeLevel",
                                                event.target.value,
                                            )
                                        }
                                        className={companyFormInputClassName}
                                    />
                                </CompanyFieldLabel>
                            )}

                            <CompanyFieldLabel label="المدة التدريبية :">
                                <input
                                    value={formData.trainingDuration}
                                    onChange={(event) =>
                                        updateField(
                                            "trainingDuration",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="أيام التدريب :">
                                <input
                                    value={formData.trainingSchedule}
                                    onChange={(event) =>
                                        updateField(
                                            "trainingSchedule",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المكافأة التدريبية :">
                                <input
                                    value={formData.trainingReward}
                                    onChange={(event) =>
                                        updateField(
                                            "trainingReward",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="مكان التدريب :">
                                <input
                                    value={formData.trainingLocation}
                                    onChange={(event) =>
                                        updateField(
                                            "trainingLocation",
                                            event.target.value,
                                        )
                                    }
                                    required
                                    className={companyFormInputClassName}
                                />
                            </CompanyFieldLabel>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <CompanyFieldLabel label="عن التدريبات :">
                                <textarea
                                    value={formData.aboutTraining}
                                    onChange={(event) =>
                                        updateField(
                                            "aboutTraining",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="النص هنا"
                                    required
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المهام والمسؤوليات :">
                                <textarea
                                    value={formData.responsibilities}
                                    onChange={(event) =>
                                        updateField(
                                            "responsibilities",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="النص هنا"
                                    required
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="المهارات :">
                                <textarea
                                    value={formData.skills}
                                    onChange={(event) =>
                                        updateField("skills", event.target.value)
                                    }
                                    placeholder="النص هنا"
                                    required
                                    className={companyFormTextareaClassName}
                                />
                            </CompanyFieldLabel>

                            <CompanyFieldLabel label="الشروط :">
                                <textarea
                                    value={formData.conditions}
                                    onChange={(event) =>
                                        updateField("conditions", event.target.value)
                                    }
                                    placeholder="النص هنا"
                                    required
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
                                disabled={isSubmitting}
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#b43531] bg-[#c63a35] !px-5 !py-3 !text-size16 !font-bold !text-white hover:!brightness-105"
                            >
                                <Undo2 className="ml-3 size-5" />
                                {resetLabel}
                            </Button>

                            <Button
                                type="submit"
                                variant="panel"
                                size="normal"
                                loading={isSubmitting}
                                disabled={isSubmitDisabled}
                                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border border-[#4ea56e] bg-[#5ab37b] !px-5 !py-3 !text-size16 !font-bold !text-white hover:!brightness-105"
                            >
                                {!isSubmitting ? submitIcon : null}
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
