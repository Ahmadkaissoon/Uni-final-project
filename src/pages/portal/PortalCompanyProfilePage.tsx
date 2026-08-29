import { useEffect, useRef, type ChangeEvent } from "react";
import { Download, Eye, FileText, Trash2, Upload } from "lucide-react";

import {
  buildPortalCompanyProfilePayload,
  mapApiCompanyProfileToPortalCompanyProfileData,
  usePortalCompanyProfile,
  useUpdatePortalCompanyProfile,
} from "../../api/portalCompanyProfile";
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
  const updateCompanyProfile = useUpdatePortalCompanyProfile();
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
      onSave={async ({ formData, avatarFile }) => {
        const response = await updateCompanyProfile.mutateAsync(
          buildPortalCompanyProfilePayload({
            formData,
            logo: avatarFile,
          }),
        );
        const nextProfileData =
          mapApiCompanyProfileToPortalCompanyProfileData(response);

        return {
          formData: nextProfileData.formData,
          avatarSrc: nextProfileData.avatarSrc,
        };
      }}
      sidebarContent={
        <>
          <CompanyLogoActionsCard
            avatarSrc={profileData?.avatarSrc}
            isPending={updateCompanyProfile.isPending}
            onRemoveLogo={async () => {
              if (!profileData) {
                return;
              }

              await updateCompanyProfile.mutateAsync(
                buildPortalCompanyProfilePayload({
                  formData: profileData.formData,
                  logo: null,
                  removeLogo: true,
                }),
              );
            }}
          />
          <CompanyLicenseCard
            licenseUrl={profileData?.licenseUrl}
            licenseFilename={profileData?.licenseFilename}
            isPending={updateCompanyProfile.isPending}
            onUpdateLicense={async (licenseImage) => {
              if (!profileData) {
                return;
              }

              await updateCompanyProfile.mutateAsync(
                buildPortalCompanyProfilePayload({
                  formData: profileData.formData,
                  logo: null,
                  licenseImage,
                }),
              );
            }}
            onRemoveLicense={async () => {
              if (!profileData) {
                return;
              }

              await updateCompanyProfile.mutateAsync(
                buildPortalCompanyProfilePayload({
                  formData: profileData.formData,
                  logo: null,
                  removeLicense: true,
                }),
              );
            }}
          />
        </>
      }
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

function CompanyLogoActionsCard({
  avatarSrc,
  isPending,
  onRemoveLogo,
}: {
  avatarSrc?: string | null;
  isPending: boolean;
  onRemoveLogo: () => Promise<void>;
}) {
  if (!avatarSrc) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-[#f1d6d6] bg-white p-4 text-right shadow-[0_14px_30px_rgba(12,32,79,0.08)]">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#fff1f1] text-red-600">
          <Trash2 size={21} />
        </span>
        <div className="min-w-0">
          <h3 className="m-0 text-size17 font-extrabold text-[#1d2a49]">
            إدارة اللوغو
          </h3>
          <p className="mt-1 mb-0 text-size13 font-semibold leading-6 text-[#64708b]">
            يمكنك حذف لوغو الشركة الحالي وسيتم تحديث البروفايل مباشرة.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void onRemoveLogo()}
        disabled={isPending}
        className="mt-4 inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-red-200 bg-red-50 px-3 text-size14 font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Trash2 size={16} />
        {isPending ? "جاري الحذف..." : "حذف اللوغو"}
      </button>
    </div>
  );
}

function CompanyLicenseCard({
  licenseUrl,
  licenseFilename,
  isPending,
  onUpdateLicense,
  onRemoveLicense,
}: {
  licenseUrl?: string | null;
  licenseFilename?: string;
  isPending: boolean;
  onUpdateLicense: (licenseImage: File) => Promise<void>;
  onRemoveLicense: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasLicense = Boolean(licenseUrl);

  function handleLicenseSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      void onUpdateLicense(selectedFile);
    }

    event.target.value = "";
  }

  return (
    <div className="rounded-[24px] border border-[#dce5f6] bg-white p-4 text-right shadow-[0_14px_30px_rgba(12,32,79,0.08)]">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleLicenseSelection}
      />

      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#fff4e7] text-[#ee972f]">
          <FileText size={22} />
        </span>
        <div className="min-w-0">
          <h3 className="m-0 text-size17 font-extrabold text-[#1d2a49]">
            شهادة الترخيص
          </h3>
          <p className="mt-1 mb-0 break-words text-size13 font-semibold leading-6 text-[#64708b]">
            {licenseFilename?.trim() ||
              (hasLicense
                ? "ملف الترخيص المرفوع عند التسجيل"
                : "لم يتم رفع شهادة ترخيص حالياً")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#ee972f] bg-[#ee972f] px-3 text-size14 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Upload size={16} />
          {isPending
            ? "جاري التحديث..."
            : hasLicense
              ? "استبدال الشهادة"
              : "رفع شهادة الترخيص"}
        </button>

        {licenseUrl ? (
          <>
            <a
              href={licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[14px] border border-[#d7def1] bg-[#f8fafc] px-3 text-size14 font-bold text-[#324164] transition hover:bg-white"
            >
              <Eye size={16} />
              عرض الشهادة
            </a>
            <a
              href={licenseUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[14px] border border-[#d7def1] bg-[#f8fafc] px-3 text-size14 font-bold text-[#324164] transition hover:bg-white"
            >
              <Download size={16} />
              تحميل الشهادة
            </a>
          </>
        ) : null}

        {hasLicense ? (
          <button
            type="button"
            onClick={() => void onRemoveLicense()}
            disabled={isPending}
            className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-red-200 bg-red-50 px-3 text-size14 font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Trash2 size={16} />
            {isPending ? "جاري الحذف..." : "حذف الشهادة"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
