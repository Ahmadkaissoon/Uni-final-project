import { type ReactNode, useMemo, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import blueLogo from "../../assets/icons/blue_logo.png";
import { cn } from "../../utils/cn";
import { adminPages } from "../../router/adminPages";

interface AdminLayoutProps {
  activePageId: string;
  children: ReactNode;
  onPageChange?: (pageId: string) => void;
}

const adminNavIcons = {
  "admin-overview": LayoutDashboard,
  "admin-seekers": Users,
  "admin-managers": UserCog,
  "admin-companies": Building2,
  "admin-jobs": BriefcaseBusiness,
  "admin-trainings": GraduationCap,
} as const;

const adminNotifications = [
  {
    id: "notification-001",
    title: "تم تسجيل شركة جديدة",
    description: "شركة Tech Bridge انضمت حديثاً إلى المنصة.",
    time: "منذ 8 دقائق",
    pageId: "admin-companies",
  },
  {
    id: "notification-002",
    title: "تمت إضافة فرصة عمل جديدة",
    description: "فرصة مطور واجهات من قبل شركة Data Lens.",
    time: "منذ 25 دقيقة",
    pageId: "admin-jobs",
  },
  {
    id: "notification-003",
    title: "تم نشر فرصة تدريب",
    description: "تدريب UI/UX جديد من قبل شركة Pixel Works.",
    time: "منذ ساعة",
    pageId: "admin-trainings",
  },
  {
    id: "notification-004",
    title: "تم تسجيل باحث عن عمل جديد",
    description: "المستخدم سارة منصور أكمل إنشاء حسابه.",
    time: "اليوم",
    pageId: "admin-seekers",
  },
];

export default function AdminLayout({
  activePageId,
  children,
  onPageChange,
}: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const activePage = useMemo(
    () =>
      adminPages.find((page) => page.id === activePageId) ?? adminPages[0],
    [activePageId],
  );

  const handlePageChange = (pageId: string) => {
    setMobileSidebarOpen(false);
    setNotificationsOpen(false);
    onPageChange?.(pageId);
  };

  const unreadNotificationsCount = adminNotifications.filter(
    (notification) => !readNotificationIds.includes(notification.id),
  ).length;

  const markAllNotificationsAsRead = () => {
    setReadNotificationIds(
      adminNotifications.map((notification) => notification.id),
    );
  };

  const handleNotificationClick = (notification: (typeof adminNotifications)[number]) => {
    setReadNotificationIds((currentIds) =>
      currentIds.includes(notification.id)
        ? currentIds
        : [...currentIds, notification.id],
    );
    handlePageChange(notification.pageId);
  };

  return (
    <div
      dir="rtl"
      className="min-h-svh bg-[#f4f7fb] text-foreground"
    >
      <div className="flex min-h-svh">
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-40 flex w-[280px] translate-x-full flex-col border-l border-slate-200 bg-white shadow-[0_24px_70px_rgb(15_23_42_/_0.14)] transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none",
            mobileSidebarOpen && "translate-x-0",
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
            <button
              type="button"
              className="flex h-12 w-[112px] items-center justify-center rounded-lg bg-white shadow-[0_10px_24px_rgb(0_71_171_/_0.12)]"
              onClick={() => handlePageChange("admin-overview")}
              aria-label="وظيفتي"
            >
              <img className="h-10 w-full object-contain" src={blueLogo} alt="وظيفتي" />
            </button>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pb-3 pt-5">
            <div className="rounded-lg border border-[#dce8f7] bg-[#edf5ff] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                  <ShieldCheck size={20} />
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-size14 font-bold text-[#16385f]">
                    مدير المنصة
                  </p>
                  <p className="m-0 truncate text-size12 text-slate-500">
                    مراقبة البيانات والصلاحيات
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="grid gap-1 px-4 py-2" aria-label="تنقل لوحة الأدمن">
            {adminPages.map((page) => {
              const Icon = adminNavIcons[page.id as keyof typeof adminNavIcons];
              const isActive = page.id === activePageId;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageChange(page.id)}
                  className={cn(
                    "flex min-h-12 w-full items-center gap-3 rounded-lg px-4 text-start text-size14 font-semibold text-slate-600 transition hover:bg-[#eef5ff] hover:text-primary",
                    isActive &&
                      "bg-primary text-white shadow-[0_12px_24px_rgb(0_71_171_/_0.18)] hover:bg-primary hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  <span>{page.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {mobileSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="إغلاق قائمة الأدمن"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex min-h-20 items-center gap-3 px-5 py-3 lg:px-8">
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="فتح القائمة"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="m-0 text-size12 font-semibold text-slate-500">
                  لوحة تحكم المنصة
                </p>
                <h1 className="m-0 truncate text-size22 font-bold text-[#17385e]">
                  {activePage.title}
                </h1>
              </div>

              <div className="hidden h-11 min-w-[280px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 md:flex">
                <Search size={17} />
                <span className="text-size13">بحث سريع داخل لوحة التحكم</span>
              </div>

              <button
                type="button"
                className={cn(
                  "relative inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100",
                  notificationsOpen && "bg-slate-100 text-primary",
                )}
                aria-label="الإشعارات"
                aria-expanded={notificationsOpen}
                onClick={() =>
                  setNotificationsOpen((currentValue) => !currentValue)
                }
              >
                <Bell size={19} />
                <span className="absolute -top-1 -left-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-5 text-white">
                    {unreadNotificationsCount}
                  </span>
              </button>
              {notificationsOpen ? (
                <div className="absolute left-5 top-full z-50 mt-3 w-[min(360px,calc(100vw-40px))] overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-[0_24px_70px_rgb(15_23_42_/_0.16)] lg:left-8">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div>
                      <h2 className="m-0 text-size15 font-bold text-[#17385e]">
                        الإشعارات
                      </h2>
                      <p className="m-0 mt-1 text-size12 text-slate-500">
                        آخر نشاطات المنصة
                      </p>
                    </div>
                    <span className="rounded-lg bg-[#edf5ff] px-2.5 py-1 text-size12 font-bold text-primary">
                      {unreadNotificationsCount} جديد
                    </span>
                  </div>

                  <div className="border-b border-slate-100 px-4 py-2">
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="w-full rounded-lg px-3 py-2 text-size12 font-bold text-primary hover:bg-[#edf5ff] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                      disabled={unreadNotificationsCount === 0}
                    >
                      تعيين الكل كمقروءة
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {adminNotifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                          "flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-start last:border-b-0 hover:bg-slate-50",
                          readNotificationIds.includes(notification.id) &&
                            "bg-slate-50/70 opacity-75",
                        )}
                      >
                        <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <CheckCircle2 size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="m-0 text-size13 font-bold text-slate-800">
                              {notification.title}
                            </h3>
                            <span className="shrink-0 text-size11 text-slate-400">
                              {notification.time}
                            </span>
                          </div>
                          <p className="m-0 mt-1 text-size12 leading-6 text-slate-600">
                            {notification.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </header>

          <main className="flex-1 px-5 py-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-[1180px] gap-6">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgb(15_23_42_/_0.05)]">
                <p className="m-0 max-w-3xl text-size15 leading-7 text-slate-600">
                  {activePage.description}
                </p>
              </section>

              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
