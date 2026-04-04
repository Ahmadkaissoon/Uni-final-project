import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";

import blueLogo from "../../assets/icons/blue_logo.png";
import whiteLogo from "../../assets/icons/white_logo.png";
import { cn } from "../../utils/cn";

export type PortalRole = "user" | "company";

interface PortalNavChild {
  id: string;
  label: string;
}

interface PortalNavItem {
  id: string;
  label: string;
  children?: PortalNavChild[];
}

interface PortalFooterLink {
  id: string;
  label: string;
}

interface PortalFooterSection {
  title: string;
  links: PortalFooterLink[];
}

interface PortalRoleConfig {
  navItems: PortalNavItem[];
  footerSections: PortalFooterSection[];
}

interface PortalProfile {
  name: string;
  tagline?: string;
  avatarSrc?: string;
  avatarLabel?: string;
}

interface PortalLayoutProps {
  role: PortalRole;
  activePageId: string;
  children: ReactNode;
  onPageChange?: (pageId: string) => void;
  profile?: PortalProfile;
  className?: string;
  contentClassName?: string;
}

export const defaultActivePageByRole: Record<PortalRole, string> = {
  user: "jobs-all",
  company: "company-create-job",
};

export const homePageIdByRole: Record<PortalRole, string> = {
  user: "home",
  company: "company-home",
};

export const portalLayoutConfig: Record<PortalRole, PortalRoleConfig> = {
  user: {
    navItems: [
      { id: "home", label: "الرئيسية" },
      {
        id: "jobs",
        label: "الوظائف",
        children: [
          { id: "jobs-all", label: "كافة الوظائف" },
          { id: "jobs-categories", label: "كافة تصنيفات الوظائف" },
          { id: "internships", label: "فرص التدريب" },
          { id: "watchlist", label: "مراقبة" },
        ],
      },
      { id: "saved-jobs", label: "الوظائف المحفوظة" },
      { id: "companies", label: "الشركات" },
      { id: "career-guidance", label: "الإرشاد الوظيفي" },
    ],
    footerSections: [
      {
        title: "الوظائف",
        links: [
          { id: "jobs-all", label: "عرض كافة الوظائف" },
          { id: "jobs-categories", label: "عرض كافة التصنيفات" },
          { id: "jobs", label: "الوظائف" },
          { id: "internships", label: "عرض التدريبات" },
        ],
      },
      {
        title: "الشركات",
        links: [
          { id: "companies-all", label: "عرض كافة الشركات" },
          { id: "companies", label: "الشركات" },
        ],
      },
      {
        title: "الملف الشخصي",
        links: [
          { id: "profile", label: "عرض الملف الشخصي" },
          { id: "profile-edit", label: "تعديل الملف الشخصي" },
          { id: "profile-settings", label: "الإعدادات الشخصية" },
        ],
      },
    ],
  },
  company: {
    navItems: [
      { id: "company-home", label: "الرئيسية" },
      {
        id: "company-create",
        label: "إنشاء",
        children: [
          { id: "company-create-job", label: "وظيفة" },
          { id: "company-create-training", label: "تدريب" },
        ],
      },
      { id: "company-jobs", label: "وظائفي" },
      { id: "company-applications", label: "الطلبات" },
      { id: "company-studies", label: "دراسات" },
      { id: "company-guidance", label: "إرشاد وظيفي" },
    ],
    footerSections: [
      {
        title: "الوظائف",
        links: [
          { id: "company-all-jobs", label: "عرض كافة الوظائف" },
          { id: "company-create-job", label: "إنشاء وظيفة" },
          { id: "company-applications", label: "عرض طلبات التوظيف" },
        ],
      },
      {
        title: "التدريبات",
        links: [
          { id: "company-training-list", label: "عرض كافة التدريبات" },
          { id: "company-create-training", label: "إنشاء التدريب" },
          {
            id: "company-training-applications",
            label: "عرض طلبات التدريب",
          },
        ],
      },
      {
        title: "الملف الشخصي",
        links: [
          { id: "company-profile", label: "عرض الملف الشخصي" },
          { id: "company-profile-edit", label: "تعديل الملف الشخصي" },
          { id: "company-account", label: "إعدادات الحساب" },
        ],
      },
    ],
  },
};

const defaultProfileByRole: Record<PortalRole, PortalProfile> = {
  user: {
    name: "أحمد الرسول",
    tagline: "باحث عن فرصة مناسبة",
    avatarLabel: "أر",
  },
  company: {
    name: "Google",
    tagline: "لوحة إدارة الشركة",
    avatarLabel: "GO",
  },
};

const shellWidthClass =
  "mx-auto w-[min(1280px,calc(100%-32px))] max-[640px]:w-[min(1280px,calc(100%-20px))]";

function getProfileInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return initials || "و";
}

function findActiveParentItem(config: PortalRoleConfig, pageId: string) {
  return (
    config.navItems.find(
      (item) =>
        item.id === pageId ||
        item.children?.some((child) => child.id === pageId) === true,
    ) ?? null
  );
}

export function getPortalPageLabel(role: PortalRole, pageId: string) {
  const config = portalLayoutConfig[role];

  for (const item of config.navItems) {
    if (item.id === pageId) {
      return item.label;
    }

    const activeChild = item.children?.find((child) => child.id === pageId);

    if (activeChild) {
      return activeChild.label;
    }
  }

  for (const section of config.footerSections) {
    const activeLink = section.links.find((link) => link.id === pageId);

    if (activeLink) {
      return activeLink.label;
    }
  }

  return undefined;
}

export function PortalLayout({
  role,
  activePageId,
  children,
  onPageChange,
  profile,
  className,
  contentClassName,
}: PortalLayoutProps) {
  const config = portalLayoutConfig[role];
  const resolvedProfile = profile ?? defaultProfileByRole[role];
  const activeParentItem = useMemo(
    () => findActiveParentItem(config, activePageId),
    [activePageId, config],
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(
    activeParentItem?.children ? activeParentItem.id : null,
  );

  useEffect(() => {
    setOpenDropdownId(activeParentItem?.children ? activeParentItem.id : null);
  }, [activeParentItem, role]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleItemClick = (item: PortalNavItem) => {
    if (item.children?.length) {
      setOpenDropdownId((current) => (current === item.id ? null : item.id));
      return;
    }

    closeMobileMenu();
    setOpenDropdownId(null);
    onPageChange?.(item.id);
  };

  const handleChildClick = (parentId: string, childId: string) => {
    closeMobileMenu();
    setOpenDropdownId(parentId);
    onPageChange?.(childId);
  };

  const handleFooterLinkClick = (pageId: string) => {
    closeMobileMenu();
    onPageChange?.(pageId);
  };

  const avatarLabel =
    resolvedProfile.avatarLabel ?? getProfileInitials(resolvedProfile.name);

  return (
    <div
      className={cn(
        "min-h-svh bg-[radial-gradient(circle_at_top,rgb(0_172_193_/_9%),transparent_32%),linear-gradient(180deg,var(--background)_0%,#f7fafc_100%)] text-foreground",
        className,
      )}
      dir="rtl"
    >
      <div className="flex min-h-svh flex-col">
        <header className="sticky top-0 z-30 bg-[linear-gradient(135deg,var(--primary)_0%,#4a6fc8_100%)] shadow-navbar-shadow">
          <div
            className={cn(
              shellWidthClass,
              "flex min-h-[78px] flex-wrap items-center gap-4 max-[960px]:gap-4 max-[960px]:py-[18px]",
            )}
          >
            <button
              type="button"
              className="inline-flex w-[clamp(118px,11vw,150px)] shrink-0 items-center justify-end bg-transparent max-[960px]:order-1 max-[960px]:w-[120px]"
              onClick={() => onPageChange?.(homePageIdByRole[role])}
              aria-label="وظيفتي"
            >
              <img className="block w-full" src={whiteLogo} alt="وظيفتي" />
            </button>

            <button
              type="button"
              className="hidden size-[42px] items-center justify-center rounded-xl border border-white/25 bg-white/10 text-inverse-fg transition duration-200 hover:-translate-y-px hover:bg-white/15 max-[960px]:order-2 max-[960px]:ms-auto max-[960px]:inline-flex"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav
              className={cn(
                "flex-1 items-center justify-center gap-2.5 max-[960px]:order-4 max-[960px]:w-full max-[960px]:justify-stretch",
                mobileMenuOpen ? "max-[960px]:grid" : "max-[960px]:hidden",
                "min-[961px]:flex min-[961px]:flex-wrap",
              )}
              aria-label="التنقل الرئيسي"
            >
              {config.navItems.map((item) => {
                const isActive =
                  item.id === activeParentItem?.id ||
                  item.children?.some((child) => child.id === activePageId) ===
                    true;
                const isOpen = openDropdownId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative max-[960px]:w-full"
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-transparent px-4 text-size14 font-semibold text-inverse-fg transition duration-200 hover:bg-white/15 max-[960px]:w-full max-[960px]:justify-between",
                        isActive &&
                          "bg-white text-primary shadow-[0_8px_20px_rgb(10_27_62_/_0.18)]",
                      )}
                      onClick={() => handleItemClick(item)}
                      aria-expanded={item.children ? isOpen : undefined}
                    >
                      <span>{item.label}</span>
                      {item.children ? (
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      ) : null}
                    </button>

                    {item.children?.length && isOpen ? (
                      <div
                        className="absolute top-full right-0 mt-2.5 grid min-w-[185px] gap-1.5 rounded-[14px] bg-[linear-gradient(180deg,#5a81d8_0%,var(--primary)_100%)] p-2 shadow-[0_14px_30px_rgb(8_25_57_/_0.28)] max-[960px]:static max-[960px]:mt-2.5 max-[960px]:min-w-0"
                        role="menu"
                      >
                        {item.children.map((child) => {
                          const childIsActive = child.id === activePageId;

                          return (
                            <button
                              key={child.id}
                              type="button"
                              className={cn(
                                "rounded-[10px] bg-transparent px-[14px] py-[11px] text-center text-size14 text-inverse-fg transition duration-200 hover:bg-white/15",
                                childIsActive && "bg-white/15",
                              )}
                              onClick={() =>
                                handleChildClick(item.id, child.id)
                              }
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center justify-start gap-3 max-[960px]:order-3 max-[960px]:w-full max-[960px]:justify-between max-[640px]:flex-wrap">
              <button
                type="button"
                className="inline-flex size-[38px] items-center justify-center rounded-[10px] bg-transparent text-inverse-fg transition duration-200 hover:bg-white/15"
                aria-label="الإشعارات"
              >
                <Bell size={17} />
              </button>

              <span
                className="h-[26px] w-px bg-white/30 max-[640px]:hidden"
                aria-hidden="true"
              />

              <div className="inline-flex items-center gap-[10px] max-[640px]:w-full max-[640px]:justify-start">
                <div className="grid text-start leading-tight">
                  <span className="text-size14 font-bold text-inverse-fg">
                    {resolvedProfile.name}
                  </span>
                  {resolvedProfile.tagline ? (
                    <span className="text-size10 text-white/70">
                      {resolvedProfile.tagline}
                    </span>
                  ) : null}
                </div>

                {resolvedProfile.avatarSrc ? (
                  <img
                    className="size-9 rounded-full border-2 border-white/25 object-cover"
                    src={resolvedProfile.avatarSrc}
                    alt={resolvedProfile.name}
                  />
                ) : (
                  <span className="inline-flex size-9 items-center justify-center rounded-full border-2 border-white/25 bg-[radial-gradient(circle_at_top,rgb(255_255_255_/_0.30),transparent_45%),rgb(255_255_255_/_0.16)] text-size12 font-bold text-inverse-fg">
                    {avatarLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-10 pb-[84px] max-[960px]:py-7 max-[960px]:pb-[72px]">
          <div
            className={cn(
              shellWidthClass,
              "min-h-[clamp(420px,60vh,760px)]",
              contentClassName,
            )}
          >
            {children}
          </div>
        </main>

        <footer className="relative bg-[linear-gradient(180deg,#4b6fc7_0%,var(--primary)_100%)] py-[72px] pb-14 text-inverse-fg max-[960px]:pt-[84px]">
          <div className={cn(shellWidthClass, "relative")}>
            <div className="absolute -top-[50px] right-0 w-[clamp(142px,17vw,190px)] rounded-[18px] bg-second-white-color px-[18px] py-[14px] shadow-[0_16px_34px_rgb(8_24_61_/_0.24)] max-[960px]:left-1/2 max-[960px]:right-auto max-[960px]:-translate-x-1/2">
              <img className="block w-full" src={blueLogo} alt="وظيفتي" />
            </div>

            <div className="mb-6 border-t border-white/35" />

            <div className="grid grid-cols-3 gap-8 max-[960px]:grid-cols-1 max-[960px]:text-center">
              {config.footerSections.map((section) => (
                <section key={section.title} className="grid gap-[18px]">
                  <h2 className="m-0 text-[clamp(1.35rem,1rem+0.8vw,1.9rem)] font-bold">
                    {section.title}
                  </h2>

                  <div className="grid gap-3">
                    {section.links.map((link) => (
                      <button
                        key={link.id}
                        type="button"
                        className={cn(
                          "justify-self-start bg-transparent p-0 text-size15 text-white/80 transition duration-200 hover:-translate-x-1 hover:text-inverse-fg max-[960px]:justify-self-center max-[960px]:hover:translate-x-0",
                          link.id === activePageId &&
                            "-translate-x-1 text-inverse-fg max-[960px]:translate-x-0",
                        )}
                        onClick={() => handleFooterLinkClick(link.id)}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
