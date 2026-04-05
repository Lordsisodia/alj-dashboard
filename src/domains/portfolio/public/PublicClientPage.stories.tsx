import type { Meta, StoryObj } from "@storybook/react";
import { PublicClientPage } from "./PublicClientPage";
import { allClients } from "../data";
import { industries } from "../data/industries";

const client = allClients[0];
const industry = industries.find((i) => i.id === client.industry) ?? industries[0];

const meta: Meta<typeof PublicClientPage> = {
  title: "Portfolio/PublicClientPage",
  component: PublicClientPage,
  args: {
    client,
    industry,
    related: allClients.slice(1, 4),
  },
};

export default meta;

type Story = StoryObj<typeof PublicClientPage>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to load client",
  },
};
