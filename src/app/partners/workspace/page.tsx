import Link from "next/link";
import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import { primaryGradientButtonClass, secondaryActionButtonClass, stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { WorkspaceDemoHydrator } from "./WorkspaceDemoHydrator.client";
import { CalendarDays, Flag } from "lucide-react";

export default function PartnersWorkspacePage() {
  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="relative">
        <HighlightCard
          color="orange"
          title="Workspace Dashboard"
          description="Plan your day: calendar, office hours, tasks, and notes in one place."
          metricValue="2"
          metricLabel="urgent tasks"
          buttonText="Open calendar"
          buttonHref="/partners/workspace/calendar"
          icon={<CalendarDays className="h-5 w-5 text-siso-orange" />}
          hideDivider
          titleClassName="uppercase tracking-[0.35em] text-white"
          descriptionClassName="text-sm"
          className="w-full max-w-none text-left"
          fullWidth
          showCornerIcon={false}
        />
        <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
          <div className="absolute inset-0 flex items-center justify-center text-orange-500">
            <Flag className="h-4 w-4" />
          </div>
        </div>
      </div>

      <SettingsGroupCallout icon={<span className="text-xl">🛠️</span>} title="Quick tools" subtitle="Jump to where you need work." showChevron={false}>
        <div className={stackedPanelClass + " grid gap-3 p-4 text-xs font-semibold uppercase tracking-[0.3em]"}>
          {[
            { href: "/partners/workspace/tasks", label: "Tasks" },
            { href: "/partners/workspace/notes/my-notes", label: "My Notes" },
            { href: "/partners/workspace/files", label: "Files" },
          ].map((tool, index) => (
            <Button
              key={tool.href}
              asChild
              className={index === 0 ? primaryGradientButtonClass : secondaryActionButtonClass}
              size="sm"
            >
              <Link href={tool.href}>{tool.label}</Link>
            </Button>
          ))}
        </div>
      </SettingsGroupCallout>

      <WorkspaceDemoHydrator />
    </div>
  );
}
