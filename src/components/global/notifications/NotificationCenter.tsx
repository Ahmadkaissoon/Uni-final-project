import { Bell, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";

import { cn } from "../../../utils/cn";
import type { AppNotification } from "../../../api/notifications";

interface NotificationCenterProps {
  notifications: AppNotification[];
  unreadCount: number;
  open: boolean;
  loading?: boolean;
  error?: string | null;
  busy?: boolean;
  onToggle: () => void;
  onMarkAllAsRead: () => void | Promise<void>;
  onNotificationClick: (notification: AppNotification) => void | Promise<void>;
  onDeleteNotification: (
    notification: AppNotification,
  ) => void | Promise<void>;
  buttonClassName?: string;
  panelClassName?: string;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("ar", {
  numeric: "auto",
});

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffInMilliseconds = date.getTime() - Date.now();
  const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60));

  if (Math.abs(diffInMinutes) < 60) {
    return relativeTimeFormatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);

  if (Math.abs(diffInHours) < 24) {
    return relativeTimeFormatter.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInHours / 24);
  return relativeTimeFormatter.format(diffInDays, "day");
}

function getNotificationAccentColor(typeCode: string, isRead: boolean) {
  if (isRead) {
    return "bg-slate-100 text-slate-500";
  }

  if (typeCode === "new_job") {
    return "bg-blue-50 text-blue-700";
  }

  if (typeCode === "new_training") {
    return "bg-violet-50 text-violet-700";
  }

  if (typeCode === "application_status") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function NotificationCenter({
  notifications,
  unreadCount,
  open,
  loading = false,
  error = null,
  busy = false,
  onToggle,
  onMarkAllAsRead,
  onNotificationClick,
  onDeleteNotification,
  buttonClassName,
  panelClassName,
}: NotificationCenterProps) {
  return (
    <>
      <button
        type="button"
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100",
          open && "bg-slate-100 text-primary",
          buttonClassName,
        )}
        aria-label="الإشعارات"
        aria-expanded={open}
        onClick={onToggle}
      >
        <Bell size={19} />
        <span className="absolute -top-1 -left-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-5 text-white">
          {unreadCount}
        </span>
      </button>

      {open ? (
        <div
          className={cn(
            "absolute left-5 top-full z-50 mt-3 w-[min(380px,calc(100vw-40px))] overflow-hidden rounded-lg border border-slate-200 bg-white text-right shadow-[0_24px_70px_rgb(15_23_42_/_0.16)] lg:left-8",
            panelClassName,
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="m-0 text-size15 font-bold text-[#17385e]">
                الإشعارات
              </h2>
              <p className="m-0 mt-1 text-size12 text-slate-500">
                آخر التنبيهات المرتبطة بحسابك
              </p>
            </div>
            <span className="rounded-lg bg-[#edf5ff] px-2.5 py-1 text-size12 font-bold text-primary">
              {unreadCount} جديد
            </span>
          </div>

          <div className="border-b border-slate-100 px-4 py-2">
            <button
              type="button"
              onClick={() => void onMarkAllAsRead()}
              className="w-full rounded-lg px-3 py-2 text-size12 font-bold text-primary hover:bg-[#edf5ff] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
              disabled={unreadCount === 0 || busy}
            >
              تعليم الكل كمقروء
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-size13 text-slate-500">
                جارٍ تحميل الإشعارات...
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-size13 text-red-600">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="grid place-items-center gap-2 px-4 py-8 text-center text-slate-500">
                <ShieldAlert size={28} className="text-slate-400" />
                <p className="m-0 text-size13">لا توجد إشعارات حاليًا</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0",
                    notification.status.isRead && "bg-slate-50/70 opacity-80",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => void onNotificationClick(notification)}
                    className="flex min-w-0 flex-1 gap-3 text-start hover:bg-slate-50"
                  >
                    <span
                      className={cn(
                        "mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
                        getNotificationAccentColor(
                          notification.type.code,
                          notification.status.isRead,
                        ),
                      )}
                    >
                      <CheckCircle2 size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="m-0 text-size13 font-bold text-slate-800">
                          {notification.title}
                        </h3>
                        <span className="shrink-0 text-size11 text-slate-400">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="m-0 mt-1 text-size12 leading-6 text-slate-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-size11">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-bold text-slate-600">
                          {notification.type.label}
                        </span>
                        {!notification.status.isRead ? (
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                            جديد
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => void onDeleteNotification(notification)}
                    className="inline-flex size-8 shrink-0 items-center justify-center self-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-700"
                    aria-label="حذف الإشعار"
                    title="حذف الإشعار"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
