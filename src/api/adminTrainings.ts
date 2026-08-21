import companyImage from "../assets/common/company_img.png";
import axiosClient from "./axiosClient";
import type { PortalInternshipRecord } from "../components/portal/portalInternshipsData";

export interface AdminTrainingRecord extends PortalInternshipRecord {
  publishedAt: string;
  applicationsCount: number;
}

interface RawTraining {
  _id: string;
  companyId?: string | null;
  title?: string | null;
  trainerLevel?: string | null;
  fieldOfTraining?: string | null;
  trainingbonus?: string | null;
  trainingLocation?: string | null;
  trainingdays?: string | null;
  trainingDuration?: string | null;
  trainingDescription?: string | null;
  goalsAndResponsibilities?: string | null;
  requirements?: string | null;
  skills?: string | null;
  applicationsCount?: number | null;
  createdAt?: string | null;
}

interface RawCompanySummary {
  _id: string;
  companyProfile?: {
    companyName?: string | null;
    website?: string | null;
  } | null;
}

interface RawTrainingsSummaryResponse {
  trainings: RawTraining[];
}

interface RawCompaniesSummaryResponse {
  companies: RawCompanySummary[];
}

function toText(value: unknown, fallback = "غير محدد") {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function toList(value?: string | null) {
  return (value ?? "")
    .split(/[\n،,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createQuickFacts(training: RawTraining) {
  return [
    {
      id: "level",
      label: "المستوى",
      value: toText(training.trainerLevel),
      iconName: "briefcase" as const,
    },
    {
      id: "duration",
      label: "المدة",
      value: toText(training.trainingDuration),
      iconName: "clock" as const,
    },
    {
      id: "schedule",
      label: "الدوام",
      value: toText(training.trainingdays),
      iconName: "calendar" as const,
    },
    {
      id: "reward",
      label: "المكافأة",
      value: toText(training.trainingbonus),
      iconName: "badge" as const,
    },
  ];
}

function mapTraining(
  training: RawTraining,
  companiesMap: Map<string, RawCompanySummary>,
) {
  const company = training.companyId
    ? companiesMap.get(training.companyId)
    : undefined;
  const companyName =
    company?.companyProfile?.companyName ??
    `شركة ${training.companyId ?? "غير معروفة"}`;
  const companyWebsite = company?.companyProfile?.website ?? "غير متاح";

  return {
    id: training._id,
    companyName,
    trainingType: toText(training.title),
    companyLegalName: companyName,
    companyWebsite,
    location: toText(training.trainingLocation),
    imageSrc: companyImage,
    imageAlt: companyName,
    overview: toText(training.trainingDescription),
    quickFacts: createQuickFacts(training),
    responsibilities: toList(training.goalsAndResponsibilities),
    skills: toList(training.skills),
    requirements: toList(training.requirements),
    relatedInternshipIds: [],
    applicationsCount: training.applicationsCount ?? 0,
    publishedAt: training.createdAt ?? new Date(0).toISOString(),
  } satisfies AdminTrainingRecord;
}

export async function getAdminTrainings(): Promise<AdminTrainingRecord[]> {
  const [trainingsResponse, companiesResponse] = await Promise.all([
    axiosClient.get<RawTrainingsSummaryResponse>("/dashboard/training/summary"),
    axiosClient.get<RawCompaniesSummaryResponse>("/dashboard/company/summary"),
  ]);

  const companiesMap = new Map(
    companiesResponse.data.companies.map((company) => [company._id, company]),
  );

  return trainingsResponse.data.trainings.map((training) =>
    mapTraining(training, companiesMap),
  );
}
