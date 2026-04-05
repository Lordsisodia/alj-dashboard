export type ApprovalStatus = 'pending' | 'approved' | 'revision' | 'published';
export type ContentType = 'Reel' | 'Post' | 'Story' | 'Carousel';
export type Tab = 'pending' | 'approved' | 'rejected';

export interface ApprovalItem {
  id: string;
  contentType: ContentType;
  account: string;
  accountColor: string;
  caption: string;
  hashtags: string[];
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  thumbnailGradient: string;
  thumbnailIcon: React.ReactNode;
}
