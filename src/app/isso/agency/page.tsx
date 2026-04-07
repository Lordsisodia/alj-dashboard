export default function AgencyDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Agency Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Your agency at a glance</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Active Clients', value: '—', sub: 'Connect your data' },
            { label: 'Active Models',  value: '—', sub: 'Connect your data' },
            { label: 'Revenue MTD',    value: '—', sub: 'Connect your data' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-6"
              style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.05)' }}
            >
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">{card.label}</p>
              <p className="text-3xl font-bold text-neutral-900">{card.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: '#f5f5f4', minHeight: '320px' }}
        >
          <p className="text-lg font-semibold text-neutral-800 mb-2">Agency dashboard coming soon</p>
          <p className="text-sm text-neutral-400 max-w-sm">
            Client management, model tracking, revenue reports and team comms will live here.
          </p>
        </div>
      </div>
    </div>
  );
}
