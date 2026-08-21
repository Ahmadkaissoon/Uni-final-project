import { useEffect } from "react";

import { usePortalCompanyProfile } from "../../api/portalCompanyProfile";
import PortalAccountLogoutButton from "../../components/portal/PortalAccountLogoutButton";
import PortalProfileEditor from "../../components/portal/PortalProfileEditor";
import type { PortalPageDefinition } from "../../router/portalPages";
import {
  companyProfileEditorConfig,
  type CompanyProfileData,
} from "../../utils/portalProfileSchemas";
import {
  notifyPortalProfileUpdate,
  writeStoredAvatar,
  writeStoredProfile,
} from "../../utils/portalProfileStorage";

interface PortalCompanyProfilePageProps {
  page: PortalPageDefinition;
}

export default function PortalCompanyProfilePage({
  page,
}: PortalCompanyProfilePageProps) {
  const companyProfileQuery = usePortalCompanyProfile();
  const profileData = companyProfileQuery.profileData;
  const profileEditorKey = profileData
    ? JSON.stringify({
        avatarSrc: profileData.avatarSrc,
        formData: profileData.formData,
      })
    : "company-profile-empty";

  useEffect(() => {
    if (!profileData) {
      return;
    }

    writeStoredProfile(
      companyProfileEditorConfig.storageKey,
      profileData.formData,
    );
    writeStoredAvatar(
      companyProfileEditorConfig.avatarStorageKey,
      profileData.avatarSrc,
    );
    notifyPortalProfileUpdate("company");
  }, [profileData]);

  return (
    <PortalProfileEditor<CompanyProfileData>
      key={profileEditorKey}
      pageTitle={page.title}
      config={companyProfileEditorConfig}
      initialValues={profileData?.formData}
      initialAvatarSrc={profileData?.avatarSrc}
      topActions={<PortalAccountLogoutButton />}
      pageDescriptionOverride={
        companyProfileQuery.isLoading
          ? "جاري تحميل بيانات الشركة..."
          : companyProfileQuery.isError
            ? "تعذر تحميل بيانات الشركة من الخادم حالياً."
            : undefined
      }
    />
  );
}
