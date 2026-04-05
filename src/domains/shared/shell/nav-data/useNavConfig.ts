"use client";

import { useEffect, useState } from "react";
import type { IconSummary, PartnerNavConfig } from "@/config/partner-nav-config";

const NAV_CONFIG_URL = "/data/partner-nav-config.json";
const DEFAULT_REVALIDATE_SECONDS = 60 * 15;

let cachedConfig: PartnerNavConfig | null = null;
let cachedSummaries: IconSummary[] | null = null;
let inflightRequest: Promise<PartnerNavConfig> | null = null;

function summarize(config: PartnerNavConfig): IconSummary[] {
  return [...config.icons]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ id, label, icon, order }) => ({ id, label, icon, order }));
}

async function loadNavConfig(): Promise<PartnerNavConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (!inflightRequest) {
    inflightRequest = fetch(NAV_CONFIG_URL, {
      cache: "force-cache",
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch partner nav config: ${response.status}`);
        }
        return response.json() as Promise<PartnerNavConfig>;
      })
      .then((data) => {
        cachedConfig = data;
        cachedSummaries = summarize(data);
        return data;
      })
      .finally(() => {
        inflightRequest = null;
      });
  }

  return inflightRequest;
}

export function useTopLevelNavIcons(): IconSummary[] | null {
  const [icons, setIcons] = useState<IconSummary[] | null>(cachedSummaries);

  useEffect(() => {
    if (icons) return;
    let cancelled = false;

    loadNavConfig()
      .then((config) => {
        if (cancelled) return;
        const summaries = cachedSummaries ?? summarize(config);
        setIcons(summaries);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [icons]);

  return icons;
}

export function preloadTopLevelNavIcons() {
  void loadNavConfig();
}
