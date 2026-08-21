import type { PortalCompanyDirectoryItem } from "../components/portal/portalCompaniesData"
import {
    buildPortalCompanyDetailsPath,
    normalizePortalCompanyValue,
} from "../components/portal/portalCompaniesData"
import { useGetData } from "./useQueries"

interface ApiCompanyProfile {
    name?: string
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
    licenseFilename?: string | null
}

interface ApiCompanyRecord {
    id?: string
    _id?: string
    name?: string
    logoUrl?: string | null
    website?: string
    companyProfile?: ApiCompanyProfile | null
}

interface ApiCompaniesListResponse {
    data?: ApiCompanyRecord[]
    total?: number
}

type ApiCompaniesResponse = ApiCompaniesListResponse | ApiCompanyRecord[]
type ApiCompanyDetailResponse = ApiCompanyRecord | { data?: ApiCompanyRecord }

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
    const companyId = formatValue(company.id ?? company._id)
    const companyName = formatValue(
        profile.companyName ?? profile.name ?? company.name,
        "شركة غير محددة",
    )
    const companyWebsite = formatValue(
        profile.website ?? company.website,
        companyName,
    )

    return {
        id: companyId || normalizePortalCompanyValue(companyName),
        companyName,
        companyWebsite,
        logoSrc: getApiAssetUrl(profile.logoUrl ?? company.logoUrl),
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
        licenseFilename: formatValue(profile.licenseFilename),
        matchKeys: createCompanyMatchKeys(
            companyId,
            companyName,
            companyWebsite,
        ),
        to: buildPortalCompanyDetailsPath(companyId || companyName),
    }
}

function resolveApiCompanyDetail(
    response?: ApiCompanyDetailResponse,
): ApiCompanyRecord | undefined {
    if (!response) {
        return undefined
    }

    if ("data" in response && response.data) {
        return response.data
    }

    return response as ApiCompanyRecord
}

export function usePortalCompanies() {
    const query = useGetData<ApiCompaniesResponse>(
        "/users/companies",
        {},
        {
            queryKey: ["portal-companies"],
        },
    )
    const apiCompanies = Array.isArray(query.data)
        ? query.data
        : query.data?.data ?? []
    const total = Array.isArray(query.data)
        ? query.data.length
        : query.data?.total ?? apiCompanies.length

    return {
        ...query,
        companies: apiCompanies.map(mapApiCompanyToPortalCompanyRecord),
        total,
    }
}

export function usePortalCompanyDetails(companyId?: string | null) {
    const query = useGetData<ApiCompanyDetailResponse>(
        companyId ? `/users/companies/${encodeURIComponent(companyId)}` : null,
        {},
        {
            queryKey: ["portal-company-details", companyId],
            enabled: Boolean(companyId),
        },
    )
    const apiCompany = resolveApiCompanyDetail(query.data)

    return {
        ...query,
        company: apiCompany
            ? mapApiCompanyToPortalCompanyRecord(apiCompany)
            : undefined,
    }
}

export function usePortalSimilarCompanies(companyId?: string | null) {
    const query = useGetData<ApiCompaniesResponse>(
        companyId
            ? `/users/companies/${encodeURIComponent(companyId)}/similar`
            : null,
        {},
        {
            queryKey: ["portal-similar-companies", companyId],
            enabled: Boolean(companyId),
        },
    )
    const apiCompanies = Array.isArray(query.data)
        ? query.data
        : query.data?.data ?? []
    const total = Array.isArray(query.data)
        ? query.data.length
        : query.data?.total ?? apiCompanies.length

    return {
        ...query,
        companies: apiCompanies.map(mapApiCompanyToPortalCompanyRecord),
        total,
    }
}
