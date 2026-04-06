'use client';

import { ImagePlus, X } from 'lucide-react';

interface Props {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export function FaceRefUpload({ images, onUpload, onRemove }: Props) {
  if (images.length === 0) {
    return (
      <label
        className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl cursor-pointer hover:brightness-[0.97] transition-all"
        style={{ backgroundColor: '#f5f5f4', border: '1.5px dashed rgba(0,0,0,0.12)' }}
      >
        <ImagePlus size={16} className="text-neutral-300 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-neutral-500">Upload face reference</p>
          <p className="text-[10px] text-neutral-400">JPG, PNG, WEBP · Used for face compositing</p>
        </div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
      </label>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {images.map((src, i) => (
        <div key={i} className="relative group w-14 rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`ref-${i}`} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(i)}
            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded-full transition-all"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          >
            <X size={8} className="text-white" />
          </button>
        </div>
      ))}
      <label
        className="w-14 aspect-square rounded-xl flex items-center justify-center cursor-pointer hover:brightness-[0.97] transition-all"
        style={{ backgroundColor: '#f5f5f4', border: '1.5px dashed rgba(0,0,0,0.12)' }}
      >
        <ImagePlus size={14} className="text-neutral-300" />
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
      </label>
    </div>
  );
}
