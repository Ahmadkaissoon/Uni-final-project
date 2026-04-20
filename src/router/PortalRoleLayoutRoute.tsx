import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  PortalLayout,
  defaultActivePageByRole,
  type PortalRole,
} from "../components/layout/PortalLayout";
import {
  getPortalPageByPath,
  getPortalPathByPageId,
  portalProfilesByRole,
} from "./portalPages";

interface PortalRoleLayoutRouteProps {
  role: PortalRole;
}

export default function PortalRoleLayoutRoute({
  role,
}: PortalRoleLayoutRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedPage = getPortalPageByPath(role, location.pathname);

  const activePageId =
    (resolvedPage?.id === "internship-details"
      ? "internships"
      : resolvedPage?.id) ??
    defaultActivePageByRole[role];

  return (
    <PortalLayout
      role={role}
      activePageId={activePageId}
      profile={portalProfilesByRole[role]}
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

