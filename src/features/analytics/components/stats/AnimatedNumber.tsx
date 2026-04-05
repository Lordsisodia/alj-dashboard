'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { fmtK } from '../../utils';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedNumber({ value, suffix = '', duration = 1.4 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display >= 1000 ? fmtK(display) : display}
      {suffix}
    </span>
  );
}
