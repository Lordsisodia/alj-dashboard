// ═══════════════════════════════════════════════════════════════════════════════
// SpriteIcon — animated product icon (port from MobileSafeSpriteAnimator)
// Cycles through sprite sheet frames on hover
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, useEffect, useCallback } from 'react';
import { SPRITE_FRAMES, getSpriteUrl } from './nav.icons';

interface SpriteIconProps {
  sprite: string;
  size?: number;
}

export function SpriteIcon({ sprite, size = 80 }: SpriteIconProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const state = useRef({ p: 0, tgt: 0, start: 0, t0: null as number | null, raf: 0 });
  const frames = SPRITE_FRAMES[sprite] ?? 1;
  const url = getSpriteUrl(sprite);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.backgroundImage = `url(${url})`;
    el.style.backgroundSize = `${size * frames}px 100%`;
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = '0px 0px';
  }, [url, size, frames]);

  const draw = useCallback((progress: number) => {
    const el = elRef.current;
    if (!el) return;
    el.style.backgroundPosition = `-${Math.round(progress * (frames - 1)) * size}px 0`;
  }, [frames, size]);

  const play = useCallback((dir: 'forward' | 'reverse') => {
    const tgt = dir === 'forward' ? 1 : 0;
    if (tgt === state.current.tgt) return;

    state.current = { ...state.current, start: state.current.p, tgt, t0: null };
    cancelAnimationFrame(state.current.raf);

    const tick = (now: number) => {
      if (!state.current.t0) state.current.t0 = now;
      const raw = Math.min((now - state.current.t0) / 300, 1);
      const eased = 1 - Math.pow(1 - raw, 2);
      state.current.p = state.current.start + (tgt - state.current.start) * eased;
      draw(state.current.p);
      if (raw < 1) state.current.raf = requestAnimationFrame(tick);
    };
    state.current.raf = requestAnimationFrame(tick);
  }, [draw]);

  return (
    <div
      ref={elRef}
      onMouseEnter={() => play('forward')}
      onMouseLeave={() => play('reverse')}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}
