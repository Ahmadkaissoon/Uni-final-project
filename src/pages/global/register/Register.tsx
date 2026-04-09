import { type FormEvent, useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import blueLogo from "../../../assets/icons/blue_logo.png";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    navigate("/register/account-type");
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
        <section className="relative w-full max-w-[420px] rounded-[28px] border border-[var(--warning-color)] bg-white px-8 py-9 shadow-[0_28px_90px_rgba(4,12,38,0.38)] sm:px-12 sm:py-10">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="absolute left-6 top-6 inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#d4dae3] bg-white text-[#1f2533] transition duration-200 hover:bg-[#f7f8fb]"
            aria-label="العودة إلى تسجيل الدخول"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="mb-7 flex justify-center pt-1">
            <img
              src={blueLogo}
              alt="وظيفتي"
              className="h-auto w-[110px] object-contain sm:w-[122px]"
            />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <header className="space-y-2 text-right">
              <h1 className="text-2xl font-bold leading-none text-[#33363f]">
                إنشاء حساب
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

              <label className="block space-y-2">
                <span className="block text-right text-size16 font-bold text-[#404249]">
                  كلمة المرور
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="ادخل كلمة المرور"
                    autoComplete="new-password"
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
              </label>

              <label className="block space-y-2">
                <span className="block text-right text-size16 font-bold text-[#404249]">
                  تأكيد كلمة المرور
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="ادخل كلمة المرور"
                    autoComplete="new-password"
                    className="h-[42px] w-full rounded-[7px] border border-[#9aa6b2] bg-white px-4 pe-11 text-right text-size14 text-[#2f333a] outline-none transition duration-200 placeholder:text-right placeholder:text-[#b8bec6] focus:border-[var(--main-color)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute inset-y-0 end-3 inline-flex cursor-pointer items-center text-[#c1c7cf] transition hover:text-[var(--main-color)]"
                    aria-label={
                      showConfirmPassword
                        ? "إخفاء تأكيد كلمة المرور"
                        : "إظهار تأكيد كلمة المرور"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-[50px] w-full cursor-pointer rounded-[8px] bg-[var(--warning-color)] px-5 text-size20 font-bold text-white transition duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              إنشاء حساب
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Register;
