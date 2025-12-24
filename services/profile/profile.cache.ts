import { cache } from "react";
import { ProfileServerService } from "./profile.server";

export const getServerCachedProfile = cache(async () => {
  return ProfileServerService.getProfile();
});
