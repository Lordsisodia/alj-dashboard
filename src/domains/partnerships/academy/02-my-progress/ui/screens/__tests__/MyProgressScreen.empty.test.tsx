import { render, screen } from "@testing-library/react";
import { MyProgressScreen } from "../MyProgressScreen";
import { ACADEMY_ROUTES } from "@/domains/partnerships/academy/constants/routes";

const baseLevel = {
  currentLevel: 1,
  currentPoints: 0,
  pointsToNextLevel: 100,
  nextLevel: 2,
  currentTierId: "t1",
  nextTierId: "t2",
};

const baseTiers = [
  { id: "t1", title: "Tier 1" },
  { id: "t2", title: "Tier 2" },
];

const baseCertificates = { count: 0, badges: 0 };

describe("MyProgressScreen empty XP", () => {
  it("shows empty XP message when no items", () => {
    render(
      <MyProgressScreen
        level={baseLevel}
        tiers={baseTiers}
        certificates={baseCertificates}
        xpFeed={{ items: [], page: 1, totalPages: 1, pageSize: 5, totalCount: 0 }}
        paginationBasePath={ACADEMY_ROUTES.myProgress}
      />, 
    );
    expect(screen.getByText(/No XP activity logged yet/i)).toBeInTheDocument();
  });
});

