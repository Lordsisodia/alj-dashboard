// ═══════════════════════════════════════════════════════════════════════════════
// DropdownContainer - shared outer wrapper for ALL dropdowns
// Ensures consistent positioning, styling, and width across Product/Solutions/Resources
// ═══════════════════════════════════════════════════════════════════════════════

import { DROPDOWN } from './nav.constants';

interface DropdownContainerProps {
  children: React.ReactNode;
}

export function DropdownContainer({ children }: DropdownContainerProps) {
  const width = `calc(100vw - ${DROPDOWN.horizontalPadding * 2}px)`;

  return (
    <div
      style={{
        position: 'fixed',
        top: DROPDOWN.top,
        left: DROPDOWN.horizontalPadding,
        right: DROPDOWN.horizontalPadding,
        width,
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: DROPDOWN.bg,
          border: `1px solid ${DROPDOWN.border}`,
          borderRadius: DROPDOWN.borderRadius,
          padding: DROPDOWN.innerPadding,
          boxShadow: DROPDOWN.boxShadow,
        }}
      >
        {children}
      </div>
    </div>
  );
}
