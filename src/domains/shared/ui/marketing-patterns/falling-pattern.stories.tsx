import type { Meta, StoryObj } from "@storybook/react";
import { FallingPattern } from "./falling-pattern";

const meta: Meta<typeof FallingPattern> = {
  title: "Shared/MarketingPatterns/FallingPattern",
  component: FallingPattern,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FallingPattern>;

export const Default: Story = {
  args: {
    className: "h-64",
  },
};

export const WarmGlow: Story = {
  args: {
    className: "h-64",
    color: "hsla(20,95%,60%,0.25)",
    backgroundColor: "#0b0b0f",
    blur: "12px",
  },
};
