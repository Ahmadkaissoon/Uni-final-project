import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { clearAuthSession, hasAuthSession, useLogout } from "../api";
import AdminLayout from "../components/layout/AdminLayout";
import { getAdminPageById, getAdminPageByPath } from "./adminPages";

export default function AdminLayoutRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const resolvedPage = getAdminPageByPath(location.pathname);
  const activePageId = resolvedPage?.id ?? "admin-overview";
  const redirectPath = `${location.pathname}${location.search}`;
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
    <AdminLayout
      activePageId={activePageId}
      onLogout={handleLogout}
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
