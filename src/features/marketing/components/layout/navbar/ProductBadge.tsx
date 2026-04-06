// ═══════════════════════════════════════════════════════════════════════════════
// ProductBadge - product icon with label, description, and animated gradient glow
// Used in the Product dropdown mega-menu
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { SpriteIcon } from './SpriteIcon';
import { getGradient } from './nav.icons';

interface ProductBadgeProps {
  label: string;
  href: string;
  desc: string;
  sprite: string;
  gradient: string;
}

export function ProductBadge({ label, href, desc, sprite, gradient }: ProductBadgeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 8px 0',
        borderRadius: 12,
        textDecoration: 'none',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'background 200ms, all 0.2s',
        flex: 1,
        minWidth: 0,
        position: 'relative',
      }}
    >
      {/* Label + description at top */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', lineHeight: '20px', textAlign: 'center' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', lineHeight: '16px', marginTop: 4, textAlign: 'center' }}>{desc}</div>
      </div>

      {/* Icon + gradient blob at bottom */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 16, marginBottom: -20 }}>
        {/* Gradient glow - hidden until hovered, then animates up */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40%',
            left: '50%',
            transform: `translateX(-50%) translateY(${hovered ? '0%' : '50%'})`,
            width: 116,
            height: 116,
            borderRadius: '16%',
            background: getGradient(gradient),
            filter: 'blur(28px)',
            opacity: hovered ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <SpriteIcon sprite={sprite} size={88} />
      </div>
    </a>
  );
}
