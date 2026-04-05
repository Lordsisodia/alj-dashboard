import { cn } from "@/domains/shared/utils/cn";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export function ChannelSkeleton() {
  return (
    <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
        <section className="flex-1 space-y-6">
          <div className={cn(stackedPanelClass, "rounded-[32px] bg-siso-bg-secondary/60 p-6")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="size-12 rounded-2xl border border-white/10 bg-white/5" />
              <div className="space-y-2">
                <div className="h-4 w-48 rounded-full bg-white/10" />
                <div className="h-3 w-64 rounded-full bg-white/5" />
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">Loading…</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={`hero-stat-${item}`} className={cn(nestedCardClass, "h-16 bg-white/5")} />
              ))}
            </div>
          </div>

          <div className={cn(stackedPanelClass, "p-5 bg-siso-bg-secondary/70 space-y-3")}
          >
            <div className="h-3 w-40 rounded-full bg-white/10" />
            <div className="h-28 rounded-2xl border border-white/10 bg-transparent" />
          </div>

          {[0, 1, 2].map((item) => (
            <div key={`message-skeleton-${item}`} className={cn(stackedPanelClass, "h-32 bg-siso-bg-secondary/70")} />
          ))}
        </section>

        <aside className="w-full max-w-xl space-y-6">
          {[0, 1, 2].map((item) => (
            <div key={`aside-skeleton-${item}`} className={cn(stackedPanelClass, "h-40 bg-siso-bg-secondary/60")} />
          ))}
        </aside>
      </div>
    </div>
  );
}
