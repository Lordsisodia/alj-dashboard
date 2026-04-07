import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';
import { PartnerOnboardingScreen } from '@/domains/partnerships/funnel/onboarding/PartnerOnboardingScreen';

function PartnerOnboarding() {
  return (
    <PartnershipLayout
      title="Partner Onboarding"
      subtitle="Five short steps so you can unlock the dashboard, Start Here course, and revenue plan."
      actions={null}
    >
      <PartnerOnboardingScreen />
    </PartnershipLayout>
  );
}

export default PartnerOnboarding;
