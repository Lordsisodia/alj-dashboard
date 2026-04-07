'use client';

import { useState } from 'react';
import { Bookmark, Info, Sparkles, FileText, Download, Flag } from 'lucide-react';
import { useMutation } from 'convex/react';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { DetailsTab }    from './DetailsTab';
import { AIAnalysisTab } from './AIAnalysisTab';
import { TranscriptTab } from './TranscriptTab';
import type { DrawerPost } from '../../types';

async function downloadBlob(url: string, filename: string) {
  const res  = await fetch(url);
  const blob = await res.blob();
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

type DrawerTab = 'details' | 'ai' | 'transcript';

const TABS = [
  { id: 'details'    as DrawerTab, label: 'Details',    icon: <Info     size={12} /> },
  { id: 'ai'         as DrawerTab, label: 'Analysis',   icon: <Sparkles size={12} /> },
  { id: 'transcript' as DrawerTab, label: 'Transcript', icon: <FileText size={12} /> },
];

export function DrawerRightPanel({ post, initialTab }: { post: DrawerPost; initialTab?: 'details' | 'ai' | 'transcript' }) {
  const [tab, setTab] = useState<DrawerTab>(initialTab ?? 'details');
  const toggleSave    = useMutation(api.intelligence.toggleSave);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: '1px solid rgba(0,0,0,0.07)' }}>
      {/* Save to Hub */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={() => toggleSave({ postId: post._id })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-105 active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <Bookmark size={13} fill={post.saved ? 'white' : 'none'} />
          {post.saved ? 'Saved to Hub' : 'Save to Hub'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              tab === t.id ? 'text-neutral-900 border-[#ff0069]' : 'text-neutral-400 border-transparent hover:text-neutral-600'
            )}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'details'    && <DetailsTab    post={post} />}
        {tab === 'ai'         && <AIAnalysisTab post={post} />}
        {tab === 'transcript' && <TranscriptTab post={post} />}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <button
          onClick={() => {
            const thumbUrl = post.thumbnailUrl?.startsWith('http')
              ? `/api/proxy-image?url=${encodeURIComponent(post.thumbnailUrl)}`
              : post.thumbnailUrl ?? '';
            if (thumbUrl) downloadBlob(thumbUrl, `${post.handle}-thumbnail.jpg`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 hover:bg-black/[0.05] transition-colors"
        >
          <Download size={12} />Thumbnail
        </button>
        {post.videoUrl && (
          <button
            onClick={() => downloadBlob(post.videoUrl!, `${post.handle}-reel.mp4`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 hover:bg-black/[0.05] transition-colors"
          >
            <Download size={12} />Video
          </button>
        )}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-auto">
          <Flag size={12} />Report
        </button>
      </div>
    </div>
  );
}
