import {
  ArrowUpLeft,
  Layers3,
  LayoutTemplate,
  Route,
  Sparkles,
} from "lucide-react";

import { cn } from "../../utils/cn";
import type { PortalPageDefinition } from "../../router/portalPages";

interface PortalPagePlaceholderProps {
  page: PortalPageDefinition;
}

const cardClass =
  "rounded-[24px] border border-[rgb(0_71_171_/_0.10)] bg-white/90 shadow-[0_18px_42px_rgb(14_35_59_/_0.10)]";

export default function PortalPagePlaceholder({
  page,
}: PortalPagePlaceholderProps) {
  return <section className="grid gap-6"></section>;
}
