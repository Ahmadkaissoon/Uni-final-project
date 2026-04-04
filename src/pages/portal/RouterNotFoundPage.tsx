import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function RouterNotFoundPage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,rgb(0_172_193_/_8%),transparent_28%),linear-gradient(180deg,var(--background)_0%,#f7fafc_100%)] px-4"
    >
      <section className="w-full max-w-[720px] rounded-[28px] border border-primary-border/40 bg-white/90 p-8 text-center shadow-[0_24px_54px_rgb(12_32_58_/_0.12)] max-[640px]:p-6">
        <div className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-full bg-primary-bg text-primary">
          <SearchX size={28} />
        </div>
        <h1 className="text-[clamp(2rem,1.4rem+1vw,2.8rem)] font-bold text-header-fg">
          الصفحة غير موجودة
        </h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-size16 leading-[1.9] text-foreground-secondary">
          يبدو أن الرابط الذي حاولت الوصول إليه غير معرّف داخل المشروع حاليًا.
          يمكنك العودة إلى الصفحة الرئيسية للمستخدم أو إلى لوحة الشركة.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-size14 font-bold text-inverse-fg transition duration-200 hover:-translate-y-px hover:bg-primary-hover"
          >
            <ArrowLeft size={16} />
            <span>العودة للرئيسية</span>
          </Link>
          <Link
            to="/company"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-second-white-color px-5 text-size14 font-bold text-primary transition duration-200 hover:-translate-y-px hover:bg-primary-bg"
          >
            <span>لوحة الشركة</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
