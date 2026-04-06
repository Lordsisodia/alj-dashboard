'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Candidate, CandidateStatus } from '../../types';
import { containerVariants } from '../../constants';
import { SEED_CANDIDATES, DISCOVERY_SEED_CANDIDATES, STATUS_FILTERS } from './discovery/discoveryData';
import { DiscoveryHeader } from './discovery/DiscoveryHeader';
import { MiniStat }         from './discovery/MiniStat';
import { CandidateRow }     from './discovery/CandidateRow';
import { DetailPanel }      from './discovery/DetailPanel';
import { EmptyState }       from './discovery/EmptyState';

export function DiscoveryTab({ extraCandidates = [] }: { extraCandidates?: Candidate[] } = {}) {
  const [candidates, setCandidates]         = useState<Candidate[]>(SEED_CANDIDATES);
  const [filter, setFilter]                 = useState<CandidateStatus | 'all'>('pending');
  const [selectedId, setSelectedId]         = useState<number | null>(
    [...SEED_CANDIDATES].filter(c => c.status === 'pending').sort((a, b) => b.outlierRatio - a.outlierRatio)[0]?.id ?? null
  );
  const [discovering, setDiscovering]       = useState(false);
  const [alertThreshold, setAlertThreshold] = useState<number>(10);

  useEffect(() => {
    if (extraCandidates.length > 0) {
      setCandidates(prev => [...extraCandidates, ...prev]);
      setFilter('pending');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCandidates]);

  const pending  = candidates.filter(c => c.status === 'pending').length;
  const approved = candidates.filter(c => c.status === 'approved').length;
  const filtered = useMemo(
    () => candidates.filter(c => filter === 'all' || c.status === filter).sort((a, b) => b.outlierRatio - a.outlierRatio),
    [candidates, filter],
  );
  const selected = candidates.find(c => c.id === selectedId) ?? null;

  function setStatus(id: number, status: CandidateStatus) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (status !== 'pending') {
      const next = candidates.filter(c => c.id !== id && c.status === 'pending').sort((a, b) => b.outlierRatio - a.outlierRatio)[0];
      setSelectedId(next?.id ?? null);
    }
  }

  async function runDiscovery() {
    setDiscovering(true);
    await new Promise(r => setTimeout(r, 2400));
    const now = Date.now();
    setCandidates(prev => [
      ...DISCOVERY_SEED_CANDIDATES.map((d, i) => ({ ...d, id: now + i, discoveredAt: 'Just now', status: 'pending' as CandidateStatus })),
      ...prev,
    ]);
    setFilter('pending');
    setDiscovering(false);
  }

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full space-y-4">
      <DiscoveryHeader
        total={candidates.length} pending={pending} approved={approved}
        alertThreshold={alertThreshold} discovering={discovering}
        onAlertChange={setAlertThreshold} onRunDiscovery={runDiscovery}
      />

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-neutral-900">
                Candidate queue
                {pending > 0 && <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>{pending}</span>}
              </p>
              <span className="text-[10px] text-neutral-400 flex items-center gap-1"><TrendingUp size={10} /> sorted by outlier ratio</span>
            </div>
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap', filter === f.id ? 'text-white' : 'text-neutral-400 hover:text-neutral-600')} style={filter === f.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : { background: 'transparent' }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3">
            {filtered.length === 0 ? (
              <EmptyState filter={filter} onRunDiscovery={runDiscovery} />
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-1.5">
                <AnimatePresence>
                  {filtered.map(c => (
                    <CandidateRow key={c.id} candidate={c} isSelected={selectedId === c.id} onSelect={() => setSelectedId(c.id)} onApprove={() => setStatus(c.id, 'approved')} onReject={() => setStatus(c.id, 'rejected')} onRestore={() => setStatus(c.id, 'pending')} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <div className="w-72 flex-shrink-0 sticky top-6">
          <AnimatePresence mode="wait">
            {selected ? (
              <DetailPanel key={selected.id} candidate={selected} onApprove={() => setStatus(selected.id, 'approved')} onReject={() => setStatus(selected.id, 'rejected')} onRestore={() => setStatus(selected.id, 'pending')} />
            ) : (
              <motion.div key="empty-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl bg-white flex flex-col items-center justify-center py-16 text-center" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#d1d5db' }}>
                  <Users size={18} />
                </div>
                <p className="text-xs text-neutral-400">Select a candidate to preview</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
