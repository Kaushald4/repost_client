// Core Type Definitions for Repost Social Media App

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  karma: number;
  reputation: {
    helper: number;
    debate: number;
    creative: number;
  };
  badges: string[];
  level: number;
  createdAt: Date;
  isVerified: boolean;
}

export interface Community {
  id: string;
  name: string;
  title: string;
  displayName: string;
  description: string;
  icon?: string;
  banner?: string;
  memberCount: number;
  rules: string[];
  moderators: string[];
  createdAt: Date;
  isJoined?: boolean;
  healthScore: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: "text" | "image" | "poll" | "video" | "link";
  author: User;
  community: Community;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  views: number;
  createdAt: Date;
  updatedAt?: Date;
  isAnonymous: boolean;
  flair?: string;
  images?: string[];
  poll?: Poll;
  userVote?: "up" | "down" | null;
  isSaved?: boolean;
}

export interface Poll {
  options: PollOption[];
  totalVotes: number;
  endsAt?: Date;
  userVoted?: number;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt?: Date;
  userVote?: "up" | "down" | null;
  isDeleted?: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  recipientId: string;
  conversationId: string;
  createdAt: Date;
  read: boolean;
  type: "text" | "image" | "system";
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  type: "direct" | "group" | "community";
  name?: string;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: "reply" | "comment" | "mention" | "upvote" | "message" | "community";
  title: string;
  content: string;
  actor?: User;
  targetId: string;
  read: boolean;
  createdAt: Date;
  link: string;
}

export interface FeedFilter {
  sort: "hot" | "new" | "top" | "trending";
  timeRange?: "today" | "week" | "month" | "year" | "all";
  communityId?: string;
}

export interface SearchResult {
  posts: Post[];
  communities: Community[];
  users: User[];
}

export type NotificationSettings = {
  postReplies: boolean;
  commentReplies: boolean;
  mentions: boolean;
  upvotes: boolean;
  messages: boolean;
  communityAnnouncements: boolean;
};

export type PrivacySettings = {
  showProfile: boolean;
  showActivity: boolean;
  allowMessages: "everyone" | "following" | "none";
};
