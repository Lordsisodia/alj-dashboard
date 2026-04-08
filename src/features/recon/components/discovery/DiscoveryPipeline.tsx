'use client';

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import {
  DroppableZone,
  PipelineColumn,
  RejectedPanel,
  DraggableCard,
  EmptyState,
} from './index';
import { CandidateRow } from './rows/CandidateRow';
import { ApprovedRow } from './rows/ApprovedRow';
import { ScrapedRow } from './rows/ScrapedRow';
import { ScrapingColumn } from './ScrapingColumn';
import type { MappedCandidate } from './data';
import type { ColumnId } from './dnd';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface PipelineGridProps {
  pending: MappedCandidate[];
  approvedPending: MappedCandidate[];
  scrapingItems: { handle: string; displayName: string; initials: string; startedAt: number }[];
  scraped: MappedCandidate[];
  rejected: MappedCandidate[];
  overColumn: ColumnId | null;
  approvedGlow: number;
  scrapingGlow: number;
  scrapedGlow: number;
  loading: boolean;
  selectedId: string | null;
  actions: ReturnType<typeof import('./hooks/useDiscoveryActions').useDiscoveryActions>;
  onSelect: (id: string | null) => void;
  duplicateCount: number;
  clearDuplicates: () => Promise<unknown>;
  activeCandidate: MappedCandidate | null;
}

export function DiscoveryPipeline({
  pending,
  approvedPending,
  scrapingItems,
  scraped,
  rejected,
  overColumn,
  approvedGlow,
  scrapingGlow,
  scrapedGlow,
  loading,
  selectedId,
  actions,
  onSelect,
  duplicateCount,
  clearDuplicates,
}: PipelineGridProps) {
  return (
    <div className="grid gap-4 items-start" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>

      {/* Unapproved */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} className="flex flex-col gap-2">
        <DroppableZone id="unapproved" isOver={overColumn === 'unapproved'}>
          <PipelineColumn title="Unapproved" count={pending.length} accentColor="#dc2626" columnBg="rgba(220,38,38,0.035)" tooltip="Oracle scans Instagram for creators with unusually high view-to-follower ratios. Pending candidates need a decision." headerExtra={duplicateCount > 0 ? (
            <button onClick={() => clearDuplicates().then(() => window.location.reload())} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ml-auto" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
              <Trash2 size={9} />{duplicateCount} dupes
            </button>
          ) : undefined}>
            {loading ? (
              <AnimatePresence>{[0,1,2,3].map(i => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#e5e7eb' }} />
                  <div className="w-5 h-5 rounded flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }} />
                  <div className="h-3 flex-1 rounded" style={{ backgroundColor: '#f3f4f6' }} />
                </div>
              ))}</AnimatePresence>
            ) : pending.length === 0 ? <EmptyState filter="pending" /> : (
              <AnimatePresence>{pending.map((c, i) => (
                <DraggableCard key={c._convexId} id={c._convexId} column="unapproved">
                  <CandidateRow candidate={c} index={i} isSelected={selectedId === c._convexId} onSelect={() => onSelect(selectedId === c._convexId ? null : c._convexId)} onApprove={e => { e.stopPropagation(); actions.handleApprove(c); }} onReject={e => { e.stopPropagation(); actions.handleReject(c); }} />
                </DraggableCard>
              ))}</AnimatePresence>
            )}
          </PipelineColumn>
        </DroppableZone>
        <RejectedPanel candidates={rejected} />
      </motion.div>

      {/* Approved */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
        <DroppableZone id="approved" isOver={overColumn === 'approved'}>
          <PipelineColumn title="Approved" count={approvedPending.length} accentColor="#991b1b" columnBg="rgba(153,27,27,0.045)" tooltip="Creators cleared for active tracking. Click Scrape or drag to Scraped to pull their full profile data." glowKey={approvedGlow}>
            {approvedPending.length === 0 ? <p className="text-[11px] text-center py-8" style={{ color: 'rgba(153,27,27,0.4)' }}>No approved candidates yet</p> : (
              <AnimatePresence>{approvedPending.map((c, i) => (
                <DraggableCard key={c._convexId} id={c._convexId} column="approved">
                  <ApprovedRow candidate={c} index={i} isScraping={scrapingItems.some(s => s.handle === c.handle)} onSelect={() => onSelect(selectedId === c._convexId ? null : c._convexId)} onScrapeComplete={handles => handles.forEach(h => {
                    // imported via closure from DiscoveryTab
                  })} onScrapeStart={() => actions.addScraping(c)} onScrapeEnd={() => actions.removeScraping(c.handle)} />
                </DraggableCard>
              ))}</AnimatePresence>
            )}
          </PipelineColumn>
        </DroppableZone>
      </motion.div>

      {/* Scraping */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
        <ScrapingColumn liveItems={scrapingItems} columnBg="rgba(127,29,29,0.055)" glowKey={scrapingGlow} />
      </motion.div>

      {/* Scraped */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}>
        <DroppableZone id="scraped" isOver={overColumn === 'scraped'}>
          <PipelineColumn title="Scraped" count={scraped.length} accentColor="#7f1d1d" columnBg="rgba(127,29,29,0.03)" tooltip="Approved creators with enriched profile data pulled from Instagram." glowKey={scrapedGlow}>
            {scraped.length === 0 ? <p className="text-[11px] text-center py-8" style={{ color: 'rgba(127,29,29,0.3)' }}>Scrape an approved card to see results</p> : (
              scraped.map(c => <DraggableCard key={c._convexId} id={c._convexId} column="scraped"><ScrapedRow c={c} /></DraggableCard>)
            )}
          </PipelineColumn>
        </DroppableZone>
      </motion.div>
    </div>
  );
}
