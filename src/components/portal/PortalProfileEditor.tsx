import { type ChangeEvent, type ReactNode, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  RotateCcw,
  Save,
} from "lucide-react";

import { cn } from "../../utils/cn";
import type {
  PortalProfileEditorConfig,
  PortalProfileField,
  PortalProfileFormValues,
} from "../../utils/portalProfileSchemas";
import {
  notifyPortalProfileUpdate,
  readStoredAvatar,
  readStoredProfile,
  writeStoredAvatar,
  writeStoredProfile,
} from "../../utils/portalProfileStorage";

const fieldInputClassName =
  "h-[48px] w-full rounded-[14px] border border-[#d7def1] bg-white px-4 text-right text-size16 text-[#324164] shadow-[inset_0_1px_3px_rgba(19,39,84,0.08)] outline-none transition duration-200 placeholder:text-[#98a4be] focus:border-[#345aa8] focus:bg-white";

const fieldTextareaClassName =
  "min-h-[154px] w-full resize-none rounded-[14px] border border-[#d7def1] bg-white px-4 py-3 text-right text-size16 text-[#324164] shadow-[inset_0_1px_3px_rgba(19,39,84,0.08)] outline-none transition duration-200 placeholder:text-[#98a4be] focus:border-[#345aa8] focus:bg-white";

interface PortalProfileEditorProps<T extends PortalProfileFormValues> {
  pageTitle?: string;
  config: PortalProfileEditorConfig<T>;
  mode?: "editable" | "readonly";
  initialValues?: T;
  initialAvatarSrc?: string | null;
  topActions?: ReactNode;
  entityLabelOverride?: string;
  pageDescriptionOverride?: string;
  showPageTitleBadge?: boolean;
  useContainer?: boolean;
  className?: string;
}

type FeedbackState =
  | {
      type: "success" | "info";
      message: string;
    }
  | null;

function getDisplayInitials(name: string) {
  const resolvedName = name.trim();

  if (!resolvedName) {
    return "و";
  }

  const initials = resolvedName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return initials || resolvedName.charAt(0) || "و";
}

function ProfileFieldControl<T extends PortalProfileFormValues>({
  field,
  value,
  onChange,
  disabled = false,
}: {
  field: PortalProfileField<T>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={cn(
          fieldTextareaClassName,
          disabled &&
            "cursor-default border-[#dbe4f3] bg-white text-[#324164] opacity-100",
        )}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            fieldInputClassName,
            "appearance-none pe-10",
            disabled &&
              "cursor-default border-[#dbe4f3] bg-white text-[#324164] opacity-100",
          )}
        >
          <option value="">{field.placeholder ?? `اختر ${field.label}`}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#7b89a5]" />
      </div>
    );
  }

  return (
    <input
      type={field.type ?? "text"}
      value={value}
      disabled={disabled}
      min={field.min}
      max={field.max}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        fieldInputClassName,
        disabled &&
          "cursor-default border-[#dbe4f3] bg-white text-[#324164] opacity-100",
      )}
    />
  );
}

export default function PortalProfileEditor<T extends PortalProfileFormValues>({
  pageTitle,
  config,
  mode = "editable",
  initialValues,
  initialAvatarSrc,
  topActions,
  entityLabelOverride,
  pageDescriptionOverride,
  showPageTitleBadge = true,
  useContainer = true,
  className,
}: PortalProfileEditorProps<T>) {
  const isReadOnly = mode === "readonly";
  const [savedValues, setSavedValues] = useState<T>(() =>
    initialValues ?? readStoredProfile(config.storageKey, config.defaultValues),
  );
  const [formData, setFormData] = useState<T>(() =>
    initialValues ?? readStoredProfile(config.storageKey, config.defaultValues),
  );
  const [savedAvatar, setSavedAvatar] = useState<string | null>(() =>
    initialAvatarSrc ?? readStoredAvatar(config.avatarStorageKey),
  );
  const [avatarSrc, setAvatarSrc] = useState<string | null>(() =>
    initialAvatarSrc ?? readStoredAvatar(config.avatarStorageKey),
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const getFieldValue = (fieldName: Extract<keyof T, string>) =>
    String((formData as Record<string, unknown>)[fieldName] ?? "");
  const getSavedFieldValue = (fieldName: Extract<keyof T, string>) =>
    String((savedValues as Record<string, unknown>)[fieldName] ?? "");

  const resolvedDisplayName =
    getFieldValue(config.displayNameField).trim() ||
    getSavedFieldValue(config.displayNameField).trim() ||
    config.fallbackDisplayName;
  const resolvedEntityLabel = entityLabelOverride ?? config.entityLabel;
  const resolvedPageDescription =
    pageDescriptionOverride ?? config.pageDescription;

  const hasChanges =
    !isReadOnly &&
    (JSON.stringify(formData) !== JSON.stringify(savedValues) ||
      avatarSrc !== savedAvatar);

  const updateField = (field: Extract<keyof T, string>, value: string) => {
    if (isReadOnly) {
      return;
    }

    setFormData((current) => ({
      ...current,
      [field]: value,
    }) as T);

    if (feedback) {
      setFeedback(null);
    }
  };

  const handleSave = () => {
    if (isReadOnly) {
      return;
    }

    writeStoredProfile(config.storageKey, formData);
    writeStoredAvatar(config.avatarStorageKey, avatarSrc);
    setSavedValues({ ...formData });
    setSavedAvatar(avatarSrc);
    setFeedback({
      type: "success",
      message: config.saveSuccessMessage,
    });
    notifyPortalProfileUpdate(config.role);
  };

  const handleReset = () => {
    if (isReadOnly) {
      return;
    }

    setFormData({ ...savedValues });
    setAvatarSrc(savedAvatar);
    setFeedback({
      type: "info",
      message: "تمت إعادة الحقول إلى آخر نسخة محفوظة.",
    });
  };

  const handleAvatarSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      return;
    }

    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const nextAvatar = typeof fileReader.result === "string"
        ? fileReader.result
        : null;

      setAvatarSrc(nextAvatar);
      setFeedback({
        type: "info",
        message: "تم اختيار صورة جديدة، احفظ التعديلات لتظهر في الهيدر.",
      });
    };

    fileReader.readAsDataURL(selectedFile);
    event.target.value = "";
  };

  return (
    <section
      className={cn(
        useContainer && "container",
        "py-8 sm:py-10 lg:py-12",
        className,
      )}
    >
      <div className="rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,248,255,0.95)_100%)] p-5 shadow-[0_24px_70px_rgba(12,32,79,0.10)] sm:p-7 lg:p-9">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_264px]">
          <div className="space-y-6">
            {showPageTitleBadge && pageTitle ? (
              <div className="flex justify-start">
                <span className="inline-flex rounded-full border border-[#d8e0f3] bg-white px-4 py-2 text-size13 font-bold text-[#5771aa] shadow-[0_8px_18px_rgba(11,38,96,0.08)]">
                  {pageTitle}
                </span>
              </div>
            ) : null}

            {topActions ? (
              <div className="flex flex-wrap items-center justify-start gap-3">
                {topActions}
              </div>
            ) : null}

            <div className="border-r-[4px] border-[#ee972f] pr-5 text-right">
              <h1 className="m-0 text-[clamp(1.9rem,1.45rem+1vw,2.55rem)] font-extrabold text-[#1d2a49]">
                أهلًا وسهلًا، {resolvedDisplayName}!
              </h1>
              <p className="mt-3 mb-0 text-size20 leading-9 text-[#2f3a54]">
                {resolvedPageDescription}
              </p>
            </div>

            {feedback && !isReadOnly ? (
              <div
                className={cn(
                  "rounded-[18px] border px-4 py-3 text-right text-size15 shadow-[0_10px_24px_rgba(14,37,84,0.06)]",
                  feedback.type === "success"
                    ? "border-[#afd7b3] bg-[#ebf8ee] text-[#24643c]"
                    : "border-[#f1d4a8] bg-[#fff8ea] text-[#8b6125]",
                )}
              >
                {feedback.message}
              </div>
            ) : null}

            <div className="space-y-5">
              {config.sections.map((section) => (
                <section
                  key={section.id}
                  className="rounded-[24px] bg-[linear-gradient(180deg,#7297e3_0%,#6389d7_100%)] px-4 py-5 shadow-[0_18px_38px_rgba(12,32,79,0.16)] sm:px-5 sm:py-6"
                >
                  <div className="mb-5 border-b border-white/22 pb-3 text-center">
                    <h2 className="m-0 text-size28 font-bold text-white">
                      {section.title}
                    </h2>
                  </div>

                  <div
                    className={cn(
                      "grid gap-x-4 gap-y-5",
                      section.columnsClassName ?? "md:grid-cols-2 xl:grid-cols-3",
                    )}
                  >
                    {section.fields.map((field) => (
                      <label
                        key={field.name}
                        className={cn("grid gap-2.5", field.className)}
                      >
                        <span className="text-right text-size15 font-semibold text-white">
                          {field.label}
                          {field.required ? (
                            <span className="ms-1 text-[#ffe2e2]">*</span>
                          ) : null}
                        </span>

                        <ProfileFieldControl<T>
                          field={field}
                          value={getFieldValue(field.name)}
                          disabled={isReadOnly}
                          onChange={(value) => updateField(field.name, value)}
                        />
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:pt-[68px]">
            <div className="rounded-[24px] bg-[linear-gradient(180deg,#6d92dd_0%,#5a80cf_100%)] px-5 py-6 text-center shadow-[0_20px_38px_rgba(12,32,79,0.16)]">
              {!isReadOnly ? (
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelection}
                />
              ) : null}

              <div className="relative mx-auto mb-4 size-[120px]">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={resolvedDisplayName}
                    className="size-full rounded-full border-[4px] border-white/80 object-cover shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                  />
                ) : (
                  <span className="inline-flex size-full items-center justify-center rounded-full border-[4px] border-white/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_45%),rgba(28,47,96,0.34)] text-[2rem] font-extrabold text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
                    {getDisplayInitials(resolvedDisplayName)}
                  </span>
                )}

                {!isReadOnly ? (
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 left-1 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white text-[#4066bb] shadow-[0_10px_20px_rgba(10,30,77,0.18)] transition duration-200 hover:-translate-y-0.5"
                    aria-label="تعديل الصورة"
                  >
                    <Camera size={18} />
                  </button>
                ) : null}
              </div>

              <h2 className="m-0 text-size24 font-bold text-white">
                {resolvedDisplayName}
              </h2>
              <p className="mt-1 mb-0 text-size15 font-semibold text-[#ffd48f]">
                {resolvedEntityLabel}
              </p>

              {!isReadOnly ? (
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-white/26 bg-white/14 px-4 py-3 text-size15 font-bold text-white transition duration-200 hover:bg-white/18"
                >
                  <Camera size={16} />
                  تعديل الصورة
                </button>
              ) : null}
            </div>

            {!isReadOnly ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={cn(
                    "inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[16px] px-4 text-size16 font-bold text-white shadow-[0_12px_26px_rgba(17,45,96,0.14)] transition duration-200",
                    hasChanges
                      ? "bg-[#56a76b] hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-[#96c59f] opacity-75",
                  )}
                >
                  <Save size={18} />
                  حفظ التعديلات
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className={cn(
                    "inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[16px] px-4 text-size16 font-bold text-white shadow-[0_12px_26px_rgba(17,45,96,0.14)] transition duration-200",
                    hasChanges
                      ? "bg-[#ca5f5a] hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-[#d6a09d] opacity-75",
                  )}
                >
                  <RotateCcw size={18} />
                  إعادة تعيين
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
