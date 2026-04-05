'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { ProductIcon } from '@/isso/layout/ProductIcon';
import {
  Upload, HardDrive, CheckCircle, CloudUpload, Play,
  FileVideo, Check, Zap,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'upload' | 'library' | 'delivered';

type ClipStatus = 'Raw' | 'Enhanced' | 'In Pipeline';

interface Enhancement {
  id: string;
  label: string;
  color: string;
  bg: string;
}

interface ClipData {
  id: string;
  filename: string;
  size: string;
  duration: string;
  status: ClipStatus;
  gradient: string;
  enhancements: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ENHANCEMENTS: Enhancement[] = [
  { id: 'stabilize', label: 'Stabilize',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'color',     label: 'Color',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'denoise',   label: 'Denoise',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  { id: 'sharpen',   label: 'Sharpen',    color: '#833ab4', bg: 'rgba(131,58,180,0.1)' },
  { id: 'upscale',   label: 'Upscale',    color: '#ff0069', bg: 'rgba(255,0,105,0.1)'  },
];

const ENHANCEMENT_MAP: Record<string, Enhancement> = Object.fromEntries(
  ENHANCEMENTS.map(e => [e.id, e])
);

const SEED_CLIPS: ClipData[] = [
  {
    id: 'c1',
    filename: 'tyler_gym_easter_01.mp4',
    size: '124 MB',
    duration: '0:32',
    status: 'In Pipeline',
    gradient: 'linear-gradient(135deg, #ff0069 0%, #833ab4 100%)',
    enhancements: ['stabilize', 'color', 'sharpen'],
  },
  {
    id: 'c2',
    filename: 'ren_mirror_flex.mp4',
    size: '87 MB',
    duration: '0:18',
    status: 'Enhanced',
    gradient: 'linear-gradient(135deg, #833ab4 0%, #06b6d4 100%)',
    enhancements: ['color', 'denoise', 'upscale'],
  },
  {
    id: 'c3',
    filename: 'ella_bunny_ears.mp4',
    size: '210 MB',
    duration: '0:45',
    status: 'In Pipeline',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
    enhancements: ['stabilize', 'color', 'denoise', 'sharpen'],
  },
  {
    id: 'c4',
    filename: 'amam_songkran_raw.mp4',
    size: '356 MB',
    duration: '1:02',
    status: 'Raw',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ff0069 100%)',
    enhancements: [],
  },
  {
    id: 'c5',
    filename: 'tyler_easter_gym_02.mp4',
    size: '98 MB',
    duration: '0:28',
    status: 'Enhanced',
    gradient: 'linear-gradient(135deg, #ff0069 0%, #f59e0b 100%)',
    enhancements: ['stabilize', 'sharpen'],
  },
  {
    id: 'c6',
    filename: 'ren_diet_before_after.mp4',
    size: '143 MB',
    duration: '0:39',
    status: 'Raw',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #833ab4 100%)',
    enhancements: [],
  },
];

const STATUS_STYLE: Record<ClipStatus, { color: string; bg: string }> = {
  Raw:         { color: '#737373', bg: 'rgba(0,0,0,0.06)'     },
  Enhanced:    { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'  },
  'In Pipeline': { color: '#ff0069', bg: 'rgba(255,0,105,0.1)' },
};

// ── Upload Dropzone ───────────────────────────────────────────────────────────

function UploadDropzone() {
  const [dragOver, setDragOver] = useState(false);
  const [queued, setQueued] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map(f => f.name);
    setQueued(prev => [...prev, ...names]);
  };

  return (
    <div className="p-5">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-xl flex flex-col items-center justify-center py-16 px-6 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragOver ? '#ff0069' : 'rgba(0,0,0,0.13)'}`,
          backgroundColor: dragOver ? 'rgba(255,0,105,0.03)' : '#fafafa',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.mov,.avi,video/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {/* Cloud icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          <CloudUpload size={26} className="text-white" />
        </div>

        <p className="text-sm font-semibold text-neutral-800 mb-1">
          Drag &amp; drop video clips here
        </p>
        <p className="text-xs text-neutral-400 mb-4">MP4, MOV, AVI · up to 4K</p>

        <button
          onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        >
          Browse files
        </button>
      </div>

      {/* AI enhancement note */}
      <div
        className="mt-4 flex items-start gap-3 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(255,0,105,0.04)', border: '1px solid rgba(255,0,105,0.12)' }}
      >
        <Zap size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#ff0069' }} />
        <div>
          <p className="text-xs font-semibold text-neutral-800">AI Enhancement included</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            Uploaded clips are automatically stabilized, color-corrected, denoised and sharpened before entering the editing pipeline.
          </p>
        </div>
      </div>

      {/* Queued files */}
      {queued.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Queued ({queued.length})
          </p>
          {queued.map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <FileVideo size={14} className="text-neutral-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-neutral-700 truncate">{name}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
              >
                Queued
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Enhancement badge ─────────────────────────────────────────────────────────

function EnhancementBadge({ id }: { id: string }) {
  const e = ENHANCEMENT_MAP[id];
  if (!e) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: e.bg, color: e.color }}
    >
      {e.label}
    </span>
  );
}

// ── Clip card ─────────────────────────────────────────────────────────────────

function ClipCard({ clip, index }: { clip: ClipData; index: number }) {
  const [selected, setSelected] = useState<string[]>(clip.enhancements);
  const statusStyle = STATUS_STYLE[clip.status];

  const toggleEnhancement = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video relative flex items-center justify-center"
        style={{ background: clip.gradient }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
        >
          <Play size={14} className="text-white" fill="white" />
        </div>
        {/* Duration */}
        <span
          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          {clip.duration}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Filename + status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-neutral-800 truncate flex-1" title={clip.filename}>
            {clip.filename}
          </p>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
          >
            {clip.status}
          </span>
        </div>

        {/* File size */}
        <p className="text-[11px] text-neutral-400 mb-2">{clip.size}</p>

        {/* Applied enhancements */}
        {clip.enhancements.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {clip.enhancements.map(id => (
              <EnhancementBadge key={id} id={id} />
            ))}
          </div>
        )}

        {/* Enhancement checkboxes */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {ENHANCEMENTS.map(e => (
            <label key={e.id} className="flex items-center gap-1.5 cursor-pointer">
              <div
                onClick={() => toggleEnhancement(e.id)}
                className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border transition-colors cursor-pointer"
                style={{
                  backgroundColor: selected.includes(e.id) ? e.color : 'transparent',
                  borderColor: selected.includes(e.id) ? e.color : 'rgba(0,0,0,0.2)',
                }}
              >
                {selected.includes(e.id) && <Check size={8} className="text-white" />}
              </div>
              <span className="text-[10px] text-neutral-600">{e.label}</span>
            </label>
          ))}
        </div>

        {/* Enhance button */}
        {clip.status === 'Raw' && (
          <button
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:brightness-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            <Zap size={11} />
            Enhance
          </button>
        )}

        {clip.status === 'Enhanced' && (
          <div
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: 'rgba(34,197,94,0.08)', color: '#16a34a' }}
          >
            <Check size={11} />
            Enhanced
          </div>
        )}

        {clip.status === 'In Pipeline' && (
          <div
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: 'rgba(255,0,105,0.07)', color: '#ff0069' }}
          >
            <Zap size={11} />
            In Pipeline
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Library view ──────────────────────────────────────────────────────────────

function LibraryView({ activeFilter }: { activeFilter: string }) {
  const filtered = SEED_CLIPS.filter(c => {
    if (activeFilter === 'reels') return c.status === 'Raw';
    if (activeFilter === 'posts') return c.status === 'Enhanced';
    if (activeFilter === 'carousels') return c.status === 'In Pipeline';
    return true;
  });

  return (
    <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {filtered.map((clip, i) => (
        <ClipCard key={clip.id} clip={clip} index={i} />
      ))}
    </div>
  );
}

// ── Delivered view ────────────────────────────────────────────────────────────

function DeliveredView() {
  const delivered = [
    { filename: 'tyler_gym_easter_final.mp4', model: 'Tyler', deliveredAt: 'Apr 4', size: '97 MB' },
    { filename: 'ren_chocolate_face_final.mp4', model: 'Ren', deliveredAt: 'Apr 4', size: '81 MB' },
    { filename: 'ella_bunny_ears_final.mp4', model: 'Ella', deliveredAt: 'Apr 4', size: '203 MB' },
    { filename: 'amam_easter_bunny_final.mp4', model: 'Amam', deliveredAt: 'Apr 5', size: '118 MB' },
  ];

  return (
    <div className="p-4 space-y-2">
      {delivered.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
          >
            <CheckCircle size={16} style={{ color: '#22c55e' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{item.filename}</p>
            <p className="text-[11px] text-neutral-400">{item.model} · {item.size}</p>
          </div>
          <span className="text-[11px] text-neutral-400 flex-shrink-0">{item.deliveredAt}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContentFeaturePage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <ContentPageShell
      icon={<ProductIcon product="content-gen" size={32} />}
      title="Content"
      stat={{ label: 'Clips in library', value: 47 }}
      searchPlaceholder="Search clips, models..."
      actionLabel="Upload"
      actionIcon={<Upload size={14} />}
      tabs={[
        { id: 'upload',    label: 'Upload',    icon: <Upload size={13} /> },
        { id: 'library',   label: 'Library',   icon: <HardDrive size={13} /> },
        { id: 'delivered', label: 'Delivered', icon: <CheckCircle size={13} /> },
      ]}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as Tab)}
      filterChips={[
        { id: 'all',       label: 'All' },
        { id: 'reels',     label: 'Reels' },
        { id: 'posts',     label: 'Posts' },
        { id: 'carousels', label: 'Carousels' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      showViewToggle
    >
      {activeTab === 'upload' && <UploadDropzone />}
      {activeTab === 'library' && <LibraryView activeFilter={activeFilter} />}
      {activeTab === 'delivered' && <DeliveredView />}
    </ContentPageShell>
  );
}
