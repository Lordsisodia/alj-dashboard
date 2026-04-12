export interface Applicant {
  id: string;
  name: string;
  email: string;
  telegram: string;
  country: string;
  dept: "Sales" | "Marketing";
  role: string;
  applied: string;
  appliedDays: string;
  status: "New" | "Screening" | "Interview" | "Trial" | "Hired" | "Rejected";
  avatar: string;
  rating?: number;
  notes?: string;
  coverLetter?: string;
  interviewDate?: string;
  standout: string;
  details: ApplicantDetails;
}

export interface ApplicantDetails {
  software?: string[];
  platforms?: string[];
  contentTypes?: string[];
  typingSpeed?: string;
  englishLevel?: number;
  hoursPerDay?: string;
  shiftPref?: string;
  hoursPerWeek?: string;
  qualityRating?: number;
  speedRating?: number;
  creativityRating?: number;
  portfolio?: string;
}

export interface StatTileData {
  label: string;
  value: number | string;
  sub?: string;
  icon: string;
  color: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  count: number;
  color: string;
}

export type DeptFilter = "All" | "Chatters" | "Social VAs" | "Managers";
