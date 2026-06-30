import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Eye,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";

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
import { type AdminJobRecord, getAdminJobs } from "../../api/adminJobs";

const dateFormatter = new Intl.DateTimeFormat("ar-SY", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJobRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<AdminJobRecord | null>(null);

  useEffect(() => {
    getAdminJobs().then(setJobs);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.category))),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesCategory =
        categoryFilter === "all" || job.category === categoryFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          job.jobTitle,
          job.companyName,
          job.companyLegalName,
          job.location,
          job.category,
          job.companyWebsite,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, jobs, searchTerm]);

  const deleteJob = (jobId: string) => {
    setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
    setSelectedJob((currentJob) => (currentJob?.id === jobId ? null : currentJob));
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-size13 font-semibold text-slate-500">
                إجمالي فرص العمل
              </p>
              <strong className="mt-2 block text-size28 text-[#17385e]">
                {jobs.length}
              </strong>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
              <BriefcaseBusiness size={21} />
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            الشركات الناشرة
          </p>
          <strong className="mt-2 block text-size28 text-[#17385e]">
            {new Set(jobs.map((job) => job.companyName)).size}
          </strong>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <p className="m-0 text-size13 font-semibold text-slate-500">
            إجمالي الطلبات
          </p>
          <strong className="mt-2 block text-size28 text-emerald-600">
            {jobs.reduce((total, job) => total + job.applicationsCount, 0)}
          </strong>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="m-0 text-size20 font-bold text-[#17385e]">
              فرص العمل المنشورة
            </h2>
            <p className="m-0 mt-1 text-size13 text-slate-500">
              عرض فرص العمل، الشركة الناشرة، تفاصيل الفرصة، وحذفها من المنصة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500">
              <Search size={17} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-size13 text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="بحث بالمسمى، الشركة، المدينة..."
              />
            </label>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-size13 text-slate-700 outline-none"
            >
              <option value="all">كل التصنيفات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
                  فرصة العمل
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  الشركة الناشرة
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  التصنيف
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  المدينة
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
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="px-5 py-4">
                    <div>
                      <p className="m-0 font-bold text-[#17385e]">
                        {job.jobTitle}
                      </p>
                      <p className="m-0 mt-1 text-size12 text-slate-500">
                        {job.companyWebsite}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {job.companyName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {job.category}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {job.location}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {formatDate(job.publishedAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {job.applicationsCount}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        aria-label="عرض التفاصيل"
                        title="عرض التفاصيل"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteJob(job.id)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                        aria-label="حذف فرصة العمل"
                        title="حذف فرصة العمل"
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

        {filteredJobs.length === 0 ? (
          <div className="grid place-items-center px-5 py-12 text-center">
            <ShieldAlert className="text-slate-400" size={34} />
            <p className="m-0 mt-3 text-size15 font-semibold text-slate-600">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : null}
      </section>

      <Dialog
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJob(null);
          }
        }}
      >
        {selectedJob ? (
          <DialogContent className="w-[min(920px,92vw)] min-w-0">
            <DialogHeader className="text-start">
              <DialogTitle className="text-size22 text-[#17385e]">
                {selectedJob.jobTitle}
              </DialogTitle>
              <DialogDescription>
                تفاصيل فرصة العمل كما تظهر في واجهة المنصة.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[62vh] space-y-4 overflow-y-auto pe-1">
              <section className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div className="self-start overflow-hidden rounded-lg bg-[#dbe9f8]">
                  <img
                    src={selectedJob.imageSrc}
                    alt={selectedJob.imageAlt}
                    className="aspect-[1.62/1] w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-size13 font-semibold text-warning-color">
                    {selectedJob.category}
                  </p>
                  <h3 className="m-0 mt-2 text-size22 font-bold text-[#17385e]">
                    {selectedJob.jobTitle}
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ["الشركة الناشرة", selectedJob.companyName],
                      ["موقع الشركة", selectedJob.companyWebsite],
                      ["المدينة", selectedJob.location],
                      ["تاريخ النشر", formatDate(selectedJob.publishedAt)],
                      ["عدد الطلبات", selectedJob.applicationsCount.toString()],
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
                  تفاصيل الفرصة
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedJob.detailColumns.flat().map((detail) => (
                    <div key={detail.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="m-0 text-size12 font-semibold text-slate-500">
                        {detail.label}
                      </p>
                      <p className="m-0 mt-2 whitespace-pre-wrap text-size13 font-bold leading-6 text-slate-800">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => deleteJob(selectedJob.id)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-size13 font-bold text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
                حذف فرصة العمل من المنصة
              </button>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
