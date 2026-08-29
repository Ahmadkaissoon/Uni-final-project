import { useMemo } from "react";

import type { CompanyProfileData } from "../utils/portalProfileSchemas";
import { queryClient } from "./queryClient";
import { useGetData, useUpdateData } from "./useQueries";

interface ApiCompanyProfile {
  companyName?: string;
  sector?: string;
  numberOfEmployees?: number | null;
  country?: string;
  city?: string;
  address?: string;
  companyPhone?: string;
  website?: string | null;
  hrManagerName?: string;
  companyEmail?: string;
  jobTypes?: string[];
  monthlyJobPostsPlanned?: number | null;
  companyRecommendations?: string | null;
  logoUrl?: string | null;
  licenseFilename?: string | null;
  licenseUrl?: string | null;
}

interface ApiCompanyProfileResponse {
  email?: string;
  companyProfile?: ApiCompanyProfile | null;
}

export interface PortalCompanyProfileData {
  formData: CompanyProfileData;
  avatarSrc: string | null;
  licenseFilename: string;
  licenseUrl: string | null;
}

export interface PortalCompanyProfileSubmitPayload {
  formData: CompanyProfileData;
  logo: File | null;
  licenseImage?: File | null;
  removeLogo?: boolean;
  removeLicense?: boolean;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function toOptionalNumber(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function splitCommaSeparatedValue(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCompanySector(value: unknown) {
  const normalizedValue = formatValue(value).toLowerCase();
  const sectorAliases: Record<string, string> = {
    technology: "technology",
    tech: "technology",
    marketing: "marketing",
    design: "design",
    education: "education",
    other: "other",
  };

  return sectorAliases[normalizedValue] ?? formatValue(value);
}

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

function resolveCompanyProfile(
  response: ApiCompanyProfileResponse | ApiCompanyProfile,
): ApiCompanyProfile {
  const wrappedResponse = response as ApiCompanyProfileResponse;

  if ("companyProfile" in response || "email" in response) {
    return wrappedResponse.companyProfile ?? {};
  }

  return response as ApiCompanyProfile;
}

export function mapApiCompanyProfileToPortalCompanyProfileData(
  response: ApiCompanyProfileResponse | ApiCompanyProfile,
): PortalCompanyProfileData {
  const profile = resolveCompanyProfile(response);

  return {
    avatarSrc: getApiAssetUrl(profile.logoUrl),
    licenseFilename: formatValue(profile.licenseFilename),
    licenseUrl: getApiAssetUrl(profile.licenseUrl),
    formData: {
      companyName: formatValue(profile.companyName),
      sector: normalizeCompanySector(profile.sector),
      employeeCount: formatValue(profile.numberOfEmployees),
      country: formatValue(profile.country),
      city: formatValue(profile.city),
      address: formatValue(profile.address),
      companyPhone: formatValue(profile.companyPhone),
      website: formatValue(profile.website),
      hiringManagerName: formatValue(profile.hrManagerName),
      companyEmail: formatValue(profile.companyEmail),
      hiringJobTypes: Array.isArray(profile.jobTypes)
        ? profile.jobTypes.filter(Boolean).join(", ")
        : "",
      monthlyOpenings: formatValue(profile.monthlyJobPostsPlanned),
      companyRecommendations: formatValue(profile.companyRecommendations),
    },
  };
}

export function buildPortalCompanyProfilePayload({
  formData,
  logo,
  licenseImage = null,
  removeLogo = false,
  removeLicense = false,
}: PortalCompanyProfileSubmitPayload) {
  const payload = {
    companyProfile: {
      companyName: formData.companyName.trim(),
      sector: formData.sector.trim(),
      numberOfEmployees: toOptionalNumber(formData.employeeCount),
      country: formData.country.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      companyPhone: formData.companyPhone.trim(),
      website: formData.website.trim() || null,
      hrManagerName: formData.hiringManagerName.trim(),
      companyEmail: formData.companyEmail.trim(),
      jobTypes: splitCommaSeparatedValue(formData.hiringJobTypes),
      monthlyJobPostsPlanned: toOptionalNumber(formData.monthlyOpenings),
      companyRecommendations: formData.companyRecommendations.trim() || null,
    },
    ...(removeLogo ? { removeLogo: true } : {}),
    ...(removeLicense ? { removeLicense: true } : {}),
  };

  const requestBody = new FormData();
  requestBody.append("data", JSON.stringify(payload));

  if (logo) {
    requestBody.append("logo", logo);
  }

  if (licenseImage) {
    requestBody.append("licenseImage", licenseImage);
  }

  return requestBody;
}

export function usePortalCompanyProfile() {
  const query = useGetData<ApiCompanyProfileResponse>("/auth/profile", {}, {
    queryKey: ["portal-company-profile"],
  });
  const profileData = useMemo(
    () =>
      query.data
        ? mapApiCompanyProfileToPortalCompanyProfileData(query.data)
        : null,
    [query.data],
  );

  return {
    ...query,
    profileData,
  };
}

export function useUpdatePortalCompanyProfile() {
  return useUpdateData<ApiCompanyProfileResponse, FormData>(
    "/users/profile/company",
    {},
    true,
    "put",
    {
      toastMessages: {
        loading: "جاري حفظ بيانات الشركة...",
        success: "تم تحديث بيانات الشركة بنجاح",
        error: "فشل تحديث بيانات الشركة",
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["portal-company-profile"],
        });
        void queryClient.invalidateQueries({
          queryKey: ["portal-auth-profile", "company"],
        });
      },
    },
  );
}
