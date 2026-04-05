export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: string;
  status: "active" | "upcoming" | "completed";
  progress: number;
  steps: string[];
};

export const missions: Mission[] = [
  {
    id: "mission-playbook",
    title: "Ship a new playbook",
    description: "Publish an automation or outbound playbook to Marketplace.",
    reward: "+200 pts",
    deadline: "Ends Dec 5",
    status: "active",
    progress: 45,
    steps: ["Draft outline", "Record Loom", "Publish"],
  },
  {
    id: "mission-beta",
    title: "Join ops beta",
    description: "Activate one beta feature and share results.",
    reward: "+150 pts",
    deadline: "Ends Dec 12",
    status: "upcoming",
    progress: 0,
    steps: ["Request access", "Enable beta", "Post results"],
  },
  {
    id: "mission-nps",
    title: "NPS guardrail",
    description: "Keep rolling NPS above 4.6 for the week.",
    reward: "+100 pts",
    deadline: "Weekly",
    status: "active",
    progress: 70,
    steps: ["Send surveys", "Collect feedback", "Share summary"],
  },
];
