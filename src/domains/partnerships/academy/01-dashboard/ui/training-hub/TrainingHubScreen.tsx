// @ts-nocheck
import {
  certificationBadges,
  courseCatalog,
  knowledgeArticles,
  progressSummaries,
  upcomingSessions,
} from "./data";
import {
  CertificationsSection,
  CourseCatalogSection,
  KnowledgeBaseSection,
  LiveSessionsSection,
  MyProgressSection,
} from "./sections";
import { TrainingHero } from "./components";
import { academyDashboardCards } from "../components/cards";
import { AcademyDashboardCard } from "../components/AcademyDashboardCards";

type TrainingHubScreenProps = {
  cards?: typeof academyDashboardCards;
  isLoading?: boolean;
};

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-36 animate-pulse rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}

export function TrainingHubScreen({ cards = academyDashboardCards, isLoading = false }: TrainingHubScreenProps) {
  return (
    <section className="flex flex-1 flex-col px-4 py-6">
      <div className="space-y-6">
        <div className="w-full">
          <TrainingHero overallProgress={68} stageLabel="Stage 3 - Enable" streakDays={5} />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-12">
            {isLoading ? (
              <LoadingGrid />
            ) : cards.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-siso-text-muted">
                No dashboard cards available yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <AcademyDashboardCard key={card.title} {...card} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-8">
            <CourseCatalogSection courses={courseCatalog} />
            <KnowledgeBaseSection articles={knowledgeArticles} />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <MyProgressSection summaries={progressSummaries} />
            <CertificationsSection badges={certificationBadges} />
            <LiveSessionsSection sessions={upcomingSessions} />
          </div>
        </div>
      </div>
    </section>
  );
}
