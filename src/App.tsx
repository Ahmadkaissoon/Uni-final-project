import { BrowserRouter, Route, Routes } from "react-router-dom";

import CompanyLayoutRoute from "./router/CompanyLayoutRoute";
import UserLayoutRoute from "./router/UserLayoutRoute";
import { renderPortalPageElement } from "./router/portalPageRegistry";
import {
  companyPortalPages,
  userPortalPages,
} from "./router/portalPages";
import RouterNotFoundPage from "./pages/portal/RouterNotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
