'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Film, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

function DrivePanel() {
  const [files, setFiles]     = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [preview, setPreview] = useState<DriveFile | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/drive/files');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch');
      setFiles(data.files);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-neutral-400" />
          <p className="text-sm font-semibold text-neutral-900">Drive - Generated Videos</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-400 font-medium">
            all/
          </span>
        </div>
        <button
          onClick={load}
          className="p-1.5 rounded-lg hover:bg-black/[0.05] text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-neutral-400">
          <RefreshCw size={14} className="animate-spin" />
          <span className="text-xs">Connecting to Drive...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-500">
          <AlertCircle size={13} />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {!loading && !error && files.length === 0 && (
        <p className="text-xs text-neutral-400 text-center py-6">No files in generated-videos/all/</p>
      )}

      {/* File grid */}
      {!loading && !error && files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map(f => (
            <button
              key={f.id}
              onClick={() => setPreview(f)}
              className="rounded-xl overflow-hidden text-left group transition-all hover:shadow-md"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              {/* Thumbnail */}
              <div
                className="relative flex items-center justify-center"
                style={{ height: 80, background: 'linear-gradient(160deg, #f3f4f6, #e9eaec)' }}
              >
                {f.thumbnailLink ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.thumbnailLink} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <Film size={20} className="text-neutral-300" strokeWidth={1.5} />
                )}
              </div>
              {/* Name */}
              <div className="px-2 py-1.5">
                <p className="text-[10px] text-neutral-600 font-medium truncate leading-tight">{f.name}</p>
                {f.createdTime && (
                  <p className="text-[9px] text-neutral-400 mt-0.5">
                    {new Date(f.createdTime).toLocaleDateString()}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Inline preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setPreview(null)}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ width: '90vw', maxWidth: 640, backgroundColor: '#ffffff' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <p className="text-sm font-semibold text-neutral-900 truncate flex-1 mr-3">{preview.name}</p>
              <button
                onClick={() => setPreview(null)}
                className="text-[11px] px-3 py-1 rounded-lg bg-black/[0.05] text-neutral-500 hover:bg-black/[0.08] transition-colors"
              >
                Close
              </button>
            </div>
            <video
              src={`/api/drive/stream/${preview.id}`}
              className="w-full"
              style={{ height: 360, backgroundColor: '#000' }}
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
}

const MODELS = [
  { id: 'all',   label: 'All Accounts', color: '#ff0069',  initials: 'AL' },
  { id: 'tyler', label: 'Tyler',        color: '#ff0069',  initials: 'TY' },
  { id: 'ren',   label: 'Ren',          color: '#833ab4',  initials: 'RN' },
  { id: 'ella',  label: 'Ella',         color: '#f77737',  initials: 'EL' },
];

// Posts indexed by day of month (April 2026)
const SCHEDULED_POSTS: Record<number, { model: string; color: string; time: string; label: string }[]> = {
  1:  [{ model: 'tyler', color: '#ff0069', time: '6:00 PM', label: 'Back Day Reel' }],
  2:  [{ model: 'ella',  color: '#f77737', time: '2:00 PM', label: 'Skincare Drop' }],
  3:  [{ model: 'ren',   color: '#833ab4', time: '10:00 AM', label: 'Sunday Reset' }],
  5:  [
    { model: 'tyler', color: '#ff0069', time: '7:00 AM', label: 'PR Week' },
    { model: 'ren',   color: '#833ab4', time: '6:00 PM', label: 'Milan BTS' },
  ],
  6:  [{ model: 'ella',  color: '#f77737', time: '6:00 PM', label: 'Morning Routine' }],
  8:  [{ model: 'tyler', color: '#ff0069', time: '8:30 PM', label: 'Chest Session' }],
  9:  [{ model: 'ren',   color: '#833ab4', time: '3:00 PM', label: 'Outfit Check' }],
  10: [{ model: 'ella',  color: '#f77737', time: '12:00 PM', label: 'Glow Tutorial' }],
  12: [
    { model: 'ella',  color: '#f77737', time: '9:00 AM', label: 'Collab Reveal' },
    { model: 'tyler', color: '#ff0069', time: '5:00 PM', label: 'Leg Day' },
  ],
  14: [{ model: 'ren',   color: '#833ab4', time: '11:00 AM', label: 'Weekend Vlog' }],
  15: [{ model: 'tyler', color: '#ff0069', time: '7:00 AM', label: 'Cardio Cut' }],
  17: [{ model: 'ella',  color: '#f77737', time: '2:00 PM', label: 'Haul Video' }],
  19: [{ model: 'ren',   color: '#833ab4', time: '6:00 PM', label: 'Aesthetic Edit' }],
  20: [
    { model: 'tyler', color: '#ff0069', time: '8:00 PM', label: 'Rest Day Reel' },
    { model: 'ella',  color: '#f77737', time: '4:00 PM', label: 'Night Routine' },
  ],
  22: [{ model: 'ren',   color: '#833ab4', time: '10:00 AM', label: 'Travel Prep' }],
  24: [{ model: 'tyler', color: '#ff0069', time: '7:00 AM', label: 'Pull Day' }],
  25: [{ model: 'ella',  color: '#f77737', time: '3:00 PM', label: 'Brand Shoot BTS' }],
  27: [{ model: 'ren',   color: '#833ab4', time: '12:00 PM', label: 'Q&A Reel' }],
  29: [
    { model: 'tyler', color: '#ff0069', time: '6:00 PM', label: 'Monthly Recap' },
    { model: 'ella',  color: '#f77737', time: '8:00 PM', label: 'April Faves' },
  ],
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// April 2026 starts on Wednesday (index 3)
const APRIL_START = 3;
const APRIL_DAYS = 30;

export function ScheduleTab() {
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedDay, setSelectedDay]     = useState<number | null>(null);

  const today = 6; // April 6 2026

  const calendarCells: (number | null)[] = [
    ...Array(APRIL_START).fill(null),
    ...Array.from({ length: APRIL_DAYS }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  function getPostsForDay(day: number) {
    const posts = SCHEDULED_POSTS[day] ?? [];
    if (selectedModel === 'all') return posts;
    return posts.filter(p => p.model === selectedModel);
  }

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="flex gap-4 p-4" style={{ backgroundColor: '#fafafa' }}>
      {/* Left: account selector */}
      <div
        className="w-48 flex-shrink-0 rounded-2xl p-3 space-y-1"
        style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', alignSelf: 'flex-start' }}
      >
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 px-2 pb-1">Accounts</p>
        {MODELS.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors text-left',
              selectedModel === m.id ? 'bg-black/[0.06] text-neutral-900' : 'text-neutral-500 hover:text-neutral-800 hover:bg-black/[0.03]'
            )}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              style={{ backgroundColor: m.color }}
            >
              {m.initials}
            </div>
            <span className="font-medium text-sm">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Right: calendar */}
      <div className="flex-1 space-y-3">
        {/* Month header */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          <button className="p-1 rounded-lg hover:bg-black/[0.05] text-neutral-400 hover:text-neutral-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-neutral-900">April 2026</span>
          <button className="p-1 rounded-lg hover:bg-black/[0.05] text-neutral-400 hover:text-neutral-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Calendar grid */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-black/[0.05]">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7">
            {calendarCells.map((day, i) => {
              const posts = day ? getPostsForDay(day) : [];
              const isToday = day === today;
              const isSelected = day === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                  className={cn(
                    'min-h-[72px] p-1.5 border-b border-r border-black/[0.04] transition-colors',
                    day ? 'cursor-pointer hover:bg-black/[0.02]' : '',
                    isSelected ? 'bg-black/[0.04]' : ''
                  )}
                >
                  {day && (
                    <>
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1',
                        isToday ? 'text-white' : 'text-neutral-600'
                      )}
                      style={isToday ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)' } : undefined}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {posts.slice(0, 2).map((post, pi) => (
                          <div
                            key={pi}
                            className="flex items-center gap-1 px-1 py-0.5 rounded-md text-[9px] font-medium truncate"
                            style={{ backgroundColor: `${post.color}18`, color: post.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: post.color }} />
                            <span className="truncate">{post.label}</span>
                          </div>
                        ))}
                        {posts.length > 2 && (
                          <p className="text-[9px] text-neutral-400 px-1">+{posts.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <p className="text-sm font-semibold text-neutral-900 mb-3">April {selectedDay} - {selectedDayPosts.length} post{selectedDayPosts.length !== 1 ? 's' : ''}</p>
            {selectedDayPosts.length === 0 ? (
              <p className="text-xs text-neutral-400">Nothing scheduled for this day.</p>
            ) : (
              <div className="space-y-2">
                {selectedDayPosts.map((post, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ backgroundColor: '#f9f9f9' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: post.color }} />
                    <span className="text-xs font-medium text-neutral-700 flex-1">{post.label}</span>
                    <span className="text-[11px] text-neutral-400">{post.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Drive content */}
        <DrivePanel />
      </div>
    </div>
  );
}
