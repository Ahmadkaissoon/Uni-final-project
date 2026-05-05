import type { ComponentType } from "react";

import PortalAllJobCategoriesPage from "../pages/portal/PortalAllJobCategoriesPage";
import PortalAllCompaniesPage from "../pages/portal/PortalAllCompaniesPage";
import PortalAllJobsPage from "../pages/portal/PortalAllJobsPage";
import PortalCareerGuidancePage from "../pages/portal/PortalCareerGuidancePage";
import PortalHomePage from "../pages/portal/PortalHomePage";
import PortalInternshipDetailsPage from "../pages/portal/PortalInternshipDetailsPage";
import PortalInternshipsPage from "../pages/portal/PortalInternshipsPage";
import PortalPagePlaceholder from "../pages/portal/PortalPagePlaceholder";
import PortalSavedJobsPage from "../pages/portal/PortalSavedJobsPage";
import PortalWatchlistPage from "../pages/portal/PortalWatchlistPage";
import type { PortalPageDefinition } from "./portalPages";

export type PortalPageComponent = ComponentType<{
  page: PortalPageDefinition;
}>;

const portalPageRegistry: Partial<Record<string, PortalPageComponent>> = {
  home: PortalHomePage,
  internships: PortalInternshipsPage,
  "internship-details": PortalInternshipDetailsPage,
  "jobs-all": PortalAllJobsPage,
  "jobs-categories": PortalAllJobCategoriesPage,
  companies: PortalAllCompaniesPage,
  "companies-all": PortalAllCompaniesPage,
  "career-guidance": PortalCareerGuidancePage,
  "saved-jobs": PortalSavedJobsPage,
  watchlist: PortalWatchlistPage,
  "company-home": PortalHomePage,
  "company-guidance": PortalCareerGuidancePage,
};

export function renderPortalPageElement(page: PortalPageDefinition) {
  const PageComponent = portalPageRegistry[page.id] ?? PortalPagePlaceholder;

  return <PageComponent page={page} />;
}

export { portalPageRegistry };
