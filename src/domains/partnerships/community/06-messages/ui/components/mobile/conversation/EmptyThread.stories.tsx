import type { Meta, StoryObj } from "@storybook/react";
import { ConversationTimeline } from "./ConversationTimeline";

const meta: Meta<typeof ConversationTimeline> = {
  title: "Partnerships/Community/Messages/EmptyThread",
  component: ConversationTimeline,
};

export default meta;

type Story = StoryObj<typeof ConversationTimeline>;

export const EmptyThread: Story = {
  args: {
    messages: [],
  },
};
