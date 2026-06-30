import { useEffect, useMemo, useState } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"

import { hasAuthSession } from "../api"
import { usePortalAuthProfile } from "../api/portalAuthProfile"
import {
    PortalLayout,
    defaultActivePageByRole,
    type PortalProfile,
    type PortalRole,
} from "../components/layout/PortalLayout"
import {
    getStoredPortalProfileSummary,
    subscribeToPortalProfileUpdates,
} from "../utils/portalProfileStorage"
import { getPortalPageByPath, getPortalPathByPageId } from "./portalPages"

interface PortalRoleLayoutRouteProps {
    role: PortalRole
}

function mergePortalProfiles(
    storedProfile: PortalProfile,
    apiProfile: PortalProfile | null,
) {
    if (!apiProfile) {
        return storedProfile
    }

    const resolvedName = apiProfile.name.trim() || storedProfile.name
    const resolvedAvatarSrc = apiProfile.avatarSrc ?? storedProfile.avatarSrc

    return {
        name: resolvedName,
        tagline: storedProfile.tagline ?? apiProfile.tagline,
        avatarSrc: resolvedAvatarSrc,
        avatarLabel:
            storedProfile.avatarLabel ??
            apiProfile.avatarLabel ??
            resolvedName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join(""),
    }
}

export default function PortalRoleLayoutRoute({
    role,
}: PortalRoleLayoutRouteProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const hasSession = hasAuthSession()
    const [storedProfile, setStoredProfile] = useState(() =>
        getStoredPortalProfileSummary(role),
    )
    const authProfileQuery = usePortalAuthProfile(role, hasSession)
    const resolvedPage = getPortalPageByPath(role, location.pathname)

    const activePageId =
        (resolvedPage?.id === "internship-details"
            ? "internships"
            : resolvedPage?.id === "category-jobs"
              ? "jobs-categories"
              : resolvedPage?.id === "companies-all"
                ? "companies"
                : resolvedPage?.id) ?? defaultActivePageByRole[role]
    const redirectPath = `${location.pathname}${location.search}`

    useEffect(() => {
        return subscribeToPortalProfileUpdates((updatedRole) => {
            if (updatedRole === role) {
                setStoredProfile(getStoredPortalProfileSummary(role))
            }
        })
    }, [role])

    const profile = useMemo(
        () => mergePortalProfiles(storedProfile, authProfileQuery.profile),
        [authProfileQuery.profile, storedProfile],
    )

    if (!hasSession) {
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                replace
            />
        )
    }

    return (
        <PortalLayout
            role={role}
            activePageId={activePageId}
            profile={profile}
            onProfileClick={() => {
                const nextPath = getPortalPathByPageId(
                    role,
                    role === "company" ? "company-profile" : "profile",
                )

                if (nextPath && nextPath !== location.pathname) {
                    navigate(nextPath)
                }
            }}
            onPageChange={(pageId) => {
                const nextPath = getPortalPathByPageId(role, pageId)

                if (nextPath && nextPath !== location.pathname) {
                    navigate(nextPath)
                }
            }}
        >
            <Outlet />
        </PortalLayout>
    )
}
