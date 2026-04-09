import { type FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import blueLogo from "../../../assets/icons/blue_logo.png";

const DEMO_RESET_EMAIL = "ahmad.kaissoon@gamil.com";
const RESET_EMAIL_STORAGE_KEY = "reset-email";

export interface LoginSubmitValues {
  email: string;
  password: string;
}

interface LoginProps {
  isLoading?: boolean;
  onSubmit?: (values: LoginSubmitValues) => Promise<void> | void;
  onCreateAccount?: () => void;
  onForgotPassword?: (email: string) => void;
}

function Login({
  isLoading = false,
  onSubmit,
  onCreateAccount,
  onForgotPassword,
}: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isLoading || isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        email: email.trim(),
        password,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordClick = () => {
    const resolvedEmail = email.trim() || DEMO_RESET_EMAIL;
    sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, resolvedEmail);

    if (onForgotPassword) {
      onForgotPassword(resolvedEmail);
      return;
    }

    navigate("/reset-otp", {
      state: { email: resolvedEmail },
    });
  };

  const handleCreateAccountClick = () => {
    if (onCreateAccount) {
      onCreateAccount();
      return;
    }

    navigate("/register");
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
        <section className="w-full max-w-[420px] rounded-[28px] border border-[var(--warning-color)] bg-white px-8 py-9 shadow-[0_28px_90px_rgba(4,12,38,0.38)] sm:px-12 sm:py-10">
          <div className="mb-7 flex justify-center">
            <img
              src={blueLogo}
              alt="وظيفتي"
              className="h-auto w-[110px] object-contain sm:w-[122px]"
            />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <header className="space-y-2 text-right">
              <h1 className="text-2xl  font-bold leading-none text-[#33363f]">
                تسجيل الدخول
              </h1>
            </header>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="block text-right text-size16 font-bold text-[#404249]">
                  البريد الإلكتروني
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="username@gmail.com"
                  autoComplete="email"
                  className="h-[42px] w-full rounded-[7px] border border-[#9aa6b2] bg-white px-4 text-right text-size14 text-[#2f333a] outline-none transition duration-200 placeholder:text-right placeholder:text-[#b8bec6] focus:border-[var(--main-color)]"
                />
              </label>

              <div className="space-y-2">
                <label className="block text-right text-size16 font-bold text-[#404249]">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="ادخل كلمة المرور"
                    autoComplete="current-password"
                    className="h-[42px] w-full rounded-[7px] border border-[#9aa6b2] bg-white px-4 pe-11 text-right text-size14 text-[#2f333a] outline-none transition duration-200 placeholder:text-right placeholder:text-[#b8bec6] focus:border-[var(--main-color)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 end-3 inline-flex cursor-pointer items-center text-[#c1c7cf] transition hover:text-[var(--main-color)]"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="block w-full cursor-pointer text-right text-size15 text-[#444a53] transition hover:text-[var(--main-color)]"
                >
                  هل نسيت كلمة المرور ؟
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <button
                type="submit"
                disabled={isBusy}
                className="h-[50px] w-full cursor-pointer rounded-[8px] bg-[var(--warning-color)] px-5 text-size20 font-bold text-white transition duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBusy ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
              </button>

              <button
                type="button"
                onClick={handleCreateAccountClick}
                className="h-[50px] w-full cursor-pointer rounded-[8px] border border-[var(--warning-color)] bg-white px-5 text-size20 font-bold text-[var(--warning-color)] transition duration-200 hover:bg-[rgba(255,138,0,0.06)]"
              >
                إنشاء حساب
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;
