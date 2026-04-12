'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { AnimatePresence } from 'framer-motion';
import { Film, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import type { Doc } from '@/convex/_generated/dataModel';

import { StatusStrip, timeAgo } from '@/components/ui/status-strip';
import { GalleryCard } from './GalleryCard';
import type { Outcome } from '../queue/types';

export default function GalleryFeaturePage() {
  const history = useQuery(api.contentGen.getHistory, { limit: 200 }) ?? [];
  const models  = useQuery(api.models.getAll) ?? [];

  const [modelFilter, setModelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Outcome>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const total = history.length;
  const approved = history.filter(j => j.outcome === 'Approved').length;
  const rejected = history.filter(j => j.outcome === 'Rejected').length;
  const pending = history.filter(j => !j.outcome || j.outcome === 'Pending Review').length;
  const lastCompletedAt = history[0]?.completedAt ?? 0;

  const filtered = useMemo(() => {
    return history.filter(job => {
      if (modelFilter !== 'all' && job.modelId !== modelFilter) return false;
      if (statusFilter !== 'all') {
        if (statusFilter === 'Pending Review') {
          if (job.outcome && job.outcome !== 'Pending Review') return false;
        } else if (job.outcome !== statusFilter) return false;
      }
      return true;
    });
  }, [history, modelFilter, statusFilter]);

  const selectedModel = models.find(m => m._id === modelFilter);
  const filterLabel = selectedModel ? selectedModel.name : 'All models';

  return (
    <div className="p-5 flex flex-col gap-4">
      <StatusStrip
        status={{ label: 'Gallery', active: total > 0 }}
        stats={[
          { icon: <Film size={11} />, value: total, label: 'clips' },
          { icon: <CheckCircle2 size={11} />, value: approved, label: 'approved', accent: '#059669' },
          { icon: <XCircle size={11} />, value: rejected, label: 'rejected', accent: '#ef4444' },
          { icon: <Clock size={11} />, value: pending, label: 'pending review' },
        ]}
        iconColor="text-emerald-600"
        rightSlot={
          lastCompletedAt ? (
            <div className="flex items-center gap-1.5">
              <Clock size={10} className="text-emerald-600" />
              <span className="text-[11px]">Last: <span className="font-medium text-neutral-700">{timeAgo(lastCompletedAt)}</span></span>
            </div>
          ) : null
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 px-2.5 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {selectedModel && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: selectedModel.avatarColor }}
              />
            )}
            {filterLabel}
            <ChevronDown size={10} className={`transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1.5 rounded-xl py-1 z-50 min-w-[140px]"
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.09)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              }}
            >
              <button
                onClick={() => { setModelFilter('all'); setDropdownOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors"
                style={{ color: modelFilter === 'all' ? '#111' : '#6b7280' }}
              >
                All models
              </button>
              {models.map(m => (
                <button
                  key={m._id}
                  onClick={() => { setModelFilter(m._id); setDropdownOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium hover:bg-neutral-50 transition-colors"
                  style={{ color: modelFilter === m._id ? '#111' : '#6b7280' }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.avatarColor }} />
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'Approved', 'Rejected', 'Pending Review'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === 'all' ? 'all' : status)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: statusFilter === status ? '#10b981' : '#f3f4f6',
                color: statusFilter === status ? '#fff' : '#6b7280',
              }}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Film size={28} className="text-neutral-200" />
          <p className="text-sm font-medium text-neutral-300">No finished clips yet</p>
          <p className="text-xs text-neutral-400">Approved generations will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(job => <GalleryCard key={job._id} job={job} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
