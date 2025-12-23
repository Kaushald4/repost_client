import { WithoutFile } from "./commonTypes";

export interface ProfileFormData {
  username: string;
  displayName: string;
  avatar: {
    fileId: string;
    url: string;
    file?: File;
  };
  banner: {
    fileId: string;
    url: string;
    file?: File;
  };
  bio: string;
  isPrivate: boolean;
  darkMode: boolean;
  allowDMs: boolean;
}

export type ProfileFormDataWithoutFiles = Omit<
  ProfileFormData,
  "avatar" | "banner"
> & {
  avatar: WithoutFile<ProfileFormData["avatar"]>;
  banner: WithoutFile<ProfileFormData["banner"]>;
};

export interface UpdateProfileDialogProps {
  username: string;
  displayName?: string;
  avatar?: {
    fileId: string;
    url: string;
  };
  banner?: {
    fileId: string;
    url: string;
  };
  bio?: string;
  isPrivate: boolean;
  darkMode: boolean;
  allowDMs: boolean;
  onSave: (data: ProfileFormData) => void;
}

export type TUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: {
    fileId: string;
    url: string;
  };
  banner: {
    fileId: string;
    url: string;
  };
  bio: string;
  isPrivate: boolean;
  darkMode: boolean;
  allowDMs: boolean;

  karma: number;
  level: number;

  stats: TUserStats;
  badges: TUserBadge[];
  createdAt: string;
  isVerified: boolean;
};

type TUserStats = {
  id: string;
  userId: string;
  user?: TUser;

  helper: number;
  debate: number;
  creative: number;
};

type TUserBadge = {
  id: string;
  userId: string;
  user?: TUser;

  badgeName: string; // e.g., 'newbie', 'helpful'
  earnedAt: string;
};
