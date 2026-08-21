import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";

import axiosClient from "../../api/axiosClient";

interface AdminOverviewResponse {
  seekersNumber: number;
  companiesNumber: number;
  jobsNumber: number;
  trainingsNumber: number;
}

const overviewCards = [
  {
    key: "seekersNumber",
    title: "الباحثون عن عمل",
    note: "إجمالي حسابات الباحثين المسجلة على المنصة",
    icon: Users,
  },
  {
    key: "companiesNumber",
    title: "الشركات",
    note: "إجمالي حسابات الشركات داخل المنصة",
    icon: Building2,
  },
  {
    key: "jobsNumber",
    title: "فرص العمل",
    note: "عدد فرص العمل المنشورة حاليًا",
    icon: BriefcaseBusiness,
  },
  {
    key: "trainingsNumber",
    title: "فرص التدريب",
    note: "عدد فرص التدريب المنشورة حاليًا",
    icon: GraduationCap,
  },
] as const;

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      try {
        setError(null);
        const response = await axiosClient.get<AdminOverviewResponse>(
          "/dashboard/overview",
        );

        if (mounted) {
          setOverview(response.data);
        }
      } catch {
        if (mounted) {
          setError("تعذر تحميل ملخص لوحة التحكم.");
        }
      }
    }

    loadOverview();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        const value =
          overview?.[card.key as keyof AdminOverviewResponse] ?? "...";

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
                  {value}
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
