'use client';

import { useState } from 'react';
import { Bookmark, Info, Sparkles, FileText, Download, Flag, ChevronLeft } from 'lucide-react';
import { useMutation } from 'convex/react';
import { cn } from '@/lib/utils';
import { api } from '../../../../../convex/_generated/api';
import { DetailsTab }    from './DetailsTab';
import { AIAnalysisTab } from './AIAnalysisTab';
import { TranscriptTab } from './TranscriptTab';
import type { DrawerPost } from '../../types';

type DrawerTab = 'details' | 'ai' | 'transcript';

const TABS = [
  { id: 'details'    as DrawerTab, label: 'Details',     icon: <Info      size={12} /> },
  { id: 'ai'         as DrawerTab, label: 'AI Analysis', icon: <Sparkles  size={12} /> },
  { id: 'transcript' as DrawerTab, label: 'Transcript',  icon: <FileText  size={12} /> },
];

export function DrawerRightPanel({ post }: { post: DrawerPost }) {
  const [tab, setTab] = useState<DrawerTab>('details');
  const toggleSave    = useMutation(api.intelligence.toggleSave);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: '1px solid rgba(0,0,0,0.07)' }}>
      {/* Save to Hub */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
          <button
            onClick={() => toggleSave({ postId: post._id })}
            className="flex items-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <Bookmark size={13} fill={post.saved ? 'white' : 'none'} />
            {post.saved ? 'Saved to Hub' : 'Save to Hub'}
          </button>
          <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <button className="px-3 py-2.5 text-white hover:brightness-105 transition-all" style={{ background: 'linear-gradient(135deg, #833ab4, #833ab4)' }}>
            <ChevronLeft size={13} className="rotate-90" />
          </button>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-2">
          <Info size={10} />Save to Hub to share, rate, and add to boards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex px-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px',
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
        {tab === 'ai'         && <AIAnalysisTab />}
        {tab === 'transcript' && <TranscriptTab post={post} />}
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 hover:bg-black/[0.05] transition-colors">
          <Download size={12} />Thumbnail
        </button>
        {post.videoUrl && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 hover:bg-black/[0.05] transition-colors">
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
