import type { Meta, StoryObj } from "@storybook/react";
import { HelpCenterScreen } from "./HelpCenterScreen";

const collections = [
  {
    title: "Getting Started",
    slug: "getting-started",
    description: "Onboarding and setup",
    category: "onboarding",
    articles: [
      { title: "Create account", slug: "create-account", summary: "Sign up and invite teammates", updatedAt: "2025-11-20" },
      { title: "Billing basics", slug: "billing-basics", summary: "How billing works", updatedAt: "2025-11-18" },
    ],
  },
  {
    title: "Troubleshooting",
    slug: "troubleshooting",
    description: "Resolve common issues",
    category: "support",
    articles: [{ title: "Reset password", slug: "reset-password", summary: "Forgot password flow", updatedAt: "2025-11-15" }],
  },
] as any;

const meta: Meta<typeof HelpCenterScreen> = {
  title: "Partnerships/Community/HelpCenterScreen",
  component: HelpCenterScreen,
  args: {
    collections,
  },
};

export default meta;
type Story = StoryObj<typeof HelpCenterScreen>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true, collections: [] },
};

export const Error: Story = {
  args: { error: "Unable to load help content right now." },
};

export const Empty: Story = {
  args: { collections: [] },
};
