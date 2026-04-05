'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  CheckCircle, Clock, Send, AlertCircle, Video, Image, Layers,
  ChevronDown, X, RefreshCw, Check, Globe, MessageSquare, Hash,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ApprovalStatus = 'pending' | 'approved' | 'revision' | 'published';
type ContentType = 'Reel' | 'Post' | 'Story' | 'Carousel';
type Tab = 'pending' | 'approved' | 'rejected';

interface ApprovalItem {
  id: string;
  contentType: ContentType;
  account: string;
  accountColor: string;
  caption: string;
  hashtags: string[];
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  thumbnailGradient: string;
  thumbnailIcon: React.ReactNode;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const ITEMS: ApprovalItem[] = [
  {
    id: '1',
    contentType: 'Reel',
    account: '@abg.ricebunny',
    accountColor: '#ff0069',
    caption: 'Monday grind starts early. No excuses, just results. The gym opens at 5am and I\'m already there making moves before the world wakes up.',
    hashtags: ['#gymmotivation', '#gaybear', '#fitness', '#manila', '#earlybird'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 5, 2026',
    status: 'pending',
    thumbnailGradient: 'linear-gradient(135deg, #ff006914 0%, #fd1d1d14 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#ff0069' }} />,
  },
  {
    id: '2',
    contentType: 'Post',
    account: '@onlytylerrex',
    accountColor: '#fcaf45',
    caption: 'Post-workout glow. That feeling when everything just clicks into place. Consistency is the only hack you need.',
    hashtags: ['#postworkout', '#fitness', '#gymlife', '#results'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 4, 2026',
    status: 'pending',
    thumbnailGradient: 'linear-gradient(135deg, #fcaf4514 0%, #833ab414 100%)',
    thumbnailIcon: <Image className="w-6 h-6" style={{ color: '#fcaf45' }} />,
  },
  {
    id: '3',
    contentType: 'Carousel',
    account: '@rhinxrenx',
    accountColor: '#833ab4',
    caption: '5 ways to stay consistent with your fitness goals. Save this for your next reset week. Numbers 3 and 5 changed everything for me.',
    hashtags: ['#fitnessgoals', '#consistency', '#gymtips', '#motivation'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 4, 2026',
    status: 'approved',
    thumbnailGradient: 'linear-gradient(135deg, #833ab414 0%, #78c25714 100%)',
    thumbnailIcon: <Layers className="w-6 h-6" style={{ color: '#833ab4' }} />,
  },
  {
    id: '4',
    contentType: 'Story',
    account: '@ellamira',
    accountColor: '#78c257',
    caption: 'Chasing the golden hour. Some days the light is just perfect and you have to shoot. No plan, just vibes and a camera.',
    hashtags: ['#goldenhour', '#lifestyle', '#ootd', '#manilaph'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 3, 2026',
    status: 'revision',
    thumbnailGradient: 'linear-gradient(135deg, #78c25714 0%, #00f4e214 100%)',
    thumbnailIcon: <Globe className="w-6 h-6" style={{ color: '#78c257' }} />,
  },
  {
    id: '5',
    contentType: 'Reel',
    account: '@abg.ricebunny',
    accountColor: '#ff0069',
    caption: 'Transformation Tuesday. 12 weeks in. Same mirror, different energy. The discipline is starting to show.',
    hashtags: ['#transformationtuesday', '#fitness', '#progress', '#gym'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 3, 2026',
    status: 'published',
    thumbnailGradient: 'linear-gradient(135deg, #ff006914 0%, #833ab414 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#ff0069' }} />,
  },
  {
    id: '6',
    contentType: 'Post',
    account: '@onlytylerrex',
    accountColor: '#fcaf45',
    caption: 'Rest day ≠ lazy day. Active recovery, mobility work, and a proper meal prep session. Recovery is where the growth happens.',
    hashtags: ['#restday', '#recovery', '#mobility', '#mealprep'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Apr 2, 2026',
    status: 'published',
    thumbnailGradient: 'linear-gradient(135deg, #fcaf4514 0%, #ff006914 100%)',
    thumbnailIcon: <Image className="w-6 h-6" style={{ color: '#fcaf45' }} />,
  },
  {
    id: '7',
    contentType: 'Carousel',
    account: '@rhinxrenx',
    accountColor: '#833ab4',
    caption: 'What I eat in a day as a gym guy. Full transparency — no bullshit, no cheat meals, just real food that fuels real results.',
    hashtags: ['#whatieat', '#gymfood', '#nutrition', '#bodybuilding'],
    submittedBy: 'VA Mikee',
    submittedAt: 'Apr 1, 2026',
    status: 'approved',
    thumbnailGradient: 'linear-gradient(135deg, #833ab414 0%, #fd1d1d14 100%)',
    thumbnailIcon: <Layers className="w-6 h-6" style={{ color: '#833ab4' }} />,
  },
  {
    id: '8',
    contentType: 'Reel',
    account: '@ellamira',
    accountColor: '#78c257',
    caption: 'Sunset shoot at the rooftop. When the city lights up and you\'ve got the whole view to yourself. This is the lifestyle.',
    hashtags: ['#sunset', '#lifestyle', '#rooftop', '#manila', '#vibes'],
    submittedBy: 'VA Yssa',
    submittedAt: 'Mar 31, 2026',
    status: 'revision',
    thumbnailGradient: 'linear-gradient(135deg, #78c25714 0%, #fcaf4514 100%)',
    thumbnailIcon: <Video className="w-6 h-6" style={{ color: '#78c257' }} />,
  },
];

const ACCOUNTS = ['All Accounts', '@abg.ricebunny', '@onlytylerrex', '@rhinxrenx', '@ellamira'];

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',        color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.18)'   },
  approved:  { label: 'Approved',       color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.18)'   },
  revision:  { label: 'Needs Revision', color: '#ea580c', bg: 'rgba(234,88,12,0.08)',   border: 'rgba(234,88,12,0.18)'   },
  published: { label: 'Published',      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.18)'  },
};

const CONTENT_TYPE_ICON: Record<ContentType, React.ReactNode> = {
  Reel:     <Video size={11} />,
  Post:     <Image size={11} />,
  Story:    <Globe size={11} />,
  Carousel: <Layers size={11} />,
};

// ─── Mini Stat Row ─────────────────────────────────────────────────────────────

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl flex-1"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ backgroundColor: color + '14', color }}
      >
        {value}
      </div>
      <span className="text-xs text-neutral-500 font-medium leading-tight">{label}</span>
    </div>
  );
}

// ─── Approval Card ─────────────────────────────────────────────────────────────

function ApprovalCard({
  item,
  onOpen,
}: {
  item: ApprovalItem;
  onOpen: (item: ApprovalItem) => void;
}) {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl overflow-hidden cursor-pointer group"
      style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fff' }}
      onClick={() => onOpen(item)}
    >
      {/* Thumbnail */}
      <div
        className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
        style={{ background: item.thumbnailGradient }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors" />

        {/* Content type badge */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#525252', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          {CONTENT_TYPE_ICON[item.contentType]}
          {item.contentType}
        </div>

        {/* Account badge */}
        <div
          className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{ backgroundColor: item.accountColor + '18', color: item.accountColor, border: `1px solid ${item.accountColor}30` }}
        >
          {item.account}
        </div>

        {/* Centre icon */}
        <div>{item.thumbnailIcon}</div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <p className="text-sm text-neutral-800 leading-snug line-clamp-2 mb-2.5">{item.caption}</p>

        <div className="flex items-center gap-1.5 mb-3 text-[11px] text-neutral-400">
          <span>{item.submittedBy}</span>
          <span>·</span>
          <span>{item.submittedAt}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-semibold"
            style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            {cfg.label}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={e => { e.stopPropagation(); onOpen(item); }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            >
              Review
            </button>
            <button
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-black/[0.04]"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <RefreshCw size={11} className="text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({
  item,
  onClose,
  onStatusChange,
}: {
  item: ApprovalItem | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ApprovalStatus) => void;
}) {
  const [revisionComment, setRevisionComment] = useState('');
  const [showRevisionField, setShowRevisionField] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!item) return null;

  const cfg = STATUS_CONFIG[item.status];

  const handleAction = (action: string) => {
    if (action === 'publish') {
      onStatusChange(item.id, 'published');
    } else if (action === 'approve') {
      onStatusChange(item.id, 'approved');
    } else if (action === 'revision') {
      if (!showRevisionField) { setShowRevisionField(true); return; }
      if (!revisionComment.trim()) return;
      onStatusChange(item.id, 'revision');
    }
    setActionDone(action);
    setTimeout(() => { onClose(); setActionDone(null); setShowRevisionField(false); setRevisionComment(''); }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden pointer-events-auto"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.accountColor + '14', border: `1px solid ${item.accountColor}28` }}
              >
                <div style={{ color: item.accountColor }}>{item.thumbnailIcon}</div>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.account}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[11px] text-neutral-400">{item.contentType} · {item.submittedAt}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/[0.04]"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <X size={14} className="text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Preview */}
            <div
              className="aspect-video rounded-xl flex items-center justify-center"
              style={{ background: item.thumbnailGradient, border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div className="flex flex-col items-center gap-2 text-neutral-400">
                {item.thumbnailIcon}
                <span className="text-xs font-medium">{item.contentType} Preview</span>
              </div>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageSquare size={12} className="text-neutral-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Caption</span>
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">{item.caption}</p>
            </div>

            {/* Hashtags */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Hash size={12} className="text-neutral-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.hashtags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-neutral-500"
                    style={{ backgroundColor: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Revision textarea */}
            <AnimatePresence>
              {showRevisionField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <textarea
                    value={revisionComment}
                    onChange={e => setRevisionComment(e.target.value)}
                    placeholder="Describe what needs to change..."
                    className="w-full px-3.5 py-3 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 resize-none outline-none transition-all"
                    style={{ backgroundColor: '#fafafa', border: '1px solid rgba(234,88,12,0.25)' }}
                    rows={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submitted by */}
            <p className="text-[11px] text-neutral-400">
              Submitted by <span className="font-semibold text-neutral-600">{item.submittedBy}</span> · {item.submittedAt}
            </p>

            {/* Actions */}
            <AnimatePresence mode="wait">
              {!actionDone ? (
                <motion.div key="actions" className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleAction('publish')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                  >
                    <Check size={14} />
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => handleAction('approve')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-105"
                    style={{ backgroundColor: 'rgba(22,163,74,0.08)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction('revision')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-105"
                    style={{ backgroundColor: 'rgba(234,88,12,0.08)', color: '#ea580c', border: '1px solid rgba(234,88,12,0.18)' }}
                  >
                    <RefreshCw size={14} />
                    {showRevisionField ? 'Send Revision' : 'Request Revision'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.18)' }}
                >
                  <Check size={16} style={{ color: '#16a34a' }} />
                  <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>Done!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <CheckCircle size={24} className="text-neutral-300" />
      </div>
      <p className="text-sm font-medium text-neutral-500">Nothing here</p>
      <p className="text-xs text-neutral-400 mt-0.5">No items match the current filters</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApprovalsFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('All Accounts');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [items, setItems] = useState(ITEMS);

  const counts = {
    pending:          items.filter(i => i.status === 'pending').length,
    awaitingClient:   items.filter(i => i.status === 'revision').length,
    approvedToday:    items.filter(i => i.status === 'approved').length,
    publishedThisWeek: items.filter(i => i.status === 'published').length,
  };

  const filtered = items.filter(item => {
    const tabMatch =
      activeTab === 'pending'  ? item.status === 'pending' || item.status === 'revision' :
      activeTab === 'approved' ? item.status === 'approved' :
      item.status === 'published';
    const typeMatch =
      activeFilter === 'all' ? true :
      item.contentType.toLowerCase() === activeFilter;
    const accountMatch =
      selectedAccount === 'All Accounts' ? true :
      item.account === selectedAccount;
    return tabMatch && typeMatch && accountMatch;
  });

  const handleStatusChange = (id: string, status: ApprovalStatus) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <>
      <ContentPageShell
        icon={<ProductIcon product="hub" size={32} />}
        title="Approvals"
        stat={{ label: 'Pending', value: counts.pending }}
        searchPlaceholder="Search clips, models..."
        actionLabel="Review All"
        actionIcon={<CheckCircle size={14} />}
        tabs={[
          { id: 'pending',  label: 'Pending',  icon: <Clock size={13} /> },
          { id: 'approved', label: 'Approved', icon: <CheckCircle size={13} /> },
          { id: 'rejected', label: 'Published', icon: <Send size={13} /> },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as Tab)}
        filterChips={[
          { id: 'all',      label: 'All' },
          { id: 'reel',     label: 'Reels' },
          { id: 'post',     label: 'Posts' },
          { id: 'story',    label: 'Stories' },
          { id: 'carousel', label: 'Carousels' },
        ]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      >
        <div className="p-4 space-y-4">

          {/* Mini stat row */}
          <div className="flex gap-3">
            <MiniStat label="Pending Review"    value={counts.pending}           color="#d97706" />
            <MiniStat label="Awaiting Client"   value={counts.awaitingClient}    color="#ff0069" />
            <MiniStat label="Approved Today"    value={counts.approvedToday}     color="#16a34a" />
            <MiniStat label="Published This Week" value={counts.publishedThisWeek} color="#7c3aed" />
          </div>

          {/* Account filter + item count */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium text-neutral-700 outline-none cursor-pointer"
                style={{ backgroundColor: '#fafafa', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            <span className="text-xs text-neutral-400">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map(item => (
                  <ApprovalCard
                    key={item.id}
                    item={item}
                    onOpen={setSelectedItem}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </ContentPageShell>

      {/* Modal — outside ContentPageShell so it overlays everything */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </>
  );
}
