'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, ExternalLink, BadgeCheck, Link2, Lock, Film, CheckCircle } from 'lucide-react';
import { FeedView } from '@/features/intelligence/components/feed/FeedView';
import { PostDetailDrawer } from '@/features/intelligence/components/drawer/PostDetailDrawer';
import type { DrawerPost } from '@/features/intelligence/types';
import { DEFAULT_VISIBILITY } from '@/isso/ui/FeedControls';
import type { Competitor } from '../../types';
import { ScoreBadge } from '../shared/ScoreBadge';
import { TrendCard, ProfileHealthSection, NotesField } from './CreatorDetailSections';
import { CreatorBriefSection } from './CreatorBriefSection';
import { formatFollowers } from '../table/tableUtils';

interface Props { creator: Competitor; onBack: () => void; }

export function CreatorDetailView({ creator: c, onBack }: Props) {
  const [drawer, setDrawer] = useState<{ posts: DrawerPost[]; index: number } | null>(null);

  const isActive = c.status === 'active';
  const engRate  = c.engagementRate ?? '-';
  const posts    = (c as any).postsCount ?? (c as any)._totalPosts ?? '-';
  const following = (c as any).followsCount != null ? formatFollowers((c as any).followsCount) : '-';
  const igtv     = c.igtvVideoCount ?? null;
  const highlights = c.highlightReelCount ?? null;
  const verified   = c.verified ?? null;
  const bizAccount = (c as any).isBusinessAccount ?? null;
  const profAccount = (c as any).isProfessionalAccount ?? null;
  const category   = (c as any).businessCategoryName ?? null;
  const source    = c.source ?? null;
  const lastScraped = c.lastScraped ?? '-';
  const postsThisWeek = c.postsThisWeek ?? null;

  const stats = [
    { label: 'Followers',    value: c.followers },
    { label: 'Following',   value: following },
    { label: 'Posts',       value: String(posts) },
    { label: 'Eng. Rate',   value: engRate },
    { label: 'Posts / Wk', value: postsThisWeek != null ? String(postsThisWeek) : '-' },
  ];

  const metaFields = [
    { label: 'Verified',        value: verified    ? 'Yes' : null,      icon: verified ? <CheckCircle size={11} className="text-blue-500" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 block" /> },
    { label: 'Business',        value: bizAccount  ? 'Yes' : null,      icon: bizAccount ? <CheckCircle size={11} className="text-violet-500" /> : null },
    { label: 'Professional',    value: profAccount ? 'Yes' : null,      icon: profAccount ? <CheckCircle size={11} className="text-green-500" /> : null },
    { label: 'IG Category',    value: category,                           icon: null },
    { label: 'IGTV',           value: igtv != null ? String(igtv) : null, icon: null },
    { label: 'Highlights',     value: highlights != null ? String(highlights) : null, icon: null },
    { label: 'Source',         value: source ? (source === 'pre_approved' ? 'Pre-approved' : source === 'scraper' ? 'Scraper' : 'Manual') : null, icon: null },
    { label: 'Last Scraped',   value: lastScraped,                     icon: null },
    { label: 'Link in Bio',    value: (c as any).externalUrl ? 'Yes' : null, icon: (c as any).externalUrl ? <Link2 size={11} className="text-violet-500" /> : null },
  ].filter(f => f.value != null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        {/* ── Header ── */}
        <div
          className="px-5 pt-4 pb-5"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors mb-4"
          >
            <ArrowLeft size={13} />
            Back to Creators
          </button>

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {/* Status ring */}
              <div
                className="absolute inset-0 rounded-full z-10"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${c.nicheColor}, ${c.nicheColor}aa)`
                    : 'linear-gradient(135deg, #9ca3af, #9ca3af88)',
                  padding: '2.5px',
                  borderRadius: '50%',
                  margin: '-2.5px',
                }}
              />
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white relative z-20"
                style={{ backgroundColor: c.avatarColor }}
              >
                {c.initials}
              </div>
              {/* Favorited dot */}
              {c.favorited && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full z-30" style={{ backgroundColor: '#ff0069' }}>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: '#ff0069' }} />
                </span>
              )}
            </div>

            {/* Name + handle + niche */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-neutral-900">{c.displayName}</h2>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{ backgroundColor: `${c.nicheColor}18`, color: c.nicheColor }}
                >
                  {c.niche}
                </span>
                {verified && <BadgeCheck size={14} className="text-blue-500" />}
                <ScoreBadge score={(c as any).aiScore ?? c.score} aiVerdict={(c as any).aiVerdict} />
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <Instagram size={12} className="text-neutral-400" />
                <span className="text-sm text-neutral-400">{c.handle}</span>
                <a
                  href={`https://instagram.com/${c.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                  <ExternalLink size={11} />
                </a>
              </div>

              {/* Bio */}
              {c.bio && (
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{c.bio}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-4">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">{s.value}</p>
                  <p className="text-[10px] text-neutral-400">{s.label}</p>
                </div>
                <div className="w-px h-6 self-stretch" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }} />
              </div>
            ))}
          </div>

          {/* Meta fields */}
          {metaFields.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {metaFields.map(f => (
                <div key={f.label} className="flex items-center gap-1.5">
                  {f.icon && <span className="flex-shrink-0">{f.icon}</span>}
                  <span className="text-[10px] text-neutral-400">{f.label}:</span>
                  <span className="text-[10px] font-medium text-neutral-600">{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="px-5 pt-4 pb-2 flex flex-col gap-4">

          {/* Brief */}
          <CreatorBriefSection
            handle={c.handle}
            displayName={c.displayName}
            niche={c.niche}
            followerCount={(c as any).followerCount ?? (c as any).followersRaw ?? 0}
            engagementRate={engRate}
            postsThisWeek={postsThisWeek ?? undefined}
            source={source ?? undefined}
            onBriefGenerated={() => {}}
          />

          {/* Notes */}
          <NotesField handle={c.handle} />

          {/* Trend + Profile health side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrendCard c={c} />
            <ProfileHealthSection c={c} />
          </div>
        </div>

        {/* ── Reels grid ── */}
        <div className="px-4 py-4 w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-3">Reels</p>
          <FeedView
            sortBy="newest"
            visibility={DEFAULT_VISIBILITY}
            viewMode="grid"
            columns={4}
            handle={c.handle}
            contentType="reel"
            onPostClick={(index, posts) => setDrawer({ index, posts })}
          />
        </div>
      </motion.div>

      {drawer && <PostDetailDrawer posts={drawer.posts} initialIndex={drawer.index} onClose={() => setDrawer(null)} />}
    </>
  );
}
