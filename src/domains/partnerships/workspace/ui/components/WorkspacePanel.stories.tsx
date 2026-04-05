import type { Meta, StoryObj } from "@storybook/react";
import { WorkspacePanel } from "./WorkspacePanel";

const meta: Meta<typeof WorkspacePanel> = {
  title: "Workspace/WorkspacePanel",
  component: WorkspacePanel,
  args: {
    title: "Tasks",
    state: "ready",
  },
};

export default meta;
type Story = StoryObj<typeof WorkspacePanel>;

export const Ready: Story = {
  render: (args) => (
    <WorkspacePanel {...args}>
      <ul className="text-white">
        <li>Example task</li>
      </ul>
    </WorkspacePanel>
  ),
};

export const Loading: Story = {
  args: { state: "loading" },
};

export const Empty: Story = {
  args: { state: "empty" },
};

export const Error: Story = {
  args: { state: "error", errorMessage: "Failed to load" },
};
