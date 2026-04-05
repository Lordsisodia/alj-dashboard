// ═══════════════════════════════════════════════════════════════════════════════
// ProductDropdown — mega-menu with products, analytics, and extend sections
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import { DropdownContainer } from './DropdownContainer';
import { ProductBadge } from './ProductBadge';
import { Section } from './Section';
import { RESEARCH, ANALYTICS, EXTEND } from './nav.data';
import { EXTEND_ICONS, ChevronIcon } from './nav.icons';
import { HOVER_DELAY_MS } from './nav.constants';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

export function ProductDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), HOVER_DELAY_MS); };

  return (
    <div onMouseEnter={show} onMouseLeave={hide}>
      <button className="nav-link-btn">
        Product
        <ChevronIcon open={open} />
      </button>

      {open && (
        <DropdownContainer>
          {/* nav-product-menu: flex row — left links area + right video banner */}
          <div className="flex">

            {/* nav-product-menu-links: flex:1, contains Research + Analytics side-by-side + Extend below */}
            <div className="flex flex-col" style={{ flex: 1 }}>

              {/* Research (6/10) + Analytics (4/10) side by side */}
              <div className="flex" style={{ flex: 1 }}>
                {/* nav-product-menu-links-research: flex:6, padding 16px 16px 0, overflow hidden clips icon bottoms */}
                <div className="flex flex-col gap-2 overflow-hidden" style={{ flex: 6, padding: '16px 16px 0' }}>
                  <div className="text-label text-white-40" style={{ fontSize: 11 }}>
                    Research
                  </div>
                  {/* nav-badge-list: flex ROW, gap 12, align-items stretch */}
                  <div className="flex gap-3 items-stretch">
                    {RESEARCH.map(p => <ProductBadge key={p.label} {...p} />)}
                  </div>
                </div>

                {/* nav-product-menu-links-analytics: flex:4, border-left, padding 16px 16px 0, overflow hidden */}
                <div className="flex flex-col gap-2 overflow-hidden" style={{ flex: 4, padding: '16px 16px 0', borderLeft: '1px solid #2a2b30' }}>
                  <div className="text-label text-white-40" style={{ fontSize: 11 }}>
                    Analytics &amp; Production
                  </div>
                  {/* nav-badge-list: flex ROW, gap 12 */}
                  <div className="flex gap-3 items-stretch">
                    {ANALYTICS.map(p => <ProductBadge key={p.label} {...p} />)}
                  </div>
                </div>
              </div>

              {/* nav-product-menu-links-sub: Extend — full width, border-top, padding 16px */}
              <div className="flex flex-col gap-2 p-4" style={{ borderTop: '1px solid #2a2b30' }}>
                <div className="text-label text-white-40" style={{ fontSize: 11 }}>
                  Extend
                </div>
                {/* u-nav-product-menu-links-sub-list: flex row, gap 12 */}
                <div className="flex gap-3">
                  {EXTEND.map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 p-2 rounded-[10px] no-underline"
                      style={{ transition: 'opacity 200ms' }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.68')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      {/* u-nav-icon-box: 44×44, rgba(255,255,255,0.1) bg, border-radius 12 */}
                      <div className="flex items-center justify-center shrink-0 rounded-[12px]"
                        style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)' }}>
                        {EXTEND_ICONS[link.icon]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-medium" style={{ fontSize: 13, lineHeight: '18px' }}>{link.label}</span>
                          {(link.label === 'Chrome Extension' || link.label === 'API') && (
                            <span className="badge-pill text-white-45">Soon</span>
                          )}
                        </div>
                        <div className="text-white-45" style={{ fontSize: 12, lineHeight: '16px' }}>{link.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* nav-product-menu-banner: ISSO stats panel with ambient video background */}
            <div className="flex flex-col justify-between shrink-0 rounded-[14px] overflow-hidden relative"
              style={{
                width: 220,
                margin: '10px 10px 10px 0',
                border: '1px solid #2a2b30',
                padding: 20,
              }}>
              {/* Ambient video background — original FOREPLAY_V6 nav banner video */}
              <LazyVideo
                src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/69612b690e2aeb02841afc4f_FOREPLAY_V6_webm.webm"
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.3)' }}
              />
              {/* Dark overlay for text legibility */}
              <div className="absolute inset-0" style={{ background: 'rgba(5,5,8,0.75)' }} />

              <div className="relative z-[1]">
                <div className="font-display" style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12,
                }}>ISSO Platform</div>
                {[
                  { stat: '24/7', label: 'Agent uptime' },
                  { stat: '10×', label: 'Faster content ops' },
                  { stat: '5', label: 'AI tools, one stack' },
                ].map(({ stat, label }) => (
                  <div key={stat} style={{ marginBottom: 14 }}>
                    <div className="text-white" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{stat}</div>
                    <div className="text-white-40" style={{ fontSize: 11, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              <a href="/sign-up" className="relative z-[1] flex items-center gap-1.5 no-underline text-white-68"
                style={{ fontSize: 12, fontWeight: 600 }}>
                Start free trial
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>
        </DropdownContainer>
      )}
    </div>
  );
}
