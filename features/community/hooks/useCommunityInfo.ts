import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommunityClientService } from "../services/community.client";
import { CommunityInfoData } from "../types";

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
      // In a real implementation, this would call an API to join the community
      // For now, we'll just return a mock response
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/community/join`, {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ communityId }),
      // });
      // return response.json();
      return { success: true, communityId };
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch community info
      queryClient.invalidateQueries({
        queryKey: ["community-info", variables.communityId],
      });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId }: { communityId: string }) => {
      // In a real implementation, this would call an API to leave the community
      // For now, we'll just return a mock response
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/community/leave`, {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ communityId }),
      // });
      // return response.json();
      return { success: true, communityId };
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch community info
      queryClient.invalidateQueries({
        queryKey: ["community-info", variables.communityId],
      });
    },
  });
};
