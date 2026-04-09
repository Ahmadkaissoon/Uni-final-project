import { BrowserRouter, Route, Routes } from "react-router-dom";

import CompanyLayoutRoute from "./router/CompanyLayoutRoute";
import UserLayoutRoute from "./router/UserLayoutRoute";
import { renderPortalPageElement } from "./router/portalPageRegistry";
import {
  companyPortalPages,
  userPortalPages,
} from "./router/portalPages";
import Login from "./pages/global/login/Login";
import AccountTypeSelection from "./pages/global/register/AccountTypeSelection";
import CompanyProfileWizard from "./pages/global/register/CompanyProfileWizard";
import PersonProfileWizard from "./pages/global/register/PersonProfileWizard";
import Register from "./pages/global/register/Register";
import ResetOtp from "./pages/global/resetOtp/ResetOtp";
import VerifyPassword from "./pages/global/resetOtp/VerifyPassword";
import RouterNotFoundPage from "./pages/portal/RouterNotFoundPage";

function App() {
  return (
    <BrowserRouter>
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

        <Route path="*" element={<RouterNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
