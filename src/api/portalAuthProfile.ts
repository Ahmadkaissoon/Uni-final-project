import type { PortalProfile, PortalRole } from "../components/layout/PortalLayout"
import { useGetData } from "./useQueries"

interface ApiSeekerProfile {
    fullName?: string
    profilePictureUrl?: string | null
}

interface ApiCompanyProfile {
    companyName?: string
    logoUrl?: string | null
}

interface ApiAuthProfileResponse {
    _id?: string
    email?: string
    role?: string[] | string
    seekerProfile?: ApiSeekerProfile | null
    companyProfile?: ApiCompanyProfile | null
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

function getInitials(name: string) {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")

    return initials || "و"
}

function formatEmailAsName(email?: string) {
    const value = email?.trim()

    if (!value) {
        return "مستخدم"
    }

    return value
}

function mapApiAuthProfileToPortalProfile(
    role: PortalRole,
    profile: ApiAuthProfileResponse,
): PortalProfile {
    const resolvedName =
        role === "company"
            ? profile.companyProfile?.companyName?.trim() ||
              formatEmailAsName(profile.email)
            : profile.seekerProfile?.fullName?.trim() ||
              formatEmailAsName(profile.email)

    const avatarSrc =
        role === "company"
            ? getApiAssetUrl(profile.companyProfile?.logoUrl)
            : getApiAssetUrl(profile.seekerProfile?.profilePictureUrl)

    return {
        name: resolvedName,
        avatarSrc,
        avatarLabel: getInitials(resolvedName),
    }
}

export function usePortalAuthProfile(role: PortalRole, enabled = true) {
    const query = useGetData<ApiAuthProfileResponse>(
        "/auth/profile",
        {},
        {
            enabled,
            queryKey: ["portal-auth-profile", role],
        },
    )

    return {
        ...query,
        profile: query.data
            ? mapApiAuthProfileToPortalProfile(role, query.data)
            : null,
    }
}
