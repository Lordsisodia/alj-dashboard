'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, X, ChevronDown, MessageSquare, Send, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

type ApprovalStatus = 'pending' | 'awaiting_client' | 'approved' | 'revision' | 'published';
type ContentType = 'Reel' | 'Story' | 'Carousel' | 'Post';

interface Approval {
  id: string;
  model: string;
  modelColor: string;
  initials: string;
  handle: string;
  color: string;
  contentType: ContentType;
  caption: string;
  tags: string[];
  scheduledFor: string;
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  notes?: string;
}

const APPROVALS: Approval[] = [
  {
    id: 'ap1', model: 'Ella', modelColor: '#f77737', initials: 'EL', handle: '@ella.creates', color: '#f77737',
    contentType: 'Reel', status: 'pending',
    caption: 'The glow-up is real and it starts with your skincare order 💆‍♀️ Swipe to see the full routine and grab the link in bio for 20% off.',
    tags: ['#skincare', '#beauty', '#glowup', '#routine', '#selfcare'],
    scheduledFor: 'Tomorrow, 2:00 PM',
    submittedBy: 'Mikee Santos', submittedAt: '1h ago',
    notes: 'Caption approved by Ella, needs final sign-off before scheduling.',
  },
  {
    id: 'ap2', model: 'Ren', modelColor: '#833ab4', initials: 'RN', handle: '@ren.official', color: '#833ab4',
    contentType: 'Post', status: 'pending',
    caption: 'Sunday reset looking like this. Coffee, candles, and zero plans 🕯️ Drop your fave Sunday ritual below 👇',
    tags: ['#lifestyle', '#sunday', '#aesthetic', '#selfcare', '#reset'],
    scheduledFor: 'Tomorrow, 10:00 AM',
    submittedBy: 'Yssa Reyes', submittedAt: '2h ago',
  },
  {
    id: 'ap3', model: 'Tyler', modelColor: '#ff0069', initials: 'TY', handle: '@tyler.isso', color: '#ff0069',
    contentType: 'Reel', status: 'awaiting_client',
    caption: 'PR week incoming 📈 New maxes every session this week. Let\'s get it 💪',
    tags: ['#fitness', '#gains', '#pr', '#gym', '#grind'],
    scheduledFor: 'Wed, 7:00 AM',
    submittedBy: 'Mikee Santos', submittedAt: '3h ago',
    notes: 'Tyler wants to review the thumbnail before approving.',
  },
  {
    id: 'ap4', model: 'Ella', modelColor: '#f77737', initials: 'EL', handle: '@ella.creates', color: '#f77737',
    contentType: 'Carousel', status: 'approved',
    caption: 'My top 5 products that actually changed my skin this year 🌟',
    tags: ['#skincare', '#beauty', '#review', '#top5'],
    scheduledFor: 'Thu, 3:00 PM',
    submittedBy: 'Yssa Reyes', submittedAt: '5h ago',
  },
  {
    id: 'ap5', model: 'Ren', modelColor: '#833ab4', initials: 'RN', handle: '@ren.official', color: '#833ab4',
    contentType: 'Story', status: 'revision',
    caption: 'Behind the scenes of today\'s shoot 📸',
    tags: ['#bts', '#lifestyle', '#shoot'],
    scheduledFor: 'Today, 5:00 PM',
    submittedBy: 'Mikee Santos', submittedAt: '6h ago',
    notes: 'Needs brighter exposure on the main shot.',
  },
  {
    id: 'ap6', model: 'Tyler', modelColor: '#ff0069', initials: 'TY', handle: '@tyler.isso', color: '#ff0069',
    contentType: 'Post', status: 'published',
    caption: 'Rest day reel - because recovery is part of the process 🧘',
    tags: ['#recovery', '#fitness', '#mindset', '#rest'],
    scheduledFor: 'Yesterday, 3:00 PM',
    submittedBy: 'Yssa Reyes', submittedAt: '1d ago',
  },
];

const CONTENT_TYPES: ContentType[] = ['Reel', 'Story', 'Carousel', 'Post'];

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending:         { label: 'Pending Review',  color: '#d97706', bg: '#fef3c7' },
  awaiting_client: { label: 'Awaiting Client', color: '#2563eb', bg: '#dbeafe' },
  approved:        { label: 'Approved',        color: '#16a34a', bg: '#dcfce7' },
  revision:        { label: 'Needs Revision',  color: '#dc2626', bg: '#fee2e2' },
  published:       { label: 'Published',       color: '#7c3aed', bg: '#ede9fe' },
};

const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
  Reel:     '#ff0069',
  Story:    '#833ab4',
  Carousel: '#f77737',
  Post:     '#0ea5e9',
};

const FILTER_TABS = [
  { id: 'all',             label: 'All' },
  { id: 'pending',         label: 'Pending' },
  { id: 'awaiting_client', label: 'Awaiting Client' },
  { id: 'approved',        label: 'Approved' },
  { id: 'revision',        label: 'Revisions' },
  { id: 'published',       label: 'Published' },
];

const MODELS = [
  { id: 'all',   label: 'All Models', color: undefined },
  { id: 'Tyler', label: 'Tyler',  color: '#ff0069' },
  { id: 'Ren',   label: 'Ren',    color: '#833ab4' },
  { id: 'Ella',  label: 'Ella',   color: '#f77737' },
];

// ── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose, onAction }: {
  item: Approval;
  onClose: () => void;
  onAction: (id: string, action: 'approve_publish' | 'approve' | 'revision' | 'reject') => void;
}) {
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevision, setShowRevision] = useState(false);
  const s = STATUS_CONFIG[item.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
        style={{ backgroundColor: '#ffffff', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
            >
              {item.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{item.handle}</p>
              <p className="text-[11px] text-neutral-400">{item.scheduledFor}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              {s.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.05] transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Thumbnail preview area */}
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: 200,
              background: 'linear-gradient(160deg, #f3f4f6, #e5e7eb)',
            }}
          >
            <div className="flex flex-col items-center gap-2 text-neutral-300">
              <Image size={32} strokeWidth={1.5} />
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: CONTENT_TYPE_COLORS[item.contentType] }}
              >
                {item.contentType}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Caption */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">Caption</p>
              <p className="text-sm text-neutral-700 leading-relaxed">{item.caption}</p>
            </div>

            {/* Hashtags */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">Hashtags</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${item.color}14`, color: item.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ backgroundColor: '#fffbeb', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <MessageSquare size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{item.notes}</p>
              </div>
            )}

            {/* Submitter */}
            <p className="text-[11px] text-neutral-400">
              Submitted by <span className="font-semibold text-neutral-600">{item.submittedBy}</span> · {item.submittedAt}
            </p>

            {/* Revision textarea */}
            {showRevision && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">Revision Note</p>
                <textarea
                  value={revisionNote}
                  onChange={e => setRevisionNote(e.target.value)}
                  placeholder="Describe what needs to be changed..."
                  rows={3}
                  className="w-full text-sm text-neutral-700 placeholder-neutral-300 rounded-xl p-3 resize-none outline-none"
                  style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fafafa' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 pt-3 grid grid-cols-2 gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => { onAction(item.id, 'approve_publish'); onClose(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
          >
            <Send size={13} /> Approve & Publish
          </button>
          <button
            onClick={() => { onAction(item.id, 'approve'); onClose(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <CheckCircle2 size={13} /> Approve
          </button>
          <button
            onClick={() => setShowRevision(!showRevision)}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              showRevision ? 'bg-amber-50 text-amber-700' : 'text-neutral-600 hover:bg-black/[0.05]'
            )}
            style={{ border: showRevision ? '1px solid rgba(217,119,6,0.3)' : '1px solid rgba(0,0,0,0.09)' }}
          >
            <MessageSquare size={13} /> Request Revision
          </button>
          <button
            onClick={() => { onAction(item.id, 'reject'); onClose(); }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <XCircle size={13} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Approval Card ─────────────────────────────────────────────────────────────
function ApprovalCard({ item, onClick }: { item: Approval; onClick: () => void }) {
  const s = STATUS_CONFIG[item.status];
  const actionable = item.status === 'pending' || item.status === 'awaiting_client';

  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md flex flex-col"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderLeft: `3px solid ${item.color}`,
      }}
    >
      {/* Thumbnail - neutral placeholder, no big color block */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 120,
          background: 'linear-gradient(160deg, #f3f4f6, #e9eaec)',
        }}
      >
        <Image size={24} className="text-neutral-300" strokeWidth={1.5} />
        {/* Content type */}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
          style={{ backgroundColor: CONTENT_TYPE_COLORS[item.contentType] }}
        >
          {item.contentType}
        </span>
        {/* Status */}
        <span
          className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: s.bg, color: s.color }}
        >
          {s.label}
        </span>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Account row */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}
          >
            {item.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 truncate">{item.handle}</p>
          </div>
          <span className="text-[10px] text-neutral-400 flex-shrink-0">{item.submittedAt}</span>
        </div>

        {/* Caption */}
        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">{item.caption}</p>

        {/* Schedule */}
        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
          <Clock size={9} />
          {item.scheduledFor}
        </div>

        {/* Quick actions */}
        {actionable && (
          <div className="flex gap-1.5 pt-0.5">
            <button
              onClick={e => e.stopPropagation()}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:brightness-105"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              Approve
            </button>
            <button
              onClick={e => e.stopPropagation()}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-500 hover:bg-black/[0.05] transition-colors"
              style={{ border: '1px solid rgba(0,0,0,0.09)' }}
            >
              Revision
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function ApprovalsTab() {
  const [filterTab,     setFilterTab]     = useState('all');
  const [modelFilter,   setModelFilter]   = useState('all');
  const [typeFilter,    setTypeFilter]    = useState<ContentType | 'all'>('all');
  const [selected,      setSelected]      = useState<Approval | null>(null);
  const [statuses,      setStatuses]      = useState<Record<string, ApprovalStatus>>({});
  const [showTypeMenu,  setShowTypeMenu]  = useState(false);

  function getStatus(item: Approval): ApprovalStatus {
    return statuses[item.id] ?? item.status;
  }

  function handleAction(id: string, action: 'approve_publish' | 'approve' | 'revision' | 'reject') {
    const map: Record<string, ApprovalStatus> = {
      approve_publish: 'published',
      approve:         'approved',
      revision:        'revision',
      reject:          'revision',
    };
    setStatuses(prev => ({ ...prev, [id]: map[action] }));
  }

  const visible = APPROVALS.filter(item => {
    const status = getStatus(item);
    const byTab   = filterTab   === 'all' || status === filterTab;
    const byModel = modelFilter === 'all' || item.model === modelFilter;
    const byType  = typeFilter  === 'all' || item.contentType === typeFilter;
    return byTab && byModel && byType;
  });

  const stats = [
    { label: 'Pending Review',  value: APPROVALS.filter(a => getStatus(a) === 'pending').length,          color: '#d97706' },
    { label: 'Awaiting Client', value: APPROVALS.filter(a => getStatus(a) === 'awaiting_client').length,   color: '#2563eb' },
    { label: 'Approved Today',  value: APPROVALS.filter(a => getStatus(a) === 'approved').length,          color: '#16a34a' },
    { label: 'Published',       value: APPROVALS.filter(a => getStatus(a) === 'published').length,         color: '#7c3aed' },
  ];

  return (
    <div className="p-4 space-y-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-3.5 text-center"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Model tabs */}
      <div className="flex items-center gap-1.5">
        {MODELS.map(m => (
          <button
            key={m.id}
            onClick={() => setModelFilter(m.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              modelFilter === m.id
                ? 'text-white shadow-sm'
                : 'text-neutral-400 bg-white hover:text-neutral-600 border border-neutral-200'
            )}
            style={modelFilter === m.id
              ? { background: m.color ? `linear-gradient(135deg, ${m.color}, ${m.color}cc)` : 'linear-gradient(135deg, #ff0069, #833ab4)' }
              : undefined
            }
          >
            {m.color && (
              <div
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: modelFilter === m.id ? 'rgba(255,255,255,0.4)' : m.color }}
              />
            )}
            {m.label}
            <span className={cn('text-[10px]', modelFilter === m.id ? 'text-white/70' : 'text-neutral-300')}>
              {m.id === 'all' ? APPROVALS.length : APPROVALS.filter(a => a.model === m.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Status tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_TABS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilterTab(f.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterTab === f.id
                  ? 'text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-200'
              )}
              style={filterTab === f.id ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.09)' }}
          >
            {typeFilter === 'all' ? 'All Types' : typeFilter}
            <ChevronDown size={11} />
          </button>
          {showTypeMenu && (
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-20 py-1"
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 130 }}
            >
              <button
                onClick={() => { setTypeFilter('all'); setShowTypeMenu(false); }}
                className={cn('w-full text-left px-3 py-2 text-xs transition-colors', typeFilter === 'all' ? 'font-semibold text-neutral-900 bg-black/[0.03]' : 'text-neutral-600 hover:bg-black/[0.03]')}
              >
                All Types
              </button>
              {CONTENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setShowTypeMenu(false); }}
                  className={cn('w-full text-left px-3 py-2 text-xs transition-colors', typeFilter === t ? 'font-semibold text-neutral-900 bg-black/[0.03]' : 'text-neutral-600 hover:bg-black/[0.03]')}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {visible.map(item => {
            const live = { ...item, status: getStatus(item) };
            return (
              <ApprovalCard
                key={item.id}
                item={live}
                onClick={() => setSelected(live)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mb-3" />
          <p className="text-sm font-medium text-neutral-600">All caught up</p>
          <p className="text-xs text-neutral-400 mt-1">No content matches this filter</p>
        </div>
      )}

      {selected && (
        <DetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
