'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  avatarColor: string;
  name: string;
  preview: string | null;
  dragging: boolean;
  active: boolean;
  onFileSelect: (file: File) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
}

export function PanelPreview({
  avatarColor, name, preview, dragging, active,
  onFileSelect, onDragOver, onDragLeave,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="h-28 relative flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: avatarColor }}
    >
      {preview ? (
        <img src={preview} alt="preview" className="w-full h-full object-cover" />
      ) : (
        <span className="text-5xl font-black text-white/50 select-none tracking-tight">
          {name ? name.slice(0, 2).toUpperCase() : '?'}
        </span>
      )}

      <button
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); onDragOver(); }}
        onDragLeave={onDragLeave}
        onDrop={e => {
          e.preventDefault();
          onDragLeave();
          const f = e.dataTransfer.files[0];
          if (f) onFileSelect(f);
        }}
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity cursor-pointer',
          dragging && 'opacity-100',
        )}
        style={{ background: 'rgba(0,0,0,0.35)' }}
      >
        <Upload size={18} className="text-white" />
        <span className="text-[11px] text-white font-medium">Upload photo</span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFileSelect(f); }}
      />

      <span
        className={cn(
          'absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white',
          active ? 'bg-emerald-400' : 'bg-neutral-300',
        )}
      />
    </div>
  );
}
