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
  name: string;
  email: string;
  roleTitle: string;
  password: string;
  confirmPassword: string;
}

export const demoCurrentAdminCredentials = {
  email: "admin@wazefti.local",
  password: "Admin@12345",
};

export const mockAdminManagers: AdminManager[] = [
  {
    id: "admin-current",
    name: "أدمن المنصة",
    email: demoCurrentAdminCredentials.email,
    roleTitle: "مدير رئيسي",
    createdAt: "2026-05-01",
    lastLoginAt: "2026-05-28",
    status: "active",
    isCurrentUser: true,
  },
  {
    id: "admin-002",
    name: "نور الحسن",
    email: "noor.admin@wazefti.local",
    roleTitle: "مشرف محتوى",
    createdAt: "2026-05-10",
    lastLoginAt: "2026-05-27",
    status: "active",
  },
  {
    id: "admin-003",
    name: "ليث خليل",
    email: "laith.admin@wazefti.local",
    roleTitle: "مشرف عمليات",
    createdAt: "2026-05-14",
    lastLoginAt: "2026-05-25",
    status: "disabled",
  },
];

export async function getAdminManagers() {
  return mockAdminManagers;
}
