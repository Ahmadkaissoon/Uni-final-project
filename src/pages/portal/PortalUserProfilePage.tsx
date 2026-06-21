import { PencilLine, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  buildPortalSeekerProfilePayload,
  clonePortalSeekerProfileFormData,
  mapApiSeekerProfileToPortalSeekerProfileData,
  usePortalSeekerProfile,
  useUpdatePortalSeekerProfile,
} from "../../api/portalSeekerProfile";
import PortalSeekerProfileSection from "../../components/portal/PortalSeekerProfileSection";
import { Button } from "../../components/global/ui/button";
import type { PortalPageDefinition } from "../../router/portalPages";
import { getPortalPathByPageId } from "../../router/portalPages";
import {
  type PersonProfileData,
  personProfileEditorConfig,
} from "../../utils/portalProfileSchemas";
import {
  notifyPortalProfileUpdate,
  writeStoredAvatar,
  writeStoredProfile,
} from "../../utils/portalProfileStorage";

interface PortalUserProfilePageProps {
  page: PortalPageDefinition;
}

function mapSeekerProfileToStoredProfile(
  formData: ReturnType<
    typeof mapApiSeekerProfileToPortalSeekerProfileData
  >["formData"],
): PersonProfileData {
  return {
    fullName: formData.fullName,
    gender: formData.gender,
    birthDate: formData.birthDate,
    phone: formData.phone,
    country: formData.country,
    city: formData.city,
    address: formData.address,
    jobLevel: formData.jobLevel,
    yearsExperience: formData.yearsOfExperience,
    lastCompany: formData.lastCompanyName,
    workType: formData.workType,
    latestDegree: formData.lastDegree,
    specialization: formData.specialization,
    university: formData.university,
    graduationYear: formData.graduationYear,
    languages: formData.languages
      .filter((language) => language.language.trim())
      .map((language) => `${language.language}:${language.level}`)
      .join(", "),
    topAchievement: "",
    portfolioLink: formData.personalWebsite,
    professionalProfile: [
      formData.linkedin,
      formData.github,
      formData.behance,
    ]
      .filter(Boolean)
      .join(", "),
    projectSummary: "",
  };
}

function syncStoredSeekerProfile(
  profileData: ReturnType<typeof mapApiSeekerProfileToPortalSeekerProfileData>,
) {
  writeStoredProfile(
    personProfileEditorConfig.storageKey,
    mapSeekerProfileToStoredProfile(profileData.formData),
  );
  writeStoredAvatar(
    personProfileEditorConfig.avatarStorageKey,
    profileData.avatarSrc,
  );
  notifyPortalProfileUpdate("user");
}

export default function PortalUserProfilePage({
  page,
}: PortalUserProfilePageProps) {
  const navigate = useNavigate();
  const seekerProfileQuery = usePortalSeekerProfile();
  const updateSeekerProfileMutation = useUpdatePortalSeekerProfile();
  const profileData = seekerProfileQuery.profileData;
  const isReadOnlyPage = page.id === "profile";
  const alternatePagePath = getPortalPathByPageId(
    "user",
    isReadOnlyPage ? "profile-edit" : "profile",
  );
  const profileSectionKey = profileData
    ? JSON.stringify({
        avatarSrc: profileData.avatarSrc,
        email: profileData.email,
        formData: profileData.formData,
        mode: isReadOnlyPage ? "readonly" : "editable",
      })
    : `${page.id}-empty`;

  useEffect(() => {
    if (profileData) {
      syncStoredSeekerProfile(profileData);
    }
  }, [profileData]);

  return (
    <PortalSeekerProfileSection
      key={profileSectionKey}
      pageTitle={page.title}
      mode={isReadOnlyPage ? "readonly" : "editable"}
      profile={profileData?.formData ?? null}
      email={profileData?.email}
      avatarSrc={profileData?.avatarSrc ?? null}
      isLoading={seekerProfileQuery.isLoading}
      isSaving={updateSeekerProfileMutation.isPending}
      errorMessage={
        seekerProfileQuery.error?.message ?? updateSeekerProfileMutation.error?.message
      }
      onRetry={() => {
        void seekerProfileQuery.refetch();
      }}
      onSave={async (payload) => {
        const response = await updateSeekerProfileMutation.mutateAsync(
          buildPortalSeekerProfilePayload(payload),
        );
        const normalizedProfile = mapApiSeekerProfileToPortalSeekerProfileData(
          response,
        );

        syncStoredSeekerProfile(normalizedProfile);

        return {
          formData: clonePortalSeekerProfileFormData(
            normalizedProfile.formData,
          ),
          avatarSrc: normalizedProfile.avatarSrc,
        };
      }}
      topActions={
        alternatePagePath ? (
          <Button
            type="button"
            variant="panel"
            size="normal"
            onClick={() => navigate(alternatePagePath)}
            className="rounded-[14px] bg-[#5a80cf] !px-5 !py-3 !text-size15 !font-bold !text-white hover:!brightness-105"
          >
            {isReadOnlyPage ? (
              <>
                <PencilLine className="ms-2 size-4" />
                تعديل الملف الشخصي
              </>
            ) : (
              <>
                <UserRound className="ms-2 size-4" />
                عرض الملف الشخصي
              </>
            )}
          </Button>
        ) : null
      }
    />
  );
}
