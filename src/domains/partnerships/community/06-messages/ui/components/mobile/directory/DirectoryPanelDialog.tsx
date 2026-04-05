import { X, ArrowUpRight, Shield } from "lucide-react";

type PanelEntry = { id: string; name: string; note?: string };

type DirectoryPanelDialogProps = {
  panel: "all" | "outgoing" | "blocked";
  panelData: {
    title: string;
    description: string;
    entries: PanelEntry[];
    emptyLabel: string;
    searchPlaceholder: string;
  };
  panelSearch: string;
  onPanelSearchChange: (value: string) => void;
  onClose: () => void;
};

export function DirectoryPanelDialog({ panel, panelData, panelSearch, onPanelSearchChange, onClose }: DirectoryPanelDialogProps) {
  const filtered = panelData.entries.filter((e) => e.name.toLowerCase().includes(panelSearch.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-siso-bg-tertiary p-4 text-white shadow-[0_0_40px_rgba(0,0,0,0.55)]">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{panelData.title}</p>
            <p className="text-xs text-white/60">{panelData.description}</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 p-2 text-white/70 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          value={panelSearch}
          onChange={(e) => onPanelSearchChange(e.target.value)}
          placeholder={panelData.searchPlaceholder}
          className="mb-3 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {filtered.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                {panel === "outgoing" ? <ArrowUpRight className="h-4 w-4 text-siso-orange" /> : null}
                {panel === "blocked" ? <Shield className="h-4 w-4 text-white/50" /> : null}
                <span className="font-semibold text-white">{entry.name}</span>
              </div>
              {entry.note ? <p className="text-xs text-white/60">{entry.note}</p> : null}
            </div>
          ))}
          {filtered.length === 0 ? <p className="text-center text-xs text-white/50">{panelData.emptyLabel}</p> : null}
        </div>
      </div>
    </div>
  );
}

