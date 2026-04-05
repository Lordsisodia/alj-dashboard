import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import { nestedCardClass, stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export const QuickLinkPanel = ({ links }: { links: CommunityChannelPreset["quickLinks"] }) => {
  if (!links.length) return null;
  return (
    <div className={cn(stackedPanelClass, "p-5")}>
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <ArrowUpRight className="h-4 w-4" />
        Quick links
      </div>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(nestedCardClass, "group flex items-center justify-between p-4")}
          >
            <div>
              <p className="text-sm font-semibold text-white">{link.label}</p>
              <p className="text-xs text-siso-text-muted">{link.description}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-siso-text-muted group-hover:text-white" />
          </a>
        ))}
      </div>
    </div>
  );
};
