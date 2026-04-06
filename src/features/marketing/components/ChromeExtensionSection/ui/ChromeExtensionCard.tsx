import { GlobeIcon, ChevronRight, UsersIcon, StarIcon } from './Icons';

export function ChromeExtensionCard() {
  return (
    <div className="chrome-ext-card home-extension" style={{
      display: 'flex',
      gap: '40px',
      boxShadow: '0 0 0 1px #171920',
      borderRadius: '32px',
      padding: '40px',
      overflow: 'hidden',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    }}>
      <figure className="home-extension-logo" style={{
        width: '128px',
        height: '128px',
        margin: 0,
      }}>
        <div style={{ width: '128px', height: '128px', opacity: 0.5 }}>
          <GlobeIcon />
        </div>
      </figure>
      <div className="home-extension-content" style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '20px',
      }}>
        <div className="home-extension-title">
          <div className="text-alpha-50">
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 550,
              lineHeight: '1rem',
              letterSpacing: '0.166667em',
              textTransform: 'uppercase',
              display: 'block',
            }}>
              Free Chrome Extension - Coming Soon
            </span>
          </div>
          <div className="text-white">
            <h3 style={{
              fontFamily: 'Inter Display, Arial, sans-serif',
              fontSize: '28px',
              fontWeight: 600,
              lineHeight: '36px',
              letterSpacing: '-0.00714286em',
              color: '#ffffff',
              margin: 0,
              maxWidth: '680px',
            }}>
              Save high-performing reels, track inspiration, and feed data straight into your pipeline.
            </h3>
          </div>
        </div>
        <div className="home-extension-details" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div className="flex-gap-2" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              color: '#ffffffd6',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UsersIcon />
            </div>
            <div className="text-alpha-50" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
              letterSpacing: '-0.01125em',
            }}>
              30,000 Users
            </div>
          </div>
          <div className="flex-gap-2" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              color: '#ffffffd6',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <StarIcon />
            </div>
            <div className="text-alpha-50" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
              letterSpacing: '-0.01125em',
            }}>
              4.8/5 Stars
            </div>
          </div>
          <div className="home-extension-cta">
            <a
              href="https://chromewebstore.google.com/detail/ad-library-save-facebook/eaancnanphggbfliooildilcnjocggjm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 550,
                lineHeight: '24px',
                letterSpacing: '-0.01125em',
                borderRadius: '10px',
                padding: '12px 24px',
                textDecoration: 'none',
              }}
            >
              <span>Coming Soon</span>
              <ChevronRight />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}