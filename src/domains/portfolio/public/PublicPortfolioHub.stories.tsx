import type { Meta, StoryObj } from "@storybook/react";
import { PublicPortfolioHub } from "./PublicPortfolioHub";
import { industries } from "../data/industries";
import { mapClientToPublicProject } from "../lib";
import { allClients } from "../data";
import { calculatePortfolioStats } from "../lib";

const meta: Meta<typeof PublicPortfolioHub> = {
  title: "Portfolio/PublicPortfolioHub",
  component: PublicPortfolioHub,
  args: {
    clients: allClients,
    stats: calculatePortfolioStats(),
    initialIndustry: "all",
  },
};

export default meta;

type Story = StoryObj<typeof PublicPortfolioHub>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    clients: [],
    stats: calculatePortfolioStats(),
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    clients: [],
    stats: calculatePortfolioStats(),
    error: "Failed to load portfolio",
  },
};

export const SingleIndustry: Story = {
  args: {
    clients: allClients.filter((c) => c.industry === industries[0].id),
    stats: calculatePortfolioStats(allClients.filter((c) => c.industry === industries[0].id)),
    initialIndustry: industries[0].id,
  },
};
