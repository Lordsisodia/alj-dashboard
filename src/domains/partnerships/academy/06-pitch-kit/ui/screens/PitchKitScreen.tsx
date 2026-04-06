// @ts-nocheck
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, DownloadCloud, Filter, Layers, Link as LinkIcon, Sparkles, Flag } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { Button } from "@/components/ui/button";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { cn } from "@/domains/shared/utils/cn";
import { pitchAssets, type PitchAsset } from "@/domains/partnerships/academy/06-pitch-kit/data/pitch-kit";
import { useMemo, useState } from "react";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const guideSteps = [
  "Pick the asset type that matches your prospect",
  "Save it to Saved Docs for quick re-use",
  "Copy the link or bundle with proof assets",
];

export function PitchKitScreen() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pitchAssets;
    return pitchAssets.filter((asset) =>
      [asset.title, asset.summary, asset.focus, ...(asset.tags ?? [])]
        .some((field) => field.toLowerCase().includes(term)),
    );
  }, [search]);

  return (
    <main className="bg-siso-bg-primary text-siso-text-primary min-h-screen relative overflow-hidden">
      <TierProgressBackdrop />
      <div className="space-y-6">
        <div className="relative z-10 px-4 pt-10 lg:pt-12">
          <div className="relative min-h-[128px]">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <Link
                href="/partners/academy"
                aria-label="Back"
                className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
            <HighlightCard
              color="orange"
              title="Pitch kit"
              description="Ready-to-share sales materials aligned with your tier."
              icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
              className="w-full pl-12 text-left"
              fullWidth
              hideDivider
              showCornerIcon={false}
              titleClassName="uppercase tracking-[0.3em] text-white"
              descriptionClassName="text-sm"
            />

            {/* Desktop ribbon flag */}
            <div className="hidden md:flex absolute right-6 top-0 h-16 w-12 bg-white/95 backdrop-blur-sm shadow-lg [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]">
              <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <Flag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 lg:pb-12">
          <SettingsGroupCallout icon={<Layers className="h-4 w-4" />} title="How to use" subtitle="Three steps to send a winning pitch." showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-3 p-4 text-white/85")}>
            <ol className="space-y-2 text-xs text-siso-text-muted">
              {guideSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Updated weekly
            </div>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Filter className="h-4 w-4" />} title="Search pitch kits" subtitle="Find the industry you're trying to approach." showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-2 p-4 text-white/85")}>
            <label className="relative block">
              <span className="sr-only">Search pitch kits</span>
              <input
                type="search"
                placeholder="Search by industry, audience, or outcome"
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-siso-text-muted focus:border-siso-orange focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-siso-text-muted">
                <LinkIcon className="h-4 w-4" />
              </span>
            </label>
            <p className="text-xs text-siso-text-muted">
              Showing {filtered.length} of {pitchAssets.length} pitch kits{search ? ` for "${search}"` : ""}.
            </p>
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<ArrowRight className="h-4 w-4" />} title="Assets" subtitle="Copy, open, or share without leaving the page." showChevron={false}>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-siso-text-muted">
                No pitch assets match your search yet.
              </div>
            ) : (
              filtered.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            )}
          </div>
        </SettingsGroupCallout>

        <SettingsGroupCallout icon={<Sparkles className="h-4 w-4" />} title="Need more social proof?" subtitle="Jump to portfolio to pair your pitch with proof." showChevron={false}>
          <div className={cn(stackedPanelClass, "space-y-3 p-4 text-white/85")}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-siso-text-muted">Browse portfolio case studies and attach to your pitch.</p>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className={cn(
                  secondaryActionButtonClass,
                  "rounded-full border-white/25 text-xs text-white/90 hover:text-white",
                )}
              >
                <Link href="/partners/academy/portfolio">Open portfolio</Link>
              </Button>
            </div>
          </div>
        </SettingsGroupCallout>
        </div>
      </div>
    </main>
  );
}

function AssetCard({ asset }: { asset: PitchAsset }) {
  return (
    <article className={cn(stackedPanelClass, "p-4 text-white/85")}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-siso-text-muted">{asset.type.replace("-", " ")}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{asset.title}</h3>
          <p className="text-sm text-siso-text-muted">{asset.summary}</p>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.3em]",
            asset.status === "public" ? "border-emerald-400 text-emerald-300" : "border-amber-400 text-amber-300",
          )}
        >
          {asset.status === "public" ? "Public" : "Partner"}
        </span>
      </header>
      <p className="mt-3 text-xs text-siso-text-muted">{asset.focus}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {asset.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-siso-text-muted">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          asChild
          size="sm"
          variant="secondary"
          className={cn(secondaryActionButtonClass, "rounded-2xl border-white/25 px-3 text-white/90 hover:text-white")}
        >
          <Link href={asset.link} className="flex items-center gap-1">
            <DownloadCloud className="h-4 w-4" />
            <span>Open</span>
          </Link>
        </Button>
      </div>
      <div className={cn(nestedCardClass, "mt-4 space-y-2 border-white/20 p-3 text-xs")}>
        <p className="font-semibold text-white">Related proof</p>
        <div className="flex flex-wrap gap-2">
          {asset.relatedProofs.map((proof) => (
            <Link
              key={proof.href}
              href={proof.href}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] text-siso-orange"
            >
              <ArrowRight className="h-3 w-3" />
              {proof.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
