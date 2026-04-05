"use client";

import { PartnerOnboardingScreen } from "@/domains/partnerships/funnel/onboarding/PartnerOnboardingScreen";

// Catch-all step route: /partners/onboarding, /partners/onboarding/1, /partners/onboarding/2, etc.
export default function PartnersOnboardingStepPage() {
  return (
    <div className="min-h-screen w-full bg-siso-bg-primary text-white overflow-x-hidden">
      <PartnerOnboardingScreen />
    </div>
  );
}
