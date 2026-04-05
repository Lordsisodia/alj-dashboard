import { cn } from "@/domains/shared/utils/cn";
import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const statPlaceholders = ["Wins", "Clients", "Response", "Availability"];

export default function CommunityProfileLoading() {
  return (
    <div className="min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-8">
        <div className={cn(stackedPanelClass, "animate-pulse space-y-4 p-6")}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 rounded-3xl border border-white/15 bg-white/5" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-6 w-40 rounded-full bg-white/10" />
              <div className="h-4 w-64 rounded-full bg-white/10" />
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2].map((chip) => (
                  <div key={chip} className="h-5 w-24 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[0, 1].map((cta) => (
              <div key={cta} className="h-9 w-32 rounded-full bg-white/10" />
            ))}
          </div>
        </div>

        <div className={cn(stackedPanelClass, "animate-pulse p-5")}>
          <div className="mb-4 h-4 w-32 rounded-full bg-white/12" />
          <div className="grid gap-3 sm:grid-cols-2">
            {statPlaceholders.map((label) => (
              <div key={label} className={cn(nestedCardClass, "space-y-2 border-white/15 px-4 py-3")}>
                <div className="h-3 w-20 rounded-full bg-white/10" />
                <div className="h-6 w-16 rounded-full bg-white/12" />
              </div>
            ))}
          </div>
        </div>

        <div className={cn(stackedPanelClass, "animate-pulse space-y-4 p-5")}>
          <div className={cn(nestedCardClass, "space-y-3 border-white/15 p-4")}>
            <div className="h-4 w-full rounded-full bg-white/12" />
            <div className="grid gap-2 sm:grid-cols-2">
              {[0, 1, 2, 3].map((pill) => (
                <div key={`focus-pill-${pill}`} className="h-6 rounded-full bg-white/10" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2].map((tag) => (
                <div key={`focus-tag-${tag}`} className="h-5 w-24 rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>

        <div className={cn(stackedPanelClass, "animate-pulse space-y-3 p-5")}>
          {[0, 1, 2].map((row) => (
            <div key={`win-${row}`} className={cn(nestedCardClass, "space-y-2 border-white/15 px-4 py-3")}>
              <div className="h-3 w-28 rounded-full bg-white/10" />
              <div className="h-4 w-full rounded-full bg-white/12" />
            </div>
          ))}
        </div>

        <div className={cn(stackedPanelClass, "animate-pulse space-y-3 p-5")}>
          <div className={cn(nestedCardClass, "space-y-3 border-white/15 p-4")}>
            <div className="h-4 w-32 rounded-full bg-white/10" />
            <div className="h-4 w-full rounded-full bg-white/12" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2].map((chip) => (
                <div key={`contact-${chip}`} className="h-6 w-32 rounded-full bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
