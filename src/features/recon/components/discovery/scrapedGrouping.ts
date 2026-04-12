import type { MappedCandidate } from './data';

export interface ScrapedGroup {
  label: string; // "Today" | "Yesterday" | "Apr 6" | "Earlier"
  items: MappedCandidate[];
}

export function groupScrapedByDate(candidates: MappedCandidate[]): ScrapedGroup[] {
  const sorted = [...candidates].sort((a, b) => (b.enrichedAt ?? 0) - (a.enrichedAt ?? 0));

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;

  const groups: ScrapedGroup[] = [];
  const groupMap = new Map<string, ScrapedGroup>();

  for (const c of sorted) {
    let label: string;
    if (!c.enrichedAt) {
      label = 'Earlier';
    } else if (c.enrichedAt >= today) {
      label = 'Today';
    } else if (c.enrichedAt >= yesterday) {
      label = 'Yesterday';
    } else {
      label = new Date(c.enrichedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    let g = groupMap.get(label);
    if (!g) {
      g = { label, items: [] };
      groupMap.set(label, g);
      groups.push(g);
    }
    g.items.push(c);
  }

  // Ensure "Earlier" group always sorts last
  const earlierIdx = groups.findIndex(g => g.label === 'Earlier');
  if (earlierIdx !== -1 && earlierIdx !== groups.length - 1) {
    const [earlier] = groups.splice(earlierIdx, 1);
    groups.push(earlier);
  }

  return groups;
}
