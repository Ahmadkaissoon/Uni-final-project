import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { clearAuthSession, hasAuthSession, useLogout } from "../api";
import {
  PortalLayout,
  defaultActivePageByRole,
  type PortalRole,
} from "../components/layout/PortalLayout";
import {
  getPortalPageByPath,
  getPortalPathByPageId,
} from "./portalPages";
import {
  getStoredPortalProfileSummary,
  subscribeToPortalProfileUpdates,
} from "../utils/portalProfileStorage";

interface PortalRoleLayoutRouteProps {
  role: PortalRole;
}

export default function PortalRoleLayoutRoute({
  role,
}: PortalRoleLayoutRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [profile, setProfile] = useState(() =>
    getStoredPortalProfileSummary(role),
  );
  const resolvedPage = getPortalPageByPath(role, location.pathname);

  const activePageId =
    (resolvedPage?.id === "internship-details"
      ? "internships"
      : resolvedPage?.id === "companies-all"
        ? "companies"
        : resolvedPage?.id) ??
    defaultActivePageByRole[role];
  const redirectPath = `${location.pathname}${location.search}`;

  useEffect(() => {
    return subscribeToPortalProfileUpdates((updatedRole) => {
      if (updatedRole === role) {
        setProfile(getStoredPortalProfileSummary(role));
      }
    });
  }, [role]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  };

  if (!hasAuthSession()) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return (
    <PortalLayout
      role={role}
      activePageId={activePageId}
      profile={profile}
      onLogout={handleLogout}
      onProfileClick={() => {
        const nextPath = getPortalPathByPageId(
          role,
          role === "company" ? "company-profile" : "profile",
        );

        if (nextPath && nextPath !== location.pathname) {
          navigate(nextPath);
        }
      }}
      onPageChange={(pageId) => {
        const nextPath = getPortalPathByPageId(role, pageId);

        if (nextPath && nextPath !== location.pathname) {
          navigate(nextPath);
        }
      }}
    >
      <Outlet />
    </PortalLayout>
  );
}
