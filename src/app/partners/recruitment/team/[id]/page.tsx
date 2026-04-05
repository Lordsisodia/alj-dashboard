import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { HighlightCard } from "@/components/ui/card-5-static";
import { Waves } from "@/components/ui/wave-background";
import { getRecruitmentTeamMember, getRecruitmentTeamMembers } from "@/domains/partnerships/recruitment/03-sales-team/application/team-service";
import { TeamMemberProfile } from "@/domains/partnerships/recruitment/03-sales-team/ui/components/TeamMemberProfile";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
      const members = await getRecruitmentTeamMembers();
      return members.map((member) => ({ id: member.id }));
  } catch {
    return [];
  }
}

export default async function TeamMemberPage(props: any) {
  const memberId = props?.params?.id;
  const member = await getRecruitmentTeamMember(memberId);

  if (!member) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-siso-bg-primary pb-20 text-white">
      <div className="pointer-events-none absolute inset-0 h-full w-full" style={{ filter: "blur(6px)", opacity: 0.8 }}>
        <Waves className="h-full w-full" strokeColor="#f8a75c" backgroundColor="#05050a" pointerSize={0.35} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col space-y-6 p-4 lg:p-8">
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <Link
              href="/partners/recruitment/team"
              aria-label="Back to team overview"
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <HighlightCard
            color="orange"
            title="Team member profile"
            description="Deep dive stats, next actions, and readiness for this rep."
            icon={<span className="text-xl">🧭</span>}
            hideDivider
            showCornerIcon={false}
            titleClassName="uppercase tracking-[0.35em] text-white"
            descriptionClassName="text-sm"
            className="max-w-none pl-12"
          />
        </div>

        <TeamMemberProfile member={member} />
      </div>
    </main>
  );
}
