import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import { nestedCardClass, stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export const GuidelinePanel = ({ guidelines }: { guidelines: CommunityChannelPreset["guidelines"] }) => {
  if (!guidelines.length) return null;
  return (
    <div className={cn(stackedPanelClass, "p-5")}>
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <AlertCircle className="h-4 w-4" />
        Posting guardrails
      </div>
      <div className="mt-4 space-y-3">
        {guidelines.map((rule) => (
          <div key={rule.title} className={cn(nestedCardClass, "p-4")}>
            <p className="text-sm font-semibold text-white">{rule.title}</p>
            <p className="text-xs text-siso-text-muted">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
