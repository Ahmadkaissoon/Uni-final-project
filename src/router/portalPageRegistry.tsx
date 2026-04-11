import type { ComponentType } from "react";

import PortalAllJobCategoriesPage from "../pages/portal/PortalAllJobCategoriesPage";
import PortalHomePage from "../pages/portal/PortalHomePage";
import PortalPagePlaceholder from "../pages/portal/PortalPagePlaceholder";
import type { PortalPageDefinition } from "./portalPages";

export type PortalPageComponent = ComponentType<{
  page: PortalPageDefinition;
}>;

const portalPageRegistry: Partial<Record<string, PortalPageComponent>> = {
  home: PortalHomePage,
  "jobs-categories": PortalAllJobCategoriesPage,
  "company-home": PortalHomePage,
};

export function renderPortalPageElement(page: PortalPageDefinition) {
  const PageComponent = portalPageRegistry[page.id] ?? PortalPagePlaceholder;

  return <PageComponent page={page} />;
}

export { portalPageRegistry };
