import {
  type PortalJobRecord,
  portalJobRecords,
} from "../components/portal/portalJobsData";

export interface AdminJobRecord extends PortalJobRecord {
  publishedAt: string;
  applicationsCount: number;
}

const publishedDates = [
  "2026-05-21",
  "2026-05-18",
  "2026-05-14",
  "2026-05-10",
  "2026-05-06",
  "2026-05-02",
  "2026-04-27",
  "2026-04-22",
  "2026-04-18",
  "2026-04-12",
];

export async function getAdminJobs(): Promise<AdminJobRecord[]> {
  return portalJobRecords.map((job, index) => ({
    ...job,
    publishedAt: publishedDates[index % publishedDates.length],
    applicationsCount: 12 + index * 3,
  }));
}
