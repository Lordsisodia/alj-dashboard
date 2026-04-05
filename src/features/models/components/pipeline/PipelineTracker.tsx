import { PIPELINE_STEPS } from '../../constants';
import type { PipelineStep } from '../../types';

export function PipelineTracker({ currentStep, color }: { currentStep: PipelineStep; color: string }) {
  const currentIndex = PIPELINE_STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center gap-0 w-full my-4">
      {PIPELINE_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: isDone || isCurrent ? color : 'rgba(0,0,0,0.12)',
                  boxShadow: isCurrent ? `0 0 0 3px ${color}25` : undefined,
                }}
              />
              <span
                className="text-[9px] font-medium mt-1 whitespace-nowrap"
                style={{ color: isCurrent ? color : isDone ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)' }}
              >
                {step}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div
                className="h-px flex-1 mx-1 mb-4"
                style={{ backgroundColor: i < currentIndex ? color : 'rgba(0,0,0,0.1)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
