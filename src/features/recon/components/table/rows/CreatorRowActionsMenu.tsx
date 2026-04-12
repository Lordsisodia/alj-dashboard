'use client';

import { useState } from 'react';
import { MoreHorizontal, Download, Sparkles, Pause, Play, ExternalLink, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Props {
  handle:         string;
  isActive:       boolean;
  isEnriching:    boolean;
  isScraping:     boolean;
  onToggleStatus: () => void;
  onEnrich:       () => void;
  onScrape:       () => void;
}

export function CreatorRowActionsMenu({ handle, isActive, isEnriching, isScraping, onToggleStatus, onEnrich, onScrape }: Props) {
  const scraping = isScraping;
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={e => e.stopPropagation()}
          className="w-6 h-6 flex items-center justify-center rounded border transition-colors hover:bg-neutral-100 data-[state=open]:bg-neutral-100 data-[state=open]:opacity-100"
          style={{ borderColor: 'rgba(0,0,0,0.08)', color: '#9ca3af' }}
          aria-label="Row actions"
        >
          <MoreHorizontal size={13} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        onClick={e => e.stopPropagation()}
      >
        <DropdownMenuItem
          disabled={scraping}
          onSelect={() => { onScrape(); }}
          className="gap-2 text-xs"
        >
          {scraping ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {scraping ? 'Scraping posts\u2026' : 'Scrape posts'}
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isEnriching}
          onSelect={() => { onEnrich(); }}
          className="gap-2 text-xs"
        >
          {isEnriching ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {isEnriching ? 'Enriching\u2026' : 'Enrich profile'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => { onToggleStatus(); }}
          className="gap-2 text-xs"
        >
          {isActive ? <Pause size={13} /> : <Play size={13} />}
          {isActive ? 'Pause tracking' : 'Resume tracking'}
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 text-xs">
          <a
            href={`https://instagram.com/${handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={13} />
            Open in Instagram
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
