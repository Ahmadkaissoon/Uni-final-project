import type { AdminPageDefinition } from "../../router/adminPages";

interface AdminPagePlaceholderProps {
  page: AdminPageDefinition;
}

export default function AdminPagePlaceholder({ page }: AdminPagePlaceholderProps) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <h2 className="m-0 text-size20 font-bold text-[#17385e]">{page.title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-size15 leading-7 text-slate-600">
        هذه الصفحة جاهزة داخل لاي أوت الأدمن. سنبني الجدول والتفاصيل والحظر
        عندما نبدأ بهذه الواجهة.
      </p>
    </section>
  );
}
