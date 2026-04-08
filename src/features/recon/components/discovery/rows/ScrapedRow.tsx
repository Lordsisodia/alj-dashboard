'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MappedCandidate } from '../data';

export function ScrapedRow({ c }: { c: MappedCandidate }) {
  const [imgError, setImgError] = useState(false);
  const showAvatar = !!c.avatarUrl && !imgError;
  const avatarSrc  = c.avatarUrl
    ? (c.avatarUrl.includes('r2.dev') ? c.avatarUrl : `/api/recon/avatar?url=${encodeURIComponent(c.avatarUrl)}`)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
      style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}
    >
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#16a34a' }} />
      {showAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt={c.handle}
          className="w-5 h-5 rounded flex-shrink-0 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="text-[9px] font-bold flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
          style={{ backgroundColor: 'rgba(153,27,27,0.08)', color: '#991b1b' }}
        >
          {c.initials}
        </span>
      )}
      <p className="text-[11px] font-medium text-neutral-700 truncate flex-1">{c.handle}</p>
    </motion.div>
  );
}
