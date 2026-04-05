'use client';

import { motion } from 'framer-motion';

interface AnimatedToggleProps {
  checked: boolean;
  onChange: () => void;
}

export function AnimatedToggle({ checked, onChange }: AnimatedToggleProps) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
      style={{ backgroundColor: checked ? '#ff0069' : '#e5e7eb' }}
      role="switch"
      aria-checked={checked}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white block shadow-sm"
        animate={{ x: checked ? 22 : 3 }}
        style={{ left: 0 }}
      />
    </button>
  );
}
