import { portalJobRecords } from "./portalJobsData"

export interface PortalCompanyDirectoryItem {
    id: string
    companyName: string
    companyWebsite: string
    logoSrc?: string
    logoAlt?: string
    logoLabel?: string
    to: string
}

export function normalizePortalCompanyValue(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, "-")
}

function buildPortalCompanyPath(companyValue: string) {
    return `/jobs/all?company=${encodeURIComponent(companyValue)}`
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
        to: buildPortalCompanyPath(companyId),
    })
}

export const portalCompanyDirectoryItems = Array.from(companiesById.values())
