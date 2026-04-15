import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Stepper, {
  type StepType,
} from "../../../components/global/stepper/Stepper";
import {
  companyProfileEditorConfig,
  emptyCompanyProfileData,
  type CompanyProfileData,
} from "../../../utils/portalProfileSchemas";
import { cn } from "../../../utils/cn";
import {
  notifyPortalProfileUpdate,
  readStoredProfile,
  writeStoredProfile,
} from "../../../utils/portalProfileStorage";

type CompanyWizardStepKey = "basic" | "manager" | "needs";

const companyWizardSteps: Array<{
  key: CompanyWizardStepKey;
  label: string;
}> = [
  { key: "basic", label: "المعلومات الأساسية" },
  { key: "manager", label: "معلومات المسؤول" },
  { key: "needs", label: "احتياجات الشركة" },
];

const inputClassName =
  "h-[48px] w-full rounded-[14px] border border-[#4a4c52] bg-white px-4 text-right text-size16 text-[#2f333a] outline-none transition duration-200 placeholder:text-[#babfc7] focus:border-[var(--main-color)]";

const stepperThemeStyle: CSSProperties = {
  ["--primary" as string]: "#ee972f",
  ["--secondary" as string]: "#987541",
  ["--inverse-fg" as string]: "#ffffff",
};

function FieldLabel({
  label,
  required = false,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-2.5", className)}>
      <span className="text-right text-[1.05rem] font-medium text-[#34363d]">
        {label}
        {required ? (
          <span className="ms-1 text-[1.05rem] text-[#c45858]">*</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function CompanyProfileWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<CompanyProfileData>(() =>
    readStoredProfile<CompanyProfileData>(
      companyProfileEditorConfig.storageKey,
      emptyCompanyProfileData,
    ),
  );

  const steps: StepType[] = useMemo(
    () =>
      companyWizardSteps.map((step, index) => ({
        name: step.label,
        onClick: () => setCurrentStep(index),
      })),
    [],
  );

  const updateField = <K extends keyof CompanyProfileData>(
    field: K,
    value: CompanyProfileData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  useEffect(() => {
    writeStoredProfile<CompanyProfileData>(
      companyProfileEditorConfig.storageKey,
      formData,
    );
    notifyPortalProfileUpdate("company");
  }, [formData]);

  const handleNextStep = () => {
    setIsCompleted(false);
    setCurrentStep((current) =>
      Math.min(current + 1, companyWizardSteps.length - 1),
    );
  };

  const handlePreviousStep = () => {
    setIsCompleted(false);
    setCurrentStep((current) => Math.max(current - 1, 0));
  };

  const handleFinish = () => {
    setIsCompleted(true);
  };

  const currentStepKey = companyWizardSteps[currentStep]?.key;

  const renderCurrentStep = () => {
    if (currentStepKey === "basic") {
      return (
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldLabel label="اسم الشركة" required>
            <input
              value={formData.companyName}
              onChange={(event) =>
                updateField("companyName", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="القطاع" required>
            <div className="relative">
              <select
                value={formData.sector}
                onChange={(event) => updateField("sector", event.target.value)}
                className={cn(inputClassName, "appearance-none pe-10")}
              >
                <option value="">اختر القطاع</option>
                <option value="technology">تقنية</option>
                <option value="marketing">تسويق</option>
                <option value="design">تصميم</option>
                <option value="education">تعليم</option>
                <option value="other">أخرى</option>
              </select>
              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a2a6ae]" />
            </div>
          </FieldLabel>

          <FieldLabel label="عدد الموظفين" required>
            <input
              type="number"
              min="1"
              value={formData.employeeCount}
              onChange={(event) =>
                updateField("employeeCount", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="الدولة" required>
            <input
              value={formData.country}
              onChange={(event) => updateField("country", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="المدينة" required>
            <input
              value={formData.city}
              onChange={(event) => updateField("city", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="العنوان" required>
            <input
              value={formData.address}
              onChange={(event) => updateField("address", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="رقم هاتف الشركة" required>
            <input
              value={formData.companyPhone}
              onChange={(event) =>
                updateField("companyPhone", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="الموقع الإلكتروني" className="xl:col-span-1">
            <input
              value={formData.website}
              onChange={(event) => updateField("website", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>
        </div>
      );
    }

    if (currentStepKey === "manager") {
      return (
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">
          <FieldLabel label="اسم مسؤول التوظيف" required>
            <input
              value={formData.hiringManagerName}
              onChange={(event) =>
                updateField("hiringManagerName", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="بريد الشركة" required>
            <input
              type="email"
              value={formData.companyEmail}
              onChange={(event) =>
                updateField("companyEmail", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>
        </div>
      );
    }

    return (
      <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        <FieldLabel label="نوع الوظائف التي توظف لها!">
          <input
            value={formData.hiringJobTypes}
            onChange={(event) =>
              updateField("hiringJobTypes", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>

        <FieldLabel label="عدد الوظائف التي تخطط لنشرها شهرياً">
          <input
            type="number"
            min="0"
            value={formData.monthlyOpenings}
            onChange={(event) =>
              updateField("monthlyOpenings", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>

        <FieldLabel label="توصيات الشركة">
          <input
            value={formData.companyRecommendations}
            onChange={(event) =>
              updateField("companyRecommendations", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>
      </div>
    );
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-svh overflow-x-hidden overflow-y-auto text-white"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 50% 50%, #385fbd 0%, #122356 100%)",
      }}
    >
      <div className="relative min-h-svh px-4 py-6 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/register/account-type")}
          className="absolute left-4 top-4 inline-flex size-10 cursor-pointer items-center justify-center rounded-[12px] border border-white/18 bg-white/10 text-white transition duration-200 hover:bg-white/15 sm:left-8 sm:top-8"
          aria-label="العودة إلى اختيار نوع الحساب"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-8 py-12 sm:py-16">
          <div className="w-full max-w-[680px] space-y-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-[84px] bg-[rgba(240,151,47,0.65)] sm:w-[118px]" />
              <h1 className="text-[2rem] font-bold leading-none text-white sm:text-[2.45rem]">
                أهلا بك في منصة وظيفتي
              </h1>
              <span className="h-px w-[84px] bg-[rgba(240,151,47,0.65)] sm:w-[118px]" />
            </div>

            <p className="text-[1.18rem] leading-[1.85] text-white/92 sm:text-[1.45rem]">
              قم بإدخال بعض المعلومات التي سيتم عرضها
              <br />
              كملف شخصي خاص بك
            </p>
          </div>

          <div className="w-full max-w-[880px]" style={stepperThemeStyle}>
            <Stepper
              currentStep={currentStep}
              steps={steps}
              setCurrentStep={setCurrentStep}
              trackClassName="gap-2 sm:gap-3"
              itemClassName="rounded-[18px]"
            />
          </div>

          <section className="w-full rounded-[28px] bg-[#f7f8fb] px-4 py-6 shadow-[0_20px_70px_rgba(4,12,38,0.18)] sm:px-6 lg:px-8">
            <div className="space-y-8">
              {renderCurrentStep()}

              {isCompleted ? (
                <div className="rounded-[14px] border border-[#6eb37f] bg-[#e8f6eb] px-4 py-3 text-right text-size16 text-[#2e6a3b]">
                  تم حفظ خطوات الشركة محليًا كتجهيز أولي، ويمكننا لاحقًا ربطها
                  مع الإرسال الفعلي للبيانات.
                </div>
              ) : null}

              <div className="flex flex-wrap items-end justify-end gap-3">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="min-w-[140px] cursor-pointer rounded-[10px] bg-[#5faa73] px-6 py-3 text-size18 font-medium text-white transition duration-200 hover:brightness-95"
                  >
                    السابق
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={
                    currentStep === companyWizardSteps.length - 1
                      ? handleFinish
                      : handleNextStep
                  }
                  className="min-w-[140px] cursor-pointer rounded-[10px] bg-[#5faa73] px-6 py-3 text-size18 font-medium text-white transition duration-200 hover:brightness-95"
                >
                  {currentStep === companyWizardSteps.length - 1
                    ? "تأكيد"
                    : "التالي"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CompanyProfileWizard;
