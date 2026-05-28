import { useEffect, useMemo, useState } from "react";
import { Ban, Building2, Eye, RotateCcw, Search, ShieldAlert } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/global/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/global/ui/dialog";
import {
  type AdminCompany,
  type AdminCompanyStatus,
  getAdminCompanies,
} from "../../api/adminCompanies";
import { cn } from "../../utils/cn";
import {
  type CompanyProfileData,
  companyProfileSections,
} from "../../utils/portalProfileSchemas";

const statusLabels: Record<AdminCompanyStatus, string> = {
  active: "نشطة",
  blocked: "محظورة",
};

const dateFormatter = new Intl.DateTimeFormat("ar-SY", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getProfileValue(profile: CompanyProfileData, key: keyof CompanyProfileData) {
  return String(profile[key] || "غير محدد");
}

function getFieldDisplayValue(
  profile: CompanyProfileData,
  fieldName: keyof CompanyProfileData,
) {
  const rawValue = getProfileValue(profile, fieldName);

  for (const section of companyProfileSections) {
    const field = section.fields.find((item) => item.name === fieldName);
    const option = field?.options?.find((item) => item.value === rawValue);

    if (option) {
      return option.label;
    }
  }

  return rawValue;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminCompanyStatus>(
    "all",
  );
  const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null);

  useEffect(() => {
    getAdminCompanies().then(setCompanies);
  }, []);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return companies.filter((company) => {
      const profile = company.profile;
      const matchesStatus =
        statusFilter === "all" || company.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          profile.companyName,
          company.accountEmail,
          profile.companyEmail,
          profile.city,
          profile.sector,
          profile.hiringManagerName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [companies, searchTerm, statusFilter]);

  const activeCount = companies.filter((company) => company.status === "active").length;
  const blockedCount = companies.length - activeCount;

  const toggleBlockStatus = (companyId: string) => {
    setCompanies((currentCompanies) =>
      currentCompanies.map((company) =>
        company.id === companyId
          ? {
              ...company,
              status: company.status === "blocked" ? "active" : "blocked",
            }
          : company,
      ),
    );

    setSelectedCompany((currentCompany) =>
      currentCompany?.id === companyId
        ? {
            ...currentCompany,
            status: currentCompany.status === "blocked" ? "active" : "blocked",
          }
        : currentCompany,
    );
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-size13 font-semibold text-slate-500">
                إجمالي الشركات
              </p>
              <strong className="mt-2 block text-size28 text-[#17385e]">
                {companies.length}
              </strong>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
              <Building2 size={21} />
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الشركات النشطة
          </p>
          <strong className="mt-2 block text-size28 text-emerald-600">
            {activeCount}
          </strong>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الشركات المحظورة
          </p>
          <strong className="mt-2 block text-size28 text-red-600">
            {blockedCount}
          </strong>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="m-0 text-size20 font-bold text-[#17385e]">
              الشركات
            </h2>
            <p className="m-0 mt-1 text-size13 text-slate-500">
              عرض الشركات، مراجعة تفاصيل البروفايل، وإدارة حالة الحظر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-size13 text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="بحث باسم الشركة، البريد، المدينة..."
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | AdminCompanyStatus)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-size13 text-slate-700 outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشطة</option>
              <option value="blocked">محظورة</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الشركة
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  القطاع
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  المدينة
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  تاريخ التسجيل
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الوظائف
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  التدريبات
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الحالة
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  إجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="px-5 py-4">
                    <div>
                      <p className="m-0 font-bold text-[#17385e]">
                        {company.profile.companyName}
                      </p>
                      <p className="m-0 mt-1 text-size12 text-slate-500">
                        {company.accountEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {getFieldDisplayValue(company.profile, "sector")}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {company.profile.city}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {formatDate(company.joinedAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {company.publishedJobsCount}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {company.publishedTrainingsCount}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-lg px-3 py-1 text-size12 font-bold",
                        company.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700",
                      )}
                    >
                      {statusLabels[company.status]}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(company)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        aria-label="عرض التفاصيل"
                        title="عرض التفاصيل"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBlockStatus(company.id)}
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-lg border",
                          company.status === "blocked"
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            : "border-red-200 text-red-700 hover:bg-red-50",
                        )}
                        aria-label={
                          company.status === "blocked"
                            ? "فك حظر الشركة"
                            : "حظر الشركة"
                        }
                        title={
                          company.status === "blocked"
                            ? "فك حظر الشركة"
                            : "حظر الشركة"
                        }
                      >
                        {company.status === "blocked" ? (
                          <RotateCcw size={16} />
                        ) : (
                          <Ban size={16} />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="grid place-items-center px-5 py-12 text-center">
            <ShieldAlert className="text-slate-400" size={34} />
            <p className="m-0 mt-3 text-size15 font-semibold text-slate-600">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : null}
      </section>

      <Dialog
        open={selectedCompany !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCompany(null);
          }
        }}
      >
        {selectedCompany ? (
          <DialogContent className="w-[min(820px,92vw)] min-w-0">
            <DialogHeader className="text-start">
              <DialogTitle className="text-size22 text-[#17385e]">
                {selectedCompany.profile.companyName}
              </DialogTitle>
              <DialogDescription>
                كل البيانات المسجلة في بروفايل الشركة داخل المنصة.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[62vh] space-y-4 overflow-y-auto pe-1">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                  بيانات حساب الشركة على المنصة
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    ["بريد الحساب", selectedCompany.accountEmail],
                    ["تاريخ التسجيل", formatDate(selectedCompany.joinedAt)],
                    ["فرص العمل المنشورة", selectedCompany.publishedJobsCount.toString()],
                    [
                      "فرص التدريب المنشورة",
                      selectedCompany.publishedTrainingsCount.toString(),
                    ],
                    ["طلبات التوظيف", selectedCompany.applicationsCount.toString()],
                    ["حالة الحساب", statusLabels[selectedCompany.status]],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-white p-3">
                      <p className="m-0 text-size12 font-semibold text-slate-500">
                        {label}
                      </p>
                      <p className="m-0 mt-2 text-size13 font-bold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {companyProfileSections.map((section) => (
                <section
                  key={section.id}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                    {section.title}
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {section.fields.map((field) => (
                      <div key={field.name} className="rounded-lg bg-slate-50 p-3">
                        <p className="m-0 text-size12 font-semibold text-slate-500">
                          {field.label}
                        </p>
                        <p className="m-0 mt-2 whitespace-pre-wrap text-size13 font-bold leading-6 text-slate-800">
                          {getFieldDisplayValue(selectedCompany.profile, field.name)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => toggleBlockStatus(selectedCompany.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-size13 font-bold",
                  selectedCompany.status === "blocked"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-red-600 text-white hover:bg-red-700",
                )}
              >
                {selectedCompany.status === "blocked" ? (
                  <RotateCcw size={16} />
                ) : (
                  <Ban size={16} />
                )}
                {selectedCompany.status === "blocked"
                  ? "فك حظر الشركة"
                  : "حظر الشركة"}
              </button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
