'use client';

// Thin wrapper — passes recon's COLUMN_DEFS into the shared generic component.
// Call sites (ReconFeaturePage) don't need to change.
import { ColumnVisibilityPill as SharedPill } from '@/components/table/ColumnVisibilityPill';
import { COLUMN_DEFS, type ColVisibility } from '../tableUtils';

export function ColumnVisibilityPill({
  value,
  onChange,
}: {
  value: ColVisibility;
  onChange: (v: ColVisibility) => void;
}) {
  return <SharedPill columns={COLUMN_DEFS} value={value} onChange={onChange} />;
}
