import { useMemo } from "react";

import type { CompanyProfileData } from "../utils/portalProfileSchemas";
import { useGetData } from "./useQueries";

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
  licenseUrl?: string | null;
}

interface ApiCompanyProfileResponse {
  email?: string;
  companyProfile?: ApiCompanyProfile | null;
}

export interface PortalCompanyProfileData {
  formData: CompanyProfileData;
  avatarSrc: string | null;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
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
    formData: {
      companyName: formatValue(profile.companyName),
      sector: formatValue(profile.sector),
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
