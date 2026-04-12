'use client';

import { motion } from 'framer-motion';
import { Pin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Announcement } from '../types';

interface AnnouncementBannerProps {
  announcement: Announcement;
}

function formatRelativeTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const isHighPriority = announcement.priority === 'high';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden',
      )}
      style={{
        backgroundColor: '#ffffff',
        border: isHighPriority
          ? '1px solid rgba(255,0,105,0.25)'
          : '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Gradient accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: isHighPriority
            ? 'linear-gradient(90deg, #ff0069, #833ab4)'
            : 'linear-gradient(90deg, #833ab4, #ff0069)',
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {isHighPriority ? (
            <AlertCircle size={13} className="text-pink-500 flex-shrink-0" />
          ) : (
            <Pin size={13} className="text-neutral-400 flex-shrink-0" />
          )}
          <span
            className={cn(
              'text-xs font-semibold',
              isHighPriority ? 'text-pink-600' : 'text-neutral-500',
            )}
          >
            {announcement.pinned ? 'Pinned' : 'Announcement'}
          </span>
          {isHighPriority && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: '#fff0f5', color: '#ff0069' }}
            >
              Priority
            </span>
          )}
        </div>
        <span className="text-[10px] text-neutral-300">{formatRelativeTime(announcement.timestamp)}</span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-neutral-900 leading-snug">{announcement.title}</h3>

      {/* Body */}
      <p className="text-xs text-neutral-500 leading-relaxed">{announcement.body}</p>

      {/* Author */}
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          {announcement.author.charAt(0)}
        </div>
        <span className="text-[11px] font-medium text-neutral-600">{announcement.author}</span>
        <span className="text-[11px] text-neutral-400">·</span>
        <span className="text-[11px] text-neutral-400">{announcement.authorRole}</span>
      </div>
    </motion.div>
  );
}
