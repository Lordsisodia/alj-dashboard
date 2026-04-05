import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PortfolioClient } from "../types";
import type { PortfolioClientSummary } from "../types/client.types";
import type { PortfolioStats } from "../types/stats.types";
import { PortfolioClientSchema, PortfolioIndexSchema } from "./schema";

const dataDir = path.join(process.cwd(), "public", "data", "portfolio-clients");

const readJson = cache(async <T>(fileName: string): Promise<T> => {
  const filePath = path.join(dataDir, fileName);
  const file = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(file) as unknown;
  return json as T;
});

export type PortfolioIndexPayload = {
  stats: PortfolioStats;
  clients: PortfolioClientSummary[];
};

export function fetchPortfolioIndex(baseUrl: string): Promise<PortfolioIndexPayload> {
  void baseUrl; // preserved for backwards compatibility
  return readJson<PortfolioIndexPayload>("index.json").then((data) => {
    const parsed = PortfolioIndexSchema.safeParse(data);
    if (!parsed.success && process.env.NODE_ENV !== "production") {
      console.warn("Portfolio index validation failed; returning raw payload", parsed.error);
    }
    return (parsed.success ? parsed.data : data) as PortfolioIndexPayload;
  });
}

export function fetchPortfolioClient(baseUrl: string, id: string): Promise<PortfolioClient> {
  void baseUrl;
  return readJson<PortfolioClient>(`${id}.json`).then((data) => {
    const parsed = PortfolioClientSchema.safeParse(data);
    if (!parsed.success && process.env.NODE_ENV !== "production") {
      console.warn(`Portfolio client validation failed for ${id}; returning raw payload`, parsed.error);
    }
    return (parsed.success ? parsed.data : data) as PortfolioClient;
  });
}
