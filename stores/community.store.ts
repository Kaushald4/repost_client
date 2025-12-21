// Community Store - Manages community state
import { create } from "zustand";
import { Community } from "@/types";
import { CommunityService } from "@/services/community.service";

interface CommunityState {
  communities: Community[];
  joinedCommunities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: string | null;

  fetchCommunities: () => Promise<void>;
  fetchJoinedCommunities: () => Promise<void>;
  fetchCommunityById: (id: string) => Promise<void>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  searchCommunities: (query: string) => Promise<Community[]>;
  createCommunity: (data: Partial<Community>) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [],
  joinedCommunities: [],
  currentCommunity: null,
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      const communities = await CommunityService.getCommunities();
      set({ communities, isLoading: false });
    } catch {
      set({ error: "Failed to fetch communities", isLoading: false });
    }
  },

  fetchJoinedCommunities: async () => {
    try {
      const joinedCommunities = await CommunityService.getJoinedCommunities();
      set({ joinedCommunities });
    } catch {
      set({ error: "Failed to fetch joined communities" });
    }
  },

  fetchCommunityById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const community = await CommunityService.getCommunityById(id);
      set({ currentCommunity: community, isLoading: false });
    } catch {
      set({ error: "Failed to fetch community", isLoading: false });
    }
  },

  joinCommunity: async (communityId: string) => {
    try {
      const updatedCommunity = await CommunityService.joinCommunity(
        communityId
      );
      set((state) => ({
        communities: state.communities.map((c) =>
          c.id === communityId ? updatedCommunity : c
        ),
        currentCommunity:
          state.currentCommunity?.id === communityId
            ? updatedCommunity
            : state.currentCommunity,
      }));
      get().fetchJoinedCommunities();
    } catch {
      set({ error: "Failed to join community" });
    }
  },

  leaveCommunity: async (communityId: string) => {
    try {
      const updatedCommunity = await CommunityService.leaveCommunity(
        communityId
      );
      set((state) => ({
        communities: state.communities.map((c) =>
          c.id === communityId ? updatedCommunity : c
        ),
        currentCommunity:
          state.currentCommunity?.id === communityId
            ? updatedCommunity
            : state.currentCommunity,
      }));
      get().fetchJoinedCommunities();
    } catch {
      set({ error: "Failed to leave community" });
    }
  },

  searchCommunities: async (query: string) => {
    try {
      return await CommunityService.searchCommunities(query);
    } catch {
      set({ error: "Failed to search communities" });
      return [];
    }
  },

  createCommunity: async (data: Partial<Community>) => {
    set({ isLoading: true, error: null });
    try {
      const newCommunity = await CommunityService.createCommunity(data);
      set((state) => ({
        communities: [...state.communities, newCommunity],
        joinedCommunities: [...state.joinedCommunities, newCommunity],
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to create community", isLoading: false });
      throw new Error("Failed to create community");
    }
  },
}));
