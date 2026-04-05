import type { Meta, StoryObj } from "@storybook/react";
import { HubOverview } from "./HubOverview";

const meta: Meta<typeof HubOverview> = {
  title: "Partnership Hub/HubOverview",
  component: HubOverview,
};

export default meta;
type Story = StoryObj<typeof HubOverview>;

export const Default: Story = {
  render: () => <HubOverview />,
};
