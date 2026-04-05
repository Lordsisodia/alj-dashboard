'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className = '' }: SectionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`rounded-xl bg-white p-5 ${className}`}
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {children}
    </motion.div>
  );
}
