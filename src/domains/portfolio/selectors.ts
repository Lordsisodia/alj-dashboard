import type { PortfolioClient } from "./types";

export const getVisibleClients = (clients: PortfolioClient[]) =>
  clients.filter((c) => c.metadata?.showInPortfolio !== false);

export const getFeaturedClients = (clients: PortfolioClient[]) =>
  getVisibleClients(clients).filter((c) => c.metadata?.featured);

