import type { Meta, StoryObj } from "@storybook/react";
import { TrainingSpotlightScreen } from "./TrainingSpotlightScreen";

const meta: Meta<typeof TrainingSpotlightScreen> = {
  title: "Academy/TrainingSpotlightScreen",
  component: TrainingSpotlightScreen,
};

export default meta;

type Story = StoryObj<typeof TrainingSpotlightScreen>;

export const Default: Story = {};
