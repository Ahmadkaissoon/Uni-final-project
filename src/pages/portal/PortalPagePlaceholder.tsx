import type { PortalPageDefinition } from "../../router/portalPages";

interface PortalPagePlaceholderProps {
  page: PortalPageDefinition;
}

export default function PortalPagePlaceholder({
  page,
}: PortalPagePlaceholderProps) {
  return (
    <section className="container">
      <div className="rounded-[24px] border border-[rgb(0_71_171_/_0.10)] bg-white/90 p-8 shadow-[0_18px_42px_rgb(14_35_59_/_0.10)]">
        <h1 className="m-0 text-size30 font-bold text-header-fg">
          {page.title}
        </h1>
        <p className="mt-3 mb-0 max-w-[70ch] text-size16 leading-8 text-foreground-secondary">
          {page.description}
        </p>
      </div>
    </section>
  );
}
