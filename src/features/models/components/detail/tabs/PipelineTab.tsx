'use client';

import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import type { ModelData } from '../../../types';
import { PIPELINE_STEPS } from '../../../constants';

const PROVIDER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  FLUX:       { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border border-amber-200' },
  Kling:      { bg: 'bg-violet-100',  text: 'text-violet-700',  border: 'border border-violet-200' },
  Higgsfield: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border border-emerald-200' },
};

const JOB_STATUS_DOT: Record<string, React.ReactNode> = {
  Queued:     <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />,
  Done:       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />,
  Failed:     <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />,
};

function GeneratingDot() {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    />
  );
}

export function PipelineTab({ model }: { model: ModelData }) {
  const reels = model.reels ?? [];

  return (
    <div className="p-4">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {PIPELINE_STEPS.map((step, colIdx) => {
          const stepReels = reels.filter(r => r.step === step);
          const isActive = step === model.pipelineStep;

          return (
            <div key={step} className="flex-shrink-0 w-44">
              {/* Column header */}
              <div
                className="flex items-center justify-between px-3 py-2 rounded-t-xl mb-0"
                style={{
                  backgroundColor: isActive ? `${model.color}08` : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${isActive ? `${model.color}30` : 'rgba(0,0,0,0.07)'}`,
                  borderBottom: 'none',
                  borderTop: isActive ? `3px solid ${model.color}` : `1px solid ${isActive ? `${model.color}30` : 'rgba(0,0,0,0.07)'}`,
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: isActive ? model.color : '#737373' }}
                >
                  {step}
                </span>
                <span
                  className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? model.color : 'rgba(0,0,0,0.08)',
                    color: isActive ? '#fff' : '#737373',
                  }}
                >
                  {stepReels.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="rounded-b-xl p-2 space-y-2 min-h-[120px]"
                style={{
                  border: `1px solid ${isActive ? `${model.color}30` : 'rgba(0,0,0,0.07)'}`,
                  borderTop: 'none',
                  backgroundColor: '#fff',
                }}
              >
                {stepReels.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-1.5 text-neutral-300">
                    <Film size={16} />
                    <span className="text-[10px]">No reels</span>
                  </div>
                ) : (
                  stepReels.map((reel, i) => {
                    const providerStyle = reel.provider ? PROVIDER_STYLES[reel.provider] : null;
                    const hasProvider = !!reel.provider;

                    return (
                      <motion.div
                        key={reel.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: colIdx * 0.04 + i * 0.05 }}
                        className="rounded-lg overflow-hidden"
                        style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <div
                          className="h-16 w-full"
                          style={{ background: reel.gradient }}
                        />
                        <div className="px-2 py-1.5">
                          <p className="text-[11px] font-medium text-neutral-800 leading-tight">{reel.title}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{reel.createdAt}</p>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {hasProvider && providerStyle ? (
                              <>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${providerStyle.bg} ${providerStyle.text} ${providerStyle.border}`}>
                                  {reel.provider}
                                </span>
                                {reel.jobStatus === 'Generating' ? (
                                  <GeneratingDot />
                                ) : reel.jobStatus ? (
                                  JOB_STATUS_DOT[reel.jobStatus]
                                ) : null}
                              </>
                            ) : (
                              <button
                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: '#ff0069', color: 'white' }}
                              >
                                → Generate
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
