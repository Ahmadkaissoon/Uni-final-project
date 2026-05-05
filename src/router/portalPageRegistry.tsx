import type { ComponentType } from "react"

import PortalAllJobCategoriesPage from "../pages/portal/PortalAllJobCategoriesPage"
import PortalCompanyCreateJobPage from "../pages/portal/PortalCompanyCreateJobPage"
import PortalCompanyCreateTrainingPage from "../pages/portal/PortalCompanyCreateTrainingPage"
import PortalCompanyApplicationsPage from "../pages/portal/PortalCompanyApplicationsPage"
import PortalCompanyHomePage from "../pages/portal/PortalCompanyHomePage"
import PortalCompanyOpportunitiesPage from "../pages/portal/PortalCompanyOpportunitiesPage"
import PortalCompanyProfilePage from "../pages/portal/PortalCompanyProfilePage"
import PortalCompanyStudiesPage from "../pages/portal/PortalCompanyStudiesPage"
import PortalAllCompaniesPage from "../pages/portal/PortalAllCompaniesPage"
import PortalAllJobsPage from "../pages/portal/PortalAllJobsPage"
import PortalCareerGuidancePage from "../pages/portal/PortalCareerGuidancePage"
import PortalHomePage from "../pages/portal/PortalHomePage"
import PortalInternshipDetailsPage from "../pages/portal/PortalInternshipDetailsPage"
import PortalInternshipsPage from "../pages/portal/PortalInternshipsPage"
import PortalPagePlaceholder from "../pages/portal/PortalPagePlaceholder"
import PortalSavedJobsPage from "../pages/portal/PortalSavedJobsPage"
import PortalUserProfilePage from "../pages/portal/PortalUserProfilePage"
import PortalWatchlistPage from "../pages/portal/PortalWatchlistPage"
import type { PortalPageDefinition } from "./portalPages"

export type PortalPageComponent = ComponentType<{
    page: PortalPageDefinition
}>

const portalPageRegistry: Partial<Record<string, PortalPageComponent>> = {
    home: PortalHomePage,
    internships: PortalInternshipsPage,
    "internship-details": PortalInternshipDetailsPage,
    "jobs-all": PortalAllJobsPage,
    "jobs-categories": PortalAllJobCategoriesPage,
    "company-create-job": PortalCompanyCreateJobPage,
    "company-create-training": PortalCompanyCreateTrainingPage,
    "company-applications": PortalCompanyApplicationsPage,
    "company-home": PortalCompanyHomePage,
    "company-jobs": PortalCompanyOpportunitiesPage,
    "company-all-jobs": PortalCompanyOpportunitiesPage,
    "company-profile": PortalCompanyProfilePage,
    "company-profile-edit": PortalCompanyProfilePage,
    "company-studies": PortalCompanyStudiesPage,
    "company-training-list": PortalCompanyOpportunitiesPage,
    "company-training-applications": PortalCompanyApplicationsPage,
    profile: PortalUserProfilePage,
    "profile-edit": PortalUserProfilePage,
    "saved-jobs": PortalSavedJobsPage,
    "companies-home": PortalHomePage,
    companies: PortalAllCompaniesPage,
    "companies-all": PortalAllCompaniesPage,
    "career-guidance": PortalCareerGuidancePage,
    watchlist: PortalWatchlistPage,
}

export function renderPortalPageElement(page: PortalPageDefinition) {
    const PageComponent = portalPageRegistry[page.id] ?? PortalPagePlaceholder

    return <PageComponent page={page} />
}

export { portalPageRegistry }
