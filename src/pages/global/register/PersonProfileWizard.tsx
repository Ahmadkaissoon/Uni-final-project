import {
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Stepper, {
  type StepType,
} from "../../../components/global/stepper/Stepper";
import {
  emptyPersonProfileData,
  personProfileEditorConfig,
  type PersonProfileData,
} from "../../../utils/portalProfileSchemas";
import { cn } from "../../../utils/cn";
import {
  notifyPortalProfileUpdate,
  writeStoredAvatar,
  readStoredProfile,
  writeStoredProfile,
} from "../../../utils/portalProfileStorage";

type WizardStepKey =
  | "personal"
  | "experience"
  | "education"
  | "achievements";

interface PersonWizardProfileData extends PersonProfileData {
  profileImageName: string;
  cvFileName: string;
}

const emptyPersonWizardProfileData: PersonWizardProfileData = {
  ...emptyPersonProfileData,
  profileImageName: "",
  cvFileName: "",
};

const wizardSteps: Array<{ key: WizardStepKey; label: string }> = [
  { key: "personal", label: "المعلومات الشخصية" },
  { key: "experience", label: "الخبرات والمهارات" },
  { key: "education", label: "التعليم" },
  { key: "achievements", label: "إنجازات وأعمال" },
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

function PersonProfileWizard() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<PersonWizardProfileData>(() =>
    readStoredProfile<PersonWizardProfileData>(
      personProfileEditorConfig.storageKey,
      emptyPersonWizardProfileData,
    ),
  );

  const steps: StepType[] = useMemo(
    () =>
      wizardSteps.map((step, index) => ({
        name: step.label,
        onClick: () => setCurrentStep(index),
      })),
    [],
  );

  const updateField = <K extends keyof PersonWizardProfileData>(
    field: K,
    value: PersonWizardProfileData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFileSelection =
    (field: "profileImageName" | "cvFileName") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      updateField(field, selectedFile?.name ?? "");

      if (field !== "profileImageName" || !selectedFile) {
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {
        const nextAvatar =
          typeof fileReader.result === "string" ? fileReader.result : null;

        writeStoredAvatar(personProfileEditorConfig.avatarStorageKey, nextAvatar);
        notifyPortalProfileUpdate("user");
      };

      fileReader.readAsDataURL(selectedFile);
    };

  useEffect(() => {
    writeStoredProfile<PersonWizardProfileData>(
      personProfileEditorConfig.storageKey,
      formData,
    );
    notifyPortalProfileUpdate("user");
  }, [formData]);

  const handleNextStep = () => {
    setIsCompleted(false);
    setCurrentStep((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handlePreviousStep = () => {
    setIsCompleted(false);
    setCurrentStep((current) => Math.max(current - 1, 0));
  };

  const handleFinish = () => {
    setIsCompleted(true);
  };

  const currentStepKey = wizardSteps[currentStep]?.key;

  const renderCurrentStep = () => {
    if (currentStepKey === "personal") {
      return (
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldLabel label="الاسم الكامل" required>
            <input
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="الجنس" required>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(event) => updateField("gender", event.target.value)}
                className={cn(inputClassName, "appearance-none pe-10")}
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a2a6ae]" />
            </div>
          </FieldLabel>

          <FieldLabel label="تاريخ الميلاد" required>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(event) => updateField("birthDate", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="رقم الهاتف" required>
            <input
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
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

          <FieldLabel label="صورة شخصية">
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelection("profileImageName")}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => profileImageInputRef.current?.click()}
              className={cn(
                inputClassName,
                "cursor-pointer text-right text-[#9ea3ab]",
              )}
            >
              {formData.profileImageName || "اختر صورة شخصية"}
            </button>
          </FieldLabel>
        </div>
      );
    }

    if (currentStepKey === "experience") {
      return (
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldLabel label="المستوى الوظيفي" required>
            <input
              value={formData.jobLevel}
              onChange={(event) => updateField("jobLevel", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="سنوات الخبرة" required>
            <input
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={(event) =>
                updateField("yearsExperience", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="اسم الشركة الأخيرة">
            <input
              value={formData.lastCompany}
              onChange={(event) =>
                updateField("lastCompany", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="طبيعة الدوام" required>
            <div className="relative">
              <select
                value={formData.workType}
                onChange={(event) => updateField("workType", event.target.value)}
                className={cn(inputClassName, "appearance-none pe-10")}
              >
                <option value="">اختر نوع الدوام</option>
                <option value="full-time">دوام كامل</option>
                <option value="part-time">دوام جزئي</option>
                <option value="freelance">عمل حر</option>
                <option value="hybrid">هجين</option>
              </select>
              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#a2a6ae]" />
            </div>
          </FieldLabel>
        </div>
      );
    }

    if (currentStepKey === "education") {
      return (
        <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldLabel label="آخر شهادة" required>
            <input
              value={formData.latestDegree}
              onChange={(event) =>
                updateField("latestDegree", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="التخصص" required>
            <input
              value={formData.specialization}
              onChange={(event) =>
                updateField("specialization", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="الجامعة/المعهد" required>
            <input
              value={formData.university}
              onChange={(event) =>
                updateField("university", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel label="سنة التخرج" required>
            <input
              type="number"
              min="1950"
              max="2100"
              value={formData.graduationYear}
              onChange={(event) =>
                updateField("graduationYear", event.target.value)
              }
              className={inputClassName}
            />
          </FieldLabel>

          <FieldLabel
            label="اللغات (مع مستوى كل لغة)"
            required
            className="xl:col-span-2"
          >
            <input
              value={formData.languages}
              onChange={(event) => updateField("languages", event.target.value)}
              className={inputClassName}
            />
          </FieldLabel>
        </div>
      );
    }

    return (
      <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        <FieldLabel label="أبرز إنجاز حققته" required>
          <input
            value={formData.topAchievement}
            onChange={(event) =>
              updateField("topAchievement", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>

        <FieldLabel label="رابط معرض الأعمال">
          <input
            value={formData.portfolioLink}
            onChange={(event) =>
              updateField("portfolioLink", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>

        <FieldLabel label="رابط LinkedIn أو GitHub">
          <input
            value={formData.professionalProfile}
            onChange={(event) =>
              updateField("professionalProfile", event.target.value)
            }
            className={inputClassName}
          />
        </FieldLabel>

        <FieldLabel
          label="نبذة مختصرة عن إنجازاتك وأعمالك"
          required
          className="md:col-span-2 xl:col-span-3"
        >
          <textarea
            value={formData.projectSummary}
            onChange={(event) =>
              updateField("projectSummary", event.target.value)
            }
            className="min-h-[160px] w-full resize-none rounded-[14px] border border-[#4a4c52] bg-white px-4 py-3 text-right text-size16 text-[#2f333a] outline-none transition duration-200 placeholder:text-[#babfc7] focus:border-[var(--main-color)]"
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

          <div className="w-full max-w-[1020px]" style={stepperThemeStyle}>
            <Stepper
              currentStep={currentStep}
              steps={steps}
              setCurrentStep={setCurrentStep}
              trackClassName="gap-2 sm:gap-3"
              itemClassName="rounded-[18px]"
            />
          </div>

          <section className="w-full rounded-[28px] bg-[#f7f8fb] px-4 py-6 shadow-[0_20px_70px_rgba(4,12,38,0.18)] sm:px-6 lg:px-8">
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelection("cvFileName")}
              className="hidden"
            />

            <div className="space-y-8">
              {renderCurrentStep()}

              {isCompleted ? (
                <div className="rounded-[14px] border border-[#6eb37f] bg-[#e8f6eb] px-4 py-3 text-right text-size16 text-[#2e6a3b]">
                  تم حفظ هذه الخطوات محليًا كتجهيز أولي، ويمكننا الآن ربطها لاحقًا
                  مع الإرسال الحقيقي للبيانات.
                </div>
              ) : null}

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-3">
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
                      currentStep === wizardSteps.length - 1
                        ? handleFinish
                        : handleNextStep
                    }
                    className="min-w-[140px] cursor-pointer rounded-[10px] bg-[#5faa73] px-6 py-3 text-size18 font-medium text-white transition duration-200 hover:brightness-95"
                  >
                    {currentStep === wizardSteps.length - 1 ? "إنهاء" : "التالي"}
                  </button>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="min-w-[150px] cursor-pointer rounded-[10px] bg-[#c96868] px-6 py-3 text-size18 font-medium text-white transition duration-200 hover:brightness-95"
                  >
                    رفع الCV
                  </button>

                  {formData.cvFileName ? (
                    <span className="max-w-[260px] text-size14 text-[#70757d]">
                      {formData.cvFileName}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PersonProfileWizard;
