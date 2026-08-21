import axiosClient from "./axiosClient";
import type { CompanyProfileData } from "../utils/portalProfileSchemas";

export type AdminCompanyStatus = "active" | "blocked";

export interface AdminCompany {
  id: string;
  accountEmail: string;
  joinedAt: string;
  publishedJobsCount: number;
  publishedTrainingsCount: number;
  applicationsCount: number;
  status: AdminCompanyStatus;
  profile: CompanyProfileData;
}

interface RawCompanyProfile {
  companyName?: string | null;
  sector?: string | null;
  numberOfEmployees?: number | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  companyPhone?: string | null;
  website?: string | null;
  hrManagerName?: string | null;
  companyEmail?: string | null;
  jobTypes?: string[] | null;
  monthlyJobPostsPlanned?: number | null;
  companyRecommendations?: string | null;
}

interface RawDashboardCompany {
  _id: string;
  email?: string | null;
  companyProfile?: RawCompanyProfile | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

interface RawDashboardCompanySummaryResponse {
  companies: RawDashboardCompany[];
}

interface RawDashboardCompanyDetailsResponse {
  company: RawDashboardCompany;
  postedJobsCount?: number;
  postedTrainingsCount?: number;
  hireRequestsCount?: number;
}

function mapProfile(profile?: RawCompanyProfile | null): CompanyProfileData {
  return {
    companyName: profile?.companyName ?? "",
    sector: profile?.sector?.toLowerCase() ?? "",
    employeeCount:
      profile?.numberOfEmployees !== undefined &&
      profile?.numberOfEmployees !== null
        ? String(profile.numberOfEmployees)
        : "",
    country: profile?.country ?? "",
    city: profile?.city ?? "",
    address: profile?.address ?? "",
    companyPhone: profile?.companyPhone ?? "",
    website: profile?.website ?? "",
    hiringManagerName: profile?.hrManagerName ?? "",
    companyEmail: profile?.companyEmail ?? "",
    hiringJobTypes: profile?.jobTypes?.join("، ") ?? "",
    monthlyOpenings:
      profile?.monthlyJobPostsPlanned !== undefined &&
      profile?.monthlyJobPostsPlanned !== null
        ? String(profile.monthlyJobPostsPlanned)
        : "",
    companyRecommendations: profile?.companyRecommendations ?? "",
  };
}

function mapCompany(
  company: RawDashboardCompany,
  details?: RawDashboardCompanyDetailsResponse,
): AdminCompany {
  return {
    id: company._id,
    accountEmail: company.email ?? "",
    joinedAt: company.createdAt ?? new Date(0).toISOString(),
    publishedJobsCount: details?.postedJobsCount ?? 0,
    publishedTrainingsCount: details?.postedTrainingsCount ?? 0,
    applicationsCount: details?.hireRequestsCount ?? 0,
    status: company.isActive === false ? "blocked" : "active",
    profile: mapProfile(company.companyProfile),
  };
}

export async function getAdminCompanies() {
  const response = await axiosClient.get<RawDashboardCompanySummaryResponse>(
    "/dashboard/company/summary",
  );

  return response.data.companies.map((company) => mapCompany(company));
}

export async function getAdminCompanyById(companyId: string) {
  const response = await axiosClient.get<RawDashboardCompanyDetailsResponse>(
    `/dashboard/company/${companyId}`,
  );

  return mapCompany(response.data.company, response.data);
}

export async function updateAdminCompanyStatus(
  companyId: string,
  active: boolean,
) {
  await axiosClient.post(`/dashboard/company/ban/${companyId}`, { active });
}
