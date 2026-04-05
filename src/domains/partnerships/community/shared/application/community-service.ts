// @ts-nocheck
import { cache } from "react";
import path from "node:path";
import { promises as fs } from "node:fs";
import type { PartnerProfile } from "@/domains/partnerships/community/shared/data/partnerDirectory";
import { helpCollections as staticHelpCollections, type HelpCollection } from "@/domains/partnerships/community/08-help-center/data/help-center";
import { PartnerDirectorySchema, HelpCollectionsSchema } from "./schema";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";

const PARTNER_DIRECTORY_ENDPOINT = "/data/community/partner-directory.json";
const HELP_CENTER_ENDPOINT = "/data/community/help-center.json";
const PARTNER_DIRECTORY_DISK_PATH = path.join(process.cwd(), "public", "data", "community", "partner-directory.json");
const HELP_CENTER_DISK_PATH = path.join(process.cwd(), "public", "data", "community", "help-center.json");
const REVALIDATE_SECONDS = 60 * 15;
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

async function readJsonFromDisk<T>(filePath: string): Promise<T> {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as T;
}

async function fetchJson<T>(endpoint: string, diskFallback: string, schema?: { safeParse: (data: unknown) => any }): Promise<T> {
  if (isBuildPhase) {
    const diskData = await readJsonFromDisk<T>(diskFallback);
    return diskData;
  }

  try {
    const baseUrl = await getRequestBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (response.ok) {
      const json = (await response.json()) as unknown;
      if (schema) {
        const parsed = schema.safeParse(json);
        if (!parsed.success && process.env.NODE_ENV !== "production") {
          console.warn(`Validation failed for ${endpoint}; using raw`, parsed.error);
          return json as T;
        }
        return (parsed.success ? parsed.data : json) as T;
      }
      return json as T;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Falling back to disk for ${endpoint}`, error);
    }
  }

  const fallback = await readJsonFromDisk<T>(diskFallback);
  if (schema) {
    const parsed = schema.safeParse(fallback);
    if (parsed.success) return parsed.data as T;
  }
  return fallback;
}

const loadPartnerDirectory = cache(async (): Promise<PartnerProfile[]> =>
  fetchJson<PartnerProfile[]>(PARTNER_DIRECTORY_ENDPOINT, PARTNER_DIRECTORY_DISK_PATH, PartnerDirectorySchema),
);

export async function getPartners(): Promise<PartnerProfile[]> {
  return loadPartnerDirectory();
}

export async function getPartnerById(profileId: string): Promise<PartnerProfile | null> {
  const partners = await loadPartnerDirectory();
  return partners.find((partner) => partner.id === profileId) ?? null;
}

const loadHelpCollections = cache(async (): Promise<HelpCollection[]> => {
  // Prefer static bundled data to avoid runtime fetch/schema issues
  const parsedStatic = HelpCollectionsSchema.safeParse(staticHelpCollections);
  if (parsedStatic.success) return parsedStatic.data;
  return fetchJson<HelpCollection[]>(HELP_CENTER_ENDPOINT, HELP_CENTER_DISK_PATH, HelpCollectionsSchema);
});

export async function listHelpCollections(): Promise<HelpCollection[]> {
  return loadHelpCollections();
}

export async function findHelpCollection(slug: string): Promise<HelpCollection | null> {
  const collections = await loadHelpCollections();
  return collections.find((collection) => collection.slug === slug) ?? null;
}

export async function findHelpArticle(collectionSlug: string, articleSlug: string) {
  const collection = await findHelpCollection(collectionSlug);
  if (!collection) return { collection: null, article: null };

  const article = collection.articles.find((entry) => entry.slug === articleSlug) ?? null;
  return { collection, article };
}
