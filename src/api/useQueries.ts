import {
  useMutation,
  type QueryKey,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";

import { withApiToast, type ApiToastMessages } from "./apiToast";
import axiosClient from "./axiosClient";

type ApiHeaders = AxiosRequestConfig["headers"];

type UseGetDataOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, QueryKey>,
  "queryFn" | "queryKey"
> & {
  queryKey?: QueryKey;
};

type UsePostDataOptions<TData, TVariables> = UseMutationOptions<
  TData,
  Error,
  TVariables
> & {
  toastMessages?: ApiToastMessages;
};

type UseUpdateDataOptions<TData, TVariables> = UseMutationOptions<
  TData,
  Error,
  TVariables
> & {
  toastMessages?: ApiToastMessages;
};

type UseDeleteDataOptions<TData> = UseMutationOptions<TData, Error, string> & {
  toastMessages?: ApiToastMessages;
};

const defaultPostToastMessages: ApiToastMessages = {
  loading: "جاري الإضافة...",
  success: "تمت الإضافة بنجاح",
  error: "فشلت الإضافة",
};

const defaultUpdateToastMessages: ApiToastMessages = {
  loading: "جاري حفظ التعديلات...",
  success: "تم حفظ التعديلات بنجاح",
  error: "فشل حفظ التعديلات",
};

const defaultDeleteToastMessages: ApiToastMessages = {
  loading: "جاري الحذف...",
  success: "تم الحذف بنجاح",
  error: "فشل الحذف",
};

async function getData<TData>(link: string, headers: ApiHeaders = {}) {
  const response = await axiosClient.get<TData>(link, { headers });
  return response.data;
}

async function postData<TData, TVariables>(
  link: string,
  data: TVariables,
  headers: ApiHeaders = {},
) {
  const response = await axiosClient.post<TData>(link, data, { headers });
  return response.data;
}

async function updateData<TData, TVariables>(
  link: string,
  data: TVariables,
  headers: ApiHeaders = {},
  isFormData = false,
  method: "put" | "patch" = "put",
) {
  const response = await axiosClient[method]<TData>(link, data, {
    headers: {
      ...headers,
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
    },
  });

  return response.data;
}

async function deleteData<TData>(link: string, headers: ApiHeaders = {}) {
  const response = await axiosClient.delete<TData>(link, { headers });
  return response.data;
}

export function useGetData<TData = unknown>(
  link: string | null,
  headers: ApiHeaders = {},
  options: UseGetDataOptions<TData> = {},
) {
  const { enabled = true, queryKey, ...queryOptions } = options;

  return useQuery<TData, Error, TData, QueryKey>({
    queryKey: queryKey ?? ["data", link, headers],
    queryFn: () => getData<TData>(link as string, headers),
    enabled: enabled && Boolean(link),
    ...queryOptions,
  });
}

export function usePostData<TData = unknown, TVariables = unknown>(
  link: string,
  headers: ApiHeaders = {},
  options: UsePostDataOptions<TData, TVariables> = {},
) {
  const {
    toastMessages = defaultPostToastMessages,
    ...mutationOptions
  } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: (data) => {
      const request = postData<TData, TVariables>(link, data, headers);
      return toastMessages ? withApiToast(request, toastMessages) : request;
    },
    ...mutationOptions,
  });
}

export function useUpdateData<TData = unknown, TVariables = unknown>(
  link: string,
  headers: ApiHeaders = {},
  isFormData = false,
  method: "put" | "patch" = "put",
  options: UseUpdateDataOptions<TData, TVariables> = {},
) {
  const {
    toastMessages = defaultUpdateToastMessages,
    ...mutationOptions
  } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: (data) => {
      const request = updateData<TData, TVariables>(
        link,
        data,
        headers,
        isFormData,
        method,
      );
      return toastMessages ? withApiToast(request, toastMessages) : request;
    },
    ...mutationOptions,
  });
}

export function useDeleteData<TData = unknown>(
  headers: ApiHeaders = {},
  options: UseDeleteDataOptions<TData> = {},
) {
  const {
    toastMessages = defaultDeleteToastMessages,
    ...mutationOptions
  } = options;

  return useMutation<TData, Error, string>({
    mutationFn: (link) => {
      const request = deleteData<TData>(link, headers);
      return toastMessages ? withApiToast(request, toastMessages) : request;
    },
    ...mutationOptions,
  });
}
