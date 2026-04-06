import type { Meta, StoryObj } from "@storybook/react";
import { ConversationTimeline } from "./ConversationTimeline";
import type { ConversationMessage } from "@/domains/partnerships/community/06-messages/domain/types";

const meta: Meta<typeof ConversationTimeline> = {
  title: "Partnerships/Community/Messages/ConversationTimeline",
  component: ConversationTimeline,
};

export default meta;

type Story = StoryObj<typeof ConversationTimeline>;

const sample: ConversationMessage[] = [
  {
    id: "1",
    authorName: "Jordan Estevez",
    authorInitials: "JE",
    authorTitle: "Partner",
    direction: "incoming",
    content: "Has anyone bundled paid discovery into their first call?",
    timestamp: "2025-11-26T15:00:00.000Z",
  },
  {
    id: "2",
    authorName: "You",
    authorInitials: "YOU",
    direction: "outgoing",
    content: "Yes-tried a £1.2k strategy sprint; happy to share template.",
    timestamp: "2025-11-26T15:05:00.000Z",
  },
];

export const Default: Story = {
  args: {
    messages: sample,
  },
};

export const Empty: Story = {
  args: {
    messages: [],
  },
};
