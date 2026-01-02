import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommunityClientService } from "../services/community.client";
import { CommunityInfoData } from "../types";
import { joinCommunityAction, leaveCommunityAction } from "../services/community.action";

export const useCommunityInfo = (communityName: string, initialData: CommunityInfoData) => {
  return useQuery<CommunityInfoData, Error>({
    queryKey: ["community-info", communityName],
    initialData,
    queryFn: () => CommunityClientService.getCommunityInfo(communityName),
    enabled: !!communityName,
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId }: { communityId: string }) => {
      return await joinCommunityAction(communityId);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch community info
      queryClient.invalidateQueries({
        queryKey: ["community-info"],
      });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId }: { communityId: string }) => {
      return await leaveCommunityAction(communityId);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch community info
      queryClient.invalidateQueries({
        queryKey: ["community-info"],
      });
    },
  });
};
