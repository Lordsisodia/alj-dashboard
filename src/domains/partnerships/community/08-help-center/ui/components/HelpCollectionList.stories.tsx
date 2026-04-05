import type { Meta, StoryObj } from "@storybook/react";
import { HelpCenterScreen } from "../screens/HelpCenterScreen";
import { helpCollections } from "../../data/help-center";

const meta: Meta<typeof HelpCenterScreen> = {
  title: "Partnerships/Community/HelpCenter/List",
  component: HelpCenterScreen,
  args: {
    collections: helpCollections,
  },
};

export default meta;

type Story = StoryObj<typeof HelpCenterScreen>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: "Failed to load help content",
  },
};

export const EmptySearch: Story = {
  args: {
    collections: [],
  },
};
