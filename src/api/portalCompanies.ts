import type { PortalCompanyDirectoryItem } from "../components/portal/portalCompaniesData"
import {
    buildPortalCompanyDetailsPath,
    normalizePortalCompanyValue,
} from "../components/portal/portalCompaniesData"
import { useGetData } from "./useQueries"

interface ApiCompanyProfile {
    companyName?: string
    sector?: string
    numberOfEmployees?: number
    country?: string
    city?: string
    address?: string
    companyPhone?: string
    website?: string
    logoUrl?: string | null
    hrManagerName?: string
    companyEmail?: string
    jobTypes?: string[]
    monthlyJobPostsPlanned?: number
    companyRecommendations?: string
    licenseUrl?: string | null
}

interface ApiCompanyRecord {
    id: string
    companyProfile?: ApiCompanyProfile | null
}

interface ApiCompaniesListResponse {
    data?: ApiCompanyRecord[]
    total?: number
}

function getApiAssetUrl(path?: string | null) {
    if (!path?.trim()) {
        return undefined
    }

    if (/^https?:\/\//i.test(path)) {
        return path
    }

    const apiUrl =
        import.meta.env.VITE_API_URL ?? "https://job-entry.obaidana.xyz"
    return `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function formatValue(value: unknown, fallback = "") {
    if (value === null || value === undefined) {
        return fallback
    }

    const text = String(value).trim()
    return text || fallback
}

function createCompanyMatchKeys(
    companyId: string,
    companyName?: string,
    companyWebsite?: string,
) {
    return Array.from(
        new Set(
            [companyWebsite, companyName, companyId]
                .map((value) => normalizePortalCompanyValue(value))
                .filter(Boolean),
        ),
    )
}

export function getPortalCompanyMatchKeys(company: PortalCompanyDirectoryItem) {
    return Array.from(
        new Set(
            [
                ...(company.matchKeys ?? []),
                company.companyWebsite,
                company.companyName,
                company.id,
            ]
                .map((value) => normalizePortalCompanyValue(value))
                .filter(Boolean),
        ),
    )
}

export function getPortalCompanyPrimaryMatchKey(
    company: PortalCompanyDirectoryItem,
) {
    return (
        getPortalCompanyMatchKeys(company)[0] ??
        normalizePortalCompanyValue(company.companyName)
    )
}

export function mapApiCompanyToPortalCompanyRecord(
    company: ApiCompanyRecord,
): PortalCompanyDirectoryItem {
    const profile = company.companyProfile ?? {}
    const companyName = formatValue(profile.companyName, "شركة غير محددة")
    const companyWebsite = formatValue(profile.website, companyName)

    return {
        id: company.id,
        companyName,
        companyWebsite,
        logoSrc: getApiAssetUrl(profile.logoUrl),
        logoAlt: companyName,
        sector: formatValue(profile.sector),
        numberOfEmployees:
            typeof profile.numberOfEmployees === "number"
                ? profile.numberOfEmployees
                : undefined,
        country: formatValue(profile.country),
        city: formatValue(profile.city),
        address: formatValue(profile.address),
        companyPhone: formatValue(profile.companyPhone),
        companyEmail: formatValue(profile.companyEmail),
        hrManagerName: formatValue(profile.hrManagerName),
        jobTypes: Array.isArray(profile.jobTypes) ? profile.jobTypes : [],
        monthlyJobPostsPlanned:
            typeof profile.monthlyJobPostsPlanned === "number"
                ? profile.monthlyJobPostsPlanned
                : undefined,
        companyRecommendations: formatValue(profile.companyRecommendations),
        licenseUrl: getApiAssetUrl(profile.licenseUrl),
        matchKeys: createCompanyMatchKeys(
            company.id,
            profile.companyName,
            profile.website,
        ),
        to: buildPortalCompanyDetailsPath(company.id),
    }
}

export function usePortalCompanies() {
    const query = useGetData<ApiCompaniesListResponse>(
        "/users/companies",
        {},
        {
            queryKey: ["portal-companies"],
        },
    )

    return {
        ...query,
        companies: (query.data?.data ?? []).map(mapApiCompanyToPortalCompanyRecord),
        total: query.data?.total ?? 0,
    }
}
