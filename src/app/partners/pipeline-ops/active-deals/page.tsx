import { HighlightCard } from "@/components/ui/card-5-static";
import { Waves } from "@/components/ui/wave-background";
import { ActiveDealsHydrator } from "./ActiveDealsHydrator.client";
import { getActiveDeals } from "@/domains/partnerships/pipeline-ops/shared/application/pipelineOpsService";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

export const dynamic = 'force-dynamic';

export default async function PartnerActiveDealsPage() {
  const deals = await getActiveDeals();

  return (
    <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary pb-20 text-siso-text-primary">
      <div className="pointer-events-none absolute inset-0 h-full w-full" style={{ filter: "blur(6px)", opacity: 0.9 }}>
        <Waves className="h-full w-full" strokeColor="#f8a75c" backgroundColor="#0b0b0f" pointerSize={0.35} />
      </div>

      <PartnersPageContainer className="relative z-10 flex flex-col space-y-6 py-8" width="wide">
        <HighlightCard
          color="orange"
          title="Active Deals"
          description="Track health, next steps, and commission forecasts without leaving Client Pipeline."
          icon={<span className="text-xl">🤝</span>}
          hideDivider
          showCornerIcon={false}
          titleClassName="uppercase tracking-[0.35em] text-white"
          descriptionClassName="text-sm"
          className="max-w-none"
        />

        <ActiveDealsHydrator deals={deals} />
      </PartnersPageContainer>
    </main>
  );
}
