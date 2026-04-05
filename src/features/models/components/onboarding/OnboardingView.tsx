export function OnboardingView() {
  const steps = [
    { label: 'Contract signed', done: true },
    { label: 'Profile brief submitted', done: true },
    { label: 'Face reference photos uploaded', done: true },
    { label: 'First reel idea sent', done: false },
    { label: 'Test clip reviewed', done: false },
  ];

  return (
    <div className="p-4">
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <p className="text-sm font-semibold text-neutral-900 mb-3">New Model Checklist</p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: step.done ? '#22c55e' : 'rgba(0,0,0,0.08)' }}
              >
                {step.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: step.done ? '#171717' : '#a3a3a3' }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
