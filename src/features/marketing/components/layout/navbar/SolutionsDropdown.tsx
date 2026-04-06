// ═══════════════════════════════════════════════════════════════════════════════
// SolutionsDropdown — featured OFM + coming-soon verticals
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import { DropdownContainer } from './DropdownContainer';
import { SOLUTION_FEATURED, SOLUTIONS_COMING_SOON } from './nav.data';
import { SOLUTIONS_ICONS, ChevronIcon } from './nav.icons';
import { HOVER_DELAY_MS } from './nav.constants';

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturedSolution() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={SOLUTION_FEATURED.href}
      className="flex flex-col gap-4 rounded-[16px] no-underline shrink-0 self-stretch"
      style={{
        padding: 20,
        background: hovered
          ? 'linear-gradient(135deg, rgba(227,27,35,0.18) 0%, rgba(227,27,35,0.06) 100%)'
          : 'linear-gradient(135deg, rgba(227,27,35,0.12) 0%, rgba(227,27,35,0.04) 100%)',
        border: '1px solid rgba(227,27,35,0.28)',
        transition: 'background 200ms, border-color 200ms',
        width: 240,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="flex items-center justify-center shrink-0 rounded-[12px]"
        style={{
          width: 48, height: 48,
          background: 'rgba(227,27,35,0.15)',
          border: '1px solid rgba(227,27,35,0.3)',
        }}>
        {SOLUTIONS_ICONS['OFM & Model Management']}
      </div>

      {/* Label + desc */}
      <div className="flex flex-col gap-1.5" style={{ flex: 1 }}>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold" style={{ fontSize: 13, lineHeight: '18px' }}>
            {SOLUTION_FEATURED.label}
          </span>
          {/* Active badge */}
          <span className="rounded-[6px] uppercase"
            style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              color: '#E31B23', background: 'rgba(227,27,35,0.12)',
              border: '1px solid rgba(227,27,35,0.3)',
              padding: '2px 6px',
            }}>
            Live
          </span>
        </div>
        <p className="m-0" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: '17px' }}>
          {SOLUTION_FEATURED.desc}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1.5 font-semibold"
        style={{
          fontSize: 12,
          color: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
          transition: 'color 200ms',
        }}>
        Learn more <ArrowIcon />
      </div>
    </a>
  );
}

function ComingSoonItem({ label, iconKey }: { label: string; iconKey: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] cursor-default"
      style={{
        padding: '8px 10px',
        opacity: hovered ? 0.6 : 0.4,
        transition: 'opacity 200ms',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Small icon box */}
      <div className="flex items-center justify-center shrink-0 rounded-[8px]"
        style={{
          width: 32, height: 32,
          border: '1px solid rgba(255,255,255,0.1)',
          filter: 'grayscale(100%)',
        }}>
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'center' }}>
          {SOLUTIONS_ICONS[iconKey]}
        </div>
      </div>
      <span className="text-white font-medium" style={{ fontSize: 13, lineHeight: '18px', flex: 1 }}>
        {label}
      </span>
      <span className="shrink-0 rounded-[6px] uppercase"
        style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.4)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2px 7px',
        }}>
        Soon
      </span>
    </div>
  );
}

export function SolutionsDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), HOVER_DELAY_MS); };

  return (
    <div onMouseEnter={show} onMouseLeave={hide}>
      <button className="nav-link-btn">
        Solutions
        <ChevronIcon open={open} />
      </button>

      {open && (
        <DropdownContainer>
          {/* Header label */}
          <div className="text-label text-white-40 pb-3.5" style={{ fontSize: 11 }}>
            ISSO is For;
          </div>

          {/* Two-section layout: featured left, coming-soon right */}
          <div className="flex gap-4 items-stretch">
            {/* Featured OFM card */}
            <FeaturedSolution />

            {/* Vertical divider */}
            <div className="shrink-0" style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />

            {/* Coming soon list */}
            <div className="flex flex-col gap-0.5 justify-center" style={{ flex: 1 }}>
              <div className="text-label px-2.5 mb-1.5"
                style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
                More verticals
              </div>
              {SOLUTIONS_COMING_SOON.map(item => (
                <ComingSoonItem key={item.label} label={item.label} iconKey={item.iconKey} />
              ))}
            </div>
          </div>
        </DropdownContainer>
      )}
    </div>
  );
}
