import { AcademyDashboardHero } from "@/domains/partnerships/academy/01-dashboard/ui/components/cards";
import AcademyDashboardCards from "@/domains/partnerships/academy/01-dashboard/ui/components/AcademyDashboardCards";
import { Waves } from "@/components/ui/wave-background";
import { PartnersPageContainer } from "@/domains/partnerships/_shared/ui/layout/PartnersPageContainer";

export const experimental_ppr = true;

export default function AcademyDashboardPage() {
  return (
    <main className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ filter: "blur(6px)", opacity: 0.9 }}
        aria-hidden="true"
      >
        <Waves
          className="h-full w-full"
          strokeColor="#f8a75c"
          backgroundColor="#0b0b0f"
          pointerSize={0.35}
        />
      </div>
      <PartnersPageContainer className="relative z-10 flex w-full flex-col gap-6 py-10">
        <AcademyDashboardHero />
        <AcademyDashboardCards />
      </PartnersPageContainer>
    </main>
  );
}
