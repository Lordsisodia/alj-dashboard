'use client';

import { useState, useRef } from 'react';
import { CloudUpload, FileVideo, Zap } from 'lucide-react';

export function UploadDropzone() {
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
