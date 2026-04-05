import type { Meta, StoryObj } from "@storybook/react";
import { PublicIndustryCategoryCard } from "./PublicIndustryCategoryCard";
import { industries } from "../data/industries";

const meta: Meta<typeof PublicIndustryCategoryCard> = {
  title: "Portfolio/PublicIndustryCategoryCard",
  component: PublicIndustryCategoryCard,
  args: {
    industry: industries[0].id,
    isActive: false,
  },
};

export default meta;

type Story = StoryObj<typeof PublicIndustryCategoryCard>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    isActive: true,
  },
};
