export type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  connected: boolean;
  color: string;
  lastSync?: string;
  syncStatus?: string;
  usageStats?: {
    syncedItems?: number;
    messages?: number;
    lastWeek: number;
  };
  features?: string[];
};

export const availableIntegrations: IntegrationItem[] = [
  {
    id: "notion",
    name: "Notion",
    description: "Sync tasks and documents with your Notion workspace",
    icon: "📝",
    category: "Productivity",
    connected: true,
    color: "text-gray-800",
    lastSync: "2 hours ago",
    syncStatus: "active",
    usageStats: { syncedItems: 245, lastWeek: 89 },
    features: ["Task sync", "Document sharing", "Workspace access"],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access files and documents from Google Drive",
    icon: "📁",
    category: "Storage",
    connected: false,
    color: "text-blue-600",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and send messages to Slack channels",
    icon: "💬",
    category: "Communication",
    connected: true,
    color: "text-purple-600",
    lastSync: "5 minutes ago",
    syncStatus: "active",
    usageStats: { messages: 1247, lastWeek: 423 },
    features: ["Partner notifications", "Deal updates", "Task assignments"],
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync meetings and events with your calendar",
    icon: "📅",
    category: "Scheduling",
    connected: false,
    color: "text-green-600",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Send templated notifications and receive partner replies",
    icon: "📲",
    category: "Messaging",
    connected: false,
    color: "text-emerald-500",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Enable cash-outs and payout visibility",
    icon: "💳",
    category: "Payments",
    connected: false,
    color: "text-indigo-500",
  },
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect an EVM wallet for crypto payouts",
    icon: "🦊",
    category: "Crypto Wallets",
    connected: false,
    color: "text-orange-400",
  },
  {
    id: "phantom",
    name: "Phantom Wallet",
    description: "Connect a Solana wallet for crypto payouts",
    icon: "👻",
    category: "Crypto Wallets",
    connected: false,
    color: "text-violet-400",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link repositories and track development activity",
    icon: "🐙",
    category: "Development",
    connected: false,
    color: "text-gray-900",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Access design files and prototypes",
    icon: "🎨",
    category: "Design",
    connected: false,
    color: "text-purple-500",
  },
];
