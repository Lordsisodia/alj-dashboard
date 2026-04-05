// @ts-nocheck
import { academyDashboardCards, AcademyDashboardCard } from "./cards";

export function AcademyDashboardCards() {
  return (
    <div className="space-y-6">
      {academyDashboardCards.map((card) => (
        <AcademyDashboardCard key={card.title} {...card} />
      ))}
    </div>
  );
}

export default AcademyDashboardCards;
// Re-export for direct named import
export { AcademyDashboardCard };
