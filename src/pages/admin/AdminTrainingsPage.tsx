import { useEffect, useMemo, useState } from "react";
import { Eye, GraduationCap, Search, ShieldAlert, Trash2 } from "lucide-react";

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
  type AdminTrainingRecord,
  getAdminTrainings,
} from "../../api/adminTrainings";

const dateFormatter = new Intl.DateTimeFormat("ar-SY", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<AdminTrainingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedTraining, setSelectedTraining] =
    useState<AdminTrainingRecord | null>(null);

  useEffect(() => {
    getAdminTrainings().then(setTrainings);
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(trainings.map((training) => training.location))),
    [trainings],
  );

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return trainings.filter((training) => {
      const matchesLocation =
        locationFilter === "all" || training.location === locationFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          training.trainingType,
          training.companyName,
          training.companyLegalName,
          training.location,
          training.companyWebsite,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesLocation && matchesSearch;
    });
  }, [locationFilter, searchTerm, trainings]);

  const deleteTraining = (trainingId: string) => {
    setTrainings((currentTrainings) =>
      currentTrainings.filter((training) => training.id !== trainingId),
    );
    setSelectedTraining((currentTraining) =>
      currentTraining?.id === trainingId ? null : currentTraining,
    );
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-size13 font-semibold text-slate-500">
                إجمالي فرص التدريب
              </p>
              <strong className="mt-2 block text-size28 text-[#17385e]">
                {trainings.length}
              </strong>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
              <GraduationCap size={21} />
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الشركات الناشرة
          </p>
          <strong className="mt-2 block text-size28 text-[#17385e]">
            {new Set(trainings.map((training) => training.companyName)).size}
          </strong>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            إجمالي الطلبات
          </p>
          <strong className="mt-2 block text-size28 text-emerald-600">
            {trainings.reduce(
              (total, training) => total + training.applicationsCount,
              0,
            )}
          </strong>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="m-0 text-size20 font-bold text-[#17385e]">
              فرص التدريب المنشورة
            </h2>
            <p className="m-0 mt-1 text-size13 text-slate-500">
              عرض فرص التدريب، الشركة الناشرة، تفاصيل الفرصة، وحذفها من المنصة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-size13 text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="بحث باسم التدريب، الشركة، الموقع..."
              />
            </label>

            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-size13 text-slate-700 outline-none"
            >
              <option value="all">كل المواقع</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  فرصة التدريب
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الشركة الناشرة
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الموقع
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  تاريخ النشر
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الطلبات
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  إجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="px-5 py-4">
                    <div>
                      <p className="m-0 font-bold text-[#17385e]">
                        {training.trainingType}
                      </p>
                      <p className="m-0 mt-1 text-size12 text-slate-500">
                        {training.companyWebsite}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {training.companyName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {training.location}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {formatDate(training.publishedAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {training.applicationsCount}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTraining(training)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        aria-label="عرض التفاصيل"
                        title="عرض التفاصيل"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTraining(training.id)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                        aria-label="حذف فرصة التدريب"
                        title="حذف فرصة التدريب"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTrainings.length === 0 ? (
          <div className="grid place-items-center px-5 py-12 text-center">
            <ShieldAlert className="text-slate-400" size={34} />
            <p className="m-0 mt-3 text-size15 font-semibold text-slate-600">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : null}
      </section>

      <Dialog
        open={selectedTraining !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTraining(null);
          }
        }}
      >
        {selectedTraining ? (
          <DialogContent className="w-[min(920px,92vw)] min-w-0">
            <DialogHeader className="text-start">
              <DialogTitle className="text-size22 text-[#17385e]">
                {selectedTraining.trainingType}
              </DialogTitle>
              <DialogDescription>
                تفاصيل فرصة التدريب كما تظهر في واجهة المنصة.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[62vh] space-y-4 overflow-y-auto pe-1">
              <section className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="self-start overflow-hidden rounded-lg bg-[#dbe9f8]">
                  <img
                    src={selectedTraining.imageSrc}
                    alt={selectedTraining.imageAlt}
                    className="aspect-[1.62/1] w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-size13 font-semibold text-warning-color">
                    {selectedTraining.location}
                  </p>
                  <h3 className="m-0 mt-2 text-size22 font-bold text-[#17385e]">
                    {selectedTraining.trainingType}
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ["الشركة الناشرة", selectedTraining.companyName],
                      ["موقع الشركة", selectedTraining.companyWebsite],
                      ["الموقع", selectedTraining.location],
                      ["تاريخ النشر", formatDate(selectedTraining.publishedAt)],
                      [
                        "عدد الطلبات",
                        selectedTraining.applicationsCount.toString(),
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-white p-3">
                        <p className="m-0 text-size12 font-semibold text-slate-500">
                          {label}
                        </p>
                        <p className="m-0 mt-2 break-words text-size13 font-bold text-slate-800">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                  معلومات سريعة
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {selectedTraining.quickFacts.map((fact) => (
                    <div key={fact.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="m-0 text-size12 font-semibold text-slate-500">
                        {fact.label}
                      </p>
                      <p className="m-0 mt-2 whitespace-pre-wrap text-size13 font-bold leading-6 text-slate-800">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                  عن التدريب
                </h3>
                <p className="m-0 mt-3 text-size14 font-semibold leading-7 text-slate-700">
                  {selectedTraining.overview}
                </p>
              </section>

              <section className="grid gap-4 lg:grid-cols-3">
                {[
                  ["المهام والمسؤوليات", selectedTraining.responsibilities],
                  ["المهارات", selectedTraining.skills],
                  ["الشروط", selectedTraining.requirements],
                ].map(([title, items]) => (
                  <div
                    key={title as string}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <h3 className="m-0 text-size16 font-bold text-[#17385e]">
                      {title as string}
                    </h3>
                    <ul className="m-0 mt-4 grid gap-3 p-0">
                      {(items as string[]).map((item) => (
                        <li
                          key={item}
                          className="list-none rounded-lg bg-slate-50 p-3 text-size13 font-semibold leading-6 text-slate-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => deleteTraining(selectedTraining.id)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-size13 font-bold text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
                حذف فرصة التدريب من المنصة
              </button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
