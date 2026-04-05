import { InfoButton } from "@/components/ui/info-button";
import ScrimList from "@/domains/shared/ui/settings/ScrimList";
import { integrationLogos, type IntegrationLogoKey } from "@/assets/integrations";
import { cn } from "@/domains/shared/utils/cn";
import { ChevronDown, Clock, Settings, Search } from "lucide-react";
import { primaryGradientButtonClass, secondaryActionButtonClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import type { IntegrationItem } from "./integration-options";

type Props = {
  integrations: IntegrationItem[];
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  onManage: (integration: IntegrationItem) => void;
  query: string;
  onQueryChange: (value: string) => void;
};

export function IntegrationList({ integrations, expanded, onToggleExpand, onManage, query, onQueryChange }: Props) {
  const visible = integrations.filter((i) =>
    [i.name, i.description, i.category].some((t) => t.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-siso-text-muted" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search integrations"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-siso-text-primary placeholder:text-siso-text-muted focus:outline-none focus:ring-1 focus:ring-siso-orange/60"
          />
        </div>
      </div>

      <ScrimList ariaLabel="Available integrations list">
        {visible.map((integration) => (
          <ScrimList.Row key={integration.id} className="items-start flex-wrap md:flex-nowrap gap-y-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={integrationLogos[integration.id as IntegrationLogoKey]}
                alt=""
                className="h-5 w-5 object-contain"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-siso-text-primary">{integration.name}</p>
                <InfoButton
                  label={`${integration.name} info`}
                  content={`Why connect ${integration.name}? ${integration.description}`}
                  side="bottom"
                  variant="ghost"
                />
              </div>
              <p className="text-xs text-siso-text-muted">{integration.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[11px] uppercase tracking-wide ${integration.connected ? "text-emerald-400/80" : "text-siso-text-muted"}`}>
                  {integration.connected ? "Connected" : "Available"}
                </span>
                <span className="text-[11px] uppercase tracking-wide text-siso-text-muted">• {integration.category}</span>
              </div>
              {expanded.has(integration.id) && integration.connected && (
                <div className="mt-2">
                  <div className="flex items-center gap-3 text-[11px] text-siso-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{integration.lastSync}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {integration.connected ? (
              <div className="ml-auto w-full md:w-auto flex items-center justify-end gap-2 mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={() => onToggleExpand(integration.id)}
                  aria-expanded={expanded.has(integration.id)}
                  className="inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-siso-text-primary hover:bg-white/10 items-center gap-1"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${expanded.has(integration.id) ? 'rotate-180' : ''}`} />
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => onManage(integration)}
                  className={cn(secondaryActionButtonClass, "px-3 py-1 text-xs")}
                >
                  <Settings className="h-3 w-3" />
                  Manage
                </button>
              </div>
            ) : (
              <div className="ml-auto w-full md:w-auto flex items-center justify-end gap-2 mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={() => onToggleExpand(integration.id)}
                  aria-expanded={expanded.has(integration.id)}
                  className="inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-siso-text-primary hover:bg-white/10 items-center gap-1"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${expanded.has(integration.id) ? 'rotate-180' : ''}`} />
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => onManage(integration)}
                  className={cn(primaryGradientButtonClass, "px-3 py-1 text-xs")}
                >
                  Connect
                </button>
              </div>
            )}
          </ScrimList.Row>
        ))}
      </ScrimList>
    </>
  );
}
