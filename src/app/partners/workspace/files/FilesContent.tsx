import Link from "next/link";
import { Box, FileText, Upload, Flag } from "lucide-react";

import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  nestedCardClass,
  primaryGradientButtonClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const fileSegments = [
  {
    id: "my-files",
    title: "My Files",
    badge: "Private",
    description: "Personal drafts, meeting notes, and uploads only you can access.",
    helper: "1.8 GB of 5 GB",
    primaryHref: "/partners/workspace/files/my-files",
    secondaryHref: "/partners/workspace/files/my-files",
  },
  {
    id: "client-files",
    title: "Client Files",
    badge: "Deals",
    description: "Structure collateral per opportunity with version history + approvals.",
    helper: "6 clients updated this week",
    primaryHref: "/partners/workspace/files/clients",
    secondaryHref: "/partners/workspace/files/clients",
  },
  {
    id: "shared-files",
    title: "Shared Files",
    badge: "Team",
    description: "Partner-ready decks, playbooks, and assets managed by SISO Ops.",
    helper: "12 live links • 2 expiring soon",
    primaryHref: "/partners/workspace/files/shared",
    secondaryHref: "/partners/workspace/files/shared",
  },
];

const storageStats = [
  { label: "Storage used", value: "7.2 GB", helper: "of 20 GB allocation" },
  { label: "Client uploads", value: "18", helper: "+4 vs last week" },
  { label: "Shared links", value: "12", helper: "2 expiring" },
];

const recentActivity = [
  { id: "act-1", title: "Uploaded retail pitch kit", location: "Shared Files", timestamp: "3m ago" },
  { id: "act-2", title: "Helix Labs NDA signed", location: "Client Files", timestamp: "22m ago" },
  { id: "act-3", title: "Draft scope saved", location: "My Files", timestamp: "1h ago" },
];

export function WorkspaceFilesContent() {
  return (
    <div className="space-y-6 p-4 text-white lg:p-8 scroll-smooth">
      <div className="relative">
        <HighlightCard
          color="orange"
          title="Workspace files hub"
          description="Manage private drafts, deal folders, and shared partner assets without bouncing between routes."
          metricValue="3"
          metricLabel="spaces unified"
          buttonText="Upload file"
          buttonHref="#my-files"
          icon={<Upload className="h-5 w-5 text-siso-orange" />}
          hideDivider
          showCornerIcon={false}
          titleClassName="uppercase tracking-[0.3em]"
          descriptionClassName="text-sm"
          className="w-full max-w-none text-left"
          fullWidth
        />
        <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
          <div className="absolute inset-0 flex items-center justify-center text-orange-500">
            <Flag className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fileSegments.map((segment) => (
          <FileSegmentCard key={segment.id} segment={segment} />
        ))}
      </div>

      <SettingsGroupCallout icon={<Box className="h-4 w-4" />} title="Storage health" subtitle="Sync drives + monitor limits" showChevron={false}>
        <div className="grid gap-3 md:grid-cols-3">
          {storageStats.map((stat) => (
            <div key={stat.label} className={cn(nestedCardClass, "border-white/20 p-4 text-white/85")}>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.helper}</p>
            </div>
          ))}
        </div>
      </SettingsGroupCallout>

      <SettingsGroupCallout icon={<FileText className="h-4 w-4" />} title="Recent activity" subtitle="Everything synced back to Pipeline" showChevron={false}>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className={cn(nestedCardClass, "border-white/20 p-4 text-white/85")}>
              <p className="text-sm font-semibold text-white">{activity.title}</p>
              <p className="text-xs text-white/70">{activity.location}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </SettingsGroupCallout>
    </div>
  );
}

function FileSegmentCard({ segment }: { segment: (typeof fileSegments)[number] }) {
  return (
    <article id={segment.id} className={cn(stackedPanelClass, "p-5 text-white/85")}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{segment.title}</p>
          <p className="text-sm text-white/70">{segment.description}</p>
        </div>
        <Badge className="bg-white/15 text-white">{segment.badge}</Badge>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60">{segment.helper}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="default" className={primaryGradientButtonClass}>
          <Link href={segment.primaryHref}>Open</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="secondary"
          className={cn(secondaryActionButtonClass, "rounded-2xl border-white/25 text-white/90 hover:text-white")}
        >
          <Link href={segment.secondaryHref}>Manage</Link>
        </Button>
      </div>
    </article>
  );
}
