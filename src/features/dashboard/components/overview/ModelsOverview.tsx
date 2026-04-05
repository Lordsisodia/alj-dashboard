import { MODELS, PIPELINE_STEPS } from '../../constants';

export function ModelsOverview() {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-900 mb-3">Models Overview</p>
      <div className="grid grid-cols-4 gap-3">
        {MODELS.map((model) => (
          <div
            key={model.id}
            className="rounded-xl p-4 bg-white"
            style={{ border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: model.color }}
              >
                {model.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{model.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{model.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {PIPELINE_STEPS.map((step) => {
                const active = step === model.step;
                const done = PIPELINE_STEPS.indexOf(step) < PIPELINE_STEPS.indexOf(model.step);
                return (
                  <div
                    key={step}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor: active
                        ? model.color
                        : done
                          ? `${model.color}50`
                          : 'rgba(0,0,0,0.07)',
                    }}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold" style={{ color: model.color }}>{model.step}</span>
              <span className="text-[10px] text-neutral-400">{model.reels} reels/wk</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
