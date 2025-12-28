export type TAllCommunityResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Data;
  timestamp: string;
};

export type TCommunityInfoResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CommunityInfoData;
  timestamp: string;
};

export interface Data {
  communities: Community[];
  total: number;
}

export interface CommunityInfoData {
  community: CommunityPage;
  viewerContext: ViewerContext;
}

export interface CommunityPage {
  id: string;
  name: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  icon: Icon;
  banner: Banner;
  counts: Counts;
  rules: string[];
  moderators: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface ViewerContext {
  isLoggedIn: boolean;
  isMember: boolean;
  role: string | null;
  isOwner: boolean;
}

export interface Community {
  id: string;
  name: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  icon: Icon;
  banner: Banner;
  counts: Counts;
  createdAt: string;
  updatedAt: string;
}

export interface Icon {
  url: string;
  fileId: string;
}

export interface Banner {
  url: string;
  fileId: string;
}

export interface Counts {
  members: number;
  moderators: number;
  followers: number;
}
