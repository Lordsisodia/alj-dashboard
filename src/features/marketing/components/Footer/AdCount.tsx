const WHITE_50 = 'rgba(255,255,255,0.5)';
const WHITE_25 = 'rgba(255,255,255,0.25)';
const GREEN = '#22c55e';

// ─── Ad Count box ─────────────────────────────────────────────────────────
export default function FooterAdCount() {
  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Label + big number */}
      <div className="flex flex-col gap-1">
        <div className="footer-label !mb-0">Videos Scraped</div>
        <div className="footer-count text-2xl">220,230</div>
      </div>

      {/* Sparkline — path-based SVG matching original */}
      <svg width="100%" height="40" viewBox="0 0 212 41" preserveAspectRatio="none" style={{ display: 'block' }}>
        <path stroke="rgba(255,255,255,0.36)" strokeLinecap="round" strokeWidth="2" fill="none" d="M1 40V29m7 11V18m7 22V1m7 39V12m7 28V22m7 18V8m7 32V17m7 23V12m7 28V21m7 19V10m7 30V16m7 24V12m7 28V9m7 31V15m7 25V19m7 21V6m7 34V13m7 27V16m7 24V19m7 21V22m7 18V12m7 28V16m7 24V12m7 28V8m7 32V3m7 37V6m7 34V15m7 25V11m7 29V15m7 25V18" />
        <path stroke="white" strokeLinecap="round" strokeWidth="2" fill="none" d="M211 40V14" />
      </svg>

      {/* Live + Historical */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-[var(--green)] shrink-0" style={{ background: GREEN }} />
          <span className="flex-1 text-[0.75rem] font-normal" style={{ color: WHITE_50, fontFamily: 'Inter, sans-serif' }}>This Week</span>
          <span className="footer-count-sm text-sm" style={{ fontFamily: 'Inter Display, Arial, sans-serif', fontWeight: 600, color: '#fff' }}>12,430</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: WHITE_25 }} />
          <span className="flex-1 text-[0.75rem] font-normal" style={{ color: WHITE_50, fontFamily: 'Inter, sans-serif' }}>All Time</span>
          <span className="footer-count-sm text-sm" style={{ fontFamily: 'Inter Display, Arial, sans-serif', fontWeight: 600, color: '#fff' }}>207,800</span>
        </div>
      </div>
    </div>
  );
}
