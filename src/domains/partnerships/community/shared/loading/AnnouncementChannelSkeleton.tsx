import { cn } from "@/domains/shared/utils/cn";
import { stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export function AnnouncementChannelSkeleton() {
  return (
    <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
        <div className={cn(stackedPanelClass, "rounded-[32px] bg-siso-bg-secondary/70 p-6")}
        >
          <div className="h-5 w-64 rounded-full bg-white/10" />
          <div className="mt-4 h-12 rounded-2xl bg-white/5" />
        </div>
        {[0, 1, 2].map((index) => (
          <div key={`announcement-${index}`} className={cn(stackedPanelClass, "space-y-3 bg-siso-bg-secondary/60 p-5 text-white")}
          >
            <div className="h-4 w-48 rounded-full bg-white/10" />
            <div className="h-6 w-full rounded-full bg-white/8" />
            <div className="h-4 w-3/4 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
