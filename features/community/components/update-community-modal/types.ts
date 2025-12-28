import { CommunityPage } from "../../types";

export const MEDIA_ACTIONS = {
  KEEP: "keep" as const,
  UPDATE: "update" as const,
  DELETE: "delete" as const,
} as const;

export type MediaActionType = "keep" | "update" | "delete";

export interface MediaState {
  action: MediaActionType;
  file: File | null;
}

export interface UpdateCommunityModalProps {
  community: CommunityPage;
  trigger?: React.ReactNode;
}

export interface MediaSectionProps {
  type: "icon" | "banner";
  mediaState: MediaState;
  setMediaState: React.Dispatch<React.SetStateAction<MediaState>>;
  existingUrl?: string;
  hasExistingMedia: boolean;
}
