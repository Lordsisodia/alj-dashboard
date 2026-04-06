import type {
  ConversationMessage,
  DirectoryContact,
  ThreadOverview,
} from "../domain/types";

const relativeTime = (minutesAgo: number) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(Date.now() - minutesAgo * 60_000));

export const demoConversation: ConversationMessage[] = [
  {
    id: "msg-1",
    authorName: "Nova Carter",
    authorInitials: "NC",
    authorTitle: "Program Lead",
    direction: "incoming",
    content: "Kicked off three new partner deals this morning. Upload your momentum wins and tag @ops if you need support.",
    timestamp: relativeTime(42),
    sentiment: "positive",
  },
  {
    id: "msg-2",
    authorName: "Cam Diaz",
    authorInitials: "CD",
    authorTitle: "AI Success",
    direction: "outgoing",
    content: "Uploading the Loom now-includes the PayPal wallet fix + the mission recap template.",
    timestamp: relativeTime(38),
    attachments: [
      { id: "loom", label: "Wallet Fix Loom" },
      { id: "deck", label: "Mission Recap.pptx" },
    ],
  },
  {
    id: "msg-3",
    authorName: "Sara Booker",
    authorInitials: "SB",
    authorTitle: "Recruitment",
    direction: "incoming",
    content: "Reminder: partner academy cohort sync is at 1pm ET. Bring the tier progression screenshots so design can review.",
    timestamp: relativeTime(21),
  },
  {
    id: "msg-4",
    authorName: "Cam Diaz",
    authorInitials: "CD",
    direction: "outgoing",
    content: "Copy, calendar blocked. Will drop the wallet performance numbers right after the sync.",
    timestamp: relativeTime(18),
  },
  {
    id: "msg-5",
    authorName: "Nova Carter",
    authorInitials: "NC",
    authorTitle: "Program Lead",
    direction: "incoming",
    content: "Perfect-if anyone needs access to the partners/earnings prototype ping me and I'll share the figma link.",
    timestamp: relativeTime(5),
  },
];

export const demoThreads: ThreadOverview[] = [
  {
    id: "thread-general",
    name: "General Chat",
    preview: "Wallet fixes reviewed • add your notes before stand-up.",
    timestamp: "Now",
    unreadCount: 2,
    badge: "Live",
    category: "Campus",
    status: "active",
  },
  {
    id: "thread-payments",
    name: "Payments Squad",
    preview: "PayPal integration QA checklist ready for review.",
    timestamp: "08:12",
    badge: "Earnings",
    category: "Focus Pods",
  },
  {
    id: "thread-academy",
    name: "Academy Guides",
    preview: "SISO Essentials lesson 4 draft shared by design.",
    timestamp: "Yesterday",
    status: "draft",
  },
];

export const demoDirectoryContacts: DirectoryContact[] = [
  { id: "dir-1", name: "Liam Flores", note: "New partner cohort" },
  { id: "dir-2", name: "Maya Benton", note: "Pipeline ops" },
  { id: "dir-3", name: "Zoe Patel", status: "On leave" },
];

export type { ConversationMessage, ThreadOverview, DirectoryContact };
