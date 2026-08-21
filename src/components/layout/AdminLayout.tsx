import { type ReactNode, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import blueLogo from "../../assets/icons/blue_logo.png";
import {
  type AppNotification,
  useNotificationsCenter,
} from "../../api/notifications";
import { adminPages } from "../../router/adminPages";
import { cn } from "../../utils/cn";
import NotificationCenter from "../global/notifications/NotificationCenter";

interface AdminLayoutProps {
  activePageId: string;
  children: ReactNode;
  onPageChange?: (pageId: string) => void;
  onLogout?: () => void;
}

const adminNavIcons = {
  "admin-overview": LayoutDashboard,
  "admin-seekers": Users,
  "admin-managers": UserCog,
  "admin-companies": Building2,
  "admin-jobs": BriefcaseBusiness,
  "admin-trainings": GraduationCap,
} as const;

function resolveAdminNotificationPage(notification: AppNotification) {
  if (
    notification.type.code === "new_job" ||
    notification.related.model === "Job"
  ) {
    return "admin-jobs";
  }

  if (
    notification.type.code === "new_training" ||
    notification.related.model === "Training"
  ) {
    return "admin-trainings";
  }

  if (notification.related.model === "Company") {
    return "admin-companies";
  }

  if (
    notification.type.code === "application_status" ||
    notification.related.model === "Application" ||
    notification.related.model === "User"
  ) {
    return "admin-seekers";
  }

  return "admin-overview";
}

export default function AdminLayout({
  activePageId,
  children,
  onPageChange,
  onLogout,
}: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsCenter = useNotificationsCenter(true);
  const activePage = useMemo(
    () => adminPages.find((page) => page.id === activePageId) ?? adminPages[0],
    [activePageId],
  );

  const handlePageChange = (pageId: string) => {
    setMobileSidebarOpen(false);
    setNotificationsOpen(false);
    onPageChange?.(pageId);
  };

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.status.isRead) {
      await notificationsCenter.markAsRead(notification.id);
    }

    handlePageChange(resolveAdminNotificationPage(notification));
  };

  const handleDeleteNotification = async (notification: AppNotification) => {
    await notificationsCenter.deleteNotification(notification.id);
  };

  return (
    <div dir="rtl" className="min-h-svh bg-[#f4f7fb] text-foreground">
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
              <img
                className="h-10 w-full object-contain"
                src={blueLogo}
                alt="وظيفتي"
              />
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

              <NotificationCenter
                notifications={notificationsCenter.notifications}
                unreadCount={notificationsCenter.unreadCount}
                open={notificationsOpen}
                loading={notificationsCenter.isLoading}
                error={
                  notificationsCenter.error instanceof Error
                    ? notificationsCenter.error.message
                    : null
                }
                busy={notificationsCenter.isUpdating}
                onToggle={() =>
                  setNotificationsOpen((currentValue) => !currentValue)
                }
                onMarkAllAsRead={() => notificationsCenter.markAllAsRead()}
                onNotificationClick={handleNotificationClick}
                onDeleteNotification={handleDeleteNotification}
              />

              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-size13 font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:w-auto sm:px-3"
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                >
                  <LogOut size={17} />
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                </button>
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
