// Shared types and utilities for the VirtualTable component system

export interface ColDef<ColKey extends string = string> {
  key:            ColKey;
  label:          string;
  width:          string;
  defaultVisible?: boolean; // default: true
  hideable?:       boolean; // default: true; false = not shown in col picker
  badge?:          string;  // optional badge in col picker (e.g. "Enriched")
}

export type ColVisibility<ColKey extends string = string> = Record<ColKey, boolean>;

/** Build CSS grid-template-columns string from column defs + visibility */
export function buildGridCols<ColKey extends string>(
  columns: ColDef<ColKey>[],
  vis: ColVisibility<ColKey>,
): string {
  return columns.filter(c => vis[c.key]).map(c => c.width).join(' ');
}

/** Compute total pixel width of visible columns */
export function computeTableWidth<ColKey extends string>(
  columns: ColDef<ColKey>[],
  vis: ColVisibility<ColKey>,
): number {
  return columns
    .filter(c => vis[c.key])
    .reduce((sum, c) => sum + parseInt(c.width, 10), 0);
}

/** Build default visibility record from column defs */
export function makeDefaultVisibility<ColKey extends string>(
  columns: ColDef<ColKey>[],
): ColVisibility<ColKey> {
  return Object.fromEntries(
    columns.map(c => [c.key, c.defaultVisible !== false]),
  ) as ColVisibility<ColKey>;
}
