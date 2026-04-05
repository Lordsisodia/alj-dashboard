export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  helper?: string;
  author?: string;
  timestamp?: string;
};
