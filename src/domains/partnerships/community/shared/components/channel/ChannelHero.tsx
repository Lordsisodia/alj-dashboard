import { cn } from "@/lib/utils";
import type { CommunityChannelPreset } from "@/domains/partnerships/community/shared/data/channelPresets";
import { nestedCardClass, stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export const ChannelHero = ({ channel }: { channel: CommunityChannelPreset }) => (
  <header
    className={cn(
      stackedPanelClass,
      "rounded-[32px] bg-gradient-to-br from-siso-bg-secondary/70 to-siso-bg-tertiary/60 p-6 backdrop-blur",
    )}
  >
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-2xl border border-white/15 siso-inner-card-strong p-3 text-white">
        <channel.icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{channel.label}</h1>
        <p className="text-sm text-siso-text-muted">{channel.description}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          channel.access === "post"
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-amber-500/10 text-amber-300",
        )}
      >
        {channel.access === "post" ? "Posting enabled" : "Read only"}
      </span>
    </div>
    {channel.highlights.length ? (
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {channel.highlights.map((stat) => (
          <div key={`${channel.id}-${stat.label}`} className={cn(nestedCardClass, "p-4 text-white/85")}>
            <dt className="text-xs uppercase tracking-wide text-siso-text-muted">{stat.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-white">{stat.value}</dd>
            {stat.change ? <p className="text-xs text-siso-text-muted">{stat.change}</p> : null}
          </div>
        ))}
      </dl>
    ) : null}
  </header>
);
