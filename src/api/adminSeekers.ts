import axiosClient from "./axiosClient";
import type { PersonProfileData } from "../utils/portalProfileSchemas";

export type AdminSeekerStatus = "active" | "blocked";

export interface AdminSeeker {
  id: string;
  email: string;
  joinedAt: string;
  applicationsCount: number;
  savedJobsCount: number;
  status: AdminSeekerStatus;
  profile: PersonProfileData;
}

interface RawLanguage {
  language?: string | null;
  level?: string | null;
}

interface RawSeekerProfile {
  fullName?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  jobLevel?: string | null;
  yearsOfExperience?: number | null;
  lastCompanyName?: string | null;
  workType?: string | null;
  lastDegree?: string | null;
  specialization?: string | null;
  university?: string | null;
  graduationYear?: number | null;
  languages?: RawLanguage[] | null;
  personalWebsite?: string | null;
  linkedin?: string | null;
  github?: string | null;
  behance?: string | null;
}

interface RawDashboardUser {
  _id: string;
  email?: string | null;
  role?: string[] | null;
  seekerProfile?: RawSeekerProfile | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

interface RawDashboardUserSummaryResponse {
  users: RawDashboardUser[];
}

interface RawDashboardUserDetailsResponse {
  user: RawDashboardUser;
  sendedRequests?: number;
  savedJobsCount?: number;
}

function isSeeker(user: RawDashboardUser) {
  return user.role?.includes("seeker");
}

function formatLanguageList(languages?: RawLanguage[] | null) {
  if (!languages?.length) {
    return "";
  }

  return languages
    .map((entry) => [entry.language, entry.level].filter(Boolean).join(": "))
    .filter(Boolean)
    .join("، ");
}

function mapProfile(profile?: RawSeekerProfile | null): PersonProfileData {
  return {
    fullName: profile?.fullName ?? "",
    gender: profile?.gender ?? "",
    birthDate: profile?.birthDate?.split("T")[0] ?? "",
    phone: profile?.phone ?? "",
    country: profile?.country ?? "",
    city: profile?.city ?? "",
    address: profile?.address ?? "",
    jobLevel: profile?.jobLevel ?? "",
    yearsExperience: String(profile?.yearsOfExperience ?? ""),
    lastCompany: profile?.lastCompanyName ?? "",
    workType: profile?.workType ?? "",
    latestDegree: profile?.lastDegree ?? "",
    specialization: profile?.specialization ?? "",
    university: profile?.university ?? "",
    graduationYear:
      profile?.graduationYear !== undefined && profile?.graduationYear !== null
        ? String(profile.graduationYear)
        : "",
    languages: formatLanguageList(profile?.languages),
    topAchievement: "",
    portfolioLink: profile?.personalWebsite ?? "",
    professionalProfile:
      profile?.linkedin ?? profile?.github ?? profile?.behance ?? "",
    projectSummary: "",
  };
}

function mapSeeker(
  user: RawDashboardUser,
  details?: RawDashboardUserDetailsResponse,
): AdminSeeker {
  return {
    id: user._id,
    email: user.email ?? "",
    joinedAt: user.createdAt ?? new Date(0).toISOString(),
    applicationsCount: details?.sendedRequests ?? 0,
    savedJobsCount: details?.savedJobsCount ?? 0,
    status: user.isActive === false ? "blocked" : "active",
    profile: mapProfile(user.seekerProfile),
  };
}

export async function getAdminSeekers() {
  const response = await axiosClient.get<RawDashboardUserSummaryResponse>(
    "/dashboard/user/summary",
  );

  return response.data.users.filter(isSeeker).map((user) => mapSeeker(user));
}

export async function getAdminSeekerById(seekerId: string) {
  const response = await axiosClient.get<RawDashboardUserDetailsResponse>(
    `/dashboard/user/${seekerId}`,
  );

  return mapSeeker(response.data.user, response.data);
}

export async function updateAdminSeekerStatus(
  seekerId: string,
  active: boolean,
) {
  await axiosClient.post(`/dashboard/user/ban/${seekerId}`, { active });
}
