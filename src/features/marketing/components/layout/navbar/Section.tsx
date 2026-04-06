// ═══════════════════════════════════════════════════════════════════════════════
// Section - labeled section wrapper for dropdown content
// Provides consistent header styling with optional divider or full-width layout
// ═══════════════════════════════════════════════════════════════════════════════

import { LABEL } from './nav.constants';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  divider?: boolean;    // Shows left border (for Analytics column)
  fullWidth?: boolean;  // Spans all columns (for Extend section)
  style?: React.CSSProperties;
}

export function Section({ title, children, divider, fullWidth, style }: SectionProps) {
  return (
    <div
      style={{
        padding: '16px 16px 0',
        borderLeft: divider ? '1px solid #2a2b30' : undefined,
        gridColumn: fullWidth ? '1 / -1' : undefined,
        ...style,
      }}
    >
      <div style={{ ...LABEL, padding: LABEL.padding }}>{title}</div>
      {children}
    </div>
  );
}
