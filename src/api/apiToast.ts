import axios from "axios";
import { toast } from "sonner";

export interface ApiToastMessages {
  loading: string;
  success: string;
  error: string;
}

function readResponseMessage(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const message = (data as { message?: unknown; error?: unknown }).message;
  const error = (data as { message?: unknown; error?: unknown }).error;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return readResponseMessage(error.response?.data) ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function withApiToast<T>(
  promise: Promise<T>,
  messages: ApiToastMessages,
) {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (error) => getApiErrorMessage(error, messages.error),
  });

  return promise;
}
