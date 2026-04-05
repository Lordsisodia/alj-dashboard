export type Tab = 'upload' | 'library' | 'delivered';
export type ClipStatus = 'Raw' | 'Enhanced' | 'In Pipeline';

export interface Enhancement {
  id: string;
  label: string;
  color: string;
  bg: string;
}

export interface ClipData {
  id: string;
  filename: string;
  size: string;
  duration: string;
  status: ClipStatus;
  gradient: string;
  enhancements: string[];
}
