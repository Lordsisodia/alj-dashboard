// @ts-nocheck
"use client";

/**
 * Portfolio Domain - Industry Data Hook
 */

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getIndustryBySlug } from "../data";
import { getIndustryClients } from "../lib";
import { getVisibleClients } from "../selectors";
import { PORTFOLIO_ROUTES } from "../constants";

export function useIndustryData() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params?.industry ?? params?.slug ?? null;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const industry = useMemo(() => {
    if (typeof slug !== "string" || !slug) return null;
    return getIndustryBySlug(slug) ?? null;
  }, [slug]);

  const clients = useMemo(() => {
    if (!industry) return [];
    return getIndustryClients(industry.id, getVisibleClients);
  }, [industry]);

  useEffect(() => {
    if (typeof slug === "string" && slug.length > 0 && !industry) {
      router.replace(PORTFOLIO_ROUTES.fallback);
    }
  }, [industry, router, slug]);

  return {
    industry,
    clients,
  };
}
