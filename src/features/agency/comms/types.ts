export interface Channel {
  id: string;
  name: string;
  group: string;
  unread: number;
  members: number;
  lastMessage: {
    sender: string;
    preview: string;
    timestamp: string;
  };
}

export interface Message {
  id: string;
  channelId: string;
  sender: string;
  senderRole: string;
  senderInitials: string;
  senderColor: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  timestamp: string;
  pinned: boolean;
  priority: 'high' | 'normal';
}
