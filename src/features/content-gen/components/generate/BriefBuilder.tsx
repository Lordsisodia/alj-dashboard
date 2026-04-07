'use client';

import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';
import type { ConvexModel, Generator, Style } from './types';
import { generatorMeta, fmtEta } from './types';
import { TalentPicker } from './TalentPicker';
import { GeneratorPills } from './GeneratorPills';
import { StyleChips } from './StyleChips';
import { FaceRefUpload } from './FaceRefUpload';

interface Props {
  models: ConvexModel[];
  selectedModelId: Id<'models'> | null;
  selectedModel: ConvexModel | undefined;
  onSelectModel: (id: Id<'models'>) => void;
  generator: Generator;
  onChangeGenerator: (g: Generator) => void;
  style: Style;
  onChangeStyle: (s: Style) => void;
  brief: string;
  onChangeBrief: (b: string) => void;
  referenceImages: string[];
  onUploadImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (i: number) => void;
  canGenerate: boolean;
  isSubmitting: boolean;
  onGenerate: () => void;
}

export function BriefBuilder(p: Props) {
  const genMeta = generatorMeta(p.generator);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-5 gap-5"
      style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
    >
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">Talent</p>
        <TalentPicker models={p.models} selected={p.selectedModelId} onSelect={p.onSelectModel} />
      </section>

      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">Brief</p>
        <textarea
          value={p.brief}
          onChange={e => p.onChangeBrief(e.target.value)}
          placeholder={p.selectedModel
            ? `Describe the scene for ${p.selectedModel.name} - lighting, camera movement, mood...`
            : 'Select a talent above, then describe the scene...'
          }
          rows={6}
          className="w-full px-4 py-3 rounded-2xl text-sm text-neutral-800 placeholder:text-neutral-400 resize-none outline-none focus:ring-2 transition-all"
          style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.08)', '--tw-ring-color': '#ff006940' } as React.CSSProperties}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) p.onGenerate(); }}
        />
        <p className="mt-1.5 text-[11px] text-neutral-400">
          {p.brief.length > 0 ? `${p.brief.length} chars · ⌘↵ to generate` : 'Be specific about lighting, camera movement, and audio cues'}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2">Generator</p>
          <GeneratorPills value={p.generator} onChange={p.onChangeGenerator} />
          <p className="mt-1.5 text-[11px] text-neutral-400">{genMeta.description}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2">Style</p>
          <StyleChips value={p.style} onChange={p.onChangeStyle} />
        </div>
      </section>

      {p.generator === 'flux' && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2.5">
            Face Reference <span className="ml-2 normal-case font-normal text-neutral-300">(FLUX only)</span>
          </p>
          <FaceRefUpload images={p.referenceImages} onUpload={p.onUploadImages} onRemove={p.onRemoveImage} />
        </section>
      )}

      <button
        onClick={p.onGenerate}
        disabled={!p.canGenerate}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.99]',
          !p.canGenerate ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-105 shadow-sm'
        )}
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        {p.isSubmitting ? (
          <><Loader2 size={15} className="animate-spin" /> Generating...</>
        ) : (
          <>
            <Sparkles size={15} />
            Generate with {genMeta.label}
            <span className="text-white/70 font-normal">· {fmtEta(genMeta.eta)}</span>
            <ChevronRight size={14} className="ml-auto text-white/60" />
          </>
        )}
      </button>
    </div>
  );
}
