import { Camera, ChevronDown, Plus, SendHorizontal, Trash2 } from "lucide-react"
import {
    type ChangeEvent,
    type ReactNode,
    useMemo,
    useRef,
    useState,
} from "react"

import type {
    PortalSeekerLanguage,
    PortalSeekerProfileFormData,
    PortalSeekerProfileSubmitPayload,
} from "../../api/portalSeekerProfile"
import { cn } from "../../utils/cn"
import { Button } from "../global/ui/button"
import { Skeleton } from "../global/ui/skeleton"

const fieldInputClassName =
    "h-[42px] w-full rounded-[6px] border border-[#6175a7] bg-white px-3 text-right text-size14 text-[#1d2b4a] shadow-[0_3px_8px_rgba(0,0,0,0.12)] outline-none transition duration-200 placeholder:text-[#8b98b8] focus:border-[#3458a6]"

const fieldReadonlyClassName =
    "cursor-default border-[#6e82b2] bg-white text-[#1d2b4a] opacity-100"

const sectionClassName =
    "rounded-[4px] bg-[#6f8fd4] px-3 py-4 shadow-[0_8px_18px_rgba(11,36,88,0.22)] sm:px-4"

const selectOptions = {
    gender: [
        { value: "male", label: "ذكر" },
        { value: "female", label: "أنثى" },
    ],
    jobLevel: [
        { value: "junior", label: "مبتدئ" },
        { value: "mid-level", label: "متوسط" },
        { value: "senior", label: "متقدم" },
        { value: "lead", label: "قائد فريق" },
    ],
    workType: [
        { value: "full-time", label: "دوام كامل" },
        { value: "part-time", label: "دوام جزئي" },
        { value: "remote", label: "عن بعد" },
        { value: "hybrid", label: "هجين" },
        { value: "freelance", label: "عمل حر" },
    ],
    degree: [
        { value: "High School", label: "ثانوية" },
        { value: "Diploma", label: "دبلوم" },
        { value: "Bachelor", label: "بكالوريوس" },
        { value: "Master", label: "ماجستير" },
        { value: "PhD", label: "دكتوراه" },
    ],
    languageLevel: [
        { value: "native", label: "لغة أم" },
        { value: "fluent", label: "طليق" },
        { value: "intermediate", label: "متوسط" },
        { value: "basic", label: "أساسي" },
    ],
} as const

type FeedbackState = {
    type: "success" | "info" | "error"
    message: string
} | null

interface PortalSeekerProfileSectionProps {
    pageTitle?: string
    mode?: "editable" | "readonly"
    profile: PortalSeekerProfileFormData | null
    email?: string
    avatarSrc?: string | null
    isLoading?: boolean
    isSaving?: boolean
    errorMessage?: string | null
    onRetry?: () => void
    onSave?: (payload: PortalSeekerProfileSubmitPayload) => Promise<{
        formData: PortalSeekerProfileFormData
        avatarSrc: string | null
    }>
    topActions?: ReactNode
}

function createEmptyLanguage(): PortalSeekerLanguage {
    return {
        language: "",
        level: "basic",
    }
}

function cloneFormData(
    profile: PortalSeekerProfileFormData | null,
): PortalSeekerProfileFormData {
    if (!profile) {
        return {
            fullName: "",
            gender: "",
            birthDate: "",
            phone: "",
            country: "",
            city: "",
            address: "",
            jobLevel: "",
            yearsOfExperience: "",
            lastCompanyName: "",
            workType: "",
            lastDegree: "",
            specialization: "",
            university: "",
            graduationYear: "",
            personalWebsite: "",
            linkedin: "",
            github: "",
            languages: [createEmptyLanguage()],
        }
    }

    return {
        ...profile,
        languages:
            profile.languages.length > 0
                ? profile.languages.map((language) => ({ ...language }))
                : [createEmptyLanguage()],
    }
}

function getDisplayInitials(name: string) {
    const resolvedName = name.trim()

    if (!resolvedName) {
        return "و"
    }

    const initials = resolvedName
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")

    return initials || resolvedName.charAt(0) || "و"
}

function renderSelectField({
    value,
    onChange,
    placeholder,
    options,
    disabled,
}: {
    value: string
    onChange: (value: string) => void
    placeholder: string
    options: ReadonlyArray<{ value: string; label: string }>
    disabled: boolean
}) {
    return (
        <div className="relative">
            <select
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value)}
                className={cn(
                    fieldInputClassName,
                    "appearance-none pe-10",
                    disabled && fieldReadonlyClassName,
                )}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-[#6f7fa5]" />
        </div>
    )
}

function FieldWrapper({
    label,
    required = false,
    className,
    children,
}: {
    label: string
    required?: boolean
    className?: string
    children: ReactNode
}) {
    return (
        <label className={cn("grid gap-1.5", className)}>
            <span className="text-right text-size12 font-medium text-white sm:text-size13">
                {label}
                {required ? (
                    <span className="ms-1 text-[#ffd8d8]">*</span>
                ) : null}
                <span className="me-1">:</span>
            </span>
            {children}
        </label>
    )
}

function ProfileSection({
    title,
    columnsClassName = "md:grid-cols-2 xl:grid-cols-3",
    children,
}: {
    title: string
    columnsClassName?: string
    children: ReactNode
}) {
    return (
        <section className={sectionClassName}>
            <div className="mb-4 text-center">
                <h2 className="m-0 text-size24 font-bold text-white">
                    {title}
                </h2>
            </div>
            <div className={cn("grid gap-x-3 gap-y-3", columnsClassName)}>
                {children}
            </div>
        </section>
    )
}

function PortalSeekerProfileSkeleton() {
    return (
        <section className="container py-8 sm:py-10 lg:py-12" dir="rtl">
            <div className="flex ">
                <div className="w-full max-w-[390px] border-r-[3px] border-[#ee972f] pr-4 text-right">
                    <Skeleton className="mr-auto h-11 w-[260px] rounded-[8px]" />
                    <Skeleton className="mt-3 mr-auto h-7 w-[320px] rounded-[8px]" />
                </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-[313px_minmax(0,1fr)] xl:items-start">
                <div className="space-y-5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={`profile-skeleton-${index + 1}`}
                            className={sectionClassName}
                        >
                            <Skeleton className="mx-auto mb-4 h-8 w-[180px] rounded-[8px] bg-white/35" />
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map(
                                    (__, fieldIndex) => (
                                        <div
                                            key={`profile-skeleton-field-${index + 1}-${fieldIndex + 1}`}
                                        >
                                            <Skeleton className="mb-2 h-4 w-[95px] rounded-[6px] bg-white/30" />
                                            <Skeleton className="h-[42px] w-full rounded-[6px] bg-white/60" />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="space-y-4">
                    <div className="rounded-[4px] bg-[#6f8fd4] px-4 py-5 text-center shadow-[0_8px_18px_rgba(11,36,88,0.22)]">
                        <Skeleton className="mx-auto mb-4 size-[88px] rounded-full bg-white/45" />
                        <Skeleton className="mx-auto h-6 w-[120px] rounded-[6px] bg-white/40" />
                        <Skeleton className="mx-auto mt-2 h-4 w-[90px] rounded-[6px] bg-white/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-[46px] rounded-[6px]" />
                        <Skeleton className="h-[46px] rounded-[6px]" />
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default function PortalSeekerProfileSection({
    pageTitle,
    mode = "editable",
    profile,
    email = "",
    avatarSrc = null,
    isLoading = false,
    isSaving = false,
    errorMessage,
    onRetry,
    onSave,
    topActions,
}: PortalSeekerProfileSectionProps) {
    const isReadOnly = mode === "readonly"
    const [savedValues, setSavedValues] = useState<PortalSeekerProfileFormData>(
        () => cloneFormData(profile),
    )
    const [formData, setFormData] = useState<PortalSeekerProfileFormData>(() =>
        cloneFormData(profile),
    )
    const [savedAvatarSrc, setSavedAvatarSrc] = useState<string | null>(
        avatarSrc ?? null,
    )
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        avatarSrc ?? null,
    )
    const [selectedProfilePicture, setSelectedProfilePicture] =
        useState<File | null>(null)
    const [removeProfilePicture, setRemoveProfilePicture] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackState>(null)
    const profilePictureInputRef = useRef<HTMLInputElement | null>(null)

    const resolvedDisplayName = useMemo(() => {
        return formData.fullName.trim() || "أحمد فيسون"
    }, [formData.fullName])

    const profilePictureFieldLabel = useMemo(() => {
        if (selectedProfilePicture?.name) {
            return selectedProfilePicture.name
        }

        if (removeProfilePicture) {
            return "سيتم حذف الصورة بعد الحفظ"
        }

        if (avatarPreview) {
            return "تم اختيار صورة شخصية"
        }

        return isReadOnly ? "غير مضافة" : "اختر صورة شخصية"
    }, [
        avatarPreview,
        isReadOnly,
        removeProfilePicture,
        selectedProfilePicture,
    ])

    const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(savedValues) ||
        avatarPreview !== savedAvatarSrc ||
        Boolean(selectedProfilePicture) ||
        removeProfilePicture

    function clearFeedback() {
        if (feedback) {
            setFeedback(null)
        }
    }

    function updateField(
        field: Exclude<keyof PortalSeekerProfileFormData, "languages">,
        value: string,
    ) {
        if (isReadOnly) {
            return
        }

        setFormData((current) => ({
            ...current,
            [field]: value,
        }))
        clearFeedback()
    }

    function updateLanguage(
        index: number,
        field: keyof PortalSeekerLanguage,
        value: string,
    ) {
        if (isReadOnly) {
            return
        }

        setFormData((current) => ({
            ...current,
            languages: current.languages.map((language, languageIndex) =>
                languageIndex === index
                    ? { ...language, [field]: value }
                    : language,
            ),
        }))
        clearFeedback()
    }

    function addLanguage() {
        if (isReadOnly) {
            return
        }

        setFormData((current) => ({
            ...current,
            languages: [...current.languages, createEmptyLanguage()],
        }))
        clearFeedback()
    }

    function removeLanguage(index: number) {
        if (isReadOnly) {
            return
        }

        setFormData((current) => ({
            ...current,
            languages:
                current.languages.length > 1
                    ? current.languages.filter(
                          (_, languageIndex) => languageIndex !== index,
                      )
                    : [createEmptyLanguage()],
        }))
        clearFeedback()
    }

    function triggerProfilePicturePicker() {
        profilePictureInputRef.current?.click()
    }

    function handleProfilePictureSelection(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        if (isReadOnly) {
            return
        }

        const selectedFile = event.target.files?.[0]

        if (!selectedFile) {
            return
        }

        const fileReader = new FileReader()

        fileReader.onload = () => {
            const nextAvatarPreview =
                typeof fileReader.result === "string" ? fileReader.result : null

            setSelectedProfilePicture(selectedFile)
            setAvatarPreview(nextAvatarPreview)
            setRemoveProfilePicture(false)
            setFeedback({
                type: "info",
                message:
                    "تم اختيار صورة شخصية جديدة. احفظ التعديلات لتثبيت الصورة.",
            })
        }

        fileReader.readAsDataURL(selectedFile)
        event.target.value = ""
    }

    function handleRemoveProfilePicture() {
        if (isReadOnly) {
            return
        }

        setSelectedProfilePicture(null)
        setAvatarPreview(null)
        setRemoveProfilePicture(true)
        setFeedback({
            type: "info",
            message: "سيتم حذف الصورة الشخصية الحالية بعد حفظ التعديلات.",
        })
    }

    function handleReset() {
        if (isReadOnly) {
            return
        }

        setFormData(cloneFormData(savedValues))
        setAvatarPreview(savedAvatarSrc)
        setSelectedProfilePicture(null)
        setRemoveProfilePicture(false)
        setFeedback({
            type: "info",
            message: "تمت إعادة الحقول إلى آخر نسخة محفوظة.",
        })
    }

    async function handleSave() {
        if (isReadOnly || !onSave) {
            return
        }

        try {
            const result = await onSave({
                formData,
                profilePicture: selectedProfilePicture,
                removeProfilePicture,
            })

            setSavedValues(cloneFormData(result.formData))
            setFormData(cloneFormData(result.formData))
            setSavedAvatarSrc(result.avatarSrc)
            setAvatarPreview(result.avatarSrc)
            setSelectedProfilePicture(null)
            setRemoveProfilePicture(false)
            setFeedback({
                type: "success",
                message: "تم حفظ بيانات الملف الشخصي بنجاح.",
            })
        } catch {
            setFeedback({
                type: "error",
                message: "تعذر حفظ التعديلات الآن. حاول مرة أخرى.",
            })
        }
    }

    if (isLoading) {
        return <PortalSeekerProfileSkeleton />
    }

    if (!profile && errorMessage) {
        return (
            <section className="container py-8 sm:py-10 lg:py-12" dir="rtl">
                <div className="rounded-[18px] bg-white p-8 text-center shadow-[0_20px_48px_rgba(12,32,79,0.10)]">
                    <h1 className="m-0 text-size28 font-bold text-[#1d2a49]">
                        تعذر تحميل الملف الشخصي
                    </h1>
                    <p className="mt-4 mb-0 text-size18 text-[#51607d]">
                        {errorMessage}
                    </p>
                    {onRetry ? (
                        <div className="mt-6 flex justify-center">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                onClick={onRetry}
                                className="rounded-[8px] bg-[#5a80cf] !px-5 !py-3 !text-size16 !font-bold !text-white"
                            >
                                إعادة المحاولة
                            </Button>
                        </div>
                    ) : null}
                </div>
            </section>
        )
    }

    return (
        <section className="container py-8 sm:py-10 lg:py-12" dir="rtl">
            {pageTitle ? <span className="sr-only">{pageTitle}</span> : null}

            <div className="flex ">
                <div className="w-full max-w-[390px] border-r-[3px] border-[#ee972f] pr-4 text-right">
                    <h1 className="m-0 text-[clamp(2rem,1.5rem+1vw,2.75rem)] font-extrabold text-[#1f2330]">
                        أهلًا وسهلًا، {resolvedDisplayName}!
                    </h1>
                    <p className="mt-3 mb-0 text-size20 leading-[1.8] text-[#2b303b]">
                        هذا هو ملفك الشخصي الخاص بك في المنصة
                    </p>
                </div>
            </div>

            {isReadOnly && topActions ? (
                <div className="mt-6 flex justify-start">{topActions}</div>
            ) : null}

            {feedback ? (
                <div
                    className={cn(
                        "mt-6 rounded-[10px] border px-4 py-3 text-right text-size14 shadow-[0_8px_18px_rgba(14,37,84,0.06)]",
                        feedback.type === "success" &&
                            "border-[#afd7b3] bg-[#ebf8ee] text-[#24643c]",
                        feedback.type === "info" &&
                            "border-[#f1d4a8] bg-[#fff8ea] text-[#8b6125]",
                        feedback.type === "error" &&
                            "border-[#ebb5b5] bg-[#fff0f0] text-[#8c2d2d]",
                    )}
                >
                    {feedback.message}
                </div>
            ) : null}

            <div className="mt-8 grid gap-5 xl:grid-cols-[313px_minmax(0,1fr)] xl:items-start">
                <aside className="space-y-4 xl:pt-0.5">
                    {!isReadOnly ? (
                        <input
                            ref={profilePictureInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureSelection}
                        />
                    ) : null}

                    <div
                        className="rounded-[4px] bg-[#6f8fd4] px-4 py-5 text-center shadow-[0_8px_18px_rgba(11,36,88,0.22)]"
                        title={email || undefined}
                    >
                        <div className="relative mx-auto mb-3 size-[88px]">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={resolvedDisplayName}
                                    className="size-full rounded-full border-[3px] border-white object-cover shadow-[0_8px_18px_rgba(0,0,0,0.22)]"
                                />
                            ) : (
                                <span className="inline-flex size-full items-center justify-center rounded-full border-[3px] border-white bg-[#314a7d] text-[1.65rem] font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
                                    {getDisplayInitials(resolvedDisplayName)}
                                </span>
                            )}

                            {!isReadOnly ? (
                                <button
                                    type="button"
                                    onClick={triggerProfilePicturePicker}
                                    className="absolute bottom-0 left-0 inline-flex size-8 items-center justify-center rounded-full border border-white bg-white text-[#4a6ec2] shadow-[0_8px_16px_rgba(8,30,77,0.18)] transition duration-200 hover:-translate-y-0.5"
                                    aria-label="تعديل الصورة"
                                >
                                    <Camera className="size-4" />
                                </button>
                            ) : null}
                        </div>

                        <h2 className="m-0 text-size18 font-bold text-white">
                            {resolvedDisplayName}
                        </h2>
                        <p className="mt-1 mb-0 text-size12 font-semibold text-[#ffb93f]">
                            باحث عن عمل
                        </p>
                        {email ? (
                            <span className="sr-only">{email}</span>
                        ) : null}
                    </div>

                    {!isReadOnly ? (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                disabled={!hasChanges || isSaving}
                                onClick={handleReset}
                                className={cn(
                                    "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[6px] border !px-3 !py-2 !text-size15 !font-bold !text-white shadow-[0_8px_18px_rgba(11,36,88,0.18)] transition duration-200",
                                    hasChanges
                                        ? "border-[#b83832] bg-[#c63d35] hover:brightness-105"
                                        : "border-[#cc7d77] bg-[#d48a85]",
                                )}
                            >
                                <Trash2 className="size-4" />
                                إعادة تعيين
                            </Button>

                            <Button
                                type="button"
                                variant="panel"
                                size="normal"
                                loading={isSaving}
                                disabled={!hasChanges || isSaving}
                                onClick={() => {
                                    void handleSave()
                                }}
                                className={cn(
                                    "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[6px] border !px-3 !py-2 !text-size15 !font-bold !text-white shadow-[0_8px_18px_rgba(11,36,88,0.18)] transition duration-200",
                                    hasChanges
                                        ? "border-[#4f9f6c] bg-[#59a96e] hover:brightness-105"
                                        : "border-[#8fc0a2] bg-[#9ec8ad]",
                                )}
                            >
                                <SendHorizontal className="size-4" />
                                حفظ التعديلات
                            </Button>
                        </div>
                    ) : null}

                    {!isReadOnly &&
                    (avatarPreview || selectedProfilePicture) ? (
                        <button
                            type="button"
                            onClick={handleRemoveProfilePicture}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#d4d9ea] bg-white px-4 py-2.5 text-size14 font-bold text-[#304a7f] shadow-[0_6px_16px_rgba(11,36,88,0.08)] transition duration-200 hover:border-[#c63d35] hover:text-[#c63d35]"
                        >
                            <Trash2 className="size-4" />
                            حذف الصورة الحالية
                        </button>
                    ) : null}
                </aside>
                <div className="space-y-5">
                    <ProfileSection title="المعلومات الشخصية">
                        <FieldWrapper label="الاسم الكامل" required>
                            <input
                                type="text"
                                value={formData.fullName}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("fullName", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="الجنس" required>
                            {renderSelectField({
                                value: formData.gender,
                                onChange: (value) =>
                                    updateField("gender", value),
                                placeholder: "اختر الجنس",
                                options: selectOptions.gender,
                                disabled: isReadOnly,
                            })}
                        </FieldWrapper>

                        <FieldWrapper label="تاريخ الميلاد" required>
                            <input
                                type="date"
                                value={formData.birthDate}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("birthDate", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="رقم الهاتف" required>
                            <input
                                type="tel"
                                value={formData.phone}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("phone", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="الدولة" required>
                            <input
                                type="text"
                                value={formData.country}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("country", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="المدينة" required>
                            <input
                                type="text"
                                value={formData.city}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("city", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="العنوان" required>
                            <input
                                type="text"
                                value={formData.address}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("address", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="صورة شخصية">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!isReadOnly) {
                                        triggerProfilePicturePicker()
                                    }
                                }}
                                disabled={isReadOnly}
                                className={cn(
                                    fieldInputClassName,
                                    "flex items-center justify-between gap-3 text-right",
                                    isReadOnly
                                        ? cn(
                                              fieldReadonlyClassName,
                                              "cursor-default",
                                          )
                                        : "cursor-pointer hover:border-[#3458a6]",
                                )}
                            >
                                <span className="truncate text-size14">
                                    {profilePictureFieldLabel}
                                </span>
                                <Camera className="size-4 shrink-0 text-[#516aab]" />
                            </button>
                        </FieldWrapper>
                    </ProfileSection>

                    <ProfileSection title="الخبرات والمهارات">
                        <FieldWrapper label="المستوى الوظيفي" required>
                            {renderSelectField({
                                value: formData.jobLevel,
                                onChange: (value) =>
                                    updateField("jobLevel", value),
                                placeholder: "اختر المستوى الوظيفي",
                                options: selectOptions.jobLevel,
                                disabled: isReadOnly,
                            })}
                        </FieldWrapper>

                        <FieldWrapper label="سنوات الخبرة" required>
                            <input
                                type="number"
                                min="0"
                                value={formData.yearsOfExperience}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "yearsOfExperience",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="اسم الشركة الأخيرة">
                            <input
                                type="text"
                                value={formData.lastCompanyName}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "lastCompanyName",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="طبيعة الدوام"
                            required
                            className="md:col-span-2 xl:col-span-1"
                        >
                            {renderSelectField({
                                value: formData.workType,
                                onChange: (value) =>
                                    updateField("workType", value),
                                placeholder: "اختر نوع الدوام",
                                options: selectOptions.workType,
                                disabled: isReadOnly,
                            })}
                        </FieldWrapper>
                    </ProfileSection>

                    <ProfileSection title="التعليم">
                        <FieldWrapper label="آخر شهادة" required>
                            {renderSelectField({
                                value: formData.lastDegree,
                                onChange: (value) =>
                                    updateField("lastDegree", value),
                                placeholder: "اختر الشهادة",
                                options: selectOptions.degree,
                                disabled: isReadOnly,
                            })}
                        </FieldWrapper>

                        <FieldWrapper label="التخصص" required>
                            <input
                                type="text"
                                value={formData.specialization}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "specialization",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="الجامعة/المعهد" required>
                            <input
                                type="text"
                                value={formData.university}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "university",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="سنة التخرج" required>
                            <input
                                type="number"
                                min="1950"
                                max="2100"
                                value={formData.graduationYear}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "graduationYear",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper
                            label="اللغات (مع مستوى كل لغة)"
                            required
                            className="md:col-span-2 xl:col-span-2"
                        >
                            <div className="space-y-3 rounded-[6px] bg-white/12 p-2.5">
                                {formData.languages.map((language, index) => (
                                    <div
                                        key={`profile-language-${index + 1}`}
                                        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
                                    >
                                        <input
                                            type="text"
                                            value={language.language}
                                            disabled={isReadOnly}
                                            onChange={(event) =>
                                                updateLanguage(
                                                    index,
                                                    "language",
                                                    event.target.value,
                                                )
                                            }
                                            className={cn(
                                                fieldInputClassName,
                                                isReadOnly &&
                                                    fieldReadonlyClassName,
                                            )}
                                            placeholder={`اللغة ${index + 1}`}
                                        />

                                        {renderSelectField({
                                            value: language.level,
                                            onChange: (value) =>
                                                updateLanguage(
                                                    index,
                                                    "level",
                                                    value,
                                                ),
                                            placeholder: "اختر المستوى",
                                            options:
                                                selectOptions.languageLevel,
                                            disabled: isReadOnly,
                                        })}

                                        {!isReadOnly ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeLanguage(index)
                                                }
                                                className="inline-flex h-[42px] items-center justify-center rounded-[6px] border border-white/25 bg-white/12 px-3 text-white transition duration-200 hover:bg-white/18"
                                                aria-label="حذف اللغة"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                ))}

                                {!isReadOnly ? (
                                    <div className="flex justify-start">
                                        <button
                                            type="button"
                                            onClick={addLanguage}
                                            className="inline-flex items-center gap-2 rounded-[6px] border border-white/25 bg-white/12 px-3 py-2 text-size13 font-bold text-white transition duration-200 hover:bg-white/18"
                                        >
                                            <Plus className="size-4" />
                                            إضافة لغة
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </FieldWrapper>
                    </ProfileSection>

                    <ProfileSection title="إنجازات وأعمال">
                        <FieldWrapper label="موقع شخصي">
                            <input
                                type="url"
                                value={formData.personalWebsite}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField(
                                        "personalWebsite",
                                        event.target.value,
                                    )
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="لينكدإن">
                            <input
                                type="url"
                                value={formData.linkedin}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("linkedin", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                        <FieldWrapper label="GitHub">
                            <input
                                type="url"
                                value={formData.github}
                                disabled={isReadOnly}
                                onChange={(event) =>
                                    updateField("github", event.target.value)
                                }
                                className={cn(
                                    fieldInputClassName,
                                    isReadOnly && fieldReadonlyClassName,
                                )}
                            />
                        </FieldWrapper>

                    </ProfileSection>
                </div>
            </div>
        </section>
    )
}
