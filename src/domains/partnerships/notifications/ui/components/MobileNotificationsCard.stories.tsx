import type { Meta, StoryObj } from "@storybook/react";
import { MobileNotificationsCard } from "./MobileNotificationsCard";
import { mockNotifications } from "../fixtures/notification-fixtures";

const meta: Meta<typeof MobileNotificationsCard> = {
  title: "Notifications/MobileNotificationsCard",
  component: MobileNotificationsCard,
  args: {
    items: mockNotifications,
  },
};

export default meta;

type Story = StoryObj<typeof MobileNotificationsCard>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};
