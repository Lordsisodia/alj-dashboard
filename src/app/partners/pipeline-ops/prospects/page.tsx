import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Users2, Flag } from "lucide-react";
import { getProspects } from "@/domains/partnerships/pipeline-ops/shared/application/pipelineOpsService";
import { ProspectsWorkspace } from "@/domains/partnerships/pipeline-ops/03-prospects/ui/screens/ProspectsWorkspace";
import { HighlightCard } from "@/components/ui/card-5-static";
import { Waves } from "@/components/ui/wave-background";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

export const dynamic = 'force-dynamic';

export default async function PartnerProspectsPage() {
  const prospects = await getProspects();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 z-0" style={{ filter: "blur(5px)", opacity: 0.4 }}>
        <Waves className="h-full w-full" strokeColor="#f8a75c" backgroundColor="transparent" pointerSize={0.25} />
      </div>
      <PartnersPageContainer width="wide" className="relative z-10 w-full space-y-6 pt-8 pb-12">
        <div className="w-full space-y-6">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <Link
                href="/partners/pipeline-ops"
                aria-label="Back to Pipeline Ops dashboard"
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <HighlightCard
              color="orange"
              title="My Prospects"
              description="View every logged client, filter by stage, and jump into next steps."
              icon={<Users2 className="h-5 w-5 text-siso-orange" />}
              hideDivider
              showCornerIcon={false}
              fullWidth
              className="w-full max-w-none pl-12 text-left"
              titleClassName="text-lg font-semibold uppercase tracking-[0.32em] text-white sm:text-xl"
              descriptionClassName="text-sm"
            />
            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
          <Suspense fallback={<div className="p-10 text-white">Loading prospects…</div>}>
            <ProspectsWorkspace initialProspects={prospects} />
          </Suspense>
        </div>
      </PartnersPageContainer>
    </div>
  );
}
