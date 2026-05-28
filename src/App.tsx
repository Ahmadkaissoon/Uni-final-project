import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLayoutRoute from "./router/AdminLayoutRoute";
import CompanyLayoutRoute from "./router/CompanyLayoutRoute";
import UserLayoutRoute from "./router/UserLayoutRoute";
import { renderPortalPageElement } from "./router/portalPageRegistry";
import { adminPages } from "./router/adminPages";
import {
  companyPortalPages,
  userPortalPages,
} from "./router/portalPages";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminPagePlaceholder from "./pages/admin/AdminPagePlaceholder";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminManagersPage from "./pages/admin/AdminManagersPage";
import AdminSeekersPage from "./pages/admin/AdminSeekersPage";
import AdminTrainingsPage from "./pages/admin/AdminTrainingsPage";
import Login from "./pages/global/login/Login";
import AccountTypeSelection from "./pages/global/register/AccountTypeSelection";
import SonnerToast from "./components/global/toast/SonnerToast";
import CompanyProfileWizard from "./pages/global/register/CompanyProfileWizard";
import PersonProfileWizard from "./pages/global/register/PersonProfileWizard";
import Register from "./pages/global/register/Register";
import ResetOtp from "./pages/global/resetOtp/ResetOtp";
import VerifyPassword from "./pages/global/resetOtp/VerifyPassword";
import RouterNotFoundPage from "./pages/portal/RouterNotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <SonnerToast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/account-type" element={<AccountTypeSelection />} />
        <Route path="/register/company-profile" element={<CompanyProfileWizard />} />
        <Route path="/register/person-profile" element={<PersonProfileWizard />} />
        <Route path="/reset-otp" element={<ResetOtp />} />
        <Route path="/verify-password" element={<VerifyPassword />} />

        <Route element={<UserLayoutRoute />}>
          {userPortalPages.map((page) => (
            <Route
              key={page.id}
              path={page.path}
              element={renderPortalPageElement(page)}
            />
          ))}
        </Route>

        <Route element={<CompanyLayoutRoute />}>
          {companyPortalPages.map((page) => (
            <Route
              key={page.id}
              path={page.path}
              element={renderPortalPageElement(page)}
            />
          ))}
        </Route>

        <Route element={<AdminLayoutRoute />}>
          {adminPages.map((page) => (
            <Route
              key={page.id}
              path={page.path}
              element={
                page.id === "admin-overview" ? (
                  <AdminOverviewPage />
                ) : page.id === "admin-seekers" ? (
                  <AdminSeekersPage />
                ) : page.id === "admin-managers" ? (
                  <AdminManagersPage />
                ) : page.id === "admin-companies" ? (
                  <AdminCompaniesPage />
                ) : page.id === "admin-jobs" ? (
                  <AdminJobsPage />
                ) : page.id === "admin-trainings" ? (
                  <AdminTrainingsPage />
                ) : (
                  <AdminPagePlaceholder page={page} />
                )
              }
            />
          ))}
        </Route>

        <Route path="*" element={<RouterNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
