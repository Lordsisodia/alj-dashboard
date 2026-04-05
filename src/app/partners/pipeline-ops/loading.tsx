import { stackedPanelClass, nestedCardClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export default function PartnersPipelineOpsLoading() {
  return (
    <div className="min-h-screen bg-siso-bg-primary text-white">
      <div className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
        <div className={`${stackedPanelClass} animate-pulse p-6`}>
          <div className="h-4 w-32 rounded-full bg-white/15" />
          <div className="mt-4 h-8 w-2/3 rounded-full bg-white/10" />
          <div className="mt-2 h-4 w-1/2 rounded-full bg-white/10" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className={`${stackedPanelClass} animate-pulse p-5`}>
              <div className="h-4 w-1/3 rounded-full bg-white/15" />
              <div className="mt-4 h-6 w-3/4 rounded-full bg-white/10" />
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((row) => (
                  <div key={row} className={`${nestedCardClass} h-4 bg-white/5`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`${stackedPanelClass} animate-pulse space-y-3 p-6`}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-4 w-full rounded-full bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
