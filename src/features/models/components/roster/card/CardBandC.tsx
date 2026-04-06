'use client';

import type { ModelData } from '../../../types';

const STEPS = ['Draft', 'Sent', 'Filming', 'Clips Received', 'Editing', 'Complete'];

interface Props {
  model: ModelData;
}

export function CardBandC({ model }: Props) {
  if (model.onboardingPhase < 6) {
    return (
      <div className="px-4 pb-3">
        <div className="h-1.5 w-full rounded-full bg-black/[0.06]">
          <div
            style={{ width: `${(model.contentReceived / 100) * 100}%`, backgroundColor: model.color }}
            className="h-full rounded-full transition-all"
          />
        </div>
        <p className="text-[10px] text-neutral-400 mt-1">
          {model.contentReceived} / 100 content pieces received
        </p>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(model.pipelineStep);

  return (
    <div className="px-4 pb-3">
      <div className="flex items-center w-full">
        {STEPS.map((step, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  style={{
                    width: isCurrent ? 10 : 8,
                    height: isCurrent ? 10 : 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    backgroundColor: isPast || isCurrent ? model.color : 'rgba(0,0,0,0.12)',
                    boxShadow: isCurrent ? `0 0 0 3px ${model.color}30` : undefined,
                  }}
                />
                <span
                  className="text-[9px] font-medium mt-1 whitespace-nowrap"
                  style={{
                    color: isCurrent ? model.color : 'transparent',
                    visibility: isCurrent ? 'visible' : 'hidden',
                  }}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 mx-1.5 mb-4"
                  style={{
                    height: 1,
                    backgroundColor: i < currentIndex ? model.color : 'rgba(0,0,0,0.08)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
