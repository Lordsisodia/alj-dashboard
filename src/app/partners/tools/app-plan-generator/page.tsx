import { HighlightCard } from "@/components/ui/card-5-static";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { Button } from "@/components/ui/button";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { Hammer, ClipboardList, AlertTriangle, Flag } from "lucide-react";
import { primaryGradientButtonClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export default function AppPlanGeneratorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary pb-20 text-white">
      <TierProgressBackdrop className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative z-10 space-y-6">
        <div className="relative px-4 pt-10 lg:px-8">
          <div className="relative">
            <HighlightCard
              color="orange"
              title="App Plan Generator"
              description="Blueprint deal-ready app plans with scope, pricing, and delivery expectations without leaving Pipeline Ops."
              icon={<Hammer className="h-5 w-5 text-siso-orange" />}
              hideDivider
              showCornerIcon={false}
              fullWidth
              titleClassName="uppercase tracking-[0.35em] text-white"
              descriptionClassName="text-sm"
              className="w-full max-w-none text-left"
              metricValue="Coming soon"
              metricLabel="status"
              buttonText="Notify me"
            />
            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col space-y-6 px-4 pb-10 lg:px-8">
          <SettingsGroupCallout
            icon={<ClipboardList className="h-4 w-4" />}
            title="Workflow preview"
            subtitle="Here’s what the generator will walk you through once it launches."
            showChevron={false}
          >
            <div className="grid gap-3 text-sm text-white/80 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Inputs</p>
                <ul className="mt-2 space-y-1 text-white/80">
                  <li>• Business description + goals</li>
                  <li>• Services needed + budget</li>
                  <li>• Risk notes / compliance flags</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Outputs</p>
                <ul className="mt-2 space-y-1 text-white/80">
                  <li>• Timeline + pricing breakdown</li>
                  <li>• Required deliverables checklist</li>
                  <li>• Share-ready PDF + workspace tasks</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/60">Full experience ships with instant plan preview + push to Active Deals.</p>
          </SettingsGroupCallout>

          <SettingsGroupCallout icon={<AlertTriangle className="h-4 w-4" />} title="Coming soon" subtitle="Final wiring + reviews in progress" showChevron={false}>
            <p className="text-sm text-white/80">
              We’re validating templates with partners before enabling the generator. Leave your email to get the launch note.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" className={`${primaryGradientButtonClass} opacity-60`} disabled>
                Coming soon
              </Button>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Share feature request
              </Button>
            </div>
          </SettingsGroupCallout>
        </div>
      </div>
    </main>
  );
}
