import { CommunityPage } from "../../types";
import { UpdateCommunityFormValues } from "../../schema";
import { MEDIA_ACTIONS, MediaState, MediaActionType } from "./types";

export function getValidVisibility(visibility: string): "PUBLIC" | "RESTRICTED" | "PRIVATE" {
  if (visibility === "PUBLIC" || visibility === "RESTRICTED" || visibility === "PRIVATE") {
    return visibility;
  }
  return "PUBLIC";
}

export function getDefaultValues(community: CommunityPage): UpdateCommunityFormValues {
  return {
    title: community.title || "",
    description: community.description || "",
    visibility: getValidVisibility(community.visibility || "PUBLIC"),
    icon: {
      action: community.icon?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
      url: community.icon?.url || "",
      fileId: community.icon?.fileId || "",
      previewUrl: community.icon?.url || "",
    },
    banner: {
      action: community.banner?.url ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
      url: community.banner?.url || "",
      fileId: community.banner?.fileId || "",
      previewUrl: community.banner?.url || "",
    },
  };
}

export function createInitialMediaState(hasExistingMedia: boolean): MediaState {
  return {
    action: hasExistingMedia ? MEDIA_ACTIONS.KEEP : MEDIA_ACTIONS.UPDATE,
    file: null,
  };
}

export function createMediaStateFromDefault(defaultAction: string | undefined): MediaState {
  return {
    action: (defaultAction === MEDIA_ACTIONS.KEEP
      ? MEDIA_ACTIONS.KEEP
      : MEDIA_ACTIONS.UPDATE) as MediaActionType,
    file: null,
  };
}
