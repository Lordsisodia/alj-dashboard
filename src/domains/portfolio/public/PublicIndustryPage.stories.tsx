import type { Meta, StoryObj } from "@storybook/react";
import { PublicIndustryPage } from "./PublicIndustryPage";
import { industries } from "../data/industries";
import { allClients } from "../data";

const industry = industries[0];
const projects = allClients.filter((c) => c.industry === industry.id);

const meta: Meta<typeof PublicIndustryPage> = {
  title: "Portfolio/PublicIndustryPage",
  component: PublicIndustryPage,
  args: {
    industry,
    projects,
  },
};

export default meta;

type Story = StoryObj<typeof PublicIndustryPage>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to load industry",
  },
};

export const EmptyProjects: Story = {
  args: {
    projects: [],
  },
};
