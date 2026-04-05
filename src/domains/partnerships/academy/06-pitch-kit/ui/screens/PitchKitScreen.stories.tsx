import type { Meta, StoryObj } from "@storybook/react";
import { PitchKitScreen } from "./PitchKitScreen";

const meta: Meta<typeof PitchKitScreen> = {
  title: "Academy/PitchKitScreen",
  component: PitchKitScreen,
};

export default meta;

type Story = StoryObj<typeof PitchKitScreen>;

export const Default: Story = {};
