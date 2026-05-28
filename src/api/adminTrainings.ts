import {
  type PortalInternshipRecord,
  portalInternshipRecords,
} from "../components/portal/portalInternshipsData";

export interface AdminTrainingRecord extends PortalInternshipRecord {
  publishedAt: string;
  applicationsCount: number;
}

const publishedDates = [
  "2026-05-24",
  "2026-05-20",
  "2026-05-16",
  "2026-05-11",
  "2026-05-07",
];

export async function getAdminTrainings(): Promise<AdminTrainingRecord[]> {
  return portalInternshipRecords.map((training, index) => ({
    ...training,
    publishedAt: publishedDates[index % publishedDates.length],
    applicationsCount: 9 + index * 4,
  }));
}
