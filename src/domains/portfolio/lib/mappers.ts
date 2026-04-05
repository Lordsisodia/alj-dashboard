/**
 * Portfolio Domain - Data Mappers
 *
 * Centralized transformations from raw PortfolioClient models to view models.
 */

import type { PortfolioClient, PortfolioStats } from "../types";

export type PublicProjectCard = {
  id: string;
  app_name: string;
  client_name: string;
  description?: string | null;
  technologies: string[];
  images: string[];
  live_url?: string;
  development_status?: string;
  estimated_value?: number;
  completion_date?: string;
  duration_months?: number;
  key_features: string[];
  testimonial?: PortfolioClient["testimonial"];
};

export function mapClientToPublicProject(client: PortfolioClient): PublicProjectCard {
  const fallbackImage =
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80";
  const desktopShots = client.media?.screenshots?.desktop ?? [];
  const images = desktopShots.length ? desktopShots : [fallbackImage];

  return {
    id: client.id,
    app_name: client.name,
    client_name: client.name,
    description: client.tagline ?? client.description,
    technologies: [...client.techStack.frontend, ...client.techStack.backend].slice(0, 6),
    images,
    live_url: client.liveUrl,
    development_status: client.status ?? "Live",
    estimated_value:
      client.pricing?.sisoPrice ??
      client.pricing?.max ??
      client.pricing?.min ??
      undefined,
    completion_date: client.timeline?.endDate,
    duration_months: client.timeline?.durationDays
      ? Math.ceil(client.timeline.durationDays / 30)
      : undefined,
    key_features: client.features?.key?.slice(0, 5) ?? [],
    testimonial: client.testimonial,
  };
}

export function summarizePortfolioStats(stats: PortfolioStats) {
  return {
    totalProjects: stats.totalProjects,
    industriesServed: stats.industriesServed,
    avgDeliveryDays: stats.avgDeliveryDays,
    totalValueDelivered: stats.totalValueDelivered,
    clientSatisfaction: stats.clientSatisfaction,
  };
}
