// @ts-nocheck
"use client";

import { Fragment, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { Search, Globe, ArrowRight, ChevronRight, BookmarkCheck, Share2, Sparkles, CreditCard, ShieldCheck, BarChart3, UsersRound, LifeBuoy, Bell } from "lucide-react";

import { SettingsDetailLayout } from "@/domains/partnerships/settings/shared/components/SettingsDetailLayout";
import { HighlightCard } from "@/components/ui/card-5-static";
import type {
  HelpCollection,
  HelpArticle,
  HelpCollectionIcon,
  HelpArticleSection,
} from "@/domains/partnerships/community/08-help-center/data/help-center";
import { cn } from "@/domains/shared/utils/cn";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";
import { searchHelpCollections } from "@/domains/partnerships/community/08-help-center/application/search";
import { HelpCollectionsSchema } from "@/domains/partnerships/community/08-help-center/domain/schema";
import { HELP_ROUTES } from "@/domains/partnerships/community/08-help-center/constants/routes";

type HelpCenterScreenProps = {
  collections: HelpCollection[];
  isLoading?: boolean;
  error?: string | null;
};

type HelpCollectionScreenProps = {
  collection: HelpCollection;
};

type HelpArticleScreenProps = {
  collection: HelpCollection;
  article: HelpArticle;
};

export function HelpCenterScreen({ collections, isLoading = false, error = null }: HelpCenterScreenProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const parsed = HelpCollectionsSchema.parse(collections);
    if (!query.trim()) return parsed;
    const results = searchHelpCollections(parsed, query).map((r) => r.article);
    return results.length ? parsed.filter((c) => c.articles.some((a) => results.includes(a))) : [];
  }, [collections, query]);

  if (error) {
    return (
      <HelpShell title="Help Center">
        <p className={cn(nestedCardClass, "px-4 py-3 text-sm text-amber-200 border border-amber-400/30 bg-amber-500/10")}>
          {error}
        </p>
      </HelpShell>
    );
  }

  return (
    <HelpShell title="Help Center">
      <HighlightCard
        color="orange"
        className="w-full pr-16"
        title="Help Center"
        description="Search articles, browse collections, or talk to Partner Success."
        hideDivider
        hideFooter
        showCornerIcon={false}
        titleClassName="uppercase tracking-[0.2em] font-semibold text-[26px] leading-[1.15] whitespace-nowrap"
        descriptionClassName="text-xs"
      />
      <HelpUtilities query={query} onQueryChange={setQuery} />
      {isLoading ? (
        <div className="space-y-3" role="status" aria-busy="true" aria-live="polite">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className={cn(nestedCardClass, "h-24 animate-pulse bg-white/5 border-white/10")} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((collection) => (
            <HelpCollectionCard key={collection.slug} collection={collection} />
          ))}
          {!filtered.length && (
            <p className={cn(nestedCardClass, "px-4 py-3 text-sm text-siso-text-muted")}>
              {collections.length
                ? "No matches yet. Try another keyword or browse collections below."
                : "No help collections are available yet."}
            </p>
          )}
        </div>
      )}
    </HelpShell>
  );
}

export function HelpCollectionScreen({ collection }: HelpCollectionScreenProps) {
  const Icon = resolveIcon(collection.icon);
  return (
    <HelpShell title={`${collection.title} help`} breadcrumbs={[
      { label: "All collections", href: HELP_ROUTES.base },
      { label: collection.title },
    ]}>
      <div className={cn(stackedPanelClass, "bg-siso-bg-secondary p-5 text-white")}>
        <header className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 siso-inner-card-strong">
            <Icon className="h-5 w-5 text-siso-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{collection.title}</h1>
            <p className="text-xs text-siso-text-muted">{collection.description}</p>
          </div>
        </header>
        <div className="mt-4 space-y-3">
          {collection.articles.map((article) => (
            <Link
              key={article.slug}
              href={HELP_ROUTES.article(collection.slug, article.slug)}
              className={cn(
                nestedCardClass,
                "flex items-center justify-between gap-3 border-white/20 px-4 py-3 text-left text-white transition hover:border-siso-orange/70",
              )}
            >
              <ArticleIconStack collectionIcon={collection.icon} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{article.title}</p>
                <p className="text-xs text-siso-text-muted">{article.summary}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-siso-text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </HelpShell>
  );
}

export function HelpArticleScreen({ collection, article }: HelpArticleScreenProps) {
  const updatedLabel = article.updatedAt ?? (article as any).lastUpdated;
  return (
    <HelpShell
      title={article.title}
      breadcrumbs={[
        { label: "All collections", href: HELP_ROUTES.base },
        { label: collection.title, href: HELP_ROUTES.collection(collection.slug) },
        { label: article.title },
      ]}
    >
      <article className={cn(stackedPanelClass, "space-y-6 bg-siso-bg-secondary p-5 text-sm text-siso-text-muted")}>
        <header className={cn(nestedCardClass, "inline-flex w-full flex-wrap items-center justify-between gap-3 border-white/20 px-4 py-3 text-left")}>
          <p className="text-xs uppercase tracking-[0.3em] text-siso-text-muted">Last updated</p>
          <p className="text-sm font-semibold text-white">
            {updatedLabel ? new Date(updatedLabel).toLocaleDateString() : "-"}
          </p>
        </header>
        <div className="space-y-4 text-sm text-siso-text-muted">
          <div className={cn(nestedCardClass, "border-white/20 px-4 py-3 text-white")}
          >
            <h1 className="text-xl font-semibold text-white">{article.title}</h1>
          </div>
          {(article.sections ?? []).map((section, index) => (
            <HelpArticleSectionCard key={section.heading ?? index} section={section} />
          ))}
          {(!article.sections || article.sections.length === 0) && (
            <p className="text-xs text-siso-text-muted">No content available for this article yet.</p>
          )}
        </div>
        <footer className={cn(nestedCardClass, "flex flex-col gap-3 border-white/20 p-4 text-xs text-siso-text-muted md:flex-row md:items-center md:justify-between")}>
          <div className="flex items-center gap-2 text-white">
            <BookmarkCheck className="h-4 w-4 text-siso-orange" />
            <span>Was this helpful?</span>
          </div>
          <div className="flex gap-2">
            <button
              className={cn(
                secondaryActionButtonClass,
                "rounded-full border-white/30 px-3 py-1 text-xs font-semibold text-white transition hover:text-siso-orange",
              )}
            >
              Yes
            </button>
            <button
              className={cn(
                secondaryActionButtonClass,
                "rounded-full border-white/25 px-3 py-1 text-xs font-semibold text-white/80 transition hover:text-siso-orange",
              )}
            >
              No
            </button>
            <button
              className={cn(
                secondaryActionButtonClass,
                "ml-2 flex items-center gap-1 rounded-full border-white/25 px-3 py-1 text-xs font-semibold text-white/80 transition hover:text-siso-orange",
              )}
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </footer>
      </article>
    </HelpShell>
  );
}

type HelpShellProps = {
  title: string;
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
};

function HelpShell({ title, children, breadcrumbs }: HelpShellProps) {
  return (
    <SettingsDetailLayout wrapContent={false} compactHeader hideHeader title={title} srTitle={title} backHref={null}>
      <div className="relative space-y-6">
        {breadcrumbs && (
          <div className={cn(stackedPanelClass, "p-3 text-xs text-white/70")}>
            <HelpBreadcrumbs items={breadcrumbs} />
          </div>
        )}
        {children}
      </div>
    </SettingsDetailLayout>
  );
}

function ArticleIconStack({ collectionIcon }: { collectionIcon: HelpCollectionIcon }) {
  const Icon = resolveIcon(collectionIcon);
  return (
    <div className="relative flex h-11 w-11 items-center justify-center">
      <div
        className="absolute -left-1 -top-1 h-5 w-5 rounded-xl bg-siso-orange/25 blur-md"
        aria-hidden
      />
      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-siso-bg-tertiary">
        <Icon className="h-4 w-4 text-siso-orange" />
      </div>
    </div>
  );
}

type HelpUtilitiesProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

function HelpUtilities({ query, onQueryChange }: HelpUtilitiesProps) {
  return (
    <div className={cn(stackedPanelClass, "bg-siso-bg-secondary/90 p-4 text-sm text-white/70")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-1 text-xs">
          <Globe className="h-3.5 w-3.5 text-siso-text-muted" />
          <label className="flex items-center gap-1 text-white">
            Language
            <select className="bg-transparent text-xs font-semibold text-white/80 focus:outline-none">
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <Link href="/partners/community/messages?tab=siso" className="text-xs font-semibold text-siso-orange">
          Contact support
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2">
        <Search className="h-4 w-4 text-siso-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for articles..."
          className="w-full bg-transparent text-sm text-white placeholder:text-siso-text-muted focus:outline-none"
        />
      </div>
    </div>
  );
}

const iconMap: Record<HelpCollectionIcon, ComponentType<{ className?: string }>> = {
  "life-buoy": LifeBuoy,
  "credit-card": CreditCard,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  "bar-chart": BarChart3,
  users: UsersRound,
  bell: Bell,
};

const resolveIcon = (key: HelpCollectionIcon) => iconMap[key] ?? LifeBuoy;

function HelpCollectionCard({ collection }: { collection: HelpCollection }) {
  const Icon = resolveIcon(collection.icon);
  return (
    <Link
      href={`/partners/community/help/${collection.slug}`}
      className={cn(stackedPanelClass, "flex items-center justify-between gap-3 p-4 text-white transition hover:border-siso-orange/70")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 siso-inner-card-strong">
          <Icon className="h-5 w-5 text-siso-orange" />
        </div>
        <div>
          <p className="text-base font-semibold">{collection.title}</p>
          <p className="text-xs text-siso-text-muted">{collection.description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-siso-text-muted" />
    </Link>
  );
}

function HelpArticleSectionCard({ section }: { section: HelpArticleSection }) {
  return (
    <div className={`${nestedCardClass} p-4`}>
      <div className="space-y-3">
        {section.heading ? <h2 className="text-base font-semibold text-white">{section.heading}</h2> : null}
        <div className="space-y-3">
          {section.body.map((paragraph, idx) => {
            const parsed = parseParagraphContent(paragraph);
            if (parsed.type === "label") {
              return (
                <div key={`label-${idx}`} className="space-y-1 rounded-2xl border border-white/10 siso-inner-card-strong px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-siso-text-muted">{parsed.label}</p>
                  <p className="text-sm text-siso-text-muted">{parsed.detail}</p>
                </div>
              );
            }
            if (parsed.type === "bullets") {
              return (
                <ul key={`bullets-${idx}`} className="list-disc space-y-1 pl-6 text-sm text-siso-text-muted marker:text-white/60">
                  {parsed.bullets.map((bullet, bulletIdx) => (
                    <li key={`bullet-item-${idx}-${bulletIdx}`} className="pl-1 text-sm">
                      {bullet}
                    </li>
                  ))}
                </ul>
              );
            }
            const details = parsed.details ?? [];
            const shouldList = parsed.lead ? details.length > 0 : details.length > 1;
            return (
              <div key={`paragraph-${idx}`} className="space-y-1">
                {parsed.lead ? <p className="text-[15px] font-semibold text-white/90">{parsed.lead}</p> : null}
                {shouldList ? (
                  <ul className="list-disc space-y-1 pl-6 text-sm text-siso-text-muted marker:text-white/50">
                    {details.map((detail, detailIdx) => (
                      <li key={`detail-${idx}-${detailIdx}`} className="pl-1">
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : details[0] ? (
                  <p className="text-sm text-siso-text-muted">{details[0]}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type BreadcrumbItem = {
  label: string;
  href?: string;
};

function HelpBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.35em]" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1",
            "siso-inner-card-strong text-white/70",
          )}>
            {item.href ? (
              <Link href={item.href} className="text-white/80 transition hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </span>
          {index < items.length - 1 ? <span className="text-white/35">/</span> : null}
        </Fragment>
      ))}
    </nav>
  );
}

type ParsedParagraph =
  | { type: "label"; label: string; detail: string }
  | { type: "bullets"; bullets: string[] }
  | { type: "paragraph"; lead?: string; details?: string[] };

function parseParagraphContent(paragraph: string): ParsedParagraph {
  const trimmed = paragraph.trim();
  if (!trimmed) return { type: "paragraph", details: [] };

  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0 && colonIndex < 80) {
    return {
      type: "label",
      label: trimmed.slice(0, colonIndex).trim(),
      detail: trimmed.slice(colonIndex + 1).trim(),
    };
  }

  if (trimmed.includes(";")) {
    const bullets = trimmed
      .split(";")
      .map((bullet) => bullet.replace(/^[•-]\s*/, "").trim())
      .filter(Boolean);
    if (bullets.length) {
      return { type: "bullets", bullets };
    }
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 1) {
    return { type: "paragraph", lead: sentences[0], details: sentences.slice(1) };
  }

  return { type: "paragraph", details: [trimmed] };
}
