/**
 * BlogCTA - "Ready to ship more winning ads?" section at the bottom of the blog page.
 * Mirrors the home-cta section from the HTML source.
 */

export default function BlogCTA() {
  return (
    <div className="section overflow-hidden">
      <div className="container section-container">
        <div className="home-cta">
          <div className="section-head is-large">
            <div className="section-head_title">
              <h2 className="text-display-h2">Ready to ship more winning ads?</h2>
            </div>
            <div className="section-head_paragraph is-large">
              <div className="text-alpha-100">
                <p className="text-body-l">
                  Unlock the power of ISSO with an unrestricted 7-Day free trial.
                </p>
              </div>
            </div>
          </div>

          <div className="main-cta-buttons">
            <a
              href="https://app.isso.co/sign-up"
              className="button-dark button-primary w-inline-block"
            >
              <div className="button-text-block">
                <div className="text-heading-m">Start</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                      <path d="M13 8.5L10.5303 10.9697C10.2374 11.2626 9.76255 11.2626 9.46968 10.9697L7 8.5"
                        fill="none" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="currentColor" />
                    </g>
                  </svg>
                </div>
              </div>
            </a>

            <a
              href="/pricing"
              className="button-dark button-secondary w-inline-block"
            >
              <div className="button-text-block">
                <div className="text-heading-m">View pricing</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
