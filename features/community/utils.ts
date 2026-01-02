import { ViewerContext } from "./types";

export function resolveCommunityPermissions(ctx: ViewerContext) {
  // TODO: Replace with enum mapper
  const isActiveMember = ctx.membership.memberStatus === 2;
  console.log(ctx);
  return {
    auth: {
      isAuthenticated: ctx.isAuthenticated,
    },
    isOwner: ctx.role.isOwner,
    canJoin:
      ctx.isAuthenticated &&
      !isActiveMember &&
      !ctx.membership.isBanned &&
      ctx.communityContext.visibility === 1,

    canRequestJoin:
      ctx.isAuthenticated &&
      !isActiveMember &&
      !ctx.membership.isBanned &&
      ctx.communityContext.visibility === 1,

    canLeave: ctx.isAuthenticated && isActiveMember && !ctx.role.isOwner,
  };
}
export type PermissionsType = ReturnType<typeof resolveCommunityPermissions>;
