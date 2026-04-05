import type { TeamMember } from "../data/team/members";

export function filterTeamMembers(
  members: TeamMember[],
  { tier, status, search }: { tier?: string; status?: string; search?: string },
): TeamMember[] {
  return members.filter((member) => {
    const matchesTier = tier ? member.tier.toLowerCase() === tier.toLowerCase() : true;
    const matchesStatus = status ? member.status.toLowerCase().includes(status.toLowerCase()) : true;
    const matchesSearch = search
      ? [member.name, member.role, member.focus, member.coverage]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;
    return matchesTier && matchesStatus && matchesSearch;
  });
}

export function sortByInvites(members: TeamMember[], direction: "asc" | "desc" = "desc") {
  return [...members].sort((a, b) => (direction === "asc" ? a.invitesThisMonth - b.invitesThisMonth : b.invitesThisMonth - a.invitesThisMonth));
}
