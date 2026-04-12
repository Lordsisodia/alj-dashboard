'use client';

import type { Competitor } from '../../../types';
import { CreatorRowActionsMenu } from './CreatorRowActionsMenu';
import { COL_BORDER } from '../tableUtils';

interface ActionsCellProps {
  c:              Competitor & { handle: string; status: string };
  isActive:       boolean;
  isEnriching:    boolean;
  isScraping:     boolean;
  onToggleStatus: (e: React.MouseEvent) => void;
  onEnrich:       (e: React.MouseEvent) => void;
  onScrape:       () => void;
}

export function ActionsCell({ c, isActive, isEnriching, isScraping, onToggleStatus, onEnrich, onScrape }: ActionsCellProps) {
  return (
    <div
      className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ borderRight: COL_BORDER }}
    >
      <CreatorRowActionsMenu
        handle={c.handle}
        isActive={isActive}
        isEnriching={isEnriching}
        isScraping={isScraping}
        onToggleStatus={() => onToggleStatus({ stopPropagation: () => {} } as React.MouseEvent)}
        onEnrich={() => onEnrich({ stopPropagation: () => {} } as React.MouseEvent)}
        onScrape={onScrape}
      />
    </div>
  );
}
