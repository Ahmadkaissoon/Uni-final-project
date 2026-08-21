import { Save, SendHorizontal, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Button } from "../global/ui/button";
import {
  CompanyFieldLabel,
  CompanyFormHeading,
  companyFormInputClassName,
  companyFormTextareaClassName,
} from "./companyForms/companyFormPrimitives";
import type { CompanyJobFormData } from "./companyForms/companyJobFormModel";
import { emptyCompanyJobFormData } from "./companyForms/companyJobFormModel";

interface SelectOption {
  value: string;
  label: string;
}

export type PortalCompanyJobFormMode = "free" | "backend-constrained";

interface PortalCompanyJobFormProps {
  title?: string;
  description?: string;
  initialValues?: CompanyJobFormData;
  resetValues?: CompanyJobFormData;
  submitLabel?: string;
  resetLabel?: string;
  submitAction?: "send" | "save";
  isSubmitting?: boolean;
  mode?: PortalCompanyJobFormMode;
  categoryOptions?: string[];
  isCategoryOptionsLoading?: boolean;
  categoryOptionsErrorMessage?: string;
  onSubmit: (formData: CompanyJobFormData) => void | Promise<void>;
}

const constrainedWorkModeOptions: SelectOption[] = [
  { value: "full_time", label: "دوام كامل" },
  { value: "part_time", label: "دوام جزئي" },
  { value: "contract", label: "عقد" },
  { value: "temporary", label: "مؤقت" },
  { value: "internship", label: "تدريب" },
];

const constrainedJobTypeOptions: SelectOption[] = [
  { value: "onsite", label: "ضمن الشركة" },
  { value: "remotely", label: "عن بعد" },
  { value: "hybrid", label: "هجين" },
];

const constrainedEnglishLevelOptions: SelectOption[] = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

const constrainedSeniorityOptions: SelectOption[] = [
  { value: "entry", label: "مبتدئ" },
  { value: "junior", label: "جونيور" },
  { value: "senior", label: "سينيور" },
  { value: "lead", label: "قائد فريق" },
  { value: "manager", label: "مدير" },
];

const constrainedEducationOptions: SelectOption[] = [
  { value: "High School", label: "ثانوية" },
  { value: "Diploma", label: "دبلوم" },
  { value: "Bachelor", label: "بكالوريوس" },
  { value: "Master", label: "ماجستير" },
  { value: "PhD", label: "دكتوراه" },
];

const constrainedResumeLanguageOptions: SelectOption[] = [
  { value: "Arabic", label: "العربية" },
  { value: "English", label: "الإنجليزية" },
  { value: "French", label: "الفرنسية" },
];

interface SelectFieldProps<K extends keyof CompanyJobFormData> {
  field: K;
  label: string;
  value: CompanyJobFormData[K];
  options: SelectOption[];
  isDisabled?: boolean;
  helperText?: string;
  onChange: (field: K, value: CompanyJobFormData[K]) => void;
}

function CompanySelectField<K extends keyof CompanyJobFormData>({
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
          onChange(field, event.target.value as CompanyJobFormData[K])
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
  );
}

export default function PortalCompanyJobForm({
  title = "إضافة وظيفة",
  description = "يمكنك إضافة وظيفة تحتاجها في الشركة ليتواصل معك الراغبون بالعمل",
  initialValues = emptyCompanyJobFormData,
  resetValues = emptyCompanyJobFormData,
  submitLabel = "إرسال الطلب",
  resetLabel = "إعادة تعيين",
  submitAction = "send",
  isSubmitting = false,
  mode = "free",
  categoryOptions = [],
  isCategoryOptionsLoading = false,
  categoryOptionsErrorMessage,
  onSubmit,
}: PortalCompanyJobFormProps) {
  const [formData, setFormData] = useState<CompanyJobFormData>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const isConstrainedMode = mode === "backend-constrained";

  const normalizedCategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(categoryOptions.map((option) => option.trim()).filter(Boolean)),
      ).map((option) => ({
        value: option,
        label: option,
      })),
    [categoryOptions],
  );

  const isCategorySelectionUnavailable =
    isConstrainedMode && normalizedCategoryOptions.length === 0;

  // const categoryHelperText = isConstrainedMode
  //     ? isCategoryOptionsLoading && normalizedCategoryOptions.length === 0
  //         ? "جاري تحميل تصنيفات الوظائف من الخادم..."
  //         : categoryOptionsErrorMessage && normalizedCategoryOptions.length === 0
  //           ? categoryOptionsErrorMessage
  //           : "سيتم إرسال اسم التصنيف كما هو موجود في الباك."
  //     : undefined

  const updateField = <K extends keyof CompanyJobFormData>(
    field: K,
    value: CompanyJobFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(resetValues);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(formData);
  };

  const submitIcon =
    submitAction === "save" ? (
      <Save className="ml-3 size-5" />
    ) : (
      <SendHorizontal className="ml-3 size-5" />
    );

  const isSubmitDisabled = isSubmitting || isCategorySelectionUnavailable;

  return (
    <section className="pb-12 pt-10 sm:pb-18 sm:pt-12" dir="rtl">
      <div className="portal-design-shell">
        <div className="portal-design-inset">
          <CompanyFormHeading title={title} description={description} />

          <form onSubmit={handleSubmit} className="grid gap-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {isConstrainedMode ? (
                <CompanySelectField
                  field="jobCategory"
                  label="التصنيف الوظيفي :"
                  value={formData.jobCategory}
                  options={normalizedCategoryOptions}
                  isDisabled={isSubmitDisabled}
                  // helperText={categoryHelperText}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="التصنيف الوظيفي :">
                  <input
                    value={formData.jobCategory}
                    onChange={(event) =>
                      updateField("jobCategory", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              <CompanyFieldLabel label="المسمى الوظيفي :">
                <input
                  value={formData.jobTitle}
                  onChange={(event) =>
                    updateField("jobTitle", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="التخصص :">
                <input
                  value={formData.specialization}
                  onChange={(event) =>
                    updateField("specialization", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              {isConstrainedMode ? (
                <CompanySelectField
                  field="workMode"
                  label="نوع العمل :"
                  value={formData.workMode}
                  options={constrainedWorkModeOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="نوع العمل :">
                  <input
                    value={formData.workMode}
                    onChange={(event) =>
                      updateField("workMode", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              <CompanyFieldLabel label="ساعات العمل :">
                <input
                  value={formData.workingHours}
                  onChange={(event) =>
                    updateField("workingHours", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="سنوات الخبرة :">
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={formData.yearsExperience}
                  onChange={(event) =>
                    updateField("yearsExperience", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              {isConstrainedMode ? (
                <CompanySelectField
                  field="jobType"
                  label="نوع الوظيفة :"
                  value={formData.jobType}
                  options={constrainedJobTypeOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="نوع الوظيفة :">
                  <input
                    value={formData.jobType}
                    onChange={(event) =>
                      updateField("jobType", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              {isConstrainedMode ? (
                <CompanySelectField
                  field="englishLevel"
                  label="مستوى اللغة الإنجليزية :"
                  value={formData.englishLevel}
                  options={constrainedEnglishLevelOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="مستوى اللغة الإنجليزية :">
                  <input
                    value={formData.englishLevel}
                    onChange={(event) =>
                      updateField("englishLevel", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              {isConstrainedMode ? (
                <CompanySelectField
                  field="seniority"
                  label="المستوى الوظيفي :"
                  value={formData.seniority}
                  options={constrainedSeniorityOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="المستوى الوظيفي :">
                  <input
                    value={formData.seniority}
                    onChange={(event) =>
                      updateField("seniority", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              {isConstrainedMode ? (
                <CompanySelectField
                  field="educationLevel"
                  label="المستوى التعليمي المطلوب :"
                  value={formData.educationLevel}
                  options={constrainedEducationOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="المستوى التعليمي المطلوب :">
                  <input
                    value={formData.educationLevel}
                    onChange={(event) =>
                      updateField("educationLevel", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}

              <CompanyFieldLabel label="أيام العمل :">
                <input
                  value={formData.workingDays}
                  onChange={(event) =>
                    updateField("workingDays", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="المكان :">
                <input
                  value={formData.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="الحد الأدنى للراتب :">
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={formData.minSalary}
                  onChange={(event) =>
                    updateField("minSalary", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="الحد الأعلى للراتب :">
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={formData.maxSalary}
                  onChange={(event) =>
                    updateField("maxSalary", event.target.value)
                  }
                  required
                  className={companyFormInputClassName}
                />
              </CompanyFieldLabel>

              {isConstrainedMode ? (
                <CompanySelectField
                  field="cvLanguage"
                  label="لغة السيرة الذاتية :"
                  value={formData.cvLanguage}
                  options={constrainedResumeLanguageOptions}
                  onChange={updateField}
                />
              ) : (
                <CompanyFieldLabel label="لغة السيرة الذاتية :">
                  <input
                    value={formData.cvLanguage}
                    onChange={(event) =>
                      updateField("cvLanguage", event.target.value)
                    }
                    required
                    className={companyFormInputClassName}
                  />
                </CompanyFieldLabel>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CompanyFieldLabel label="ملخص الوظيفة والغرض منها :">
                <textarea
                  value={formData.jobSummary}
                  onChange={(event) =>
                    updateField("jobSummary", event.target.value)
                  }
                  placeholder="النص هنا"
                  required
                  className={companyFormTextareaClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="المسؤوليات والواجبات :">
                <textarea
                  value={formData.responsibilities}
                  onChange={(event) =>
                    updateField("responsibilities", event.target.value)
                  }
                  placeholder="النص هنا"
                  required
                  className={companyFormTextareaClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="المؤهلات والمهارات :">
                <textarea
                  value={formData.qualifications}
                  onChange={(event) =>
                    updateField("qualifications", event.target.value)
                  }
                  placeholder="النص هنا"
                  required
                  className={companyFormTextareaClassName}
                />
              </CompanyFieldLabel>

              <CompanyFieldLabel label="شروط ومتطلبات الوظيفة :">
                <textarea
                  value={formData.requirements}
                  onChange={(event) =>
                    updateField("requirements", event.target.value)
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
  );
}
