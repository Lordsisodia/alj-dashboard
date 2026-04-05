import type { Meta, StoryObj } from "@storybook/react";
import { CommunityChannelTemplate } from "./CommunityChannelTemplate";
import { communityChannelPresets } from "@/domains/partnerships/community/shared/data/channelPresets";

const meta: Meta<typeof CommunityChannelTemplate> = {
  title: "Community/CommunityChannelTemplate",
  component: CommunityChannelTemplate,
  args: {
    channel: communityChannelPresets[0],
  },
};

export default meta;

type Story = StoryObj<typeof CommunityChannelTemplate>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    channel: null,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    channel: null,
    error: "Failed to load channel",
  },
};

export const EmptyMessages: Story = {
  args: {
    channel: {
      ...communityChannelPresets[0],
      messages: [],
    },
  },
};
