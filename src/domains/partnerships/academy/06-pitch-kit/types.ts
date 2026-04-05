export type PitchStatus = "public" | "partner";

export type PitchAsset = {
  id: string;
  title: string;
  summary: string;
  focus: string;
  type: string;
  status: PitchStatus;
  tags: string[];
  link: string;
  relatedProofs: { label: string; href: string }[];
};

