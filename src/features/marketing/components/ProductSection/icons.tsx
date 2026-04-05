// Tab icon SVGs used in ProductCard tabs.
// Keys match the `icon` field in each tab config (see data/products.ts).

const ICONS: Record<string, React.ReactNode> = {
  brain: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5a3 3 0 1 0-3 3c0 1-1 2-1 2s1 2 4 2 4-1 4-2-1-2-1-2a3 3 0 0 0 3-3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 5v1m-4 8s1 2 4 2 4-1 4-2-1-2-1-2a3 3 0 0 0 3-3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="12" width="4" height="9" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="8" width="4" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="17" y="3" width="4" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 6.5h6M6.5 10v6M17.5 14v-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="3" width="16" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  auto: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98m-.01-10.98-6.82 3.98" strokeLinecap="round"/>
    </svg>
  ),
  radar: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="2"/>
      <path d="M12 2a10 10 0 0 1 0 20" strokeLinecap="round"/>
      <path d="M12 6a6 6 0 0 1 0 12" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  scraper: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
      <g stroke="currentColor" strokeWidth="1.5" opacity=".92">
        <path d="M16 10a6 6 0 0 1-6 6M4 10a6 6 0 0 1 6-6" opacity=".5"/>
        <path d="M12.58 3.76a6.75 6.75 0 0 0-1.9-.48.7.7 0 0 0-.75.64l-.51 4.83a.75.75 0 0 1-.67.67l-4.83.5a.7.7 0 0 0-.64.75 6.75 6.75 0 0 0 6.05 6.05.7.7 0 0 0 .74-.64l.51-4.83a.75.75 0 0 1 .67-.67l4.83-.5a.7.7 0 0 0 .64-.75 6.75 6.75 0 0 0-4.14-5.57Z"/>
      </g>
    </svg>
  ),
  personChart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 5.83v3.34c-1.16 1.44-3.33 3.23-3.33 5.25 0 1.7 1.38 3.08 3.08 3.08h5.5c1.7 0 3.08-1.38 3.08-3.08 0-2.02-2.17-3.8-3.33-5.25V5.83m-5 0h5m-5 0h-.83m5.83 0h.83M5 13.21c.74-.13 2-.32 2.92-.3 1.65.05 2.5.8 4.16.84.92.02 2.17-.16 2.92-.3M8.33 3.33h.01m2.83-1.25h.16m.34 0a.42.42 0 1 1-.84 0 .42.42 0 0 1 .84 0Z"/>
    </svg>
  ),
  eye: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.16 11.34 2.49-2.48V13a3.02 3.02 0 1 1-6.04 0V8.07m0 0a1.88 1.88 0 1 0 0-3.77 1.88 1.88 0 0 0 0 3.77Z"/>
    </svg>
  ),
  searchRound: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16.25 16.25-3.18-3.18M14.75 9a5.75 5.75 0 1 1-11.5 0 5.75 5.75 0 0 1 11.5 0Z"/>
      <circle cx="9" cy="9" r="3" fill="currentColor" fillOpacity=".28"/>
    </svg>
  ),
  cube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M15.2 3.13H4.8c-.93 0-1.67.74-1.67 1.66v1.19c0 .44.17.86.48 1.17l4.03 4.03c.3.31.49.73.49 1.18v5.35l3.74-1.04v-4.31c0-.45.18-.87.5-1.18l4.02-4.03c.3-.3.48-.73.48-1.17V4.79c0-.92-.74-1.67-1.66-1.67Z"/>
    </svg>
  ),
};

/** Renders the matching SVG icon for a product tab. */
export function TabIcon({ icon }: { icon: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', color: 'inherit', opacity: 0.68 }}>
      {ICONS[icon]}
    </span>
  );
}
