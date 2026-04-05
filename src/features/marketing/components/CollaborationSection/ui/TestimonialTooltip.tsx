'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Testimonial } from '../data/testimonials';

interface TestimonialTooltipProps {
  testimonial: Testimonial;
  isInverted?: boolean;
}

export function TestimonialTooltip({ testimonial, isInverted }: TestimonialTooltipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'absolute', ...testimonial.position, transform: isInverted ? 'translate(50%)' : 'translate(-50%)', zIndex: 8 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: `translateX(-50%) translateY(${hovered ? '0' : '24px'}) scale(${hovered ? 1 : 0.8})`,
        opacity: hovered ? 1 : 0,
        transition: 'all 300ms cubic-bezier(0.33, 1, 0.68, 1)',
        visibility: hovered ? 'visible' : 'hidden',
        background: '#24262e',
        borderRadius: '16px',
        padding: '4px',
        width: '276px',
      }}>
        <div style={{ padding: '12px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '20px', color: '#ffffffd6', margin: 0 }}>"{testimonial.quote}"</p>
        </div>
        <div style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Image src={testimonial.avatar} width={40} height={40} alt={testimonial.name} style={{ borderRadius: '6px', objectFit: 'cover' }} />
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#ffffffad', letterSpacing: '-0.00642857em' }}>{testimonial.name}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ffffff52' }}>{testimonial.title}</div>
          </div>
        </div>
      </div>
      <Image
        src={testimonial.avatar}
        width={72}
        height={72}
        alt={testimonial.name}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '99px',
          objectFit: 'cover',
          cursor: 'pointer',
          display: 'block',
          transition: 'all 300ms cubic-bezier(0.33, 1, 0.68, 1)',
          boxShadow: hovered ? '0px 0px 0px 3px #ffffff, 0px 0px 0px 5px #4c505f' : 'none',
        }}
      />
    </div>
  );
}
