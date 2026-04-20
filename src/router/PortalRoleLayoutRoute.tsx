import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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
  const [profile, setProfile] = useState(() =>
    getStoredPortalProfileSummary(role),
  );
  const resolvedPage = getPortalPageByPath(role, location.pathname);

  const activePageId =
    (resolvedPage?.id === "internship-details"
      ? "internships"
      : resolvedPage?.id) ??
    defaultActivePageByRole[role];

  useEffect(() => {
    return subscribeToPortalProfileUpdates((updatedRole) => {
      if (updatedRole === role) {
        setProfile(getStoredPortalProfileSummary(role));
      }
    });
  }, [role]);

  return (
    <PortalLayout
      role={role}
      activePageId={activePageId}
      profile={profile}
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
