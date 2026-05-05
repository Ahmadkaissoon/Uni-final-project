import PortalProfileEditor from "../../components/portal/PortalProfileEditor";
import type { PortalPageDefinition } from "../../router/portalPages";
import {
  companyProfileEditorConfig,
  type CompanyProfileData,
} from "../../utils/portalProfileSchemas";

interface PortalCompanyProfilePageProps {
  page: PortalPageDefinition;
}

export default function PortalCompanyProfilePage({
  page,
}: PortalCompanyProfilePageProps) {
  return (
    <PortalProfileEditor<CompanyProfileData>
      pageTitle={page.title}
      config={companyProfileEditorConfig}
    />
  );
}
