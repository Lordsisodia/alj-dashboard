// OnboardingHero - "Start Your Onboarding" heading and subtext, centered above the form.

export default function OnboardingHero() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '640px',
        margin: '0 auto',
        gap: '24px',
      }}
    >
      <div className="text-white">
        <div className="text-alpha-100">
          <div className="overline-heading-wrapper">
            <h1 className="text-overline">Get Started</h1>
          </div>
        </div>
        <h1 className="text-display-h2" style={{ marginTop: '12px' }}>
          Start Your Onboarding
        </h1>
      </div>
      <div className="text-alpha-50" style={{ maxWidth: '480px' }}>
        <div className="text-body-l">
          Tell us about your business and we&apos;ll set up your personalised ad
          workflow in minutes.
        </div>
      </div>
    </div>
  );
}
