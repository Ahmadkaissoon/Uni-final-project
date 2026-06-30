import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";

const overviewCards = [
  {
    title: "الباحثون عن عمل",
    value: "0",
    note: "جاهزة لربط جدول المستخدمين",
    icon: Users,
  },
  {
    title: "الشركات",
    value: "0",
    note: "جاهزة لربط جدول الشركات",
    icon: Building2,
  },
  {
    title: "فرص العمل",
    value: "0",
    note: "جاهزة لربط جدول فرص العمل",
    icon: BriefcaseBusiness,
  },
  {
    title: "فرص التدريب",
    value: "0",
    note: "جاهزة لربط جدول فرص التدريب",
    icon: GraduationCap,
  },
];

export default function AdminOverviewPage() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-size13 font-semibold text-slate-500">
                  {card.title}
                </p>
                <strong className="mt-3 block text-size30 font-bold text-[#17385e]">
                  {card.value}
                </strong>
              </div>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
                <Icon size={21} />
              </span>
            </div>
            <p className="m-0 mt-4 text-size12 text-slate-500">{card.note}</p>
          </article>
        );
      })}
    </section>
  );
}
