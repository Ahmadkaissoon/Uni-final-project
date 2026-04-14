import type { ComponentType } from "react";

import PortalAllJobCategoriesPage from "../pages/portal/PortalAllJobCategoriesPage";
import PortalCompanyCreateJobPage from "../pages/portal/PortalCompanyCreateJobPage";
import PortalCompanyCreateTrainingPage from "../pages/portal/PortalCompanyCreateTrainingPage";
import PortalCompanyHomePage from "../pages/portal/PortalCompanyHomePage";
import PortalCompanyOpportunitiesPage from "../pages/portal/PortalCompanyOpportunitiesPage";
import PortalCompanyStudiesPage from "../pages/portal/PortalCompanyStudiesPage";
import PortalAllJobsPage from "../pages/portal/PortalAllJobsPage";
import PortalHomePage from "../pages/portal/PortalHomePage";
import PortalInternshipsPage from "../pages/portal/PortalInternshipsPage";
import PortalPagePlaceholder from "../pages/portal/PortalPagePlaceholder";
import PortalSavedJobsPage from "../pages/portal/PortalSavedJobsPage";
import type { PortalPageDefinition } from "./portalPages";

export type PortalPageComponent = ComponentType<{
  page: PortalPageDefinition;
}>;

const portalPageRegistry: Partial<Record<string, PortalPageComponent>> = {
  home: PortalHomePage,
  internships: PortalInternshipsPage,
  "jobs-all": PortalAllJobsPage,
  "jobs-categories": PortalAllJobCategoriesPage,
  "company-create-job": PortalCompanyCreateJobPage,
  "company-create-training": PortalCompanyCreateTrainingPage,
  "company-home": PortalCompanyHomePage,
  "company-jobs": PortalCompanyOpportunitiesPage,
  "company-all-jobs": PortalCompanyOpportunitiesPage,
  "company-studies": PortalCompanyStudiesPage,
  "company-training-list": PortalCompanyOpportunitiesPage,
  "saved-jobs": PortalSavedJobsPage,
  "companies-home": PortalHomePage,
};

export function renderPortalPageElement(page: PortalPageDefinition) {
  const PageComponent = portalPageRegistry[page.id] ?? PortalPagePlaceholder;

  return <PageComponent page={page} />;
}

export { portalPageRegistry };
