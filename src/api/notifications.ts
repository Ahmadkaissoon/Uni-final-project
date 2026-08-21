import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosClient from "./axiosClient";
import { useGetData } from "./useQueries";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: {
    code: string;
    label: string;
  };
  status: {
    isRead: boolean;
    label: string;
  };
  related: {
    id: string | null;
    model: string | null;
  };
  date: string;
  createdAt: string;
}

interface NotificationsResponse {
  data: AppNotification[];
  total: number;
}

interface NotificationActionResponse {
  message?: string;
  data?: AppNotification;
}

const notificationsQueryKey = ["notifications"];

async function markNotificationAsReadRequest(notificationId: string) {
  const response = await axiosClient.put<NotificationActionResponse>(
    `/notifications/${notificationId}`,
  );

  return response.data;
}

async function deleteNotificationRequest(notificationId: string) {
  const response = await axiosClient.delete<NotificationActionResponse>(
    `/notifications/${notificationId}`,
  );

  return response.data;
}

function updateNotificationInCache(
  currentData: NotificationsResponse | undefined,
  notificationId: string,
) {
  if (!currentData) {
    return currentData;
  }

  return {
    ...currentData,
    data: currentData.data.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            status: {
              ...notification.status,
              isRead: true,
              label: "مقروء",
            },
          }
        : notification,
    ),
  };
}

export function useNotificationsCenter(enabled = true) {
  const queryClient = useQueryClient();
  const notificationsQuery = useGetData<NotificationsResponse>(
    "/notifications",
    {},
    {
      enabled,
      queryKey: notificationsQueryKey,
    },
  );

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsReadRequest,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationsResponse | undefined>(
        notificationsQueryKey,
        (currentData) => updateNotificationInCache(currentData, notificationId),
      );
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotificationRequest,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationsResponse | undefined>(
        notificationsQueryKey,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            total: Math.max(0, currentData.total - 1),
            data: currentData.data.filter(
              (notification) => notification.id !== notificationId,
            ),
          };
        },
      );
    },
  });

  const notifications = notificationsQuery.data?.data ?? [];
  const unreadNotifications = notifications.filter(
    (notification) => !notification.status.isRead,
  );

  return {
    ...notificationsQuery,
    notifications,
    unreadCount: unreadNotifications.length,
    markAsRead: markAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
    markAllAsRead: async () => {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markAsReadMutation.mutateAsync(notification.id),
        ),
      );
    },
    isUpdating:
      markAsReadMutation.isPending || deleteNotificationMutation.isPending,
  };
}
