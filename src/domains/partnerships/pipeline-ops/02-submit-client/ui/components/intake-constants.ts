import type { WizardPrompt, FormState } from "../../domain/types";
import type { ChatMessage } from "./intake-types";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const formatNow = () => timeFormatter.format(new Date());

export const DEFAULT_ASSISTANT_MESSAGE =
  "Hey—I'm the SISO intake assistant. Answer a few quick questions and type NA or Skip anytime if you don't have the info.";

export const DEFAULT_SERVICE_OPTIONS = ["Website", "Web App", "SEO", "Automation", "AI Builder", "Integrations"] as const;

export const initialFormState: FormState = {
  companyName: "",
  legalName: "",
  industry: "",
  companySize: "",
  partnershipType: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  socialLink: "",
  website: "",
  addressLine1: "",
  city: "",
  region: "",
  country: "",
  clientGoals: "",
  challenges: "",
  objectives: "",
  servicesRequested: [],
  timeline: "",
  budgetRange: "",
  contextNotes: "",
  commercialNotes: "",
  expectedValue: "50000",
  successProbability: "50-75%",
  riskNotes: "",
  specialRequirements: "",
  shareWithSiso: true,
  documents: [],
};

export const createPromptMessage = (prompt: WizardPrompt): ChatMessage => ({
  id: `prompt-${prompt.id}-${Date.now()}`,
  role: "assistant",
  content: prompt.prompt,
  helper: prompt.helper,
  author: "Intake Assistant",
  timestamp: formatNow(),
});
