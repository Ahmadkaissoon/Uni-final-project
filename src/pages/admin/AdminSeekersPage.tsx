import { useEffect, useMemo, useState } from "react";
import { Ban, Eye, RotateCcw, Search, ShieldAlert, Users } from "lucide-react";

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
  type AdminSeeker,
  type AdminSeekerStatus,
  getAdminSeekerById,
  getAdminSeekers,
  updateAdminSeekerStatus,
} from "../../api/adminSeekers";
import { withApiToast } from "../../api/apiToast";
import { cn } from "../../utils/cn";
import {
  type PersonProfileData,
  personProfileSections,
} from "../../utils/portalProfileSchemas";

const statusLabels: Record<AdminSeekerStatus, string> = {
  active: "نشط",
  blocked: "محظور",
};

const dateFormatter = new Intl.DateTimeFormat("ar-SY", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getProfileValue(profile: PersonProfileData, key: keyof PersonProfileData) {
  return String(profile[key] || "غير محدد");
}

function getFieldDisplayValue(
  profile: PersonProfileData,
  fieldName: keyof PersonProfileData,
) {
  const rawValue = getProfileValue(profile, fieldName);

  for (const section of personProfileSections) {
    const field = section.fields.find((item) => item.name === fieldName);
    const option = field?.options?.find((item) => item.value === rawValue);

    if (option) {
      return option.label;
    }
  }

  return rawValue;
}

export default function AdminSeekersPage() {
  const [seekers, setSeekers] = useState<AdminSeeker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminSeekerStatus>(
    "all",
  );
  const [selectedSeeker, setSelectedSeeker] = useState<AdminSeeker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSeekers() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminSeekers();

        if (mounted) {
          setSeekers(data);
        }
      } catch {
        if (mounted) {
          setError("تعذر تحميل بيانات الباحثين.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSeekers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSeekers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return seekers.filter((seeker) => {
      const profile = seeker.profile;
      const matchesStatus =
        statusFilter === "all" || seeker.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          profile.fullName,
          seeker.email,
          profile.phone,
          profile.city,
          profile.specialization,
          profile.university,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, seekers, statusFilter]);

  const activeCount = seekers.filter((seeker) => seeker.status === "active").length;
  const blockedCount = seekers.length - activeCount;

  const openSeekerDetails = async (seeker: AdminSeeker) => {
    setSelectedSeeker(seeker);
    setIsDetailsLoading(true);

    try {
      const details = await getAdminSeekerById(seeker.id);
      setSelectedSeeker(details);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const toggleBlockStatus = async (seeker: AdminSeeker) => {
    const shouldActivate = seeker.status === "blocked";
    setActiveMutationId(seeker.id);

    try {
      await withApiToast(
        updateAdminSeekerStatus(seeker.id, shouldActivate),
        {
          loading: shouldActivate
            ? "جارٍ تفعيل حساب الباحث..."
            : "جارٍ حظر حساب الباحث...",
          success: shouldActivate
            ? "تم تفعيل حساب الباحث بنجاح"
            : "تم حظر حساب الباحث بنجاح",
          error: "تعذر تحديث حالة الباحث",
        },
      );

      setSeekers((currentSeekers) =>
        currentSeekers.map((item) =>
          item.id === seeker.id
            ? { ...item, status: shouldActivate ? "active" : "blocked" }
            : item,
        ),
      );

      setSelectedSeeker((currentSeeker) =>
        currentSeeker?.id === seeker.id
          ? {
              ...currentSeeker,
              status: shouldActivate ? "active" : "blocked",
            }
          : currentSeeker,
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-size13 font-semibold text-slate-500">
                إجمالي الباحثين
              </p>
              <strong className="mt-2 block text-size28 text-[#17385e]">
                {seekers.length}
              </strong>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
              <Users size={21} />
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الحسابات النشطة
          </p>
          <strong className="mt-2 block text-size28 text-emerald-600">
            {activeCount}
          </strong>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الحسابات المحظورة
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
              الباحثون عن عمل
            </h2>
            <p className="m-0 mt-1 text-size13 text-slate-500">
              عرض بيانات الباحثين مع تفاصيل الملف الشخصي وإدارة حالة الحساب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-size13 text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="بحث بالاسم أو البريد أو المدينة..."
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | AdminSeekerStatus)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-size13 text-slate-700 outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="blocked">محظور</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="p-5 text-red-700">{error}</div>
        ) : isLoading ? (
          <div className="p-5 text-slate-500">جارٍ تحميل الباحثين...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="px-5 py-4 font-bold text-slate-600">
                      الاسم
                    </TableHead>
                    <TableHead className="px-5 py-4 font-bold text-slate-600">
                      الاختصاص
                    </TableHead>
                    <TableHead className="px-5 py-4 font-bold text-slate-600">
                      المدينة
                    </TableHead>
                    <TableHead className="px-5 py-4 font-bold text-slate-600">
                      تاريخ التسجيل
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
                  {filteredSeekers.map((seeker) => (
                    <TableRow key={seeker.id}>
                      <TableCell className="px-5 py-4">
                        <div>
                          <p className="m-0 font-bold text-[#17385e]">
                            {seeker.profile.fullName}
                          </p>
                          <p className="m-0 mt-1 text-size12 text-slate-500">
                            {seeker.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-slate-600">
                        {seeker.profile.specialization || "غير محدد"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-slate-600">
                        {seeker.profile.city || "غير محدد"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-slate-600">
                        {formatDate(seeker.joinedAt)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-lg px-3 py-1 text-size12 font-bold",
                            seeker.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700",
                          )}
                        >
                          {statusLabels[seeker.status]}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openSeekerDetails(seeker)}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                            aria-label="عرض التفاصيل"
                            title="عرض التفاصيل"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBlockStatus(seeker)}
                            disabled={activeMutationId === seeker.id}
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-lg border disabled:opacity-60",
                              seeker.status === "blocked"
                                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                : "border-red-200 text-red-700 hover:bg-red-50",
                            )}
                            aria-label={
                              seeker.status === "blocked"
                                ? "فك حظر المستخدم"
                                : "حظر المستخدم"
                            }
                            title={
                              seeker.status === "blocked"
                                ? "فك حظر المستخدم"
                                : "حظر المستخدم"
                            }
                          >
                            {seeker.status === "blocked" ? (
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

            {filteredSeekers.length === 0 ? (
              <div className="grid place-items-center px-5 py-12 text-center">
                <ShieldAlert className="text-slate-400" size={34} />
                <p className="m-0 mt-3 text-size15 font-semibold text-slate-600">
                  لا توجد نتائج مطابقة
                </p>
              </div>
            ) : null}
          </>
        )}
      </section>

      <Dialog
        open={selectedSeeker !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSeeker(null);
          }
        }}
      >
        {selectedSeeker ? (
          <DialogContent className="w-[min(820px,92vw)] min-w-0">
            <DialogHeader className="text-start">
              <DialogTitle className="text-size22 text-[#17385e]">
                {selectedSeeker.profile.fullName}
              </DialogTitle>
              <DialogDescription>
                تفاصيل حساب الباحث كما يعرضها الـ API داخل لوحة الإدارة.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[62vh] space-y-4 overflow-y-auto pe-1">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                  بيانات الحساب
                </h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    ["البريد الإلكتروني", selectedSeeker.email],
                    ["تاريخ التسجيل", formatDate(selectedSeeker.joinedAt)],
                    ["الطلبات المرسلة", selectedSeeker.applicationsCount.toString()],
                    ["الوظائف المحفوظة", selectedSeeker.savedJobsCount.toString()],
                    ["حالة الحساب", statusLabels[selectedSeeker.status]],
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

              {isDetailsLoading ? (
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-500">
                  جارٍ تحميل التفاصيل الكاملة...
                </div>
              ) : null}

              {personProfileSections.map((section) => (
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
                          {getFieldDisplayValue(selectedSeeker.profile, field.name)}
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
                onClick={() => toggleBlockStatus(selectedSeeker)}
                disabled={activeMutationId === selectedSeeker.id}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-size13 font-bold text-white disabled:opacity-60",
                  selectedSeeker.status === "blocked"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700",
                )}
              >
                {selectedSeeker.status === "blocked" ? (
                  <RotateCcw size={16} />
                ) : (
                  <Ban size={16} />
                )}
                {selectedSeeker.status === "blocked"
                  ? "فك حظر المستخدم"
                  : "حظر المستخدم"}
              </button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
