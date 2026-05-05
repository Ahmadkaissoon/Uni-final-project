import PortalProfileEditor from "../../components/portal/PortalProfileEditor";
import type { PortalPageDefinition } from "../../router/portalPages";
import {
  personProfileEditorConfig,
  type PersonProfileData,
} from "../../utils/portalProfileSchemas";

interface PortalUserProfilePageProps {
  page: PortalPageDefinition;
}

export default function PortalUserProfilePage({
  page,
}: PortalUserProfilePageProps) {
  return (
    <PortalProfileEditor<PersonProfileData>
      pageTitle={page.title}
      config={personProfileEditorConfig}
    />
  );
}
