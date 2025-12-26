export type TAllCommunityResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Data;
  timestamp: string;
};

export interface Data {
  communities: Community[];
  total: number;
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
