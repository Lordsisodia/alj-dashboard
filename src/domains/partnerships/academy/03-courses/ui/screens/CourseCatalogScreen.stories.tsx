import type { Meta, StoryObj } from "@storybook/react";
import { CourseCatalogScreen } from "./CourseCatalogScreen";
import type { CourseSummary } from "@/domains/partnerships/academy/03-courses/application/course-service";

const sampleCourses: CourseSummary[] = [
  {
    id: "siso-essentials-program",
    title: "Essentials Program",
    overview: "Guided steps to learn the app fast.",
    level: "beginner",
    industry: "SaaS",
    tags: ["onboarding", "navigation"],
    duration: "90m",
    progress: 0,
    focus: "Get productive with SISO in under 90 minutes",
    legend: "8 modules",
    category: "siso-essentials",
    order: 1,
    trending: true,
    moduleCount: 3,
  },
  {
    id: "sales-discovery",
    title: "Sales Discovery Basics",
    overview: "Prep, questioning, and validation.",
    level: "intermediate",
    industry: "Services",
    tags: ["sales", "discovery"],
    duration: "45m",
    progress: 35,
    focus: "Land solid discovery calls",
    legend: "5 lessons",
    category: "sales-foundations",
    order: 2,
    moduleCount: 0,
  },
];

const meta: Meta<typeof CourseCatalogScreen> = {
  title: "Academy/CourseCatalogScreen",
  component: CourseCatalogScreen,
  args: {
    courses: sampleCourses,
  },
};

export default meta;

type Story = StoryObj<typeof CourseCatalogScreen>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    courses: [],
  },
};
