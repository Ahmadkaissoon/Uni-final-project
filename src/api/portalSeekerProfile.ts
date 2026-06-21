import { useMemo } from "react";

import { queryClient } from "./queryClient";
import { useGetData, useUpdateData } from "./useQueries";

export interface PortalSeekerLanguage {
  language: string;
  level: string;
}

export interface PortalSeekerProfileFormData {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  jobLevel: string;
  yearsOfExperience: string;
  lastCompanyName: string;
  workType: string;
  lastDegree: string;
  specialization: string;
  university: string;
  graduationYear: string;
  personalWebsite: string;
  linkedin: string;
  github: string;
  behance: string;
  languages: PortalSeekerLanguage[];
}

interface ApiSeekerLanguage {
  language?: string;
  level?: string;
}

interface ApiSeekerProfile {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  jobLevel?: string;
  yearsOfExperience?: number;
  lastCompanyName?: string;
  workType?: string;
  lastDegree?: string;
  specialization?: string;
  university?: string;
  graduationYear?: number;
  languages?: ApiSeekerLanguage[];
  personalWebsite?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
  profilePictureUrl?: string | null;
}

interface ApiAuthProfileResponse {
  _id?: string;
  email?: string;
  role?: string[] | string;
  seekerProfile?: ApiSeekerProfile | null;
  companyProfile?: null;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortalSeekerProfileData {
  email: string;
  isActive: boolean;
  isVerified: boolean;
  avatarSrc: string | null;
  formData: PortalSeekerProfileFormData;
}

export interface PortalSeekerProfileSubmitPayload {
  formData: PortalSeekerProfileFormData;
  profilePicture: File | null;
  removeProfilePicture: boolean;
}

export const emptyPortalSeekerProfileFormData: PortalSeekerProfileFormData = {
  fullName: "",
  gender: "",
  birthDate: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  jobLevel: "",
  yearsOfExperience: "",
  lastCompanyName: "",
  workType: "",
  lastDegree: "",
  specialization: "",
  university: "",
  graduationYear: "",
  personalWebsite: "",
  linkedin: "",
  github: "",
  behance: "",
  languages: [{ language: "", level: "basic" }],
};

function getApiAssetUrl(path?: string | null) {
  if (!path?.trim()) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz";

  return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function formatDateForInput(value?: string) {
  const resolvedValue = formatValue(value);
  return resolvedValue ? resolvedValue.slice(0, 10) : "";
}

function toIsoDateString(value: string) {
  const resolvedValue = value.trim();

  if (!resolvedValue) {
    return undefined;
  }

  const [year, month, day] = resolvedValue.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function toOptionalNumber(value: string) {
  const resolvedValue = value.trim();

  if (!resolvedValue) {
    return undefined;
  }

  const parsedValue = Number(resolvedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function normalizeLanguages(languages?: ApiSeekerLanguage[]) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return [{ language: "", level: "basic" }];
  }

  const normalizedLanguages = languages
    .map((language) => ({
      language: formatValue(language.language),
      level: formatValue(language.level) || "basic",
    }))
    .filter((language) => language.language);

  return normalizedLanguages.length > 0
    ? normalizedLanguages
    : [{ language: "", level: "basic" }];
}

export function clonePortalSeekerProfileFormData(
  formData: PortalSeekerProfileFormData,
): PortalSeekerProfileFormData {
  return {
    ...formData,
    languages: formData.languages.map((language) => ({ ...language })),
  };
}

export function mapApiSeekerProfileToPortalSeekerProfileData(
  response: ApiAuthProfileResponse,
): PortalSeekerProfileData {
  const seekerProfile = response.seekerProfile ?? {};

  return {
    email: formatValue(response.email),
    isActive: Boolean(response.isActive),
    isVerified: Boolean(response.isVerified),
    avatarSrc: getApiAssetUrl(seekerProfile.profilePictureUrl),
    formData: {
      fullName: formatValue(seekerProfile.fullName),
      gender: formatValue(seekerProfile.gender),
      birthDate: formatDateForInput(seekerProfile.birthDate),
      phone: formatValue(seekerProfile.phone),
      country: formatValue(seekerProfile.country),
      city: formatValue(seekerProfile.city),
      address: formatValue(seekerProfile.address),
      jobLevel: formatValue(seekerProfile.jobLevel),
      yearsOfExperience: formatValue(seekerProfile.yearsOfExperience),
      lastCompanyName: formatValue(seekerProfile.lastCompanyName),
      workType: formatValue(seekerProfile.workType),
      lastDegree: formatValue(seekerProfile.lastDegree),
      specialization: formatValue(seekerProfile.specialization),
      university: formatValue(seekerProfile.university),
      graduationYear: formatValue(seekerProfile.graduationYear),
      personalWebsite: formatValue(seekerProfile.personalWebsite),
      linkedin: formatValue(seekerProfile.linkedin),
      github: formatValue(seekerProfile.github),
      behance: formatValue(seekerProfile.behance),
      languages: normalizeLanguages(seekerProfile.languages),
    },
  };
}

export function buildPortalSeekerProfilePayload({
  formData,
  profilePicture,
  removeProfilePicture,
}: PortalSeekerProfileSubmitPayload) {
  const payload = {
    fullName: formData.fullName.trim(),
    gender: formData.gender.trim(),
    birthDate: toIsoDateString(formData.birthDate),
    phone: formData.phone.trim(),
    country: formData.country.trim(),
    city: formData.city.trim(),
    address: formData.address.trim(),
    jobLevel: formData.jobLevel.trim(),
    yearsOfExperience: toOptionalNumber(formData.yearsOfExperience),
    lastCompanyName: formData.lastCompanyName.trim(),
    workType: formData.workType.trim(),
    lastDegree: formData.lastDegree.trim(),
    specialization: formData.specialization.trim(),
    university: formData.university.trim(),
    graduationYear: toOptionalNumber(formData.graduationYear),
    languages: formData.languages
      .map((language) => ({
        language: language.language.trim(),
        level: language.level.trim() || "basic",
      }))
      .filter((language) => language.language),
    personalWebsite: formData.personalWebsite.trim(),
    linkedin: formData.linkedin.trim(),
    github: formData.github.trim(),
    behance: formData.behance.trim(),
    ...(removeProfilePicture ? { removeProfilePicture: true } : {}),
  };

  const requestBody = new FormData();
  requestBody.append("data", JSON.stringify(payload));

  if (profilePicture) {
    requestBody.append("profilePicture", profilePicture);
  }

  return requestBody;
}

export function usePortalSeekerProfile() {
  const query = useGetData<ApiAuthProfileResponse>("/auth/profile", {}, {
    queryKey: ["portal-user-profile"],
  });
  const profileData = useMemo(
    () =>
      query.data ? mapApiSeekerProfileToPortalSeekerProfileData(query.data) : null,
    [query.data],
  );

  return {
    ...query,
    profileData,
  };
}

export function useUpdatePortalSeekerProfile() {
  return useUpdateData<ApiAuthProfileResponse, FormData>(
    "/users/profile/seeker",
    {},
    true,
    "put",
    {
      toastMessages: {
        loading: "جاري حفظ الملف الشخصي...",
        success: "تم تحديث الملف الشخصي بنجاح",
        error: "فشل تحديث الملف الشخصي",
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["portal-user-profile"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["portal-auth-profile", "user"],
        });
      },
    },
  );
}
