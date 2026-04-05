import { render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/waves-background", () => ({ Waves: () => null }), { virtual: true });
vi.mock(
  "@/components/ui/card",
  () => ({
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }),
  { virtual: true },
);
vi.mock(
  "@/components/ui/button",
  () => ({
    Button: ({ children, ...props }: React.HTMLProps<HTMLButtonElement>) => <button {...props}>{children}</button>,
  }),
  { virtual: true },
);
vi.mock(
  "@/components/ui/badge",
  () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  }),
  { virtual: true },
);
vi.mock(
  "@/components/ui/gradient-text",
  () => ({
    GradientText: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  }),
  { virtual: true },
);
vi.mock(
  "@/components/ui/stats-section",
  () => ({
    __esModule: true,
    ClientStats: ({ children }: { children?: React.ReactNode }) => <section>{children}</section>,
  }),
  { virtual: true },
);
vi.mock("@/domains/portfolio/components/shared/CountdownNumber", () => ({ default: () => null }), { virtual: true });
vi.mock(
  "@/components/portfolio/PortfolioCard",
  () => ({
    PortfolioCard: ({ project }: { project: { id: string; app_name: string } }) => (
      <div data-project-id={project.id}>{project.app_name}</div>
    ),
  }),
  { virtual: true },
);
vi.mock(
  "@/lib/utils",
  () => ({
    cn: (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" "),
  }),
  { virtual: true },
);
vi.mock("../components/PortfolioStatsSection", () => ({ __esModule: true, PortfolioStatsSection: () => null }));

import { PublicPortfolioHub } from "../PublicPortfolioHub";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const stats = { totalProjects: 0, industriesServed: 0, avgDeliveryDays: 0, totalValueDelivered: 0, clientSatisfaction: 0 };

describe("PublicPortfolioHub empty", () => {
  it("shows featured empty state when no featured projects", () => {
    const html = renderToStaticMarkup(<PublicPortfolioHub clients={[]} stats={stats} />);
    expect(html).toContain("No featured projects yet");
  });
});
