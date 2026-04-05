/**
 * Portfolio Domain - Proof Bridge
 *
 * Optional helper to feed portfolio clients into proof/pitch-kit style UIs
 * without changing the existing portfolio data shape. Non-breaking and additive.
 */

import type { PortfolioClient } from "../types";
import { PORTFOLIO_ROUTES } from "../constants";

export type PortfolioProof = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  industries: string[];
  tags: string[];
  ctaUrl: string;
};

export type ProofLink = { label: string; href: string };

export function mapClientToProofAsset(client: PortfolioClient): PortfolioProof {
  return {
    id: client.id,
    title: client.name,
    subtitle: client.tagline ?? client.description ?? "",
    thumbnail:
      client.media?.screenshots?.desktop?.[0] ??
      client.media?.logo ??
      client.media?.hero ??
      undefined,
    industries: [client.industry].filter(Boolean) as string[],
    tags: client.metadata?.tags ?? [],
    ctaUrl: PORTFOLIO_ROUTES.publicClient(client.industry, client.id),
  };
}

export function mapClientsToProofAssets(clients: PortfolioClient[]) {
  return clients.map(mapClientToProofAsset);
}

/**
 * Build lightweight proof links that pitch-kit can ingest without duplicating
 * portfolio routes in multiple places.
 */
export function toProofLink(client: PortfolioClient): ProofLink {
  return {
    label: client.name,
    href: PORTFOLIO_ROUTES.publicClient(client.industry, client.id),
  };
}

export function groupProofLinksByIndustry(clients: PortfolioClient[]) {
  return clients.reduce<Record<string, ProofLink[]>>((acc, client) => {
    const key = client.industry;
    if (!acc[key]) acc[key] = [];
    acc[key].push(toProofLink(client));
    return acc;
  }, {});
}
