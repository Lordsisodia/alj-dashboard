import type { Meta, StoryObj } from "@storybook/react";
import { CommunityPageShell } from "./CommunityPageShell";

const meta: Meta<typeof CommunityPageShell> = {
  title: "Partnerships/Community/PageShell",
  component: CommunityPageShell,
  args: {
    children: <div className="p-6 text-white">Shell content</div>,
  },
};

export default meta;

type Story = StoryObj<typeof CommunityPageShell>;

export const Default: Story = {};

export const NoFloatingButton: Story = {
  args: {
    showFloatingNavButton: false,
  },
};
