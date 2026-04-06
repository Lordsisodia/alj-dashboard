'use client';
// ═══════════════════════════════════════════════════════════════════════════════
// ResourcesDropdown - flat 3×2 grid of resource items + right video panel
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import { DropdownContainer } from './DropdownContainer';
import { RESOURCES_ROW1, RESOURCES_ROW2 } from './nav.data';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';
import { RESOURCES_ALL_ICONS, ChevronIcon } from './nav.icons';
import { HOVER_DELAY_MS } from './nav.constants';

function ResourceItem({ href, label, desc, iconKey, comingSoon }: {
  href: string; label: string; desc: string; iconKey: string; comingSoon?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col gap-1.5 no-underline"
      style={{
        padding: '10px 12px',
        borderRadius: 10,
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        transition: 'background 150ms',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="shrink-0 text-white-68 flex">
          {RESOURCES_ALL_ICONS[iconKey]}
        </div>
        <span className="text-white font-medium" style={{ fontSize: 13, lineHeight: '18px' }}>{label}</span>
        {comingSoon && (
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginLeft: 2 }}>soon</span>
        )}
      </div>
      <div className="text-white-45" style={{ fontSize: 12, lineHeight: '16px', paddingLeft: 28 }}>{desc}</div>
    </a>
  );
}

export function ResourcesDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), HOVER_DELAY_MS); };

  return (
    <div onMouseEnter={show} onMouseLeave={hide}>
      <button className="nav-link-btn">
        Resources
        <ChevronIcon open={open} />
      </button>

      {open && (
        <DropdownContainer>
          <div className="flex">

            {/* ── Left: two rows of 3 with one divider ── */}
            <div style={{ flex: 1, padding: '14px 8px 14px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {RESOURCES_ROW1.map(item => (
                  <ResourceItem key={item.label} href={item.href} label={item.label} desc={item.desc} iconKey={item.icon} comingSoon={item.comingSoon} />
                ))}
              </div>
              <div style={{ height: 1, background: '#2a2b30', margin: '10px 4px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {RESOURCES_ROW2.map(item => (
                  <ResourceItem key={item.label} href={item.href} label={item.label} desc={item.desc} iconKey={item.icon} comingSoon={item.comingSoon} />
                ))}
              </div>
            </div>

            {/* ── Right: video panel ── */}
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center shrink-0 rounded-[18px] overflow-hidden relative no-underline"
              style={{
                width: 220,
                borderLeft: '1px solid #2a2b30',
                margin: '10px 10px 10px 0',
              }}
            >
              <div className="z-[2] relative flex flex-col items-center text-center gap-1 text-white-68"
                style={{ padding: '20px 16px 36px' }}>
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none" className="text-white">
                  <path d="M2.16089 3.125H3.23969C4.05852 3.125 4.75606 3.71981 4.88542 4.52835L5.06089 5.625M5.06089 5.625L6.10302 12.1383C6.23239 12.9469 6.92993 13.5417 7.74875 13.5417H14.9034C15.7235 13.5417 16.4218 12.945 16.5497 12.1349L17.4255 6.5883C17.5053 6.0825 17.1144 5.625 16.6023 5.625H5.06089Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.57739 15.5205C8.09505 15.5205 8.51472 15.9404 8.51489 16.458C8.51489 16.9758 8.09516 17.3955 7.57739 17.3955C7.05978 17.3953 6.63989 16.9757 6.63989 16.458C6.64007 15.9405 7.05988 15.5207 7.57739 15.5205ZM15.0774 15.5205C15.5951 15.5205 16.0147 15.9404 16.0149 16.458C16.0149 16.9758 15.5952 17.3955 15.0774 17.3955C14.5598 17.3953 14.1399 16.9757 14.1399 16.458C14.1401 15.9405 14.5599 15.5207 15.0774 15.5205Z" fill="currentColor" stroke="currentColor" strokeWidth="0.208333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-white font-medium" style={{ fontSize: 13 }}>Merch</span>
                <span style={{ fontSize: 12, lineHeight: '16px' }}>Shop workwear for marketers</span>
              </div>
              <LazyVideo
                src="https://publicassets.foreplay.co/Website-Loop.webm"
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </a>
          </div>
        </DropdownContainer>
      )}
    </div>
  );
}
