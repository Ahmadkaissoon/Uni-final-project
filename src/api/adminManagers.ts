import axiosClient from "./axiosClient";

export type AdminManagerStatus = "active" | "disabled";

export interface AdminManager {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  createdAt: string;
  lastLoginAt: string;
  status: AdminManagerStatus;
  isCurrentUser?: boolean;
}

export interface AdminManagerFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export const demoCurrentAdminCredentials = {
  email: "admin@example.com",
  password: "Admin@12345",
};

interface RawAdminUser {
  _id: string;
  email?: string | null;
  role?: string[] | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

interface RawAdminSummaryResponse {
  users: RawAdminUser[];
}

interface RawAuthProfileResponse {
  id?: string;
  _id?: string;
  email?: string | null;
}

function toDisplayName(email?: string | null) {
  if (!email) {
    return "مشرف المنصة";
  }

  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return localPart || email;
}

function mapAdmin(user: RawAdminUser, currentAdminId?: string) {
  return {
    id: user._id,
    name: toDisplayName(user.email),
    email: user.email ?? "",
    roleTitle: "مشرف المنصة",
    createdAt: user.createdAt ?? new Date(0).toISOString(),
    lastLoginAt: "غير متاح من الـ API",
    status: user.isActive === false ? "disabled" : "active",
    isCurrentUser: currentAdminId === user._id,
  } satisfies AdminManager;
}

export async function getAdminManagers() {
  const [usersResponse, profileResponse] = await Promise.all([
    axiosClient.get<RawAdminSummaryResponse>("/dashboard/user/summary"),
    axiosClient.get<RawAuthProfileResponse>("/auth/profile"),
  ]);

  const currentAdminId = profileResponse.data.id ?? profileResponse.data._id;

  return usersResponse.data.users
    .filter((user) => user.role?.includes("admin"))
    .map((user) => mapAdmin(user, currentAdminId));
}

export async function createAdminManager(values: AdminManagerFormValues) {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      email: values.email.trim(),
      password: values.password,
      role: "admin",
    }),
  );

  await axiosClient.post("/auth/signup", formData);
}

export async function updateAdminManagerStatus(
  managerId: string,
  active: boolean,
) {
  await axiosClient.post(`/dashboard/user/ban/${managerId}`, { active });
}
