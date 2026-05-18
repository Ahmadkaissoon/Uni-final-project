import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import type {
  CompanyProfileData,
  PersonProfileData,
} from "../utils/portalProfileSchemas";
import { withApiToast } from "./apiToast";
import axiosClient from "./axiosClient";

export const REGISTER_CREDENTIALS_STORAGE_KEY = "register-credentials";

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  role?: "admin" | "company" | "seeker" | string;
}

export interface LoginResponse extends AuthTokens {
  message?: string;
  role?: "admin" | "company" | "seeker" | string;
  user?: AuthUser;
}

export interface SignupResponse extends AuthTokens {
  message?: string;
  user?: unknown;
}

export interface SeekerSignupPayload extends RegisterCredentials {
  role: "seeker";
  seekerProfile: {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    gender: string;
    birthDate: string;
    address: string;
    jobLevel: string;
    yearsOfExperience: number;
    lastCompanyName: string;
    workType: string;
    lastDegree: string;
    specialization: string;
    university: string;
    graduationYear: number;
    languages: Array<{
      language: string;
      level: string;
    }>;
    personalWebsite: string;
    linkedin: string;
    github: string;
    behance: string;
    profileImageUrl: string;
  };
}

export interface CompanySignupPayload extends RegisterCredentials {
  role: "company";
  companyProfile: {
    companyName: string;
    sector: string;
    country: string;
    city: string;
    companyPhone: string;
    companyEmail: string;
    hrManagerName: string;
    numberOfEmployees: number;
    address: string;
    website: string;
    jobTypes: string[];
    monthlyJobPostsPlanned: number;
    companyRecommendations: string;
  };
}

export type SignupPayload = SeekerSignupPayload | CompanySignupPayload;

function toNumber(value: string, fallback = 0) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function splitCommaSeparatedValue(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapLanguages(value: string) {
  const languages = splitCommaSeparatedValue(value).map((item) => {
    const [language = "", level = ""] = item.split(":").map((part) => part.trim());

    return {
      language,
      level: level || "basic",
    };
  });

  return languages.length > 0 ? languages : [{ language: "", level: "" }];
}

function resolveProfileLinks(value: string) {
  const links = splitCommaSeparatedValue(value);

  return {
    linkedin: links.find((link) => link.toLowerCase().includes("linkedin")) ?? "",
    github: links.find((link) => link.toLowerCase().includes("github")) ?? "",
  };
}

export function readRegisterCredentials() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(REGISTER_CREDENTIALS_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<RegisterCredentials>;
    const email = parsedValue.email?.trim();
    const password = parsedValue.password;

    if (!email || !password) {
      return null;
    }

    return { email, password };
  } catch {
    return null;
  }
}

export function writeRegisterCredentials(credentials: RegisterCredentials) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    REGISTER_CREDENTIALS_STORAGE_KEY,
    JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password,
    }),
  );
}

export function clearRegisterCredentials() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(REGISTER_CREDENTIALS_STORAGE_KEY);
}

export function storeAuthTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") {
    return;
  }

  if (tokens.accessToken) {
    window.localStorage.setItem("access_token", tokens.accessToken);
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem("refresh_token", tokens.refreshToken);
  }
}

export function buildSeekerSignupPayload(
  credentials: RegisterCredentials,
  profile: PersonProfileData,
): SeekerSignupPayload {
  const profileLinks = resolveProfileLinks(profile.professionalProfile);

  return {
    ...credentials,
    role: "seeker",
    seekerProfile: {
      fullName: profile.fullName,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      gender: profile.gender,
      birthDate: profile.birthDate,
      address: profile.address,
      jobLevel: profile.jobLevel,
      yearsOfExperience: toNumber(profile.yearsExperience),
      lastCompanyName: profile.lastCompany,
      workType: profile.workType,
      lastDegree: profile.latestDegree,
      specialization: profile.specialization,
      university: profile.university,
      graduationYear: toNumber(profile.graduationYear),
      languages: mapLanguages(profile.languages),
      personalWebsite: profile.portfolioLink,
      linkedin: profileLinks.linkedin,
      github: profileLinks.github,
      behance: "",
      profileImageUrl: "",
    },
  };
}

export function buildCompanySignupPayload(
  credentials: RegisterCredentials,
  profile: CompanyProfileData,
): CompanySignupPayload {
  return {
    ...credentials,
    role: "company",
    companyProfile: {
      companyName: profile.companyName,
      sector: profile.sector,
      country: profile.country,
      city: profile.city,
      companyPhone: profile.companyPhone,
      companyEmail: profile.companyEmail,
      hrManagerName: profile.hiringManagerName,
      numberOfEmployees: toNumber(profile.employeeCount),
      address: profile.address,
      website: profile.website,
      jobTypes: splitCommaSeparatedValue(profile.hiringJobTypes),
      monthlyJobPostsPlanned: toNumber(profile.monthlyOpenings),
      companyRecommendations: profile.companyRecommendations,
    },
  };
}

async function login(payload: LoginPayload) {
  const response = await withApiToast(
    axiosClient.post<LoginResponse>("/auth/login", payload),
    {
      loading: "جاري تسجيل الدخول...",
      success: "تم تسجيل الدخول بنجاح",
      error: "فشل تسجيل الدخول",
    },
  );

  storeAuthTokens(response.data);
  return response.data;
}

async function signup(payload: SignupPayload) {
  const response = await withApiToast(
    axiosClient.post<SignupResponse>("/auth/signup", payload),
    {
      loading: "جاري إنشاء الحساب...",
      success: "تم إنشاء الحساب بنجاح",
      error: "فشل إنشاء الحساب",
    },
  );

  storeAuthTokens(response.data);
  clearRegisterCredentials();
  return response.data;
}

export function resolveAuthRedirect(response: LoginResponse | SignupResponse) {
  const role =
    "role" in response
      ? response.role ?? response.user?.role
      : (response.user as AuthUser | undefined)?.role;

  return role === "company" ? "/company" : "/";
}

export function useLogin(
  options: UseMutationOptions<LoginResponse, Error, LoginPayload> = {},
) {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    ...options,
  });
}

export function useSignup(
  options: UseMutationOptions<SignupResponse, Error, SignupPayload> = {},
) {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: signup,
    ...options,
  });
}
