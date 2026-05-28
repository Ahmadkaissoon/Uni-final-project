import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import { getAdminPageById, getAdminPageByPath } from "./adminPages";

export default function AdminLayoutRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedPage = getAdminPageByPath(location.pathname);
  const activePageId = resolvedPage?.id ?? "admin-overview";

  return (
    <AdminLayout
      activePageId={activePageId}
      onPageChange={(pageId) => {
        const nextPath = getAdminPageById(pageId)?.path;

        if (nextPath && nextPath !== location.pathname) {
          navigate(nextPath);
        }
      }}
    >
      <Outlet />
    </AdminLayout>
  );
}
