'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Clock, CheckCircle2, Circle, Send, Edit3, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type QueueStatus = 'draft' | 'approved' | 'scheduled' | 'published';
type ViewMode = 'agency' | 'model' | 'account';

interface QueueItem {
  id: string;
  model: string;
  modelColor: string;
  account: string;
  handle: string;
  initials: string;
  color: string;
  caption: string;
  tags: string[];
  scheduledFor: string;
  status: QueueStatus;
  likes?: number;
  comments?: number;
}

const QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'q1', model: 'Ella', modelColor: '#f77737', account: 'ella_main', initials: 'EL', handle: '@ella.creates', color: '#f77737',
    caption: 'Morning routine ft. the new collab drop 🌅✨ This one took me all week to perfect...',
    tags: ['#beauty', '#routine', '#collab'],
    scheduledFor: 'Today, 6:00 PM', status: 'approved',
  },
  {
    id: 'q2', model: 'Tyler', modelColor: '#ff0069', account: 'tyler_main', initials: 'TY', handle: '@tyler.isso', color: '#ff0069',
    caption: 'Back day hits different when the music is right 🔥 Full workout breakdown in bio',
    tags: ['#fitness', '#gym', '#workout'],
    scheduledFor: 'Today, 8:30 PM', status: 'scheduled',
  },
  {
    id: 'q3', model: 'Ren', modelColor: '#833ab4', account: 'ren_main', initials: 'RN', handle: '@ren.official', color: '#833ab4',
    caption: 'Sunday reset looking like this. Coffee, candles, and zero plans 🕯️',
    tags: ['#lifestyle', '#sunday', '#aesthetic'],
    scheduledFor: 'Tomorrow, 10:00 AM', status: 'draft',
  },
  {
    id: 'q4', model: 'Ella', modelColor: '#f77737', account: 'ella_main', initials: 'EL', handle: '@ella.creates', color: '#f77737',
    caption: 'The glow-up is real and it starts with your skincare order 💆‍♀️',
    tags: ['#skincare', '#beauty', '#glowup'],
    scheduledFor: 'Tomorrow, 2:00 PM', status: 'draft',
  },
  {
    id: 'q5', model: 'Tyler', modelColor: '#ff0069', account: 'tyler_main', initials: 'TY', handle: '@tyler.isso', color: '#ff0069',
    caption: 'PR week incoming 📈 Let\'s get it',
    tags: ['#fitness', '#gains', '#pr'],
    scheduledFor: 'Wed, 7:00 AM', status: 'approved',
  },
  {
    id: 'q6', model: 'Ren', modelColor: '#833ab4', account: 'ren_backup', initials: 'RN', handle: '@ren.backup', color: '#9b59d4',
    caption: 'New city, same vibe. Milan was something else 🇮🇹',
    tags: ['#travel', '#lifestyle', '#milan'],
    scheduledFor: 'Wed, 6:00 PM', status: 'scheduled',
  },
  {
    id: 'q7', model: 'Ella', modelColor: '#f77737', account: 'ella_main', initials: 'EL', handle: '@ella.creates', color: '#f77737',
    caption: 'BTS of the shoot that broke my FYP 😭✨',
    tags: ['#bts', '#shoot', '#beauty'],
    scheduledFor: 'Thu, 12:00 PM', status: 'published',
    likes: 8_234, comments: 312,
  },
  {
    id: 'q8', model: 'Tyler', modelColor: '#ff0069', account: 'tyler_backup', initials: 'TY', handle: '@tyler.backup', color: '#ff3377',
    caption: 'Rest day reel - because recovery is part of the process',
    tags: ['#recovery', '#fitness', '#mindset'],
    scheduledFor: 'Yesterday, 3:00 PM', status: 'published',
    likes: 5_102, comments: 189,
  },
];

const MODELS = [
  { id: 'Tyler', label: 'Tyler', color: '#ff0069', accounts: ['@tyler.isso', '@tyler.backup'] },
  { id: 'Ren',   label: 'Ren',   color: '#833ab4', accounts: ['@ren.official', '@ren.backup'] },
  { id: 'Ella',  label: 'Ella',  color: '#f77737', accounts: ['@ella.creates'] },
];

const STATUS_CONFIG: Record<QueueStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: 'Draft',     bg: 'bg-neutral-100',  color: '#737373', icon: <Circle size={11} /> },
  approved:  { label: 'Approved',  bg: 'bg-emerald-50',   color: '#16a34a', icon: <CheckCircle2 size={11} /> },
  scheduled: { label: 'Scheduled', bg: 'bg-blue-50',      color: '#2563eb', icon: <Clock size={11} /> },
  published: { label: 'Published', bg: 'bg-violet-50',    color: '#7c3aed', icon: <Send size={11} /> },
};

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'approved', label: 'Approved' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
];

function fmt(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function QueueCard({ item }: { item: QueueItem }) {
  const s = STATUS_CONFIG[item.status];
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div
        className="h-28 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}35)` }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-black text-white"
          style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
        >
          {item.initials}
        </div>
        <div className={cn('absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg', s.bg)}>
          <span style={{ color: s.color }}>{s.icon}</span>
          <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.label}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: item.color }}
          >
            {item.initials}
          </div>
          <span className="text-xs font-semibold text-neutral-700 truncate">{item.handle}</span>
        </div>
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed flex-1">{item.caption}</p>
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${item.color}12`, color: item.color }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1 text-[10px] text-neutral-400">
            <Clock size={10} /> {item.scheduledFor}
          </div>
          {item.status === 'published' && item.likes !== undefined ? (
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span className="flex items-center gap-0.5"><Heart size={10} /> {fmt(item.likes)}</span>
              <span className="flex items-center gap-0.5"><MessageCircle size={10} /> {fmt(item.comments ?? 0)}</span>
            </div>
          ) : (
            <button className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
              <Edit3 size={10} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Agency Pipeline View ─────────────────────────────────────────────────────
function AgencyView({ items }: { items: QueueItem[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Tyler: true, Ren: true, Ella: true });

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total in Pipeline', value: items.length, color: '#6366f1' },
          { label: 'Drafts',     value: items.filter(i => i.status === 'draft').length,     color: '#737373' },
          { label: 'Approved',   value: items.filter(i => i.status === 'approved').length,   color: '#16a34a' },
          { label: 'Scheduled',  value: items.filter(i => i.status === 'scheduled').length,  color: '#2563eb' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3.5 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-model sections */}
      {MODELS.map(model => {
        const modelItems = items.filter(i => i.model === model.id);
        const isOpen = expanded[model.id] ?? true;
        return (
          <div key={model.id} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [model.id]: !isOpen }))}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.02] transition-colors"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${model.color}, ${model.color}99)` }}
              >
                {model.id.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-neutral-900">{model.label}</span>
                <span className="text-xs text-neutral-400 ml-2">{model.accounts.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">{modelItems.length} items</span>
                <div className="flex gap-1">
                  {(['draft','approved','scheduled','published'] as QueueStatus[]).map(st => {
                    const count = modelItems.filter(i => i.status === st).length;
                    if (!count) return null;
                    const c = STATUS_CONFIG[st];
                    return (
                      <span key={st} className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md', c.bg)} style={{ color: c.color }}>
                        {count} {c.label}
                      </span>
                    );
                  })}
                </div>
                {isOpen ? <ChevronDown size={14} className="text-neutral-400" /> : <ChevronRight size={14} className="text-neutral-400" />}
              </div>
            </button>
            {isOpen && modelItems.length > 0 && (
              <div className="p-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3" style={{ backgroundColor: '#fafafa' }}>
                {modelItems.map(item => <QueueCard key={item.id} item={item} />)}
              </div>
            )}
            {isOpen && modelItems.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-neutral-400" style={{ backgroundColor: '#fafafa' }}>
                No items in queue
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── By Model View ────────────────────────────────────────────────────────────
function ModelView({ items, selectedModel, onSelect }: {
  items: QueueItem[];
  selectedModel: string;
  onSelect: (m: string) => void;
}) {
  const model = MODELS.find(m => m.id === selectedModel) ?? MODELS[0];
  const modelItems = items.filter(i => i.model === selectedModel);

  // Group by account
  const accounts = [...new Set(modelItems.map(i => i.handle))];

  return (
    <div className="space-y-4">
      {/* Model selector */}
      <div className="flex items-center gap-2">
        {MODELS.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              selectedModel === m.id ? 'text-white shadow-sm' : 'text-neutral-500 bg-white hover:bg-neutral-50'
            )}
            style={{
              border: selectedModel === m.id ? 'none' : '1px solid rgba(0,0,0,0.09)',
              background: selectedModel === m.id ? `linear-gradient(135deg, ${m.color}, ${m.color}cc)` : undefined,
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
              style={{ backgroundColor: m.color }}
            >
              {m.id.slice(0, 2).toUpperCase()}
            </div>
            {m.label}
            <span className={cn('text-[10px] font-medium', selectedModel === m.id ? 'text-white/70' : 'text-neutral-400')}>
              {items.filter(i => i.model === m.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Model stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Items',  value: modelItems.length,                                        color: model.color },
          { label: 'Drafts',       value: modelItems.filter(i => i.status === 'draft').length,      color: '#737373' },
          { label: 'Approved',     value: modelItems.filter(i => i.status === 'approved').length,    color: '#16a34a' },
          { label: 'Scheduled',    value: modelItems.filter(i => i.status === 'scheduled').length,   color: '#2563eb' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3.5 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-account sections */}
      {accounts.map(handle => {
        const acctItems = modelItems.filter(i => i.handle === handle);
        const item0 = acctItems[0];
        return (
          <div key={handle}>
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: item0?.color }}
              >
                {item0?.initials}
              </div>
              <span className="text-sm font-semibold text-neutral-800">{handle}</span>
              <span className="text-xs text-neutral-400">{acctItems.length} items</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {acctItems.map(item => <QueueCard key={item.id} item={item} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── By Account View ──────────────────────────────────────────────────────────
function AccountView({ items }: { items: QueueItem[] }) {
  const handles = [...new Set(items.map(i => i.handle))];
  return (
    <div className="space-y-5">
      {handles.map(handle => {
        const acctItems = items.filter(i => i.handle === handle);
        const item0 = acctItems[0];
        return (
          <div key={handle}>
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${item0?.color}, ${item0?.color}99)` }}
              >
                {item0?.initials}
              </div>
              <span className="text-sm font-semibold text-neutral-800">{handle}</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${item0?.color}14`, color: item0?.color }}
              >
                {item0?.model}
              </span>
              <span className="text-xs text-neutral-400">{acctItems.length} items</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {acctItems.map(item => <QueueCard key={item.id} item={item} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export function QueueTab() {
  const [view, setView]               = useState<ViewMode>('agency');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModel, setSelectedModel] = useState('Tyler');

  const visible = QUEUE_ITEMS.filter(item =>
    statusFilter === 'all' || item.status === statusFilter
  );

  const VIEW_OPTIONS: { id: ViewMode; label: string }[] = [
    { id: 'agency',  label: 'Agency Pipeline' },
    { id: 'model',   label: 'By Model' },
    { id: 'account', label: 'By Account' },
  ];

  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* View toggle */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {VIEW_OPTIONS.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                view === v.id ? 'text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
              )}
              style={view === v.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                statusFilter === f.id
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-200'
              )}
              style={statusFilter === f.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* View content */}
      {view === 'agency'  && <AgencyView items={visible} />}
      {view === 'model'   && <ModelView items={visible} selectedModel={selectedModel} onSelect={setSelectedModel} />}
      {view === 'account' && <AccountView items={visible} />}

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-neutral-400">No items match this filter</p>
        </div>
      )}
    </div>
  );
}
