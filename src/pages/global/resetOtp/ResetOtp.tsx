import {
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import blueLogo from "../../../assets/icons/blue_logo.png";

const OTP_LENGTH = 4;
const DEMO_RESET_EMAIL = "ahmad.kaissoon@gamil.com";
const RESET_EMAIL_STORAGE_KEY = "reset-email";

function ResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const stateEmail =
    typeof location.state?.email === "string" ? location.state.email.trim() : "";
  const storedEmail = sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY)?.trim() ?? "";
  const resolvedEmail = stateEmail || storedEmail || DEMO_RESET_EMAIL;

  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, resolvedEmail);
  }, [resolvedEmail]);

  useEffect(() => {
    if (secondsLeft >= 20) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current < 20 ? current + 1 : 20));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [secondsLeft]);

  const otpValue = otpDigits.join("");
  const canSubmit = otpValue.length === OTP_LENGTH;

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleOtpChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/\D/g, "");

    if (!numericValue) {
      setOtpDigits((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });
      return;
    }

    if (numericValue.length > 1) {
      const next = Array.from({ length: OTP_LENGTH }, (_, otpIndex) => {
        return numericValue[otpIndex] ?? "";
      });
      setOtpDigits(next);

      const nextFocusIndex = Math.min(numericValue.length, OTP_LENGTH - 1);
      focusInput(nextFocusIndex);
      return;
    }

    setOtpDigits((current) => {
      const next = [...current];
      next[index] = numericValue;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pastedDigits.length) {
      return;
    }

    const next = Array.from({ length: OTP_LENGTH }, (_, index) => {
      return pastedDigits[index] ?? "";
    });
    setOtpDigits(next);
    focusInput(Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  const handleResendCode = () => {
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setSecondsLeft(0);
    focusInput(0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    navigate("/verify-password", {
      state: {
        email: resolvedEmail,
        otp: otpValue,
      },
    });
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-svh overflow-hidden text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 50% 50%, #385fbd 0%, #122356 100%)",
      }}
    >
      <div className="relative flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
        <section className="relative w-full max-w-[456px] rounded-[30px] border border-[var(--warning-color)] bg-white px-7 py-8 shadow-[0_28px_90px_rgba(4,12,38,0.38)] sm:px-9 sm:py-9">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="absolute left-7 top-7 inline-flex size-10 cursor-pointer items-center justify-center rounded-[12px] border border-[#d4dae3] bg-white text-[#1f2533] transition duration-200 hover:bg-[#f7f8fb]"
            aria-label="العودة إلى تسجيل الدخول"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="mb-8 flex justify-center pt-2">
            <img
              src={blueLogo}
              alt="وظيفتي"
              className="h-auto w-[112px] object-contain sm:w-[124px]"
            />
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
            <header className="space-y-2 text-center">
              <h1 className="text-[2rem] font-bold leading-[1.35] text-[#33363f] sm:text-[2.15rem]">
                الرجاء مراجعة البريد الالكتروني
              </h1>
            </header>

            <div className="space-y-5">
              <div
                dir="ltr"
                className="flex items-center justify-center gap-3 sm:gap-4"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className="size-[58px] rounded-[16px] border border-[#d5dbe3] bg-white text-center text-[1.55rem] font-bold text-[#283040] outline-none transition duration-200 focus:border-[var(--main-color)] sm:size-[72px]"
                  />
                ))}
              </div>

              <p className="text-center text-size16 leading-8 text-[#61646c]">
                لقد أرسلنا كود على الايميل{" "}
                <span className="font-bold text-[#3f434c]">{resolvedEmail}</span>
              </p>

              <div className="space-y-1 text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="cursor-pointer text-size18 font-bold text-[#585c65] transition hover:text-[var(--main-color)]"
                >
                  أرسل الكود مرة أخرى
                </button>
                <p className="text-size16 text-[#696d75]">
                  00:{String(secondsLeft).padStart(2, "0")}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mx-auto block h-[50px] w-full max-w-[232px] cursor-pointer rounded-[8px] bg-[var(--warning-color)] px-5 text-size20 font-bold text-white transition duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              تأكيد
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ResetOtp;
