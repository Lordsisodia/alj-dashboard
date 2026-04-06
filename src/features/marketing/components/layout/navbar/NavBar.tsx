// ═══════════════════════════════════════════════════════════════════════════════
// NavBar - main navigation component
// Imports and composes: ProductDropdown, SolutionsDropdown, ResourcesDropdown
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { ProductDropdown } from './ProductDropdown';
import { SolutionsDropdown } from './SolutionsDropdown';
import { ResourcesDropdown } from './ResourcesDropdown';
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <>
      <style>{`
        .nav-container {
          position: sticky; top: 0; z-index: 100;
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          background: rgba(2,3,8,0.94);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-inner {
          max-width: 1340px; margin: 0 auto; padding: 0 24px;
          height: 68px; display: flex; align-items: center;
          position: relative;
        }
        .nav-logo { display: flex; align-items: center; margin-right: 24px; text-decoration: none; }
        .nav-links { display: flex; align-items: center; flex: 1; }
        .nav-link-btn {
          font-size: 15px; font-weight: 550;
          color: rgba(255,255,255,0.68); background: transparent; border: none;
          cursor: pointer; padding: 8px 12px; border-radius: 8px;
          display: flex; align-items: center; gap: 4px;
          transition: color 300ms; white-space: nowrap;
        }
        .nav-link-btn:hover { color: #fff; }
        .nav-simple-link {
          font-size: 15px; font-weight: 550;
          color: rgba(255,255,255,0.68); text-decoration: none;
          padding: 8px 12px; border-radius: 8px; display: inline-block;
          transition: color 300ms; white-space: nowrap;
        }
        .nav-simple-link:hover { color: #fff; }
        .nav-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .nav-signin {
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.68);
          text-decoration: none; padding: 8px 12px; border-radius: 8px;
          transition: color 300ms;
        }
        .nav-signin:hover { color: #fff; }
        .nav-trial-btn {
          font-size: 14px; font-weight: 600; color: #090a0e;
          text-decoration: none; padding: 10px 20px; border-radius: 10px;
          background: #fff; transition: background 300ms; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .nav-trial-btn:hover { background: #dddee5; }
        .mobile-menu-btn {
          display: none; background: transparent; border: none;
          cursor: pointer; color: white; padding: 8px; margin-left: auto;
        }
        @media (max-width: 991px) {
          .nav-links, .nav-right { display: none; }
          .mobile-menu-btn { display: flex; }
          .nav-container { backdrop-filter: none; background: #020308; }
        }
        .mobile-menu { display: none; flex-direction: column; background: #020308; border-top: 1px solid rgba(255,255,255,0.08); padding: 16px 24px; gap: 4px; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 16px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      <div className="nav-container">
        <div className="nav-inner">
          {/* Logo */}
          <a href="/" className="nav-logo">
            <svg width="84" height="32" viewBox="0 0 84 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>ISSO</title>
              <path fill="#fff" d="M4.38 3.43h2.2v6.86H0V8a4.48 4.48 0 0 1 4.38-4.57Z"/>
              <path fill="#fff" d="M17.52 3.43H8.76v6.86h8.76V3.43Z" opacity=".85"/>
              <path fill="#fff" d="M16.43 12.57H8.76v6.86h5.48c1.2 0 2.19-.98 2.19-2.2v-4.66Z" opacity=".7"/>
              <path fill="#fff" d="M24.1 12.57h-5.48v4.67a2.2 2.2 0 0 0 2.19 2.19h3.29v-6.86Z" opacity=".2"/>
              <path fill="#fff" d="M17.52 21.71h6.58v2.3a4.48 4.48 0 0 1-4.39 4.56h-2.19v-6.86Z" opacity=".1"/>
              <path fill="#fff" d="M13.14 21.71H8.76v6.86h6.57v-4.66a2.2 2.2 0 0 0-2.19-2.2Z" opacity=".2"/>
              <path fill="#fff" d="M19.71 3.43A4.48 4.48 0 0 1 24.1 8v2.29H19.7V3.43Z" opacity=".6"/>
              <path fill="#fff" d="M6.57 12.57H0v6.86h6.57v-6.86Z" opacity=".85"/>
              <path fill="#fff" d="M0 21.71h6.57v6.86H4.38A4.48 4.48 0 0 1 0 24v-2.29Z" opacity=".6"/>
              <text x="34" y="22" fill="white" fillOpacity="0.9" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="600" letterSpacing="-0.5">ISSO</text>
            </svg>
          </a>

          {/* Desktop nav */}
          <div className="nav-links">
            <ProductDropdown />
            <SolutionsDropdown />
            <ResourcesDropdown />
            <a href="/pricing" className="nav-simple-link">Pricing</a>
          </div>

          {/* Right: auth */}
          <div className="nav-right">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <SignInButton>
                  <button className="nav-signin">Sign in</button>
                </SignInButton>
                <SignUpButton>
                  <button className="nav-trial-btn">
                    Start free trial
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" style={{ transform: 'rotate(-90deg)' }}>
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#090a0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M16.75 6.25H3.25M16.75 13.75H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          {['/', '/solutions', '/resources', '/pricing'].map((href, i) => (
            <a key={i} href={href} onClick={() => setMobileOpen(false)}>
              {['Product', 'Solutions', 'Resources', 'Pricing'][i]}
            </a>
          ))}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}>Sign in</button>
              </SignInButton>
              <SignUpButton>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#fff', font: 'inherit', padding: 0 }}>Start free trial</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export { NavBar as MarketingNavBar };
export default NavBar;
