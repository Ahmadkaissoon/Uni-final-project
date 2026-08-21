import { portalJobRecords } from "./portalJobsData"

export interface PortalCompanyDirectoryItem {
    id: string
    companyName: string
    companyWebsite: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    sector?: string
    numberOfEmployees?: number
    country?: string
    city?: string
    address?: string
    companyPhone?: string
    companyEmail?: string
    hrManagerName?: string
    jobTypes?: string[]
    monthlyJobPostsPlanned?: number
    companyRecommendations?: string
    licenseUrl?: string
    licenseFilename?: string
    matchKeys?: string[]
    to: string
}

export function normalizePortalCompanyValue(value?: string | null) {
    return `${value ?? ""}`
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//i, "")
        .replace(/\/$/, "")
        .replace(/\s+/g, "-")
}

export function buildPortalCompanyJobsPath(companyValue: string) {
    return `/jobs/all?company=${encodeURIComponent(companyValue)}`
}

export function buildPortalCompanyDetailsPath(companyId: string) {
    return `/companies/all?company=${encodeURIComponent(companyId)}`
}

const companiesById = new Map<string, PortalCompanyDirectoryItem>()

for (const job of portalJobRecords) {
    const companyId = normalizePortalCompanyValue(
        job.companyWebsite || job.companyName,
    )

    if (companiesById.has(companyId)) {
        continue
    }

    companiesById.set(companyId, {
        id: companyId,
        companyName: job.companyName,
        companyWebsite: job.companyWebsite,
        logoSrc: job.logoSrc,
        logoAlt: job.logoAlt ?? job.companyName,
        logoLabel: job.logoLabel,
        matchKeys: [companyId],
        to: buildPortalCompanyJobsPath(companyId),
    })
}

export const portalCompanyDirectoryItems = Array.from(companiesById.values())
