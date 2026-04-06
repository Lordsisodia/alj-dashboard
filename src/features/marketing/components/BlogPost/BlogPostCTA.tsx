/**
 * BlogPostCTA - sidebar CTA and the bottom full-width "Ready to ship" CTA.
 * Mirrors the blog-cta aside and the home-cta section from the Foreplay HTML.
 */

// ── Sidebar CTA (displayed beside the article body) ─────────────────────────

export function BlogPostSidebarCTA() {
  return (
    <aside className="blog-cta">
      <div className="blog-cta-content">
        {/* Thumbnail */}
        <a
          href="https://www.youtube.com/watch?v=cv8db4aj7T8"
          target="_blank"
          rel="noopener noreferrer"
          className="blog-cta-lightbox-link w-inline-block"
          style={{
            backgroundImage:
              'url("https://i.ytimg.com/vi/cv8db4aj7T8/maxresdefault.jpg")',
          }}
        >
          <div className="blog-cta-lightbox-play">
            <div className="svg w-embed">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.36053 1.54839C4.47202 1.00696 3.33337 1.6465 3.33337 2.68698V13.3131C3.33337 14.3536 4.47203 14.9931 5.36053 14.4517L14.0794 9.1386C14.932 8.619 14.932 7.38107 14.0794 6.86147L5.36053 1.54839Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </a>

        <div className="blog-cta-text">
          <div className="text-white">
            <div className="text-heading-l">Start your free trial</div>
          </div>
          <div className="text-alpha-100">
            <div className="text-body-m">
              Save, organize, share and analyze your next winning ad.
            </div>
          </div>
        </div>

        <a
          href="https://app.isso.co/sign-up"
          className="button-dark button-secondary w-inline-block"
        >
          <div className="button-text-block">
            <div className="text-heading-m">Start free trial</div>
          </div>
          <div className="button-icon-block icon-right">
            <div className="icon-24">
              <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                  <path
                    d="M13 8.5L10.5303 10.9697C10.2374 11.2626 9.76255 11.2626 9.46968 10.9697L7 8.5"
                    fill="none" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="currentColor"
                  />
                </g>
              </svg>
            </div>
          </div>
        </a>
      </div>
    </aside>
  );
}

// ── Full-width bottom CTA ────────────────────────────────────────────────────

export default function BlogPostCTA() {
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
                <div className="text-heading-m">Start free trial</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                      <path
                        d="M13 8.5L10.5303 10.9697C10.2374 11.2626 9.76255 11.2626 9.46968 10.9697L7 8.5"
                        fill="none" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="currentColor"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </a>

            <a href="/pricing" className="button-dark button-secondary w-inline-block">
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
