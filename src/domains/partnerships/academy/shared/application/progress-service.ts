import { cache } from "react";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";
import { ProgressPayloadSchema, type ProgressPayload } from "./schema";
import type { ProgressSnapshot, XpEntry } from "../types";

const PROGRESS_ENDPOINT = "/data/academy/my-progress.json";
const REVALIDATE_SECONDS = 60 * 15;

const loadProgress = cache(async (): Promise<ProgressPayload> => {
  const baseUrl = await getRequestBaseUrl();
  const response = await fetch(`${baseUrl}${PROGRESS_ENDPOINT}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch partner progress (${response.status})`);
  }

  const json = (await response.json()) as unknown;

  const parsed = ProgressPayloadSchema.safeParse(json);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Progress payload failed validation; using raw data", parsed.error);
    }
    return json as ProgressPayload;
  }
  return parsed.data;
});

function paginateXpFeed(xpFeed: XpEntry[], page = 1, pageSize = 5) {
  const totalCount = xpFeed.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  const normalizedPage = Math.min(Math.max(1, Number.isFinite(page) ? page : 1), totalPages);
  const startIndex = (normalizedPage - 1) * Math.max(1, pageSize);
  return {
    items: xpFeed.slice(startIndex, startIndex + Math.max(1, pageSize)),
    page: normalizedPage,
    totalPages,
    pageSize: Math.max(1, pageSize),
    totalCount,
  };
}

export async function getProgressSnapshot({ page = 1, pageSize = 5 }: { page?: number; pageSize?: number } = {}): Promise<ProgressSnapshot> {
  const data = await loadProgress();
  const paged = paginateXpFeed(data.xpFeed ?? [], page, pageSize);

  return {
    level: data.level,
    tiers: data.tiers ?? [],
    certificates: data.certificates,
    xpFeed: paged,
  };
}

// Exported for testing
export const __private = { paginateXpFeed };
