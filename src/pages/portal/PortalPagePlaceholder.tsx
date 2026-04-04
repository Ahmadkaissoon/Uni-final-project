import {
  ArrowUpLeft,
  Layers3,
  LayoutTemplate,
  Route,
  Sparkles,
} from "lucide-react";

import { cn } from "../../utils/cn";
import type { PortalPageDefinition } from "../../router/portalPages";

interface PortalPagePlaceholderProps {
  page: PortalPageDefinition;
}

const cardClass =
  "rounded-[24px] border border-[rgb(0_71_171_/_0.10)] bg-white/90 shadow-[0_18px_42px_rgb(14_35_59_/_0.10)]";

export default function PortalPagePlaceholder({
  page,
}: PortalPagePlaceholderProps) {
  return (
    <section className="grid gap-6">
      <div
        className={cn(
          cardClass,
          "grid gap-6 overflow-hidden p-6 max-[640px]:p-5",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-3">
            <span className="inline-flex w-max items-center rounded-full bg-primary-bg px-3 py-1 text-size13 font-bold text-primary">
              {page.eyebrow}
            </span>
            <div>
              <h1 className="text-[clamp(2rem,1.35rem+1.1vw,3rem)] font-bold leading-[1.15] text-header-fg">
                {page.title}
              </h1>
              <p className="mt-3 max-w-[60ch] text-size16 leading-[1.9] text-foreground-secondary">
                {page.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[20px] bg-[linear-gradient(155deg,var(--primary)_0%,#5d84dd_100%)] p-5 text-inverse-fg shadow-[0_16px_34px_rgb(10_27_62_/_0.20)] min-[900px]:min-w-[290px]">
            <div className="inline-flex items-center gap-2 text-white/80">
              <Sparkles size={16} />
              <span className="text-size12 font-semibold">
                صفحة جاهزة للاستبدال
              </span>
            </div>
            <div className="grid gap-2">
              <div className="inline-flex items-center gap-2 text-size14">
                <Route size={16} />
                <span>{page.path}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-size14">
                <LayoutTemplate size={16} />
                <span>
                  {page.role === "user"
                    ? "مرتبطة بـ User Layout"
                    : "مرتبطة بـ Company Layout"}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 text-size14">
                <Layers3 size={16} />
                <span>pageId: {page.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1.15fr_0.85fr] gap-5 max-[960px]:grid-cols-1">
          <div className={cn(cardClass, "grid gap-4 p-5")}>
            <div className="inline-flex items-center gap-2 text-primary">
              <ArrowUpLeft size={18} />
              <h2 className="text-size18 font-bold text-header-fg">
                ماذا تضعي هنا لاحقًا؟
              </h2>
            </div>
            <div className="grid gap-3">
              {page.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-primary-bg/55 px-4 py-3 text-size15 leading-[1.85] text-primary-fg"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className={cn(cardClass, "grid gap-4 p-5")}>
            <h2 className="text-size18 font-bold text-header-fg">
              طريقة الاستبدال
            </h2>
            <div className="grid gap-3 text-size15 leading-[1.9] text-foreground-secondary">
              <p>
                هذه الصفحة الحالية مجرد placeholder. لاحقًا استبدلي
                `PortalPagePlaceholder` بمكوّنك الحقيقي الخاص بهذه الصفحة فقط.
              </p>
              <p>
                لا تضيفي `PortalLayout` داخل الصفحة نفسها، لأن الـ route wrapper
                صار مسؤولًا عن لف جميع الصفحات تلقائيًا.
              </p>
              <p>
                إذا أضفتِ صفحة جديدة، أضيفيها داخل ملف route config، وبعدها
                ضعي لها component حقيقي بدل هذا الـ placeholder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
