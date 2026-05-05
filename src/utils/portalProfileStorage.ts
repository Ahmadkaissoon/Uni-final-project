import type { PortalRole } from "../components/layout/PortalLayout";
import type {
  PortalProfileEditorConfig,
  PortalProfileFormValues,
} from "./portalProfileSchemas";
import {
  companyProfileEditorConfig,
  personProfileEditorConfig,
} from "./portalProfileSchemas";

const portalProfileUpdatedEventName = "portal-profile-updated";

interface PortalProfileUpdatedDetail {
  role: PortalRole;
}

type PortalProfileSummary = {
  name: string;
  tagline: string;
  avatarSrc?: string;
  avatarLabel?: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getInitials(name: string) {
  const cleanedName = name.trim();

  if (!cleanedName) {
    return "و";
  }

  const initials = cleanedName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return initials || cleanedName.charAt(0) || "و";
}

function sanitizeStoredProfile<T extends PortalProfileFormValues>(
  value: unknown,
  defaults: T,
): T {
  const nextValue = { ...defaults } as T;

  if (!value || typeof value !== "object") {
    return nextValue;
  }

  for (const key of Object.keys(defaults) as Array<Extract<keyof T, string>>) {
    const candidateValue = (value as Record<string, unknown>)[key as string];

    if (typeof candidateValue === "string") {
      (nextValue as Record<string, string>)[key] = candidateValue;
    }
  }

  return nextValue;
}

function buildStoredProfileSummary<T extends PortalProfileFormValues>(
  config: Pick<
    PortalProfileEditorConfig<T>,
    | "avatarStorageKey"
    | "defaultValues"
    | "displayNameField"
    | "fallbackDisplayName"
    | "storageKey"
    | "summaryTagline"
  >,
): PortalProfileSummary {
  const formData = readStoredProfile(config.storageKey, config.defaultValues);
  const storedName = String(
    (formData as Record<string, unknown>)[config.displayNameField] ?? "",
  ).trim();
  const resolvedName = storedName || config.fallbackDisplayName;
  const avatarSrc = readStoredAvatar(config.avatarStorageKey) ?? undefined;

  return {
    name: resolvedName,
    tagline: config.summaryTagline,
    avatarSrc,
    avatarLabel: getInitials(resolvedName),
  };
}

export function readStoredProfile<T extends PortalProfileFormValues>(
  storageKey: string,
  defaultValues: T,
): T {
  if (!isBrowser()) {
    return { ...defaultValues };
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return { ...defaultValues };
    }

    return sanitizeStoredProfile<T>(JSON.parse(rawValue), defaultValues);
  } catch {
    return { ...defaultValues };
  }
}

export function writeStoredProfile<T extends PortalProfileFormValues>(
  storageKey: string,
  value: T,
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function readStoredAvatar(storageKey: string) {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  return rawValue?.trim() ? rawValue : null;
}

export function writeStoredAvatar(
  storageKey: string,
  value: string | null | undefined,
) {
  if (!isBrowser()) {
    return;
  }

  if (!value?.trim()) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, value);
}

export function notifyPortalProfileUpdate(role: PortalRole) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<PortalProfileUpdatedDetail>(portalProfileUpdatedEventName, {
      detail: { role },
    }),
  );
}

export function getStoredPortalProfileSummary(role: PortalRole) {
  return role === "company"
    ? buildStoredProfileSummary(companyProfileEditorConfig)
    : buildStoredProfileSummary(personProfileEditorConfig);
}

export function subscribeToPortalProfileUpdates(
  callback: (role: PortalRole) => void,
) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const customEventListener = (event: Event) => {
    const detail = (event as CustomEvent<PortalProfileUpdatedDetail>).detail;

    if (detail?.role) {
      callback(detail.role);
    }
  };

  const storageEventListener = (event: StorageEvent) => {
    if (!event.key) {
      callback("company");
      callback("user");
      return;
    }

    if (
      event.key === companyProfileEditorConfig.storageKey ||
      event.key === companyProfileEditorConfig.avatarStorageKey
    ) {
      callback("company");
    }

    if (
      event.key === personProfileEditorConfig.storageKey ||
      event.key === personProfileEditorConfig.avatarStorageKey
    ) {
      callback("user");
    }
  };

  window.addEventListener(
    portalProfileUpdatedEventName,
    customEventListener as EventListener,
  );
  window.addEventListener("storage", storageEventListener);

  return () => {
    window.removeEventListener(
      portalProfileUpdatedEventName,
      customEventListener as EventListener,
    );
    window.removeEventListener("storage", storageEventListener);
  };
}
