import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  UserCog,
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
import {
  type AdminManager,
  type AdminManagerFormValues,
  type AdminManagerStatus,
  demoCurrentAdminCredentials,
  getAdminManagers,
} from "../../api/adminManagers";
import { cn } from "../../utils/cn";

const emptyFormValues: AdminManagerFormValues = {
  name: "",
  email: "",
  roleTitle: "",
  password: "",
  confirmPassword: "",
};

const statusLabels: Record<AdminManagerStatus, string> = {
  active: "نشط",
  disabled: "معطل",
};

const dateFormatter = new Intl.DateTimeFormat("ar-SY", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function validateForm(values: AdminManagerFormValues, isEditing: boolean) {
  if (!values.name.trim()) {
    return "اسم المشرف مطلوب.";
  }

  if (!values.email.trim() || !values.email.includes("@")) {
    return "أدخل بريد منصة صالح.";
  }

  if (!values.roleTitle.trim()) {
    return "المسمى الإداري مطلوب.";
  }

  if (!isEditing || values.password || values.confirmPassword) {
    if (values.password.length < 8) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
    }

    if (values.password !== values.confirmPassword) {
      return "تأكيد كلمة المرور غير مطابق.";
    }
  }

  return null;
}

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<AdminManager[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminManagerStatus>(
    "all",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<AdminManager | null>(null);
  const [formValues, setFormValues] =
    useState<AdminManagerFormValues>(emptyFormValues);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    getAdminManagers().then(setManagers);
  }, []);

  const filteredManagers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return managers.filter((manager) => {
      const matchesStatus =
        statusFilter === "all" || manager.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [manager.name, manager.email, manager.roleTitle]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [managers, searchTerm, statusFilter]);

  const activeCount = managers.filter((manager) => manager.status === "active").length;
  const disabledCount = managers.length - activeCount;

  const openCreateDialog = () => {
    setEditingManager(null);
    setFormValues(emptyFormValues);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (manager: AdminManager) => {
    setEditingManager(manager);
    setFormValues({
      name: manager.name,
      email: manager.email,
      roleTitle: manager.roleTitle,
      password: "",
      confirmPassword: "",
    });
    setFormError(null);
    setDialogOpen(true);
  };

  const updateFormField = (
    field: keyof AdminManagerFormValues,
    value: string,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFormError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateForm(formValues, editingManager !== null);

    if (error) {
      setFormError(error);
      return;
    }

    if (editingManager) {
      setManagers((currentManagers) =>
        currentManagers.map((manager) =>
          manager.id === editingManager.id
            ? {
                ...manager,
                name: formValues.name.trim(),
                email: formValues.email.trim(),
                roleTitle: formValues.roleTitle.trim(),
              }
            : manager,
        ),
      );
    } else {
      setManagers((currentManagers) => [
        {
          id: `admin-${Date.now()}`,
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          roleTitle: formValues.roleTitle.trim(),
          createdAt: new Date().toISOString().slice(0, 10),
          lastLoginAt: "لم يسجل الدخول بعد",
          status: "active",
        },
        ...currentManagers,
      ]);
    }

    setDialogOpen(false);
    setEditingManager(null);
    setFormValues(emptyFormValues);
  };

  const deleteManager = (managerId: string) => {
    setManagers((currentManagers) =>
      currentManagers.filter((manager) => manager.id !== managerId),
    );
  };

  const toggleManagerStatus = (managerId: string) => {
    setManagers((currentManagers) =>
      currentManagers.map((manager) =>
        manager.id === managerId
          ? {
              ...manager,
              status: manager.status === "active" ? "disabled" : "active",
            }
          : manager,
      ),
    );
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-size13 font-semibold text-slate-500">
                إجمالي المشرفين
              </p>
              <strong className="mt-2 block text-size28 text-[#17385e]">
                {managers.length}
              </strong>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[#edf5ff] text-primary">
              <UserCog size={21} />
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
            الحسابات المعطلة
          </p>
          <strong className="mt-2 block text-size28 text-red-600">
            {disabledCount}
          </strong>
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="m-0 text-size20 font-bold text-[#17385e]">
              مشرفو المنصة
            </h2>
            <p className="m-0 mt-1 text-size13 text-slate-500">
              إنشاء وتعديل وحذف حسابات الأدمن الخاصة بلوحة التحكم.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-size13 font-bold text-white hover:bg-primary-hover"
          >
            <Plus size={17} />
            إضافة مشرف
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-5">
          <label className="flex h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500">
            <Search size={17} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-size13 text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="بحث بالاسم، البريد، الصلاحية..."
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | AdminManagerStatus)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-size13 text-slate-700 outline-none"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="disabled">معطل</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  المشرف
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  المسمى
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  تاريخ الإنشاء
                </TableHead>
                <TableHead className="px-5 py-4 font-bold text-slate-600">
                  آخر دخول
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
              {filteredManagers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell className="px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="m-0 font-bold text-[#17385e]">
                          {manager.name}
                        </p>
                        {manager.isCurrentUser ? (
                          <span className="rounded-lg bg-[#edf5ff] px-2 py-0.5 text-size11 font-bold text-primary">
                            الحساب الحالي
                          </span>
                        ) : null}
                      </div>
                      <p className="m-0 mt-1 text-size12 text-slate-500">
                        {manager.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {manager.roleTitle}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {formatDate(manager.createdAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-slate-600">
                    {manager.lastLoginAt === "لم يسجل الدخول بعد"
                      ? manager.lastLoginAt
                      : formatDate(manager.lastLoginAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-lg px-3 py-1 text-size12 font-bold",
                        manager.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700",
                      )}
                    >
                      {statusLabels[manager.status]}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditDialog(manager)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        aria-label="تعديل حساب المشرف"
                        title="تعديل"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleManagerStatus(manager.id)}
                        className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-size12 font-bold text-slate-700 hover:bg-slate-100"
                        disabled={manager.isCurrentUser}
                      >
                        {manager.status === "active" ? "تعطيل" : "تفعيل"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteManager(manager.id)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="حذف حساب المشرف"
                        title="حذف"
                        disabled={manager.isCurrentUser}
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

        {filteredManagers.length === 0 ? (
          <div className="grid place-items-center px-5 py-12 text-center">
            <ShieldAlert className="text-slate-400" size={34} />
            <p className="m-0 mt-3 text-size15 font-semibold text-slate-600">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-[#dce8f7] bg-[#edf5ff] p-5">
        <h2 className="m-0 text-size16 font-bold text-[#17385e]">
          الحساب الوهمي الحالي
        </h2>
        <p className="m-0 mt-2 text-size13 leading-7 text-slate-600">
          البريد: {demoCurrentAdminCredentials.email}، كلمة المرور:
          {" "}
          {demoCurrentAdminCredentials.password}
        </p>
      </section>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingManager(null);
            setFormError(null);
          }
        }}
      >
        <DialogContent className="w-[min(620px,92vw)] min-w-0">
          <DialogHeader className="text-start">
            <DialogTitle className="text-size22 text-[#17385e]">
              {editingManager ? "تعديل حساب مشرف" : "إضافة مشرف جديد"}
            </DialogTitle>
            <DialogDescription>
              هذا الحساب يستطيع تسجيل الدخول من واجهة الدخول كأدمن والانتقال إلى لوحة التحكم.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-size13 font-bold text-slate-600">
                  اسم المشرف
                </span>
                <input
                  value={formValues.name}
                  onChange={(event) => updateFormField("name", event.target.value)}
                  className="h-11 rounded-lg border border-slate-200 px-3 text-size13 outline-none focus:border-primary"
                  placeholder="مثال: أحمد المسؤول"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-size13 font-bold text-slate-600">
                  المسمى الإداري
                </span>
                <input
                  value={formValues.roleTitle}
                  onChange={(event) =>
                    updateFormField("roleTitle", event.target.value)
                  }
                  className="h-11 rounded-lg border border-slate-200 px-3 text-size13 outline-none focus:border-primary"
                  placeholder="مثال: مشرف منصة"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-size13 font-bold text-slate-600">
                البريد الخاص بالمنصة
              </span>
              <input
                type="email"
                value={formValues.email}
                onChange={(event) => updateFormField("email", event.target.value)}
                className="h-11 rounded-lg border border-slate-200 px-3 text-size13 outline-none focus:border-primary"
                placeholder="admin@wazefti.local"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-size13 font-bold text-slate-600">
                  كلمة المرور
                </span>
                <input
                  type="password"
                  value={formValues.password}
                  onChange={(event) =>
                    updateFormField("password", event.target.value)
                  }
                  className="h-11 rounded-lg border border-slate-200 px-3 text-size13 outline-none focus:border-primary"
                  placeholder={editingManager ? "اتركها فارغة دون تغيير" : "********"}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-size13 font-bold text-slate-600">
                  تأكيد كلمة المرور
                </span>
                <input
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={(event) =>
                    updateFormField("confirmPassword", event.target.value)
                  }
                  className="h-11 rounded-lg border border-slate-200 px-3 text-size13 outline-none focus:border-primary"
                  placeholder={editingManager ? "اتركها فارغة دون تغيير" : "********"}
                />
              </label>
            </div>

            {formError ? (
              <p className="m-0 rounded-lg bg-red-50 px-3 py-2 text-size13 font-bold text-red-700">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-size13 font-bold text-slate-700 hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-primary px-4 text-size13 font-bold text-white hover:bg-primary-hover"
              >
                {editingManager ? "حفظ التعديلات" : "إضافة المشرف"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
