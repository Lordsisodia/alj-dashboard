// ═══════════════════════════════════════════════════════════════════════════════
// Dropdown Theme — single source of truth for all dropdown styling
// Change one value here → updates all dropdowns automatically
// ═══════════════════════════════════════════════════════════════════════════════

export const DROPDOWN = {
  // Positioning (all dropdowns use same positioning)
  top: 68,
  horizontalPadding: 170, // ← Adjust this to change ALL dropdown widths

  // Box styling (all dropdowns share these values)
  bg: '#020308',
  border: '#2a2b30',
  borderRadius: 28,
  boxShadow: '28px 28px 80px -20px rgba(0,28,51,0.1)',

  // Inner padding (content area inside the box)
  innerPadding: '16px 16px 12px',
} as const;

// Label styling for section headers (Research, Learn, etc.)
export const LABEL = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.32)',
  padding: '4px 12px 10px',
} as const;

// Hover link styling for items in Solutions/Resources dropdowns
export const LINK_ITEM = {
  fontSize: 13,
  fontWeight: 500,
  color: '#fff',
  lineHeight: '18px',
} as const;

export const LINK_DESC = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.5)',
  lineHeight: '16px',
} as const;

// Animation timing
export const HOVER_DELAY_MS = 120;
