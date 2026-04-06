'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { containerVariants, fadeUp } from '../../constants';
import type { Priority } from '../../types';
import { type FilterOption, type DisplayRequest } from './lib';
import { RequestCard } from './RequestCard';
import { RequestForm } from './RequestForm';
import { FilterBar } from './FilterBar';

export function RequestsView() {
  const dbRequests    = useQuery(api.agents.getFeatureRequests);
  const createRequest = useMutation(api.agents.submitRequest);
  const seedAgents    = useMutation(api.agents.seedAgents);
  const seedCalled    = useRef(false);

  const [filter,   setFilter]   = useState<FilterOption>('All');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!seedCalled.current && dbRequests !== undefined && dbRequests.length === 0) {
      seedCalled.current = true;
      seedAgents();
    }
  }, [dbRequests, seedAgents]);

  const isLoading = dbRequests === undefined;
  const requests  = (dbRequests ?? []) as DisplayRequest[];

  const counts: Record<FilterOption, number> = {
    All:           requests.length,
    Queued:        requests.filter(r => r.status === 'Queued').length,
    'In Progress': requests.filter(r => r.status === 'In Progress').length,
    Delivered:     requests.filter(r => r.status === 'Delivered').length,
  };

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);

  async function handleSubmit(title: string, description: string, priority: Priority) {
    await createRequest({ title, description, requestedBy: 'Shaan S.', priority });
    setShowForm(false);
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between min-h-[28px]">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          {!isLoading && (
            <>
              <span className="font-semibold text-neutral-700">{requests.length}</span>
              <span>requests</span>
              {counts.Queued > 0 && (
                <><span>·</span><span className="font-semibold" style={{ color: '#92640a' }}>{counts.Queued} queued</span></>
              )}
            </>
          )}
        </div>
        {!showForm && (
          <motion.button
            variants={fadeUp}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <Plus size={12} /> New Request
          </motion.button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && <RequestForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
      </AnimatePresence>

      {/* Filters */}
      <FilterBar active={filter} counts={counts} onChange={setFilter} />

      {/* Loading skeleton */}
      {isLoading && [1, 2, 3].map(i => (
        <div key={i} className="h-[88px] rounded-xl animate-pulse"
          style={{ backgroundColor: '#f3f4f6', borderLeft: '3px solid #e5e7eb' }} />
      ))}

      {/* Cards */}
      {!isLoading && filtered.map(r => (
        <RequestCard key={r._id ?? r.id} request={r} />
      ))}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center py-14 text-neutral-400">
          <Inbox size={28} className="mb-3 opacity-30" />
          <p className="text-xs font-medium">
            {filter === 'All' ? 'No requests yet' : `No ${filter.toLowerCase()} requests`}
          </p>
          {filter === 'All' && <p className="text-[11px] mt-1 opacity-60">Submit a request to get started</p>}
        </motion.div>
      )}

    </motion.div>
  );
}
