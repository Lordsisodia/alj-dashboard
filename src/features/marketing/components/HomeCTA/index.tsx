const BUTTON_BASE = {
  fontWeight: 550,
  lineHeight: '24px',
  letterSpacing: '-0.01125em',
  paddingLeft: '6px',
  paddingRight: '6px',
};

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
        <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function HomeCTA() {
  return (
    <section className="overflow-hidden" style={{ background: '#000' }}>
      <div className="home-cta isso-container" style={{ paddingTop: '108px', paddingBottom: 0, display: 'flex', flexDirection: 'column', gap: '36px' }}>
        <div className="section-head is-large" style={{ zIndex: 2, maxWidth: '960px', position: 'relative' }}>
          <h2 className="home-cta-headline font-display text-h2" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#ffffff', margin: 0 }}>
            Ready to automate your content pipeline?
          </h2>
          <p className="home-cta-headline-p font-body text-body-lg text-white-36" style={{ margin: 0, maxWidth: '640px' }}>
            Start your 7-day trial. No contracts, no limits — see the pipeline run.
          </p>
        </div>

        <div className="main-cta-buttons" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-start', position: 'relative', zIndex: 2 }}>
          <a
            href="https://app.isso.co/sign-up"
            style={{ display: 'inline-flex', alignItems: 'center', background: '#ffffff', color: '#090a0e', fontWeight: 600, fontSize: '16px', borderRadius: '10px', textDecoration: 'none', padding: '8px 12px', flex: 1, justifyContent: 'center' }}
          >
            <span className="font-body" style={BUTTON_BASE}>Start</span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', marginLeft: '-4px' }}>
              <ChevronIcon />
            </span>
          </a>
          <a
            href="/pricing"
            style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600, fontSize: '16px', borderRadius: '10px', textDecoration: 'none', padding: '8px 12px' }}
          >
            <span className="font-body" style={BUTTON_BASE}>View Pricing</span>
          </a>
        </div>

        <div className="home-cta-image-wrapper" style={{ margin: '0 -80px -20%' }}>
          <img
            src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680a4b467abdcf40d0d0fa8b_home-cta.webp"
            alt="Two people looking at laptop, ISSO dashboard is displayed."
            className="home-cta-image w-full h-auto block max-w-none"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
